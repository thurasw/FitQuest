import { TouchableOpacity, TouchableOpacityProps, StyleSheet, Text, TextProps, StyleProp, ViewStyle } from "react-native";
import PrimaryGradient from "./PrimaryGradient";

interface FQButtonProps extends TouchableOpacityProps {
    textProps?: TextProps;
    label?: string;
    Gradient?: React.FC<{ children: React.ReactNode; style: StyleProp<ViewStyle> }>;
}

export default function FQButton({ className, label, textProps, Gradient, ...props } : FQButtonProps) {

    const content = (
        props.children || (
            <Text {...textProps}>
                {label}
            </Text>
        )
    );

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            {...props}
            className={
                `border-2 border-transparent ${className}`
            }
            style={StyleSheet.compose(Gradient !== undefined ? {} : styles.container, props.style)}
        >
            { Gradient !== undefined ? (
                <Gradient style={styles.container}>
                    {content}
                </Gradient>
            ) : content }
        </TouchableOpacity>
    )
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
