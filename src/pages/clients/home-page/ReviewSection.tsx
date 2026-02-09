import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/navigation'

interface IReview {
  id: number;
  name: string;
  title: string;
  rating: number;
  text: string;
}

export default function ReviewSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const reviews: IReview[] = [
    {
      id: 1,
      name: 'Nguyễn Thị Hương',
      title: 'Khách hàng thân thiết',
      rating: 5,
      text: 'Nến của Lumière thực sự tuyệt vời! Hương thơm tuyệt vời, ánh sáng ấm áp, và nó tạo ra không gian yên bình trong nhà của tôi.',
    },
    {
      id: 2,
      name: 'Trần Văn Minh',
      title: 'Nhà thiết kế nội thất',
      rating: 5,
      text: 'Tôi sử dụng sản phẩm của Lumière cho các dự án thiết kế nhà cửa của mình. Chất lượng và thiết kế đẹp mắt khiến khách hàng của tôi rất hài lòng.',
    },
    {
      id: 3,
      name: 'Phạm Linh Anh',
      title: 'Blogger sức khỏe',
      rating: 4,
      text: 'Các sản phẩm đều được làm từ nguyên liệu tự nhiên 100%. Tôi yêu cách Lumière cam kết với chất lượng và tính bền vững.',
    }
  ]

  return (
    <section
      ref={sectionRef}
      className="bg-review py-12 sm:py-24 md:py-16 lg:py-20 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-100 right-1/3 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] transition-all duration-2000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} animate-float`}></div>
        <div className={`absolute bottom-0 left-1/3 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] bg-primary/10 rounded-full blur-[70px] sm:blur-[90px] transition-all duration-2500 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} animate-float`} style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 opacity-[0.008] bg-[radial-gradient(circle_at_25%_35%,rgba(191,128,85,1)_2px,transparent_2px)] bg-[length:100px_100px] sm:bg-[length:120px_120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header with animation */}
        <div className={`text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="inline-flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="h-[1.5px] sm:h-[2px] w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#9C775B]/40 to-[#9C775B]/60"></div>
            <p className="text-[#9C775B]/75 text-[10px] sm:text-xs md:text-sm font-extralight tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap">
              KHÁCH HÀNG NÓI GÌ
            </p>
            <div className="h-[1.5px] sm:h-[2px] w-24 sm:w-32 bg-gradient-to-l from-transparent via-[#9C775B]/40 to-[#9C775B]/60"></div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-[#2E251F] leading-[1.15] sm:leading-[0.95] tracking-[-0.03em] sm:tracking-[-0.04em] mb-4 sm:mb-6 relative">
            {/* Tách 2 dòng rõ ràng trên mobile */}
            <span className="relative z-10 block">Đánh Giá</span>
            <span className="relative z-10 block mt-2 sm:mt-3">
              {/* Hình tròn sáng phía sau để tăng contrast */}
              <span className="relative inline-block">
                <span className="absolute -inset-4 sm:-inset-6 md:-inset-8 left-1/2 -translate-x-1/2 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-white/80 rounded-full blur-2xl sm:blur-3xl -z-10"></span>
                <span className="text-[#9C775B] italic font-extralight relative z-10">
                  Từ Trái Tim
                </span>
              </span>
            </span>
            <span className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 w-32 sm:w-40 md:w-48 h-[2px] sm:h-[3px] bg-gradient-to-r from-transparent via-[#9C775B]/60 to-transparent hidden md:block animate-shimmer"></span>
          </h2>
        </div>

        {/* Premium Carousel with fade-in */}
        <div className={`max-w-3xl sm:max-w-4xl mx-auto reviews-swiper-container transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.review-next-btn',
              prevEl: '.review-prev-btn',
            }}
            pagination={{
              clickable: false,
              dynamicBullets: true,
              el: '.review-pagination',
            }}
            className="pb-12 sm:pb-16"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="review-card bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm p-6 sm:p-10 md:px-12 lg:px-16 py-10 mx-auto my-4 text-center h-full flex flex-col justify-center group max-w-2xl">
                  {/* Stars with animation */}
                  <div className="flex justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-all duration-700 ${i < review.rating
                            ? "fill-[#F59E0B] text-[#F59E0B] group-hover:scale-110"
                            : "fill-gray-200/50 text-gray-300"
                          }`}
                        style={{ transitionDelay: `${i * 80}ms` }}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <blockquote className="relative mb-8 sm:mb-10">
                    <div className="absolute -top-6 -left-2 opacity-10 text-primary hidden sm:block review-quote">
                      <Quote size={80} />
                    </div>
                    <p className="text-[#2E251F] text-base sm:text-lg md:text-xl leading-relaxed italic relative z-10 font-normal px-2">
                      "{review.text}"
                    </p>
                  </blockquote>

                  {/* Author */}
                  <div className="mt-auto pt-5 sm:pt-6 border-t border-[#9C775B]/20">
                    <h3 className="font-semibold text-[#2E251F] text-lg sm:text-xl mb-1 tracking-tight">
                      {review.name}
                    </h3>
                    <p className="text-[#2E251F]/70 text-xs sm:text-sm uppercase tracking-wider font-medium">
                      {review.title}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Premium Navigation */}
          <div className="flex justify-center items-center gap-5 sm:gap-6 md:gap-8 mt-8 sm:mt-10">
            <button className="cursor-pointer review-prev-btn review-nav-btn flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-[#9C775B] hover:bg-primary active:bg-primary/80 hover:text-light active:text-light transition-all duration-700 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] shadow-lg hover:shadow-xl">
              <ChevronLeft size={20} className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]" />
            </button>

            <div className="review-pagination m-0! w-auto! static! flex justify-center gap-x-[6px] min-w-[100px] sm:min-w-[120px] translate-x-0!"></div>

            <button className="cursor-pointer review-next-btn review-nav-btn flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-[#9C775B] hover:bg-primary active:bg-primary/80 hover:text-light active:text-light transition-all duration-700 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] shadow-lg hover:shadow-xl">
              <ChevronRight size={20} className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
