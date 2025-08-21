'use client';

import React, { useMemo, useState } from 'react';

interface CommentFormProps {
  contentType: 'post' | 'product';
  pageSlug: string;
  parentId?: string;
  orderItemId?: string;
  productId?: string; // required when contentType === 'product'
}

export default function CommentForm({
  contentType,
  pageSlug,
  parentId,
  productId,
  orderItemId,
}: CommentFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bodyLimit = 1200;
  const bodyCount = body.length;
  const remaining = useMemo(() => Math.max(0, bodyLimit - bodyCount), [bodyCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      if (contentType === 'product' && !productId) {
        throw new Error('شناسه محصول یافت نشد. لطفاً صفحه را مجدداً بارگذاری کنید.');
      }

      const payload = {
        fullName,
        email,
        subject,
        body,
        contentType,
        pageSlug,
        parentId,
        productId,
        orderItemId,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API}/comments` ||`http://localhost:3003/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ارسال نظر');

      setSuccess('✅ نظر شما ارسال شد و پس از بررسی نمایش داده خواهد شد.');
      setFullName('');
      setEmail('');
      setSubject('');
      setBody('');
    } catch (err: any) {
      setError(err.message || 'مشکلی پیش آمد.');
    } finally {
      setLoading(false);
    }
  };

  const submitDisabled = loading || (contentType === 'product' && !productId) || bodyCount > bodyLimit;

  return (
    <div className="w-10/12 mt-10 mx-auto">
      <div
        className={[
          'rounded-3xl border border-gray-200 ',
          'bg-gray-200 backdrop-blur',
          'shadow-[0_8px_30px_rgb(0,0,0,0.06)]',
          'p-6 md:p-8',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-4 text-gray-600">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-700  flex items-center gap-2">
              <span className="inline-flex w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white items-center justify-center shadow-sm">✍️</span>
              {parentId ? 'ارسال پاسخ' : 'ارسال نظر'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              لطفاً نظر خود را با رعایت احترام ارسال کنید.
            </p>
          </div>

          {/* status badges */}
          {contentType === 'product' && !productId && (
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              شناسه محصول موجود نیست
            </span>
          )}
        </div>

        {/* Alerts */}
        {success && (
          <div className="mt-4 rounded-xl border border-green-300/70 bg-green-50 text-green-800 px-4 py-2">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-xl border border-red-300/70 bg-red-50 text-red-800 px-4 py-2 ">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-gray-700 dark:text-gray-200">
          {/* Name + Email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium mb-1 text-gray-700">نام و نام خانوادگی</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثلاً: علی رضایی"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-300 transition-all shadow-sm group-hover:shadow"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600"></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-1 text-gray-700">ایمیل</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-300 transition-all shadow-sm group-hover:shadow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="group">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">موضوع (اختیاری)</label>
            <input
              type="text"
              placeholder="مثلاً: تجربه خرید"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-300 transition-all shadow-sm group-hover:shadow"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Body */}
          <div className="group">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">متن نظر</label>
              <span
                className={[
                  'text-xs px-2 py-1 rounded-full',
                  bodyCount > bodyLimit
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300',
                ].join(' ')}
              >
                {remaining} / {bodyLimit}
              </span>
            </div>
            <textarea
              placeholder="نظر خود را اینجا بنویسید..."
              className={[
                'w-full px-4 py-3 rounded-2xl border border-gray-300 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-300 transition-all shadow-sm group-hover:shadow',
                bodyCount > bodyLimit ? 'ring-2 ring-red-300 border-red-300' : '',
              ].join(' ')}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              maxLength={bodyLimit + 200} // soft guard to prevent runaway typing
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={submitDisabled}
              className={[
                'cursor-pointer px-6 md:px-8 py-3 rounded-2xl font-semibold',
                'bg-blue-100 text-blue-900',
                'shadow-md hover:shadow-lg hover:scale-[1.015] active:scale-[0.995]',
                'transition-all disabled:opacity-50 disabled:hover:scale-100',
              ].join(' ')}
            >
              {loading ? ' در حال ارسال...' : parentId ? ' ارسال پاسخ' : ' ارسال نظر'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
