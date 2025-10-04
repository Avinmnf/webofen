"use client";

import VideoPlayer from "@/components/video";
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
type Issue = {
    auditId: string;
    title: string;
    impact: string;
    description: string;
};
type AnalyzeResult = {
    url: string;
    title: string;
    scores: {
        performance?: number;
        accessibility?: number;
        bestPractices?: number;
        seo?: number;
    };
    metrics: {
        FCP?: string;
        LCP?: string;
        TBT?: string;
        CLS?: string;
        SI?: string;
    };
    issues: Issue[];
};

export default function AnalyzePage() {
    const [url, setUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [result, setResult] = useState<AnalyzeResult | null>(null);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);
    const analyzeUrl = process.env.NEXT_PUBLIC_ANALYZE_URL;
    const groupedIssues = result
        ? result.issues.reduce<Record<string, Issue[]>>((acc, issue) => {
            const key = issue.impact || "other";
            if (!acc[key]) acc[key] = [];
            acc[key].push(issue);
            return acc;
        }, {})
        : {};

    const tabs = result ? ["all", ...Object.keys(groupedIssues)] : [];
    const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);
        setProgress(0);

        // حداقل 30 ثانیه لودینگ
        const minLoadingTime = new Promise<void>(resolve => {
            let start = Date.now();
            let interval = setInterval(() => {
                const elapsed = Date.now() - start;
                const pct = Math.min(100, Math.floor((elapsed / 30000) * 100));
                setProgress(pct);
                if (pct >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });

        try {
            const fetchData = fetch(`${analyzeUrl}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            }).then(async res => {
                if (!res.ok) throw new Error("Failed to analyze site");
                return res.json();
            });

            // منتظر می‌مونیم هم API جواب بده هم 30 ثانیه تموم بشه
            const [data] = await Promise.all([fetchData, minLoadingTime]);
            setResult(data);
        } catch (err: any) {
            setError(err.message || "خطایی رخ داد");
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    // Animate scores when result changes
    useEffect(() => {
        if (!result) return;
        const intervalIds: NodeJS.Timeout[] = [];

        Object.entries(result.scores).forEach(([key, score]) => {
            if (score === undefined) return;
            let current = 0;
            const target = Math.round(score * 100);

            const id = setInterval(() => {
                current += 1;
                setAnimatedScores(prev => ({ ...prev, [key]: current }));
                if (current >= target) clearInterval(id);
            }, 12); // سرعت انیمیشن score
            intervalIds.push(id);
        });

        return () => intervalIds.forEach(id => clearInterval(id));
    }, [result]);

    const getColor = (score: number) => {
        if (score >= 0.9) return "#0cce6b";
        if (score >= 0.5) return "#ffa400";
        return "#ff4e42";
    };

    return (
        <>
            <div className="w-full stage">
                <div className="w-[1250px] flex mx-auto">
                    <div className="w-2/3 py-6 px-4 ">
                        <h1 className="text-3xl font-bold my-6">آنالیز وبسایت</h1>
                        <p className="leading-2 text-justify">
                            بخش آنالیزور وبسایت ما ابزاری حرفه‌ای برای بررسی کامل وضعیت سئو و عملکرد فنی سایت شماست. کافیست آدرس وبسایت خود را وارد کنید تا تمامی پارامترهای کلیدی از جمله سرعت بارگذاری صفحات، بهینه‌سازی کلمات کلیدی، وضعیت لینک‌سازی داخلی و خارجی، و خطاهای فنی به صورت دقیق بررسی و گزارش شوند. این ابزار به شما کمک می‌کند نقاط ضعف سایتتان را شناسایی کنید و بدانید در چه بخش‌هایی نیاز به بهبود دارید تا بتوانید جایگاه بهتری در موتورهای جستجو به دست آورید.
                        </p>
                        <form onSubmit={handleAnalyze} className="gap-2 mb-8">
                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                className="flex-1 w-[300px] border my-4 mx-2 p-2 rounded shadow"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 w-[180px] hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
                            >
                                {loading ? "در حال بررسی..." : "شروع آنالیز"}
                            </button>
                        </form>
                    </div>
                    <div className=" w-1/3 ">
                        <video className="seo-video rounded-3xl" autoPlay muted loop playsInline>
                            <source src={"/analyze/analyze.mp4"} type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>
            <div className="w-[1250px] mx-auto">
                <div className="flex flex-wrap">

                    <div className="w-9/12 mx-auto  px-4 space-y-8">



                        {error && <p className="text-red-600 font-medium">{error}</p>}

                        {/* Loading progress bar */}
                        {loading && (
                            <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
                                <div className="w-12 h-12 mb-4">
                                    <CircularProgressbar
                                        value={progress}
                                        strokeWidth={5}
                                        styles={buildStyles({
                                            pathColor: "#3b82f6",
                                            textColor: "#3b82f6",
                                            trailColor: "#e5e7eb",
                                            pathTransitionDuration: 0.1,
                                            strokeLinecap: "round",
                                            textSize: "16px",
                                        })}
                                    />
                                </div>
                                <p className="text-gray-600 font-medium mt-2">
                                    در حال آماده‌سازی گزارش...
                                </p>
                                <p>
                                    {30 - Math.floor((progress / 100) * 30)} ثانیه
                                </p>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-8">
                                {/* اطلاعات کلی */}
                                <div className="border rounded p-6 bg-gray-50 shadow">
                                    <h2 className="font-semibold text-xl mb-4">اطلاعات کلی</h2>
                                    <p><strong>آدرس:</strong> {result.url}</p>
                                    <p><strong>عنوان:</strong> {result.title}</p>
                                </div>

                                {/* امتیازها */}
                                <div className="border rounded p-6 bg-gray-50 shadow">
                                    <h2 className="font-semibold text-xl mb-6">امتیازها</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
                                        {Object.entries(result.scores).map(([key, score]) => {
                                            if (score === undefined) return null;
                                            const pct = animatedScores[key] || 0;
                                            const tooltipId = `tooltip-${key}`;

                                            return (
                                                <div key={key} className="flex flex-col p-5 items-center">
                                                    <div data-tooltip-id={tooltipId} data-tooltip-content={`${key}: ${Math.round(score * 100)}%`}>
                                                        <CircularProgressbar
                                                            value={pct}
                                                            text={`${pct}%`}
                                                            strokeWidth={4} // ظریف‌تر
                                                            styles={buildStyles({
                                                                textSize: "16px",
                                                                pathColor: getColor(score),
                                                                textColor: "#333",
                                                                trailColor: "#f3f4f6",
                                                                pathTransitionDuration: 0.3,
                                                                strokeLinecap: "round",
                                                            })}
                                                        />
                                                    </div>
                                                    <span className="mt-2 font-medium text-center">{key}</span>
                                                    <Tooltip id={tooltipId} place="top" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Core Web Vitals */}
                                <div className="border rounded p-6 bg-gray-50 shadow">
                                    <h2 className="font-semibold text-xl mb-4">علائم حیاتی وبسایت</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {Object.entries(result.metrics).map(([key, value]) => (
                                            <div key={key} className="bg-white p-4 rounded shadow flex flex-col items-center">
                                                <p className="font-semibold">{key}</p>
                                                <p className="text-lg">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Issues / Alerts با تب */}
                                <div className="border rounded p-6 bg-gray-50 shadow">
                                    <h2 className="font-semibold text-xl mb-4">لیست خطاهای وبسایت</h2>

                                    {/* Tabs */}
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-4 py-2 rounded ${activeTab === tab
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                            >
                                                {tab === "all" ? "همه" : tab}
                                            </button>
                                        ))}
                                    </div>

                                    {/* محتوای تب */}
                                    <div className="space-y-3">
                                        {(activeTab === "all"
                                            ? result.issues
                                            : groupedIssues[activeTab] || []
                                        ).map((issue, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3 bg-red-50 border-l-4 border-red-500 rounded shadow"
                                            >
                                                <p className="font-medium text-red-700">{issue.title}</p>
                                                <p className="text-sm text-gray-700">{issue.description}</p>
                                                <p className="text-xs text-gray-500">Impact: {issue.impact}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-3/12 h-56 bg-gray-100 rounded-3xl">

                    </div>
                </div>
            </div>
        </>
    );
}
