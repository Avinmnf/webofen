'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: "خانه", href: "/" },
    { label: "مشاوره", href: "/" },
    { label: "خدمات درمانی", href: "/products" },
    { label: "وبلاگ", href: "/articles" },
    { label: "درباره ما", href: "/" },
    { label: "بیمه وب و فن", href: "/" }
  ];

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

          {/* CTA Button */}
          <div className={`mt-4 lg:mt-0 ${menuOpen ? 'block' : 'hidden lg:block'}`}>
            <button className="bg-[#6FD6E5] hover:bg-[#1d546b] w-24 h-10 rounded-lg text-white hover:scale-102 transition-all cursor-pointer">
              ورود
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
