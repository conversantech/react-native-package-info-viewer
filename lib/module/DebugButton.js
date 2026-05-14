"use strict";

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { jsx as _jsx } from "react/jsx-runtime";
const DebugButton = ({
  visible = true,
  onPress,
  buttonStyle,
  textStyle
}) => {
  if (!visible) return null;
  return /*#__PURE__*/_jsx(View, {
    style: styles.container,
    children: /*#__PURE__*/_jsx(TouchableOpacity, {
      style: [styles.button, buttonStyle],
      onPress: onPress,
      children: /*#__PURE__*/_jsx(Text, {
        style: [styles.text, textStyle],
        children: "Check Info"
      })
    })
  });
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});
export default DebugButton;
//# sourceMappingURL=DebugButton.js.map