// components/project/ProjectProvider.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Project } from '@/types/project';
import { logger } from '@/lib/logger';
import { createProject, deleteProject, updateProject } from '@/lib/db';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (name: string, description?: string) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  updateProjectDetails: (id: string, data: Partial<Project>) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const addProject = useCallback(async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      setProjects(prevProjects => [...prevProjects, newProject]);
      toast.success('Project created successfully');
      logger.info('New project created', newProject);
    } catch (error) {
      logger.error('Failed to create project', error);
      toast.error('Failed to create project. Please try again.');
    }
  }, []);

  const removeProject = useCallback(async (id: string) => {
    try {
      await deleteProject(id);
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
      toast.success('Project deleted successfully');
      logger.info('Project deleted', { projectId: id });
    } catch (error) {
      logger.error('Failed to delete project', error);
      toast.error('Failed to delete project. Please try again.');
    }
  }, [currentProject]);

  const updateProjectDetails = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      const updatedProject = await updateProject(id, data);
      setProjects(prevProjects =>
        prevProjects.map(project => project.id === id ? updatedProject : project)
      );
      if (currentProject?.id === id) {
        setCurrentProject(updatedProject);
      }
      toast.success('Project updated successfully');
      logger.info('Project updated', updatedProject);
    } catch (error) {
      logger.error('Failed to update project', error);
      toast.error('Failed to update project. Please try again.');
    }
  }, [currentProject]);

  const value = {
    projects,
    currentProject,
    setProjects,
    setCurrentProject,
    addProject,
    removeProject,
    updateProjectDetails
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};