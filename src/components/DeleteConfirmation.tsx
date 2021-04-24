import React from 'react';

import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { SvgFromUri } from 'react-native-svg';
import { PlantProps } from '../libs/storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface DeleteConfirmationProps {
    plant: PlantProps;
    onCancel: () => void;
    onDelete: () => void;
}

export function DeleteConfirmation({ plant, onCancel, onDelete }: DeleteConfirmationProps) {
    return (
        <>
            <RectButton style={styles.overlay} onPress={onCancel} /> 

            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.imageContainer}>
                        <SvgFromUri
                            width={100}
                            height={100} 
                            uri={plant.photo}
                        />
                    </View>

                    <Text style={styles.text}>
                        Deseja mesmo deletar sua <Text style={styles.plantName}>{plant.name}</Text>?
                    </Text>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={onCancel}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.button} onPress={onDelete}>
                            <Text style={styles.buttonTextCancel}>Deletar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        backgroundColor: "#000",
        opacity: 0.6,
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 98
    },
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 99,
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 55,
    },
    content: {
        width: '100%',
        padding: 32,
        backgroundColor: colors.background,
        borderRadius: 20,
        alignItems: 'center',
    },
    imageContainer: {
        padding: 22,
        backgroundColor: colors.shape,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.text,
        lineHeight: 25,
        fontSize: 17,
        marginTop: 17
    },
    plantName: {
        fontWeight: 'bold'
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 24
    },
    button: {
        width: 120,
        height: 56,
        backgroundColor: colors.shape,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        color: colors.heading,
        fontSize: 15,
        fontFamily: fonts.text
    },
    buttonTextCancel: {
        color: colors.red,
        fontSize: 15,
        fontFamily: fonts.text
    }
});