import { ViewProps, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ContainerProps extends ViewProps {
    children: React.ReactNode;
    statusBarPadding?: boolean;
}

export default function Container({ children, statusBarPadding = false, ...props } : ContainerProps) {

    const insets = useSafeAreaInsets();
    const insetStyle = statusBarPadding ? {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 20,
        paddingRight: insets.right + 20
    } : {};

    return (
        <View
            {...props}
            style={
                StyleSheet.compose([style.container, insetStyle], props.style)
            }
        >
            { children }
        </View>
    )
};

const style = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '100%',
        backgroundColor: '#E7EEF6'
    }
});
