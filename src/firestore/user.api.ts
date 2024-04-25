import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useFirestoreDocument } from './useFirestore';
import { useAuth } from '../providers/AuthProvider';

/**
 * Helper functions for doc/collection references
 */
const USER_COLLECTION = 'users';

export const getUserCollection = () => firestore().collection<FitQuest.User>(USER_COLLECTION);
export const getUserDocument = (uid: string) => getUserCollection().doc(uid);

/**
 * Hook for live updates
 */
export const useUser = () => {
    const { user } = useAuth();
    const document = user ? getUserDocument(user.uid) : null;
    
    return useFirestoreDocument(document);
}

/**
 * CRUD operations
 */
export const createUser = (uid: string, data: FitQuest.User) => {
    return getUserDocument(uid).set(data);
}
export const editUser = (uid: string, data: Parameters<FirebaseFirestoreTypes.DocumentReference['update']>[1]) => {
    return getUserDocument(uid).update(data);
}
