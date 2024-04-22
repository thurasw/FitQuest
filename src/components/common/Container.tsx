import { ViewProps, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ContainerProps extends ViewProps {
    children: React.ReactNode;
    statusBarPadding?: boolean;
}

export default function Container({ children, className, statusBarPadding = false, ...props } : ContainerProps) {

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
            className={`flex flex-col flex-grow w-full bg-slate-100 ${className}`}
            style={
                StyleSheet.compose(insetStyle, props.style)
            }
        >
            { children }
        </View>
    )
};
