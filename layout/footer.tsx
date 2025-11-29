import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [contact, setContact] = useState("");

  const handleChange = (e:any) => {
    setContact(e.target.value);
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // تشخیص اینکه کاربر ایمیل وارد کرده یا شماره تلفن
    const isEmail = contact.includes('@');
    const isPhone = /^[\d\s\-\+\(\)]+$/.test(contact);
    
    console.log("فرم ارسال شد:", { contact, type: isEmail ? 'email' : isPhone ? 'phone' : 'unknown' });
    alert("اطلاعات شما با موفقیت ثبت شد!");
    setContact("");
  };

  return (
    <footer className="w-full text-gray-800 pt-10 text-center bg-white md:mb-10">
      <div className="md:max-w-[1250px] m-auto rounded-t-2xl md:rounded-2xl flex flex-col lg:flex-row p-5 md:p-15 items-stretch gap-6 bg-[#1d546b]">
        <div className="md:w-[60%] w-full">
          <Link href="/">
            <Image
              width={160}
              height={100}
              src="/homepage/white-logoAsset 7.png"
              alt="logo"
              priority
            />
          </Link>
          <p className="text-start text-gray-50 mt-4 text-sm">
            وبوفن (Webofen) یک پلتفرم تحلیلی و هوشمند است که با هدف بهبود
            عملکرد، سئو و تجربه کاربری وب‌سایت‌ها طراحی شده است. ما در وبوفن
            تلاش می‌کنیم تا با استفاده از ابزارهای دقیق تحلیل داده، بررسی فنی و
            گزارش‌های قابل‌فهم، به صاحبان وب‌سایت‌ها کمک کنیم تا نقاط ضعف و قوت
            وب خود را شناسایی و برطرف کنند.
          </p>
          <div className="flex mt-10 md:justify-start justify-center">
            <div>
              <div className="bg-[#153e4c] p-2 rounded-lg mb-4">
                <Image
                  width={40}
                  height={40}
                  src="/homepage/emad1Asset 9.png"
                  alt="logo"
                  priority
                />
              </div>
              <div className="bg-[#153e4c] p-2 rounded-lg my-4">
                <Image
                  width={40}
                  height={40}
                  src="/homepage/emad2Asset 10.png"
                  alt="logo"
                  priority
                />
              </div>
              <div className="bg-[#153e4c] p-2 rounded-lg mt-4">
                <Image
                  width={40}
                  height={40}
                  src="/homepage/emad1Asset 9.png"
                  alt="logo"
                  priority
                />
              </div>
            </div>
            <div className="w-0.5 h-48 rounded-2xl mr-5 md:mr-10 bg-[#153e4c]"></div>
            <div className="flex flex-col gap-3 mr-5 md:mr-10">
              <p className="text-gray-50 text-xs md:text-base">دسترسی آسان</p>
              {[
                { label: "صفحه اصلی", href: "/" },
                { label: "درباره ما", href: "/about-us" },
                { label: "تماس با ما", href: "/contact-us" },
                { label: "سوالات متداول", href: "/" },
                { label: "نقشه سایت", href: "/sitemap.xml", isExternal: true },
              ].map((item) =>
                item.isExternal ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-start relative pr-4 text-gray-200 text-xs md:text-sm cursor-pointer before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-gray-200 hover:text-[#f78c0a] hover:before:bg-[#f78c0a] transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-start relative pr-4 text-gray-200 text-xs md:text-sm cursor-pointer before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-gray-200 hover:text-[#f78c0a] hover:before:bg-[#f78c0a] transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            <div className="w-0.5 h-48 rounded-2xl mr-5 md:mr-10 bg-[#153e4c]"></div>
            <div className="flex flex-col gap-3 mr-5 md:mr-10">
              <p className="text-gray-50 text-xs md:text-base">دسته بندی</p>
              {[
                { label: "داروخانه وبوفن", href: "/products" },
                { label: "طراحی سایت", href: "/web-design" },
                { label: "وبلاگ وبوفن", href: "/articles" },
                { label: "آنالیز سایت", href: "/analyze" },
                { label: "بیمه وبوفن", href: "/" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-start relative pr-4 text-gray-200 text-xs md:text-sm cursor-pointer before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-gray-200 hover:text-[#f78c0a] hover:before:bg-[#f78c0a] transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:w-[50%] flex flex-col gap-4 mt-4">
          <div className="text-gray-50 text-start">
            <p className="text-lg">دریافت خبرنامه وبوفن</p>
            <p className="text-sm text-gray-100 mt-4">
              جهت دریافت خبرنامه، شماره تلفن یا ایمیل خود را وارد کنید
            </p>

            <form onSubmit={handleSubmit} className="mt-4">
              <input
                type="text"
                name="contact"
                placeholder="شماره تلفن یا ایمیل خود را وارد کنید"
                className="w-full p-3 text-sm rounded-md bg-[#153e4c] text-gray-50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                value={contact}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="w-full bg-[#153e4c] hover:bg-orange-400 cursor-pointer text-white py-3 px-4 rounded-md transition duration-200 font-medium mt-4"
              >
                عضویت در خبرنامه
              </button>
            </form>
          </div>
          <div className="flex items-center justify-between mt-5 md:mt-10">
            <Link href={"/"}>
              <div className="text-gray-50 cursor-pointer border border-[#f78c0a] rounded-md justify-center p-2 md:p-0 md:w-30 md:h-12 text-sm flex items-center">
                <svg
                  className="w-6 h-6 ml-4"
                  id="Layer_2"
                  data-name="Layer 2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 45.29 31.9"
                >
                  <defs>
                    <style>
                      {`
        .cls-1 {
          fill: #b3c0c9;
        }
        .cls-2 {
          opacity: 0.5;
        }
      `}
                    </style>
                  </defs>
                  <g id="Layer_1-2" data-name="Layer 1">
                    <g className="cls-2">
                      <path
                        className="cls-1"
                        d="M44.34,4.98c-.52-1.96-2.05-3.51-4-4.03-3.53-.95-17.69-.95-17.69-.95,0,0-14.16,0-17.69.95C3,1.48,1.47,3.02.95,4.98c-.95,3.55-.95,10.97-.95,10.97,0,0,0,7.42.95,10.97.52,1.96,2.05,3.51,4,4.03,3.53.95,17.69.95,17.69.95,0,0,14.16,0,17.69-.95,1.95-.52,3.48-2.07,4-4.03.95-3.55.95-10.97.95-10.97,0,0,0-7.42-.95-10.97ZM18.01,22.69v-13.47l11.83,6.73-11.83,6.73Z"
                      />
                    </g>
                  </g>
                </svg>
                <span>یوتیوب</span>
              </div>
            </Link>
            <Link href={"/"}>
              <div className="text-gray-50 cursor-pointer border border-[#f78c0a] rounded-md justify-center p-2 md:p-0 md:w-30 md:h-12 text-sm flex items-center">
                <svg
                  className="w-6 h-6 ml-4"
                  id="Layer_2"
                  data-name="Layer 2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 31.9 31.9"
                >
                  <defs>
                    <style>
                      {`
        .cls-1 {
          fill: #b3c0c9;
          fill-rule: evenodd;
        }
        .cls-2 {
          opacity: 0.5;
        }
      `}
                    </style>
                  </defs>
                  <g id="Layer_1-2" data-name="Layer 1">
                    <g id="Artboard" className="cls-2">
                      <path
                        className="cls-1"
                        d="M15.95,0C7.14,0,0,7.14,0,15.95s7.14,15.95,15.95,15.95,15.95-7.14,15.95-15.95S24.76,0,15.95,0ZM23.35,10.85c-.24,2.52-1.28,8.64-1.81,11.47-.22,1.2-.66,1.6-1.09,1.64-.93.09-1.63-.61-2.53-1.2-1.4-.92-2.2-1.49-3.56-2.39-1.58-1.04-.55-1.61.34-2.54.24-.24,4.32-3.96,4.4-4.29,0-.04.02-.2-.07-.28s-.23-.05-.33-.03c-.14.03-2.38,1.51-6.73,4.45-.64.44-1.21.65-1.73.64-.57-.01-1.66-.32-2.48-.59-1-.32-1.79-.5-1.72-1.05.04-.29.43-.58,1.19-.88,4.65-2.03,7.75-3.36,9.3-4.01,4.43-1.84,5.35-2.16,5.95-2.17.75-.01.93.61.87,1.25Z"
                      />
                    </g>
                  </g>
                </svg>

                <span>تلگرام</span>
              </div>
            </Link>
            <Link href={"/"}>
              <div className="text-gray-50 cursor-pointer border border-[#f78c0a] rounded-md justify-center p-2 md:p-0 md:w-30 md:h-12 text-sm flex items-center">
                <svg
                  className="w-6 h-6 ml-2"
                  id="Layer_2"
                  data-name="Layer 2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30.96 30.96"
                >
                  <g id="Layer_1-2" data-name="Layer 1">
                    <g>
                      <path
                        d="M18.71,15.46c0,1.85-1.5,3.34-3.34,3.34s-3.34-1.5-3.34-3.34,1.5-3.34,3.34-3.34,3.34,1.5,3.34,3.34h0Z"
                        fill="#b3c0c9"
                        opacity={0.5}
                      />
                      <path
                        d="M15.48,0h0C6.93,0,0,6.93,0,15.48h0c0,8.55,6.93,15.48,15.48,15.48h0c8.55,0,15.48-6.93,15.48-15.48h0C30.96,6.93,24.03,0,15.48,0ZM25.33,19.6c-.05,1.07-.22,1.8-.47,2.43-.26.66-.6,1.22-1.16,1.78-.56.56-1.12.9-1.78,1.16-.64.25-1.37.42-2.43.47-1.07.05-1.41.06-4.13.06s-3.06-.01-4.13-.06c-1.07-.05-1.8-.22-2.43-.47-.66-.26-1.22-.6-1.78-1.16-.56-.56-.9-1.12-1.16-1.78-.25-.64-.42-1.37-.47-2.43-.05-1.07-.06-1.41-.06-4.13s.01-3.06.06-4.13c.05-1.07.22-1.8.47-2.43.26-.66.6-1.22,1.16-1.78s1.12-.9,1.78-1.16c.64-.25,1.37-.42,2.43-.47,1.07-.05,1.41-.06,4.13-.06s3.07.01,4.13.06c1.07.05,1.8.22,2.43.47.66.26,1.22.6,1.78,1.16.56.56.9,1.12,1.16,1.78.25.64.42,1.37.47,2.43.05,1.07.06,1.41.06,4.13s-.01,3.06-.06,4.13c-.05-.98-.21-1.51-.34-1.86h0ZM15.37,20.61c-2.84,0-5.15-2.31-5.15-5.15s2.31-5.15,5.15-5.15,5.15,2.31,5.15,5.15-2.31,5.15-5.15,5.15h0ZM20.72,11.31c-.66,0-1.2-.54-1.2-1.2s.54-1.2,1.2-1.2,1.2.54,1.2,1.2-.54,1.2-1.2,1.2h0Z"
                        fill="#b3c0c9"
                        opacity={0.5}
                      />
                    </g>
                  </g>
                </svg>

                <span>اینستاگرام</span>
              </div>
            </Link>
          </div>
          <div className="text-start text-sm text-gray-300 bg-[#153e4c] rounded-md p-6 mt-5 md:mt-10">
            <div className="flex items-center gap-1 md:gap-2 mt-2">
              <p>تلفن :</p>
              <span>14 59 51 88 - 021</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 mt-2">
              <p>آدرس :</p>
              <span> تهران - سهروردی شمالی - کوچه مهاجر - پلاک 30</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}