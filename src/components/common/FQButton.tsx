import { TouchableOpacity, TouchableOpacityProps, StyleSheet, Text } from "react-native";
import stylesheet from "../../stylesheet";
import PrimaryGradient from "./PrimaryGradient";

interface FQButtonProps extends TouchableOpacityProps {
    variant: 'primary' | 'primary_outline' | 'primary_gradient' | 'white' | 'transparent';
    label?: string;
    labelFontSize?: number;
}

export default function FQButton({ variant, label, labelFontSize, ...props } : FQButtonProps) {

    const isGradient = () => {
        return variant === 'primary_gradient';
    };

    const content = (
        props.children || (
            <Text
                style={{
                    fontSize: labelFontSize || 15,
                    color: variants[variant].color
                }}
            >
                { label }
            </Text>
        )
    );

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            {...props}
            style={StyleSheet.compose([
                isGradient() ? {} : styles.container,
                {
                    borderWidth: 2,
                    borderColor: 'transparent'
                },
                variants[variant]
            ], props.style)}
        >
            { isGradient() ? (
                <PrimaryGradient style={styles.container}>
                    {content}
                </PrimaryGradient>
            ) : content }
        </TouchableOpacity>
    )
};

const variants = {
    primary: {
        backgroundColor: stylesheet.colors.primary,
        color: 'black'
    },
    primary_outline: {
        backgroundColor: 'transparent',
        color: stylesheet.colors.primary,
        borderColor: stylesheet.colors.primary
    },
    primary_gradient: {
        backgroundColor: 'transparent',
        color: 'black',
    },
    white: {
        backgroundColor: 'white',
        color: 'black'
    },
    transparent: {
        backgroundColor: 'transparent',
        color: 'white'
    }
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
