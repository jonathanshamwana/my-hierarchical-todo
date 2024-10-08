import React from 'react';
import GoogleCalendarPanel from './GoogleCalendarPanel';
import StravaPanel from './StravaPanel';
import MyFitnessPalPanel from './MyFitnessPalPanel';
import CorosPanel from './CorosPanel';
import '../../styles/IntegrationsDashboard.css';

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

