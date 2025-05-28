import React, { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import QuestionCard from './QuestionCard';
import ResultsScreen from './ResultsScreen';
import PreQuizForm, { PreQuizFormData } from './PreQuizForm';
import { quizQuestions, vibeResults, QuizQuestion, QuizOption, VibeResult, UserGender } from '@/data/quizData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import type { Database } from '@/integrations/supabase/types';

type QuizState = 'preQuiz' | 'welcome' | 'question' | 'results';

export interface UserInfo extends PreQuizFormData {}

interface QuizContainerProps {
  onStartQuiz: () => Promise<void>;
  onCompleteQuiz?: () => void;
}

const QuizContainer: React.FC<QuizContainerProps> = ({ onStartQuiz, onCompleteQuiz }) => {
  const [quizState, setQuizState] = useState<QuizState>('preQuiz');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [finalVibe, setFinalVibe] = useState<VibeResult | null>(null);

  useEffect(() => {
    console.log("QuizContainer mounted. Current state:", quizState, "User Info:", userInfo);
  }, [quizState, userInfo]);

  const handlePreQuizSubmit = (data: PreQuizFormData) => {
    console.log("Pre-quiz form submitted:", data);
    setUserInfo(data);
    setQuizState('welcome');
  };

  const handleStartQuiz = async () => {
    console.log("Starting quiz (from welcome screen)...");
    await onStartQuiz();
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFinalVibe(null);
    setQuizState('question');
  };

  const handleRestartQuiz = () => {
    console.log("Restarting quiz...");
    setUserInfo(null); // Clear user info
    setFinalVibe(null); // Clear final vibe
    setUserAnswers({}); // Clear answers
    setCurrentQuestionIndex(0); // Reset question index
    setQuizState('preQuiz'); // Go back to the pre-quiz form
    onCompleteQuiz?.(); // Mark quiz as completed when restarting
  };

  const determineDominantVibe = (answers: Record<string, number>): VibeResult => {
    console.log("Determining dominant vibe with answers:", answers);
    let dominantVibeId = '';
    let maxPoints = -Infinity;

    if (Object.keys(answers).length === 0) {
      console.log("No answers provided, selecting a random vibe.");
      const randomIndex = Math.floor(Math.random() * vibeResults.length);
      dominantVibeId = vibeResults[randomIndex].id;
    } else {
      for (const vibe in answers) {
        if (answers[vibe] > maxPoints) {
          maxPoints = answers[vibe];
          dominantVibeId = vibe;
        }
      }
    }
    const result = vibeResults.find(v => v.id === dominantVibeId) || vibeResults[0];
    console.log("Dominant vibe determined:", result.title);
    return result;
  };

  const saveSubmissionToDb = async (currentVibe: VibeResult, currentUserInfo: UserInfo | null) => {
    console.log("Attempting to save submission. Vibe:", currentVibe, "User Info:", currentUserInfo);
    if (!currentUserInfo) {
      console.error("User info is missing, cannot save submission.");
      toast({
        title: "Oops!",
        description: "User information was missing. Cannot save your vibe to the gallery.",
        variant: "destructive",
      });
      return;
    }
    if (!currentVibe) {
      console.error("Vibe result is missing, cannot save submission.");
       toast({
        title: "Oops!",
        description: "Vibe result was missing. Cannot save your vibe to the gallery.",
        variant: "destructive",
      });
      return;
    }

    const rating = Math.floor(Math.random() * 3) + 8; // Random rating 8-10

    const submissionData = {
      username: currentUserInfo.isAnonymous ? 'Anonymous' : (currentUserInfo.displayName || currentUserInfo.username),
      age: currentUserInfo.age || 0,
      gender: currentUserInfo.gender === 'prefer_not_to_say' ? 'other' : currentUserInfo.gender || 'other',
      vibe_id: currentVibe.id,
      rating: rating,
      instagram_handle: currentUserInfo.instagram || '',
      twitter_handle: currentUserInfo.twitter || '',
      facebook_handle: currentUserInfo.facebook || '',
      display_on_leaderboard: !currentUserInfo.isAnonymous
    };

    console.log("Submitting to Supabase:", submissionData);
    const { data, error } = await supabase
      .from('quiz_submissions')
      .insert(submissionData)
      .select();

    if (error) {
      console.error('Error saving submission to Supabase:', error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Couldn't save your vibe to the gallery. " + error.message,
        variant: "destructive",
      });
    } else {
      console.log('Submission saved successfully to gallery:', data);
      toast({
        title: "Vibe Saved! 💖",
        description: "Your vibe is now in the gallery!",
      });
    }
  };

  const handleAnswer = (selectedOption: QuizOption) => {
    console.log("Answered with:", selectedOption.text, "Points:", selectedOption.vibePoints);
    const updatedAnswers = { ...userAnswers };
    for (const vibe in selectedOption.vibePoints) {
      updatedAnswers[vibe] = (updatedAnswers[vibe] || 0) + selectedOption.vibePoints[vibe];
    }
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question answered, determine vibe but don't save yet
      const determinedVibe = determineDominantVibe(updatedAnswers);
      setFinalVibe(determinedVibe);
      setQuizState('results');
      onCompleteQuiz?.(); // Mark quiz as completed when reaching results
    }
  };
  
  // calculateResults is no longer called directly to save. Its logic is split.
  // const calculateResults = async (answers: Record<string, number>, currentUserInfo: UserInfo | null) => { ... }

  const renderContent = () => {
    switch (quizState) {
      case 'preQuiz':
        return <PreQuizForm onSubmit={handlePreQuizSubmit} />;
      case 'welcome':
        return <WelcomeScreen onStartQuiz={handleStartQuiz} />;
      case 'question':
        if (currentQuestionIndex < quizQuestions.length) {
          return (
            <QuestionCard
              question={quizQuestions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quizQuestions.length}
            />
          );
        }
        // Fallback, should ideally not be reached if logic is correct
        return <WelcomeScreen onStartQuiz={handleStartQuiz} />; 
      case 'results':
        if (finalVibe) {
          return (
            <ResultsScreen 
              result={finalVibe} 
              onRestartQuiz={handleRestartQuiz}
              onSaveAndShareVibe={saveSubmissionToDb} // Pass the save function
              userInfo={userInfo} // Pass user info for saving
            />
          );
        }
        return <p className="text-white text-center p-10">Calculating your vibe... hang tight! 🤔</p>;
      default:
        return <PreQuizForm onSubmit={handlePreQuizSubmit} />;
    }
  };

  return <div className="w-full h-full">{renderContent()}</div>;
};

export default QuizContainer;
