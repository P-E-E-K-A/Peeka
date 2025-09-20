import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AppearanceContextType {
  theme: 'system' | 'light' | 'dark';
  setTheme: (theme: 'system' | 'light' | 'dark') => void;
  fontFamily: 'default' | 'serif' | 'mono';
  setFontFamily: (fontFamily: 'default' | 'serif' | 'mono') => void;
  fontSize: 'normal' | 'small' | 'large';
  setFontSize: (fontSize: 'normal' | 'small' | 'large') => void;
  accentColor: 'blue' | 'green' | 'purple' | 'red' | 'orange';
  setAccentColor: (accentColor: 'blue' | 'green' | 'purple' | 'red' | 'orange') => void;
  layoutWidth: 'standard' | 'full' | 'compact';
  setLayoutWidth: (layoutWidth: 'standard' | 'full' | 'compact') => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const useAppearance = (): AppearanceContextType => {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
};

interface AppearanceProviderProps {
  children: ReactNode;
}

export const AppearanceProvider: React.FC<AppearanceProviderProps> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [theme, setThemeState] = useState<'system' | 'light' | 'dark'>(
    () => {
      try {
        const saved = localStorage.getItem('theme');
        return (saved as 'system' | 'light' | 'dark') || 'system';
      } catch {
        return 'system';
      }
    }
  );
  
  const [fontFamily, setFontFamilyState] = useState<'default' | 'serif' | 'mono'>(
    () => {
      try {
        const saved = localStorage.getItem('fontFamily');
        return (saved as 'default' | 'serif' | 'mono') || 'default';
      } catch {
        return 'default';
      }
    }
  );
  
  const [fontSize, setFontSizeState] = useState<'normal' | 'small' | 'large'>(
    () => {
      try {
        const saved = localStorage.getItem('fontSize');
        return (saved as 'normal' | 'small' | 'large') || 'normal';
      } catch {
        return 'normal';
      }
    }
  );
  
  const [accentColor, setAccentColorState] = useState<'blue' | 'green' | 'purple' | 'red' | 'orange'>(
    () => {
      try {
        const saved = localStorage.getItem('accentColor');
        return (saved as 'blue' | 'green' | 'purple' | 'red' | 'orange') || 'blue';
      } catch {
        return 'blue';
      }
    }
  );
  
  const [layoutWidth, setLayoutWidthState] = useState<'standard' | 'full' | 'compact'>(
    () => {
      try {
        const saved = localStorage.getItem('layoutWidth');
        return (saved as 'standard' | 'full' | 'compact') || 'standard';
      } catch {
        return 'standard';
      }
    }
  );

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('fontFamily', fontFamily);
    } catch (error) {
      console.warn('Failed to save fontFamily to localStorage:', error);
    }
  }, [fontFamily]);

  useEffect(() => {
    try {
      localStorage.setItem('fontSize', fontSize);
    } catch (error) {
      console.warn('Failed to save fontSize to localStorage:', error);
    }
  }, [fontSize]);

  useEffect(() => {
    try {
      localStorage.setItem('accentColor', accentColor);
    } catch (error) {
      console.warn('Failed to save accentColor to localStorage:', error);
    }
  }, [accentColor]);

  useEffect(() => {
    try {
      localStorage.setItem('layoutWidth', layoutWidth);
    } catch (error) {
      console.warn('Failed to save layoutWidth to localStorage:', error);
    }
  }, [layoutWidth]);

  // Apply theme to document
  useEffect(() => {
    const updateTheme = (isDark: boolean) => {
      document.documentElement.classList.toggle('dark', isDark);
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      updateTheme(mediaQuery.matches);
      
      // Listen for system theme changes
      const handleChange = (e: MediaQueryListEvent) => {
        updateTheme(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } else {
      updateTheme(theme === 'dark');
    }
  }, [theme]);

  // Apply font family to document
  useEffect(() => {
    const fontClassMap: Record<string, string> = {
      default: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono'
    };
    
    const fontClass = fontClassMap[fontFamily];
    
    // Remove existing font classes
    ['font-sans', 'font-serif', 'font-mono'].forEach(cls => {
      if (document.documentElement.classList.contains(cls)) {
        document.documentElement.classList.remove(cls);
      }
    });
    
    // Add new font class
    if (fontClass) {
      document.documentElement.classList.add(fontClass);
    }
  }, [fontFamily]);

  // Apply font size to document
  useEffect(() => {
    const sizeClassMap: Record<string, string> = {
      normal: 'text-base',
      small: 'text-sm',
      large: 'text-lg'
    };
    
    const sizeClass = sizeClassMap[fontSize];
    
    // Remove existing size classes
    ['text-sm', 'text-base', 'text-lg'].forEach(cls => {
      if (document.documentElement.classList.contains(cls)) {
        document.documentElement.classList.remove(cls);
      }
    });
    
    // Add new size class
    if (sizeClass) {
      document.documentElement.classList.add(sizeClass);
    }
  }, [fontSize]);

  // Apply accent color CSS variable
  useEffect(() => {
    const colorMap: Record<string, string> = {
      blue: '#2563eb',
      green: '#16a34a',
      purple: '#7c3aed',
      red: '#dc2626',
      orange: '#ea580c'
    };
    
    const color = colorMap[accentColor];
    if (color && document.documentElement) {
      document.documentElement.style.setProperty('--primary', color);
    }
  }, [accentColor]);

  // Apply layout width attribute
  useEffect(() => {
    const layoutClassMap: Record<string, string> = {
      standard: 'max-w-6xl mx-auto',
      full: 'w-full',
      compact: 'max-w-4xl mx-auto'
    };
    
    const layoutClass = layoutClassMap[layoutWidth];
    if (document.documentElement) {
      document.documentElement.setAttribute('data-layout', layoutClass);
    }
  }, [layoutWidth]);

  // Setter functions
  const setTheme = (newTheme: 'system' | 'light' | 'dark'): void => {
    setThemeState(newTheme);
  };
  
  const setFontFamily = (newFont: 'default' | 'serif' | 'mono'): void => {
    setFontFamilyState(newFont);
  };
  
  const setFontSize = (newSize: 'normal' | 'small' | 'large'): void => {
    setFontSizeState(newSize);
  };
  
  const setAccentColor = (newColor: 'blue' | 'green' | 'purple' | 'red' | 'orange'): void => {
    setAccentColorState(newColor);
  };
  
  const setLayoutWidth = (newWidth: 'standard' | 'full' | 'compact'): void => {
    setLayoutWidthState(newWidth);
  };

  // Context value
  const value: AppearanceContextType = {
    theme,
    setTheme,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    accentColor,
    setAccentColor,
    layoutWidth,
    setLayoutWidth
  };

  // Return the provider - THIS IS THE FIXED PART
  return React.createElement(AppearanceContext.Provider, { value }, children);
};