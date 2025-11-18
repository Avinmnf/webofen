"use client";
import { useEffect } from "react";

export default function Magnifier() {
  useEffect(() => {
    const initializeMagnifier = () => {
      const images = document.querySelectorAll('.article-image-magnify');

      images.forEach((element) => {
        const img = element as HTMLImageElement;
        
        if (img.classList.contains('magnify-initialized')) return;
        img.classList.add('magnify-initialized');

        const zoom = 4; // Increased zoom for better effect
        const lensSize = 200; // Larger lens for better visibility
        
        const lens = document.createElement("div");
        lens.className = "magnifier-lens";
        lens.style.width = `${lensSize}px`;
        lens.style.height = `${lensSize}px`;
        
        // Create a container for the image and lens if needed
        let container = img.parentElement;
        if (!container || container === document.body) {
          container = img;
        }
        
        if (window.getComputedStyle(container).position === 'static') {
          container.style.position = "relative";
        }
        container.appendChild(lens);

        const moveLens = (e: MouseEvent) => {
          const rect = img.getBoundingClientRect();
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          // Get cursor position relative to the page
          const x = e.pageX - rect.left - scrollLeft;
          const y = e.pageY - rect.top - scrollTop;
          
          // Calculate lens position (center on cursor)
          let lensX = x - (lensSize / 2);
          let lensY = y - (lensSize / 2);
          
          // Constrain lens within image boundaries
          lensX = Math.max(0, Math.min(lensX, rect.width - lensSize));
          lensY = Math.max(0, Math.min(lensY, rect.height - lensSize));
          
          lens.style.left = `${lensX}px`;
          lens.style.top = `${lensY}px`;
          
          // Calculate the corresponding position in the zoomed image
          // This is the most important calculation
          const bgX = ((lensX + lensSize / 2) / rect.width) * (img.naturalWidth * zoom) - (lensSize / 2);
          const bgY = ((lensY + lensSize / 2) / rect.height) * (img.naturalHeight * zoom) - (lensSize / 2);
          
          lens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
          lens.style.display = "block";
        };

        const setupMagnifier = () => {
          console.log('Setting up magnifier for:', img.src);
          console.log('Image dimensions:', {
            natural: `${img.naturalWidth}x${img.naturalHeight}`,
            displayed: `${img.width}x${img.height}`,
            zoom: zoom
          });
          
          lens.style.backgroundImage = `url('${img.src}')`;
          lens.style.backgroundSize = `${img.naturalWidth * zoom}px ${img.naturalHeight * zoom}px`;
          lens.style.backgroundRepeat = "no-repeat";
          
          img.addEventListener("mousemove", moveLens);
          lens.addEventListener("mousemove", moveLens);
          img.addEventListener("mouseleave", () => {
            lens.style.display = "none";
          });
          img.addEventListener("mouseenter", (e: MouseEvent) => {
            lens.style.display = "block";
            moveLens(e); // Initialize position
          });
        };

        if (img.complete) {
          setupMagnifier();
        } else {
          img.addEventListener('load', setupMagnifier);
        }
      });
    };

    // Multiple initialization attempts
    setTimeout(initializeMagnifier, 100);
    setTimeout(initializeMagnifier, 500);
    setTimeout(initializeMagnifier, 1000);
    
    const observer = new MutationObserver(initializeMagnifier);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => observer.disconnect();
  }, []);

  return null;
}