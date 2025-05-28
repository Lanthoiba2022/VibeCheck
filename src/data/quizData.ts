export interface QuizOption {
  text: string;
  emoji?: string;
  vibePoints: Record<string, number>; // e.g., { mainCharacter: 1, softBoi: 0 }
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  options: QuizOption[];
  icon?: string; // For a leading icon/emoji for the question
}

export interface VibeResult {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string; // Tailwind color class e.g., 'bg-vibe-pink'
  quote: string;
}

export type UserGender = 'boi' | 'gurl' | 'non_binary' | 'other' | 'prefer_not_to_say';

export const genderOptions: { value: UserGender; label: string }[] = [
  { value: 'boi', label: 'Boi' },
  { value: 'gurl', label: 'Gurl' },
  { value: 'non_binary', label: 'Non-Binary' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    questionText: "Pick your ultimate red flag 🚩 in a friend:",
    icon: "🧠",
    options: [
      { text: "Bad taste in memes", emoji: "😂", vibePoints: { chaoticFun: 2, lowkeyChill: 1 } },
      { text: "Slow texter", emoji: "⏳", vibePoints: { mainCharacter: 1, softBoi: 1 } },
      { text: "Self-obsessed", emoji: "🪞", vibePoints: { mainCharacter: -1, unapologeticallyExtra: 1 } },
      { text: "Never brings snacks", emoji: "🍿", vibePoints: { chaoticFun: 1, lowkeyChill: 2 } },
    ],
  },
  {
    id: 2,
    questionText: "Your go-to chaos meal is:",
    icon: "🍔",
    options: [
      { text: "Instant noodles at 3 AM", emoji: "🍜", vibePoints: { chaoticFun: 2, softBoi: 1 } },
      { text: "Cereal for dinner", emoji: "🥣", vibePoints: { lowkeyChill: 2, softBoi: 1 } },
      { text: "Anything with extra hot sauce", emoji: "🌶️", vibePoints: { unapologeticallyExtra: 2, chaoticFun: 1 } },
      { text: "A perfectly curated charcuterie board... for one", emoji: "🧀", vibePoints: { mainCharacter: 2, lowkeyChill: 1 } },
    ],
  },
  {
    id: 3,
    questionText: "Weekend plans just got cancelled. Your reaction?",
    icon: "🗓️",
    options: [
      { text: "YES! Pajamas all day.", emoji: "😴", vibePoints: { softBoi: 2, lowkeyChill: 2 } },
      { text: "Time to call the backup squad!", emoji: "👯‍♀️", vibePoints: { unapologeticallyExtra: 2, chaoticFun: 1 } },
      { text: "Finally, time for my 10-step skincare routine.", emoji: "🧖‍♀️", vibePoints: { mainCharacter: 2, softBoi: 1 } },
      { text: "Spontaneously plan a solo adventure.", emoji: "✈️", vibePoints: { chaoticFun: 1, mainCharacter: 1 } },
    ],
  },
  {
    id: 4,
    questionText: "Choose your fighter (aka your spirit emoji):",
    icon: "💥",
    options: [
      { text: "💅 (Sassy & fabulous)", vibePoints: { unapologeticallyExtra: 2, mainCharacter: 1 } },
      { text: "💀 (Ironically unbothered)", vibePoints: { chaoticFun: 2, lowkeyChill: 1 } },
      { text: "🌸 (Soft & sweet)", vibePoints: { softBoi: 2, lowkeyChill: 1 } },
      { text: "✨ (Manifesting greatness)", vibePoints: { mainCharacter: 2, unapologeticallyExtra: 1 } },
    ],
  },
  {
    id: 5,
    questionText: "Your phone battery is at 13%. You:",
    icon: "🔋",
    options: [
      { text: "Panic! Find a charger ASAP.", emoji: "😱", vibePoints: { mainCharacter: 1, unapologeticallyExtra: 1 } },
      { text: "Eh, it'll last. *continues scrolling*", emoji: "📱", vibePoints: { chaoticFun: 2, lowkeyChill: 2 } },
      { text: "Low power mode, baby. Strategic survival.", emoji: "💡", vibePoints: { lowkeyChill: 1, softBoi: 1 } },
      { text: "It's a sign to disconnect. Nature walk!", emoji: "🌿", vibePoints: { softBoi: 2, mainCharacter: 1 } },
    ],
  },
];

export const vibeResults: VibeResult[] = [
  {
    id: "mainCharacter",
    title: "Main Character Energy 💅",
    description: "You're the star of your own show, and we're all just living in it. Keep shining!",
    emoji: "🌟",
    color: "bg-vibe-yellow",
    quote: "I'm not bossy, I am the boss.",
  },
  {
    id: "softBoi",
    title: "Soft Era 🌸",
    description: "Gentle, thoughtful, and probably loves a good aesthetic. Cozy vibes only.",
    emoji: "🧸",
    color: "bg-vibe-pink",
    quote: "Be kind, rewind (your favorite comfort movie).",
  },
  {
    id: "chaoticFun",
    title: "Agent of Chaotic Fun ✨",
    description: "You bring the party, the memes, and a little bit of delightful chaos wherever you go.",
    emoji: "🎉",
    color: "bg-vibe-green",
    quote: "Embrace the glorious mess that you are.",
  },
  {
    id: "lowkeyChill",
    title: "Lowkey Chill Master 😌",
    description: "Unbothered. Moisturized. Happy. In your lane. Focused. Flourishing.",
    emoji: "🧘",
    color: "bg-vibe-blue",
    quote: "My vibe is pretty, and my vibe is chill.",
  },
  {
    id: "unapologeticallyExtra",
    title: "Unapologetically Extra 💖",
    description: "You're not too much, they're not enough. Own that fabulousness!",
    emoji: "💎",
    color: "bg-vibe-purple",
    quote: "Too glam to give a damn.",
  },
];
