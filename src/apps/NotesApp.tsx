import { Plus, ChevronRight, ChevronDown, Edit3, Save, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Adjust path to your Supabase client file

// Type definitions
interface Note {
  id: number;
  title: string;
  content: string;
  user_id: string;
  created_at?: string; // Optional, matches TIMESTAMP WITH TIME ZONE
  updated_at?: string; // Optional, matches TIMESTAMP WITH TIME ZONE
}

export function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [expandedNote, setExpandedNote] = useState<number | null>(null);
    const [editingNote, setEditingNote] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const [editTitle, setEditTitle] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [syncing, setSyncing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Load user ID and notes on component mount
    useEffect(() => {
        const fetchUserAndNotes = async () => {
            try {
                setLoading(true);
                setSyncing(true);
                // Get authenticated user
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    throw new Error('User not authenticated');
                }
                setUserId(user.id);

                // Load notes for the user
                const { data, error } = await supabase
                    .from('notes')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false });

                if (error) throw error;
                setNotes(data || []);
            } catch (err) {
                setError('Failed to load notes');
                console.error('Error loading notes:', err);
                // Fallback to localStorage if DB fails
                const localNotes = localStorage.getItem('notes');
                if (localNotes) {
                    try {
                        setNotes(JSON.parse(localNotes));
                    } catch (parseError) {
                        console.error('Error parsing local notes:', parseError);
                    }
                }
            } finally {
                setLoading(false);
                setSyncing(false);
            }
        };

        fetchUserAndNotes();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const day = date.getDate();
        const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                     day === 2 || day === 22 ? 'nd' : 
                     day === 3 || day === 23 ? 'rd' : 'th';
        const year = date.getFullYear().toString().slice(-2);
        
        return `${dayName}, ${day.toString().padStart(2, '0')}${suffix} '${year}`;
    };

    const addNote = async (): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const tempId = Date.now();
        const newNoteObj: Note = {
            id: tempId,
            title: 'Untitled Note',
            content: '',
            user_id: userId
        };

        // Optimistic update
        const optimisticUpdate = [newNoteObj, ...notes];
        setNotes(optimisticUpdate);
        setExpandedNote(tempId);
        setEditingNote(tempId);
        setEditTitle('Untitled Note');
        setEditContent('');

        try {
            setSyncing(true);
            const { data, error } = await supabase
                .from('notes')
                .insert([newNoteObj])
                .select();

            if (error) throw error;

            // Update with real ID from database
            if (data) {
                const finalUpdate = [...notes.filter(n => n.id !== tempId), ...data];
                setNotes(finalUpdate);
                setExpandedNote(data[0].id);
                setEditingNote(data[0].id);
                // Cache the successful update
                localStorage.setItem('notes', JSON.stringify(finalUpdate));
            }
        } catch (err) {
            // Revert on error
            setNotes(notes);
            setExpandedNote(null);
            setEditingNote(null);
            setError('Failed to add note');
            console.error('Error adding note:', err);
        } finally {
            setSyncing(false);
        }
    };

    const deleteNote = async (id: number): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const optimisticUpdate = notes.filter(note => note.id !== id);
        
        // Optimistic update
        setNotes(optimisticUpdate);
        if (expandedNote === id) setExpandedNote(null);
        if (editingNote === id) setEditingNote(null);

        try {
            setSyncing(true);
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
            // Cache the successful update
            localStorage.setItem('notes', JSON.stringify(optimisticUpdate));
        } catch (err) {
            // Revert on error
            setNotes(notes);
            setError('Failed to delete note');
            console.error('Error deleting note:', err);
        } finally {
            setSyncing(false);
        }
    };

    const saveNote = async (id: number): Promise<void> => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        const updatedNotes = notes.map(note => 
            note.id === id ? { ...note, title: editTitle, content: editContent } : note
        );
        
        // Optimistic update
        setNotes(updatedNotes);
        setEditingNote(null);

        try {
            setSyncing(true);
            const { error } = await supabase
                .from('notes')
                .update({ 
                    title: editTitle, 
                    content: editContent 
                })
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;
            
            // Cache the successful update
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
        } catch (err) {
            // Revert on error
            setNotes(notes);
            setEditingNote(id);
            setError('Failed to save note');
            console.error('Error saving note:', err);
        } finally {
            setSyncing(false);
        }
    };

    const toggleExpand = (id: number) => {
        if (expandedNote === id) {
            setExpandedNote(null);
            setEditingNote(null);
        } else {
            const note = notes.find(n => n.id === id);
            if (note) {
                setExpandedNote(id);
                setEditTitle(note.title);
                setEditContent(note.content);
            }
        }
    };

    const startEditing = (id: number) => {
        const note = notes.find(n => n.id === id);
        if (note) {
            setEditingNote(id);
            setEditTitle(note.title);
            setEditContent(note.content);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full text-xs flex items-center justify-center py-12">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading notes...
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full text-xs flex items-center justify-center py-12">
                Please log in to view your notes.
            </div>
        );
    }

    return (
        <div className="bg-neutral-800 text-white w-full text-xs mt-4">
            <div >
                <div className="p-4 border-b border-gray-600">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold">NOTES</h2>
                        {syncing && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/50 border-b border-red-500 text-red-200 px-4 py-2">
                        {error}
                    </div>
                )}

                <div className="border-b border-neutral-600 bg-neutral-600 px-4 py-2">
                    <div className="grid grid-cols-12 gap-2 items-center text-gray-300 text-xs">
                        <div className="col-span-1">count</div>
                        <div className="col-span-4">title</div>
                        <div className="col-span-2">expand</div>
                        <div className="col-span-4">last modified</div>
                        <div className="col-span-1"></div>
                    </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {notes.map((note, index) => (
                        <div key={note.id}>
                            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 border-b border-gray-600 hover:bg-gray-750">
                                <div className="col-span-1 text-center">{index + 1}</div>
                                <div className="col-span-4 truncate">{note.title}</div>
                                <div className="col-span-2">
                                    <button
                                        onClick={() => toggleExpand(note.id)}
                                        className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                                    >
                                        {expandedNote === note.id ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="col-span-4">
                                    {note.updated_at ? formatDate(note.updated_at) : 'Just now'}
                                </div>
                                <div className="col-span-1 text-center">
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className="hover:text-red-400 transition-colors text-sm"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            
                            {expandedNote === note.id && (
                                <div className="border-b border-gray-600 bg-gray-750 p-4">
                                    {editingNote === note.id ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                                                placeholder="Note title..."
                                            />
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                rows={6}
                                                className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                                                placeholder="Write your note content here..."
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => saveNote(note.id)}
                                                    disabled={syncing}
                                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1"
                                                >
                                                    <Save className="w-3 h-3" />
                                                    {syncing ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={() => setEditingNote(null)}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded flex items-center gap-1"
                                                >
                                                    <X className="w-3 h-3" />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-white font-semibold">{note.title}</h3>
                                                <button
                                                    onClick={() => startEditing(note.id)}
                                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                >
                                                    <Edit3 className="w-3 h-3" />
                                                    Edit
                                                </button>
                                            </div>
                                            <div className="text-gray-300 whitespace-pre-wrap bg-gray-600 p-3 rounded">
                                                {note.content || 'Empty note...'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {notes.length === 0 && (
                        <div className="text-center text-gray-400 py-12">
                            No notes yet. Create your first note!
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-600 bg-gray-750">
                    <button
                        onClick={addNote}
                        disabled={syncing}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 disabled:text-gray-500"
                    >
                        <Plus className="w-4 h-4" />
                        NEW
                    </button>
                </div>
            </div>
        </div>
    );
}