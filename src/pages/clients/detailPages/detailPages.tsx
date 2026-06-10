import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PageApi } from '../../../apis/page.api';
import { IPageBase } from '../../../types/page.type';


function PageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<IPageBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    PageApi.getPageBySlug(slug)
      .then((res) => {
        setPage(res.data);
      })
      .catch((err) => {
        setError(err.message || 'Không tìm thấy trang');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-center py-10">Đang tải trang...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!page) return <div className="text-center py-10">Không tìm thấy trang</div>;

  return (
    <>
    <Helmet>
      <title>{page.title ? `${page.title} - MissCandle` : "MissCandle"}</title>
      <meta name="description" content={page.title + "MissCandle" || "MissCandle"} />
      <meta property="og:title" content={page.title ? `${page.title} - MissCandle` : "MissCandle"} />
      <meta property="og:image" content={page.image || "https://misscandle.com.vn/banner/openGraph.jpg"} />
      <meta property="og:url" content={`https://misscandle.com.vn/page/${page.slug}`} />
    </Helmet>
    <div className="w-full">
      {/* Banner */}
      {page.image && (
        <div className="relative w-full h-52 sm:h-72 md:h-96 lg:h-128overflow-hidden">
          <img
            src={page.image}
            alt={page.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <div
          className="prose prose-sm sm:prose-base md:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      </div>
    </div>
    </>
  );
}

export default PageDetail;