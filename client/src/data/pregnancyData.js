export const trimesterData = {
    1: {
        title: "First Trimester",
        range: "Weeks 1-12",
        description: "The first trimester is a time of rapid growth and development. Your baby's major organs and body systems are forming.",
        whatToExpect: "You may experience morning sickness, fatigue, and breast tenderness. Your body is working hard to support the pregnancy.",
        bestPractices: [
            "Take prenatal vitamins with folic acid daily.",
            "Stay hydrated and eat small, frequent meals.",
            "Avoid raw meat, fish, and unpasteurized dairy.",
            "Schedule your first prenatal appointment."
        ]
    },
    2: {
        title: "Second Trimester",
        range: "Weeks 13-26",
        description: "Often called the 'honeymoon phase' of pregnancy. Nausea usually subsides, and you may feel more energetic.",
        whatToExpect: "You'll start to show a baby bump and may feel your baby move (quickening).",
        bestPractices: [
            "Monitor your weight gain.",
            "Start doing Kegel exercises.",
            "Moisturize your belly to help with stretching skin.",
            "Sign up for childbirth education classes."
        ]
    },
    3: {
        title: "Third Trimester",
        range: "Weeks 27-40+",
        description: "The home stretch! Your baby is gaining weight and preparing for birth.",
        whatToExpect: "You might feel more uncomfortable due to the baby's size. Braxton Hicks contractions may start.",
        bestPractices: [
            "Pack your hospital bag.",
            "Install the car seat.",
            "Monitor baby's movements (kick counts).",
            "Rest as much as possible."
        ]
    }
};

export const getWeeklyInsights = (weeks) => {
    if (weeks < 4) return {
        size: "Poppy Seed",
        development: "Fertilization and implantation are happening. The neural tube is starting to form.",
        tip: "Avoid alcohol and smoking."
    };
    if (weeks < 8) return {
        size: "Blueberry",
        development: "Heart is beating. Arms and legs are budding. Facial features are forming.",
        tip: "Combat nausea with ginger or crackers."
    };
    if (weeks < 12) return {
        size: "Lime",
        development: "Fingers and toes are distinct. Vital organs are functioning.",
        tip: "Schedule your nuchal translucency scan if desired."
    };
    if (weeks < 16) return {
        size: "Avocado",
        development: "Baby can make facial expressions. Skeleton is hardening.",
        tip: "You might feel 'flutters' of movement."
    };
    if (weeks < 20) return {
        size: "Banana",
        development: "Baby can hear sounds. Hair and eyebrows are growing.",
        tip: "Time for the anatomy scan ultrasound!"
    };
    if (weeks < 24) return {
        size: "Ear of Corn",
        development: "Baby is practicing breathing movements. Sense of balance is developing.",
        tip: "Watch for signs of preterm labor."
    };
    if (weeks < 28) return {
        size: "Eggplant",
        development: "Eyes can open and close. Baby has a sleep-wake cycle.",
        tip: "Glucose screening test is usually done now."
    };
    if (weeks < 32) return {
        size: "Squash",
        development: "Baby is gaining fat. Lanugo (soft hair) starts to fall off.",
        tip: "Start counting kicks daily."
    };
    if (weeks < 36) return {
        size: "Honeydew Melon",
        development: "Lungs are nearly fully matured. Baby is positioning head-down.",
        tip: "Review your birth plan with your doctor."
    };
    return {
        size: "Watermelon",
        development: "Baby is fully developed and ready to meet the world!",
        tip: "Rest and wait for labor signs."
    };
};
