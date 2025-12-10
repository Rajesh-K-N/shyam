export const cyclePhases = {
    menstrual: {
        title: "Menstrual Phase",
        description: "Your uterus is shedding its lining. Energy levels are typically at their lowest.",
        symptoms: [
            "Cramps & Lower Back Pain",
            "Fatigue & Low Energy",
            "Bloating",
            "Mood Swings"
        ],
        bestPractices: [
            "Rest & Sleep: Prioritize 8+ hours of sleep.",
            "Gentle Movement: Light walking or restorative yoga.",
            "Nutrition: Iron-rich foods (spinach, lentils) and warm teas.",
            "Self-Care: Use a warm compress for cramps."
        ],
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
    },
    follicular: {
        title: "Follicular Phase",
        description: "Estrogen is rising as your body prepares for ovulation. You may feel a boost in energy and creativity.",
        symptoms: [
            "Increased Energy",
            "Clearer Skin",
            "Higher Libido",
            "Optimistic Mood"
        ],
        bestPractices: [
            "Exercise: Great time for HIIT or strength training.",
            "Socialize: You're likely feeling more outgoing.",
            "Nutrition: Fermented foods and fresh vegetables.",
            "Planning: Tackle complex tasks and start new projects."
        ],
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
    },
    ovulation: {
        title: "Ovulation Phase",
        description: "Peak fertility. Estrogen and testosterone are at their highest levels.",
        symptoms: [
            "Peak Energy & Confidence",
            "Mild Pelvic Pain (Mittelschmerz)",
            "Heightened Senses",
            "Increased Body Temperature"
        ],
        bestPractices: [
            "Activity: High-intensity workouts or group classes.",
            "Connection: Plan dates or important meetings.",
            "Nutrition: Anti-inflammatory foods (berries, nuts).",
            "Hydration: Drink plenty of water."
        ],
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
    },
    luteal: {
        title: "Luteal Phase",
        description: "Progesterone rises. If not pregnant, PMS symptoms may start to appear as the cycle ends.",
        symptoms: [
            "Breast Tenderness",
            "Bloating & Water Retention",
            "Food Cravings",
            "Anxiety or Irritability"
        ],
        bestPractices: [
            "Exercise: Switch to pilates or moderate cardio.",
            "Nutrition: Magnesium-rich foods (dark chocolate, bananas).",
            "Wellness: Prioritize stress management and early bedtimes.",
            "Avoid: Excessive caffeine and salty foods."
        ],
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200"
    }
};

export const getPhaseDetails = (dayInCycle, cycleLength, periodLength) => {
    if (dayInCycle < periodLength) {
        return cyclePhases.menstrual;
    } else if (dayInCycle >= cycleLength - 14 - 2 && dayInCycle <= cycleLength - 14 + 2) {
        return cyclePhases.ovulation;
    } else if (dayInCycle > periodLength && dayInCycle < cycleLength - 14 - 2) {
        return cyclePhases.follicular;
    } else {
        return cyclePhases.luteal;
    }
};

export const getPregnancyChance = (dayInCycle, cycleLength) => {
    const ovulationDay = cycleLength - 14;

    if (dayInCycle === ovulationDay) {
        return { label: "Very High", percent: "33%", color: "text-purple-600" };
    } else if (dayInCycle >= ovulationDay - 2 && dayInCycle < ovulationDay) {
        return { label: "High", percent: "25-30%", color: "text-purple-500" };
    } else if (dayInCycle >= ovulationDay - 5 && dayInCycle < ovulationDay - 2) {
        return { label: "Medium", percent: "10-15%", color: "text-blue-500" };
    } else if (dayInCycle === ovulationDay + 1) {
        return { label: "Low", percent: "5%", color: "text-yellow-500" };
    } else {
        return { label: "Very Low", percent: "<1%", color: "text-gray-500" };
    }
};
