'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { cart, removeItem, updateItemQuantity, placeOrder } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  const menuItems = [
    { label: "خانه", href: "/" },
    { label: "مشاوره", href: "/" },
    { label: "خدمات درمانی", href: "/products" },
    { label: "وبلاگ", href: "/articles" },
    { label: "درباره ما", href: "/" },
    { label: "بیمه وب و فن", href: "/" }
  ];

  // Logout called from modal, no redirect
  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };

  return (
    <header dir="rtl" className="w-full p-4 bg-[#f7f8fc] text-black">
      <div className="flex justify-center">
        <div className="w-11/12 flex flex-col lg:flex-row items-center justify-between rounded-2xl bg-white p-4">

          {/* Logo & Toggle Button */}
          <div className="w-full flex items-center justify-between lg:w-auto">
            <Link href="/">
              <Image
                width={150}
                height={100}
                src="/homepage/logo.png"
                alt="logo"
                priority
              />
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className={`w-full lg:w-auto transition-all duration-300 ${menuOpen ? 'block mt-4' : 'hidden lg:flex'}`}>
            <ul className="flex flex-col lg:flex-row items-center gap-4 lg:gap-10">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    setMenuOpen(false);
                  }}
                  className={`cursor-pointer select-none ${activeIndex === index ? 'text-[#6fd6e5] font-bold' : 'text-gray-700'}`}
                >
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA Button or Username with dropdown */}
          <div className={`relative mt-4 lg:mt-0 ${menuOpen ? 'block' : 'hidden lg:block'}`} ref={dropdownRef}>
            {isLoggedIn && user ? (
              <>
                <div className='flex items-center cursor-pointer'>
                  <div
                    className="flex items-center select-none border rounded-xl px-4 py-1 border-gray-300 ml-5"
                    onClick={() => setProfileDropdownOpen((open) => !open)}
                    aria-haspopup="true"
                    aria-expanded={profileDropdownOpen}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-7 h-7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          opacity="0.4"
                          d="M12 22.01C17.5228 22.01 22 17.5329 22 12.01C22 6.48716 17.5228 2.01001 12 2.01001C6.47715 2.01001 2 6.48716 2 12.01C2 17.5329 6.47715 22.01 12 22.01Z"
                          fill="#1d546b"
                        />
                        <path
                          d="M12 6.93994C9.93 6.93994 8.25 8.61994 8.25 10.6899C8.25 12.7199 9.84 14.3699 11.95 14.4299C11.98 14.4299 12.02 14.4299 12.04 14.4299C12.06 14.4299 12.09 14.4299 12.11 14.4299C12.12 14.4299 12.13 14.4299 12.13 14.4299C14.15 14.3599 15.74 12.7199 15.75 10.6899C15.75 8.61994 14.07 6.93994 12 6.93994Z"
                          fill="#1d546b"
                        />
                        <path
                          d="M18.7807 19.36C17.0007 21 14.6207 22.01 12.0007 22.01C9.3807 22.01 7.0007 21 5.2207 19.36C5.4607 18.45 6.1107 17.62 7.0607 16.98C9.7907 15.16 14.2307 15.16 16.9407 16.98C17.9007 17.62 18.5407 18.45 18.7807 19.36Z"
                          fill="#1d546b"
                        />
                      </g>
                    </svg>
                    <div className="text-[#1d546b] mr-2 select-none">
                      {user.name}
                    </div>
                  </div>
                  <div className='border-r border-gray-300 pr-4 relative'>
                    <Link href={'/cart'}>
                      <svg viewBox="0 0 24 24"
                        className='w-6 h-6'
                        fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g strokeWidth="0" />
                        <g strokeLinecap="round" strokeLinejoin="round" />
                        <g>
                          <path
                            opacity="0.1"
                            d="M5.60464 11.4417C5.79269 13.1343 5.88672 13.9805 6.45624 14.4903C7.02576 15 7.87723 15 9.58017 15H9.70588H13.4706H14.827C16.0002 15 16.5867 15 17.0627 14.7134C17.5387 14.4268 17.8132 13.9084 18.3621 12.8716L20.8303 8.20947C21.361 7.207 20.6343 6 19.5 6H9.70588H9.46906C7.38336 6 6.34051 6 5.74427 6.66616C5.14803 7.33231 5.2632 8.36878 5.49353 10.4417L5.60464 11.4417Z"
                            fill="#1d546b"
                          />
                          <path
                            d="M5.60464 11.4417C5.79269 13.1343 5.88672 13.9805 6.45624 14.4903C7.02576 15 7.87723 15 9.58017 15H9.70588H13.4706H14.827C16.0002 15 16.5867 15 17.0627 14.7134C17.5387 14.4268 17.8132 13.9084 18.3621 12.8716L20.8303 8.20947C21.361 7.207 20.6343 6 19.5 6V6H9.70588H9.46906C7.38336 6 6.34051 6 5.74427 6.66616C5.14803 7.33231 5.2632 8.36878 5.49353 10.4417L5.60464 11.4417Z"
                            stroke="#1d546b"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 3H3.5V3C4.1642 3 4.72218 3.49942 4.79553 4.15955L5.55558 11"
                            stroke="#1d546b"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18C8.32843 18 9 18.6716 9 19.5Z"
                            stroke="#1d546b"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 19.5C18 20.3284 17.3284 21 16.5 21C15.6716 21 15 20.3284 15 19.5C15 18.6716 15.6716 18 16.5 18C17.3284 18 18 18.6716 18 19.5Z"
                            stroke="#1d546b"
                            strokeWidth="2"
                          />
                        </g>
                      </svg>
                      {cart.length > 0 && (
                        <span className="absolute -top-2 right-2 bg-blue-900 text-white text-xs rounded-full px-1">
                          {cart.length}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute border-b border-gray-200 right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="block border-b border-gray-200 w-full text-right px-4 py-3 text-sm text-gray-700 cursor-pointer"
                      role="menuitem"
                      type="button"
                    >
                      خروج
                    </button>
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="block border-b border-gray-200 w-full text-right px-4 py-3 text-sm text-gray-700 cursor-pointer"
                      role="menuitem"
                      type="button"
                    >
                      سفارش ها
                    </button>
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="block border-b border-gray-200 w-full text-right px-4 py-3 text-sm text-gray-700 cursor-pointer"
                      role="menuitem"
                      type="button"
                    >
                      داشبورد
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button className="bg-[#6FD6E5] hover:bg-[#1d546b] w-24 h-10 rounded-lg text-white hover:scale-102 transition-all cursor-pointer">
                <Link href={'/login'}>
                  ورود
                </Link>
              </button>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-5 w-92 text-right">
                  <p className="mb-4">آیا مطمئن هستید که می‌خواهید خارج شوید؟</p>
                  <div className="flex justify-between mt-5">
                    <button
                      onClick={() => setShowLogoutModal(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      خیر
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-[#6FD6E5] text-white rounded hover:bg-[#1d546b]"
                    >
                      بله
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
