// AnimationCanvas.tsx
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface Layer {
  id: string;
  texture: string;
  x: number;
  y: number;
}

interface AnimationSettings {
  [key: string]: {
    [key: string]: {
      enabled: boolean;
      speed?: number;
      minScale?: number;
      maxScale?: number;
      distance?: number;
      intensity?: number;
      height?: number;
      angle?: number;
    };
  };
}

interface AnimationCanvasProps {
  detectedObjects: any[]; // Replace 'any' with a more specific type if available
  layers: Layer[];
  zoomLevel: number;
  animationSettings: AnimationSettings;
}

const AnimationCanvas: React.FC<AnimationCanvasProps> = ({ detectedObjects, layers, zoomLevel, animationSettings }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0xFFFFFF,
    });
    if (canvasRef.current) {
      canvasRef.current.appendChild(app.view as HTMLCanvasElement);
    }
    appRef.current = app;

    return () => {
      app.destroy(true);
    };
  }, []);

  useEffect(() => {
    if (!appRef.current) return;

    appRef.current.stage.removeChildren();

    layers.forEach(layer => {
      const sprite = PIXI.Sprite.from(layer.texture);
      sprite.x = layer.x;
      sprite.y = layer.y;
      sprite.anchor.set(0.5);
      appRef.current!.stage.addChild(sprite);

      const objectSettings = animationSettings[layer.id] || {};

      // Apply animations based on settings
      if (objectSettings.rotate?.enabled) {
        applyRotationAnimation(sprite, objectSettings.rotate);
      }
      if (objectSettings.scale?.enabled) {
        applyScaleAnimation(sprite, objectSettings.scale);
      }
      if (objectSettings.translate?.enabled) {
        applyTranslateAnimation(sprite, objectSettings.translate);
      }
      if (objectSettings.fade?.enabled) {
        applyFadeAnimation(sprite, objectSettings.fade);
      }
      if (objectSettings.colorShift?.enabled) {
        applyColorShiftAnimation(sprite, objectSettings.colorShift);
      }
      if (objectSettings.shake?.enabled) {
        applyShakeAnimation(sprite, objectSettings.shake);
      }
      if (objectSettings.bounce?.enabled) {
        applyBounceAnimation(sprite, objectSettings.bounce);
      }
      if (objectSettings.swing?.enabled) {
        applySwingAnimation(sprite, objectSettings.swing);
      }
    });

    appRef.current.stage.scale.set(zoomLevel / 100);
  }, [layers, zoomLevel, animationSettings]);

  const applyRotationAnimation = (sprite: PIXI.Sprite, settings: { speed?: number }) => {
    const speed = settings.speed || 0.1;
    appRef.current!.ticker.add(() => {
      sprite.rotation += speed;
    });
  };

  const applyScaleAnimation = (sprite: PIXI.Sprite, settings: { minScale?: number; maxScale?: number; speed?: number }) => {
    const minScale = settings.minScale || 0.5;
    const maxScale = settings.maxScale || 1.5;
    const speed = settings.speed || 0.02;
    let scaleDirection = 1;
    appRef.current!.ticker.add(() => {
      sprite.scale.set(sprite.scale.x + speed * scaleDirection);
      if (sprite.scale.x >= maxScale || sprite.scale.x <= minScale) {
        scaleDirection *= -1;
      }
    });
  };

  const applyTranslateAnimation = (sprite: PIXI.Sprite, settings: { distance?: number; speed?: number }) => {
    const distance = settings.distance || 50;
    const speed = settings.speed || 2;
    let direction = 1;
    const startX = sprite.x;
    appRef.current!.ticker.add(() => {
      sprite.x += speed * direction;
      if (Math.abs(sprite.x - startX) > distance) {
        direction *= -1;
      }
    });
  };

  const applyFadeAnimation = (sprite: PIXI.Sprite, settings: { speed?: number }) => {
    const speed = settings.speed || 0.02;
    let fadeDirection = -1;
    appRef.current!.ticker.add(() => {
      sprite.alpha += speed * fadeDirection;
      if (sprite.alpha <= 0 || sprite.alpha >= 1) {
        fadeDirection *= -1;
      }
    });
  };

  const applyColorShiftAnimation = (sprite: PIXI.Sprite, settings: { speed?: number }) => {
    const speed = settings.speed || 0.1;
    let hue = 0;
    appRef.current!.ticker.add(() => {
      hue = (hue + speed) % 360;
      const rgb = hslToRgb(hue / 360, 1, 0.5);
      sprite.tint = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
    });
  };

  const applyShakeAnimation = (sprite: PIXI.Sprite, settings: { intensity?: number }) => {
    const intensity = settings.intensity || 5;
    const originalX = sprite.x;
    const originalY = sprite.y;
    appRef.current!.ticker.add(() => {
      sprite.x = originalX + Math.random() * intensity - intensity / 2;
      sprite.y = originalY + Math.random() * intensity - intensity / 2;
    });
  };

  const applyBounceAnimation = (sprite: PIXI.Sprite, settings: { height?: number; speed?: number }) => {
    const height = settings.height || 50;
    const speed = settings.speed || 0.1;
    let time = 0;
    const originalY = sprite.y;
    appRef.current!.ticker.add(() => {
      time += speed;
      sprite.y = originalY + Math.abs(Math.sin(time) * height);
    });
  };

  const applySwingAnimation = (sprite: PIXI.Sprite, settings: { angle?: number; speed?: number }) => {
    const angle = settings.angle || 15;
    const speed = settings.speed || 0.05;
    let time = 0;
    appRef.current!.ticker.add(() => {
      time += speed;
      sprite.rotation = (Math.sin(time) * angle * Math.PI) / 180;
    });
  };

  // Helper function to convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  return <div ref={canvasRef}></div>;
};

export default AnimationCanvas;