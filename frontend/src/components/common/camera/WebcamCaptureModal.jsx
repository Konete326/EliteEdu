import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, RefreshCw, Check, X, SwitchCamera, AlertCircle, UploadCloud } from 'lucide-react';

const WebcamCaptureModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isShutterFlashing, setIsShutterFlashing] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const startStream = useCallback(async (deviceId = '') => {
    stopStream();
    setCameraError('');
    setIsStreaming(false);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported by this browser. You can upload an image file instead.');
      return;
    }

    try {
      const constraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoInputs);
      if (!deviceId && videoInputs.length > 0) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser settings or select an image file from your device.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera hardware was detected on this device. You can upload an image file instead.');
      } else {
        setCameraError('Unable to start camera stream. Please check permissions or upload a file.');
      }
    }
  }, [stopStream]);

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startStream(selectedDeviceId);
    } else {
      stopStream();
      setCapturedImage(null);
      setCameraError('');
    }
    return () => {
      stopStream();
    };
  }, [isOpen, startStream, stopStream, selectedDeviceId]);

  if (!isOpen) return null;

  const handleSwitchCamera = () => {
    if (devices.length < 2) return;
    const currentIndex = devices.findIndex((d) => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    setSelectedDeviceId(nextDevice.deviceId);
    startStream(nextDevice.deviceId);
  };

  const handleTakeSnapshot = () => {
    const video = videoRef.current;
    if (!video || !isStreaming) return;

    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 200);

    const canvas = document.createElement('canvas');
    const side = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = side;
    canvas.height = side;

    const ctx = canvas.getContext('2d');
    const startX = (video.videoWidth - side) / 2;
    const startY = (video.videoHeight - side) / 2;

    ctx.drawImage(video, startX, startY, side, side, 0, 0, side, side);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopStream();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startStream(selectedDeviceId);
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        onCapture(dataUrl);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-surface dark:bg-[#121217] border border-line dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-ink dark:text-white">
              Student ID Card Photo Capture
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close webcam capture"
            className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative w-full aspect-square max-w-[320px] mx-auto rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-line dark:border-white/10 shadow-inner">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured Snapshot"
                className="w-full h-full object-cover"
              />
            ) : cameraError ? (
              <div className="p-4 text-center space-y-3 text-white">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs text-ink-muted leading-relaxed">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Choose Photo File</span>
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                  <div className="w-44 h-56 rounded-[50%] border-2 border-dashed border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] flex items-center justify-center">
                    <span className="text-[10px] font-black text-white/80 bg-black/50 px-2 py-0.5 rounded-full tracking-wide">
                      Align Face Here
                    </span>
                  </div>
                </div>
                {devices.length > 1 && (
                  <button
                    type="button"
                    onClick={handleSwitchCamera}
                    title="Switch camera device"
                    className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-all cursor-pointer"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                )}
              </>
            )}

            {isShutterFlashing && (
              <div className="absolute inset-0 bg-white pointer-events-none animate-out fade-out duration-200" />
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {capturedImage ? (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary text-ink dark:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl bg-good hover:bg-good/90 text-white text-xs font-bold transition-all shadow-sm shadow-good/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Use This Photo</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleTakeSnapshot}
                disabled={!isStreaming}
                className="w-full flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm shadow-primary/20 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Snapshot</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-ink-muted hover:text-ink dark:hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Or upload file from computer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamCaptureModal;
