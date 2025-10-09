import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f8fc] text-center px-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-7xl font-bold text-blue-800 mb-4">۴۰۴</h1>
        <p className="text-md text-gray-600 mb-6 leading-relaxed">
          متأسفیم، صفحه‌ای که به دنبال آن هستید پیدا نشد.
        </p>
        <Link
          href="/"
          className="inline-block p-2 bg-[#6fd6e5] text-white text-base rounded-xl shadow transition-all duration-300"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
      <p className="mt-8 text-sm text-gray-500">
        ممکن است آدرس صفحه را اشتباه وارد کرده باشید.
      </p>
    </div>
  );
}
