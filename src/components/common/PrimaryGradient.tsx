import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { OpaqueColorValue, StyleProp, StyleSheet, Text, TextProps, TextStyle } from "react-native";
import { Ionicons } from '@expo/vector-icons';

// background-color: #663dff; background-image: linear-gradient(319deg, #663dff 0%, #aa00ff 37%, #cc4499 100%);
export default function PrimaryGradient(props: Omit<LinearGradientProps, 'colors'>) {
    return (
        <LinearGradient
            colors={['#663dff', '#aa00ff', '#cc4499']}
            locations={[0, 0.63, 1]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.95, y: 1 }}
            {...props}
        />
    )
};

interface GradientTextProps extends TextProps {
    text: string;
}
export function GradientText({ text, ...props } : GradientTextProps) {

    const mask = (
        <Text {...props}>{text}</Text>
    );
    const child = (
        <Text {...props} style={StyleSheet.compose(props.style, { opacity: 0 })}>{text}</Text>
    );
    
    return (
        <MaskedView maskElement={mask}>
            <PrimaryGradient>
                { child }
            </PrimaryGradient>
        </MaskedView>
    )
}

interface IconProps extends React.JSX.IntrinsicAttributes {
    name: unknown;
    size?: number | undefined;
    color?: string | OpaqueColorValue | undefined;
    style?: StyleProp<TextStyle>;
}
interface GradientIconProps<P extends IconProps> {
    Icon: React.ComponentType<P>;
    iconProps: P;
}

export function GradientIcon<P extends IconProps>({ iconProps, Icon }: GradientIconProps<P>) {
    const mask = (
        <Icon {...iconProps} />
    );

    const child = (
        <Icon {...iconProps} style={StyleSheet.compose(iconProps.style, { opacity: 0 })} />
    );

    return (
        <MaskedView maskElement={mask}>
            <PrimaryGradient>
                { child }
            </PrimaryGradient>
        </MaskedView>
    )
}
