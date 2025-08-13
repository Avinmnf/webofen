'use client';

import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';

interface Comment {
  id: string;
  fullName: string;
  subject?: string;
  body: string;
  createdAt: string;
  parent?: { id: string } | null;
  children?: Comment[];
}

interface CommentNode extends Comment {
  children: CommentNode[];
}

export default function CommentsList({
  contentType,
  pageSlug,
}: {
  contentType: 'post' | 'product';
  pageSlug: string;
}) {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeComments = (list: Comment[]): CommentNode[] => {
    return list.map((c) => ({
      ...c,
      children: c.children ? normalizeComments(c.children) : [],
    }));
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const url = `http://localhost:3003/getcomments?contentType=${contentType}&pageSlug=${encodeURIComponent(
          pageSlug
        )}`;
        const res = await fetch(url);
        const data: Comment[] = await res.json();
        setComments(normalizeComments(data));
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [contentType, pageSlug]);

  const Skeleton = () => (
    <div className="rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/50 backdrop-blur shadow-sm p-4 pb-4 animate-pulse">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-8 space-y-3">
        <h2 className="text-lg font-bold text-gray-800">نظرات کاربران</h2>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (!comments.length) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900 p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-inner">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="mt-4 text-gray-800 dark:text-gray-100 font-semibold">هنوز نظری ثبت نشده است</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">اولین نفری باشید که نظر می‌دهد.</p>
        </div>
      </div>
    );
  }

  const Avatar = ({ name }: { name: string }) => {
    const initial = (name?.trim()?.charAt(0) || '؟').toUpperCase();
    return (
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400 blur-[6px] opacity-40" />
        <div className="relative w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200">
          {initial}
        </div>
      </div>
    );
  };

  const CommentCard = ({ c, level = 0 }: { c: CommentNode; level?: number }) => (
    <div className="relative">
      {/* thread line */}
      {level > 0 && (
        <div
          className="absolute -right-4 top-6 h-full border-r-2 border-dashed border-gray-200 dark:border-gray-800"
          aria-hidden
        />
      )}

      <div
        className={[
          'rounded-2xl border border-gray-200/60 dark:border-gray-800/60',
          'bg-white/80 dark:bg-gray-900/60 backdrop-blur',
          'shadow-sm hover:shadow-md transition-shadow',
          'p-4 pb-4',
        ].join(' ')}
        style={{ marginRight: level * 20 }}
      >
        <div className="flex items-start gap-3">
          <Avatar name={c.fullName} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{c.fullName}</p>
              <span className="text-[11px] leading-none text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/70 px-2 py-1 rounded-full">
                {new Date(c.createdAt).toLocaleDateString('fa-IR')}
              </span>
              {c.subject ? (
                <span className="text-[11px] leading-none bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-1 rounded-full">
                  {c.subject}
                </span>
              ) : null}
            </div>

            <p className="mt-2 text-[15px] text-gray-700 dark:text-gray-200 leading-relaxed">
              {c.body}
            </p>

            {/* action row (placeholder for reply, share, etc.) */}
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 cursor-default">
                <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-70" aria-hidden>
                  <path fill="currentColor" d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12m0 2.4C9 14.4 3.8 15.9 3.8 19v2h16.4v-2c0-3.1-5.2-4.6-8.2-4.6" />
                </svg>
                کاربر تایید شده
              </span>
            </div>
          </div>
        </div>

        {/* children */}
        {c.children?.length ? (
          <div className="mt-4 space-y-2">
            {c.children.map((child) => (
              <CommentCard key={child.id} c={child} level={level + 1} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white flex items-center justify-center shadow">
          💬
        </div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">نظرات کاربران</h2>
      </div>

      <div className="space-y-2">
        {comments.map((c) => (
          <CommentCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
