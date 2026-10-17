import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const DEFAULT_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E
];

export const useCameraScanner = ({ containerId, onScan, isActive, continuous = true, cooldownMs = 1500 }) => {
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [lastScannedCode, setLastScannedCode] = useState('');

  const scannerRef = useRef(null);
  const isCooldownRef = useRef(false);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
      scanner.clear();
    } catch (_) {}
    setIsReady(false);
    setIsTorchOn(false);
  }, []);

  const handleDecoded = useCallback(async (decodedText) => {
    const trimmed = String(decodedText || '').trim();
    if (!trimmed || isCooldownRef.current) return;
    isCooldownRef.current = true;
    setLastScannedCode(trimmed);
    try {
      await onScan(trimmed);
    } finally {
      if (continuous) {
        setTimeout(() => {
          isCooldownRef.current = false;
        }, cooldownMs);
      }
    }
  }, [onScan, continuous, cooldownMs]);

  const startScanner = useCallback(async () => {
    if (!isActive || !containerId) return;
    setCameraError('');
    await stopScanner();

    try {
      const scanner = new Html5Qrcode(containerId, {
        formatsToSupport: DEFAULT_FORMATS,
        verbose: false
      });
      scannerRef.current = scanner;

      const devices = await Html5Qrcode.getCameras().catch(() => []);
      setCameras(devices);

      const targetCamera = selectedCameraId || (devices.length > 0 ? devices[0].id : { facingMode: 'environment' });

      await scanner.start(
        targetCamera,
        {
          fps: 15,
          qrbox: (w, h) => {
            const min = Math.min(w, h);
            const size = Math.floor(min * 0.75);
            return { width: size, height: Math.floor(size * 0.7) };
          },
          aspectRatio: 1.0
        },
        handleDecoded,
        () => {}
      );

      setIsReady(true);

      try {
        const capabilities = scanner.getRunningTrackCameraCapabilities?.();
        setHasTorch(Boolean(capabilities?.torchFeature?.()?.isSupported?.()));
      } catch (_) {
        setHasTorch(false);
      }
    } catch (err) {
      setCameraError(err?.message || 'Unable to access camera. Please allow camera permissions.');
      setIsReady(false);
    }
  }, [isActive, containerId, selectedCameraId, handleDecoded, stopScanner]);

  useEffect(() => {
    if (isActive) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isActive, selectedCameraId, startScanner, stopScanner]);

  const toggleTorch = async () => {
    const scanner = scannerRef.current;
    if (!scanner || !hasTorch) return;
    try {
      const next = !isTorchOn;
      await scanner.applyVideoConstraints({ advanced: [{ torch: next }] });
      setIsTorchOn(next);
    } catch (_) {}
  };

  const scanFile = async (file) => {
    if (!scannerRef.current || !file) return;
    try {
      const result = await scannerRef.current.scanFile(file, true);
      if (result) handleDecoded(result);
    } catch (err) {
      setCameraError('No readable QR code or barcode found in this image.');
    }
  };

  return {
    cameras,
    selectedCameraId,
    setSelectedCameraId,
    isReady,
    isTorchOn,
    hasTorch,
    toggleTorch,
    cameraError,
    lastScannedCode,
    scanFile,
    restart: startScanner
  };
};
