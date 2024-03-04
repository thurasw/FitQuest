import React, { useMemo, useState } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { useController, Control, FieldValues, Path } from 'react-hook-form';

// TS generics to extract accurate typings for fieldName
interface FormInputProps<T extends FieldValues> extends TextInputProps {
    control: Control<T>;
    fieldName: Path<T>;
}

export default function FormInput<T extends FieldValues>({ control, fieldName, ...props }: FormInputProps<T>) {

    const { field, fieldState } = useController({
        control,
        name: fieldName
    });

    const [ isFocused, setIsFocused ] = useState(false);

    const borderColor = useMemo(() => {
        if (fieldState.invalid && fieldState.isTouched) {
            return 'crimson';
        } else if (isFocused) {
            return '#4c4c4c';
        } else {
            return 'transparent';
        }
    }, [ isFocused, fieldState.invalid, fieldState.isTouched ])

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, { borderColor }]}
                placeholderTextColor='#5c5c5c'
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    field.onBlur();
                }}
                value={field.value}
                onChangeText={field.onChange}
                {...props}
            />
            {fieldState.invalid && fieldState.isTouched && fieldState.error?.message && (
                <Text style={styles.error}>
                    {fieldState.error?.message}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    input: {
        borderRadius: 6,
        borderWidth: 1,
        color: 'white',
        backgroundColor: 'black',
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 17
    },
    error: {
        color: 'crimson',
        marginTop: 5,
    },
});
