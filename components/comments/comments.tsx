"use client";

import React, { useMemo, useState } from "react";
import { useCreateComment } from "@/hooks/useCreateComment";

interface CommentFormProps {
  contentType: "post" | "product";
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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const bodyLimit = 1200;
  const bodyCount = body.length;
  const remaining = useMemo(
    () => Math.max(0, bodyLimit - bodyCount),
    [bodyCount]
  );

  const { createComment, loading, error, comment } = useCreateComment();
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    if (contentType === "product" && !productId) {
      setSuccess(null);
      return alert("شناسه محصول یافت نشد. لطفاً صفحه را مجدد بارگذاری کنید.");
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

    const created = await createComment(payload);
    if (created) {
      setSuccess("✅ نظر شما ارسال شد و پس از بررسی نمایش داده خواهد شد.");
      setFullName("");
      setEmail("");
      setSubject("");
      setBody("");
    }
  };

  const submitDisabled =
    loading ||
    (contentType === "product" && !productId) ||
    bodyCount > bodyLimit;

  return (
    <div className="w-full mt-2 mx-auto">
      <div>
        <div className="flex items-start justify-between gap-4 text-gray-600">
          <div>
            <p className="text-2xl font-extrabold text-gray-700  flex items-center gap-2">

              {parentId ? "ارسال پاسخ" : "ارسال نظر"}
            </p>

          </div>

          {contentType === "product" && !productId && (
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              شناسه محصول موجود نیست
            </span>
          )}
        </div>

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

        <form
          onSubmit={handleSubmit}
          className="mt-2 space-y-4 text-gray-700 dark:text-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                placeholder="مثلاً: علی رضایی"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-300 transition-all shadow-sm group-hover:shadow"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                ایمیل
              </label>
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

          <div className="group">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              موضوع (اختیاری)
            </label>
            <input
              type="text"
              placeholder="مثلاً: تجربه خرید"
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-300 transition-all shadow-sm group-hover:shadow"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="group">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                متن نظر
              </label>
            </div>
            <textarea
              placeholder="نظر خود را اینجا بنویسید..."
              className={[
                "w-full px-4 py-3 rounded-2xl border border-gray-300 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-300 transition-all shadow-sm group-hover:shadow",
                bodyCount > bodyLimit
                  ? "ring-2 ring-red-300 border-red-300"
                  : "",
              ].join(" ")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              maxLength={bodyLimit + 200}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={submitDisabled}
              className={[
                "cursor-pointer px-6 md:px-8 py-3 rounded-lg",
                "bg-[#1d546b] text-white",
                "shadow-md hover:shadow-lg hover:scale-[1.015] active:scale-[0.995]",
                "transition-all disabled:opacity-50 disabled:hover:scale-100",
              ].join(" ")}
            >
              {loading
                ? " در حال ارسال..."
                : parentId
                ? " ارسال پاسخ"
                : " ارسال نظر"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
