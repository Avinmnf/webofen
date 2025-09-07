'use client';

import React, { useState } from 'react';
import ProgressList from '../progress';

interface BacklinkItem {
  id: string;
  siteurl: string;
  keyword: string;
  status: string;
  datetime?: string;
}

interface BacklinkProps {
  backlinks: BacklinkItem[];
}

const Backlink: React.FC<BacklinkProps> = ({ backlinks }) => {
  const [selected, setSelected] = useState<string>('bazarpanel.com');
  const options: string[] = ['bazarpanel.com', 'ansarion.com', 'markazpanel.com'];

  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ id: string; field1: string; field2: string }>({
    id: '',
    field1: '',
    field2: '',
  });

  const handleClick = (id: string) => {
    setFormData((prev) => ({ ...prev, id }));
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('ورودی‌ها:', formData);
    // 🔧 Static mode: no fetch call, just close modal
    setShowModal(false);
  };

  return (
    <>
      <div className="flex justify-end">
        <div className="flex w-3/5 md:w-56">
          <select
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-blue-500"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="" disabled>
              انتخاب کنید...
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex">
        <div className="w-1/3 text-end rounded-md shadow">
          <div className="bg-white text-black rounded-t-lg h-full flex justify-center items-end">
            <span className="font-semibold pt-4 text-gray-700">بک لینک ها</span>
          </div>
        </div>
        <div className="w-1/3"></div>
        <div className="w-1/3 text-end rounded-md"></div>
      </div>

      <div className="flex flex-wrap justify-start">
        <div className="bg-white text-black w-1/3 text-center p-1"></div>
      </div>

      <div className="bg-white h-auto text-white w-full rounded-b-lg rounded-tl-lg text-end p-1 md:p-8 shadow">
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4 text-black bg-gray-50 p-4 rounded-lg shadow-sm">
            {Array.isArray(backlinks) &&
              backlinks.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="text-sm text-right">
                    <p className="text-gray-700 font-semibold">{item.siteurl}</p>
                    <p className="text-gray-600">{item.keyword}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* Bouncing pill */}
          {backlinks.find((item) => item.status === '0') && (
            <div className="flex justify-center w-full mt-6">
              <button
                onClick={() => handleClick(backlinks.find((item) => item.status === '0')!.id)}
              >
                <svg
                  className="animate-bounce"
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="-46.08 -46.08 604.16 604.16"
                >
                  <path
                    fill="#DFDFE1"
                    d="M479.587 188.925c43.218-43.221 43.218-113.29 0-156.512-43.221-43.218-113.292-43.218-156.513 0L32.413 323.075c-43.218 43.221-43.216 113.29.002 156.512 43.219 43.218 113.29 43.218 156.51 0z"
                  />
                  <path
                    fill="#CFCDD2"
                    d="M479.587 32.414 32.414 479.587c43.219 43.218 113.29 43.218 156.51 0l290.663-290.662c43.218-43.221 43.218-113.29 0-156.511"
                  />
                  <path
                    fill="#5e5483"
                    d="m177.743 177.745-145.33 145.33c-43.218 43.221-43.216 113.29.002 156.512 43.219 43.218 113.29 43.218 156.51 0l145.331-145.331z"
                  />
                  <path
                    fill="#634c76"
                    d="M255.999 256 32.414 479.587c43.219 43.218 113.29 43.218 156.51 0l145.331-145.331z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">ثبت اطلاعات لینک</h2>
            <input
              type="text"
              name="field1"
              placeholder="لینک صفحه فرود"
              value={formData.field1}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded-lg"
            />
            <input
              type="text"
              name="field2"
              placeholder="کلمه کلیدی"
              value={formData.field2}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              ثبت
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Backlink;
