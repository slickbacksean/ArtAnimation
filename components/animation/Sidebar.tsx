import React from 'react';
import logger from '@/lib/logger';

type Tool = 'Select' | 'Move' | 'Rotate' | 'Scale' | 'Animate';

interface SidebarProps {
  onSelectTool: (tool: Tool) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectTool }) => {
  const tools: Tool[] = ['Select', 'Move', 'Rotate', 'Scale', 'Animate'];

  const handleToolSelect = (tool: Tool) => {
    onSelectTool(tool);
    logger.info(`Selected tool: ${tool}`);
  };

  return (
    <div className="sidebar">
      {tools.map(tool => (
        <button key={tool} onClick={() => handleToolSelect(tool)}>
          {tool}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;