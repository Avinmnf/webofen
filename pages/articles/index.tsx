import React, { useState, useEffect, useCallback } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchPosts } from "@/lib/posts";
import { Post, PostWithViews } from "@/lib/models/postlist";
import { useRouter } from "next/router";
import SEO from "@/components/seo";
import Masonry from "react-masonry-css";

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
  return posts.map((post) => {
    const SITE_URL = "https://webofen.com";

    // بررسی تصویر
    let imageUrl = post?.imageUrl?.trim();
    if (!imageUrl || imageUrl === "") {
      imageUrl = `${SITE_URL}/images/og-blog.jpg`;
    } else if (!/^https?:\/\//.test(imageUrl)) {
      // اگر مسیر نسبی بود
      imageUrl = `${SITE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }

    // بررسی نویسنده
    const authorName = (post as any)?.author?.name?.trim() || "تیم وبوفن";
    const authorUrl = (post as any)?.author?.url || SITE_URL;

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title || "مقاله وبوفن",
      description:
        post.description ||
        "مطالب آموزشی و مقالات تخصصی دیجیتال مارکتینگ در وبوفن.",
      image: imageUrl, // ✅ همیشه وجود دارد
      author: {
        "@type": "Person",
        name: "وبوفن",
        url: "https://webofen.com",
      },
      publisher: {
        "@type": "Organization",
        name: "وبوفن",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
      },
      datePublished: post.createdAt || new Date().toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE_URL}/articles/${post.slug}`,
      },
      articleSection: post.category?.title || "دیجیتال مارکتینگ",
    };
  });
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

// اسکیما برای سازمان
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "وبوفن",
    url: "https://webofen.com",
    logo: "https://webofen.com/logo.png",
    description: "وبوفن - پلتفرم تخصصی دیجیتال مارکتینگ و کسب درآمد آنلاین",
    sameAs: ["https://t.me/yourchannel", "https://instagram.com/yourpage"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+98-XXX-XXX-XXXX",
      contactType: "پشتیبانی",
      areaServed: "IR",
      availableLanguage: ["fa", "en"],
    },
  };
}

// اسکیما برای breadcrumb
function generateBreadcrumbSchema(currentTag?: string) {
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "خانه",
      item: "https://webofen.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "مقالات",
      item: "https://webofen.com/articles",
    },
  ];

  if (currentTag) {
    breadcrumbs.push({
      "@type": "ListItem",
      position: 3,
      name: `مقالات با تگ ${currentTag}`,
      item: `https://webofen.com/articles?tag=${encodeURIComponent(
        currentTag
      )}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs,
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
  const [searchLoading, setSearchLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPosts.length < total);
  const [currentTag, setCurrentTag] = useState<string | undefined>(
    (queryTag as string) || undefined
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTags, setAllTags] = useState<{ name: string }[]>([]);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const limit = 10;

  // Reset to initial posts function
  const resetToInitialPosts = useCallback(async () => {
    setIsTransitioning(true);
    setSearchLoading(true);
    try {
      const postsData = await fetchPosts({
        page: 1,
        limit: 14,
        status: "published",
        sort: "createdAt",
        order: "desc",
      });

      setAllPosts(postsData.posts);
      setPage(1);
      setHasMore(postsData.posts.length < postsData.total);
      setCurrentTag(undefined);
    } catch (error) {
      console.error("خطا در بازنشانی:", error);
    } finally {
      setSearchLoading(false);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, []);

  // Search function
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);

      if (query.trim() === "") {
        await resetToInitialPosts();
        return;
      }

      setIsTransitioning(true);
      setSearchLoading(true);

      try {
        const postsData = await fetchPosts({
          page: 1,
          limit: 50,
          status: "published",
          sort: "createdAt",
          order: "desc",
          search: query.trim(),
        });

        setAllPosts(postsData.posts);
        setPage(1);
        setHasMore(false);
        setCurrentTag(undefined);
      } catch (error) {
        console.error("خطا در جستجو:", error);
      } finally {
        setSearchLoading(false);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    },
    [resetToInitialPosts]
  );

  // Clear search function
  const handleClearSearch = useCallback(async () => {
    await resetToInitialPosts();
    setSearchQuery("");
  }, [resetToInitialPosts]);

  // Tag click handler - Now handled by backend
  const handleTagClick = useCallback(
    async (tagName: string) => {
      // Don't do anything if clicking the same tag
      if (currentTag === tagName) return;

      setIsTransitioning(true);
      setCurrentTag(tagName);
      setSearchLoading(true);

      try {
        const postsData = await fetchPosts({
          page: 1,
          limit: 50,
          status: "published",
          sort: "createdAt",
          order: "desc",
          tag: tagName, // Backend handles the tag filtering
        });

        setAllPosts(postsData.posts);
        setPage(1);
        setHasMore(false);
        setSearchQuery("");
      } catch (error) {
        console.error("خطا در فیلتر تگ:", error);
      } finally {
        setSearchLoading(false);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    },
    [currentTag]
  );

  // Clear tag filter
  const handleClearTagFilter = useCallback(async () => {
    await resetToInitialPosts();
    setCurrentTag(undefined);
    setSearchQuery("");
  }, [resetToInitialPosts]);

  // Use allPosts directly for display
  const posts = allPosts;

  // تولید اسکیما برای مقالات و صفحه بلاگ
  const articleSchemas = generateArticleSchema(posts);
  const blogPageSchema = generateBlogPageSchema(posts);
  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema(currentTag);

  // استخراج تمام تگ‌ها از پست‌ها
  useEffect(() => {
    const extractAllTags = () => {
      const allTagsFromPosts = allPosts.flatMap(
        (post) => post.tags?.map((tag) => ({ name: tag.name })) || []
      );

      // حذف تگ‌های تکراری بر اساس name
      const uniqueTags = allTagsFromPosts.filter(
        (tag, index, self) =>
          index === self.findIndex((t) => t.name === tag.name)
      );

      console.log("تگ‌های منحصر به فرد:", uniqueTags);
      setAllTags(uniqueTags);
    };

    if (allPosts.length > 0) {
      extractAllTags();
    }
  }, [allPosts]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);



  // Initialize tag from URL query parameter - FIXED: Remove handleTagClick dependency
  useEffect(() => {
    if (queryTag && queryTag !== currentTag) {
      const applyTagFromUrl = async () => {
        setIsTransitioning(true);
        setSearchLoading(true);

        try {
          const postsData = await fetchPosts({
            page: 1,
            limit: 50,
            status: "published",
            sort: "createdAt",
            order: "desc",
            tag: queryTag as string,
          });

          setAllPosts(postsData.posts);
          setPage(1);
          setHasMore(false);
          setCurrentTag(queryTag as string);
          setSearchQuery("");
        } catch (error) {
          console.error("خطا در فیلتر تگ از URL:", error);
        } finally {
          setSearchLoading(false);
          setTimeout(() => setIsTransitioning(false), 300);
        }
      };

      applyTagFromUrl();
    }
  }, [queryTag]); // Removed currentTag and handleTagClick dependencies

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

  // ساخت کارت‌ها با قرارگیری پست‌ها و کارت‌های شبکه‌های اجتماعی
  const cards: (PostWithViews | (typeof socialCards)[0])[] = [];

  // Keep the featured post aside (posts[0])
  for (let i = 1; i < postsWithViews.length; i++) {
    // insert social cards at certain indexes without overwriting order
    if (i === 4) cards.push(socialCards[0]);
    if (i === 10) cards.push(socialCards[1]);

    cards.push(postsWithViews[i]);
  }

  // لود پست‌های بیشتر
  const handleLoadMore = async () => {
    if (loading || !hasMore || currentTag || searchQuery) return;

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
        setAllPosts((prevPosts) => {
          const combined = [...prevPosts, ...postsData.posts];
          const uniquePosts = combined.filter(
            (post, index, self) =>
              index === self.findIndex((p) => p.id === post.id)
          );
          return uniquePosts;
        });
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

  // کلیک روی تگ در کارت‌ها
  const handleCardTagClick = (e: React.MouseEvent, tagName: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleTagClick(tagName);
  };

  const activeFilters = Boolean(currentTag || searchQuery);
  const showLoadMore = hasMore && !currentTag && !searchQuery && !searchLoading;

  return (
    <>
      <SEO
        title={
          currentTag
            ? `مقالات با تگ ${currentTag} | وبوفن`
            : searchQuery
            ? `نتایج جستجو برای "${searchQuery}" | وبوفن`
            : "مقالات سئو | بلاگ وبوفن"
        }
        description={
          currentTag
            ? `مقالات و آموزش‌های مرتبط با ${currentTag} در وبوفن`
            : searchQuery
            ? `نتایج جستجو برای "${searchQuery}" در وبوفن`
            : "آخرین مقالات وبوفن درباره دیجیتال مارکتینگ، کسب درآمد آنلاین و آموزش‌های کاربردی."
        }
        keywords={
          currentTag
            ? `${currentTag}, مقالات ${currentTag}, آموزش ${currentTag}`
            : searchQuery
            ? `${searchQuery}, جستجو مقالات`
            : "مقالات وبوفن, بلاگ, آموزش دیجیتال مارкетینگ, کسب درآمد آنلاین"
        }
        canonical={
          currentTag
            ? `https://webofen.com/articles?tag=${encodeURIComponent(
                currentTag
              )}`
            : searchQuery
            ? `https://webofen.com/articles?search=${encodeURIComponent(
                searchQuery
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
          <div className="md:w-[1250px] mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6 px-4" aria-label="breadcrumb">
              <ol className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#ff5084] transition-colors"
                  >
                    خانه
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mx-1 transform rotate-180"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </li>
                <li>
                  <Link
                    href="/articles"
                    className="hover:text-[#ff5084] transition-colors"
                  >
                    مقالات
                  </Link>
                </li>
                {currentTag && (
                  <>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mx-1 transform rotate-180"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </li>
                    <li className="text-[#ff5084] font-medium">{currentTag}</li>
                  </>
                )}
              </ol>
            </nav>

            {/* بخش تگ‌ها و جستجو */}
            <div className="mb-8 md:p-0 p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Tags Section */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-gray-600 text-sm ml-2">
                    فیلتر بر اساس تگ:
                  </span>

                  {/* دکمه نمایش همه */}
                  <button
                    onClick={() => {
                      handleClearTagFilter();
                      handleClearSearch();
                    }}
                    className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
                      !currentTag && !searchQuery
                        ? "bg-[#ff5084] text-white border-[#ff5084] font-medium"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#ff5084] hover:text-[#ff5084]"
                    }`}
                  >
                    همه مقالات
                  </button>

                  {/* لیست تگ‌ها */}
                  {allTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleTagClick(tag.name);
                        setSearchQuery("");
                      }}
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
                {/* Search Bar */}
                <div className="md:pr-2 w-full md:w-1/3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="جستجو در مقالات بر اساس عنوان، دسته‌بندی..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#ff5084] focus:ring-2 focus:ring-[#ff5084]/20 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400 text-sm"
                      disabled={searchLoading}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {searchLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ff5084]"></div>
                      ) : searchQuery ? (
                        <button
                          onClick={handleClearSearch}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {activeFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-2 bg-blue-50 p-3 rounded-lg transition-all duration-200">
                  <span className="text-gray-700 text-sm font-medium">
                    فیلترهای فعال:
                  </span>

                  {currentTag && (
                    <span className="px-3 py-1 bg-[#ff5084] text-white rounded-full text-sm font-medium flex items-center transition-all duration-200">
                      {currentTag}
                      <button
                        onClick={handleClearTagFilter}
                        className="mr-1 hover:text-gray-200 text-xs transition-colors"
                        disabled={searchLoading}
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {searchQuery && (
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium flex items-center transition-all duration-200">
                      جستجو: {searchQuery}
                      <button
                        onClick={handleClearSearch}
                        className="mr-1 hover:text-gray-200 text-xs transition-colors"
                        disabled={searchLoading}
                      >
                        ×
                      </button>
                    </span>
                  )}

                  <button
                    onClick={() => {
                      handleClearTagFilter();
                      handleClearSearch();
                    }}
                    disabled={searchLoading}
                    className="text-gray-500 hover:text-gray-700 text-sm flex items-center bg-white px-3 py-1 rounded-lg border hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
                  >
                    حذف همه فیلترها
                  </button>

                  <span className="text-gray-500 text-sm mr-2">
                    ({posts.length} مقاله یافت شد)
                  </span>
                </div>
              )}
            </div>

            {/* نمایش پیام وقتی مقاله‌ای با فیلترهای انتخاب شده وجود ندارد */}
            {activeFilters && posts.length === 0 && !searchLoading && (
              <div className="text-center py-12 bg-white rounded-2xl shadow">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg mb-2">
                  مقاله‌ای با فیلترهای انتخاب شده یافت نشد.
                </p>
                {currentTag && (
                  <p className="text-gray-400 text-sm mb-1">
                    تگ:
                    <span className="text-[#ff5084] font-medium">
                      {currentTag}
                    </span>
                  </p>
                )}
                {searchQuery && (
                  <p className="text-gray-400 text-sm mb-4">
                    جستجو:
                    <span className="text-[#ff5084] font-medium">
                      {searchQuery}
                    </span>
                  </p>
                )}
                <button
                  onClick={() => {
                    handleClearTagFilter();
                    handleClearSearch();
                  }}
                  className="px-6 py-2 bg-[#ff5084] text-white rounded-lg hover:bg-[#e04475] transition-colors font-medium"
                >
                  مشاهده همه مقالات
                </button>
              </div>
            )}

            {!activeFilters || posts.length > 0 ? (
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {postsWithViews[0].views > 10 && (
                                  <div className="relative group inline-block">
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
                      bg-gray-800 text-white text-xs shadow-md whitespace-nowrap
                      z-50"
                                    >
                                      پربازدید
                                    </div>
                                  </div>
                                )}

                                {isRecommended(posts[0]) && (
                                  <div className="relative group inline-block">
                                    <svg
                                      className="w-5 h-5 ml-2"
                                      viewBox="0 0 36 36"
                                      xmlns="http://www.w3.org/2000/svg"
                                      aria-hidden="true"
                                      role="img"
                                      preserveAspectRatio="xMidYMid meet"
                                      fill="#000000"
                                    >
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        stroke-width="0"
                                      ></g>
                                      <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      ></g>
                                      <g id="SVGRepo_iconCarrier">
                                        <path
                                          fill="#FFAC33"
                                          d="M27.287 34.627c-.404 0-.806-.124-1.152-.371L18 28.422l-8.135 5.834a1.97 1.97 0 0 1-2.312-.008a1.971 1.971 0 0 1-.721-2.194l3.034-9.792l-8.062-5.681a1.98 1.98 0 0 1-.708-2.203a1.978 1.978 0 0 1 1.866-1.363L12.947 13l3.179-9.549a1.976 1.976 0 0 1 3.749 0L23 13l10.036.015a1.975 1.975 0 0 1 1.159 3.566l-8.062 5.681l3.034 9.792a1.97 1.97 0 0 1-.72 2.194a1.957 1.957 0 0 1-1.16.379z"
                                        ></path>
                                      </g>
                                    </svg>
                                    <div
                                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                      hidden group-hover:block px-2 py-1 rounded-md 
                      bg-gray-800 text-white text-xs shadow-md whitespace-nowrap
                      z-50"
                                    >
                                      پیشنهاد ما
                                    </div>
                                  </div>
                                )}

                                <p className="text-sm text-gray-500">
                                  {posts[0].category?.title}
                                </p>
                              </div>
                              <span className="text-gray-400 text-sm">
                                {posts[0].createdAt
                                  ? new Date(
                                      posts[0].createdAt
                                    ).toLocaleDateString("fa-IR", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                  : "تاریخ نامشخص"}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-1 text-xl font-semibold">
                              {posts[0].title}
                            </p>
                            <p className="text-gray-500 mt-3 text-md">
                              {posts[0].description}
                            </p>

                            {/* تگ‌های پست اصلی */}
                            {posts[0].tags && posts[0].tags.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {posts[0].tags.map((tag, index) => (
                                  <span
                                    key={index}
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
                      <div className="relative bg-[#fbb2bd] mb-5 w-full aspect-[16/8] rounded-2xl border-3 border-white overflow-hidden">
                        <Image
                          src="/blog/programming-learn (1).png"
                          alt="متخصصان سئو وبوفن - دکتر مجتبی خداخواه"
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute text-white top-18 right-5">
                          <p className="text-lg">آموزش</p>
                          <p className="text-2xl font-semibold">برنامه نویسی</p>
                        </div>
                      </div>
                      <div className="relative bg-[#fbb2bd] mb-5 w-full aspect-[16/8] rounded-2xl border-3 border-white overflow-hidden">
                        <Image
                          src="/blog/ui-ux.png"
                          alt="متخصصان سئو وبوفن - دکتر مجتبی خداخواه"
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute text-white top-18 right-5">
                          <p className="text-lg">آموزش</p>
                          <p className="text-2xl font-semibold">
                            طراحی UI / UX{" "}
                          </p>
                        </div>
                      </div>
                      <div className="relative bg-[#fbb2bd] mb-5 w-full aspect-[16/8] rounded-2xl border-3 border-white overflow-hidden">
                        <Image
                          src="/blog/seo.png"
                          alt="متخصصان سئو وبوفن - دکتر مجتبی خداخواه"
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute text-white top-18 right-5">
                          <p className="text-lg">آموزش</p>
                          <p className="text-2xl font-semibold">سئو سایت </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smaller Posts List with Masonry Layout */}
                {posts.length > 1 && (
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex w-auto gap-6 p-4 md:p-0"
                    columnClassName="bg-clip-padding"
                  >
                    {cards.map((card, index) => (
                      <div
                        key={"id" in card ? card.id : `post-${index}`}
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
                                            در
                                            <a
                                              href="https://t.me/webofenlearn"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[#5ebae8] text-lg hover:underline"
                                            >
                                              تلگرام
                                            </a>
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
                                <div className="flex items-center justify-between">
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
                                  <span className="text-gray-400 text-sm">
                                    {(card as Post).createdAt
                                      ? new Date(
                                          (card as Post).createdAt
                                        ).toLocaleDateString("fa-IR", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : "تاریخ نامشخص"}
                                  </span>
                                </div>
                                <p className="text-base font-semibold text-gray-700 hover:text-[#1d546b]">
                                  {(card as Post).title}
                                </p>
                                <p className="text-sm text-gray-700 hover:text-[#1d546b]">
                                  {(card as Post).description}
                                </p>

                                {/* تگ‌های پست */}
                                {(card as Post).tags &&
                                  (card as Post).tags.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {(card as Post).tags.map((tag, index) => (
                                        <span
                                          key={index}
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
                  </Masonry>
                )}
              </>
            ) : null}

            {loading && (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5084]"></div>
              </div>
            )}

            {showLoadMore && (
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

export const getStaticProps: GetStaticProps = async () => {
  try {
    const page = 1;
    const limit = 14;

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
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        initialPosts: [],
        total: 0,
        initialPage: 1,
      },
      revalidate: 60,
    };
  }
};
