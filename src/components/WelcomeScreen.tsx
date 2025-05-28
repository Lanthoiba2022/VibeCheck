
import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

interface WelcomeScreenProps {
  onStartQuiz: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartQuiz }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 text-white">
      <div className="bg-card/70 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-vibrant-lg max-w-lg w-full">
        <h1 className="text-5xl md:text-7xl font-display mb-4 animate-float">
          Vibe Check!
        </h1>
        <p className="text-2xl md:text-4xl font-display mb-6 text-primary-foreground opacity-90">
          What’s Your Aura Today? ✨
        </p>
        <p className="text-lg md:text-xl mb-8 opacity-80">
          Answer some Qs, spill the tea ☕, and find your daily vibe. Let's get this bread! 🍞💅
        </p>
        <Button
          onClick={onStartQuiz}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl py-4 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95 animate-bounce"
          size="lg"
        >
          It's Giving... Quiz Time!
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;

