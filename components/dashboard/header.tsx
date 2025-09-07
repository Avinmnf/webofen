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
    <div className="flex items-center justify-between bg-white shadow-md rounded-2xl p-4 relative">
      {/* Left Section */}
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {/* Settings Icon */}
          <svg
            className="w-8 h-8 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <g>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.59248 2.14193C8.75191 1.45656 10.2226 1.87704 10.8946 3.00654L10.8991 3.01421L11.0091 3.20423L11.0107 3.20701C11.3807 3.85247 11.7666 4.00751 12.0012 4.00751C12.237 4.00751 12.6259 3.85115 13.0009 3.20423L13.1154 3.00651C13.7874 1.877 15.2581 1.45656 16.4175 2.14193L18.1421 3.12883C19.4147 3.85604 19.8463 5.48713 19.1194 6.74522L19.1189 6.74611C18.7439 7.39298 18.8028 7.8062 18.9198 8.00929C19.0369 8.21249 19.3648 8.47001 20.11 8.47001C21.5616 8.47001 22.76 9.65323 22.76 11.12V12.88C22.76 14.3317 21.5768 15.53 20.11 15.53C19.3648 15.53 19.0369 15.7875 18.9198 15.9907C18.8028 16.1938 18.7439 16.607 19.1189 17.2539L19.1212 17.2579C19.8444 18.5235 19.4157 20.1431 18.1425 20.871L16.4174 21.8581C15.258 22.5434 13.7874 22.123 13.1154 20.9935L13.1109 20.9858L13.0009 20.7958L12.9993 20.793C12.6293 20.1476 12.2434 19.9925 12.0087 19.9925C11.773 19.9925 11.3841 20.1489 11.0091 20.7958L10.8946 20.9935C10.2226 22.123 8.75199 22.5434 7.59257 21.8581L5.8679 20.8712C4.59558 20.1439 4.16378 18.5128 4.8906 17.2548L4.89112 17.2539C5.26605 16.607 5.20721 16.1938 5.09018 15.9907C4.97308 15.7875 4.64521 15.53 3.9 15.53C2.43322 15.53 1.25 14.3317 1.25 12.88V11.12C1.25 9.66837 2.43322 8.47001 3.9 8.47001C4.64521 8.47001 4.97308 8.21249 5.09018 8.00929C5.20721 7.8062 5.26605 7.39298 4.89112 6.74611L4.8906 6.74522C4.16378 5.48726 4.59518 3.85639 5.86749 3.12906L7.59248 2.14193Z"
                  fill="#BFBFBF"
                />
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  fill="#000000"
                />
              </g>
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
      <div className="flex-1 flex justify-center">
        <Image src="/homepage/logo.png" alt="Logo" width={180} height={50} />
      </div>

      {/* Right Section: Profile */}
      <div className="w-3/12 flex justify-end items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 p-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-sm"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeaderPanel;
