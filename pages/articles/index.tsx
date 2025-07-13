import React, { useState, useEffect } from 'react';
import { usePosts } from '@/hooks/useposts';
import { usePostBySlug } from '@/hooks/usePostBySlug';


type Menu = {
    id: string;
    title: string;
};
type Slider = {
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    priority: number;
};
type Props = {
  slug: string;
};
export default function PostsPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [menus, setMenus] = useState<Menu[]>([]); // ✅ Menu state
    const [sliders, setSliders] = useState<Slider[]>([]);

    const [status, setStatus] = useState('published');
    const [category, setCategory] = useState('');
    const [tag, setTag] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    const { posts, total, loading } = usePosts({
        page,
        limit,
        status,
        category,
        tag,
        sort,
        order,
    });

    const totalPages = Math.ceil(total / limit);

    // ✅ Fetch menus once
    useEffect(() => {
        async function fetchMenus() {
            try {
                const res = await fetch('http://localhost:3003/menus');
                const data = await res.json();
                console.log('Menus response:', data);

                if (Array.isArray(data.menus)) {
                    setMenus(data.menus);
                } else {
                    console.warn('Menus is not an array:', data);
                }
            } catch (err) {
                console.error('Failed to fetch menus:', err);
            }
        }

        fetchMenus();
    }, []);


    useEffect(() => {
        async function fetchSliders() {
            try {
                const res = await fetch('http://localhost:3003/sliders');
                const data = await res.json();

                if (Array.isArray(data.sliders)) {
                    setSliders(data.sliders);
                } else {
                    console.warn('Sliders is not an array:', data);
                }
            } catch (err) {
                console.error('Failed to fetch sliders:', err);
            }
        }

        fetchSliders();
    }, []);


    return (
        <div className="max-w-5xl mx-auto px-4 py-8 text-gray-900">
            <h1 className="text-3xl font-bold mb-6">مقالات</h1>
            {/* ✅ Show Sliders */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">اسلایدر:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sliders.map(slide => (
                        <div key={slide.id} className="border rounded shadow p-3 bg-white">
                            <img
                                src={slide.imageUrl}
                                alt={slide.title}
                                className="w-full h-40 object-cover rounded mb-2"
                            />
                            <h3 className="text-sm font-semibold">{slide.title}</h3>
                            {slide.link && (
                                <a href={slide.link} className="text-blue-600 text-xs" target="_blank" rel="noopener noreferrer">
                                    {slide.link}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ✅ Show Menus */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold">منوها:</h2>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                    <ul>
                        {menus.map((menu) => (
                            <li key={menu.id}>{menu.title}</li>
                        ))}
                    </ul>
                </ul>
            </div>

            {/* Filters */}
            <div className="mb-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">وضعیت</label>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="">Any</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">شناسه دسته‌بندی</label>
                    <input
                        type="text"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        placeholder="Category ID"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">برچسب</label>
                    <input
                        type="text"
                        value={tag}
                        onChange={e => setTag(e.target.value)}
                        placeholder="Tag name"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">مرتب‌سازی بر اساس</label>
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="createdAt">Created At</option>
                        <option value="title">Title</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">ترتیب</label>
                    <select
                        value={order}
                        onChange={e => setOrder(e.target.value as 'asc' | 'desc')}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
                {posts.map(post => (
                    <div
                        key={post.id}
                        className="flex gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
                    >
                        {post.imageUrl && (
                            <img
                                src={post.imageUrl}
                                alt={post.imageAlt || post.title}
                                className="w-28 h-20 object-cover rounded-md"
                            />
                        )}
                        <div className="flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">{post.title}</h3>
                                <p className="text-sm text-gray-700">{post.description}</p>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                تاریخ: {new Date(post.createdAt).toLocaleDateString()} | برچسب‌ها: {post.tags.map(t => t.name).join(', ')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center gap-4">
                <button
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                    قبلی
                </button>
                <span className="text-sm">
                    صفحه {page} از {totalPages}
                </span>
                <button
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                    بعدی
                </button>
            </div>
        </div>
    );
}
