"use strict";

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Alert, Platform } from 'react-native';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Helper to mask sensitive strings
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const maskString = str => {
  if (!str) return '';
  let prefix = '';
  let content = str;
  if (str.startsWith('https://')) {
    prefix = 'https://';
    content = str.slice(8);
  } else if (str.startsWith('http://')) {
    prefix = 'http://';
    content = str.slice(7);
  }
  if (content.length <= 10) return str;
  const first7 = content.substring(0, 7);
  const last3 = content.substring(content.length - 3);
  const maskLength = content.length - 10;
  const mask = '*'.repeat(Math.max(0, maskLength));
  return `${prefix}${first7}${mask}${last3}`;
};
export default function PackageInfo({
  navigation,
  packageJson = {},
  buildInfo = {},
  configValues = {},
  onReload,
  loading = false,
  error = null,
  environmentName = 'UNKNOWN',
  // UI Customization Props
  primaryColor = '#007AFF',
  backgroundColor = '#f5f5f5',
  cardBackgroundColor = '#ffffff',
  textColor = '#333333',
  secondaryTextColor = '#666666'
}) {
  const [deviceData, setDeviceData] = useState({
    model: 'Loading...',
    os: 'Loading...',
    battery: 'Loading...',
    ip: 'Loading...'
  });
  useEffect(() => {
    const loadDeviceInfo = async () => {
      try {
        let batteryLevel = await DeviceInfo.getBatteryLevel();
        const ipAddress = await DeviceInfo.getIpAddress().catch(() => 'N/A');
        setDeviceData({
          model: DeviceInfo.getModel(),
          os: `${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`,
          battery: batteryLevel !== -1 ? `${(batteryLevel * 100).toFixed(0)}%` : 'N/A',
          ip: ipAddress
        });
      } catch (e) {
        console.error("Failed to load device info", e);
      }
    };
    loadDeviceInfo();
  }, []);
  const handleShare = useCallback(async () => {
    const info = JSON.stringify({
      app: packageJson,
      build: buildInfo,
      device: deviceData,
      config: configValues,
      env: environmentName
    }, null, 2);
    try {
      await Share.open({
        title: 'App Debug Info',
        message: info
      });
    } catch (error) {
      console.log('Share dismissed');
    }
  }, [packageJson, buildInfo, deviceData, configValues, environmentName]);
  const handleCopy = useCallback(() => {
    const info = JSON.stringify({
      app: packageJson,
      build: buildInfo,
      device: deviceData,
      config: configValues,
      env: environmentName
    }, null, 2);
    Clipboard.setString(info);
    Alert.alert('Copied!', 'Debug information copied to clipboard.');
  }, [packageJson, buildInfo, deviceData, configValues, environmentName]);
  useEffect(() => {
    if (navigation) {
      navigation.setOptions({
        title: 'Package Info',
        headerRight: () => /*#__PURE__*/_jsxs(View, {
          style: {
            flexDirection: 'row',
            marginRight: 10
          },
          children: [/*#__PURE__*/_jsx(TouchableOpacity, {
            onPress: handleCopy,
            style: {
              padding: 8
            },
            accessibilityLabel: "Copy debug info",
            children: /*#__PURE__*/_jsx(Icon, {
              name: "content-copy",
              size: 22,
              color: primaryColor
            })
          }), /*#__PURE__*/_jsx(TouchableOpacity, {
            onPress: handleShare,
            style: {
              padding: 8
            },
            accessibilityLabel: "Share debug info",
            children: /*#__PURE__*/_jsx(Icon, {
              name: "share",
              size: 24,
              color: primaryColor
            })
          })]
        })
      });
    }
  }, [navigation, handleCopy, handleShare, primaryColor]);
  const renderDependency = (name, version) => /*#__PURE__*/_jsxs(View, {
    style: styles.dependencyRow,
    children: [/*#__PURE__*/_jsx(Text, {
      style: [styles.packageName, {
        color: textColor
      }],
      children: name
    }), /*#__PURE__*/_jsx(Text, {
      style: [styles.packageVersion, {
        color: secondaryTextColor
      }],
      children: version
    })]
  }, name);
  const renderConfigRow = (label, value) => {
    const stringValue = value === null || value === undefined || value === '' ? '' : String(value);
    const displayValue = stringValue ? maskString(stringValue) : '-';
    return /*#__PURE__*/_jsxs(View, {
      style: styles.infoRow,
      children: [/*#__PURE__*/_jsxs(Text, {
        style: [styles.infoLabel, {
          color: secondaryTextColor
        }],
        children: [label, ":"]
      }), /*#__PURE__*/_jsx(Text, {
        style: [styles.infoValue, {
          color: textColor,
          flex: 1,
          textAlign: 'right',
          marginLeft: 10,
          fontSize: 13
        }],
        selectable: true,
        children: displayValue
      })]
    }, label);
  };
  const renderInfoRow = (label, value) => /*#__PURE__*/_jsxs(View, {
    style: styles.infoRow,
    children: [/*#__PURE__*/_jsxs(Text, {
      style: [styles.infoLabel, {
        color: secondaryTextColor
      }],
      children: [label, ":"]
    }), /*#__PURE__*/_jsx(Text, {
      style: [styles.infoValue, {
        color: textColor
      }],
      children: value
    })]
  });
  return /*#__PURE__*/_jsx(SafeAreaView, {
    style: [styles.container, {
      backgroundColor
    }],
    children: /*#__PURE__*/_jsxs(ScrollView, {
      style: styles.scrollView,
      children: [/*#__PURE__*/_jsxs(View, {
        style: styles.section,
        children: [/*#__PURE__*/_jsx(Text, {
          style: [styles.sectionTitle, {
            color: textColor
          }],
          children: "App Information"
        }), /*#__PURE__*/_jsxs(View, {
          style: [styles.infoCard, {
            backgroundColor: cardBackgroundColor
          }],
          children: [renderInfoRow('Name', packageJson.name || '-'), renderInfoRow('Version', packageJson.version || '-'), renderInfoRow('Version Code', packageJson.versionCode || '-'), renderInfoRow('App ID', packageJson.appId || '-')]
        })]
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.section,
        children: [/*#__PURE__*/_jsx(Text, {
          style: [styles.sectionTitle, {
            color: textColor
          }],
          children: "Device Information"
        }), /*#__PURE__*/_jsxs(View, {
          style: [styles.infoCard, {
            backgroundColor: cardBackgroundColor
          }],
          children: [renderInfoRow('Model', deviceData.model), renderInfoRow('OS', deviceData.os), renderInfoRow('Battery', deviceData.battery), renderInfoRow('IP Address', deviceData.ip)]
        })]
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.section,
        children: [/*#__PURE__*/_jsxs(View, {
          style: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10
          },
          children: [/*#__PURE__*/_jsx(Text, {
            style: [styles.sectionTitle, {
              color: textColor,
              marginBottom: 0
            }],
            children: "Config Values"
          }), onReload && /*#__PURE__*/_jsx(TouchableOpacity, {
            onPress: onReload,
            disabled: loading,
            children: /*#__PURE__*/_jsx(Text, {
              style: {
                color: primaryColor,
                fontSize: 14
              },
              children: "Reload"
            })
          })]
        }), /*#__PURE__*/_jsx(View, {
          style: [styles.infoCard, {
            backgroundColor: cardBackgroundColor
          }],
          children: loading ? /*#__PURE__*/_jsx(SkeletonPlaceholder, {
            children: /*#__PURE__*/_jsxs(View, {
              style: {
                flexDirection: "column"
              },
              children: [/*#__PURE__*/_jsx(View, {
                style: {
                  width: "100%",
                  height: 20,
                  marginBottom: 10,
                  borderRadius: 4
                }
              }), /*#__PURE__*/_jsx(View, {
                style: {
                  width: "100%",
                  height: 20,
                  marginBottom: 10,
                  borderRadius: 4
                }
              }), /*#__PURE__*/_jsx(View, {
                style: {
                  width: "100%",
                  height: 60,
                  borderRadius: 4
                }
              })]
            })
          }) : error ? /*#__PURE__*/_jsx(View, {
            style: styles.errorContainer,
            children: /*#__PURE__*/_jsx(Text, {
              style: styles.errorText,
              children: error
            })
          }) : /*#__PURE__*/_jsxs(_Fragment, {
            children: [/*#__PURE__*/_jsxs(View, {
              style: styles.infoRow,
              children: [/*#__PURE__*/_jsx(Text, {
                style: [styles.infoLabel, {
                  color: secondaryTextColor
                }],
                children: "Environment:"
              }), /*#__PURE__*/_jsx(Text, {
                style: [styles.infoValue, {
                  fontWeight: 'bold',
                  color: primaryColor
                }],
                children: environmentName
              })]
            }), Object.entries(configValues).map(([key, value]) => {
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
              return renderConfigRow(label, value);
            })]
          })
        })]
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.section,
        children: [/*#__PURE__*/_jsx(Text, {
          style: [styles.sectionTitle, {
            color: textColor
          }],
          children: "Build Information"
        }), /*#__PURE__*/_jsxs(View, {
          style: [styles.infoCard, {
            backgroundColor: cardBackgroundColor
          }],
          children: [renderInfoRow('Build Date', buildInfo.buildDate ? moment(buildInfo.buildDate).format('YYYY-MM-DD HH:mm:ss') : 'Unknown'), renderInfoRow('Commit Hash', buildInfo.commitHash || '-'), renderInfoRow('Author', buildInfo.commitAuthor || 'Unknown'), renderInfoRow('Branch', buildInfo.commitBranch || 'Unknown')]
        })]
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.section,
        children: [/*#__PURE__*/_jsxs(Text, {
          style: [styles.sectionTitle, {
            color: textColor
          }],
          children: ["Dependencies (", packageJson.dependencies ? Object.keys(packageJson.dependencies).length : 0, ")"]
        }), /*#__PURE__*/_jsx(View, {
          style: [styles.dependenciesCard, {
            backgroundColor: cardBackgroundColor
          }],
          children: packageJson.dependencies && Object.entries(packageJson.dependencies).map(([name, version]) => renderDependency(name, version))
        })]
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.section,
        children: [/*#__PURE__*/_jsxs(Text, {
          style: [styles.sectionTitle, {
            color: textColor
          }],
          children: ["Dev Dependencies (", packageJson.devDependencies ? Object.keys(packageJson.devDependencies).length : 0, ")"]
        }), /*#__PURE__*/_jsx(View, {
          style: [styles.dependenciesCard, {
            backgroundColor: cardBackgroundColor
          }],
          children: packageJson.devDependencies && Object.entries(packageJson.devDependencies).map(([name, version]) => renderDependency(name, version))
        })]
      })]
    })
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backButton: {
    marginRight: 10
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  scrollView: {
    flex: 1
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  infoCard: {
    borderRadius: 10,
    padding: 15,
    elevation: 2
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '500'
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right'
  },
  dependenciesCard: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginBottom: 20
  },
  dependencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5'
  },
  packageName: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500'
  },
  packageVersion: {
    fontSize: 14,
    marginLeft: 10
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    alignItems: 'center'
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center'
  }
});
//# sourceMappingURL=PackageInfo.js.map