# Changelog

## 1.0.2

- Replaced license with **BSD 3-Clause License**.
- Updated `README.md` and `package.json` to reflect BSD-3-Clause license.
- Cleaned up `package.json` `files` array to only pack `src`, `lib`, and `scripts`, significantly reducing package size.
- Updated dependency `react-native-builder-bob` to `^0.30.0` to resolve Node 18 build compatibility.

## 1.0.0

- Initial public release of `react-native-package-info-viewer`.
- **PackageInfo**: Main component to display app, device, and build information.
- **DebugButton**: Customizable button for easy navigation to the info screen.
- **Automated Build Metadata**: Integrated script to generate Git and build details (`generate-build-info`).
- **Theme Support**: Fully customizable colors for light and dark modes.
- **Sharing**: Integrated support for copying and sharing debug information.
- **Config Masking**: Automatic masking of sensitive configuration values.

### Standardized
- Updated `package.json` to React Native library standards.
- Refined peer dependencies for better compatibility (RN 0.60+).
- Added comprehensive documentation and compatibility guides in README.
