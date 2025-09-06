"use client";
import React from 'react'
import Image from 'next/image';
import HeaderPanel from '@/components/panel/header';

const Accounting = () => {
  const fakemali = [
    { id: 1, subject: "بک لینک", status: "در حال انجام", price: "200,000", src: "/image/services/backlink.png" },
    { id: 2, subject: "محتوا", status: "انجام شده", price: "643,000" , src:"/image/services/content.png"}
  ];
  return (
    <div className="bg-white container md:w-4/6 md:mx-auto h-full">

    <HeaderPanel />

    <div className="h-screen bg-gray-100 p-6">
    <div className="flex justify-end">
        <div className="flex w-fit md:w-56">
           
        </div>
    </div>
    <div className="flex">
        <div className="w-3/4 md:w-1/3 text-end rounded-md ">
            <div className="w-full bg-white text-black rounded-t-lg h-full flex justify-center items-end">
                <span className="font-semibold pt-4 text-gray-700">تراکنش ها و کیف پول</span>
            </div>
        </div>
        <div className=" w-1/3">
        </div>
        <div className=" w-1/3 text-end rounded-md ">
        </div>
    </div>
    <div className="flex flex-wrap justify-start">
        <div className="bg-white text-black w-44 md:w-1/3 text-center p-1 relative">
        </div>
    </div>
    <div className="bg-white h-auto text-black w-full rounded-b-lg rounded-tl-lg text-end p-8">
      <div>
        <div className='flex justify-between'>
                <span className="text-sm md:text-lg font-semibold text-gray-400">اعتبار فعلی: 0 تومان</span>
                <button className="bg-orange-500 text-white px-5 py-2 rounded text-sm md:text-md">افزایش اعتبار</button>
                </div>
     <div className="flex justify-between items-center mt-4 p-4 border-t">
            </div>
            <div className="space-y-4">
            {fakemali.map((ticket) => (
          <div
            key={ticket.id}
            className="border rounded-xl px-4 py-3 bg-gray-50 flex justify-between items-center"
          >
            <div className='flex'>
              <div className='w-8 md:w-fit'><Image src={ticket.src} alt={ticket.subject} width={50} height={50} /></div>
                <div>
              <div className="font-semibold text-justify">{ticket.subject}</div>
              <div className="text-sm text-gray-500 text-justify">وضعیت: {ticket.status}</div>
              </div>
            </div>
            <div>
              <div className='text-sm'>{ticket.price} تومان</div>
            <button className="text-blue-500 hover:underline text-sm">مشاهده</button>
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>
    </div>
    </div>

  )
}

export default Accounting