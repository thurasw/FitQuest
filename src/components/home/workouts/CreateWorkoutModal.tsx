import { Modal, StyleSheet, View, Pressable, Text } from "react-native";

interface CreateWorkoutModalProps {
    show: boolean;
    onClose: () => void;
}

export default function CreateWorkoutModal({ show, onClose }: CreateWorkoutModalProps) {
    return (
        <Modal
            visible={show}
            animationType='slide'
            presentationStyle='pageSheet'
            onRequestClose={onClose}
        >
            <View >
                
            </View>
        </Modal>
    )
}
