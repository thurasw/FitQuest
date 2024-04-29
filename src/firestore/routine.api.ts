import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { QueryFn, useFirestoreCollection, useFirestoreDocument } from './useFirestore';
import { useAuth } from '../providers/AuthProvider';
import { getUserDocument } from './user.api';

/**
 * Helper functions for doc/collection references
 */
const ROUTINE_COLLECTION = 'routines';

export const getRoutineCollection = (uid: string) => {
    return getUserDocument(uid).collection(ROUTINE_COLLECTION) as FirebaseFirestoreTypes.CollectionReference<FitQuest.Routine>;
}
export const getRoutineDocument = (uid: string, routineId: string) => {
    return getRoutineCollection(uid).doc(routineId);
};

/**
 * Hook for live updates
 */
export const useRoutines = (query?: QueryFn<FitQuest.Routine>) => {
    const { user } = useAuth();
    let collection = user ? getRoutineCollection(user.uid) : null;
    
    return useFirestoreCollection(collection, query);
}

export const useRoutine = (routineId: string | null) => {
    const { user } = useAuth();
    const doc = (user && routineId) ? getRoutineDocument(user.uid, routineId) : null;
    
    return useFirestoreDocument(doc);
}

/**
 * CRUD operations
 */
export const createRoutine = (uid: string, data: FitQuest.Routine) => {
    return getRoutineCollection(uid).add(data);
}
export const editRoutine = (uid: string, routineId: string, data: Partial<FitQuest.Routine>) => {
    return getRoutineDocument(uid, routineId).update(data);
}
export const deleteRoutine = (uid: string, routineId: string) => {
    return getRoutineDocument(uid, routineId).delete();
}
