import { PlusIcon, Check, X, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabase";

import { CustomButton } from "../components/CustomButton";

// Enhanced Type definitions 
interface Task {
    id: number;
    title: string;
    completed: boolean;
    user_id: string;
    created_at?: string;
    updated_at?: string;
}

interface TodoAppProps {
    maxHeight?: string;
    className?: string;
    showStats?: boolean;
}

export function TodoApp({ 
    maxHeight = "max-h-64", 
    className = "", 
    showStats = true 
}: TodoAppProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [syncing, setSyncing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    // Memoized task stats
    const taskStats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const active = total - completed;
        return { total, completed, active };
    }, [tasks]);

    // Memoized filtered tasks
    const filteredTasks = useMemo(() => {
        switch (filter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    }, [tasks, filter]);

    // Load user ID and tasks on component mount
    useEffect(() => {
        const fetchUserAndTasks = async () => {
            try {
                setLoading(true);
                setError(null);
                
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
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                const loadedTasks = data || [];
                setTasks(loadedTasks);
                
                // Sync with localStorage
                localStorage.setItem('tasks', JSON.stringify(loadedTasks));
                
            } catch (err) {
                setError('Failed to load tasks');
                console.error('Error loading tasks:', err);
                
                // Fallback to localStorage if DB fails
                const localTasks = localStorage.getItem('tasks');
                if (localTasks) {
                    try {
                        const parsedTasks = JSON.parse(localTasks);
                        // Ensure all tasks have user_id
                        const tasksWithUserId = parsedTasks.map((task: Task) => ({
                            ...task,
                            user_id: userId || task.user_id
                        }));
                        setTasks(tasksWithUserId);
                    } catch (parseError) {
                        console.error('Error parsing local tasks:', parseError);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndTasks();
    }, [userId]);

    // Sync tasks with localStorage whenever tasks change
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    const toggleTask = useCallback(async (id: number): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const optimisticUpdate = tasks.map(t => 
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        
        // Optimistic update for immediate UI response
        setTasks(optimisticUpdate);
        setError(null);
        
        try {
            setSyncing(true);
            const { error } = await supabase
                .from('tasks')
                .update({ 
                    completed: !task.completed, 
                    updated_at: new Date().toISOString() 
                })
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
        } catch (err) {
            // Revert on error
            setTasks(tasks);
            setError('Failed to update task');
            console.error('Error updating task:', err);
        } finally {
            setSyncing(false);
        }
    }, [tasks, userId]);

    const addTask = useCallback(async (): Promise<void> => {
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
            user_id: userId,
            created_at: new Date().toISOString()
        };

        // Optimistic update
        const optimisticUpdate = [...tasks, newTaskObj];
        setTasks(optimisticUpdate);
        setNewTask("");
        setError(null);

        try {
            setSyncing(true);
            const { data, error } = await supabase
                .from('tasks')
                .insert([newTaskObj])
                .select();

            if (error) throw error;

            // Update with real ID from database
            if (data && data.length > 0) {
                const dbTask = data[0];
                const finalUpdate = [
                    ...tasks.filter(t => t.id !== tempId),
                    { ...dbTask, created_at: dbTask.created_at || newTaskObj.created_at }
                ];
                setTasks(finalUpdate);
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
    }, [newTask, tasks, userId]);

    const deleteTask = useCallback(async (id: number): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const optimisticUpdate = tasks.filter(task => task.id !== id);
        
        // Optimistic update
        setTasks(optimisticUpdate);
        setError(null);

        try {
            setSyncing(true);
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
        } catch (err) {
            // Revert on error
            setTasks(tasks);
            setError('Failed to delete task');
            console.error('Error deleting task:', err);
        } finally {
            setSyncing(false);
        }
    }, [tasks, userId]);

    const clearCompleted = useCallback(async (): Promise<void> => {
        if (!userId || taskStats.completed === 0) return;

        const completedTaskIds = tasks
            .filter(task => task.completed)
            .map(task => task.id);

        const remainingTasks = tasks.filter(task => !task.completed);
        
        // Optimistic update
        setTasks(remainingTasks);
        setError(null);

        try {
            setSyncing(true);
            const { error } = await supabase
                .from('tasks')
                .delete()
                .in('id', completedTaskIds)
                .eq('user_id', userId);

            if (error) throw error;
            
        } catch (err) {
            // Revert on error
            setTasks(tasks);
            setError('Failed to clear completed tasks');
            console.error('Error clearing completed tasks:', err);
        } finally {
            setSyncing(false);
        }
    }, [tasks, userId, taskStats.completed]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            addTask();
        }
    }, [addTask]);

    const handleFilterChange = useCallback((newFilter: 'all' | 'active' | 'completed') => {
        setFilter(newFilter);
    }, []);

    if (loading) {
        return (
            <div className={`bg-neutral-800 text-white p-4 rounded-lg shadow-lg ${className} flex items-center justify-center py-12 min-h-[200px]`}>
                <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-sm text-gray-300">Loading tasks...</span>
                </div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className={`bg-neutral-800 text-white p-4 rounded-lg shadow-lg ${className} flex items-center justify-center py-12 min-h-[200px]`}>
                <div className="text-center space-y-2">
                    <X className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-300">Please log in to view your tasks.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-neutral-800 text-white rounded-lg shadow-lg w-full overflow-hidden border border-gray-700 ${className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-gray-600 gap-2">
                <div className="flex items-center gap-2 flex-1">
                    <h3 className="text-lg font-bold text-white">Tasks</h3>
                    {syncing && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                </div>
                {showStats && (
                    <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-md">
                        {taskStats.completed}/{taskStats.total} completed
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-4 py-3 mx-4 mt-2 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">{error}</span>
                        <CustomButton 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setError(null)}
                            className="text-red-300 hover:text-red-200 p-1"
                        >
                            <X className="w-4 h-4" />
                        </CustomButton>
                    </div>
                </div>
            )}

            {/* Task Filter */}
            {showStats && (
                <div className="px-4 py-3 bg-gray-700/50 border-b border-gray-600">
                    <div className="flex flex-wrap gap-2">
                        {(['all', 'active', 'completed'] as const).map((filterType) => (
                            <CustomButton
                                key={filterType}
                                variant={filter === filterType ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange(filterType)}
                                className="px-3 py-1 text-xs flex-shrink-0"
                            >
                                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                                {filterType === 'completed' && ` (${taskStats.completed})`}
                            </CustomButton>
                        ))}
                    </div>
                </div>
            )}

            {/* Tasks List */}
            <section className={`overflow-y-auto ${maxHeight}`}>
                <ul className="divide-y divide-gray-600">
                    {filteredTasks.length === 0 ? (
                        <li className="text-center py-12 text-gray-400 flex flex-col items-center justify-center">
                            <Check className="w-12 h-12 mx-auto mb-3 opacity-40" />
                            <p className="text-sm font-medium">No {filter === 'completed' ? 'completed' : 'tasks'} yet</p>
                            {filter === 'all' && (
                                <p className="text-xs mt-1 opacity-75">Add one below to get started!</p>
                            )}
                        </li>
                    ) : (
                        filteredTasks.map((task) => (
                            <li 
                                key={task.id} 
                                className="group flex items-center justify-between py-4 px-4 hover:bg-gray-700/30 transition-colors border-b border-gray-700 last:border-b-0"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {/* Toggle Button */}
                                    <CustomButton
                                        variant={task.completed ? "secondary" : "outline"}
                                        size="sm"
                                        onClick={() => toggleTask(task.id)}
                                        className={`w-6 h-6 p-0 rounded-full border-2 flex-shrink-0 transition-all duration-200 ${
                                            task.completed 
                                                ? 'bg-green-500 border-green-500 hover:bg-green-600' 
                                                : 'border-gray-500 hover:border-primary focus:border-primary'
                                        }`}
                                        disabled={syncing}
                                        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                                    >
                                        {task.completed && (
                                            <Check className="w-3 h-3 text-white" />
                                        )}
                                    </CustomButton>
                                    
                                    {/* Task Text */}
                                    <span 
                                        className={`text-sm transition-all duration-200 min-w-0 flex-1 ${
                                            task.completed 
                                                ? 'line-through text-gray-400' 
                                                : 'text-white'
                                        }`}
                                    >
                                        {task.title}
                                    </span>
                                </div>
                                
                                {/* Delete Button */}
                                <CustomButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 ml-2 text-gray-400 hover:text-red-400 transition-all duration-200"
                                    disabled={syncing}
                                    aria-label="Delete task"
                                >
                                    <X className="w-4 h-4" />
                                </CustomButton>
                            </li>
                        ))
                    )}
                </ul>
            </section>

            {/* Task Input Area */}
            <div className="border-t border-gray-600 p-4 bg-gray-700/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={filteredTasks.length === 0 ? "What needs to be done?" : "+ Add a task"}
                        className="flex-1 py-2.5 px-4 bg-gray-800/50 dark:bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 
                                   focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 
                                   transition-all duration-200 text-sm disabled:opacity-50"
                        disabled={syncing}
                    />
                    <CustomButton 
                        variant="primary" 
                        size="sm"
                        onClick={addTask}
                        disabled={!newTask.trim() || syncing}
                        className="px-4 py-2.5 flex-shrink-0"
                        aria-label="Add task"
                    >
                        <PlusIcon className="w-4 h-4" />
                    </CustomButton>
                </div>
            </div>

            {/* Action Buttons */}
            {showStats && taskStats.completed > 0 && (
                <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-600">
                    <CustomButton
                        variant="outline"
                        size="sm"
                        onClick={clearCompleted}
                        disabled={syncing}
                        className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 w-full justify-start"
                    >
                        Clear completed ({taskStats.completed})
                    </CustomButton>
                </div>
            )}
        </div>
    );
}