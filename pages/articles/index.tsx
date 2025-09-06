import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePosts } from "@/hooks/useposts";

type Post = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: { id: string; title: string };
  createdAt: string;
  readtime: number;
  desc: string;
  likes: number;
  tags: { id: string; name: string }[];
};
function isRecommended(post: Post) {
  return post.tags.some((tag) => tag.name === "پیشنهاد ما");
}
export default function PostsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const socialCards = [
    {
      id: "telegram",
      title: "در تلگرام وبوفن را دنبال کنید",
      description: "آخرین مقالات و اخبار را در تلگرام دنبال کنید",
      link: "https://t.me/yourchannel",
      type: "social",
    },
    {
      id: "instagram",
      title: "ما را در اینستاگرام دنبال کنید ",
      description: "آموزش‌ها و نکات روز دیجیتال مارکتینگ در اینستاگرام",
      link: "https://instagram.com/yourpage",
      type: "social",
    },
  ];

  const { posts, total, loading } = usePosts({
    page,
    limit,
    status: "published",
    sort: "createdAt",
    order: "desc",
  });

  const totalPages = Math.ceil(total / limit);

  // Create cards array with fixed positions for social cards
  const cards: ((typeof posts)[number] | (typeof socialCards)[0])[] = [
    ...posts.slice(1),
  ];
  if (cards.length > 1) cards.splice(1, 0, socialCards[0]);
  if (cards.length > 5) cards.splice(5, 0, socialCards[1]);

  return (
    <main className="bg-gradient-to-b from-white to-stone-200 pb-10">
      <div className="w-full pt-20">
        <div className="md:w-[70%] mx-auto">
          <div className="md:flex justify-between">
            {/* ✅ Left (Main Content) */}
            <div className=" md:p-0 p-4 w-full md:w-[70%] rounded-2xl h-full">
              {/* Featured First Post */}
              {posts.length > 0 && (
                <Link href={`/articles/${posts[0].slug}`} passHref>
                  <div className="rounded-2xl bg-white mb-8 shadow hover:shadow-lg transition cursor-pointer">
                    {posts[0].imageUrl && (
                      <Image
                        className="rounded-t-2xl"
                        width={700}
                        height={300}
                        src={`https://cms.webofen.com${posts[0].imageUrl}`}
                        alt={posts[0].imageAlt || posts[0].title}
                      />
                    )}
                    <div className="w-full mt-6 p-6">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 ml-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                            fill="#ff5084"
                          />
                        </svg>
                        {isRecommended(posts[0]) && (
                          <svg
                            className="w-5 h-5 text-yellow-400 ml-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.954a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.953c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.953a1 1 0 00-.364-1.118L2.073 9.38c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.954z" />
                          </svg>
                        )}
                        <p className="text-sm text-gray-500">
                          {posts[0].category?.title}
                        </p>
                      </div>
                      <p className="text-gray-700 mt-1 text-xl font-semibold">
                        {posts[0].title}
                      </p>
                      <p className="text-gray-500 mt-3 text-md">
                        {posts[0].description}
                      </p>

                      <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.926 20.574a7.26 7.26 0 0 0 3.039 1.511c.107.035.179-.105.107-.175-2.395-2.285-1.079-4.758-.107-5.873.693-.796 1.68-2.107 1.608-3.865 0-.176.18-.317.322-.211 1.359.703 2.288 2.25 2.538 3.515.394-.386.537-.984.537-1.511 0-.176.214-.317.393-.176 1.287 1.16 3.503 5.097-.072 8.19-.071.071 0 .212.072.177a8.761 8.761 0 0 0 3.003-1.442c5.827-4.5 2.037-12.48-.43-15.116-.321-.317-.893-.106-.893.351-.036.95-.322 2.004-1.072 2.707-.572-2.39-2.478-5.105-5.195-6.441-.357-.176-.786.105-.75.492.07 3.27-2.063 5.352-3.922 8.059-1.645 2.425-2.717 6.89.822 9.808z"
                            fill="#e16f23"
                          />
                        </svg>
                        <p className="text-gray-400 text-sm">
                          زمان مطالعه:{" "}
                          {new Date(posts[0].createdAt).toLocaleDateString(
                            "fa-IR"
                          )}{" "}
                          دقیقه
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* ✅ Right Sidebar */}
            <div className="md:w-[35%] md:mr-4 md:p-0 p-4">
              <div className="flex flex-col items-center justify-between h-full pb-3">
                <div className="flex bg-[#fbb2bd] py-2 px-5 mb-5 w-full rounded-2xl border-3 border-white">
                  <div className="w-1/2 flex justify-center items-center">
                    <div>
                      <p className="text-lg text-gray-600">آموزش</p>
                      <p className="text-xl text-gray-700 font-semibold">
                        کسب درآمد آنلاین
                      </p>
                    </div>
                  </div>
                  <div className="w-1/2 flex justify-end">
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
                      <p className="text-lg text-gray-600">آموزش</p>
                      <p className="text-xl text-gray-700 font-semibold">
                        کسب درآمد آنلاین
                      </p>
                    </div>
                  </div>
                  <div className="w-1/2 flex justify-end">
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
                      <p className="text-lg text-gray-600">آموزش</p>
                      <p className="text-xl text-gray-700 font-semibold">
                        کسب درآمد آنلاین
                      </p>
                    </div>
                  </div>
                  <div className="w-1/2 flex justify-end">
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

          {/* Smaller Posts List with Grid Layout */}
          {/* Smaller Posts List with Masonry Layout */}
          <div className="md:columns-3 md:p-0 p-4 gap-8 md:mt-2">
            {cards.map((card) => (
              <div
                key={"id" in card ? card.id : (card as Post).id}
                className="mb-8 break-inside-avoid"
              >
                {"type" in card && card.type === "social" ? (
                  <div className="rounded-2xl bg-white text-white shadow hover:shadow-sm transition cursor-pointer block">
                    <div className="rounded-2xl bg-white shadow hover:shadow-sm transition cursor-pointer block w-full">
                      {/* SVG Icon */}
                      {card.id === "telegram" && (
                        <div className="rounded-2xl bg-white text-white  transition cursor-pointer block">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="bg-[#5ebae8] shadow-[-12px_0_rgba(94,186,232,.2),-22px_0_rgba(94,186,232,.1)] transform -skew-l-2 p-8 ml-10 rounded-2xl">
                                <svg
                                  className=""
                                  fill="#ffffff"
                                  height="30px"
                                  width="30px"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <g>
                                      <g>
                                        <path d="M385.268,121.919l-210.569,129.69c-11.916,7.356-17.555,21.885-13.716,35.323l22.768,80 c1.945,6.821,8.015,11.355,14.999,11.355c0.389,0,0.782-0.014,1.176-0.043c7.466-0.542,13.374-6.103,14.367-13.515l5.92-43.866 c0.798-5.902,3.642-11.392,8.001-15.45l173.765-161.524c5.251-4.869,5.945-12.842,1.618-18.545 C399.263,119.636,391.388,118.16,385.268,121.919z M214.32,290.478c-7.808,7.268-12.895,17.089-14.323,27.655l-2.871,21.278 l-16.527-58.072c-1.343-4.704,0.635-9.791,4.805-12.365l154.258-95.007L214.32,290.478z"></path>
                                        <path d="M503.67,37.382c-6.579-5.576-15.657-7.111-23.698-4.005L15.08,212.719C5.873,216.27-0.047,224.939,0,234.804 c0.048,9.874,6.055,18.495,15.316,21.965l108.59,40.529l42.359,136.225c2.326,7.489,8.197,13.308,15.703,15.566 c7.502,2.256,15.604,0.643,21.66-4.310l63.14-51.473c3.032-2.472,7.362-2.594,10.528-0.295l113.883,82.681 c4.097,2.978,8.932,4.511,13.823,4.511c2.865,0,5.749-0.526,8.517-1.596c7.486-2.895,12.93-9.312,14.56-17.163l83.429-401.309 C513.26,51.685,510.257,42.967,503.67,37.382z M491.536,55.99l-83.428,401.308c-0.302,1.45-1.346,2.053-1.942,2.284 c-0.6,0.232-1.785,0.489-2.997-0.393l-113.887-82.685c-5.091-3.696-11.077-5.531-17.052-5.531 c-6.518,0,13.027,2.185,18.347,6.519l-63.154,51.485c-1.124,0.92-2.291,0.756-2.885,0.577c-0.598-0.18-1.665-0.69-2.099-2.086 l-43.845-141.006c-0.937-3.013-3.217-5.423-6.173-6.527L22.462,237.662c-1.696-0.635-2.057-1.958-2.062-2.957 c-0.005-0.990,0.343-2.307,2.023-2.955L487.316,52.409c0.002-0.001,0.005-0.002,0.008-0.003c1.51-0.583,2.627,0.087,3.159,0.537 C491.017,53.398,491.867,54.398,491.536,55.99z"></path>
                                      </g>
                                    </g>
                                  </g>
                                  <g>
                                    <g>
                                      <path d="M427.481,252.142c-5.506-1.196-10.936,2.299-12.131,7.804l-1.55,7.140c-1.195,5.505,2.299,10.936,7.804,12.131 c0.729,0.158,1.456,0.234,2.174,0.234c4.695,0,8.920-3.262,9.958-8.037l1.550-7.140C436.480,258.769,432.985,253.338,427.481,252.142z "></path>
                                    </g>
                                  </g>
                                  <g>
                                    <g>
                                      <path d="M417.281,299.122c-5.512-1.195-10.938,2.299-12.132,7.804l-23.459,108.051c-1.195,5.505,2.299,10.936,7.803,12.131 c0.730,0.158,1.457,0.234,2.174,0.234c4.696,0,8.920-3.262,9.958-8.037l23.459-108.052 C426.279,305.748,422.785,300.317,417.281,299.122z"></path>
                                    </g>
                                  </g>
                                </svg>
                              </div>
                              <div className="w-full">
                                <p className="text-gray-500">
                                  <span className="block">
                                    در{" "}
                                    <span className="text-[#5ebae8] text-lg">
                                      تلگرام
                                    </span>
                                  </span>
                                  <span>وبوفن عضو شوید!</span>
                                </p>
                              </div>
                            </div>

                            <div>
                              <Link
                                href="https://t.me/yourchannel"
                                className="bg-gray-400"
                              >
                                <svg
                                  className="w-8 h-8 bg-blue-50 rounded-full ml-8"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                    fill="#5ebae8"
                                  />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                      {card.id === "instagram" && (
                        <div className="rounded-2xl bg-white text-white  transition cursor-pointer block">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="[background:linear-gradient(295deg,#f76290,#fe7464)] [box-shadow:-12px_0_hsla(4,99%,70%,.2),-22px_0_hsla(4,99%,70%,.1)] transform -skew-l-2 p-8 ml-10 rounded-2xl">
                                <svg
                                  fill="#ffffff"
                                  height="30px"
                                  width="30px"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g>
                                    <path d="M256.551,100.198c-85.606,0-155.252,69.645-155.252,155.252c0,27.293,7.183,54.138,20.775,77.632 c2.284,3.947,7.336,5.295,11.284,3.014c3.947-2.284,5.297-7.335,3.014-11.284c-12.139-20.984-18.556-44.969-18.556-69.362 c0-76.499,62.236-138.735,138.735-138.735s138.735,62.236,138.735,138.735S333.050,394.185,256.551,394.185 c-38.491,0-74.271-15.397-100.748-43.355c-3.136-3.311-8.363-3.454-11.675-0.317c-3.311,3.136-3.454,8.363-0.317,11.675 c29.629,31.284,69.667,48.513,112.740,48.513c85.606,0,155.252-69.645,155.252-155.252S342.157,100.198,256.551,100.198z"></path>
                                  </g>
                                  <g>
                                    <path d="M256.551,155.252c-55.25,0-100.198,44.948-100.198,100.198s44.948,100.198,100.198,100.198 s100.198-44.948,100.198-100.198S311.800,155.252,256.551,155.252z M256.551,339.131c-46.143,0-83.682-37.539-83.682-83.682 s37.539-83.682,83.682-83.682s83.682,37.539,83.682,83.682S302.693,339.131,256.551,339.131z"></path>
                                  </g>
                                  <g>
                                    <path d="M397.488,78.176c-20.035,0-36.335,16.300-36.335,36.336s16.300,36.335,36.335,36.335c20.035,0,36.336-16.300,36.336-36.335 S417.523,78.176,397.488,78.176z M397.488,134.331c-10.928,0-19.819-8.891-19.819-19.819s8.891-19.819,19.819-19.819 s19.819,8.891,19.819,19.819S408.416,134.331,397.488,134.331z"></path>
                                  </g>
                                  <g>
                                    <path d="M398.039,0H113.961C51.023,0,0,51.023,0,113.961v284.077C0,460.977,51.023,512,113.961,512h284.077 C460.977,512,512,460.977,512,398.039V113.961C512,51.023,460.977,0,398.039,0z M495.484,398.039 c0,53.817-43.628,97.445-97.445,97.445H113.961c-53.817,0-97.445-43.628-97.445-97.445V113.961 c0-53.817,43.628-97.445,97.445-97.445h284.077c53.817,0,97.445,43.628,97.445,97.445V398.039z"></path>
                                  </g>
                                  <g>
                                    <path d="M394.735,38.538H117.265c-43.479,0-78.727,35.248-78.727,78.727v277.471c0,43.479,35.248,78.727,78.727,78.727h277.471 c43.479,0,78.727-35.248,78.727-78.727V117.265C473.462,73.785,438.215,38.538,394.735,38.538z M456.946,394.735 c0,34.358-27.853,62.211-62.211,62.211H117.265c-34.358,0-62.211-27.853-62.211-62.211V117.265 c0-34.358,27.853-62.211,62.211-62.211h277.471c34.358,0,62.211,27.853,62.211,62.211V394.735z"></path>
                                  </g>
                                </svg>
                              </div>
                              <div className="w-full">
                                <p className="text-gray-500">
                                  <span className="block">
                                    در{" "}
                                    <span className="text-[#fb6c78] text-lg">
                                      اینستاگرام
                                    </span>
                                  </span>
                                  <span>وبوفن را دنبال کنید!</span>
                                </p>
                              </div>
                            </div>

                            <div>
                              <Link
                                href="https://t.me/yourchannel"
                                className="bg-gray-400"
                              >
                                <svg
                                  className="w-8 h-8 bg-red-50 rounded-full ml-8"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                                    fill="#fb6c78"
                                  />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Texts */}
                    </div>
                  </div>
                ) : (
                  <Link href={`/articles/${(card as Post).slug}`} passHref>
                    <div className="rounded-2xl bg-white shadow hover:shadow-sm transition cursor-pointer">
                      {(card as Post).imageUrl && (
                        <Image
                          width={500}
                          height={200}

                          src={`https://cms.webofen.com${(card as Post).imageUrl!}`}
                          alt={(card as Post).imageAlt || (card as Post).title}
                          className="rounded-t-2xl w-full h-42 object-cover"
                        />
                      )}
                      <div className="flex flex-col justify-between p-8">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 ml-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                              fill="#ff5084"
                            />
                          </svg>
                          <div className="relative group inline-block">
                            {isRecommended(card as Post) && (
                              <>
                                <svg
                                  className="w-5 h-5 ml-2 text-yellow-400 cursor-pointer"
                                  fill="#f06330"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.954a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.953c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.953a1 1 0 00-.364-1.118L2.073 9.38c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.954z" />
                                </svg>

                                {/* Tooltip */}
                                <div
                                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                      hidden group-hover:block px-2 py-1 rounded-md 
                      bg-gray-800 text-white text-xs shadow-md whitespace-nowrap"
                                >
                                  پیشنهاد ما
                                </div>
                              </>
                            )}
                          </div>

                          <p className="text-sm text-gray-500">
                            {posts[0].category?.title}
                          </p>
                        </div>
                        <p className="text-base font-semibold text-gray-700  hover:text-[#1d546b]">
                          {(card as Post).title}
                        </p>

                        <p className="text-sm text-gray-700  hover:text-[#1d546b]">
                          {(card as Post).description}
                        </p>
                        <p className="text-md text-gray-400 mt-2 line-clamp-2">
                          {(card as Post).desc}
                        </p>
                        <p className="text-md text-gray-400 mt-2 line-clamp-2">
                          {(card as Post).desc}
                        </p>
                        <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.926 20.574a7.26 7.26 0 0 0 3.039 1.511c.107.035.179-.105.107-.175-2.395-2.285-1.079-4.758-.107-5.873.693-.796 1.68-2.107 1.608-3.865 0-.176.18-.317.322-.211 1.359.703 2.288 2.25 2.538 3.515.394-.386.537-.984.537-1.511 0-.176.214-.317.393-.176 1.287 1.16 3.503 5.097-.072 8.19-.071.071 0 .212.072.177a8.761 8.761 0 0 0 3.003-1.442c5.827-4.5 2.037-12.48-.43-15.116-.321-.317-.893-.106-.893.351-.036.95-.322 2.004-1.072 2.707-.572-2.39-2.478-5.105-5.195-6.441-.357-.176-.786.105-.75.492.07 3.27-2.063 5.352-3.922 8.059-1.645 2.425-2.717 6.89.822 9.808z"
                              fill="#e16f23"
                            />
                          </svg>
                          <p className="text-gray-400 text-sm">
                            زمان مطالعه: {(card as Post).readtime} دقیقه
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* ✅ Pagination */}
          <div className="mt-12 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`
        px-3 py-1 rounded
        ${
          page === num
            ? "bg-[#ff5084] text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }
      `}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
