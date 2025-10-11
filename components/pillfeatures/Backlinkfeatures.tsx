import React from 'react'
import Image from 'next/image'
function Backlinkfeatures() {
    return (
        <>
            <div className="flex flex-col gap-2 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="bg-blue-800 rounded-xl p-2">
                        <Image src="/productsvg/link.svg" width={18} height={18} alt="لینک سازی" />
                    </span>
                    لینک سازی ترکیبی
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-blue-800 rounded-xl p-2">
                        <Image src="/productsvg/boo.svg" width={18} height={18} alt="رتبه گوگل" />
                    </span>
                    افزایش رتبه سریع تر در گوگل
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-blue-800 rounded-xl p-2">
                        <Image src="/productsvg/chart.svg" width={18} height={18} alt="رسانه" />
                    </span>
                    انتشار در رسانه های معتبر
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-blue-800 rounded-xl p-2">
                        <Image src="/productsvg/web.svg" width={18} height={18} alt="سایت معتبر" />
                    </span>
                    سایت های معتبر با DA و DR بالا
                </div>
            </div>
        </>
    )
}

export default Backlinkfeatures