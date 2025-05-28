import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { vibeResults } from '@/data/quizData';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useLocation } from 'react-router-dom';

interface GallerySubmission {
  id: string;
  username: string;
  vibe_id: string;
  instagram_handle: string | null;
  twitter_handle: string | null;
  facebook_handle: string | null;
  created_at: string;
  display_on_leaderboard: boolean;
}

const Gallery: React.FC = () => {
  const location = useLocation();
  const [submissions, setSubmissions] = useState<GallerySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    dragFree: true,
    containScroll: 'trimSnaps'
  });
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Only show gallery on landing page and result page
  const shouldShowGallery = location.pathname === '/' || location.pathname === '/results';

  const autoplay = useCallback(() => {
    if (!emblaApi || hoveredCardId) return;
    emblaApi.scrollNext();
  }, [emblaApi, hoveredCardId]);

  useEffect(() => {
    const interval = setInterval(autoplay, 1300); // Even slower interval for smoother scrolling
    return () => clearInterval(interval);
  }, [autoplay]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_submissions')
          .select('*')
          .eq('display_on_leaderboard', true)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching submissions:', error);
          return;
        }

        setSubmissions(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (shouldShowGallery) {
      fetchSubmissions();
    }

    // Subscribe to real-time updates
    const channel = supabase
      .channel('quiz_submissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_submissions'
        },
        (payload) => {
          if (payload.new && (payload.new as GallerySubmission).display_on_leaderboard) {
            setSubmissions(prev => [payload.new as GallerySubmission, ...prev].slice(0, 20));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shouldShowGallery]);

  if (!shouldShowGallery) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p className="text-white/80">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl md:text-4xl font-display text-white text-center mb-8">
        Vibe Gallery ✨
      </h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {submissions.map((submission) => {
            const vibe = vibeResults.find(v => v.id === submission.vibe_id);
            if (!vibe) return null;

            return (
              <div 
                key={submission.id} 
                className="flex-[0_0_350px] min-w-0 mx-4"
                onMouseEnter={() => setHoveredCardId(submission.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <Card className={`${vibe.color} shadow-vibrant-lg relative overflow-hidden group h-[280px] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-xl font-bold tracking-tight flex items-center gap-2 whitespace-nowrap">
                      <span className="flex-shrink-0">{vibe.emoji}</span>
                      <span className="truncate">{vibe.title}</span>
                    </CardTitle>
                    <p className="text-white/80 text-sm mt-2 line-clamp-2">
                      {vibe.description}
                    </p>
                  </CardHeader>
                  <CardContent className="text-white">
                    <p className="text-lg mb-4 font-medium tracking-wide">{submission.username}</p>
                    <div className="flex space-x-4">
                      <a
                        href={submission.instagram_handle ? `https://instagram.com/${submission.instagram_handle.replace('@', '')}` : 'https://instagram.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110 ${!submission.instagram_handle && 'opacity-50'}`}
                      >
                        <Instagram size={20} />
                      </a>
                      <a
                        href={submission.twitter_handle ? `https://twitter.com/${submission.twitter_handle.replace('@', '')}` : 'https://twitter.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110 ${!submission.twitter_handle && 'opacity-50'}`}
                      >
                        <Twitter size={20} />
                      </a>
                      <a
                        href={submission.facebook_handle ? `https://facebook.com/${submission.facebook_handle}` : 'https://facebook.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110 ${!submission.facebook_handle && 'opacity-50'}`}
                      >
                        <Facebook size={20} />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gallery; 