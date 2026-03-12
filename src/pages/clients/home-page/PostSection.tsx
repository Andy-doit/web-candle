import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IBlogPost } from "../../../types";
import { BlogApi } from "../../../apis/blog.api";
import { Status } from "../../../constants/admin";

export default function PostSection() {
    const [posts, setPosts] = useState<IBlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const res = await BlogApi.getPosts(Status.SHOW);
                const activePosts = (res.data ?? []).filter(p => p.status === 1).slice(0, 2);
                setPosts(activePosts);
            } catch (error) {
                console.error("Failed to load posts:", error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    if (loading) {
        return <div className="py-12"></div>;
    }

    if (posts.length === 0) {
        return null;
    }

    return (
        <section className="pt-20 bg-light">
            <div className="max-w-7xl mx-auto px-4">
                {/* Premium Header */}
                <div className="text-center mb-14 md:mb-20">
                    <div className="inline-flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="h-[1.5px] sm:h-[2px] w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#9C775B]/40 to-[#9C775B]/60"></div>
                        <p className="text-[#9C775B]/75 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap">
                            MỚI NHẤT
                        </p>
                        <div className="h-[1.5px] sm:h-[2px] w-24 sm:w-32 bg-gradient-to-l from-transparent via-[#9C775B]/40 to-[#9C775B]/60"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#2E251F] mb-2 leading-tight">
                        Bài Viết & Câu Chuyện
                    </h2>
                </div>
                {/* Posts Grid - 2 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8DDD0] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 md:h-72 overflow-hidden bg-[#EDE0D0]">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            {/* Content Container */}
                            <div className="p-6 md:p-8 flex flex-col flex-1">
                                {/* Meta Info */}
                                <div className="text-xs md:text-sm text-[#BF8055] font-medium tracking-wide uppercase mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#BF8055]"></span>
                                    {new Date(post.created_at).toLocaleDateString('vi-VN', { 
                                        day: '2-digit', 
                                        month: 'short', 
                                        year: 'numeric' 
                                    })}
                                </div>

                                {/* Title */}
                                <h3 className="font-heading text-xl md:text-2xl font-bold text-[#2E251F] mb-3 leading-snug group-hover:text-[#BF8055] transition-colors duration-300 line-clamp-3 flex-1">
                                    {post.title}
                                </h3>

                                {/* Description */}
                                <div 
                                    className="text-sm md:text-base text-[#6B5A4E] leading-relaxed mb-6 line-clamp-3 flex-1"
                                    dangerouslySetInnerHTML={{ __html: post.short_text }}
                                ></div>

                                {/* CTA Link */}
                                <span className="inline-flex items-center gap-2.5 text-[#BF8055] text-sm md:text-base font-semibold group-hover:gap-4 transition-all duration-300 pt-4 border-t border-[#E8DDD0]/50 group-hover:border-[#BF8055]/30">
                                    Đọc tiếp
                                    <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>  
        </section>
    );
}