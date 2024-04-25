import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useFirestoreCollection } from './useFirestore';
import { useAuth } from '../providers/AuthProvider';
import { getUserDocument } from './user.api';

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
export const useLogEntries = () => {
    const { user } = useAuth();
    const collection = user ? getLogCollection(user.uid) : null;
    
    return useFirestoreCollection(collection);
}
export const useLogExercises = (logEntryId: string) => {
    const { user } = useAuth();
    const doc = user ? getLogExerciseCollection(user.uid, logEntryId) : null;
    
    return useFirestoreCollection(doc);

}

/**
 * CRUD operations
 */
export const createLogEntry = (uid: string, entry: FitQuest.LogEntry, exercises: FitQuest.LogExercise[]) => {
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
    return batch.commit();
}

export const calculatePointsToAward = (user: FitQuest.User, percent_completed: number) => {
    // Calculate points to award
    const pointsTOAward : Array<{ points: number; message: string; }> = [];
    if (percent_completed === 100) {
        pointsTOAward.push({
            points: 100,
            message: 'Full workout completion'
        });
    }
    else {
        pointsTOAward.push({
            points: 80,
            message: 'Partial workout completion'
        });
    }

    //Streak bonuses
    const streakPeriod = !user.streakStartDate ? 0 : new Date().getTime() - new Date(user.streakStartDate).getTime();
    const streakPeriodInDays = Math.floor(streakPeriod / (1000 * 60 * 60 * 24));

    if (user.streakNextDate === new Date().toISOString().split('T')[0]) {
        pointsTOAward.push({
            points: 50,
            message: 'Streak bonus'
        });
    }
    if (streakPeriodInDays === 0) {
        pointsTOAward.push({
            points: 10,
            message: 'Starting streak bonus'
        });
    }
    else if (streakPeriodInDays % 30 === 0) {
        const bonus = streakPeriodInDays / 30;
        pointsTOAward.push({
            points: 2000 * bonus,
            message: bonus === 1 ? '30-day streak bonus' : `${bonus}-month streak bonus`
        });
    }
    else if (streakPeriodInDays % 7 === 0) {
        const bonus = streakPeriodInDays / 7;
        pointsTOAward.push({
            points: 500 * bonus,
            message: bonus === 1 ? '7-day streak bonus' : `${bonus}-week streak bonus`
        });
    }
    return pointsTOAward;
}
