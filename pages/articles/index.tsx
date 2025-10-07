import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { fetchPosts } from "@/lib/posts";
import { Post, PostWithViews } from "@/lib/models/postlist";
import { useRouter } from "next/router";
import SEO from "@/components/seo";

type PostsPageProps = {
  initialPosts: Post[];
  total: number;
  initialPage?: number;
};

const SITE_URL = "https://webofen.com";

function isRecommended(post: Post) {
  return post.tags?.some((tag) => tag.name === "پیشنهاد ما");
}

function normalizeImageUrl(url?: string): string {
  if (!url) return `${SITE_URL}/images/og-blog.jpg`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${SITE_URL}${url}`;
  return `${SITE_URL}/${url}`;
}

// تابع برای ایجاد اسکیما مقالات
function generateArticleSchema(posts: Post[]) {
  return posts.map((post) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || "",
    image: normalizeImageUrl(post.imageUrl),
    author: {
      "@type": "Person",
      name: (post as any).author?.name || "وبوفن",
      url: (post as any).author?.url || SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "وبوفن",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: post.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${post.slug}`,
    },
    articleSection: post.category?.title || "دیجیتال مارکتینگ",
    wordCount: post.content ? post.content.split(/\s+/).length : 0,
    timeRequired: `PT${post.readtime || 5}M`,
  }));
}

// اسکیما برای صفحه مقالات
function generateBlogPageSchema(posts: Post[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "مقالات وبوفن",
    description:
      "آخرین مقالات وبوفن درباره دیجیتال مارکتینگ، کسب درآمد آنلاین و آموزش‌های کاربردی",
    url: "https://webofen.com/articles",
    publisher: {
      "@type": "Organization",
      name: "وبوفن",
      logo: {
        "@type": "ImageObject",
        url: "https://webofen.com/logo.png",
      },
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `https://webofen.com/articles/${post.slug}`,
      datePublished: post.createdAt,
      dateModified: post.createdAt,
    })),
  };
}

export default function PostsPage({
  initialPosts,
  total,
  initialPage = 1,
}: PostsPageProps) {
  const router = useRouter();
  const { tag: queryTag } = router.query;

  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPosts.length < total);
  const [currentTag, setCurrentTag] = useState<string | undefined>(
    (queryTag as string) || undefined
  );
  const [allTags, setAllTags] = useState<{ id: string; name: string }[]>([]);

  // فیلتر پست‌ها بر اساس تگ (سمت کلاینت)
  const filteredPosts = useMemo(() => {
    if (!currentTag) return allPosts;
    return allPosts.filter((post) =>
      post.tags?.some((tag) => tag.name === currentTag)
    );
  }, [allPosts, currentTag]);

  const posts = currentTag ? filteredPosts : allPosts;
  const limit = 10;

  // تولید اسکیما برای مقالات و صفحه بلاگ
  const articleSchemas = generateArticleSchema(posts);
  const blogPageSchema = generateBlogPageSchema(posts);

  // تابع برای استخراج تمام تگ‌های منحصربه‌فرد از تمام پست‌ها
  useEffect(() => {
    const extractAllTags = () => {
      const allTagsFromPosts = allPosts.flatMap(
        (post) =>
          post.tags?.map((tag) => ({ id: tag.id, name: tag.name })) || []
      );

      // حذف تگ‌های تکراری بر اساس id و حذف تگ "پیشنهاد ما"
      const uniqueTags = allTagsFromPosts.filter(
        (tag, index, self) =>
          index === self.findIndex((t) => t.id === tag.id) &&
          tag.name !== "پیشنهاد ما"
      );

      setAllTags(uniqueTags);
    };

    extractAllTags();
  }, [allPosts]);

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

  const postsWithViews: PostWithViews[] = posts.map((post) => ({
    ...post,
    views: post.countview || 0,
  }));

  // Create cards array with fixed positions for social cards
  const cards: (PostWithViews | (typeof socialCards)[0])[] = [
    ...postsWithViews.slice(1),
  ];
  if (cards.length > 1) cards.splice(1, 0, socialCards[0]);
  if (cards.length > 5) cards.splice(5, 0, socialCards[1]);

  // تابع برای کلیک روی تگ (فیلتر سمت کلاینت)
  const handleTagClick = (tagName: string) => {
    setCurrentTag(tagName);

    // آپدیت URL بدون ریلود صفحه
    router.push(
      {
        pathname: "/articles",
        query: { tag: tagName },
      },
      undefined,
      { shallow: true }
    );
  };

  // تابع برای حذف فیلتر تگ
  const handleClearTagFilter = () => {
    setCurrentTag(undefined);

    // حذف پارامتر تگ از URL
    router.push(
      {
        pathname: "/articles",
      },
      undefined,
      { shallow: true }
    );
  };

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const postsData = await fetchPosts({
        page: nextPage,
        limit: 10,
        status: "published",
        sort: "createdAt",
        order: "desc",
      });

      if (postsData.posts.length > 0) {
        setAllPosts((prevPosts) => [...prevPosts, ...postsData.posts]);
        setPage(nextPage);
        setHasMore(postsData.posts.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("خطا در بارگذاری پست‌های بیشتر:", error);
    } finally {
      setLoading(false);
    }
  };

  // تابع برای کلیک روی تگ در کارت مقالات
  const handleCardTagClick = (e: React.MouseEvent, tagName: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleTagClick(tagName);
  };

  // تابع برای دیباگ - نمایش تگ‌های موجود
  useEffect(() => {
    console.log("تمامی تگ‌های موجود:", allTags);
    console.log(
      "تمامی پست‌ها:",
      allPosts.map((p) => ({
        title: p.title,
        tags: p.tags?.map((t) => t.name),
      }))
    );
  }, [allTags, allPosts]);

  return (
    <>
      <SEO
        title={
          currentTag
            ? `مقالات با تگ ${currentTag} | وبوفن`
            : "مقالات وبوفن | بلاگ وبوفن"
        }
        description={
          currentTag
            ? `مقالات و آموزش‌های مرتبط با ${currentTag} در وبوفن`
            : "آخرین مقالات وبوفن درباره دیجیتال مارکتینگ، کسب درآمد آنلاین و آموزش‌های کاربردی."
        }
        keywords={
          currentTag
            ? `${currentTag}, مقالات ${currentTag}, آموزش ${currentTag}`
            : "مقالات وبوفن, بلاگ, آموزش دیجیتال مارکتینگ, کسب درآمد آنلاین"
        }
        canonical={
          currentTag
            ? `https://webofen.com/articles?tag=${encodeURIComponent(
                currentTag
              )}`
            : "https://webofen.com/articles"
        }
        ogType="website"
        ogImage="https://webofen.com/images/og-blog.jpg"
      />

      {/* اسکیماهای JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPageSchema) }}
      />

      {articleSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="bg-[#f7f8fc] pb-10">
        <div className="w-full pt-10">
          <div className="w-[1250px] mx-auto">
            {/* بخش تگ‌ها */}
            <div className="mb-8 px-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-600 text-sm ml-2">
                  فیلتر بر اساس تگ:
                </span>

                {/* دکمه نمایش همه */}
                <button
                  onClick={handleClearTagFilter}
                  className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
                    !currentTag
                      ? "bg-[#ff5084] text-white border-[#ff5084] font-medium"
                      : "bg-white text-gray-600 border-gray-300 hover:border-[#ff5084] hover:text-[#ff5084]"
                  }`}
                >
                  همه مقالات
                </button>

                {/* لیست تگ‌ها - نمایش تمام تگ‌های موجود در پست‌ها */}
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.name)}
                    className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
                      currentTag === tag.name
                        ? "bg-[#ff5084] text-white border-[#ff5084] font-medium"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#ff5084] hover:text-[#ff5084]"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>

              {/* نمایش تگ انتخاب شده */}
              {currentTag && (
                <div className="mt-4 flex items-center bg-blue-50 p-3 rounded-lg">
                  <span className="text-gray-700 text-sm font-medium">
                    در حال نمایش مقالات با تگ:
                  </span>
                  <span className="mr-2 px-3 py-1 bg-[#ff5084] text-white rounded-full text-sm font-medium">
                    {currentTag}
                  </span>
                  <span className="text-gray-500 text-sm mr-2">
                    ({filteredPosts.length} مقاله)
                  </span>
                  <button
                    onClick={handleClearTagFilter}
                    className="text-gray-500 hover:text-gray-700 text-sm flex items-center bg-white px-3 py-1 rounded-lg border hover:border-gray-300 transition-colors"
                  >
                    <span className="ml-1">×</span>
                    حذف فیلتر
                  </button>
                </div>
              )}
            </div>

            {/* نمایش پیام وقتی مقاله‌ای با تگ انتخاب شده وجود ندارد */}
            {currentTag && filteredPosts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg mb-2">
                  مقاله‌ای با تگ "
                  <span className="text-[#ff5084] font-medium">
                    {currentTag}
                  </span>
                  " یافت نشد.
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  سعی کنید تگ دیگری انتخاب کنید یا فیلتر را حذف کنید.
                </p>
                <button
                  onClick={handleClearTagFilter}
                  className="px-6 py-2 bg-[#ff5084] text-white rounded-lg hover:bg-[#e04475] transition-colors font-medium"
                >
                  مشاهده همه مقالات
                </button>
              </div>
            )}

            {(currentTag && filteredPosts.length === 0) || (
              <>
                <div className="md:flex justify-between">
                  {/* ✅ Left (Main Content) */}
                  <div className="md:p-0 p-4 w-full md:w-[70%] rounded-2xl h-full">
                    {/* Featured First Post */}
                    {posts.length > 0 && (
                      <Link href={`/articles/${posts[0].slug}`} passHref>
                        <div className="rounded-2xl bg-white mb-8 shadow hover:shadow-lg transition cursor-pointer">
                          {posts[0].imageUrl && (
                            <Image
                              className="rounded-t-2xl"
                              width={1000}
                              height={300}
                              src={`${posts[0].imageUrl}`}
                              alt={posts[0].imageAlt || posts[0].title}
                              loader={({ src }) => src}
                            />
                          )}
                          <div className="w-full mt-6 p-6">
                            <div className="flex items-center relative group">
                              {postsWithViews[0].views > 10 && (
                                <>
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
                                  <div
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                                  hidden group-hover:block px-2 py-1 rounded-md 
                                  bg-gray-800 text-white text-xs shadow-md whitespace-nowrap"
                                  >
                                    پربازدید
                                  </div>
                                </>
                              )}

                              <div className="relative group inline-block">
                                {isRecommended(posts[0]) && (
                                  <>
                                    <svg
                                      className="w-5 h-5 ml-2 text-yellow-400 cursor-pointer"
                                      fill="#f06330"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.954a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.953c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37-2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.953a1 1 0 00-.364-1.118L2.073 9.38c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.954z" />
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
                            <p className="text-gray-700 mt-1 text-xl font-semibold">
                              {posts[0].title}
                            </p>
                            <p className="text-gray-500 mt-3 text-md">
                              {posts[0].description}
                            </p>

                            {/* تگ‌های پست اصلی (بدون تگ "پیشنهاد ما") */}
                            {posts[0].tags &&
                              posts[0].tags.filter(
                                (tag) => tag.name !== "پیشنهاد ما"
                              ).length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {posts[0].tags
                                    .filter((tag) => tag.name !== "پیشنهاد ما")
                                    .map((tag) => (
                                      <span
                                        key={tag.id}
                                        onClick={(e) =>
                                          handleCardTagClick(e, tag.name)
                                        }
                                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200"
                                      >
                                        {tag.name}
                                      </span>
                                    ))}
                                </div>
                              )}

                            <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                              <div className="flex items-center">
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
                                <span className="mt-2 mr-1 text-sm">
                                  {posts[0].countview}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm">
                                زمان مطالعه : {posts[0].readtime} دقیقه
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
                            alt="آموزش دیجیتال مارکتینگ و کسب درآمد آنلاین"
                          />
                        </div>
                      </div>

                      <div className="flex bg-[#a0e1fd] py-2 px-5 mb-5 w-full rounded-2xl border-3 border-white">
                        <div className="w-1/2 flex justify-center items-center">
                          <div>
                            <p className="text-lg text-gray-600">آموزش</p>
                            <p className="text-xl text-gray-700 font-semibold">
                              سئو و بهینه‌سازی
                            </p>
                          </div>
                        </div>
                        <div className="w-1/2 flex justify-end">
                          <Image
                            width={150}
                            height={100}
                            src="/blog/blog-seo-icon.jpg"
                            alt="آموزش سئو و بهینه‌سازی سایت"
                          />
                        </div>
                      </div>
                      <div className="flex bg-[#ffdab0] py-2 px-5 mb-5 w-full rounded-2xl border-3 border-white">
                        <div className="w-1/2 flex justify-center items-center">
                          <div>
                            <p className="text-lg text-gray-600">آموزش</p>
                            <p className="text-xl text-gray-700 font-semibold">
                              تولید محتوا
                            </p>
                          </div>
                        </div>
                        <div className="w-1/2 flex justify-end">
                          <Image
                            width={150}
                            height={100}
                            src="/blog/blog-content-icon.jpg"
                            alt="آموزش تولید محتوا حرفه‌ای"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smaller Posts List with Masonry Layout */}
                {posts.length > 1 && (
                  <div className="md:grid md:grid-cols-3 md:gap-8 p-4 md:mt-2">
                    {cards.map((card) => (
                      <div
                        key={"id" in card ? card.id : (card as Post).id}
                        className="mb-8"
                      >
                        {"type" in card && card.type === "social" ? (
                          // کد مربوط به کارت‌های اجتماعی بدون تغییر
                          <div className="rounded-2xl bg-white text-white shadow hover:shadow-sm transition cursor-pointer block">
                            {/* ... کد کارت‌های اجتماعی ... */}
                          </div>
                        ) : (
                          <Link
                            href={`/articles/${(card as Post).slug}`}
                            passHref
                          >
                            <div className="rounded-2xl bg-white shadow hover:shadow-sm transition cursor-pointer">
                              {(card as Post).imageUrl && (
                                <Image
                                  width={500}
                                  height={200}
                                  src={`${(card as Post).imageUrl!}`}
                                  loader={({ src }) => src}
                                  alt={
                                    (card as Post).imageAlt ||
                                    (card as Post).title
                                  }
                                  className="rounded-t-2xl w-full h-42 object-cover"
                                />
                              )}
                              <div className="flex flex-col justify-between p-8">
                                <div className="flex items-center">
                                  {(card as PostWithViews).countview > 10 && (
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
                                  )}
                                  <div className="relative group inline-block">
                                    {isRecommended(card as Post) && (
                                      <>
                                        <svg
                                          className="w-5 h-5 ml-2 text-yellow-400 cursor-pointer"
                                          fill="#f06330"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.954a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.953c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37-2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.953a1 1 0 00-.364-1.118L2.073 9.38c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.954z" />
                                        </svg>
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
                                    {(card as Post).category?.title}
                                  </p>
                                </div>
                                <p className="text-base font-semibold text-gray-700 hover:text-[#1d546b]">
                                  {(card as Post).title}
                                </p>
                                <p className="text-sm text-gray-700 hover:text-[#1d546b]">
                                  {(card as Post).description}
                                </p>

                                {/* تگ‌های پست (بدون تگ "پیشنهاد ما") */}
                                {(card as Post).tags &&
                                  (card as Post).tags.filter(
                                    (tag) => tag.name !== "پیشنهاد ما"
                                  ).length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {(card as Post).tags
                                        .filter(
                                          (tag) => tag.name !== "پیشنهاد ما"
                                        )
                                        .map((tag) => (
                                          <span
                                            key={tag.id}
                                            onClick={(e) =>
                                              handleCardTagClick(e, tag.name)
                                            }
                                            className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200"
                                          >
                                            {tag.name}
                                          </span>
                                        ))}
                                    </div>
                                  )}

                                <p className="text-md text-gray-400 mt-2 line-clamp-2">
                                  {(card as Post).desc}
                                </p>
                                <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <svg
                                      className="w-5 h-6"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M5.926 20.574a7.26 7.26 0 0 0 3.039 1.511c.107.035.179-.105.107-.175-2.395-2.285-1.079-4.758-.107-5.873.693-.796 1.68-2.107 1.608-3.865 0-.176.18-.317.322-.211 1.359.703 2.288 2.25 2.538 3.515.394-.386.537-.984.537-1.511 0-.176.214-.317.393-.176 1.287 1.16 3.503 5.097-.072 8.19-.071.071 0 .212.072.177a8.761 8.761 0 0 0 3.003-1.442c5.827-4.5 2.037-12.48-.43-15.116-.321-.317-.893-.106-.893.351-.036.95-.322 2.004-1.072 2.707-.572-2.39-2.478-5.105-5.195-6.441-.357-.176-.786.105-.75.492.07 3.27-2.063 5.352-3.922 8.059-1.645 2.425-2.717 6.89.822 9.808z"
                                        fill="#e16f23"
                                      />
                                    </svg>
                                    <span className="mt-2 mr-1 text-sm">
                                      {(card as PostWithViews).views}
                                    </span>
                                  </div>
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
                )}
              </>
            )}

            {loading && (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5084]"></div>
              </div>
            )}

            {hasMore && !currentTag && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-[#ff5084] text-white rounded-lg hover:bg-[#e04475] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      در حال بارگذاری...
                    </div>
                  ) : (
                    "بارگذاری پست‌های بیشتر"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const page = parseInt(context.query.page as string) || 1;
    const limit = 50; // تعداد بیشتری پست بگیریم تا تگ‌های بیشتری داشته باشیم

    // دریافت پست‌ها (بدون پارامتر tag)
    const postsData = await fetchPosts({
      page,
      limit,
      status: "published",
      sort: "createdAt",
      order: "desc",
    });

    const seoData = {
      title: "مقالات وبوفن | بلاگ وبوفن",
      description:
        "آخرین مقالات وبوفن درباره دیجیتال مارکتینگ، کسب درآمد آنلاین و آموزش‌های کاربردی.",
      keywords: "مقالات وبوفن, بلاگ, آموزش دیجیتال مارکتینگ, کسب درآمد آنلاین",
      canonical: "https://webofen.com/articles",
      ogType: "website",
      ogImage: "https://webofen.com/images/og-blog.jpg",
    };

    return {
      props: {
        initialPosts: postsData.posts,
        total: postsData.total,
        initialPage: page,
        seoData,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialPosts: [],
        total: 0,
        initialPage: 1,
      },
    };
  }
};
