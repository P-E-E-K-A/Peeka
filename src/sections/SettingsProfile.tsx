import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { AddOns } from "./AddOns";

// import { useAppearance } from "../contexts/appearance-context";
import { 
  User, 
  Mail, 
  Edit3, 
  X, 
  Loader2, 
  Camera, 
  Upload,
  Eye,
  Check,
  Package
} from 'lucide-react';
import { CustomButton } from "../components/CustomButton";

interface ProfileData {
  fullName: string;
  bio: string;
  avatarUrl?: string;
  email: string;
}

export function SettingsProfile() {
  const { user, loading: authLoading } = useAuth(); // ✅ Get auth loading state
  // const { accentColor } = useAppearance();
  
  const [showProfileData, setShowProfileData] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Single loading state for both auth and profile
  const [isLoading, setIsLoading] = useState(true); // ✅ Single state
  
  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    bio: "",
    avatarUrl: "",
    email: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ✅ Single useEffect that handles both auth and profile loading
  useEffect(() => {
    const fetchProfileData = async () => {
      // If auth is still loading, keep showing loading
      if (authLoading) {
        return;
      }

      // If no user, stop loading
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        
        // Get authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
          throw new Error("User not authenticated");
        }
        setUserId(authUser.id);
        setUserEmail(authUser.email ?? null);

        // Fetch profile data
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("about, full_name, email, avatar_url")
          .eq("id", authUser.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }
        
        const profile: ProfileData = {
          fullName: data?.full_name || "",
          bio: data?.about || "",
          avatarUrl: data?.avatar_url || "",
          email: authUser.email || ""
        };
        
        setProfileData(profile);
        setAvatarPreview(data?.avatar_url || null);
        
        // Load from localStorage as fallback
        const localBio = localStorage.getItem('userBio');
        const localFullName = localStorage.getItem('userFullName');
        
        if (localBio && !profile.bio) {
          try {
            setProfileData(prev => ({ ...prev, bio: JSON.parse(localBio) }));
          } catch (parseError) {
            console.error('Error parsing localStorage bio:', parseError);
          }
        }
        
        if (localFullName && !profile.fullName) {
          try {
            setProfileData(prev => ({ ...prev, fullName: JSON.parse(localFullName) }));
          } catch (parseError) {
            console.error('Error parsing localStorage fullName:', parseError);
          }
        }
        
      } catch (error: unknown) {
        setError('Failed to fetch profile data.');
        console.error('Error fetching profile data:', error);
      } finally {
        // ✅ Only stop loading when everything is done
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, authLoading]); // ✅ Depend on both user and authLoading

  // Handle avatar preview
  useEffect(() => {
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(avatarFile);
    }
  }, [avatarFile]);

  // Rest of your component stays the same...
  const handleAvatarUpload = async (file: File): Promise<void> => {
    if (!userId || !file) return;

    try {
      setSyncing(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      setProfileData(prev => ({ ...prev, avatarUrl: publicUrl }));
      setAvatarPreview(publicUrl);
      setAvatarFile(null);

      setSuccessMessage('Profile picture updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error: unknown) {
      setError('Failed to upload profile picture.');
      console.error('Error uploading avatar:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveProfile = async (): Promise<void> => {
    if (!userId || !userEmail) {
      setError('User not authenticated or missing email.');
      return;
    }
    
    try {
      setSyncing(true);
      setError(null);
      setEditing(false);
      setSuccessMessage(null);
      
      interface ProfileUpdate {
        id: string;
        email: string;
        full_name: string;
        about: string;
        avatar_url?: string;
        updated_at: string;
      }
      
      const updateData: ProfileUpdate = { 
        id: userId,
        email: userEmail,
        full_name: profileData.fullName.trim(),
        about: profileData.bio.trim(),
        ...(avatarPreview && { avatar_url: avatarPreview }),
        updated_at: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(updateData)
        .select()
        .single();
      
      if (upsertError) {
        console.error('Supabase error details:', upsertError);
        throw upsertError;
      }

      localStorage.setItem('userBio', JSON.stringify(profileData.bio.trim()));
      localStorage.setItem('userFullName', JSON.stringify(profileData.fullName.trim()));
      
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      
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
      return;
    }
    setShowProfileData(!showProfileData);
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Single loading condition
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse min-h-[400px]">
        <div className="flex items-center justify-between h-12">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-primary/10 dark:bg-primary/20 rounded-xl`}>
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your personal details and preferences
            </p>
          </div>
        </div>
        <CustomButton
          variant="ghost"
          size="sm"
          onClick={toggleProfileData}
          className="flex items-center gap-2"
        >
          <Eye className={`w-4 h-4 ${showProfileData ? 'text-primary' : 'text-gray-400'}`} />
          {showProfileData ? 'Hide' : 'Show'} details
        </CustomButton>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <CustomButton 
            variant="ghost" 
            size="sm"
            onClick={clearMessages}
            className="text-destructive hover:text-destructive/80 p-1"
          >
            <X className="w-4 h-4" />
          </CustomButton>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm">{successMessage}</span>
          <CustomButton 
            variant="ghost" 
            size="sm"
            onClick={clearMessages}
            className="text-green-500 hover:text-green-600 p-1"
          >
            <X className="w-4 h-4" />
          </CustomButton>
        </div>
      )}

      {/* Profile Content */}
      {showProfileData && (
        <div className={`space-y-8 transition-all duration-300 ${syncing ? 'opacity-75' : 'opacity-100'}`}>
          {/* Avatar Section */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg relative">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Profile picture"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  
                  {/* Edit Avatar Button */}
                  {editing && (
                    <label className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border-2 border-white dark:border-gray-800 hover:shadow-xl transition-all cursor-pointer group-hover:scale-110">
                      <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.size < 5 * 1024 * 1024) { // 5MB limit
                            setAvatarFile(file);
                          } else if (file) {
                            setError('File too large. Please select an image under 5MB.');
                          }
                        }}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
                
                {/* Avatar Upload Progress */}
                {avatarFile && (
                  <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                )}
              </div>

              {/* Upload Button (when editing) */}
              {editing && avatarFile && (
                <CustomButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleAvatarUpload(avatarFile)}
                  disabled={syncing}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Save Photo
                </CustomButton>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-card rounded-xl p-6 border border-border space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    placeholder="Your email"
                    className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 cursor-not-allowed focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Email cannot be changed. Contact support for changes.
                </p>
              </div>

              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  disabled={!editing}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 border ${
                    editing 
                      ? 'border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white cursor-not-allowed'
                  }`}
                />
                {editing && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This will be displayed on your profile
                  </p>
                )}
              </div>
            </div>

            {/* Bio Field */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary" />
                Bio
              </label>
              <div className={`relative rounded-lg border transition-all duration-200 ${
                editing 
                  ? 'border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                <textarea
                  rows={editing ? 5 : 3}
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself in 160 characters or less..."
                  disabled={!editing}
                  maxLength={160}
                  className={`w-full px-4 py-3 resize-none rounded-lg transition-all duration-200 ${
                    editing 
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed'
                  }`}
                />
                {!editing && profileData.bio && (
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                    {profileData.bio.length}/160
                  </div>
                )}
              </div>
              {editing && (
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {profileData.bio.length}/160 characters
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    profileData.bio.length > 140 
                      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' 
                      : 'text-primary bg-primary/10 dark:bg-primary/20'
                  }`}>
                    {Math.round((profileData.bio.length / 160) * 100)}%
                  </span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              {editing ? (
                <>
                  <CustomButton
                    variant="primary"
                    size="md"
                    onClick={handleSaveProfile}
                    disabled={syncing || !userId || !userEmail}
                    className="flex-1"
                  >
                    {syncing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </CustomButton>
                  <CustomButton
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setEditing(false);
                      setAvatarFile(null);
                      setAvatarPreview(profileData.avatarUrl || null);
                    }}
                    disabled={syncing}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </CustomButton>
                </>
              ) : (
                <CustomButton
                  variant="outline"
                  size="md"
                  onClick={() => setEditing(true)}
                  className="w-full sm:w-auto self-start"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </CustomButton>
              )}
            </div>
          </div>

          {/* Addons Section */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 bg-primary/10 dark:bg-primary/20 rounded-xl`}>
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Addons</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enhance your experience with additional features
                </p>
              </div>
            </div>
            <AddOns />
          </div>
        </div>
      )}
    </div>
  );
}