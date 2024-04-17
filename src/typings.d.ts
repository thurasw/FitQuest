import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

declare global {
    namespace FitQuest {
        interface User {
            dateOfBirth: string;
            firstName: string;
            lastName: string;
            level: number;
            points: number;
            workoutDays: number[];
            workoutTime: number;
        }
    }
}