import React from 'react';
import UniversalScannerTerminal from '../UniversalScannerTerminal';
import StaffLastScannedSpotlight from './StaffLastScannedSpotlight';
import StaffRecentScansFeed from './StaffRecentScansFeed';

const StaffCardScannerTerminal = ({
  onScanCode,
  scanning = false,
  lastScanned,
  scanHistory = [],
  onOverrideStatus
}) => {
  return (
    <UniversalScannerTerminal
      title="Teacher / Staff Service Card Terminal"
      subtitle="Enter EMP # or Open Live Camera"
      placeholder="Scan Teacher Service Card QR / Barcode or enter EMP Code / Pers # / CNIC..."
      demoCode="EMP-001"
      demoLabel="Demo EMP"
      cameraTitle="Staff Attendance Camera Scanner"
      cameraSubtitle="Align staff ID card QR code or Barcode to mark attendance"
      onScanCode={onScanCode}
      scanning={scanning}
      lastScanned={lastScanned}
      scanHistory={scanHistory}
      onOverrideStatus={onOverrideStatus}
      renderSpotlight={(scanned) => (
        <StaffLastScannedSpotlight
          staff={scanned?.staff}
          scanTime={scanned?.time}
          attendance={scanned?.attendance}
        />
      )}
      renderFeed={(history, onOverride) => (
        <StaffRecentScansFeed scans={history} onOverrideStatus={onOverride} />
      )}
    />
  );
};

export default StaffCardScannerTerminal;
