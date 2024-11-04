import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectList from '@/components/ProjectList';
import UploadComponent from '@/components/UploadComponent';
import { getUserProjects } from '@/lib/api';
import { Project } from '@/types/animation';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userProjects = await getUserProjects();
        setProjects(userProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Handle error (e.g., show error message to user)
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="dashboard">
      <h2>Your Projects</h2>
      <UploadComponent />
      <ProjectList projects={projects} />
      <Link href="/studio" className="btn btn-primary">
        Create New Project
      </Link>
    </div>
  );
};

export default Dashboard;