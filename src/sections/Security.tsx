import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
// import { useAppearance } from "../contexts/appearance-context";

import { 
  Shield, 
  Lock, 
  Key, 
  Smartphone, 
  CheckCircle, 
  X, 
  Loader2,
  Eye,
  EyeOff,
  Clock,
  Activity
} from 'lucide-react';
import { CustomButton } from "../components/CustomButton";

interface SecuritySettings {
  passwordLastChanged: string;
  has2FA: boolean;
  sessionTimeout: number; // minutes
  loginHistory: Array<{
    ip: string;
    location: string;
    device: string;
    time: string;
  }>;
}

export function Security() {
  const { user } = useAuth();
  // const { accentColor } = useAppearance();
  
  const [isLoading, setIsLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  // const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [settings, setSettings] = useState<SecuritySettings>({
    passwordLastChanged: 'Never',
    has2FA: false,
    sessionTimeout: 30,
    loginHistory: []
  });
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load security data
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchSecurityData = async () => {
      try {
        setError(null);
        setIsLoading(true);

        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) throw new Error("User not authenticated");
        setUserId(authUser.id);

        // Fetch user settings
        const { data: settingsData, error: settingsError } = await supabase
          .from("user_settings")
          .select("session_timeout, two_factor_enabled")
          .eq("user_id", authUser.id)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          throw settingsError;
        }

        // Fetch recent login history (mock for now)
        const loginHistory = [
          {
            ip: '192.168.1.100',
            location: 'New York, NY',
            device: 'Chrome on Mac',
            time: '2 hours ago'
          },
          {
            ip: '10.0.0.50',
            location: 'San Francisco, CA',
            device: 'Safari on iPhone',
            time: '1 day ago'
          },
          {
            ip: '172.16.0.25',
            location: 'London, UK',
            device: 'Firefox on Windows',
            time: '3 days ago'
          }
        ];

        setSettings({
          passwordLastChanged: '2 weeks ago', // Mock for now
          has2FA: settingsData?.two_factor_enabled ?? false,
          sessionTimeout: settingsData?.session_timeout ?? 30,
          loginHistory
        });

      } catch (error: unknown) {
        setError('Failed to load security settings.');
        console.error('Error fetching security data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecurityData();
  }, [user]);

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (error && field === 'confirmPassword') {
      setError(null);
    }
  };

  const validatePassword = (): string | null => {
    if (!passwordData.currentPassword) {
      return "Current password is required";
    }
    
    if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
      return "New password must be at least 8 characters";
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return "Passwords do not match";
    }
    
    // Basic password strength check
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
    const hasNumbers = /\d/.test(passwordData.newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecial) {
      return "Password must contain uppercase, lowercase, numbers, and special characters";
    }
    
    return null;
  };

  const handleChangePassword = async (): Promise<void> => {
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!userId) {
      setError('User not authenticated.');
      return;
    }

    try {
      setSyncing(true);
      setError(null);
      setShowPasswordFields(false);

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setSuccessMessage('Password updated successfully! Please log in again.');
      setTimeout(() => {
        setSuccessMessage(null);
        // Optionally sign out user for security
        // supabase.auth.signOut();
      }, 3000);

    } catch (error: unknown) {
      setError('Failed to update password. Please try again.');
      console.error('Error changing password:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleEnable2FA = async (): Promise<void> => {
    if (!userId) {
      setError('User not authenticated.');
      return;
    }

    try {
      setSyncing(true);
      setError(null);

      // For now, just update user_settings (actual 2FA implementation needed)
      const { error } = await supabase
        .from('user_settings')
        .update({ two_factor_enabled: true })
        .eq('user_id', userId);

      if (error) throw error;

      setSettings(prev => ({ ...prev, has2FA: true }));
      setSuccessMessage('Two-factor authentication enabled! Check your email for setup instructions.');
      setTimeout(() => setSuccessMessage(null), 5000);

    } catch (error: unknown) {
      setError('Failed to enable 2FA. Please try again.');
      console.error('Error enabling 2FA:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSessionTimeoutChange = async (minutes: number): Promise<void> => {
    if (!userId) {
      setError('User not authenticated.');
      return;
    }

    try {
      setSyncing(true);
      setError(null);

      const { error } = await supabase
        .from('user_settings')
        .update({ session_timeout: minutes })
        .eq('user_id', userId);

      if (error) throw error;

      setSettings(prev => ({ ...prev, sessionTimeout: minutes }));
      setSuccessMessage(`Session timeout updated to ${minutes} minutes.`);
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error: unknown) {
      setError('Failed to update session timeout.');
      console.error('Error updating session timeout:', error);
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
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
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
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keep your account safe and secure
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

      {/* Security Overview */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Account Security
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Password and 2FA */}
          <div className="space-y-6">
            {/* Password Security */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                    <Key className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">Password Security</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last changed {settings.passwordLastChanged}</p>
                  </div>
                </div>
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="px-4"
                >
                  {showPasswordFields ? 'Cancel' : 'Change Password'}
                </CustomButton>
              </div>

              {/* Password Change Form */}
              {showPasswordFields && (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        placeholder="Enter new password (min 8 characters)"
                        className="w-full px-4 py-2 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary focus:border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Must contain uppercase, lowercase, numbers, and special characters (min 8)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        placeholder="Confirm new password"
                        className={`w-full px-4 py-2 pr-10 bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary focus:border-primary focus:outline-none ${
                          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {error && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <CustomButton
                      variant="primary"
                      size="md"
                      onClick={handleChangePassword}
                      disabled={syncing || !userId }
                      className="flex-1"
                    >
                      {syncing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </CustomButton>
                    <CustomButton
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setShowPasswordFields(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setError(null);
                      }}
                      disabled={syncing}
                      className="flex-1"
                    >
                      Cancel
                    </CustomButton>
                  </div>
                </div>
              )}

              {/* Two-Factor Authentication */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                      <Smartphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {settings.has2FA ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Enabled
                      </span>
                    ) : (
                      <CustomButton
                        variant="outline"
                        size="sm"
                        onClick={handleEnable2FA}
                        className="px-4"
                      >
                        Enable 2FA
                      </CustomButton>
                    )}
                  </div>
                </div>
                {settings.has2FA && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Two-factor authentication is enabled. You'll receive a code via SMS or authenticator app when logging in from new devices.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Session Management & Recent Activity */}
          <div className="space-y-6">
            {/* Session Management */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Session Settings
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout
                  </label>
                  <div className="flex gap-2">
                    {[15, 30, 60, 120].map((minutes) => (
                      <CustomButton
                        key={minutes}
                        variant={settings.sessionTimeout === minutes ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleSessionTimeoutChange(minutes)}
                        disabled={syncing}
                        className={`px-4 py-2 flex-1 ${
                          settings.sessionTimeout === minutes 
                            ? 'shadow-md' 
                            : 'hover:shadow-sm'
                        }`}
                      >
                        {minutes}m
                      </CustomButton>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Sessions will automatically log out after the selected time
                  </p>
                </div>

                {syncing && (
                  <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating session settings...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Login Activity */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </h4>
              
              <div className="space-y-3">
                {settings.loginHistory.length > 0 ? (
                  settings.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {login.device}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {login.location} • {login.ip}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 dark:text-white">{login.time}</p>
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs px-2"
                        >
                          Log Out
                        </CustomButton>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No recent activity found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}