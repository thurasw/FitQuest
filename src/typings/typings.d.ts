import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

declare global {
    namespace FitQuest {
        interface User {
            dateOfBirth: string;
            firstName: string;
            lastName: string;
            level: number;
            points: number;
            workoutDays: Record<number, FirebaseFirestoreTypes.DocumentReference<Routine> | null>;
            workoutTime: number;

            streak: number;
            streakStartDate: string | null;
            streakNextDate: string | null;
        }

        interface Routine {
            name: string;
            isDefault: boolean;
            exercises: Exercise[];
        }
        interface Exercise {
            name: string;
            sets: Set[];
            amount: string;
        }
        interface Set {
            reps: number;
        }

        interface LogEntry {
            date: FirebaseFirestoreTypes.Timestamp;
            point_awarded: number;
            routineName: string;
        }
        interface LogExercise {
            name: string;
            reps: number;
        }
    }
}