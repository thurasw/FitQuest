import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useFirestoreDocument } from './useFirestore';
import { useAuth } from '../providers/AuthProvider';

/**
 * Helper functions for doc/collection references
 */
const USER_COLLECTION = 'users';

export const getUserCollection = () => firestore().collection<FitQuest.User>(USER_COLLECTION);
export const getUserDocument = (uid: string) => getUserCollection().doc(uid);

export const isSetupComplete = (user?: FitQuest.User) => {
    return user !== undefined && user.workoutTime !== 0 && user.rpm.id !== null && user.rpm.token !== null && user.rpm.avatarId !== null && user.rpm.assets !== null && user.rpm.gender !== null;
}

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
export const editUser = (
    uid: string,
    data: Record<string, any>
) => {
    return getUserDocument(uid).update(data);
}
