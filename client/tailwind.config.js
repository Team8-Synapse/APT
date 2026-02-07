/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                amrita: {
                    primary: '#B1124A',
                    maroon: '#B1124A',
                    magenta: '#B1124A',
                    pink: '#D91A65',
                    rose: '#FF4081',
                    gold: '#FFD700',
                    burgundy: '#8B0A3C',
                    dark: '#6B0835',
                    light: '#FFF0F5',
                    cream: '#FFF8FA',
                },
                // Direct maroon and beige colors for Home.jsx
                maroon: '#B1124A',
                beige: {
                    50: '#FFF8F0',
                    100: '#F5F0E8',
                    200: '#E8E0D5',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'gradient': 'gradient 8s ease infinite',
                'slide-up': 'slideUp 0.6s ease-out forwards',
                'ticker': 'ticker 20s linear infinite',
                'bounce-slow': 'bounce 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                ticker: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
            backgroundImage: {
                'amrita-gradient': 'linear-gradient(135deg, #B1124A 0%, #D91A65 50%, #FF4081 100%)',
                'amrita-radial': 'radial-gradient(circle at 30% 50%, #B1124A, #8B0A3C)',
            }
        },
    },
    plugins: [],
}
