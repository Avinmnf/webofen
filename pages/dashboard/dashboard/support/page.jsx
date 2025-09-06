'use client'
import React from 'react'
import Tickettabs from '@/components/panel/ticket/Tickettabs';
import HeaderPanel from '@/components/panel/header';
const Ticketing = () => {
    
    return (
        <div className="bg-white container md:w-4/6 md:mx-auto h-full">

        <HeaderPanel />

        <div className="h-screen bg-gray-100 p-6">
        <div className="w-full bg-white shadow-lg rounded-2xl p-6">
             <Tickettabs />
        </div>
        </div>
        </div>

    );
}
export default Ticketing