
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Reservetime() {

    return (
            <motion.div
      className="relative w-full aspect-[3/4] sm:aspect-[15/3] overflow-hidden flex items-start"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
        <div className="relative w-full aspect-[3/4] sm:aspect-[15/3] overflow-hidden flex items-start">
            {/* Desktop Image */}
            <Image
                src="/homepage/timereserve.png"
                alt="Desktop slide"
                fill
                className="object-cover hidden sm:block"
            />
            {/* Mobile Image */}
            <Image
                src="/homepage/timeresmobile.png"
                alt="Mobile slide"
                fill
                className="object-cover block sm:hidden"
            />
            <div className="absolute top-50 md:top-6 right-4 items-start z-10 p-10 md:p-4 pt-10 rounded-xl">
                <div className="mt-10">
                    <p className="text-lg md:text-3xl text-white mb-4">
                        قبل از ثبت نوبت می‌توانید از ما
                        <span className="text-[#1d546b]"> مشاوره رایگان </span>
                        دریافت کنید :
                    </p>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-10">
                    <input
                        type="text"
                        placeholder="نام و نام خانوادگی"
                        className="bg-[#f7f8fc] text-gray-700 rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#1d546b] focus:ring-2 focus:ring-[#1d546b] transition-all duration-200"
                    />
                    <input
                        type="text"
                        placeholder="تلفن همراه"
                        className="bg-[#f7f8fc] text-gray-700 rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#1d546b] focus:ring-2 focus:ring-[#1d546b] transition-all duration-200"
                    />
                    <div className="w-full lg:w-auto">
                        <motion.button
                            className="w-full lg:w-32 h-10 bg-[#1d546b] text-white rounded-xl mt-2 lg:mt-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            ثبت درخواست
                        </motion.button>
                    </div>
                </div>
            </div>
            </div>
            </motion.div >

    );
}
