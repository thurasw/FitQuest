import { Suspense } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import * as Device from 'expo-device';

interface AvatarModel3DProps {
    url: string;
}
export default function AvatarModel3D({ url }: AvatarModel3DProps) {

    if (!Device.isDevice) {
        return (
            <Text className='font-2xl'>
                { url }
            </Text>
        )
    }

    return (
        <Suspense fallback={<ActivityIndicator />}>
            <Canvas frameloop='demand'>
                <directionalLight color='white' position={[5,-10,50]} intensity={2.5} />
                <Model url={url} />
            </Canvas>
        </Suspense>
    )
}

function Model({ url } : AvatarModel3DProps) {
    const gltf = useGLTF(url, false, false);
    return <primitive object={gltf.scene} scale={17} position={[0,-10,0]} />
}
