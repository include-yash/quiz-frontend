/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./node_modules/@shadcn/ui/dist/**/*.{js,jsx,ts,tsx}"],
	theme: {
	  extend: {
		colors: {
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  // Custom color palette
		  "quiz-purple": {
			DEFAULT: "#8B5CF6", // Vibrant purple
			50: "#F5F3FF",
			100: "#EDE9FE",
			200: "#DDD6FE",
			300: "#C4B5FD",
			400: "#A78BFA",
			500: "#8B5CF6",
			600: "#7C3AED",
			700: "#6D28D9",
			800: "#5B21B6",
			900: "#4C1D95",
		  },
  
		  // Dark theme colors
		  "quiz-dark": {
			DEFAULT: "#111111", // Near black
			50: "#1E1E1E", // Dark gray
			100: "#171717", // Very dark gray
			200: "#131313", // Almost black
			300: "#0F0F0F", // Darker than almost black
		  },
		},
		animation: {
		  shimmer: "shimmer 2s infinite linear",
		  "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
		  float: "float 3s ease-in-out infinite",
		},
		keyframes: {
		  shimmer: {
			"0%": { transform: "translateX(-100%)" },
			"100%": { transform: "translateX(100%)" },
		  },
		  "pulse-glow": {
			"0%, 100%": {
			  opacity: 1,
			  boxShadow: "0 0 20px rgba(139, 92, 246, 0.7)",
			},
			"50%": {
			  opacity: 0.7,
			  boxShadow: "0 0 10px rgba(139, 92, 246, 0.3)",
			},
		  },
		  float: {
			"0%, 100%": { transform: "translateY(0)" },
			"50%": { transform: "translateY(-10px)" },
		  },
		},
		backgroundImage: {
		  "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
		  "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
		  "purple-glow": "linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(76, 29, 149, 0.1))",
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		boxShadow: {
		  neon: "0 0 5px theme('colors.purple.400'), 0 0 20px theme('colors.purple.600')",
		  "inner-glow": "inset 0 0 15px rgba(139, 92, 246, 0.3)",
		},
	  },
	},
	plugins: [
	  require("tailwindcss-animate"),
	  ({ addUtilities }) => {
		const newUtilities = {
		  ".text-glow": {
			textShadow: "0 0 10px rgba(139, 92, 246, 0.7), 0 0 20px rgba(139, 92, 246, 0.5)",
		  },
		  ".bg-glass": {
			backgroundColor: "rgba(17, 17, 17, 0.7)",
			backdropFilter: "blur(10px)",
			border: "1px solid rgba(139, 92, 246, 0.2)",
		  },
		  ".glassmorphism": {
			background: "rgba(17, 17, 17, 0.7)",
			backdropFilter: "blur(10px)",
			border: "1px solid rgba(139, 92, 246, 0.2)",
			boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
		  },
		  ".neumorphism": {
			backgroundColor: "#171717",
			boxShadow: "5px 5px 10px #0f0f0f, -5px -5px 10px #1f1f1f",
		  },
		  ".neumorphism-inset": {
			backgroundColor: "#171717",
			boxShadow: "inset 5px 5px 10px #0f0f0f, inset -5px -5px 10px #1f1f1f",
		  },
		}
		addUtilities(newUtilities)
	  },
	],
  }
  
  