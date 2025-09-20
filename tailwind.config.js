/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Keep this - works perfectly with our system
  theme: {
    extend: {
      colors: {
        // Keep your custom colors
        custom: {
          dark: '#222222'
        },
        // Add appearance system colors using CSS variables
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Dynamic accent colors (will change based on user selection)
        blue: {
          50: 'hsl(221 100% 98%)',
          500: 'hsl(221 83% 53%)',
          600: 'hsl(221 83% 48%)',
          700: 'hsl(221 83% 43%)',
        },
        green: {
          50: 'hsl(142 76% 96%)',
          500: 'hsl(142 71% 45%)',
          600: 'hsl(142 71% 41%)',
          700: 'hsl(142 71% 36%)',
        },
        purple: {
          50: 'hsl(263 69% 96%)',
          500: 'hsl(263 70% 50%)',
          600: 'hsl(263 70% 45%)',
          700: 'hsl(263 70% 40%)',
        },
        red: {
          50: 'hsl(0 84% 96%)',
          500: 'hsl(0 84% 60%)',
          600: 'hsl(0 84% 55%)',
          700: 'hsl(0 84% 50%)',
        },
        orange: {
          50: 'hsl(25 95% 96%)',
          500: 'hsl(25 95% 53%)',
          600: 'hsl(25 95% 48%)',
          700: 'hsl(25 95% 43%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'accent-pop': 'accentPop 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        accentPop: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}