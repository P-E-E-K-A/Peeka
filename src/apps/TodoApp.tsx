import { PlusIcon, Check, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// Type definitions 
interface Task {
    id: number;
    title: string;
    completed: boolean;
    user_id: string;
    created_at?: string;
    updated_at?: string;
}

export function TodoApp() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [syncing, setSyncing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Load user ID and tasks on component mount
    useEffect(() => {
        const fetchUserAndTasks = async () => {
            try {
                setLoading(true);
                setSyncing(true);
                // Get authenticated user
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    throw new Error('User not authenticated');
                }
                setUserId(user.id);

                // Load tasks for the user
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) throw error;
                setTasks(data || []);
            } catch (err) {
                setError('Failed to load tasks');
                console.error('Error loading tasks:', err);
                // Fallback to localStorage if DB fails
                const localTasks = localStorage.getItem('tasks');
                if (localTasks) {
                    try {
                        setTasks(JSON.parse(localTasks));
                    } catch (parseError) {
                        console.error('Error parsing local tasks:', parseError);
                    }
                }
            } finally {
                setLoading(false);
                setSyncing(false);
            }
        };

        fetchUserAndTasks();
    }, []);

    const toggleTask = async (id: number): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const optimisticUpdate = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        
        // Optimistic update for immediate UI response
        setTasks(optimisticUpdate);
        
        try {
            setSyncing(true);
            const task = tasks.find(t => t.id === id);
            if (!task) return;

            const { error } = await supabase
                .from('tasks')
                .update({ completed: !task.completed, updated_at: new Date().toISOString() })
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
            // Cache the successful update
            localStorage.setItem('tasks', JSON.stringify(optimisticUpdate));
        } catch (err) {
            // Revert on error
            setTasks(tasks);
            setError('Failed to update task');
            console.error('Error updating task:', err);
        } finally {
            setSyncing(false);
        }
    };

    const addTask = async (): Promise<void> => {
        if (!newTask.trim()) return;
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const tempId = Date.now();
        const newTaskObj: Task = {
            id: tempId,
            title: newTask.trim(),
            completed: false,
            user_id: userId
        };

        // Optimistic update
        const optimisticUpdate = [...tasks, newTaskObj];
        setTasks(optimisticUpdate);
        setNewTask("");

        try {
            setSyncing(true);
            const { data, error } = await supabase
                .from('tasks')
                .insert([newTaskObj])
                .select();

            if (error) throw error;

            // Update with real ID from database
            if (data) {
                const finalUpdate = [...tasks.filter(t => t.id !== tempId), ...data];
                setTasks(finalUpdate);
                localStorage.setItem('tasks', JSON.stringify(finalUpdate));
            }
        } catch (err) {
            // Revert on error
            setTasks(tasks);
            setNewTask(newTaskObj.title);
            setError('Failed to add task');
            console.error('Error adding task:', err);
        } finally {
            setSyncing(false);
        }
    };

    const deleteTask = async (id: number): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const optimisticUpdate = tasks.filter(task => task.id !== id);
        
        // Optimistic update
        setTasks(optimisticUpdate);

        try {
            setSyncing(true);
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
            localStorage.setItem('tasks', JSON.stringify(optimisticUpdate));
        } catch (err) {
            // Revert on error
            setTasks(tasks);
            setError('Failed to delete task');
            console.error('Error deleting task:', err);
        } finally {
            setSyncing(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    if (loading) {
        return (
            <div className="bg-neutral-800 text-white p-4 rounded-lg shadow-lg max-w-64 text-xs flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading tasks...
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="bg-neutral-800 text-white p-4 rounded-lg shadow-lg max-w-64 text-xs flex items-center justify-center py-12">
                Please log in to view your tasks.
            </div>
        );
    }

    return (
        <div className="bg-neutral-800 text-white p-4 w-full text-xs">
            <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-2">
                <div className="flex items-center gap-2 ">
                    <h3 className="text-xl font-bold">Tasks</h3> 
                    {syncing && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                </div>
                <div>
                    {tasks.filter(t => t.completed).length}/{tasks.length} completed
                </div>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 rounded mb-4">
                    {error}
                </div>
            )}
            
            <section className="overflow-y-auto max-h-48 mb-4">
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id} className="group flex border-b border-gray-300 py-2 justify-between px-2 items-center">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                        task.completed
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-gray-400 hover:border-gray-300'
                                    }`}
                                >
                                    {task.completed && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <span className={task.completed ? 'line-through text-gray-400' : ''}>
                                    {task.title}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                            No tasks yet. Add one below!
                        </div>
                    )}
                </ul>
            </section>
            
            <footer className="flex mt-2 px-2 justify-between gap-2">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="+ New"
                    className="py-1 px-4 w-full bg-neutral-800 text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
                />
                <button
                    onClick={addTask}
                    disabled={!newTask.trim() || syncing}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-1 py-1 rounded-full flex items-center justify-center"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </footer>
        </div>
    );
}