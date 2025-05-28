import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem', // Adjusted for mobile-first
			screens: {
        sm: '640px',
        md: '768px',
				'2xl': '1400px'
			}
		},
		extend: {
      fontFamily: {
        display: ['"Fredoka One"', 'cursive'],
        sans: ['Poppins', 'sans-serif'],
      },
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))', // Vibrant Purple: 260, 80%, 60%
					foreground: 'hsl(var(--primary-foreground))' // White
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))', // Hot Pink: 330, 90%, 70%
					foreground: 'hsl(var(--secondary-foreground))'
				},
        accent: {
          DEFAULT: "hsl(var(--accent))", // Bright Yellow: 50, 100%, 60%
          foreground: "hsl(var(--accent-foreground))",
        },
        'vibe-pink': '#FF69B4', // Hot Pink
        'vibe-purple': '#9370DB', // Medium Purple
        'vibe-yellow': '#FFD700', // Gold
        'vibe-blue': '#1E90FF', // Dodger Blue
        'vibe-green': '#32CD32', // Lime Green
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))', // Semi-transparent white for cards
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
        'gradient-bg': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-bg': 'gradient-bg 15s ease infinite',
        'float': 'float 3s ease-in-out infinite',
			},
      boxShadow: {
        'vibrant': '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
        'vibrant-lg': '0 20px 30px rgba(0, 0, 0, 0.20), 0 5px 10px rgba(0, 0, 0, 0.15)',
      }
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
} satisfies Config;

