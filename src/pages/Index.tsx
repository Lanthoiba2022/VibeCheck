import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizContainer from '@/components/QuizContainer';
import Gallery from '@/components/Gallery';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type SiteStats = Database['public']['Tables']['site_stats']['Row'];

const LoadingEmojis = () => {
  const emojis = ['✨', '🎵', '🎨', '🎭', '🎪', '🎯'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % emojis.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-6xl animate-bounce">{emojis[currentIndex]}</div>
      <div className="text-white text-2xl font-display animate-pulse">
        Loading your vibe check...
      </div>
      <div className="flex gap-2">
        {emojis.map((emoji, index) => (
          <span
            key={index}
            className={`text-2xl transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100' : 'opacity-30'
            }`}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};

const Index = () => {
  const [vibeCheckedCount, setVibeCheckedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  const incrementVibeCheckedCount = async () => {
    setIsQuizLoading(true);
    // Update UI immediately
    setVibeCheckedCount(prev => prev + 1);

    try {
      const { data: currentData } = await supabase
        .from('site_stats')
        .select('id, visitor_count')
        .single();

      if (currentData) {
        const newCount = (currentData.visitor_count || 0) + 1;
        const { error } = await supabase
          .from('site_stats')
          .update({ visitor_count: newCount })
          .eq('id', currentData.id);

        if (error) {
          console.error('Error updating count:', error);
          setVibeCheckedCount(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error('Error in incrementVibeCheckedCount:', error);
      setVibeCheckedCount(prev => prev - 1);
    } finally {
      setIsQuizLoading(false);
    }
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data } = await supabase
          .from('site_stats')
          .select('visitor_count')
          .single();
        
        if (data) {
          setVibeCheckedCount(data.visitor_count);
        }
      } catch (error) {
        console.error('Error fetching count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();

    const channel = supabase
      .channel('visitor_count_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_stats'
        },
        (payload) => {
          if (payload.new && 'visitor_count' in payload.new) {
            setVibeCheckedCount(payload.new.visitor_count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {isQuizLoading && (
        <div className="fixed inset-0 bg-gradient-to-t from-black/50 via-black/50 to-transparent backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="relative">
              <LoadingEmojis />
            </div>
          </div>
        </div>
      )}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-display text-white flex items-center gap-2">
            <img src="/vibelogo.png" alt="Vibe Logo" className="h-8 w-auto" />
            Vibe Check ✨
          </div>
          <div className="text-white/80 text-sm">
            <span className="animate-pulse">👥</span>{' '}
            {isLoading ? '...' : vibeCheckedCount.toLocaleString()} vibe checked
          </div>
        </div>
      </header>
      <div className="flex-1 pt-24">
        <div className="w-full flex-grow flex items-center justify-center py-12 md:py-16">
          <QuizContainer onStartQuiz={incrementVibeCheckedCount} />
        </div>
        <div className="w-full mt-8 md:mt-12 bg-gradient-to-t from-black/50 via-black/50 to-transparent">
          <Gallery />
        </div>
      </div>
      <footer className="w-full py-12 md:py-16 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} Vibe Check. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

