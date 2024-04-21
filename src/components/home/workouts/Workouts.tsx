import React, { useState } from "react";
import { Text } from "react-native";
import Container from "../../common/Container";
import FQButton from "../../common/FQButton";
import CreateWorkoutModal from "./CreateWorkoutModal";

const workout_routines_example = [
    {
        name: "Chest Day",
        exercies: [
            {
                name: "Bench Press",
                sets: [
                    {
                        reps: 15
                    },
                    {
                        reps: 10
                    }
                ],
                volume: '100kg'
            },
            {
                name: "Incline Bench Press",
                sets: [
                    {
                        reps: 15
                    },
                    {
                        reps: 10
                    }
                ],
                volume: '80kg'
            },
            {
                name: "Treadmill",
                volume: '15 minutes'
            }
        ]
    }
]

interface Exercise {
    name: string;
    sets?: { reps: number }[];
    volume?: string;
}

interface WorkoutRoutine {
    name: string;
    exercises: Exercise[];
}

export default function Workouts() {

    const [ showCreate, setShowCreate ] = useState(false);

    return (
        <Container>
            <Text>Workouts</Text>
            
            <FQButton
                variant='primary'
                label="Create Workout"
                onPress={() => setShowCreate(true)}
            />
            <CreateWorkoutModal show={showCreate} onClose={() => setShowCreate(false)} />
            
        </Container>
    );
}