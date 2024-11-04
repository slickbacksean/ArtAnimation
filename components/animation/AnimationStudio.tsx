// AnimationStudio.tsx
import React, { useState } from 'react';
import AnimationCanvas from './AnimationCanvas';
import AnimationList from './AnimationList';
import { Layer, AnimationSettings } from '@/types/animation';

const AnimationStudio: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>({});
  const [detectedObjects, setDetectedObjects] = useState<any[]>([]);

  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
  };

  const handleLayerChange = (newLayers: Layer[]) => {
    setLayers(newLayers);
  };

  const handleAnimationSettingsChange = (newSettings: AnimationSettings) => {
    setAnimationSettings(newSettings);
  };

  const handleSelectAnimation = (animationId: string) => {
    // Logic to handle the selected animation
    console.log(`Selected animation: ${animationId}`);
  };

  return (
    <div className="animation-studio">
      <h2>Animation Studio</h2>
      <div className="studio-controls">
        <input
          type="range"
          min="50"
          max="200"
          value={zoomLevel}
          onChange={(e) => handleZoomChange(Number(e.target.value))}
        />
        <span>Zoom: {zoomLevel}%</span>
      </div>
      <div className="studio-layout">
        <AnimationList
          onSelectAnimation={(animation) => {
            // Logic to add selected animation to a layer
          }}
        />
        <AnimationCanvas
          detectedObjects={detectedObjects}
          layers={layers}
          zoomLevel={zoomLevel}
          animationSettings={animationSettings}
        />
        <div className="layer-controls">
          {/* Add controls for managing layers */}
        </div>
      </div>
    </div>
  );
};

export default AnimationStudio;