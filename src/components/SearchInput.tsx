/*
 * Componente feito à parte
 * Com o objetivo de filtrar as plantas pelo nome também.
*/

import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface InputProps extends TextInputProps {
    onClickClear: () => void
}

export function SearchInput({ onChangeText, onClickClear, ...rest }: InputProps) {
    const [active, setActive] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    function handleInputFocus(){
        setActive(true);
    }

    function handleInputBlur(){
        setActive(false);
    }
    
    function handleChangeText(value: string) {

        if(onChangeText) 
            onChangeText(value);

        if (value) 
            setIsFilled(true);
        else
            setIsFilled(false);
    }

    function handleClearPress() {
        setIsFilled(false);
        onClickClear();
    }

    return(
        <View style={[
                styles.container, 
                active && styles.containerActive,
            ]}>
            <TextInput
                style={styles.input}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChangeText={handleChangeText}
                {...rest}
            />
            {isFilled
            ? (
                <Feather 
                    name="x" 
                    style={[
                        styles.icon, 
                        styles.clearIcon
                    ]} 
                    onPress={handleClearPress} 
                />
            ): (
                <Feather
                    name="search" 
                    style={[
                        styles.icon,
                        active && styles.iconActive
                    ]}
                />
            )
        }
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.shape,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 34,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.gray
    },
    containerActive: {
        borderColor: colors.green
    },
    icon: {
        color: colors.gray,
        fontSize: 24,
        marginRight: 10
    },
    clearIcon: {
        color: colors.red
    },
    iconActive: {
        color: colors.green,
    },
    input: {
        fontFamily: fonts.text,
        color: colors.heading,
        flex: 1,
        paddingLeft: 10
    }
});