import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

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