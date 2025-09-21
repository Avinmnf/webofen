"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const HeaderPanel: React.FC = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuVisible((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full flex flex-col lg:flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
      {/* Left Section */}
      <div className="relative w-4/12">
        <button
          onClick={toggleMenu}
          className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
        >
          {/* Settings Icon */}
          <svg
            className="w-6 h-6" // slightly smaller looks better
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g strokeWidth="0"></g>
            <g strokeLinecap="round" strokeLinejoin="round"></g>
            <g>
              <path
                d="M31.67 22.1611C36.0883 22.1611 39.67 18.5794 39.67 14.1611C39.67 9.74285 36.0883 6.16113 31.67 6.16113C27.2517 6.16113 23.67 9.74285 23.67 14.1611C23.67 18.5794 27.2517 22.1611 31.67 22.1611Z"
                fill="#999999"
              />
              <path
                d="M31.67 40.1709C36.0883 40.1709 39.67 36.5892 39.67 32.1709C39.67 27.7526 36.0883 24.1709 31.67 24.1709C27.2517 24.1709 23.67 27.7526 23.67 32.1709C23.67 36.5892 27.2517 40.1709 31.67 40.1709Z"
                fill="#000000"
              />
              <path
                d="M31.67 58.1611C36.0883 58.1611 39.67 54.5794 39.67 50.1611C39.67 45.7429 36.0883 42.1611 31.67 42.1611C27.2517 42.1611 23.67 45.7429 23.67 50.1611C23.67 54.5794 27.2517 58.1611 31.67 58.1611Z"
                fill="#999999"
              />
            </g>
          </svg>
        </button>

        {isMenuVisible && (
          <div
            ref={menuRef}
            className="absolute top-full mt-2 right-0 bg-white shadow-xl rounded-xl w-48 py-2 z-50 overflow-hidden before:content-[''] before:absolute before:-top-2 before:right-6 before:w-3 before:h-3 before:bg-white before:rotate-45 before:shadow-md"
          >
            <ul className="flex flex-col text-right text-gray-700">
              <li className="px-5 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                <Link
                  href="/dashboard/support"
                  className="flex items-center gap-2"
                >
                  پشتیبانی
                </Link>
              </li>
              <li className="px-5 py-3 hover:bg-blue-50 transition-colors duration-200">
                <Link
                  href="/dashboard/accounting"
                  className="flex items-center gap-2"
                >
                  مالی
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Middle Section: Logo */}
      <div className="flex-1 w-4/12 flex justify-center">
        <Image src="/homepage/logo.png" alt="Logo" width={160} height={50} />
      </div>

      {/* Right Section: Profile */}
      <div className="w-4/12 flex gap-2 justify-end items-center">
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              opacity="0.4"
              d="M12 22.01C17.5228 22.01 22 17.5329 22 12.01C22 6.48716 17.5228 2.01001 12 2.01001C6.47715 2.01001 2 6.48716 2 12.01C2 17.5329 6.47715 22.01 12 22.01Z"
              fill="#292D32"
            ></path>{" "}
            <path
              d="M12 6.93994C9.93 6.93994 8.25 8.61994 8.25 10.6899C8.25 12.7199 9.84 14.3699 11.95 14.4299C11.98 14.4299 12.02 14.4299 12.04 14.4299C12.06 14.4299 12.09 14.4299 12.11 14.4299C12.12 14.4299 12.13 14.4299 12.13 14.4299C14.15 14.3599 15.74 12.7199 15.75 10.6899C15.75 8.61994 14.07 6.93994 12 6.93994Z"
              fill="#292D32"
            ></path>{" "}
            <path
              d="M18.7807 19.36C17.0007 21 14.6207 22.01 12.0007 22.01C9.3807 22.01 7.0007 21 5.2207 19.36C5.4607 18.45 6.1107 17.62 7.0607 16.98C9.7907 15.16 14.2307 15.16 16.9407 16.98C17.9007 17.62 18.5407 18.45 18.7807 19.36Z"
              fill="#292D32"
            ></path>{" "}
          </g>
        </svg>
        <Link
          href="/dashboard"
          className="rounded-2xl transition-colors duration-300 ease-in-out hover:bg-[#f7f8fc]"
        >
          <svg
            className="w-7 h-7"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g strokeWidth="0"></g>
            <g strokeLinecap="round" strokeLinejoin="round"></g>
            <g>
              <path
                d="M56.87 25.981L50.27 21.031L47.27 18.781L35.57 10.001C34.4423 9.16327 33.0748 8.71094 31.67 8.71094C30.2652 8.71094 28.8977 9.16327 27.77 10.001L21.67 14.581V14.371C21.6684 13.8411 21.4572 13.3333 21.0825 12.9586C20.7077 12.5838 20.1999 12.3726 19.67 12.371H12.47C11.9396 12.371 11.4309 12.5817 11.0558 12.9568C10.6807 13.3319 10.47 13.8406 10.47 14.371V23.161L6.44002 26.291C6.23227 26.4524 6.05838 26.6531 5.92833 26.8817C5.79827 27.1103 5.71459 27.3624 5.68208 27.6234C5.64957 27.8844 5.66888 28.1493 5.73887 28.4028C5.80887 28.6564 5.92819 28.8936 6.09001 29.101C6.276 29.3427 6.51546 29.538 6.7896 29.6716C7.06373 29.8052 7.36505 29.8734 7.67 29.871C8.11211 29.8709 8.54152 29.7231 8.89 29.451L10.47 28.231V48.281C10.4716 50.0044 11.1569 51.6568 12.3756 52.8755C13.5942 54.0941 15.2466 54.7794 16.97 54.781H25.6C25.9594 54.7808 26.3121 54.6831 26.6203 54.4981C26.9285 54.3132 27.1807 54.0481 27.35 53.731C27.5142 53.4413 27.6003 53.114 27.6 52.781C27.6017 52.7109 27.5983 52.6407 27.59 52.571V46.851C27.5916 45.7703 28.0223 44.7345 28.7874 43.9713C29.5525 43.2081 30.5893 42.7799 31.67 42.781C32.7491 42.7821 33.7837 43.2112 34.5468 43.9742C35.3098 44.7373 35.7389 45.7719 35.74 46.851V52.781C35.7397 53.114 35.8259 53.4413 35.99 53.731C36.1624 54.0477 36.4167 54.3122 36.7263 54.4969C37.0359 54.6816 37.3895 54.7797 37.75 54.781H46.37C48.0929 54.7776 49.7442 54.0917 50.9624 52.8734C52.1807 51.6552 52.8666 50.0039 52.87 48.281V27.981L54.47 29.181C54.8129 29.4398 55.2305 29.5801 55.66 29.581C55.9718 29.5802 56.2792 29.5076 56.5584 29.3689C56.8376 29.2301 57.081 29.029 57.27 28.781C57.5883 28.3567 57.7249 27.8233 57.6499 27.2982C57.5749 26.7731 57.2944 26.2993 56.87 25.981Z"
                fill="#999999"
              />
            </g>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default HeaderPanel;
