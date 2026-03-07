import { FunctionComponent, useEffect, useState } from "react";
import { Calendar, Clock, ChevronRight, ArrowLeft, BookOpen, Share2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { BlogApi } from "../../../apis";
import { IBlogPost } from "../../../types";
import { Status } from "../../../constants/admin";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Decode HTML entities and strip tags — properly handles &ocirc;, &aacute; etc. */
function stripHtml(html: string): string {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "").trim();
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });
}

function readingTime(body: string): number {
    return Math.max(1, Math.round(stripHtml(body).split(/\s+/).length / 200));
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
    return (
        <div className="animate-pulse max-w-3xl mx-auto px-4 py-12 space-y-6">
            <div className="h-7 bg-[#EDE0D0] rounded w-2/3" />
            <div className="h-4 bg-[#EDE0D0] rounded w-1/3" />
            <div className="h-[400px] bg-[#EDE0D0] rounded-2xl" />
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-[#EDE0D0] rounded w-full" />
            ))}
        </div>
    );
}

// ─── Related Card ─────────────────────────────────────────────────────────────

function RelatedCard({ post }: { post: IBlogPost }) {
    return (
        <Link
            to={`/blog/${post.slug}`}
            className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#E8DDD0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
            <div className="relative h-40 shrink-0 overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1602524809098-d62b3a8b53a2?w=600&q=70";
                    }}
                />
            </div>
            <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-[#BF8055] mb-1.5 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" /> {formatDate(post.created_at)}
                </p>
                <h4 className="font-heading text-[#2E251F] font-bold text-base leading-snug line-clamp-2 group-hover:text-[#BF8055] transition-colors flex-1">
                    {post.title}
                </h4>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#BF8055] font-semibold group-hover:gap-2 transition-all shrink-0 mt-auto">
                    Đọc thêm <ChevronRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </Link>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const BlogDetailPage: FunctionComponent = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<IBlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<IBlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const [detailRes, listRes] = await Promise.all([
                    BlogApi.getPostBySlug(slug),
                    BlogApi.getPosts(Status.SHOW),
                ]);
                setPost(detailRes.data ?? null);
                const all: IBlogPost[] = listRes.data ?? [];
                setRelatedPosts(all.filter((p) => p.slug !== slug && p.status === 1).slice(0, 6));
            } catch {
                setError("Không tìm thấy bài viết. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-[#FAF7F3]"><DetailSkeleton /></div>;

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#FAF7F3] flex items-center justify-center flex-col gap-4">
                <BookOpen className="w-16 h-16 text-[#BF8055] opacity-40" />
                <p className="text-[#6B5A4E] text-lg">{error ?? "Bài viết không tồn tại."}</p>
                <Link to="/blog" className="bg-[#BF8055] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#a76336] transition-colors">
                    ← Quay lại Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF7F3]">
            {/* ── Hero Banner ── */}
            <div className="relative h-[400px] md:h-[520px] overflow-hidden">
                <img
                    src="/banner/products.png"
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1602524809098-d62b3a8b53a2?w=1400&q=80";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a110a]/85 via-[#1a110a]/45 to-transparent" />

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-white/30"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                </button>

                {/* Hero content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 mb-4 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
                        {/* Breadcrumb */}
                        <nav className="flex items-center justify-center gap-1.5 text-white/60 text-xs mb-4 uppercase tracking-wider font-semibold">
                            <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
                            <ChevronRight className="w-3 h-3" />
                            <Link to="/blog" className="hover:text-white transition-colors">Bài viết</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-white/90 line-clamp-1">{post.title}</span>
                        </nav>

                        <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-md">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-[#F2B279] font-medium">
                            <span className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.created_at)}
                            </span>
                            <span className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <Clock className="w-4 h-4" />
                                {readingTime(post.body)} phút đọc
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Article Body */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="flex-1 min-w-0"
                    >
                        {/* Short text lead — rendered as rich text HTML */}
                        {post.short_text && (
                            <div className="blog-lead mb-8" dangerouslySetInnerHTML={{ __html: post.short_text }} />
                        )}

                        {/* Body content — rich text HTML */}
                        <div
                            className="blog-body"
                            dangerouslySetInnerHTML={{ __html: post.body }}
                        />

                        {/* Share bar */}
                        <div className="mt-10 pt-6 border-t border-[#E8DDD0] flex items-center justify-between flex-wrap gap-4">
                            <Link to="/blog" className="inline-flex items-center gap-2 text-[#BF8055] font-semibold hover:gap-3 transition-all">
                                <ArrowLeft className="w-4 h-4" /> Tất cả bài viết
                            </Link>
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({ title: post.title, url: window.location.href });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                    }
                                }}
                                className="flex items-center gap-2 text-sm text-[#6B5A4E] hover:text-[#BF8055] transition-colors"
                            >
                                <Share2 className="w-4 h-4" /> Chia sẻ
                            </button>
                        </div>
                    </motion.article>

                    {/* Sticky Sidebar */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="sticky top-6 space-y-6">
                            {/* About box */}
                            <div className="bg-[#2E251F] text-white rounded-2xl p-6 text-center">
                                <img src="/logo_2.png" alt="Miss Candle" className="h-14 mx-auto mb-3 object-contain" />
                                <p className="text-sm text-white/70 leading-relaxed">
                                    Nến thơm handmade từ sáp tự nhiên — thắp sáng không gian, chữa lành tâm hồn.
                                </p>
                                <Link to="/products" className="mt-4 inline-block text-xs bg-[#BF8055] hover:bg-[#a76336] text-white px-4 py-2 rounded-full transition-colors font-semibold">
                                    Xem sản phẩm →
                                </Link>
                            </div>

                            {/* Tips */}
                            <div className="bg-[#F1EDE4] rounded-2xl border border-[#E0D4C4] p-5">
                                <h3 className="font-heading text-[#2E251F] font-bold mb-3 flex items-center gap-2">
                                    <span className="text-[#BF8055]">🕯️</span> Mẹo dùng nến
                                </h3>
                                <ul className="space-y-2 text-sm text-[#6B5A4E]">
                                    <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-[#BF8055] shrink-0 mt-0.5" />Cắt bấc còn 0.5 cm trước khi thắp</li>
                                    <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-[#BF8055] shrink-0 mt-0.5" />Đốt 2–4 giờ mỗi lần để sáp cháy đều</li>
                                    <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-[#BF8055] shrink-0 mt-0.5" />Dùng nắp đậy để tắt nến, tránh thổi</li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* ── Related Posts ── */}
                {relatedPosts.length > 0 && (
                    <section className="mt-16">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-1 h-7 bg-[#BF8055] rounded-full" />
                            <h2 className="font-heading text-2xl font-bold text-[#2E251F]">Bài viết liên quan</h2>
                        </div>

                        {/* Desktop Grid */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map((p) => (
                                <RelatedCard key={p.id} post={p} />
                            ))}
                        </div>

                        {/* Mobile Swiper */}
                        <div className="md:hidden">
                            <Swiper
                                modules={[Autoplay, Pagination]}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                pagination={{ clickable: true }}
                                spaceBetween={16}
                                slidesPerView={1.2}
                                className="related-swiper pb-10"
                            >
                                {relatedPosts.map((p) => (
                                    <SwiperSlide key={p.id}>
                                        <RelatedCard post={p} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default BlogDetailPage;
