// components/animation/AnimationList.tsx
import React, { useState } from 'react';
import logger from '@/lib/logger';
import { List, ListItem, ListItemButton, ListItemText, TextField, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

type AnimationType = 'rotate' | 'scale' | 'translate' | 'fade' | 'colorShift' | 'shake' | 'bounce' | 'swing';

interface Animation {
  id: AnimationType;
  name: string;
}

interface AnimationListProps {
  onSelectAnimation: (animationType: AnimationType) => void;
}

const ANIMATIONS: Animation[] = [
  { id: 'rotate', name: 'Rotation' },
  { id: 'scale', name: 'Scale' },
  { id: 'translate', name: 'Movement' },
  { id: 'fade', name: 'Fade In/Out' },
  { id: 'colorShift', name: 'Color Tint' },
  { id: 'shake', name: 'Shake' },
  { id: 'bounce', name: 'Bounce' },
  { id: 'swing', name: 'Swing' },
];

const StyledList = styled(List)(({ theme }) => ({
  width: '100%',
  maxWidth: 360,
  backgroundColor: theme.palette.background.paper,
}));

const AnimationList: React.FC<AnimationListProps> = ({ onSelectAnimation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectAnimation = (animationType: AnimationType) => {
    try {
      onSelectAnimation(animationType);
      logger.info(`Selected animation: ${animationType}`);
    } catch (error) {
      logger.error(`Error selecting animation: ${animationType}`, error as Error);
    }
  };

  const filteredAnimations = ANIMATIONS.filter(animation =>
    animation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2 }}>Available Animations</Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search animations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, px: 2 }}
      />
      <StyledList>
        {filteredAnimations.map((animation) => (
          <ListItem key={animation.id} disablePadding>
            <ListItemButton
              onClick={() => handleSelectAnimation(animation.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelectAnimation(animation.id);
                }
              }}
            >
              <ListItemText primary={animation.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </StyledList>
    </Box>
  );
};

export default AnimationList;