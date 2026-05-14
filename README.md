# React Native Package Info Viewer

[![npm version](https://img.shields.io/npm/v/@conversantech/react-native-package-info-viewer.svg)](https://www.npmjs.com/package/@conversantech/react-native-package-info-viewer)
[![license](https://img.shields.io/npm/l/@conversantech/react-native-package-info-viewer.svg)](https://github.com/conversantech/react-native-package-info-viewer/blob/main/LICENSE)

A robust React Native component to display application version, dependencies, build information (Git commit, branch, author), dynamic configuration values, and Device Information. Perfect for debug menus, QA testing, and "About App" screens.

## Table of Contents
- [Features](#features-)
- [Compatibility](#compatibility-)
- [Installation](#installation-)
- [Setup](#setup-crucial-step-)
- [Usage](#usage-)
- [Props](#props-)
- [License](#license)

## Features 🚀
- 📦 **App Info**: Displays Version, Version Code, App ID, and Name.
- 📱 **Device Info**: Shows Model, OS Version, Battery Level, and IP Address.
- 🏗 **Build Metadata**: Git Commit Hash, Branch, Author, and Build Date. *(Requires Setup ⚡)*
- 🔧 **Config Viewer**: Safely displays environment variables with automatic masking.
- 🧩 **Dependency List**: Lists all `dependencies` and `devDependencies`.
- 🎨 **Fully Customizable**: Change colors to match your app's theme.
- 📤 **Share/Copy**: Quickly share debug info via WhatsApp, Slack, or Clipboard.
- 🔘 **Debug Button**: A handy pre-styled button to trigger the info screen.

---

## Compatibility 📱

This package is designed for modern React Native applications and supports:

| Requirement | Version |
|-------------|---------|
| **React Native** | >= 0.60.0 |
| **React** | >= 18.0.0 |
| **iOS** | 12.4+ |
| **Android** | API 21+ |

---

## Installation 💿

```bash
npm install @conversantech/react-native-package-info-viewer
# or
yarn add @conversantech/react-native-package-info-viewer
```

### Peer Dependencies
Ensure you have these installed in your project:
```bash
yarn add moment react-native-skeleton-placeholder react-native-device-info @react-native-clipboard/clipboard react-native-share react-native-vector-icons
```
*(Don't forget to run `npx pod-install` or `cd ios && pod install` for iOS)*

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
import { PackageInfo } from '@conversantech/react-native-package-info-viewer';

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
      
      // Theme Customization
      primaryColor="#007AFF"
      backgroundColor="#f5f5f5"
      cardBackgroundColor="#ffffff"
      textColor="#333333"
      secondaryTextColor="#666666"

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
import { DebugButton } from '@conversantech/react-native-package-info-viewer';

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

### `DebugButton`

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| `visible` | Boolean | `true` | Controls whether the button is rendered. |
| `onPress` | Function | `undefined` | Callback function when the button is tapped. |
| `buttonStyle` | Style | `{}` | Custom style for the button container. |
| `textStyle` | Style | `{}` | Custom style for the button text. |

---

License: MIT
