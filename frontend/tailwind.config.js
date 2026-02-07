/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'indigo': {
          200: '#c7d2fe',
          500: '#6366f1',
        },
        'gray': {
          200: '#e5e7eb',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
        },
        'green': {
          200: '#bbf7d0',
          500: '#10b981',
        },
        'blue': {
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
        },
        'red': {
          200: '#fecaca',
          500: '#ef4444',
        },
        'purple': {
          200: '#e9d5ff',
          500: '#8b5cf6',
        },
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-indigo-200',
    'bg-gray-200',
    'bg-green-200',
    'bg-blue-200',
    'bg-red-200',
    'bg-purple-200',
    'bg-indigo-500',
    'bg-gray-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-red-500',
    'bg-purple-500',
  ]
}