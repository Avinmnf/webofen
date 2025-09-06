import Image from "next/image"
import React from "react"
import Dashboardcontent from "@/components/panel/dashboardcontent";
import HeaderPanel from "@/components/panel/header";
import { cookies } from 'next/headers';

const getjobs = async (myCookie) => {
    const posts = await fetch(`https://api.webofen.com/api/getjobs/${myCookie}`, { cache: "no-store" });
    return posts.json();
}
const Page = async () => {
    const cookieStore = cookies();
    const myCookie = cookieStore.get('userToken');
    const jobs = await getjobs(myCookie.value);
    console.log(jobs)
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
            <div className="md:w-6/12 mx-auto px-4 py-6 max-w-7xl">
            <div className="animate-fadeIn z-40">
                    <HeaderPanel />
                </div>
                <div className="mt-6 relative rounded-2xl shadow-lg overflow-hidden glass-effect hover-scale animate-slideInRight z-0">
                    <Dashboardcontent jobs={jobs}/>
                </div>
        </div>
        </div>
    );
}
export default Page;

