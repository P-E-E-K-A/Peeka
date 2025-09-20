import { useAuth } from "../contexts/AuthContext";
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function SettingsProfile() {
    const { user } = useAuth();
    const [showProfileData, setShowProfileData] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [bio, setBio] = useState("");
    const [fullName, setFullName] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setIsInitialLoading(false);
            return;
        }

        const fetchProfileData = async () => {
            try {
                setError(null);
                setIsInitialLoading(true);
                
                // get authenticated user
                const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
                if (authError || !authUser) {
                    throw new Error("User not authenticated");
                }
                setUserId(authUser.id);
                setUserEmail(authUser.email ?? null);

                // fetch profile data
                const { data, error: fetchError } = await supabase
                    .from("profiles")
                    .select("about, full_name, email")
                    .eq("id", authUser.id)
                    .single();

                if (fetchError && fetchError.code !== 'PGRST116') {
                    throw fetchError;
                }
                
                setBio(data?.about || "");
                setFullName(data?.full_name || "");
                
            } catch (error: unknown) {
                setError('Failed to fetch profile data.');
                console.error('Error fetching profile data:', error);
                
                // Fallback to localStorage if DB fails
                const localBio = localStorage.getItem('userBio');
                const localFullName = localStorage.getItem('userFullName');
                
                if (localBio) {
                    try {
                        setBio(JSON.parse(localBio));
                    } catch (parseError) {
                        console.error('Error parsing localStorage bio:', parseError);
                    }
                }
                
                if (localFullName) {
                    try {
                        setFullName(JSON.parse(localFullName));
                    } catch (parseError) {
                        console.error('Error parsing localStorage fullName:', parseError);
                    }
                }
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchProfileData();
    }, [user]);

    const handleSaveProfile = async (): Promise<void> => {
        if (!userId || !userEmail) {
            setError('User not authenticated or missing email.');
            return;
        }
        
        try {
            setSyncing(true);
            setError(null);
            setSuccessMessage(null);
            
            // Update profile in Supabase (upsert in case profile doesn't exist)
            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({ 
                    id: userId,
                    email: userEmail,
                    about: bio,
                    full_name: fullName,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();
            
            if (upsertError) {
                console.error('Supabase error details:', upsertError);
                throw upsertError;
            }

            // Cache the successful updates in localStorage
            localStorage.setItem('userBio', JSON.stringify(bio));
            localStorage.setItem('userFullName', JSON.stringify(fullName));
            
            setSuccessMessage('Profile updated successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
            
        } catch (error: unknown) {
            console.error('Error updating profile:', error);
            
            // Provide more specific error messages
            if (error instanceof Error) {
                if (error.message.includes('duplicate key value')) {
                    setError('Email already exists. Please contact support.');
                } else {
                    setError(`Failed to update profile: ${error.message}`);
                }
            } else {
                setError('Failed to update profile. Please try again.');
            }
        } finally {
            setSyncing(false);
        }
    };

    const toggleProfileData = () => {
        if (!user) {
            setError("User not authenticated");
            console.error("User not authenticated");
            return;
        }
        setShowProfileData(!showProfileData);
    };

    const clearMessages = () => {
        setError(null);
        setSuccessMessage(null);
    };

    // Show loading only during initial load
    if (isInitialLoading) {
        return (
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                <div className="animate-pulse space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                <button
                    onClick={toggleProfileData}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {showProfileData ? 'Hide' : 'Show'} Profile Data
                </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md flex justify-between items-center">
                    <span>{error}</span>
                    <button
                        onClick={clearMessages}
                        className="text-red-500 hover:text-red-700 ml-2"
                    >
                        ×
                    </button>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md flex justify-between items-center">
                    <span>{successMessage}</span>
                    <button
                        onClick={clearMessages}
                        className="text-green-500 hover:text-green-700 ml-2"
                    >
                        ×
                    </button>
                </div>
            )}

            {showProfileData && (
                <div className={`space-y-4 transition-opacity duration-300 ${syncing ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                placeholder="Your email"
                                title="Email (cannot be changed)"
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bio
                        </label>
                        <textarea
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSaveProfile}
                            disabled={syncing || !userId || !userEmail}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            {syncing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}