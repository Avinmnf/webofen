export default function ArticlesListSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
        >
          {/* Image placeholder */}
          <div className="h-48 bg-gray-300 w-full" />

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Title */}
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3" />

            {/* Excerpt */}
            <div className="h-4 bg-gray-300 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-4" />

            {/* Author/Date */}
            <div className="flex justify-between mt-auto">
              <div className="h-3 w-20 bg-gray-300 rounded" />
              <div className="h-3 w-16 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
