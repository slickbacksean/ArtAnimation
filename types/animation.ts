// types/animation.ts

export interface Layer {
  id: string;
  name: string;
  type: 'image' | 'shape' | 'text';
  src?: string; // For image layers
  content?: string; // For text layers
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  opacity: number;
  visible: boolean;
  zIndex: number;
}

export interface AnimationSettings {
  [layerId: string]: {
    rotate?: RotateAnimation;
    scale?: ScaleAnimation;
    translate?: TranslateAnimation;
    fade?: FadeAnimation;
    colorShift?: ColorShiftAnimation;
    shake?: ShakeAnimation;
    bounce?: BounceAnimation;
    swing?: SwingAnimation;
  };
}

interface BaseAnimation {
  enabled: boolean;
  speed: number;
}

export interface RotateAnimation extends BaseAnimation {
  direction: 'clockwise' | 'counterclockwise';
}

export interface ScaleAnimation extends BaseAnimation {
  minScale: number;
  maxScale: number;
}

export interface TranslateAnimation extends BaseAnimation {
  distance: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
}

export interface FadeAnimation extends BaseAnimation {
  minOpacity: number;
  maxOpacity: number;
}

export interface ColorShiftAnimation extends BaseAnimation {
  colors: string[]; // Array of color hex codes
}

export interface ShakeAnimation extends BaseAnimation {
  intensity: number;
}

export interface BounceAnimation extends BaseAnimation {
  height: number;
}

export interface SwingAnimation extends BaseAnimation {
  angle: number;
}

export interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  layers: Layer[];
  animationSettings: AnimationSettings;
}

export interface SelectedObject {
  id: string;
  type: 'layer' | 'detectedObject';
  layerId?: string;
  detectedObjectId?: string;
}

export type Tool = 'select' | 'move' | 'rotate' | 'scale' | 'animate' | 'text' | 'shape' | 'crop' | 'paint' | 'erase';

export interface CanvasState {
  width: number;
  height: number;
  backgroundColor: string;
}

export interface AnimationStudioState {
  project: Project;
  selectedObject: SelectedObject | null;
  zoomLevel: number;
  tool: Tool;
  canvasState: CanvasState;
}