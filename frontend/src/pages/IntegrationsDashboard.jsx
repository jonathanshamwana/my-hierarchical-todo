import React from 'react';
import GoogleCalendarPanel from '../components/IntegrationsDashboard/GoogleCalendarPanel';
import StravaPanel from '../components/IntegrationsDashboard/StravaPanel';
import MyFitnessPalPanel from '../components/IntegrationsDashboard/MyFitnessPalPanel';
import CorosPanel from '../components/IntegrationsDashboard/CorosPanel';
import '../styles/IntegrationsDashboard.css';

const IntegrationsDashboard = () => {
  return (
    <div className="dashboard-grid">
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

