import { useNavigate } from "react-router-dom";
import { MissCandleButton } from "../../../components";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-hero py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Left Content - Desktop */}
          <div className="space-y-6 hidden md:block">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-dark leading-tight">
                Lan Tỏa
              </h1>
              <h2 className="text-6xl italic font-light text-light">
                Cảm Xúc
              </h2>
              <p className="text-6xl font-bold text-dark">
                Tinh Tế
              </p>
            </div>

            {/* Description - chỉ hiện desktop */}
            <p className="text-dark/90 text-base leading-relaxed max-w-md">
              Khám phá bộ sưu tập nến thơm cao cấp của chúng tôi, được tạo ra từ những nguyên liệu tự nhiên tinh tế nhất, mang lại không gian sống của bạn sự ấm áp và thanh lịch.
            </p>

            <div className="flex gap-4 pt-4">
              <MissCandleButton
                onClickButton={() => navigate('/products')}
                textDisplay="Khám phá sản phẩm"
                variant="primary"
              />
              {/* <MissCandleButton
                onClickButton={() => null}
                textDisplay="Tìm hiểu thêm"
                variant="primary"
              /> */}
            </div>
          </div>

          {/* Right Image + Mobile Overlay */}
          <div className="relative h-105 md:h-137 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/section-hero-2.png"
              alt="Hero Product Right"
              className="w-full h-full object-cover"
            />

            {/* Overlay content - chỉ hiện mobile */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-black/30 md:hidden">
              <div className="space-y-1 mb-4">
                <h1 className="text-3xl font-bold text-white leading-tight">
                  Lan Tỏa
                </h1>
                <h2 className="text-3xl italic font-light text-white">
                  Cảm Xúc
                </h2>
                <p className="text-3xl font-bold text-white">
                  Tinh Tế
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <MissCandleButton
                  onClickButton={() => null}
                  textDisplay="Khám phá sản phẩm"
                  variant="primary"
                />
                {/* <MissCandleButton
                  onClickButton={() => null}
                  textDisplay="Tìm hiểu thêm"
                  variant="primary"
                /> */}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
