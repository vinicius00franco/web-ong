import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const OngDashboard: React.FC = () => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/ong' },
  ];

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h1>ONG Dashboard</h1>
      <p>Welcome to the restricted area.</p>
    </>
  );
};

export default OngDashboard;