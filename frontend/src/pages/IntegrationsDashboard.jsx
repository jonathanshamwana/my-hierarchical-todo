import React from 'react';
import GoogleCalendarPanel from '../components/IntegrationsDashboard/GoogleCalendarPanel';
import StravaPanel from '../components/IntegrationsDashboard/StravaPanel';
import MyFitnessPalPanel from '../components/IntegrationsDashboard/MyFitnessPalPanel';
import CorosPanel from '../components/IntegrationsDashboard/CorosPanel';
import '../styles/IntegrationsDashboard/IntegrationsDashboard.css';

/**
 * IntegrationsDashboard component displays various integration panels for 
 * connected services like Google Calendar, Strava, MyFitnessPal, and Coros.
 * This component organizes each integration within a responsive grid layout.
 * 
 * @component
 * @example
 * // Usage
 * <IntegrationsDashboard />
 * 
 * @returns {JSX.Element} A responsive dashboard grid containing panels 
 * for each supported integration service.
 */
const IntegrationsDashboard = () => {
  return (
    <div className="dashboard-grid">
       {/* A grid of four panels, one for each of the data integrations */}
      <div className="google-calendar">
        <GoogleCalendarPanel />
      </div>
      <div className="strava">
        <StravaPanel />
      </div>
      <div className="myfitnesspal">
        <MyFitnessPalPanel />
      </div>
      <div className="coros">
        <CorosPanel />
      </div>
    </div>
  );
};

export default IntegrationsDashboard;
