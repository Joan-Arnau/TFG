# PromoRural Mobile App

This is the mobile application for the PromoRural project, built with [Expo](https://expo.dev) and React Native.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the development server**:
    ```bash
    npm start
    ```

3.  **Run on a device/emulator**:
    - Press `a` for Android.
    - Press `i` for iOS.
    - Press `w` for Web.
    - Scan the QR code with the **Expo Go** app on your phone.

## Architecture

- **`src/api`**: Public API client using Axios.
- **`src/context`**: Global states, including `ThemeContext` for white-labeling.
- **`src/i18n`**: Internationalization support (Catalan, Spanish, English).
- **`src/navigation`**: Navigation configuration using React Navigation.
- **`src/screens`**: Application screens.
- **`src/theme`**: Theme constants and styling.

## White-labeling

The application theme (primary color, logo) is dynamically loaded from the backend's `/api/public/config` endpoint via the `ThemeContext`.
