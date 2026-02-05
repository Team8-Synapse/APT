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
                    maroon: '#800000',
                    gold: '#FFD700',
                    burgundy: '#4A0404',
                }
            }
        },
    },
    plugins: [],
}
