import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Layer, SelectedObject } from '@/types/animation';
import logger from '@/lib/logger';

interface LayerPanelProps {
  layers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  selectedObject: SelectedObject | null;
  updateObjectProperties: (id: string, properties: Partial<SelectedObject>) => void;
}

const LayerPanel: React.FC<LayerPanelProps> = ({ layers, setLayers, selectedObject, updateObjectProperties }) => {
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({});

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
    logger.info(`Toggled visibility for layer: ${layerId}`);
  }, [setLayers]);

  const toggleLayerExpansion = useCallback((layerId: string) => {
    setExpandedLayers(prev => ({ ...prev, [layerId]: !prev[layerId] }));
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(layers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLayers(items);
    logger.info(`Reordered layers: ${result.draggableId} moved to index ${result.destination.index}`);
  }, [layers, setLayers]);

  const handlePropertyChange = useCallback((property: keyof SelectedObject, value: number) => {
    if (selectedObject) {
      updateObjectProperties(selectedObject.id, { [property]: value });
      logger.info(`Updated ${property} for object ${selectedObject.id} to ${value}`);
    }
  }, [selectedObject, updateObjectProperties]);

  return (
    <div className="layer-panel">
      <h3>Layers</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="layers">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {layers.map((layer, index) => (
                <Draggable key={layer.id} draggableId={layer.id} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <div className="layer-item">
                        <button onClick={() => toggleLayerVisibility(layer.id)}>
                          {layer.visible ? '👁️' : '👁️‍🗨️'}
                        </button>
                        <span onClick={() => toggleLayerExpansion(layer.id)}>
                          {expandedLayers[layer.id] ? '▼' : '▶'} {layer.name}
                        </span>
                      </div>
                      {expandedLayers[layer.id] && (
                        <div className="layer-details">
                          <p>Opacity: {layer.opacity}</p>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.1" 
                            value={layer.opacity} 
                            onChange={(e) => {
                              const newOpacity = parseFloat(e.target.value);
                              setLayers(prevLayers => 
                                prevLayers.map(l => 
                                  l.id === layer.id ? { ...l, opacity: newOpacity } : l
                                )
                              );
                              logger.info(`Updated opacity for layer ${layer.id} to ${newOpacity}`);
                            }}
                          />
                        </div>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {selectedObject && (
        <div className="object-properties">
          <h4>Selected Object: {selectedObject.name}</h4>
          <label>
            Position X:
            <input 
              type="number" 
              value={selectedObject.x} 
              onChange={(e) => handlePropertyChange('x', parseInt(e.target.value, 10))}
            />
          </label>
          <label>
            Position Y:
            <input 
              type="number" 
              value={selectedObject.y} 
              onChange={(e) => handlePropertyChange('y', parseInt(e.target.value, 10))}
            />
          </label>
          <label>
            Scale:
            <input 
              type="number" 
              value={selectedObject.scale} 
              step="0.1"
              onChange={(e) => handlePropertyChange('scale', parseFloat(e.target.value))}
            />
          </label>
          <label>
            Rotation:
            <input 
              type="number" 
              value={selectedObject.rotation} 
              onChange={(e) => handlePropertyChange('rotation', parseInt(e.target.value, 10))}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default LayerPanel;