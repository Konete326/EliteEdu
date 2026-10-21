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
  const isStartingRef = useRef(false);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
        scanner.clear();
      } catch (_) {}
    }
    try {
      const container = containerId ? document.getElementById(containerId) : null;
      const videos = container ? container.querySelectorAll('video') : document.querySelectorAll('video');
      videos.forEach((v) => {
        if (v.srcObject && typeof v.srcObject.getTracks === 'function') {
          v.srcObject.getTracks().forEach((track) => track.stop());
          v.srcObject = null;
        }
      });
    } catch (_) {}
    setIsReady(false);
    setIsTorchOn(false);
    scannerRef.current = null;
    isStartingRef.current = false;
  }, [containerId]);

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
    if (!isActive || !containerId || isStartingRef.current) return;
    isStartingRef.current = true;
    setCameraError('');
    await stopScanner();

    if (typeof window !== 'undefined' && window.isSecureContext === false && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setCameraError('Camera blocked: Insecure LAN origin (HTTP). Modern mobile browsers require HTTPS or localhost to access camera hardware. Run Vite with --https or use Chrome port-forwarding on your mobile device.');
      isStartingRef.current = false;
      return;
    }

    if (typeof navigator !== 'undefined' && (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
      setCameraError('Camera access requires a secure HTTPS connection or camera permissions.');
      isStartingRef.current = false;
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 80));
    const containerEl = document.getElementById(containerId);
    if (!containerEl) {
      isStartingRef.current = false;
      return;
    }

    try {
      const scanner = new Html5Qrcode(containerId, {
        formatsToSupport: DEFAULT_FORMATS,
        verbose: false
      });
      scannerRef.current = scanner;

      const cameraConfig = selectedCameraId
        ? { deviceId: { exact: selectedCameraId } }
        : { facingMode: 'environment' };

      await scanner.start(
        cameraConfig,
        {
          fps: 12,
          qrbox: (w, h) => {
            const edge = Math.min(w, h);
            const size = Math.max(160, Math.min(Math.floor(edge * 0.75), 260));
            return { width: size, height: size };
          }
        },
        handleDecoded,
        () => {}
      );

      setIsReady(true);

      Html5Qrcode.getCameras()
        .then((devices) => {
          if (Array.isArray(devices) && devices.length > 0) {
            setCameras(devices);
          }
        })
        .catch(() => {});

      try {
        const capabilities = scanner.getRunningTrackCameraCapabilities?.();
        setHasTorch(Boolean(capabilities?.torchFeature?.()?.isSupported?.()));
      } catch (_) {
        setHasTorch(false);
      }
    } catch (err) {
      setCameraError(err?.message || 'Unable to access camera. Please verify permissions in browser.');
      setIsReady(false);
    } finally {
      isStartingRef.current = false;
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
