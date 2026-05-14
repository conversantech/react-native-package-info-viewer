import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';
import moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';

// Helper to mask sensitive strings
const maskString = (str) => {
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

    const handleShare = async () => {
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
                message: info,
            });
        } catch (error) {
            console.log('Share dismissed');
        }
    };

    const handleCopy = () => {
        const info = JSON.stringify({
            app: packageJson,
            build: buildInfo,
            device: deviceData,
            config: configValues,
            env: environmentName
        }, null, 2);

        Clipboard.setString(info);
        Alert.alert('Copied!', 'Debug information copied to clipboard.');
    };

    const renderDependency = (name, version) => (
        <View key={name} style={styles.dependencyRow}>
            <Text style={[styles.packageName, { color: textColor }]}>{name}</Text>
            <Text style={[styles.packageVersion, { color: secondaryTextColor }]}>{version}</Text>
        </View>
    );

    const renderConfigRow = (label, value) => {
        const stringValue = (value === null || value === undefined || value === '') ? '' : String(value);
        const displayValue = stringValue ? maskString(stringValue) : '-';
        return (
            <View key={label} style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>{label}:</Text>
                <Text
                    style={[styles.infoValue, { color: textColor, flex: 1, textAlign: 'right', marginLeft: 10, fontSize: 13 }]}
                    selectable={true}
                >
                    {displayValue}
                </Text>
            </View>
        );
    };

    const renderInfoRow = (label, value) => (
        <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>{label}:</Text>
            <Text style={[styles.infoValue, { color: textColor }]}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <View style={[styles.header, { backgroundColor: cardBackgroundColor }]}>
                <TouchableOpacity
                    onPress={() => navigation && navigation.goBack()}
                    style={styles.backButton}>
                    <Text style={[styles.backButtonText, { color: primaryColor }]}>← Back</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: textColor }]}>Package Info</Text>

                <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
                    <TouchableOpacity onPress={handleCopy} style={{ marginRight: 15 }}>
                        <Text style={{ color: primaryColor, fontWeight: '600' }}>Copy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare}>
                        <Text style={{ color: primaryColor, fontWeight: '600' }}>Share</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* 1. App Info Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>App Information</Text>
                    <View style={[styles.infoCard, { backgroundColor: cardBackgroundColor }]}>
                        {renderInfoRow('Name', packageJson.name || '-')}
                        {renderInfoRow('Version', packageJson.version || '-')}
                        {renderInfoRow('Version Code', packageJson.versionCode || '-')}
                        {renderInfoRow('App ID', packageJson.appId || '-')}
                    </View>
                </View>

                {/* 2. Device Information Section (NEW) */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Device Information</Text>
                    <View style={[styles.infoCard, { backgroundColor: cardBackgroundColor }]}>
                        {renderInfoRow('Model', deviceData.model)}
                        {renderInfoRow('OS', deviceData.os)}
                        {renderInfoRow('Battery', deviceData.battery)}
                        {renderInfoRow('IP Address', deviceData.ip)}
                    </View>
                </View>

                {/* 3. Config Values Section */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={[styles.sectionTitle, { color: textColor, marginBottom: 0 }]}>Config Values</Text>
                        {onReload && (
                            <TouchableOpacity onPress={onReload} disabled={loading}>
                                <Text style={{ color: primaryColor, fontSize: 14 }}>Reload</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={[styles.infoCard, { backgroundColor: cardBackgroundColor }]}>
                        {loading ? (
                            <SkeletonPlaceholder>
                                <View style={{ flexDirection: "column" }}>
                                    <View style={{ width: "100%", height: 20, marginBottom: 10, borderRadius: 4 }} />
                                    <View style={{ width: "100%", height: 20, marginBottom: 10, borderRadius: 4 }} />
                                    <View style={{ width: "100%", height: 60, borderRadius: 4 }} />
                                </View>
                            </SkeletonPlaceholder>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : (
                            <>
                                <View style={styles.infoRow}>
                                    <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Environment:</Text>
                                    <Text style={[styles.infoValue, { fontWeight: 'bold', color: primaryColor }]}>
                                        {environmentName}
                                    </Text>
                                </View>
                                {Object.entries(configValues).map(([key, value]) => {
                                    const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                    return renderConfigRow(label, value);
                                })}
                            </>
                        )}
                    </View>
                </View>

                {/* 4. Build Information Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Build Information</Text>
                    <View style={[styles.infoCard, { backgroundColor: cardBackgroundColor }]}>
                        {renderInfoRow('Build Date', buildInfo.buildDate ? moment(buildInfo.buildDate).format('YYYY-MM-DD HH:mm:ss') : 'Unknown')}
                        {renderInfoRow('Commit Hash', buildInfo.commitHash || '-')}
                        {renderInfoRow('Author', buildInfo.commitAuthor || 'Unknown')}
                        {renderInfoRow('Branch', buildInfo.commitBranch || 'Unknown')}
                    </View>
                </View>

                {/* 5. Dependencies Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                        Dependencies ({packageJson.dependencies ? Object.keys(packageJson.dependencies).length : 0})
                    </Text>
                    <View style={[styles.dependenciesCard, { backgroundColor: cardBackgroundColor }]}>
                        {packageJson.dependencies && Object.entries(packageJson.dependencies).map(([name, version]) =>
                            renderDependency(name, version),
                        )}
                    </View>
                </View>

                {/* 6. Dev Dependencies Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                        Dev Dependencies ({packageJson.devDependencies ? Object.keys(packageJson.devDependencies).length : 0})
                    </Text>
                    <View style={[styles.dependenciesCard, { backgroundColor: cardBackgroundColor }]}>
                        {packageJson.devDependencies && Object.entries(packageJson.devDependencies).map(([name, version]) =>
                            renderDependency(name, version),
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 10,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoCard: {
        borderRadius: 10,
        padding: 15,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 15,
        fontWeight: '500',
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
        marginBottom: 20,
    },
    dependencyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    packageName: {
        fontSize: 14,
        flex: 1,
        fontWeight: '500',
    },
    packageVersion: {
        fontSize: 14,
        marginLeft: 10,
    },
    errorContainer: {
        padding: 10,
        backgroundColor: '#ffebee',
        borderRadius: 5,
        alignItems: 'center',
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 14,
        textAlign: 'center',
    },
});
