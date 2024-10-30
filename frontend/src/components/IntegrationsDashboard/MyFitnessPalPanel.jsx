import React from 'react';
import '../../styles/IntegrationsDashboard.css';

/**
 * MyFitnessPalPanel component - Displays MyFitnessPal integration information.
 * Allows users to manage their nutrition by connecting to MyFitnessPal.
 * 
 * @component
 * @example
 * // Usage
 * <MyFitnessPalPanel />
 * 
 * @returns {JSX.Element} A panel with MyFitnessPal integration details.
 */
const MyFitnessPalPanel = () => {
  return (
    <div className="integration-panel myfitnesspal">
      <h2>MyFitnessPal</h2>
      <p>Connect to MyFitnessPal to manage your nutrition.</p>
    </div>
  );
};

export default MyFitnessPalPanel;
