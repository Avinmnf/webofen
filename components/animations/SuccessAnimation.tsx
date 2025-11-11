"use client";

import React, { useRef } from "react";
import Lottie from "lottie-react";
import successAnimation from "./successAnimation.json";

const SuccessAnimation = () => {
  const lottieRef = useRef<any>(null);

  return (
    <div className="w-32 h-32 mx-auto">
      <Lottie
        lottieRef={lottieRef}
        animationData={successAnimation}
        loop={false}
        autoplay={true} // play immediately
        onComplete={() => {
          const anim = lottieRef.current;
          if (anim) {
            // Freeze one frame before the last to avoid empty frame
            const lastFrame = anim.getDuration(true) - 1;
            anim.goToAndStop(lastFrame, true);
          }
        }}
      />
    </div>
  );
};

export default SuccessAnimation;
