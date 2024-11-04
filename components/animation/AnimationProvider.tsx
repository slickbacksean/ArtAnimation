// components/animation/AnimationProvider.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AnimationSettings, AnimationType } from '@/types/animation';
import { logger } from '@/lib/logger';

interface AnimationContextType {
  currentAnimation: AnimationType | null;
  animationSettings: AnimationSettings;
  setCurrentAnimation: (animation: AnimationType | null) => void;
  updateAnimationSettings: (settings: Partial<AnimationSettings>) => void;
  applyAnimation: (imageId: string) => Promise<void>;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType | null>(null);
  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>({});

  const updateAnimationSettings = useCallback((newSettings: Partial<AnimationSettings>) => {
    setAnimationSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
    logger.info('Animation settings updated', newSettings);
  }, []);

  const applyAnimation = useCallback(async (imageId: string) => {
    if (!currentAnimation) {
      toast.error('No animation selected');
      return;
    }

    try {
      // Here you would typically make an API call to apply the animation
      // For now, we'll just log the action
      logger.info(`Applying ${currentAnimation} animation to image ${imageId}`, animationSettings);
      toast.success(`${currentAnimation} animation applied successfully`);
    } catch (error) {
      logger.error('Failed to apply animation', error);
      toast.error('Failed to apply animation. Please try again.');
    }
  }, [currentAnimation, animationSettings]);

  const value = {
    currentAnimation,
    animationSettings,
    setCurrentAnimation,
    updateAnimationSettings,
    applyAnimation
  };

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
};