"use client";

import React from "react";
import { useComments, Comment } from "@/hooks/useComments";

interface CommentNode extends Comment {
  children: CommentNode[];
}

export default function CommentsList({
  contentType,
  pageSlug,
}: {
  contentType: "post" | "product";
  pageSlug: string;
}) {
  const { comments: fetchedComments, loading, error } = useComments({
    contentType,
    pageSlug,
  });

  const normalizeComments = (list: Comment[]): CommentNode[] => {
    return list.map((c) => ({
      ...c,
      children: c.children ? normalizeComments(c.children) : [],
    }));
  };

  const comments: CommentNode[] = normalizeComments(fetchedComments);

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

  const Avatar = ({ name }: { name: string }) => {
    const initial = (name?.trim()?.charAt(0) || "؟").toUpperCase();
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
      {level > 0 && (
        <div
          className="absolute -right-4 top-6 h-full border-r-2 border-dashed border-gray-200 dark:border-gray-800"
          aria-hidden
        />
      )}
      <div
        className={[
          "rounded-2xl border border-gray-200/60 dark:border-gray-800/60",
          "bg-white/80 dark:bg-gray-900/60 backdrop-blur",
          "shadow-sm hover:shadow-md transition-shadow",
          "p-4 pb-4",
        ].join(" ")}
        style={{ marginRight: level * 20 }}
      >
        <div className="flex items-start gap-3">
          <Avatar name={c.fullName} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {c.fullName}
              </p>
              <span className="text-[11px] leading-none text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/70 px-2 py-1 rounded-full">
                {new Date(c.createdAt).toLocaleDateString("fa-IR")}
              </span>
              {c.subject && (
                <span className="text-[11px] leading-none bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-1 rounded-full">
                  {c.subject}
                </span>
              )}
            </div>
            <p className="mt-2 text-[15px] text-gray-700 dark:text-gray-200 leading-relaxed">
              {c.body}
            </p>
          </div>
        </div>

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
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          نظرات کاربران
        </h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900 p-8 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-inner">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="mt-4 text-gray-800 dark:text-gray-100 font-semibold">
            هنوز نظری ثبت نشده است
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            اولین نفری باشید که نظر می‌دهد.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map((c) => (
            <CommentCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
