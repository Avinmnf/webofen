// components/CommentForm.tsx
'use client';

import { useState } from 'react';

export default function CommentForm({ contentType = 'post', parentId }: { contentType?: 'post' | 'product'; parentId?: string }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    subject: '',
    body: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const res = await 
    fetch('/api/proxy/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, contentType, parentId }),
    });

    if (res.ok) {
      setStatus('success');
      setForm({ fullName: '', email: '', subject: '', body: '' });
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-24 py-8 text-right text-black" dir="rtl">
      <h2 className="text-xl font-bold mb-4">ثبت دیدگاه</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* نام و ایمیل در یک ردیف */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="نام"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="ایمیل"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none"
          />
        </div>

        {/* عنوان */}
        <input
          type="text"
          name="subject"
          placeholder="عنوان"
          value={form.subject}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 focus:outline-none"
        />

        {/* متن دیدگاه */}
        <textarea
          name="body"
          placeholder="دیدگاه شما ..."
          value={form.body}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-3 py-3 h-32 resize-none focus:outline-none"
        />

        <button type="submit" className="bg-[#1e2b5c] text-white px-6 py-2 mt-2 rounded mx-auto block">
          ارسال دیدگاه
        </button>

        {status === 'success' && <p className="text-green-600">دیدگاه با موفقیت ثبت شد و در انتظار تأیید است.</p>}
        {status === 'error' && <p className="text-red-600">ارسال دیدگاه با خطا مواجه شد.</p>}
      </form>
    </div>
  );
}
