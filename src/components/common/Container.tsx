import { ViewProps, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ContainerProps extends ViewProps {
    children: React.ReactNode;
    statusBarPadding?: boolean;
}

export default function Container({ children, statusBarPadding = true, ...props } : ContainerProps) {

    const insets = useSafeAreaInsets();
    const insetStyle = statusBarPadding ? {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 20,
        paddingRight: insets.right + 20
    } : {};

    return (
        <LinearGradient
            {...props}
            style={
                StyleSheet.compose([style.container, insetStyle], props.style)
            }
            colors={['#151515', '#030A19']}
        >
            { children }
        </LinearGradient>
    )
};

const style = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent'
    }
});
