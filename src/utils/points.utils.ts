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

/**
 * Calculate the user's current level based on their lifetime points
 * 1-999: Level 1
 * 1000-2499: Level 2
 * 2500-4999: Level 3
 * 5000-7499: Level 4
 * 7500-12499: Level 5
 * 12500-17499: Level 6
 * 17500-24999: Level 7
 * 25000-34999: Level 8
 * 35000-49999: Level 9
 * 50000+: Level 10
 */
const levelPoints = [
    0, 1000, 2500, 5000, 7500, 12500, 17500, 25000, 35000, 50000
];
export const getCurrentLevel = (lifetimePoints: number) => {
    for (let i = 0; i < levelPoints.length; i++) {
        if (lifetimePoints < levelPoints[i]) {
            return i;
        }
    }
    return levelPoints.length;
}

export const getRequiredPoints = (lifetimePoints: number) => {
    const currentLevel = getCurrentLevel(lifetimePoints);
    return levelPoints[currentLevel] - lifetimePoints;
}

export const getLevelProgress = (lifetimePoints: number) => {
    const currentLevel = getCurrentLevel(lifetimePoints);
    const nextLevelPoints = levelPoints[currentLevel];
    const prevLevelPoints = levelPoints[currentLevel - 1] || 0;
    return (lifetimePoints - prevLevelPoints) / (nextLevelPoints - prevLevelPoints);
}

export const getLevelImage = (level: number) => {
    if (level <= 1) return require('../../assets/badges/level-1.png');
    if (level === 2) return require('../../assets/badges/level-2.png');
    if (level === 3) return require('../../assets/badges/level-3.png');
    if (level === 4) return require('../../assets/badges/level-4.png');
    if (level === 5) return require('../../assets/badges/level-5.png');
    if (level === 6) return require('../../assets/badges/level-6.png');
    if (level === 7) return require('../../assets/badges/level-7.png');
    if (level === 8) return require('../../assets/badges/level-8.png');
    if (level === 9) return require('../../assets/badges/level-9.png');
    return require('../../assets/badges/level-10.png');
}