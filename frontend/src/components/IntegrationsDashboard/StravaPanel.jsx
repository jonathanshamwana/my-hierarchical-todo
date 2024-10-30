import React from 'react';
import '../../styles/IntegrationsDashboard.css';

/**
 * StravaPanel component - Displays Strava integration information.
 * Allows users to connect their Strava account to track activities.
 * 
 * @component
 * @example
 * // Usage
 * <StravaPanel />
 * 
 * @returns {JSX.Element} A panel with Strava integration details.
 */
const StravaPanel = () => {
  return (
    <div className="integration-panel strava">
      <h2>Strava</h2>
      <p>Connect your Strava account to track your activities.</p>
    </div>
  );
};

export default StravaPanel;
