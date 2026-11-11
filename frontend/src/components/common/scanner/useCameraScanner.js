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

const activeMediaStreams = new Set();

const stopStream = (stream) => {
  if (!stream || typeof stream.getTracks !== 'function') return;
  try {
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (_) {}
    });
  } catch (_) {}
};

export const useCameraScanner = ({ containerId, onScan, isActive, continuous = true, cooldownMs = 1500 }) => {
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [facingMode, setFacingMode] = useState('environment');
  const [isReady, setIsReady] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [lastScannedCode, setLastScannedCode] = useState('');

  const scannerRef = useRef(null);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const isCooldownRef = useRef(false);
  const isStartingRef = useRef(false);
  const isActiveRef = useRef(isActive);
  const runIdRef = useRef(0);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const stopScanner = useCallback(async () => {
    runIdRef.current += 1;
    isStartingRef.current = false;

    if (streamRef.current) {
      stopStream(streamRef.current);
      activeMediaStreams.delete(streamRef.current);
      streamRef.current = null;
    }

    activeMediaStreams.forEach((s) => {
      stopStream(s);
    });
    activeMediaStreams.clear();

    if (videoRef.current) {
      try {
        if (videoRef.current.srcObject) {
          stopStream(videoRef.current.srcObject);
          videoRef.current.srcObject = null;
        }
        videoRef.current.pause?.();
        videoRef.current.removeAttribute('src');
      } catch (_) {}
      videoRef.current = null;
    }

    try {
      const allVideos = document.querySelectorAll('video');
      allVideos.forEach((v) => {
        try {
          if (v.srcObject) {
            stopStream(v.srcObject);
            v.srcObject = null;
          }
          v.pause?.();
        } catch (_) {}
      });
    } catch (_) {}

    const scanner = scannerRef.current;
    if (scanner) {
      try {
        if (scanner.renderedCamera?.mediaStream) {
          stopStream(scanner.renderedCamera.mediaStream);
        }
      } catch (_) {}
      try {
        const state = typeof scanner.getState === 'function' ? scanner.getState() : 0;
        if (state === 2 || state === 3 || scanner.isScanning) {
          await scanner.stop();
        }
      } catch (_) {}
      if (typeof scanner.clear === 'function') {
        try {
          scanner.clear();
        } catch (_) {}
      }
      scannerRef.current = null;
    }

    try {
      const container = containerId ? document.getElementById(containerId) : null;
      if (container) {
        container.innerHTML = '';
      }
    } catch (_) {}

    setIsReady(false);
    setIsTorchOn(false);
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

  const requestPermissions = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return false;
    let stream = null;
    try {
      const constraints = selectedCameraId
        ? { deviceId: { exact: selectedCameraId } }
        : { facingMode: { ideal: facingMode } };
      stream = await navigator.mediaDevices.getUserMedia({ video: constraints, audio: false });
    } catch (_) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: false });
      } catch (__) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
    }
    if (stream) {
      activeMediaStreams.add(stream);
      stopStream(stream);
      activeMediaStreams.delete(stream);
      return true;
    }
    return false;
  }, [selectedCameraId, facingMode]);

  const startScanner = useCallback(async () => {
    if (!isActiveRef.current || !containerId || isStartingRef.current) return;
    const currentRunId = runIdRef.current + 1;
    runIdRef.current = currentRunId;
    isStartingRef.current = true;
    setCameraError('');

    await stopScanner();

    if (!isActiveRef.current || runIdRef.current !== currentRunId) {
      isStartingRef.current = false;
      return;
    }

    if (typeof window !== 'undefined' && window.isSecureContext === false && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setCameraError('Camera blocked: Insecure LAN origin (HTTP). Modern mobile browsers require HTTPS or localhost to access camera hardware.');
      isStartingRef.current = false;
      return;
    }

    if (typeof navigator !== 'undefined' && (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
      setCameraError('Camera access requires a secure HTTPS connection or camera permissions.');
      isStartingRef.current = false;
      return;
    }

    try {
      await requestPermissions();
    } catch (permErr) {
      if (isActiveRef.current && runIdRef.current === currentRunId) {
        setCameraError(permErr?.message || 'Camera permissions denied. Please allow permissions in browser address bar and click Retry.');
      }
      isStartingRef.current = false;
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 80));
    if (!isActiveRef.current || runIdRef.current !== currentRunId) {
      isStartingRef.current = false;
      return;
    }

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
        : { facingMode: { ideal: facingMode } };

      await scanner.start(
        cameraConfig,
        {
          fps: 15,
          qrbox: (w, h) => {
            const edge = Math.min(w, h);
            const size = Math.max(160, Math.min(Math.floor(edge * 0.75), 260));
            return { width: size, height: size };
          }
        },
        handleDecoded,
        () => {}
      );

      if (!isActiveRef.current || runIdRef.current !== currentRunId) {
        await stopScanner();
        return;
      }

      try {
        const container = document.getElementById(containerId);
        const video = container?.querySelector('video');
        if (video) {
          videoRef.current = video;
          if (video.srcObject) {
            streamRef.current = video.srcObject;
            activeMediaStreams.add(video.srcObject);
          }
        }
        if (!streamRef.current && scanner?.renderedCamera?.mediaStream) {
          streamRef.current = scanner.renderedCamera.mediaStream;
          activeMediaStreams.add(scanner.renderedCamera.mediaStream);
        }
      } catch (_) {}

      setIsReady(true);

      Html5Qrcode.getCameras()
        .then((devices) => {
          if (Array.isArray(devices) && devices.length > 0) {
            setCameras(devices);
            if (!selectedCameraId) {
              const backCam = devices.find((d) => /back|rear|environment/i.test(d.label));
              if (backCam) setSelectedCameraId(backCam.id);
            }
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
      if (isActiveRef.current && runIdRef.current === currentRunId) {
        setCameraError(err?.message || 'Unable to access camera. Please verify permissions in browser.');
      }
      setIsReady(false);
    } finally {
      isStartingRef.current = false;
    }
  }, [containerId, selectedCameraId, facingMode, handleDecoded, stopScanner, requestPermissions]);

  const flipCamera = useCallback(() => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setSelectedCameraId(cameras[nextIndex].id);
    } else {
      setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
      setSelectedCameraId('');
    }
  }, [cameras, selectedCameraId]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopScanner();
      } else if (isActiveRef.current) {
        startScanner();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [stopScanner, startScanner]);

  useEffect(() => {
    if (isActive) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isActive, selectedCameraId, facingMode, startScanner, stopScanner]);

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
    } catch (_) {
      setCameraError('No readable QR code or barcode found in this image.');
    }
  };

  return {
    cameras,
    selectedCameraId,
    setSelectedCameraId,
    facingMode,
    flipCamera,
    isReady,
    isTorchOn,
    hasTorch,
    toggleTorch,
    cameraError,
    lastScannedCode,
    scanFile,
    restart: startScanner,
    stopScanner
  };
};
