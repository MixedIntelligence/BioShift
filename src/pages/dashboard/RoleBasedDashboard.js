import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Dashboard from '../../pages/dashboard/Dashboard';
import LabDashboardPage from '../../pages/dashboard/LabDashboardPage';
import WorkerDashboardPage from '../../pages/dashboard/WorkerDashboardPage';
import ProviderDashboardPage from '../../pages/dashboard/ProviderDashboardPage';

const RoleBasedDashboard = () => {
  const currentUser = useSelector(state => state.auth.currentUser);

  if (!currentUser) return <Redirect to="/login" />;

  switch (currentUser.role) {
    case 'lab':
      return <LabDashboardPage />;
    case 'worker':
      return <WorkerDashboardPage />;
    case 'provider':
      return <ProviderDashboardPage />;
    case 'admin':
      return <Dashboard />;
    default:
      return <Dashboard />;
  }
};

export default RoleBasedDashboard;
