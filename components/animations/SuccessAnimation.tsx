"use client";

import React, { useRef, useState } from "react";
import Lottie from "lottie-react";
import successAnimation from "./successAnimation.json";

const SuccessAnimation = () => {
  const lottieRef = useRef<any>(null);
  const [animationFinished, setAnimationFinished] = useState(false);

  return (
    <div className="w-32 h-32 mx-auto relative">
      {!animationFinished ? (
        <Lottie
          lottieRef={lottieRef}
          animationData={successAnimation}
          loop={false}
          autoplay={true}
          onComplete={() => {
            setAnimationFinished(true);
          }}
        />
      ) : (
        // نمایش یک تیک ثابت
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3" 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessAnimation;