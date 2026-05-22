import React, { useEffect, useRef, useState } from "react";
import "./CameraCapture.css";

const CameraCapture = ({ onCapture, buttonLabel = "Click via Camera" }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const openCamera = async () => {
    setError("");
    setOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera could not be opened. Please allow camera permission in your browser.");
    }
  };

  const closeCamera = () => {
    stopCamera();
    setOpen(false);
    setError("");
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setError("Camera is not ready yet.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Could not capture image.");
        return;
      }

      const file = new File([blob], `camera-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      onCapture(file);
      closeCamera();
    }, "image/jpeg", 0.92);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <>
      <button type="button" className="camera_capture_button" onClick={openCamera}>
        {buttonLabel}
      </button>

      {open && (
        <div className="camera_capture_modal">
          <div className="camera_capture_panel">
            <div className="camera_capture_header">
              <h3>Camera</h3>
              <button type="button" onClick={closeCamera} aria-label="Close camera">
                Close
              </button>
            </div>

            {error ? (
              <p className="camera_capture_error">{error}</p>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="camera_capture_video" />
            )}

            <div className="camera_capture_actions">
              <button type="button" onClick={capturePhoto} disabled={!!error}>
                Capture Photo
              </button>
              <button type="button" onClick={closeCamera}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CameraCapture;
