import Productvideo from "@/components/productvideo";

interface RelatedCategory {
  id: string;
  title: string;
  products: { id: string; title: string; slug: string; imageUrl?: string; videoUrl?: string }[];
}

interface Props {
  html: string;
  relatedCategories?: RelatedCategory[];
}

export function InjectRelatedCategories({ html, relatedCategories }: Props) {
  if (!relatedCategories || !relatedCategories.length)
    return <div dangerouslySetInnerHTML={{ __html: html }} />;

  // Split HTML by second <h2>
  const h2Regex = /<h2\b[^>]*>.*?<\/h2>/gi;
  const h2Matches = html.match(h2Regex);

  let beforeSecondH2 = html;
  let afterSecondH2 = '';

  if (h2Matches && h2Matches.length >= 2) {
    const secondH2Index = html.indexOf(h2Matches[1]);
    beforeSecondH2 = html.slice(0, secondH2Index);
    afterSecondH2 = html.slice(secondH2Index);
  }

  // Flatten all products
  const allProducts = relatedCategories.flatMap(cat => cat.products);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: beforeSecondH2 }} />

      <section className="related-categories my-8">
        <h4 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">محصولات مرتبط</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map(prod => (
            <a
              key={prod.id}
              href={`/products/${prod.slug}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center p-4"
            >
              <div className="w-full mb-3 relative">
                {prod.videoUrl ? (
                  <Productvideo product={prod.videoUrl} />
                ) : prod.imageUrl ? (
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <p className="font-medium text-sm">{prod.title}</p>
            </a>
          ))}
        </div>
      </section>

      <div dangerouslySetInnerHTML={{ __html: afterSecondH2 }} />
    </>
  );
}
