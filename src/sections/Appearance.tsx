import { useAppearance } from '../contexts/appearance-context';
import { Sun, Moon, Text, Palette, Layout, Globe, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock preview components
const PreviewHeader = ({ previewTheme, accentColor }: { previewTheme: 'light' | 'dark', accentColor: string }) => (
  <div className={`flex items-center justify-between p-4 ${
    previewTheme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200'
  } border-b`}>
    <div className="flex items-center gap-2">
      <Globe className={`w-5 h-5 ${previewTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
      <h1 className={`text-xl font-bold ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Dashboard Preview
      </h1>
    </div>
    <button 
      className={`px-3 py-1 text-white rounded-md text-sm font-medium`}
      style={{ backgroundColor: accentColor }}
    >
      Action Button
    </button>
  </div>
);

const PreviewContent = ({ previewTheme, accentColor }: { previewTheme: 'light' | 'dark', accentColor: string }) => (
  <div className="p-4 space-y-4">
    <div className={`
      p-4 rounded-md ${
        previewTheme === 'dark' 
          ? 'bg-gray-700 text-white' 
          : 'bg-gray-50 text-gray-900'
      }
    `}>
      <h2 className={`text-lg font-semibold mb-2 ${
        previewTheme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Sample Section
      </h2>
      <p className={`text-sm ${
        previewTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      }`}>
        This is a preview of how your text will look with the selected font and size.
      </p>
    </div>
    <ul className="space-y-2">
      <li className={`flex items-center gap-2 text-sm ${
        previewTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <div 
          className="w-4 h-4 rounded-full" 
          style={{ backgroundColor: accentColor }}
        />
        List item 1
      </li>
      <li className={`flex items-center gap-2 text-sm ${
        previewTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        <div 
          className="w-4 h-4 rounded-full" 
          style={{ backgroundColor: accentColor }}
        />
        List item 2
      </li>
    </ul>
  </div>
);

const PreviewFooter = ({ previewTheme }: { previewTheme: 'light' | 'dark' }) => (
  <div className={`p-4 ${
    previewTheme === 'dark' 
      ? 'border-gray-700 text-gray-400 bg-gray-900' 
      : 'border-gray-200 text-gray-500 bg-white'
  } border-t text-sm`}>
    © 2025 Your App. All rights reserved.
  </div>
);

export function Appearance() {
    const {
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
    } = useAppearance();

    const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

    // Font options
    const fontOptions = [
        { value: 'default' as const, label: 'Default (Sans-serif)', class: 'font-sans' },
        { value: 'serif' as const, label: 'Serif', class: 'font-serif' },
        { value: 'mono' as const, label: 'Monospace', class: 'font-mono' }
    ];

    // Font size options
    const fontSizeOptions = [
        { value: 'normal' as const, label: 'Normal', class: 'text-base' },
        { value: 'small' as const, label: 'Small', class: 'text-sm' },
        { value: 'large' as const, label: 'Large', class: 'text-lg' }
    ];

    // Accent color options
    const accentColors = [
        { value: 'blue' as const, label: 'Blue', hex: '#2563eb' },
        { value: 'green' as const, label: 'Green', hex: '#16a34a' },
        { value: 'purple' as const, label: 'Purple', hex: '#7c3aed' },
        { value: 'red' as const, label: 'Red', hex: '#dc2626' },
        { value: 'orange' as const, label: 'Orange', hex: '#ea580c' }
    ];

    // Layout width options
    const layoutOptions = [
        { value: 'standard' as const, label: 'Standard', class: 'max-w-6xl mx-auto' },
        { value: 'full' as const, label: 'Full Width', class: 'w-full' },
        { value: 'compact' as const, label: 'Compact', class: 'max-w-4xl mx-auto' }
    ];

    // Theme options
    const themeOptions = [
        { value: 'system' as const, label: 'Use System Setting' },
        { value: 'light' as const, label: 'Light' },
        { value: 'dark' as const, label: 'Dark' }
    ];

    // Get preview classes
    const getPreviewClasses = () => {
        const fontClass = fontOptions.find(f => f.value === fontFamily)?.class || 'font-sans';
        const sizeClass = fontSizeOptions.find(s => s.value === fontSize)?.class || 'text-base';
        const widthClass = layoutOptions.find(l => l.value === layoutWidth)?.class || 'max-w-6xl mx-auto';
        return `${fontClass} ${sizeClass} ${widthClass}`;
    };

    // Update preview theme when main theme changes (excluding system)
    useEffect(() => {
        if (theme !== 'system') {
            setPreviewTheme(theme);
        }
    }, [theme]);

    // Get current accent color
    const currentAccentColor = accentColors.find(c => c.value === accentColor)?.hex || '#2563eb';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Appearance Settings
                        </h2>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                            Customize the look and feel of your dashboard
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Settings Panel */}
                        <div className="space-y-6">
                            {/* Theme Selection */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    <Sun className="w-4 h-4 text-yellow-500" />
                                    Theme Preference
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {themeOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setTheme(option.value)}
                                            className={`relative group p-4 rounded-xl transition-all duration-200 border ${
                                                theme === option.value
                                                    ? 'border-primary bg-primary/10 text-primary shadow-md'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                                            }`}
                                            style={{
                                                '--tw-ring-color': currentAccentColor
                                            } as React.CSSProperties}
                                        >
                                            <div className="relative z-10">
                                                <div className="font-semibold text-sm">{option.label}</div>
                                                <div className="text-xs opacity-75 mt-1">
                                                    {option.value === 'system' ? 'Follows your OS' : 
                                                     option.value === 'light' ? 'Bright interface' : 'Dark interface'}
                                                </div>
                                            </div>
                                            {theme === option.value && (
                                                <Check className="absolute top-2 right-2 w-4 h-4 text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Typography Section */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                        <Text className="w-4 h-4" />
                                        Font Family
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {fontOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setFontFamily(option.value)}
                                                className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                                                    fontFamily === option.value
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                                style={{ fontFamily: option.class }}
                                            >
                                                <div className="font-semibold text-sm" style={{ fontFamily: option.class }}>
                                                    {option.label}
                                                </div>
                                                <div className="text-xs opacity-75 mt-1">
                                                    Preview text in this style
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                        <Text className="w-4 h-4" />
                                        Text Size
                                    </label>
                                    <div className="flex gap-3">
                                        {fontSizeOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setFontSize(option.value)}
                                                className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
                                                    fontSize === option.value
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                                style={{ fontSize: option.value === 'small' ? '0.875rem' : option.value === 'normal' ? '1rem' : '1.125rem' }}
                                            >
                                                <div className="font-semibold text-center">Aa</div>
                                                <div className="text-xs opacity-75 mt-1 text-center">{option.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Color Section */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    <Palette className="w-4 h-4" />
                                    Accent Color
                                </label>
                                <div className="grid grid-cols-5 gap-3">
                                    {accentColors.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setAccentColor(color.value)}
                                            className={`relative w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 shadow-md ${
                                                accentColor === color.value ? 'ring-2 ring-offset-2 ring-primary/50 shadow-lg' : ''
                                            }`}
                                            style={{ 
                                                backgroundColor: color.hex,
                                                border: accentColor === color.value ? `3px solid ${color.hex}` : 'none'
                                            }}
                                            aria-label={`Select ${color.label} accent color`}
                                        >
                                            {accentColor === color.value && (
                                                <Check className="absolute inset-0 m-1.5 w-3 h-3 text-white rounded-full bg-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Used for buttons, links, and highlights throughout your dashboard
                                </div>
                            </div>

                            {/* Layout Section */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    <Layout className="w-4 h-4" />
                                    Layout Width
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                    {layoutOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setLayoutWidth(option.value)}
                                            className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                                                layoutWidth === option.value
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold text-sm">{option.label}</div>
                                                    <div className="text-xs opacity-75 mt-1">
                                                        {option.value === 'standard' ? 'Balanced content width' :
                                                         option.value === 'full' ? 'Uses full screen width' : 'More focused layout'}
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                    option.value === 'full' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                                                    option.value === 'compact' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                                                    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                }`}>
                                                    {option.value}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Preview Panel */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Live Preview
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        See your changes in real-time
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
                                    <button
                                        onClick={() => setPreviewTheme('light')}
                                        className={`p-2 rounded-md transition-colors ${
                                            previewTheme === 'light' 
                                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <Sun className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setPreviewTheme('dark')}
                                        className={`p-2 rounded-md transition-colors ${
                                            previewTheme === 'dark' 
                                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <Moon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div 
                                className={`
                                    border-2 border-dashed rounded-xl overflow-hidden shadow-xl transition-all duration-300
                                    ${getPreviewClasses()}
                                    ${previewTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}
                                `}
                                style={{ 
                                    maxWidth: layoutWidth === 'full' ? '100%' : layoutWidth === 'compact' ? '400px' : '600px'
                                }}
                            >
                                <PreviewHeader previewTheme={previewTheme} accentColor={currentAccentColor} />
                                <PreviewContent previewTheme={previewTheme} accentColor={currentAccentColor} />
                                <PreviewFooter previewTheme={previewTheme} />
                            </div>
                            
                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="flex items-center gap-2">
                                    <Check className="w-3 h-3 text-green-500" />
                                    Changes are applied instantly across your dashboard
                                </p>
                                <p className="flex items-center gap-2">
                                    <Check className="w-3 h-3 text-green-500" />
                                    All settings are saved automatically to your account
                                </p>
                                <p className="flex items-center gap-2">
                                    <Check className="w-3 h-3 text-green-500" />
                                    You can preview different themes without saving
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reset Section */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    setTheme('system');
                                    setFontFamily('default');
                                    setFontSize('normal');
                                    setAccentColor('blue');
                                    setLayoutWidth('standard');
                                }}
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 
                                         bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                                         rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
                                         hover:shadow-sm transition-all duration-200"
                            >
                                <span className="text-sm">↻</span>
                                Reset to Defaults
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}