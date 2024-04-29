import firestore, { FirebaseFirestoreTypes }from '@react-native-firebase/firestore';
import { QueryFn, useFirestoreCollection } from './useFirestore';
import { useAuth } from '../providers/AuthProvider';
import { getUserDocument } from './user.api';
import { calculateStreakNextDate } from '../utils/points.utils';

/**
 * Helper functions for doc/collection references
 */
const LOG_COLLECTION = 'logs';
const LOG_EXERCISES_COLLECTION = 'exercises';

export const getLogCollection = (uid: string) => {
    return getUserDocument(uid).collection(LOG_COLLECTION) as FirebaseFirestoreTypes.CollectionReference<FitQuest.LogEntry>;
}
export const getLogEntryDocument = (uid: string, logEntryId: string) => {
    return getLogCollection(uid).doc(logEntryId);
};

export const getLogExerciseCollection = (uid: string, logEntryId: string) => {
    return getLogEntryDocument(uid, logEntryId).collection(LOG_EXERCISES_COLLECTION) as FirebaseFirestoreTypes.CollectionReference<FitQuest.LogExercise>;
}

/**
 * Hook for live updates
 */
export const useLogEntries = (query?: QueryFn<FitQuest.LogEntry>) => {
    const { user } = useAuth();
    const collection = user ? getLogCollection(user.uid) : null;
    
    return useFirestoreCollection(collection, query);
}
export const useLogExercises = (logEntryId: string) => {
    const { user } = useAuth();
    const doc = user ? getLogExerciseCollection(user.uid, logEntryId) : null;
    
    return useFirestoreCollection(doc);

}

/**
 * CRUD operations
 */
export const createLogEntry = (
    uid: string,
    entry: FitQuest.LogEntry,
    exercises: FitQuest.LogExercise[],
    user: FitQuest.User
) => {
    // Create new batch instance
    const batch = getUserDocument(uid).firestore.batch();
    
    // Create log entry
    const logEntriesRef = getLogCollection(uid).doc();
    batch.set(logEntriesRef, entry);

    // Create log exercises
    exercises.forEach((exercise) => {
        const exerciseRef = getLogExerciseCollection(uid, logEntriesRef.id).doc();
        batch.set(exerciseRef, exercise);
    });

    /**
     * Update user details
     */
    const userRef = getUserDocument(uid);
    const userObj = {
        points: firestore.FieldValue.increment(entry.point_awarded),
        lifetimePoints: firestore.FieldValue.increment(entry.point_awarded),
        streakNextDate: calculateStreakNextDate(user),
        streakStartDate: user.streakStartDate
    } as any;
    
    // If streak has been broken OR streak has not started yet
    const today = new Date().toISOString().split('T')[0];

    if (user.streakNextDate === today) {
        userObj.streak = firestore.FieldValue.increment(1);
    }
    if (user.streakNextDate !== today || !user.streakStartDate) {
        userObj.streakStartDate = today;
        userObj.streak = 1;
    }
    batch.update(userRef, userObj);
    return batch.commit();
}
