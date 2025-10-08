export default function BlogSkeleton() {
  return (
    <div className="w-[1250px] mx-auto p-4 ">
      {/* Banner image */}
      <div className="w-full h-92 bg-gray-300 rounded-2xl" />

      {/* Title */}
      <div className="h-30 bg-gray-300 rounded mx-auto mt-4" />

      {/* Meta info (author/date) */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="h-4 w-24 bg-gray-300 rounded" />
        <div className="h-4 w-20 bg-gray-300 rounded" />
      </div>

      {/* Content paragraphs */}
      <div className="space-y-3 mt-6">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-4 bg-gray-300 rounded w-4/6" />
        <div className="h-4 bg-gray-300 rounded w-3/6" />
      </div>
      <div className="space-y-3 mt-10">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-4 bg-gray-300 rounded w-4/6" />
        <div className="h-4 bg-gray-300 rounded w-4/6" />
        <div className="h-4 bg-gray-300 rounded w-3/6" />
      </div>
      <div className="space-y-3 mt-6">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-4 bg-gray-300 rounded w-4/6" />
        <div className="h-4 bg-gray-300 rounded w-3/6" />
        <div className="h-4 bg-gray-300 rounded w-3/6" />
      </div>

      <div className="space-y-3 mt-6">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-4 bg-gray-300 rounded w-4/6" />
        <div className="h-4 bg-gray-300 rounded w-3/6" />
      </div>

      <div className="space-y-3 mt-6">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-4 bg-gray-300 rounded w-4/6" />
        <div className="h-4 bg-gray-300 rounded w-3/6" />
      </div>
    </div>
  );
}
