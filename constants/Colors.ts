/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '##4b5563'; // Tailwind's blue-600
const tintColorDark = '#d1d5db';  // Tailwind's sky-400

export const Colors = {
  light: {
    text: '#1f2937',              // dark gray
    background: '#f9fafb',        // near-white
    tint: '#4b5563',              // medium gray instead of blue
    icon: '#6b7280',              // gray-500
    tabIconDefault: '#9ca3af',    // gray-400
    tabIconSelected: '#4b5563',   // same as tint
  },
  dark: {
    text: '#f5f5f5',              // light gray for readable text
    background: '#0a0a0a',        // almost black background
    tint: '#d4d4d4',              // soft neutral gray for highlights
    icon: '#a3a3a3',              // medium gray for icons
    tabIconDefault: '#737373',    // dim gray for inactive tabs
    tabIconSelected: '#d4d4d4',   // same as tint for active tab
},

};



