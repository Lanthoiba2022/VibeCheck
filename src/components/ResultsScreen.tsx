import React, { useEffect, useState, useRef } from 'react';
import { VibeResult } from '@/data/quizData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Share2, Send, Sparkles, Download, Image as ImageIcon, Facebook, Instagram } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { UserInfo } from './QuizContainer';
import html2canvas from 'html2canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface ResultsScreenProps {
  result: VibeResult;
  onRestartQuiz: () => void;
  onSaveAndShareVibe: (result: VibeResult, userInfo: UserInfo | null) => Promise<void>;
  userInfo: UserInfo | null;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onRestartQuiz, onSaveAndShareVibe, userInfo }) => {
  const [hasSavedOrAttemptedSave, setHasSavedOrAttemptedSave] = useState(false);
  const [showSocialDialog, setShowSocialDialog] = useState(false);
  const [socialProfiles, setSocialProfiles] = useState({
    instagram: '',
    twitter: '',
    facebook: '',
    displayName: userInfo?.username || '',
    isAnonymous: false
  });
  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger confetti when the results screen appears
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      angle: 90,
      startVelocity: 40,
      ticks: 300,
      colors: ['#FF69B4', '#9370DB', '#FFD700', '#1E90FF', '#FFFFFF']
    });
    confetti({
      particleCount: 70,
      spread: 160,
      origin: { y: 0.8 },
      angle: 90,
      startVelocity: 30,
      ticks: 200,
      gravity: 0.7,
      drift: 0.5,
      scalar: 1.2,
      shapes: ['square', 'circle'],
      colors: ['#FFC0CB', '#E6E6FA', '#FFFACD', '#ADD8E6']
    });
  }, []);

  const getGenderSpecificTitle = () => {
    if (result.id === 'softBoi') {
      if (userInfo?.gender === 'boi') return 'Soft Boi Era 🌸';
      if (userInfo?.gender === 'gurl') return 'Soft Gurl Era 🌸';
      return 'Soft Era 🌸';
    }
    return result.title;
  };

  const handleDownloadImage = async () => {
    if (resultCardRef.current) {
      try {
        // Create a temporary div for the image
        const tempDiv = document.createElement('div');
        tempDiv.className = 'fixed top-0 left-0 -z-50';
        tempDiv.innerHTML = `
          <div class="w-screen h-screen flex items-center justify-center ${result.color || 'bg-primary'} relative">
            <div class="absolute inset-0 bg-black/30"></div>
            <div class="w-full max-w-5xl mx-auto p-8 md:p-12 text-white text-center relative z-10">
              <div class="mb-8">
                <p class="text-2xl md:text-3xl font-semibold text-white mb-4">${userInfo?.username || 'Anonymous'}</p>
                <p class="text-4xl md:text-5xl font-semibold text-white mb-8">Your Vibe Today Is...</p>
                <h1 class="text-5xl md:text-7xl font-display text-white drop-shadow-lg mb-8 break-words">
                  ${result.emoji} ${getGenderSpecificTitle()}
                </h1>
                <p class="text-xl md:text-2xl mb-6 italic font-medium break-words">"${result.quote}"</p>
                <p class="text-lg md:text-xl mb-8 font-medium break-words">${result.description}</p>
              </div>
              <div class="mt-12 pt-8 border-t border-white/40">
                <p class="text-lg md:text-xl text-white">Find your vibe at vibe-check-v1.vercel.app ✨</p>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(tempDiv);

        const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
          backgroundColor: null,
          scale: 2,
          width: window.innerWidth,
          height: window.innerHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          logging: false,
          useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = `vibe-check-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Clean up
        document.body.removeChild(tempDiv);
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const handleShowcase = async () => {
    setShowSocialDialog(true);
  };

  const handleSocialSubmit = async () => {
    if (!hasSavedOrAttemptedSave && userInfo && result) {
      const updatedUserInfo = {
        ...userInfo,
        ...socialProfiles,
        expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString() // 12 hours from now
      };
      await onSaveAndShareVibe(result, updatedUserInfo);
      setHasSavedOrAttemptedSave(true);
      setShowSocialDialog(false);
    }
  };

  const handleShareAndSave = async (platform: 'twitter' | 'whatsapp' | 'facebook' | 'instagram') => {
    // Remove saving on share, only share
    const shareBaseUrl = window.location.origin;
    const shareText = `I got ${getGenderSpecificTitle()} on the Vibe Check quiz! What's your aura today? ✨ Check it out!`;
    let url = '';

    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareBaseUrl)}`;
    } else if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareBaseUrl)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareBaseUrl)}&quote=${encodeURIComponent(shareText)}`;
    } else if (platform === 'instagram') {
      // Instagram doesn't support direct sharing via URL, so we'll copy to clipboard
      await navigator.clipboard.writeText(shareText + ' ' + shareBaseUrl);
      toast({
        title: "Copied to clipboard! 📋",
        description: "Paste this in your Instagram story or post",
      });
      return;
    }
    
    window.open(url, '_blank');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 md:p-6 text-white">
      <Card ref={resultCardRef} className={`w-full max-w-2xl ${result.color || 'bg-primary'} shadow-vibrant-lg rounded-2xl p-6 md:p-8 relative overflow-hidden`}>
        <CardHeader className="pb-4">
          <div className="absolute top-4 right-4 text-white/80 animate-float">
            <Sparkles size={32} />
          </div>
          <CardDescription className="text-lg font-semibold text-white/80">
            Your Vibe Today Is...
          </CardDescription>
          <CardTitle className="text-5xl md:text-6xl font-display text-white drop-shadow-md mt-2">
            {result.emoji} {getGenderSpecificTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-white">
          <p className="text-xl md:text-2xl mb-4 italic">"{result.quote}"</p>
          <p className="text-md md:text-lg mb-6">{result.description}</p>
          
          <div className="my-6">
            <p className="text-sm text-white/80 mb-3">Share your vibe & add it to the gallery! 👇</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button 
                onClick={() => handleShareAndSave('twitter')} 
                variant="outline" 
                className="w-full bg-white/20 hover:bg-white/30 border-white/50 text-white rounded-lg text-md py-3 px-5 transition-transform transform hover:scale-105"
              >
                <Share2 size={18} className="mr-2" /> X
              </Button>
              <Button 
                onClick={() => handleShareAndSave('whatsapp')} 
                variant="outline" 
                className="w-full bg-white/20 hover:bg-white/30 border-white/50 text-white rounded-lg text-md py-3 px-5 transition-transform transform hover:scale-105"
              >
                <Send size={18} className="mr-2" /> WhatsApp
              </Button>
              <Button 
                onClick={() => handleShareAndSave('facebook')} 
                variant="outline" 
                className="w-full bg-white/20 hover:bg-white/30 border-white/50 text-white rounded-lg text-md py-3 px-5 transition-transform transform hover:scale-105"
              >
                <Facebook size={18} className="mr-2" /> Facebook
              </Button>
              <Button 
                onClick={() => handleShareAndSave('instagram')} 
                variant="outline" 
                className="w-full bg-white/20 hover:bg-white/30 border-white/50 text-white rounded-lg text-md py-3 px-5 transition-transform transform hover:scale-105"
              >
                <Instagram size={18} className="mr-2" /> Instagram
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
            <Button
              onClick={handleDownloadImage}
              variant="outline"
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 border-white/50 text-white rounded-lg text-md py-3 px-5 transition-transform transform hover:scale-105"
            >
              <Download size={18} className="mr-2" /> Download Image
            </Button>
            <Button
              onClick={handleShowcase}
              variant="outline"
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 border-white/50 text-white rounded-lg text-md py-3 px-5 transition-transform transform hover:scale-105"
            >
              <ImageIcon size={18} className="mr-2" /> Showcase My Vibe
            </Button>
          </div>

          <Button
            onClick={onRestartQuiz}
            className="bg-white/90 hover:bg-white text-gray-800 font-bold text-lg py-3 px-6 rounded-xl shadow-md transition-transform transform hover:scale-105 active:scale-95 mt-6 w-full"
          >
            Play Again? 🔁
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showSocialDialog} onOpenChange={setShowSocialDialog}>
        <DialogContent className="bg-card/90 backdrop-blur-md text-white border-primary/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Showcase Your Vibe! ✨</DialogTitle>
            <DialogDescription className="text-white/80">
              Add your social profiles (optional) to showcase your vibe in our gallery
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={socialProfiles.displayName}
                onChange={(e) => setSocialProfiles(prev => ({ ...prev, displayName: e.target.value }))}
                className="bg-background/50 border-primary/50 text-white"
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
              <Input
                id="instagram"
                value={socialProfiles.instagram}
                onChange={(e) => setSocialProfiles(prev => ({ ...prev, instagram: e.target.value }))}
                className="bg-background/50 border-primary/50 text-white"
                placeholder="@username"
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter Handle (Optional)</Label>
              <Input
                id="twitter"
                value={socialProfiles.twitter}
                onChange={(e) => setSocialProfiles(prev => ({ ...prev, twitter: e.target.value }))}
                className="bg-background/50 border-primary/50 text-white"
                placeholder="@username"
              />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook Profile (Optional)</Label>
              <Input
                id="facebook"
                value={socialProfiles.facebook}
                onChange={(e) => setSocialProfiles(prev => ({ ...prev, facebook: e.target.value }))}
                className="bg-background/50 border-primary/50 text-white"
                placeholder="facebook.com/username"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAnonymous"
                checked={socialProfiles.isAnonymous}
                onChange={(e) => setSocialProfiles(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                className="rounded border-primary/50"
              />
              <Label htmlFor="isAnonymous">Show as Anonymous</Label>
            </div>
            <Button
              onClick={handleSocialSubmit}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-3 px-6 rounded-xl shadow-md transition-transform transform hover:scale-105 active:scale-95"
            >
              Showcase My Vibe! ✨
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultsScreen;
