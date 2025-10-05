import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
// import { useAppearance } from "../contexts/appearance-context";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Volume2, 
  Check, 
  X, 
  Loader2, 
} from 'lucide-react';
import { CustomButton } from "../components/CustomButton";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  soundNotifications: boolean;
  marketingEmails: boolean;
}

export function Notifications() {
  const { user } = useAuth();
// const { accentColor } = useAppearance();
  
  const [isLoading, setIsLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [ , setEditing] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    soundNotifications: false,
    marketingEmails: false
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load notification settings
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) throw new Error("User not authenticated");
        setUserId(authUser.id);

        // Fetch from user_settings
        const { data, error: fetchError } = await supabase
          .from("user_settings")
          .select("email_notifications, push_notifications, in_app_notifications, sound_notifications, marketing_emails")
          .eq("user_id", authUser.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        const loadedSettings: NotificationSettings = {
          emailNotifications: data?.email_notifications ?? true,
          pushNotifications: data?.push_notifications ?? true,
          inAppNotifications: data?.in_app_notifications ?? true,
          soundNotifications: data?.sound_notifications ?? false,
          marketingEmails: data?.marketing_emails ?? false
        };

        setSettings(loadedSettings);

        // Fallback to localStorage
        const localEmail = localStorage.getItem('emailNotifications');
        if (localEmail !== null) {
          setSettings(prev => ({ ...prev, emailNotifications: JSON.parse(localEmail) }));
        }

      } catch (error: unknown) {
        setError('Failed to load notification settings.');
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = async (): Promise<void> => {
    if (!userId) {
      setError('User not authenticated.');
      return;
    }

    try {
      setSyncing(true);
      setError(null);
      setEditing(false);

      // Update in Supabase
      const { error: upsertError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          email_notifications: settings.emailNotifications,
          push_notifications: settings.pushNotifications,
          in_app_notifications: settings.inAppNotifications,
          sound_notifications: settings.soundNotifications,
          marketing_emails: settings.marketingEmails,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (upsertError) throw upsertError;

      // Cache in localStorage
      localStorage.setItem('emailNotifications', JSON.stringify(settings.emailNotifications));

      setSuccessMessage('Notification preferences updated!');
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error: unknown) {
      setError('Failed to save preferences. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setSyncing(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse min-h-[400px]">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
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
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-xl">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize how you receive updates and alerts
            </p>
          </div>
        </div>
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

      {/* Settings Form */}
      <div className="bg-card rounded-xl p-6 border border-border space-y-6">
        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Email Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive important updates and alerts via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Push Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get instant alerts on your device</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* In-App Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">In-App Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Show notifications within the dashboard</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.inAppNotifications}
                onChange={() => handleToggle('inAppNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Sound Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Volume2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Sound Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Play sounds for new notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundNotifications}
                onChange={() => handleToggle('soundNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Marketing Emails</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive product updates and promotions</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={() => handleToggle('marketingEmails')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <CustomButton
            variant="primary"
            size="md"
            onClick={handleSaveSettings}
            disabled={syncing || !userId}
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
                Save Preferences
              </>
            )}
          </CustomButton>
        </div>
      </div>
    </div>
  );
}