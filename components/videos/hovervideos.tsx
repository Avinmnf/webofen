'use client';
import React, { useRef, forwardRef, useImperativeHandle } from 'react';

interface HoverVideoProps {
  src: string;
  className?: string;
}

// forwardRef allows the parent to control play/pause
const HoverVideo = forwardRef<HTMLVideoElement, HoverVideoProps>(
  ({ src, className }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // expose the video DOM methods to the parent
    useImperativeHandle(ref, () => videoRef.current!);

    return (
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        className={className}
        playsInline
      />
    );
  }
);

export default HoverVideo;
