import React, { useMemo, useState } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps, ViewProps } from 'react-native';
import { useController, Control, FieldValues, Path } from 'react-hook-form';

// TS generics to extract accurate typings for fieldName
interface FormInputProps<T extends FieldValues> extends TextInputProps {
    control: Control<T>;
    fieldName: Path<T>;
    containerProps?: ViewProps;
}

export default function FormInput<T extends FieldValues>({ control, fieldName, className, containerProps, ...props }: FormInputProps<T>) {

    const { field, fieldState } = useController({
        control,
        name: fieldName
    });

    return (
        <View className='mb-3' {...containerProps}>
            <TextInput
                className={`rounded-lg border p-3 text-black bg-slate-100 ${ fieldState.invalid && fieldState.isTouched ? 'border-red-500' : 'border-transparent focus:border-slate-300' } ${className}`}
                placeholderTextColor='#5c5c5c'
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                {...props}
            />
            {fieldState.invalid && fieldState.isTouched && fieldState.error?.message && (
                <Text className='text-red-500 mt-2'>
                    {fieldState.error?.message}
                </Text>
            )}
        </View>
    );
};
