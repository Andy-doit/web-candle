import { useNavigate } from "react-router-dom";
import { MissCandleButton } from "../../../components";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-hero py-6 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left Content - Desktop */}
          <div className="space-y-6 hidden md:block animate-fade-in-up">
            <div className="space-y-2">
              <h1 className="text-5xl lg:text-7xl font-bold text-dark leading-tight">
                Lan Tỏa
              </h1>
              <h2 className="text-5xl lg:text-7xl italic font-light text-[#9C775B]">
                Cảm Xúc
              </h2>
              <p className="text-5xl lg:text-7xl font-bold text-dark">
                Tinh Tế
              </p>
            </div>

            {/* Description - chỉ hiện desktop */}
            <p className="text-dark/80 text-base lg:text-lg leading-relaxed max-w-lg">
              Khám phá bộ sưu tập nến thơm cao cấp của chúng tôi, được tạo ra từ những nguyên liệu tự nhiên tinh tế nhất, mang lại không gian sống của bạn sự ấm áp và thanh lịch.
            </p>

            <div className="flex gap-4 pt-6">
              <MissCandleButton
                onClickButton={() => navigate('/products')}
                textDisplay="Khám phá ngay"
                variant="primary"
                className="px-8 py-3 text-lg"
              />
            </div>
          </div>

          {/* Right Image + Mobile Overlay */}
          <div className="relative h-[500px] md:h-[600px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src="/section-hero-2.png"
              alt="Hero Product Right"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>

            {/* Overlay content - chỉ hiện mobile */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:hidden z-10">
              <div className="space-y-1 mb-6">
                <h1 className="text-4xl font-bold text-white leading-tight drop-shadow-md">
                  Lan Tỏa
                </h1>
                <h2 className="text-4xl italic font-light text-primary drop-shadow-md">
                  Cảm Xúc
                </h2>
                <p className="text-4xl font-bold text-white drop-shadow-md">
                  Tinh Tế
                </p>
              </div>

              <p className="text-white/90 text-sm mb-6 line-clamp-3 drop-shadow-sm">
                Khám phá bộ sưu tập nến thơm cao cấp của chúng tôi, mang lại không gian sống của bạn sự ấm áp.
              </p>

              <div className="flex flex-col gap-3">
                <MissCandleButton
                  onClickButton={() => navigate('/products')}
                  textDisplay="Khám phá ngay"
                  variant="primary"
                  className="w-full justify-center bg-white text-dark hover:bg-gray-100"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
