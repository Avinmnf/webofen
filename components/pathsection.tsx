export default function Pathsection() {
    const DottedLine = () => (
        <svg width="180" height="20" xmlns="http://www.w3.org/2000/svg" className="shrink-0 hidden lg:block">
            {[...Array(9)].map((_, i) => (
                <circle key={i} cx={10 + i * 20} cy="10" r="4" fill="#6FD6E5" />
            ))}
        </svg>
    );

    const VerticalDottedLine = () => (
        <svg width="20" height="140" xmlns="http://www.w3.org/2000/svg" className="shrink-0 hidden lg:block">
            {[...Array(7)].map((_, i) => (
                <circle key={i} cx="10" cy={10 + i * 20} r="2" fill="#6FD6E5" />
            ))}
        </svg>
    );

    const MobileDottedLine = () => (
        <svg width="20" height="40" xmlns="http://www.w3.org/2000/svg" className="shrink-0 lg:hidden">
            {[...Array(2)].map((_, i) => (
                <circle key={i} cx="10" cy={10 + i * 20} r="2" fill="#6FD6E5" />
            ))}
        </svg>
    );

    const steps = [
        { icon: 'آیکن 1', label: 'شروع درمان سایت' },
        { icon: 'آیکن 2', label: 'نسخه درمان' },
        { icon: 'آیکن 3', label: 'برنامه طول درمان' },
        { icon: 'آیکن 4', label: 'آنالیز داده ها' },
        { icon: 'آیکن 5', label: 'جمع آوری اطلاعات' },
    ];

    return (
        <div className="w-full mt-10 md:mt-20 px-4 sm:px-6">
            <div className="w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-right">
                    <p className="text-[#1d546b] pr-2 md:pr-4">مراحل درمان</p>
                    <div className="flex items-center justify-end mt-2">
                        <h3 className="text-gray-800 pr-2">صفر تا صد مسیر</h3>
                        <h3 className="text-[#6FD6E5]">درمان سایت</h3>
                    </div>
                </div>

                {/* Steps - Desktop */}
                <div className="hidden lg:flex flex-col lg:flex-row items-center justify-center mt-10 gap-4">
                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col lg:flex-row items-center gap-4">
                            <div className="w-32 h-32 shadow bg-[#6FD6E5] p-6 rounded-2xl shrink-0 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">{step.icon}</span>
                            </div>
                            {i < steps.length - 1 && <DottedLine />}
                        </div>
                    ))}
                </div>

                {/* Steps - Mobile */}
                <div className="lg:hidden flex flex-col items-center mt-8">
                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="w-24 h-24 shadow bg-[#6FD6E5] p-4 rounded-2xl shrink-0 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{step.icon}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 mb-4 text-center">{step.label}</p>
                            {i < steps.length - 1 && <MobileDottedLine />}
                        </div>
                    ))}
                </div>

                {/* Vertical Dotted Line (desktop only) */}
                <div className="hidden lg:flex justify-center mt-6 w-full">
                    <div className="w-full flex gap-4 justify-between px-4">
                        {[...Array(5)].map((_, i) => (
                            <VerticalDottedLine key={i} />
                        ))}
                    </div>
                </div>

                {/* Step Labels - Desktop */}
                <div className="hidden lg:block w-full mt-6">
                    <div className="w-full justify-center">
                        <div className="w-full flex flex-row items-center justify-between rounded-2xl bg-[#f7f8fc] p-4">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex items-center w-1/5 justify-around">
                                    <p className="text-sm text-gray-600">{step.label}</p>
                                    {idx < steps.length - 1 && (
                                        <span className="inline-block w-3 h-3 bg-[#6FD6E5] rounded-full mx-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}