export const gitaQuotes = [
    {
        quote: "You have the right to work, but for the work's sake only. You have no right to the fruits of work.",
        explanation: "Focus on your duty and action, not on the outcome. Detachment from results brings peace.",
        source: "Chapter 2, Verse 47"
    },
    {
        quote: "The soul is neither born, and does it ever die; nor having once been, does it ever cease to be.",
        explanation: "The soul is eternal and indestructible. Understanding this removes the fear of death and change.",
        source: "Chapter 2, Verse 20"
    },
    {
        quote: "Yoga is the journey of the self, through the self, to the self.",
        explanation: "True spirituality is an inner journey of self-discovery and connection with the divine within.",
        source: "Chapter 6, Verse 20"
    },
    {
        quote: "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.",
        explanation: "A disciplined mind is steady and focused, unaffected by the winds of desire and distraction.",
        source: "Chapter 6, Verse 19"
    },
    {
        quote: "There is neither this world, nor the world beyond, nor happiness for the one who doubts.",
        explanation: "Doubt destroys faith and peace. Confidence and faith are essential for success and happiness.",
        source: "Chapter 4, Verse 40"
    },
    {
        quote: "A person can rise through the efforts of his own mind; or draw himself down, in the same manner. Because each person is his own friend or enemy.",
        explanation: "Your mind is your greatest tool. Controlled, it is your friend; uncontrolled, it is your enemy.",
        source: "Chapter 6, Verse 5"
    },
    {
        quote: "Delusion arises from anger. The mind is bewildered by delusion. Reasoning is destroyed when the mind is bewildered. One falls down when reasoning is destroyed.",
        explanation: "Anger clouds judgment and leads to downfall. Maintaining calmness is key to wisdom.",
        source: "Chapter 2, Verse 63"
    },
    {
        quote: "He who has no attachments can really love others, for his love is pure and divine.",
        explanation: "True love is free from selfish attachment and expectation. It is liberating and universal.",
        source: "General Teaching"
    },
    {
        quote: "Perform your obligatory duty, because action is indeed better than inaction.",
        explanation: "Idleness leads to stagnation. Fulfilling your responsibilities is the path to growth.",
        source: "Chapter 3, Verse 8"
    },
    {
        quote: "The peace of God is with them whose mind and soul are in harmony, who are free from desire and wrath, who know their own soul.",
        explanation: "Inner peace comes from self-knowledge and freedom from negative emotions.",
        source: "Chapter 5, Verse 26"
    }
];

export const getDailyQuote = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    return gitaQuotes[dayOfYear % gitaQuotes.length];
};
