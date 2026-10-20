import React from 'react';
import UniversalScannerTerminal from './UniversalScannerTerminal';
import LastScannedSpotlight from './LastScannedSpotlight';
import RecentScansFeed from './RecentScansFeed';

const CardScannerTerminal = ({
  onScanCode,
  scanning = false,
  lastScanned,
  scanHistory = [],
  onOverrideStatus
}) => {
  return (
    <UniversalScannerTerminal
      title="Card Scanner / GR Terminal"
      subtitle="Type GR # or Open Live Camera"
      placeholder="Scan Student ID Card Barcode / QR or type GR # and press Enter..."
      cameraTitle="Student Attendance Camera Scanner"
      cameraSubtitle="Align student ID card QR code or Barcode to mark present"
      onScanCode={onScanCode}
      scanning={scanning}
      lastScanned={lastScanned}
      scanHistory={scanHistory}
      onOverrideStatus={onOverrideStatus}
      renderSpotlight={(scanned) => (
        <LastScannedSpotlight student={scanned?.student} scanTime={scanned?.time} />
      )}
      renderFeed={(history, onOverride) => (
        <RecentScansFeed scans={history} onOverrideStatus={onOverride} />
      )}
    />
  );
};

export default CardScannerTerminal;
