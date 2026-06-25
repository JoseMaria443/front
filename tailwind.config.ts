import type { Config } from "tailwindcss";

export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                corporate: {
                    blue: "#1e3a8a",
                    accent: "#3b82f6",
                    light: "#f8fafc",
                    dark: "#0f172a",
                    surface: "#ffffff",
                }
            }
        },
    },
    plugins: [],
} satisfies Config;