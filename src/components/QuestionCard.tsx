import React from 'react';
import { QuizQuestion, QuizOption } from '@/data/quizData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswer: (selectedOption: QuizOption) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, questionNumber, totalQuestions }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient-bg" />
      <Card className="w-full max-w-xl bg-card/80 backdrop-blur-md shadow-vibrant-lg rounded-2xl relative z-10 transform transition-all duration-500 hover:scale-[1.02]">
        <CardHeader className="text-center pb-4">
          <CardDescription className="text-sm text-white/80">
            Question {questionNumber} of {totalQuestions}
          </CardDescription>
          <CardTitle className="text-3xl md:text-4xl font-display text-white drop-shadow-lg mt-2">
            {question.icon && (
              <span className="mr-2 inline-block animate-bounce">
                {question.icon}
              </span>
            )}
            {question.questionText}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3 md:space-y-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => onAnswer(option)}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 md:py-4 px-3 md:px-5 rounded-xl 
                           border-2 border-primary/60 bg-primary/10 backdrop-blur-sm 
                           text-white text-base md:text-lg whitespace-normal
                           transition-all duration-200 ease-in-out
                           hover:bg-primary/30 hover:border-primary hover:scale-[1.02] hover:shadow-md
                           focus:bg-primary/30 focus:border-primary focus:scale-[1.02] focus:ring-2 focus:ring-primary/70 focus:shadow-md"
              >
                {option.emoji && <span className="text-xl md:text-2xl mr-2 md:mr-3 flex-shrink-0">{option.emoji}</span>}
                <span className="flex-1 break-words">{option.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionCard;
