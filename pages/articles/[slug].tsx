import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePostBySlug } from "@/hooks/usePostBySlug";
import CommentForm from "@/components/comments/comments";
import CommentsList from "@/components/comments/CommentsList";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePageView } from "@/hooks/usePageView";
import { useGuestToken } from "@/contexts/GuestTokenContext";
export default function PostPage() {
  const imgcdn = process.env.NEXT_PUBLIC_CDN_URL || "http://cdn-api.webofen.com";
  const { user } = useAuth();

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const router = useRouter();
  const { slug } = router.query;

  const { post, loading, error } = usePostBySlug(
    typeof slug === "string" ? slug : ""
  );

  const [mounted, setMounted] = useState(false);

  const { token, loading: tokenLoading } = useGuestToken();

  useEffect(() => {
    if (post) {
      setLikes(post.ratings?.filter((r) => r.value === 5).length || 0);
      setDislikes(post.ratings?.filter((r) => r.value === 1).length || 0);
    }
  }, [post]);

  usePageView({ slug: post?.slug || "", title: post?.title || "" });
  const handleLike = async () => {
    if (tokenLoading || !token) return; // wait for token
    const res = await fetch("/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          mutation LikePost($slug: String!) {
            likePost(slug: $slug) {
              likes
              dislikes
            }
          }
        `,
        variables: { slug: post?.slug ?? "" },
      }),
    });

    const data = await res.json();
    if (data.data?.likePost) {
      setLikes(data.data.likePost.likes);
      setDislikes(data.data.likePost.dislikes);
    }
  };

  const handleDislike = async () => {
    if (tokenLoading || !token) return;
    const res = await fetch("/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          mutation DislikePost($slug: String!) {
            dislikePost(slug: $slug) {
              likes
              dislikes
            }
          }
        `,
        variables: { slug: post?.slug ?? "" },
      }),
    });

    const data = await res.json();
    if (data.data?.dislikePost) {
      setLikes(data.data.dislikePost.likes);
      setDislikes(data.data.dislikePost.dislikes);
    }
  };


  useEffect(() => {
    if (!loading && post) setMounted(true);
  }, [loading, post]);

  if (!slug || typeof slug !== "string" || loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 text-xl animate-pulse">Loading post...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl font-semibold">Error: {error}</p>
      </div>
    );

  if (!post)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-xl">Post not found.</p>
      </div>
    );

  const publishedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="relative w-full">
      {/*Background Section */}
      <div className="relative pt-20 bg-[#fafafa]  rounded-4xl">
        <div className="w-7/12 m-auto">
          {/* Hero Section */}
          {post.imageUrl && (
            <div className="relative w-full h-[500px]">
              <Image
                src={`${imgcdn}${post.imageUrl}`}
                alt={post.imageAlt || post.title}
                fill
                className="bg-gray-200 rounded-2xl"
              />
            </div>
          )}
        </div>

        {/* Post Content + Sidebar */}
        <div className="w-3/5 justify-between mx-auto flex gap-8 px-4 mt-8">
          {/* Post Content */}
          <article className="w-full">
            <div className="w-full text-gray-700 m-auto px-10">
              <div className="flex items-center mt-8">
                <svg
                  viewBox="0 -0.5 21 21"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#fba037"
                  className="w-5 h-5 ml-3"
                >
                  <g
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      transform="translate(-99.000000, -320.000000)"
                      fill="#fba037"
                    >
                      <g transform="translate(56.000000, 160.000000)">
                        <path d="M60.556381,172.206 C60.1080307,172.639 59.9043306,173.263 60.0093306,173.875 L60.6865811,177.791 C60.8976313,179.01 59.9211306,180 58.8133798,180 C58.5214796,180 58.2201294,179.931 57.9282291,179.779 L54.3844766,177.93 C54.1072764,177.786 53.8038262,177.714 53.499326,177.714 C53.1958758,177.714 52.8924256,177.786 52.6152254,177.93 L49.0714729,179.779 C48.7795727,179.931 48.4782224,180 48.1863222,180 C47.0785715,180 46.1020708,179.01 46.3131209,177.791 L46.9903714,173.875 C47.0953715,173.263 46.8916713,172.639 46.443321,172.206 L43.575769,169.433 C42.4480682,168.342 43.0707186,166.441 44.6289197,166.216 L48.5916225,165.645 C49.211123,165.556 49.7466233,165.17 50.0227735,164.613 L51.7951748,161.051 C52.143775,160.35 52.8220755,160 53.499326,160 C54.1776265,160 54.855927,160.35 55.2045272,161.051 L56.9769285,164.613 C57.2530787,165.17 57.7885791,165.556 58.4080795,165.645 L62.3707823,166.216 C63.9289834,166.441 64.5516338,168.342 63.423933,169.433 L60.556381,172.206 Z" />
                      </g>
                    </g>
                  </g>
                </svg>
                <p className="text-blue-500">{post.category?.title}</p>
              </div>
              <div className="">
                <h1 className="text-gray-800 font-semibold mt-2">
                  {post.title}
                </h1>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 opacity-45"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.926 20.574a7.26 7.26 0 0 0 3.039 1.511c.107.035.179-.105.107-.175-2.395-2.285-1.079-4.758-.107-5.873.693-.796 1.68-2.107 1.608-3.865 0-.176.18-.317.322-.211 1.359.703 2.288 2.25 2.538 3.515.394-.386.537-.984.537-1.511 0-.176.214-.317.393-.176 1.287 1.16 3.503 5.097-.072 8.19-.071.071 0 .212.072.177a8.761 8.761 0 0 0 3.003-1.442c5.827-4.5 2.037-12.48-.43-15.116-.321-.317-.893-.106-.893.351-.036.95-.322 2.004-1.072 2.707-.572-2.39-2.478-5.105-5.195-6.441-.357-.176-.786.105-.75.492.07 3.27-2.063 5.352-3.922 8.059-1.645 2.425-2.717 6.89.822 9.808z"
                      fill="#db3006"
                    />
                  </svg>
                  <span className="mr-2">{(5).toLocaleString("fa-IR")}</span>
                </div>
                <div>
                  <span>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "تاریخ نامشخص"}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="flex w-3/5 m-auto justify-between">
          <div className="text-gray-700 mt-6 w-4/5 mr-14">
            <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          </div>
          {/* Sidebar */}
          <aside className="w-1/4">
            <div className="sticky top-24 space-y-6 flex justify-center">
              <div className=" p-6">
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 text-gray-400"
                  >
                    <svg
                      className="w-6 h-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.47998 18.35L10.58 20.75C10.98 21.15 11.88 21.35 12.48 21.35H16.28C17.48 21.35 18.78 20.45 19.08 19.25L21.48 11.95C21.98 10.55 21.08 9.34997 19.58 9.34997H15.58C14.98 9.34997 14.48 8.84997 14.58 8.14997L15.08 4.94997C15.28 4.04997 14.68 3.04997 13.78 2.74997C12.98 2.44997 11.98 2.84997 11.58 3.44997L7.47998 9.54997"
                        stroke="#acb8c3"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M2.38 18.35V8.55002C2.38 7.15002 2.98 6.65002 4.38 6.65002H5.38C6.78 6.65002 7.38 7.15002 7.38 8.55002V18.35C7.38 19.75 6.78 20.25 5.38 20.25H4.38C2.98 20.25 2.38 19.75 2.38 18.35Z"
                        stroke="#acb8c3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{likes}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    className="flex items-center gap-2 text-gray-400"
                  >
                    <svg
                      className="w-6 h-7 mt-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      transform="matrix(-1, 0, 0, 1, 0, 0)"
                    >
                      <path
                        d="M16.52 5.65002L13.42 3.25002C13.02 2.85002 12.12 2.65002 11.52 2.65002H7.71998C6.51998 2.65002 5.21998 3.55002 4.91998 4.75002L2.51998 12.05C2.01998 13.45 2.91998 14.65 4.41998 14.65H8.41998C9.01998 14.65 9.51998 15.15 9.41998 15.85L8.91998 19.05C8.71998 19.95 9.31998 20.95 10.22 21.25C11.02 21.55 12.02 21.15 12.42 20.55L16.52 14.45"
                        stroke="#acb8c3"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M21.62 5.65V15.45C21.62 16.85 21.02 17.35 19.62 17.35H18.62C17.22 17.35 16.62 16.85 16.62 15.45V5.65C16.62 4.25 17.22 3.75 18.62 3.75H19.62C21.02 3.75 21.62 4.25 21.62 5.65Z"
                        stroke="#acb8c3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{dislikes}</span>
                  </button>
                </div>
                <Link href={"/instagram"}>
                  <svg
                    className="w-5 h-5 mt-5"
                    viewBox="0 0 24 24"
                    id="meteor-icon-kit__solid-instagram"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.9962 0.0078125C8.73824 0.0078125 8.32971 0.021622 7.05019 0.080003C5.77333 0.138241 4.90129 0.341051 4.13824 0.637622C3.34938 0.944146 2.68038 1.35434 2.01343 2.02124C1.34652 2.68819 0.936333 3.35719 0.629809 4.14605C0.333238 4.9091 0.130429 5.78115 0.0721905 7.058C0.0138095 8.33753 0 8.74605 0 12.0041C0 15.262 0.0138095 15.6705 0.0721905 16.9501C0.130429 18.2269 0.333238 19.099 0.629809 19.862C0.936333 20.6509 1.34652 21.3199 2.01343 21.9868C2.68038 22.6537 3.34938 23.0639 4.13824 23.3705C4.90129 23.667 5.77333 23.8698 7.05019 23.9281C8.32971 23.9864 8.73824 24.0002 11.9962 24.0002C15.2542 24.0002 15.6627 23.9864 16.9422 23.9281C18.2191 23.8698 19.0911 23.667 19.8542 23.3705C20.643 23.0639 21.312 22.6537 21.979 21.9868C22.6459 21.3199 23.0561 20.6509 23.3627 19.862C23.6592 19.099 23.862 18.2269 23.9202 16.9501C23.9786 15.6705 23.9924 15.262 23.9924 12.0041C23.9924 8.74605 23.9786 8.33753 23.9202 7.058C23.862 5.78115 23.6592 4.9091 23.3627 4.14605C23.0561 3.35719 22.6459 2.68819 21.979 2.02124C21.312 1.35434 20.643 0.944146 19.8542 0.637622C19.0911 0.341051 18.2191 0.138241 16.9422 0.080003C15.6627 0.021622 15.2542 0.0078125 11.9962 0.0078125ZM7.99748 12.0041C7.99748 14.2125 9.78776 16.0028 11.9962 16.0028C14.2047 16.0028 15.995 14.2125 15.995 12.0041C15.995 9.79557 14.2047 8.00529 11.9962 8.00529C9.78776 8.00529 7.99748 9.79557 7.99748 12.0041ZM5.836 12.0041C5.836 8.60181 8.594 5.84381 11.9962 5.84381C15.3984 5.84381 18.1564 8.60181 18.1564 12.0041C18.1564 15.4062 15.3984 18.1642 11.9962 18.1642C8.594 18.1642 5.836 15.4062 5.836 12.0041ZM18.3998 7.03996C19.1949 7.03996 19.8394 6.39548 19.8394 5.60043C19.8394 4.80538 19.1949 4.16086 18.3998 4.16086C17.6048 4.16086 16.9603 4.80538 16.9603 5.60043C16.9603 6.39548 17.6048 7.03996 18.3998 7.03996Z"
                      fill="#acb8c3"
                    />{" "}
                  </svg>{" "}
                </Link>{" "}
                <Link href={"/twitter"} className="pt-2">
                  {" "}
                  <svg className="w-5 h-5 mt-6" viewBox="0 0 24 24" fill="none">
                    {" "}
                    <path
                      d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4 1.6a9.04 9.04 0 01-2.88 1.1A4.52 4.52 0 0016 0c-2.48 0-4.5 2.02-4.5 4.5 0 .35.04.7.11 1.03A12.86 12.86 0 013 2.1s-4 9 5 13a13 13 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                      fill="#acb8c3"
                    />{" "}
                  </svg>{" "}
                </Link>{" "}
                <Link href="/linkedin">
                  {" "}
                  <svg
                    className="w-5 h-5 mt-5"
                    viewBox="0 0 24 24"
                    fill="#acb8c3"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.5h5v15H0v-15zm7.5 0h4.78v2.07h.07c.66-1.24 2.28-2.55 4.7-2.55 5.02 0 5.95 3.31 5.95 7.61v8.87h-5v-7.85c0-1.87-.03-4.27-2.6-4.27-2.6 0-3 2.03-3 4.13v7.99h-5v-15z" />{" "}
                  </svg>{" "}
                </Link>{" "}
                <Link href="/telegram">
                  {" "}
                  <svg
                    className="w-5 h-5 mt-6"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      d="M41.4193 7.30899C41.4193 7.30899 45.3046 5.79399 44.9808 9.47328C44.8729 10.9883 43.9016 16.2908 43.1461 22.0262L40.5559 39.0159C40.5559 39.0159 40.3401 41.5048 38.3974 41.9377C36.4547 42.3705 33.5408 40.4227 33.0011 39.9898C32.5694 39.6652 24.9068 34.7955 22.2086 32.4148C21.4531 31.7655 20.5897 30.4669 22.3165 28.9519L33.6487 18.1305C34.9438 16.8319 36.2389 13.8019 30.8426 17.4812L15.7331 27.7616C15.7331 27.7616 14.0063 28.8437 10.7686 27.8698L3.75342 25.7055C3.75342 25.7055 1.16321 24.0823 5.58815 22.459C16.3807 17.3729 29.6555 12.1786 41.4193 7.30899Z"
                      fill="#acb8c3"
                    />
                  </svg>
                </Link>
                <Link href="/telegram">
                  <svg
                    className="w-5 h-5 mt-5"
                    viewBox="0 0 290 290"
                    fill="#acb8c3"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M205.807,0h-15.694c-43.62,0-79.107,35.488-79.107,79.108v33.386H84.193c-2.761,0-5,2.239-5,5v40c0,2.761,2.239,5,5,5 h26.811V285c0,2.761,2.239,5,5,5h40c2.761,0,5-2.239,5-5V162.494h39.786c2.761,0,5-2.239,5-5v-40c0-2.761-2.239-5-5-5h-39.786 V79.108c0-16.05,13.058-29.108,29.107-29.108h15.694c2.761,0,5-2.239,5-5V5C210.807,2.239,208.568,0,205.807,0z" />{" "}
                  </svg>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Comments Section */}
      <div className="max-w-4xl mx-auto mt-12 space-y-8 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Leave a Comment
          </h2>
          <CommentForm
            contentType="post"
            pageSlug={typeof slug === "string" ? slug : ""}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>
          <CommentsList
            contentType="post"
            pageSlug={typeof slug === "string" ? slug : ""}
          />
        </div>
      </div>
    </main>
  );
}
