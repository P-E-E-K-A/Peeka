import { PlusIcon, Check, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Adjust path to your Supabase client file

// Type definitions
interface Schedule {
  id: number;
  text: string;
  completed: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export function Scheduler() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [newSchedule, setNewSchedule] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [syncing, setSyncing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Load user ID and schedules on component mount
    useEffect(() => {
        const fetchUserAndSchedules = async () => {
            try {
                setLoading(true);
                setSyncing(true);
                // Get authenticated user
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    throw new Error('User not authenticated');
                }
                setUserId(user.id);

                // Load schedules for the user
                const { data, error } = await supabase
                    .from('schedules')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) throw error;
                setSchedules(data || []);
            } catch (err) {
                setError('Failed to load schedules');
                console.error('Error loading schedules:', err);
                // Fallback to localStorage if DB fails
                const localSchedules = localStorage.getItem('schedules');
                if (localSchedules) {
                    try {
                        setSchedules(JSON.parse(localSchedules));
                    } catch (parseError) {
                        console.error('Error parsing local schedules:', parseError);
                    }
                }
            } finally {
                setLoading(false);
                setSyncing(false);
            }
        };

        fetchUserAndSchedules();
    }, []);

    const toggleSchedule = async (id: number): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const optimisticUpdate = schedules.map(schedule => 
            schedule.id === id ? { ...schedule, completed: !schedule.completed } : schedule
        );
        
        // Optimistic update for immediate UI response
        setSchedules(optimisticUpdate);
        
        try {
            setSyncing(true);
            const schedule = schedules.find(s => s.id === id);
            if (!schedule) return;

            const { error } = await supabase
                .from('schedules')
                .update({ completed: !schedule.completed, updated_at: new Date().toISOString() })
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
            // Cache the successful update
            localStorage.setItem('schedules', JSON.stringify(optimisticUpdate));
        } catch (err) {
            // Revert on error
            setSchedules(schedules);
            setError('Failed to update schedule');
            console.error('Error updating schedule:', err);
        } finally {
            setSyncing(false);
        }
    };

    const addSchedule = async (): Promise<void> => {
        if (!newSchedule.trim()) return;
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const tempId = Date.now();
        const newScheduleObj: Schedule = {
            id: tempId,
            text: newSchedule.trim(),
            completed: false,
            user_id: userId
        };

        // Optimistic update
        const optimisticUpdate = [...schedules, newScheduleObj];
        setSchedules(optimisticUpdate);
        setNewSchedule("");

        try {
            setSyncing(true);
            const { data, error } = await supabase
                .from('schedules')
                .insert([newScheduleObj])
                .select();

            if (error) throw error;

            // Update with real ID from database
            if (data) {
                const finalUpdate = [...schedules.filter(s => s.id !== tempId), ...data];
                setSchedules(finalUpdate);
                localStorage.setItem('schedules', JSON.stringify(finalUpdate));
            }
        } catch (err) {
            // Revert on error
            setSchedules(schedules);
            setNewSchedule(newScheduleObj.text);
            setError('Failed to add schedule');
            console.error('Error adding schedule:', err);
        } finally {
            setSyncing(false);
        }
    };

    const deleteSchedule = async (id: number): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const optimisticUpdate = schedules.filter(schedule => schedule.id !== id);
        
        // Optimistic update
        setSchedules(optimisticUpdate);

        try {
            setSyncing(true);
            const { error } = await supabase
                .from('schedules')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
            localStorage.setItem('schedules', JSON.stringify(optimisticUpdate));
        } catch (err) {
            // Revert on error
            setSchedules(schedules);
            setError('Failed to delete schedule');
            console.error('Error deleting schedule:', err);
        } finally {
            setSyncing(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            addSchedule();
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-64 text-xs flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading schedules...
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-64 text-xs flex items-center justify-center py-12">
                Please log in to view your schedules.
            </div>
        );
    }

    return (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-64 text-xs">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">Schedule</h3>
                    {syncing && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                </div>
                <div>
                    {schedules.filter(s => s.completed).length}/{schedules.length} completed
                </div>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 rounded mb-4">
                    {error}
                </div>
            )}
            
            <section className="overflow-y-auto max-h-48 mb-4">
                <ul>
                    {schedules.map((schedule) => (
                        <li key={schedule.id} className="group flex border-b border-gray-300 py-2 justify-between px-2 items-center">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleSchedule(schedule.id)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                        schedule.completed
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-gray-400 hover:border-gray-300'
                                    }`}
                                >
                                    {schedule.completed && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <span className={schedule.completed ? 'line-through text-gray-400' : ''}>
                                    {schedule.text}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteSchedule(schedule.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                    {schedules.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                            No schedules yet. Add one below!
                        </div>
                    )}
                </ul>
            </section>
            
            <footer className="flex mt-2 px-2 justify-between gap-2">
                <input
                    type="text"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new schedule"
                    className="py-1 px-4 w-full bg-gray-700 text-white placeholder-gray-400 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                    onClick={addSchedule}
                    disabled={!newSchedule.trim() || syncing}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-1 py-1 rounded-full flex items-center justify-center"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </footer>
        </div>
    );
}