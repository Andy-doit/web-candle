import { FunctionComponent, useEffect, useState } from "react";
import { Calendar, Clock, ChevronRight, ArrowRight, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { BlogApi } from "../../../apis";
import { IBlogPost } from "../../../types";
import { Status } from "../../../constants/admin";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Decode HTML entities and strip tags — properly handles &ocirc;, &aacute; etc. */
function stripHtml(html: string): string {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "").trim();
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function readingTime(body: string): number {
    const words = stripHtml(body).split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function HeroSkeleton() {
    return (
        <div className="animate-pulse bg-[#EDE0D0] rounded-2xl h-[520px] w-full" />
    );
}

function CardSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8DDD0]">
            <div className="bg-[#EDE0D0] h-48 w-full" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-[#EDE0D0] rounded w-1/3" />
                <div className="h-5 bg-[#EDE0D0] rounded w-4/5" />
                <div className="h-4 bg-[#EDE0D0] rounded w-full" />
                <div className="h-4 bg-[#EDE0D0] rounded w-3/4" />
            </div>
        </div>
    );
}

// ─── Hero Carousel ──────────────────────────────────────────────────────────

function BlogHeroCarousel({ posts }: { posts: IBlogPost[] }) {
    const navigate = useNavigate();
    const featured = posts.slice(0, Math.min(3, posts.length));

    return (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Swiper
                modules={[Autoplay, Navigation, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation
                loop={featured.length > 1}
                className="blog-hero-swiper"
            >
                {featured.map((post) => (
                    <SwiperSlide key={post.id}>
                        <div className="relative h-[520px] group cursor-pointer" onClick={() => navigate(`/blog/${post.slug}`)}>
                            {/* Background image */}
                            <img
                                src={post.image}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1602524809098-d62b3a8b53a2?w=1200&q=80";
                                }}
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a110a]/90 via-[#1a110a]/40 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex items-center gap-4 mb-3 text-sm text-[#F2B279] font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(post.created_at)}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-[#F2B279]" />
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {readingTime(post.body)} phút đọc
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-heading font-bold mb-3 leading-tight drop-shadow-sm">
                                        {post.title}
                                    </h2>
                                    <p className="text-sm md:text-base text-white/80 leading-relaxed mb-5 max-w-xl line-clamp-2">
                                        {stripHtml(post.short_text)}
                                    </p>
                                    <span className="inline-flex items-center gap-2 bg-[#BF8055] hover:bg-[#a76336] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:gap-3">
                                        Đọc bài viết <ArrowRight className="w-4 h-4" />
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

// ─── Blog Card ───────────────────────────────────────────────────────────────

function BlogCard({ post, index }: { post: IBlogPost; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            className="flex"
        >
            <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-col w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8DDD0] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-350"
            >
                {/* Image */}
                <div className="relative h-52 shrink-0 overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1602524809098-d62b3a8b53a2?w=800&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
                    <div className="absolute bottom-3 right-3 bg-[#BF8055] text-white text-xs px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {readingTime(post.body)} phút
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-[#BF8055] font-medium mb-2 shrink-0">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.created_at)}
                    </div>
                    <h3 className="font-heading text-[#2E251F] text-lg font-bold leading-snug mb-2 line-clamp-2 group-hover:text-[#BF8055] transition-colors duration-300 shrink-0">
                        {post.title}
                    </h3>
                    <p className="text-sm text-[#6B5A4E] leading-relaxed line-clamp-3 mb-4 flex-1">
                        {stripHtml(post.short_text)}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[#BF8055] text-sm font-semibold group-hover:gap-2.5 transition-all duration-300 shrink-0 mt-auto pt-2 border-t border-transparent group-hover:border-[#E8DDD0]/50">
                        Đọc thêm <ChevronRight className="w-4 h-4" />
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

// ─── Thumbnail Sidebar Carousel ──────────────────────────────────────────────

function SidebarPostCarousel({ posts }: { posts: IBlogPost[] }) {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-2xl border border-[#E8DDD0] shadow-sm p-5">
            <h3 className="font-heading text-[#2E251F] text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#BF8055] rounded-full inline-block" />
                Bài viết nổi bật
            </h3>
            <Swiper
                modules={[Autoplay, Pagination]}
                direction="vertical"
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={posts.length > 2}
                slidesPerView={3}
                spaceBetween={12}
                style={{ height: 280 }}
                className="sidebar-swiper"
            >
                {posts.map((post) => (
                    <SwiperSlide key={post.id}>
                        <div
                            className="flex gap-3 cursor-pointer group"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:opacity-80 transition-opacity"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1602524809098-d62b3a8b53a2?w=200&q=60";
                                }}
                            />
                            <div className="min-w-0">
                                <p className="text-xs text-[#BF8055] mb-0.5">{formatDate(post.created_at)}</p>
                                <p className="text-sm font-semibold text-[#2E251F] line-clamp-2 group-hover:text-[#BF8055] transition-colors leading-snug">
                                    {post.title}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const BlogListPage: FunctionComponent = () => {
    const [posts, setPosts] = useState<IBlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await BlogApi.getPosts(Status.SHOW);
                const activePosts = (res.data ?? []).filter(p => p.status === 1);
                setPosts(activePosts);
            } catch {
                setError("Không thể tải bài viết. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF7F3]">
            {/* ── Page Header Banner ── */}
            <section className="relative overflow-hidden py-24 px-4 h-[320px] md:h-[400px] flex items-center justify-center">
                {/* Background Image */}
                <img
                    src="/banner/products.png"
                    alt="Miss Candle Blog Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a110a]/80 via-[#1a110a]/50 to-transparent" />

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <p className="text-[#F2B279] text-sm font-semibold tracking-widest uppercase mb-3">Miss Candle Journal</p>
                        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight drop-shadow-md">
                            Bài Viết & Câu Chuyện
                        </h1>
                        <div className="w-16 h-0.5 bg-[#BF8055] mx-auto mb-5 rounded-full" />
                        <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium">
                            Khám phá thế giới nến thơm, mẹo chăm sóc không gian và những câu chuyện ấm lòng từ Miss Candle.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {error && (
                    <div className="text-center py-16 text-[#BF8055]">
                        <p className="text-lg">{error}</p>
                    </div>
                )}

                {!error && (
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* ── Left: Hero + Grid ── */}
                        <div className="flex-1 min-w-0">
                            {/* Hero Carousel */}
                            <div className="mb-10">
                                {loading ? <HeroSkeleton /> : posts.length > 0 ? <BlogHeroCarousel posts={posts} /> : null}
                            </div>

                            {/* Section title */}
                            {!loading && posts.length > 0 && (
                                <div className="flex items-center gap-3 mb-7">
                                    <span className="w-1 h-7 bg-[#BF8055] rounded-full" />
                                    <h2 className="font-heading text-2xl font-bold text-[#2E251F]">Tất cả bài viết</h2>
                                </div>
                            )}

                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {loading
                                    ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                                    : posts.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
                            </div>

                            {!loading && posts.length === 0 && (
                                <div className="text-center py-20 text-[#9CA3AF]">
                                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                                    <p className="text-lg">Chưa có bài viết nào.</p>
                                </div>
                            )}
                        </div>

                        {/* ── Right: Sidebar ── */}
                        <div className="lg:w-80 shrink-0 space-y-6">
                            {/* About box */}
                            <div className="bg-[#2E251F] text-white rounded-2xl p-6 text-center">
                                <img src="/logo_2.png" alt="Miss Candle" className="h-16 mx-auto mb-3 object-contain" />
                                <p className="text-sm text-white/70 leading-relaxed">
                                    Nến thơm handmade từ sáp tự nhiên — thắp sáng không gian, chữa lành tâm hồn.
                                </p>
                                <Link to="/products" className="mt-4 inline-block text-xs bg-[#BF8055] hover:bg-[#a76336] text-white px-4 py-2 rounded-full transition-colors font-semibold">
                                    Xem sản phẩm →
                                </Link>
                            </div>

                            {/* Featured posts carousel sidebar */}
                            {!loading && posts.length > 1 && <SidebarPostCarousel posts={posts} />}

                            {/* Tips box */}
                            <div className="bg-[#F1EDE4] rounded-2xl border border-[#E0D4C4] p-5">
                                <h3 className="font-heading text-[#2E251F] font-bold mb-3 flex items-center gap-2">
                                    <span className="text-[#BF8055]">🕯️</span> Mẹo dùng nến
                                </h3>
                                <ul className="space-y-2 text-sm text-[#6B5A4E]">
                                    <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-[#BF8055] shrink-0 mt-0.5" />Cắt bấc còn 0.5 cm trước khi thắp</li>
                                    <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-[#BF8055] shrink-0 mt-0.5" />Đốt 2–4 giờ mỗi lần để sáp cháy đều</li>
                                    <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-[#BF8055] shrink-0 mt-0.5" />Dùng nắp đậy để tắt nến, tránh thổi</li>
                                    <li className="flex gap-2"><ChevronRight className="w-4 h-4 text-[#BF8055] shrink-0 mt-0.5" />Để nến xa tầm tay trẻ em và vật nuôi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogListPage;
