import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { AssetType } from "../api/variables.api";

declare global {
    namespace FitQuest {
        interface User {
            firstName: string;
            lastName: string;
            level: number;
            points: number;
            lifetimePoints: number;
            workoutDays: Record<number, FirebaseFirestoreTypes.DocumentReference<Routine> | null>;
            workoutTime: number;

            streak: number;
            streakStartDate: string | null;
            streakNextDate: string | null;

            rpm: {
                id: string | null;
                token: string | null;
                templateId: string | null;
                avatarId: string | null;
                gender: 'male' | 'female' | null;
                assets: Record<string, string> | null;
            };

            avatars: {
                avatarId: string;
                templateId: string;
                gender: 'male' | 'female';
                assets: Record<string, string>;
            }[];
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

        interface UnlockedAsset {
            type: string;
            id: string;
        }
    }
}
