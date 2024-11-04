// components/dashboard/ProjectList.tsx
import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/animation';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject }) => {
  return (
    <div className="project-list">
      <h2>Your Projects</h2>
      {projects.length === 0 ? (
        <p>You don't have any projects yet. Create one to get started!</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              <Link href={`/animation-studio/${project.id}`}>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p>Last edited: {new Date(project.updatedAt).toLocaleDateString()}</p>
                </div>
              </Link>
              <button onClick={() => onSelectProject(project.id)}>Edit</button>
            </li>
          ))}
        </ul>
      )}
      <Link href="/new-project" className="new-project-button">
        Create New Project
      </Link>
    </div>
  );
};

export default ProjectList;