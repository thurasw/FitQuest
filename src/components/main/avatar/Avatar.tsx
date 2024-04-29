import { Platform, ScrollView, Text, View, useWindowDimensions } from "react-native";
import Container from "../../common/Container";
import FQButton from "../../common/FQButton";
import AvatarEditorModal from "./AvatarEditorModal";
import { useState } from "react";
import { useUser } from "../../../firestore/user.api";

export default function Avatar() {

    const [ showEditor, setShowEditor ] = useState(false);
    // const { userData } = useUser();

    const { width } = useWindowDimensions();
    const cardWidth = width * 0.8;
    const cardSpacing = width * 0.1 - 10; /* 10 is the margin set on the card component */
    
    return (
        <Container className='py-5'>
            <View>
                {/* <FQButton
                    className='bg-primary-900'
                    textProps={{ className: 'text-white' }}
                    label='Edit Avatar'
                    onPress={() => setShowEditor(true)}
                />
                <AvatarEditorModal show={showEditor} onClose={() => setShowEditor(false)} /> */}

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={0}
                    snapToInterval={cardWidth+10}
                    snapToAlignment='center'
                    contentInset={{
                        top: 0,
                        left: cardSpacing,
                        bottom: 0,
                        right: cardSpacing
                    }}
                    contentContainerStyle={{
                        // `contentInset` alternative for android
                        paddingHorizontal: Platform.OS === 'android' ? cardSpacing : 0
                    }}
                >
                    {Array(10).fill(null).map((_, idx) => <AvatarCard key={idx} width={cardWidth} />)}
                </ScrollView>
            </View>

            <View className='px-5'>
                <FQButton
                    label='Set as active'
                    className='bg-slate-900 mt-5'
                    style={{ borderRadius: 50 }}
                    textProps={{ className: 'text-white' }}
                    onPress={() => {}}
                />
            </View>
        </Container>
    )
};

interface AvatarCardProps {
    width: number;
}
function AvatarCard({ width }: AvatarCardProps) {
    return (
        <View
            style={{ width, height: 500, margin: 5 }}
            className='bg-slate-900 rounded-xl flex flex-col items-center justify-center'
        >
            <Text>Avatar</Text>
        </View>
    )
}