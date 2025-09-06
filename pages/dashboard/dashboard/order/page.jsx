"use client";
import HeaderPanel from "@/components/panel/header";
import { useState, useRef, useEffect } from "react";
import ProductTable from "@/components/panel/producttable";
import Cookies from 'js-cookie';

const Orders = () => {
    const [value, setValue] = useState(null);
    const [data, setdata] = useState([]);

    useEffect(() => {
        // Get token from cookies directly
        const userToken = Cookies.get('userToken');
        if (userToken) {
            setValue(userToken);
        }
    }, []);

    useEffect(() => {
        if (!value) return;
        readorder(value);
    }, [value]);

    const readorder = async (value) => {
        try {
            const res2 = await fetch(`https://api.webofen.com/api/readorder/${value}/`, {
                method: "GET"
            });
            const data = await res2.json();
            setdata(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }
    return (
        <div className="bg-white container md:w-4/6 md:mx-auto h-full">
            <HeaderPanel />

            <div className="h-screen bg-gray-100 p-6">
                <div className="flex justify-end">
                    <div className="flex w-fit md:w-56">
                    </div>
                </div>
                <div className="flex">
                    <div className="w-1/3 text-end rounded-md">
                        <div className="bg-white text-black rounded-t-lg h-full flex justify-center items-end">
                            <span className="font-semibold pt-4 text-gray-700">لیست سفارشات</span>
                        </div>
                    </div>
                    <div className="w-1/3">
                    </div>
                    <div className="w-1/3 text-end rounded-md">
                    </div>
                </div>
                <div className="flex flex-wrap justify-start">
                    <div className="bg-white text-black w-1/3 text-center p-1">
                    </div>
                </div>
                <div className="bg-white h-auto text-white w-full rounded-b-lg rounded-tl-lg text-end p-4 md:p-8">
                    <ProductTable data={data} token={value}/>
                </div>
            </div>
        </div>
    )
}

export default Orders