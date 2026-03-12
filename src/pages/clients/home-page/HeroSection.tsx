import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MissCandleButton } from "../../../components";
import { ProductApi } from "../../../apis/product.api";
import { IBannerBase } from "../../../types";
import { Status } from "../../../constants/admin";

export default function HeroSection() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<IBannerBase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await ProductApi.getBanners(Status.SHOW);
        const data = (res as any).data;
        const bannerList = data?.data || data || [];
        if (Array.isArray(bannerList) && bannerList.length > 0) {
          const activeBanners = bannerList.filter((b: any) => b.status === 1);
          setBanners(activeBanners.length > 0 ? activeBanners : bannerList);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanners();
  }, []);

  // Tự động chuyển slide mỗi 5 giây
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    // Hiển thị skeleton loading nếu chưa có data
    return (
      <section className="bg-hero min-h-[500px] flex items-center justify-center py-10">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];
  // Sử dụng màu nền từ api nếu có, mặc định là #F2B279
  const bgColor = currentBanner.background_color || "#F2B279";

  return (
    <section
      className="py-10 md:py-12 transition-colors duration-1000 ease-in-out relative"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Left Content - Desktop */}
          <div className="space-y-6 hidden md:block z-10">
            <div
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-sm min-h-[140px] flex flex-col justify-end"
              dangerouslySetInnerHTML={{ __html: currentBanner.title }}
            />

            <div
              className="text-base leading-relaxed max-w-md drop-shadow-sm font-medium min-h-[50px]"
              dangerouslySetInnerHTML={{ __html: currentBanner.description }}
            />

            <div className="flex flex-col gap-6 pt-4">
              <div className="flex gap-4">
                <MissCandleButton
                  onClickButton={() => {
                    const link = currentBanner.button_link;
                    if (link && link.startsWith("http")) {
                      window.location.href = link;
                    } else if (link) {
                      navigate(link);
                    } else {
                      navigate('/products');
                    }
                  }}
                  textDisplay="Khám phá sản phẩm"
                  variant="primary"
                />
              </div>

              {/* Dots navigation */}
              {banners.length > 1 && (
                <div className="flex gap-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx ? "w-8 bg-black/80" : "w-2.5 bg-black/30 hover:bg-black/50"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-105 md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl group z-10">
            {banners.map((banner, idx) => (
              <img
                key={banner.id || idx}
                src={banner.image}
                alt={`Banner ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${currentIndex === idx
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-105 z-0"
                  }`}
              />
            ))}

            {/* Overlay content (title + description) - mobile only */}
            <div className="absolute inset-x-0 bottom-0 top-1/2 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:hidden z-20">
              <div
                className="text-3xl font-bold text-white leading-tight mb-2 drop-shadow-md"
                dangerouslySetInnerHTML={{ __html: currentBanner.title }}
              />

              <div
                className="text-white/90 text-sm drop-shadow-md line-clamp-2"
                dangerouslySetInnerHTML={{ __html: currentBanner.description }}
              />
            </div>
          </div>

        </div>

        {/* Mobile Button Section - Below Image */}
        <div className="md:hidden mt-6 space-y-4">
          <div className="flex flex-col gap-4">
            <MissCandleButton
              onClickButton={() => {
                const link = currentBanner.button_link;
                if (link && link.startsWith("http")) {
                  window.location.href = link;
                } else if (link) {
                  navigate(link);
                } else {
                  navigate('/products');
                }
              }}
              textDisplay="Khám phá sản phẩm"
              variant="primary"
            />
          </div>

          {/* Dots navigation Mobile */}
          {banners.length > 1 && (
            <div className="flex gap-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx ? "w-8 bg-black/80" : "w-2.5 bg-black/30 hover:bg-black/50"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
