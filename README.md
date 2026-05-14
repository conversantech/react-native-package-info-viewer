# React Native Package Info Viewer

A robust React Native component to display application version, dependencies, build information (Git commit, branch, author), dynamic configuration values, **and Device Information**. Perfect for debug menus, QA testing, and "About App" screens.

## Features 🚀
- 📦 **App Info**: Displays Version, Version Code, App ID, and Name.
- 📱 **Device Info**: Shows Model, OS Version, Battery Level, and IP Address.
- 🏗 **Build Metadata**: Shows Git Commit Hash, Branch, Author, and Build Date (Auto-generated).
- 🔧 **Config Viewer**: Safely displays environment variables or config keys (masks sensitive keys automatically).
- 🧩 **Dependency List**: Lists all `dependencies` and `devDependencies` with versions.
- 🎨 **Fully Customizable**: Change colors to match your app's theme (Light/Dark mode).
- 📤 **Share/Copy**: Quickly share debug info via WhatsApp, Slack, or Clipboard.
- dup **Debug Button**: A handy floating/inline button to trigger the info screen.

---

## Installation 💿

```bash
npm install react-native-package-info-viewer
# or
yarn add react-native-package-info-viewer
```

### Peer Dependencies
Ensure you have these installed in your project:
```bash
yarn add moment react-native-skeleton-placeholder react-native-linear-gradient @react-native-community/async-storage react-native-device-info @react-native-clipboard/clipboard react-native-share
```
*(Don't forget to run `cd ios && pod install` for iOS)*

---

## Setup (Crucial Step) ⚡

To see accurate **Git Commit** and **Build Date** information, this package requires a simple script setup. This script generates a `build-info.json` file whenever you build your app.

1. Open your main project's `package.json`.
2. ADD or APPEND to the `scripts` section:

```json
"scripts": {
  "prebuild": "npx generate-build-info",
  ...
}
```

Now, whenever you run `npm run prebuild` or add it to your start scripts, it will generate a `global/build-info.json` file in your root directory.

---

## Usage 🛠

### 1. The Info Screen (`PackageInfo`)
This is the main component that displays all the data.

```javascript
import React from 'react';
import { PackageInfo } from 'react-native-package-info-viewer';

// 1. Import your package.json
import packageJson from './package.json';

// 2. Import the generated build-info
let buildInfo = {};
try {
  buildInfo = require('./global/build-info.json');
} catch (e) { console.log("Build info not found"); }

const AboutScreen = ({ navigation }) => {
  return (
    <PackageInfo
      navigation={navigation}
      
      // Data Props
      packageJson={packageJson}
      buildInfo={buildInfo}
      environmentName="STAGING"
      
      // Theme Customization (New in v0.2.0)
      primaryColor="#FF5733"       // Brand Color
      backgroundColor="#121212"    // Main Background (Dark Mode)
      cardBackgroundColor="#1E1E1E" // Card Background
      textColor="#FFFFFF"          // Main Text
      secondaryTextColor="#AAAAAA" // Label Text

      // Config/Env Variables
      configValues={{
        API_URL: "https://api.dev.com",
        STRIPE_KEY: "sk_test_51Mz...",
      }}
    />
  );
};

export default AboutScreen;
```

### 2. The Debug Button (`DebugButton`)
A pre-styled button to easily navigate to your Info Screen.

```javascript
import { DebugButton } from 'react-native-package-info-viewer';

export default function LoginScreen({ navigation }) {
  return (
    <View>
      <DebugButton 
        visible={__DEV__} 
        onPress={() => navigation.navigate('AboutScreen')}
      />
    </View>
  );
}
```

---

## Props 📚

### `PackageInfo`

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| `packageJson` | Object | `{}` | The raw JSON content of your `package.json`. |
| `buildInfo` | Object | `{}` | The JSON content of `build-info.json`. |
| `configValues` | Object | `{}` | Any key-value pairs (Env vars) you want to display. |
| `environmentName` | String | `'UNKNOWN'` | Shows at the top of the Config section. |
| `primaryColor` | Color | `'#007AFF'` | Color for buttons, links, and highlights. |
| `backgroundColor` | Color | `'#f5f5f5'` | Main screen background color. |
| `cardBackgroundColor`| Color | `'#ffffff'` | Background color for info cards. |
| `textColor` | Color | `'#333333'` | Main text color. |
| `secondaryTextColor`| Color | `'#666666'` | Secondary/Label text color. |

---

License: MIT
