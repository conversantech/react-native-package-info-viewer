import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DebugButton = ({
    visible = true,
    onPress,
    buttonStyle,
    textStyle
}) => {
    if (!visible) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, buttonStyle]}
                onPress={onPress}
            >
                <Text style={[styles.text, textStyle]}>Check Info</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    }
});

export default DebugButton;
