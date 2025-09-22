'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

const LoginPhonePage = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginWithPhone } = useAuth(); // ⚡ استفاده از loginWithPhone
  const router = useRouter();

  // ارسال OTP
  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  // تایید OTP
  const verifyOtp = async () => {
    if (!loginWithPhone) {
      setError('Phone login not available');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const success = await loginWithPhone(phone, otp);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid OTP or phone number');
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-black">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {step === 'phone' ? 'Login with Phone' : 'Enter OTP'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {step === 'phone' && (
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="09123456789"
            required
          />
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            OTP Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter OTP"
            required
          />
          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            onClick={() => setStep('phone')}
            disabled={loading}
            className="w-full mt-2 text-blue-500 underline hover:text-blue-700"
          >
            Edit Phone Number
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPhonePage;
