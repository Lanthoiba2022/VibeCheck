import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming these are available
import { UserGender, genderOptions } from '@/data/quizData';

export interface PreQuizFormData {
  username: string;
  age: number | null;
  gender: UserGender | null;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  displayName?: string;
  isAnonymous?: boolean;
}

interface PreQuizFormProps {
  onSubmit: (data: PreQuizFormData) => void;
}

const PreQuizForm: React.FC<PreQuizFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<UserGender | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Spill the tea! We need your name (or a cool alias). 😉');
      return;
    }
    setError('');
    onSubmit({
      username: username.trim(),
      age: age ? parseInt(age, 10) : null,
      gender,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white">
      <Card className="bg-card/70 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-vibrant-lg max-w-lg w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl md:text-5xl font-display mb-2">
            Quick Q! 🤔
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-primary-foreground/80">
            Help us vibe with you better!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-lg font-medium text-primary-foreground/90">
                Your Name/Alias ✨
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., VibeMasterFlex"
                className="mt-2 bg-background/50 border-primary/50 text-white placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <Label htmlFor="age" className="text-lg font-medium text-primary-foreground/90">
                Age (Optional) 🎂
              </Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 21"
                min="1"
                className="mt-2 bg-background/50 border-primary/50 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="gender" className="text-lg font-medium text-primary-foreground/90">
                Gender (Optional) 💅<span className="text-xs">/🛹/✨</span>
              </Label>
              <Select onValueChange={(value) => setGender(value as UserGender)} value={gender || undefined}>
                <SelectTrigger id="gender" className="w-full mt-2 bg-background/50 border-primary/50 text-white">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-md text-white border-primary/50">
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="hover:bg-primary/20 focus:bg-primary/20">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl py-4 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95"
              size="lg"
            >
              Let's Vibe!
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreQuizForm;
