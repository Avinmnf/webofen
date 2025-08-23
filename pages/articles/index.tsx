import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Post = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  createdAt: string;
  readtime: number;
  desc: string;
  likes: number;
  tags: { id: string; name: string }[];
};

export default function PostsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const socialCards = [
    {
      id: "telegram",
      title: "به کانال تلگرام ما بپیوندید 🚀",
      description: "آخرین مقالات و اخبار را در تلگرام دنبال کنید",
      link: "https://t.me/yourchannel",
      imageUrl: "/blog/telegram-card.jpg",
      imageAlt: "تلگرام",
      type: "social",
    },
    {
      id: "instagram",
      title: "ما را در اینستاگرام دنبال کنید 📸",
      description: "آموزش‌ها و نکات روز دیجیتال مارکتینگ در اینستاگرام",
      link: "https://instagram.com/yourpage",
      imageUrl: "/blog/instagram-card.jpg",
      imageAlt: "اینستاگرام",
      type: "social",
    },
  ];
  const posts: Post[] = [
    {
      id: "1",
      title: "پست اول",
      slug: "post-1",
      description: "این توضیحات پست اول است",
      imageUrl: "/blog/سئو-اینستاگرام-2.webp",
      desc: "با این مقاله، به همه روش‌های کسب درآمد از اینستاگرام مسلط شوید! از فروش محصولات تا بلاگری و افیلیت مارکتینگ، همه چیز را قدم به قدم یاد بگیرید.",
      imageAlt: "پست اول",
      readtime: 20,
      likes: 5,
      createdAt: "2025-08-21T09:00:00Z",
      tags: [
        { id: "t1", name: "React" },
        { id: "t2", name: "Next.js" },
      ],
    },
    {
      id: "2",
      title: " بازاریابی شبکه های اجتماعی",
      slug: "post-2",
      description: "آموزش روش‌های کسب درآمد از اینستاگرام: از ایده تا موفقیت!",
      desc: "با این مقاله، به همه روش‌های کسب درآمد از اینستاگرام مسلط شوید! از فروش محصولات تا بلاگری و افیلیت مارکتینگ، همه چیز را قدم به قدم یاد بگیرید.",
      imageUrl: "/blog/make_money_from_instagram_cover.webp",
      imageAlt: "پست دوم",
      readtime: 20,
      likes: 5,

      createdAt: "2025-08-20T12:00:00Z",
      tags: [{ id: "t3", name: "JavaScript" }],
    },
    {
      id: "3",
      title: "بازاریابی اینترنتی",
      slug: "post-3",
      description: "آموزش گام به گام ساخت سایت رایگان با گوگل سایت",
      desc: "گوگل سایت بهترین گزینه برای ساخت سایت رایگان و بدون کدنویسی است! با این آموزش می‌توانید در 15 دقیقه سایت خودتان را داشته باشید...!",

      imageUrl: "/blog/working_with_googleSite.webp",
      imageAlt: "پست سوم",
      readtime: 20,
      likes: 5,

      createdAt: "2025-08-19T15:30:00Z",
      tags: [{ id: "t4", name: "CSS" }],
    },
    {
      id: "4",
      title: "تبلیغات اینترنتی",
      slug: "post-3",
      description:
        "پرفورمنس مارکتینگ: میانبری به سوی تبلیغات هدفمند و پربازده!",
      desc: "با پرفورمنس مارکتینگ، هزینه تبلیغات به نتایج قابل اندازه‌گیری و موفقیت‌های واقعی تبدیل می‌شود. اگر نمی‌دانید پرفورمنس مارکتینگ چیست! این مقاله را بخوانید...!",

      imageUrl: "/blog/performance_marketing_cover2.webp",
      imageAlt: "پست سوم",
      readtime: 20,
      likes: 5,

      createdAt: "2025-08-19T15:30:00Z",
      tags: [{ id: "t4", name: "CSS" }],
    },
        {
      id: "5",
      title: "تبلیغات اینترنتی",
      slug: "post-3",
      description:
        "پرفورمنس مارکتینگ: میانبری به سوی تبلیغات هدفمند و پربازده!",
      desc: "با پرفورمنس مارکتینگ، هزینه تبلیغات به نتایج قابل اندازه‌گیری و موفقیت‌های واقعی تبدیل می‌شود. اگر نمی‌دانید پرفورمنس مارکتینگ چیست! این مقاله را بخوانید...!",

      imageUrl: "/blog/performance_marketing_cover2.webp",
      imageAlt: "پست سوم",
      readtime: 20,
      likes: 5,

      createdAt: "2025-08-19T15:30:00Z",
      tags: [{ id: "t4", name: "CSS" }],
    },
        {
      id: "6",
      title: "تبلیغات اینترنتی",
      slug: "post-3",
      description:
        "پرفورمنس مارکتینگ: میانبری به سوی تبلیغات هدفمند و پربازده!",
      desc: "با پرفورمنس مارکتینگ، هزینه تبلیغات به نتایج قابل اندازه‌گیری و موفقیت‌های واقعی تبدیل می‌شود. اگر نمی‌دانید پرفورمنس مارکتینگ چیست! این مقاله را بخوانید...!",

      imageUrl: "/blog/performance_marketing_cover2.webp",
      imageAlt: "پست سوم",
      readtime: 20,
      likes: 5,

      createdAt: "2025-08-19T15:30:00Z",
      tags: [{ id: "t4", name: "CSS" }],
    },
            {
      id: "7",
      title: "تبلیغات اینترنتی",
      slug: "post-3",
      description:
        "پرفورمنس مارکتینگ: میانبری به سوی تبلیغات هدفمند و پربازده!",
      desc: "با پرفورمنس مارکتینگ، هزینه تبلیغات به نتایج قابل اندازه‌گیری و موفقیت‌های واقعی تبدیل می‌شود. اگر نمی‌دانید پرفورمنس مارکتینگ چیست! این مقاله را بخوانید...!",

      imageUrl: "/blog/performance_marketing_cover2.webp",
      imageAlt: "پست سوم",
      readtime: 20,
      likes: 5,

      createdAt: "2025-08-19T15:30:00Z",
      tags: [{ id: "t4", name: "CSS" }],
    },
  ];

  const total = posts.length;
  const totalPages = Math.ceil(total / limit);

  // Combine posts (excluding first) and social cards
  const cards: (Post | typeof socialCards[0])[] = [...posts.slice(1)];
  socialCards.forEach((social) => {
    const randomIndex = Math.floor(Math.random() * (cards.length + 1));
    cards.splice(randomIndex, 0, social);
  });


  return (
    <main className="bg-gray-100">
      <div className="w-full pt-20">
        <div className="w-9/12 mx-auto">
          <div className="flex justify-between">
            {/* ✅ Left (Main Content) */}
            <div className="px-4 w-[70%] rounded-2xl h-fit">
              {/* Featured First Post */}
              {posts.length > 0 && (
                <Link href={`/articles/${posts[0].slug}`} passHref>
                  <div className="rounded-2xl bg-white mb-8 shadow hover:shadow-lg transition cursor-pointer">
                    {posts[0].imageUrl && (
                      <Image
                        className="rounded-t-2xl"
                        width={1000}
                        height={600}
                        src={posts[0].imageUrl}
                        alt={posts[0].imageAlt || posts[0].title}
                      />
                    )}
                    <div className="w-full mt-6 p-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {posts[0].title}
                      </h2>
                      <p className="text-gray-500 mt-3 text-md">
                        {posts[0].description}
                      </p>
                      <p className="text-gray-500 mt-3 text-md">
                        {posts[0].desc}
                      </p>
                      <div className="text-xs text-gray-400 mt-2">
                        تاریخ:{" "}
                        {new Date(posts[0].createdAt).toLocaleDateString(
                          "fa-IR"
                        )}{" "}
                        | برچسب‌ها:{" "}
                        {posts[0].tags.map((t) => t.name).join(", ")}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* ✅ Right Sidebar */}
            <div className="w-[30%] mr-2">
              <div className="flex flex-col items-center justify-between">
                <div className="flex bg-[#fbb2bd] py-2 px-5 mb-5 w-full rounded-2xl border-3 border-white">
                  <div className="w-1/2 flex justify-center items-center">
                    <div>
                      <p className="text-lg text-black">آموزش</p>
                      <p className="text-xl text-black">کسب درآمد آنلاین</p>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <Image
                      width={150}
                      height={100}
                      src="/blog/blog-digital-marketing-icon.jpg"
                      alt="social"
                    />
                  </div>
                </div>

                <div className="flex bg-[#a0e1fd] py-2 px-5 mb-5 w-full rounded-2xl border-3 border-white">
                  <div className="w-1/2 flex justify-center items-center">
                    <div>
                      <p className="text-lg text-black">آموزش</p>
                      <p className="text-xl text-black">کسب درآمد آنلاین</p>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <Image
                      width={150}
                      height={100}
                      src="/blog/blog-seo-icon.jpg"
                      alt="social"
                    />
                  </div>
                </div>

                <div className="flex bg-[#ffdab0] py-2 px-5 mb-5 w-full rounded-2xl border-3 border-white">
                  <div className="w-1/2 flex justify-center items-center">
                    <div>
                      <p className="text-lg text-black">آموزش</p>
                      <p className="text-xl text-black">کسب درآمد آنلاین</p>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <Image
                      width={150}
                      height={100}
                      src="/blog/blog-content-icon.jpg"
                      alt="social"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
         {/* Smaller Posts List */}
          <div className="w-full relative h-92">
            {(() => {
              const cardsPerRow = 3;
              const cardWidth = 30; // %
              const colHeights: number[] = Array(cardsPerRow).fill(0); // track cumulative height per column

              return cards.map((card, idx) => {
                const col = idx % cardsPerRow;
                const left = col * (cardWidth );

                // Set height depending on card type
                const height = "type" in card && card.type === "social" ? 220 : 400; // adjust social card height

                const top = colHeights[col]; // current top is cumulative height
                colHeights[col] += height + 20; // add spacing below this card

                if ("type" in card && card.type === "social") {
                  return (
                    <a
                      key={card.id}
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute"
                      style={{ width: `${cardWidth}%`, left: `${left}%`, top: `${top}px` }}
                    >
                      <div className="rounded-2xl bg-blue-100 shadow hover:shadow-sm transition cursor-pointer">
                        <img
                          src={card.imageUrl}
                          alt={card.imageAlt}
                          className="rounded-t-2xl"
                        />
                        <div className="flex flex-col justify-between p-4">
                          <h3 className="text-lg font-semibold">{card.title}</h3>
                          <p className="text-gray-500 mt-2">{card.description}</p>
                        </div>
                      </div>
                    </a>
                  );
                } else {
                  const post = card as Post;
                  return (
                    <Link key={post.id} href={`/articles/${post.slug}`} passHref>
                      <div
                        className="rounded-2xl bg-white shadow hover:shadow-sm transition cursor-pointer absolute"
                        style={{ width: `${cardWidth}%`, left: `${left}%`, top: `${top}px` }}
                      >
                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt={post.imageAlt || post.title}
                            className="rounded-t-2xl"
                          />
                        )}
                        <div className="flex flex-col justify-between p-4">
                          <div className="flex items-center mb-2">
                            <svg
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.39 20.87a.696.696 0 0 1-.78 0C9.764 19.637 2 14.15 2 8.973c0-6.68 7.85-7.75 10-3.25 2.15-4.5 10-3.43 10 3.25 0 5.178-7.764 10.664-9.61 11.895z"
                                fill="#ff5084"
                              />
                            </svg>
                            <p className="text-md text-gray-400">{post.title}</p>
                          </div>
                          <p className="text-lg text-gray-700 font-semibold">
                            {post.description}
                          </p>
                          <p className="text-md text-gray-400 mt-2">{post.desc}</p>
                          <div className="text-xs text-gray-500 mt-1 flex justify-between items-baseline">
                            <div className="flex mt-2">
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5.926 20.574a7.26 7.26 0 0 0 3.039 1.511c.107.035.179-.105.107-.175-2.395-2.285-1.079-4.758-.107-5.873.693-.796 1.68-2.107 1.608-3.865 0-.176.18-.317.322-.211 1.359.703 2.288 2.25 2.538 3.515.394-.386.537-.984.537-1.511 0-.176.214-.317.393-.176 1.287 1.16 3.503 5.097-.072 8.19-.071.071 0 .212.072.177a8.761 8.761 0 0 0 3.003-1.442c5.827-4.5 2.037-12.48-.43-15.116-.321-.317-.893-.106-.893.351-.036.95-.322 2.004-1.072 2.707-.572-2.39-2.478-5.105-5.195-6.441-.357-.176-.786.105-.75.492.07 3.27-2.063 5.352-3.922 8.059-1.645 2.425-2.717 6.89.822 9.808z"
                                  fill="#db3006"
                                />
                              </svg>
                              <p className="text-base text-gray-400 mr-1">
                                {post.likes.toLocaleString("fa-IR")}
                              </p>
                            </div>
                            <div>
                              <p className="text-md text-gray-400">
                                زمان مطالعه: {post.readtime.toLocaleString("fa-IR")} دقیقه
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }
              });
            })()}
          </div>

          {/* ✅ Pagination */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              قبلی
            </button>
            <span className="text-sm">
              صفحه {page} از {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
