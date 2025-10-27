'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useForms, FormPayload } from '@/hooks/useform';

export default function Reservetime() {
  const { submitForm, loading } = useForms();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    phone: false
  });

  const handleSubmit = async () => {
    // Reset errors
    setErrors({
      name: false,
      phone: false
    });
    setSuccess(false);

    // Validate fields
    const newErrors = {
      name: !name,
      phone: !phone
    };

    if (newErrors.name || newErrors.phone) {
      setErrors(newErrors);
      return;
    }

    const payload: FormPayload = {
      title: 'درخواست مشاوره رایگان',
      fields: [
        { label: 'نام و نام خانوادگی', type: 'text', content: name },
        { label: 'تلفن همراه', type: 'text', content: phone },
      ],
    };

    const result = await submitForm(payload);

    if (result) {
      setSuccess(true);
      setName('');
      setPhone('');
    }
  };

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
        <div className="absolute top-30 md:top-6 md:right-4 items-start z-10 p-10 md:p-4 pt-10 rounded-xl">
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
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors(prev => ({...prev, name: false}));
                }
              }}
              className={`bg-[#f7f8fc] text-gray-700 rounded-lg p-2 px-4 text-sm border transition-all duration-200 ${
                errors.name 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-transparent focus:outline-none focus:border-[#1d546b] focus:ring-2 focus:ring-[#1d546b]'
              }`}
            />
            <input
              type="text"
              placeholder="تلفن همراه"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) {
                  setErrors(prev => ({...prev, phone: false}));
                }
              }}
              className={`bg-[#f7f8fc] text-gray-700 rounded-lg p-2 px-4 text-sm border transition-all duration-200 ${
                errors.phone 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                  : 'border-transparent focus:outline-none focus:border-[#1d546b] focus:ring-2 focus:ring-[#1d546b]'
              }`}
            />
            <div className="w-full lg:w-auto flex justify-center">
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-32 h-10 bg-[#1d546b] text-white rounded-xl whitespace-nowrap px-3"
              >
                {loading ? 'در حال ارسال...' : 'ثبت درخواست'}
              </motion.button>
            </div>
          </div>

          {/* Success message only (error messages removed) */}
          {success && <p className="text-green-500 mt-4 text-center">فرم با موفقیت ثبت شد!</p>}
        </div>
      </div>
    </motion.div>
  );
}