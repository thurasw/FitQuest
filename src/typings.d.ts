import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

declare global {
    namespace FitQuest {
        interface User {
            dateOfBirth: string;
            firstName: string;
            lastName: string;
            level: number;
            points: number;
            setup_complete: boolean;
            workout_days: number[];
            streak_start: FirebaseFirestoreTypes.Timestamp | null;
        }
    }
}