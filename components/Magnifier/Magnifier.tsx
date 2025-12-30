"use client";
import { useEffect } from "react";

export default function Magnifier() {
  useEffect(() => {
    const initializeMagnifier = () => {
      const images = document.querySelectorAll(".article-image-magnify");

      images.forEach((imgElement) => {
        const img = imgElement as HTMLImageElement;

        // Skip if already initialized
        if (img.classList.contains("magnify-initialized")) return;
        img.classList.add("magnify-initialized");

        const zoom = 2.5;
        const lensSize = 180; // Good balance of size and visibility

        // Create lens element
        const lens = document.createElement("div");
        lens.className = "magnifier-lens";
        lens.style.width = `${lensSize}px`;
        lens.style.height = `${lensSize}px`;

        // Get or create container
        let container = img.parentElement;
        if (!container || container === document.body) {
          container = img;
        }

        // Ensure container has positioning
        if (window.getComputedStyle(container).position === "static") {
          container.style.position = "relative";
        }

        container.appendChild(lens);

        const moveLens = (e: MouseEvent) => {
          const rect = img.getBoundingClientRect();
          
          // Calculate cursor position relative to image
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Calculate lens position (center on cursor)
          let lensX = x - lensSize / 2;
          let lensY = y - lensSize / 2;

          // Keep lens within image boundaries
          lensX = Math.max(0, Math.min(lensX, rect.width - lensSize));
          lensY = Math.max(0, Math.min(lensY, rect.height - lensSize));

          // Position the lens
          lens.style.left = `${lensX}px`;
          lens.style.top = `${lensY}px`;

          // Calculate zoomed background position
          const bgX = (x / rect.width) * (img.naturalWidth * zoom) - lensSize / 2;
          const bgY = (y / rect.height) * (img.naturalHeight * zoom) - lensSize / 2;

          lens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
        };

        const setupMagnifier = () => {
          // Set lens background
          lens.style.backgroundImage = `url('${img.src}')`;
          lens.style.backgroundSize = `${img.naturalWidth * zoom}px ${img.naturalHeight * zoom}px`;
          lens.style.backgroundRepeat = "no-repeat";

          // Event listeners
          img.addEventListener("mousemove", moveLens);
          img.addEventListener("mouseleave", () => {
            lens.style.display = "none";
          });
          img.addEventListener("mouseenter", (e: MouseEvent) => {
            lens.style.display = "block";
            moveLens(e);
          });
        };

        // Initialize when image loads
        if (img.complete) {
          setupMagnifier();
        } else {
          img.addEventListener("load", setupMagnifier);
        }
      });
    };

    // Clean CSS - minimal and effective
    const style = document.createElement('style');
    style.textContent = `
      .magnifier-lens {
        position: absolute;
        border: 2px solid #3db4c6;
        border-radius: 100px;
        cursor: none;
        pointer-events: none;
        z-index: 100;
        box-shadow: 
          0 0 0 2px white,
          0 0 15px rgba(0, 0, 0, 0.3);
        background: white;
        overflow: hidden;
        display: none;
      }
      
      /* Simple crosshair overlay */
      .magnifier-lens::before,
      .magnifier-lens::after {
        content: '';
        position: absolute;
        background: rgba(255, 0, 0, 0.5);
        z-index: 101;
      }
      
      .magnifier-lens::before {
        width: 100%;
        height: 1px;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
      
      .magnifier-lens::after {
        width: 1px;
        height: 100%;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      
      /* Image styling */
      .article-image-magnify {
        cursor: crosshair;
        transition: transform 0.2s ease;
      }
      
      .article-image-magnify:hover {
        transform: scale(1.01);
      }
    `;
    document.head.appendChild(style);

    // Initialize
    setTimeout(initializeMagnifier, 100);

    // Watch for new images
    const observer = new MutationObserver(initializeMagnifier);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      // Clean up the style element
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return null;
}