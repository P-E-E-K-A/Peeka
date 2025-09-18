import { Plus, Check, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Adjust path to your Supabase client file

// Type definitions
interface Habit {
  id: number;
  text: string;
  completed: boolean;
  user_id: string;
  created_at?: string; // Optional, matches TIMESTAMP WITH TIME ZONE
  updated_at?: string; // Optional, matches TIMESTAMP WITH TIME ZONE
}

export default function SupabaseHabitTracker() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newHabit, setNewHabit] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [syncing, setSyncing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Load user ID and habits on component mount
    useEffect(() => {
        const fetchUserAndHabits = async () => {
            try {
                setLoading(true);
                setSyncing(true);
                // Get authenticated user
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    throw new Error('User not authenticated');
                }
                setUserId(user.id);

                // Load habits for the user
                const { data, error } = await supabase
                    .from('habits')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) throw error;
                setHabits(data || []);
            } catch (err) {
                setError('Failed to load habits');
                console.error('Error loading habits:', err);
                // Fallback to localStorage if DB fails
                const localHabits = localStorage.getItem('habits');
                if (localHabits) {
                    try {
                        setHabits(JSON.parse(localHabits));
                    } catch (parseError) {
                        console.error('Error parsing local habits:', parseError);
                    }
                }
            } finally {
                setLoading(false);
                setSyncing(false);
            }
        };

        fetchUserAndHabits();
    }, []);

    const toggleHabit = async (id: number): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const optimisticUpdate = habits.map(habit => 
            habit.id === id ? { ...habit, completed: !habit.completed } : habit
        );
        
        // Optimistic update for immediate UI response
        setHabits(optimisticUpdate);
        
        try {
            setSyncing(true);
            const habit = habits.find(h => h.id === id);
            if (!habit) return;

            const { error } = await supabase
                .from('habits')
                .update({ completed: !habit.completed, updated_at: new Date().toISOString() })
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
            // Cache the successful update
            localStorage.setItem('habits', JSON.stringify(optimisticUpdate));
        } catch (err) {
            // Revert on error
            setHabits(habits);
            setError('Failed to update habit');
            console.error('Error updating habit:', err);
        } finally {
            setSyncing(false);
        }
    };

    const addHabit = async (): Promise<void> => {
        if (!newHabit.trim()) return;
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const tempId = Date.now();
        const newHabitObj: Habit = {
            id: tempId,
            text: newHabit.trim(),
            completed: false,
            user_id: userId
        };

        // Optimistic update
        const optimisticUpdate = [...habits, newHabitObj];
        setHabits(optimisticUpdate);
        setNewHabit("");

        try {
            setSyncing(true);
            const { data, error } = await supabase
                .from('habits')
                .insert([newHabitObj])
                .select();

            if (error) throw error;

            // Update with real ID from database
            if (data) {
                const finalUpdate = [...habits.filter(h => h.id !== tempId), ...data];
                setHabits(finalUpdate);
                localStorage.setItem('habits', JSON.stringify(finalUpdate));
            }
        } catch (err) {
            // Revert on error
            setHabits(habits);
            setNewHabit(newHabitObj.text);
            setError('Failed to add habit');
            console.error('Error adding habit:', err);
        } finally {
            setSyncing(false);
        }
    };

    const deleteHabit = async (id: number): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const optimisticUpdate = habits.filter(habit => habit.id !== id);
        
        // Optimistic update
        setHabits(optimisticUpdate);

        try {
            setSyncing(true);
            const { error } = await supabase
                .from('habits')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
            localStorage.setItem('habits', JSON.stringify(optimisticUpdate));
        } catch (err) {
            // Revert on error
            setHabits(habits);
            setError('Failed to delete habit');
            console.error('Error deleting habit:', err);
        } finally {
            setSyncing(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            addHabit();
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg min-w-80 max-w-md flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading habits...
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg min-w-80 max-w-md flex items-center justify-center py-12">
                Please log in to view your habits.
            </div>
        );
    }

    return (
        <div className="bg-neutral-800 text-white p-4 w-full">
            <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">Habits</h3>
                    {syncing && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                </div>
                <div className="text-sm text-gray-400">
                    {habits.filter(h => h.completed).length}/{habits.length} completed
                </div>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 rounded mb-4 text-sm">
                    {error}
                </div>
            )}
            
            <section className="overflow-y-auto max-h-64 mb-4">
                <ul className="space-y-1">
                    {habits.map((habit) => (
                        <li key={habit.id} className="group flex items-center justify-between bg-neutral-800 hover:bg-neutral-600 transition-colors duration-200 px-3 py-2 rounded">
                            <div className="flex items-center gap-3 flex-1">
                                <button
                                    onClick={() => toggleHabit(habit.id)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                        habit.completed
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-gray-400 hover:border-gray-300'
                                    }`}
                                >
                                    {habit.completed && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <span className={`text-sm ${
                                    habit.completed 
                                        ? 'line-through text-gray-400' 
                                        : 'text-white'
                                }`}>
                                    {habit.text}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteHabit(habit.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200 p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>
                {habits.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        No habits yet. Add one below!
                    </div>
                )}
            </section>
            
            <footer className="flex gap-2">
                <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="+ New"
                    className="flex w-full bg-neutral-800 text-white placeholder-neutral-400 px-3 py-2  focus:border-blue-500 focus:outline-none transition-colors duration-200"
                />
                <button
                    onClick={addHabit}
                    disabled={!newHabit.trim() || syncing}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-full transition-colors duration-200 flex items-center justify-center"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </footer>
        </div>
    );
}