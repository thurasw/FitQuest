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
    if (user.streakNextDate === new Date().toISOString().split('T')[0]) {
        pointsTOAward.push({
            points: 50,
            message: 'Streak bonus'
        });

        const streakPeriod = user.streak + 1;
        if (streakPeriod % 30 === 0) {
            const bonus = streakPeriod / 30;
            pointsTOAward.push({
                points: 2000 * bonus,
                message: bonus === 1 ? '30-day streak bonus' : `${bonus}-month streak bonus`
            });
        }
        else if (streakPeriod % 7 === 0) {
            const bonus = streakPeriod / 7;
            pointsTOAward.push({
                points: 500 * bonus,
                message: bonus === 1 ? '7-day streak bonus' : `${bonus}-week streak bonus`
            });
        }
    }
    if (!user.streak || !user.streakStartDate) {
        pointsTOAward.push({
            points: 10,
            message: 'Starting streak bonus'
        });
    }
    return pointsTOAward;
}

export const calculateStreakNextDate = ({ workoutDays } : { workoutDays: FitQuest.User['workoutDays'] }) => {
    const days = Object.entries(workoutDays)
    .filter(([,v]) => v !== null)
    .map(([k]) => Number(k))
    .sort((a, b) => a - b)
    
    // No workout days
    if (days.length === 0) return null;

    // First workout day after today OR the first workout day next week
    const today = new Date().getDay();
    const incrementUntil = days.find(d => d > today) || days[0];

    const date = new Date();
    do {
        date.setDate(date.getDate() + 1);
    } while (date.getDay() !== incrementUntil);

    return date.toISOString().split('T')[0];
}