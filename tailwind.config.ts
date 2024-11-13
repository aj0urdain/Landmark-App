import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: [
    'text-gray-500',
    'text-emerald-500',
    'text-blue-500',
    'text-purple-500',
    'text-green-500',
    'text-yellow-500',
    'text-indigo-500',
    'text-red-500',
    'text-orange-500',
    'text-pink-500',
    'text-teal-500',
    'text-cyan-500',
    'border-gray-500',
    'border-emerald-500',
    'border-blue-500',
    'border-purple-500',
    'border-green-500',
    'border-yellow-500',
    'border-indigo-500',
    'border-red-500',
    'border-orange-500',
    'border-pink-500',
    'border-teal-500',
    'border-cyan-500',
    {
      pattern: /^(after:h-\[\d+px\]|after:duration-\d+|after:bg-.*)/,
    },
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        portfolio: 'portfolioColors',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        lexia: ['Lexia', 'sans-serif'],
        sans: ['Geist Sans', 'sans-serif'],
        metro: ['var(--font-metro-sans)'],
      },
      keyframes: {
        'gradient-animation': {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        'float-up': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
        },
        'gavel-hit': {
          '0%, 100%': {
            transform: 'rotate(0deg)',
          },
          '50%': {
            transform: 'rotate(45deg)',
          },
        },
        'fade-in-out': {
          '0%, 100%': {
            opacity: '0',
          },
          '10%, 90%': {
            opacity: '1',
          },
        },
        gradient: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'spin-slow': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        'caret-blink': {
          '0%,70%,100%': {
            opacity: '1',
          },
          '20%,50%': {
            opacity: '0',
          },
        },
        'slide-down-fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-up-fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-left-fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'slide-right-fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'float-up-fade-out': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0px)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
        },
      },
      animation: {
        'gradient-animation': 'gradient-animation 10s ease infinite',
        'gavel-hit': 'gavel-hit 0.75s ease-in-out infinite',
        'float-up-fade-out': 'float-up-fade-out 0.5s ease-out forwards',
        'float-up': 'float-up 0.5s ease-out forwards',
        'fade-in-out': 'fade-in-out 2s ease-in-out',
        gradient: 'gradient 15s ease infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin-slow 3s linear infinite',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'slide-down-fade-in': 'slide-down-fade-in 0.3s ease-out forwards',
        'slide-up-fade-in': 'slide-up-fade-in 0.3s ease-out forwards',
        'slide-left-fade-in': 'slide-left-fade-in 0.3s ease-out forwards',
        'slide-right-fade-in': 'slide-right-fade-in 0.3s ease-out forwards',
      },
      backgroundImage: {
        'gradient-animation':
          'linear-gradient(270deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff)',
      },
      backgroundSize: {
        'gradient-animation': '1200% 1200%',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
