import { TouchableOpacity, TouchableOpacityProps, StyleSheet, Text } from "react-native";
import stylesheet from "../../stylesheet";

interface FQButtonProps extends TouchableOpacityProps {
    variant: 'primary' | 'white';
    label?: string;
    labelFontSize?: number;
}

export default function FQButton({ variant, label, labelFontSize, ...props } : FQButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            {...props}
            style={StyleSheet.compose([
                styles.button,
                styles[variant]
            ], props.style)}
        >
            { label === undefined ? props.children : (
                <Text style={{ fontSize: labelFontSize || 15 }}>{ label }</Text>
            )}
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    primary: {
        backgroundColor: stylesheet.colors.primary,
        color: 'black'
    },
    white: {
        backgroundColor: 'white',
        color: 'black'
    }
});
