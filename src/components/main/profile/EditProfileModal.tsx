import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { View, Text, Alert, Modal } from 'react-native';
import { useAuth } from '../../../providers/AuthProvider';
import { editUser } from '../../../firestore/user.api';
import FQButton from '../../common/FQButton';
import FormInput from '../../common/FormInput';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface EditProfileModalProps {
    show: boolean;
    onClose: () => void;
}

const signupSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
});
export default function EditProfileModal({ show, onClose }: EditProfileModalProps) {
    return (
        <Modal
            visible={show}
            onRequestClose={onClose}
            presentationStyle='pageSheet'
            animationType='slide'
        >
            
        </Modal>
    )
}