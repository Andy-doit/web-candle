import { useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { IProductBase } from "../../../types";
import { ProductApi } from "../../../apis";
import Breadcrumbs from "../../../components/ui/breadcrumb";
import { useParams } from "react-router-dom";

export default function DetailSection({ productId }: { productId?: string }) {
  const { categoryId, name } = useParams<{
    categoryId: string;
    name: string;
  }>();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const [activeTab, setActiveTab] = useState<"description" | "shipping" | "exchange">("description");
  const [product, setProduct] = useState<IProductBase | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch product by id (or fallback id)
  useEffect(() => {
    if (!productId) return;
    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await ProductApi.getProductById(productId);

        if (mounted && res?.data) {
          setProduct(res.data);
        }
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <section className="py-12 bg-light border-line">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          Đang tải sản phẩm...
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-12 bg-light border-line">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          Sản phẩm không tồn tại.
        </div>
      </section>
    );
  }

  const images =
    product.images && product.images.length
      ? product.images
      : ["/product-detail.png"];
  const categoryName = name || product.categories?.[0]?.name || "default";
  return (
    <section className="py-8 border-line bg-light">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <Breadcrumbs
          items={[
            { label: "Trang Chủ", link: "/" },
            { label: "Sản Phẩm", link: "/products" },
            {
              label: name || "Sản Phẩm",
              link: `/products/category/${categoryName}/${categoryId}`,
            },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
          {/* --- LEFT COLUMN: IMAGES (SWIPER) --- */}
          <div className="space-y-4">
            {/* 1. Main Slider */}
            <div className="relative rounded-xl overflow-hidden aspect-square">
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{
                  swiper:
                    thumbsSwiper && !thumbsSwiper.destroyed
                      ? thumbsSwiper
                      : null,
                }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="h-full w-full bg-primary"
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={`Main ${index}`}
                      className="w-full h-full object-cover block"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* 2. Thumbnail Slider */}
            <div className="h-12 sm:h-14 md:h-16">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-gallery h-full"
              >
                {images.map((img, index) => (
                  <SwiperSlide
                    key={index}
                    className="rounded-lg overflow-hidden border border-gray-200 cursor-pointer opacity-60 hover:opacity-100 transition-all h-full w-auto! aspect-square"
                  >
                    <img
                      src={img}
                      alt={`Thumb ${index}`}
                      className="w-full h-full object-cover block"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* --- RIGHT COLUMN: INFO --- */}
          {/* <div className="space-y-4">
            <div>
              <p className="text-sm text-dark mb-2">Mã SP: <span className="text-primary font-bold">{product.sku}</span></p>
              <h1 className="text-3xl md:text-4xl font-bold text-dark mb-3">{product.name}</h1>
              <p className="text-2xl text-orange-600 font-bold">{product.price.toLocaleString('vi-VN')}đ</p>
            </div>

            <p className="text-dark/80 leading-relaxed">{product.description}</p>

          </div> */}
          <div className="space-y-5">
            {/* TITLE */}
            <h1 className="text-2xl md:text-3xl text-dark font-bold">
              {product.name}
            </h1>

            {/* BRAND + SKU */}
            <div className="text-sm text-dark/80 space-y-1">
              <p>
                Thương hiệu:{" "}
                <span className="text-primary cursor-pointer hover:underline">
                  {name}
                </span>
              </p>
              <p>
                Mã sản phẩm:{" "}
                <span className="text-primary font-medium">{product.sku}</span>
              </p>
            </div>

            {/* PRICE */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-[#C26A3D]">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-gray-400 line-through text-sm">
                250.000đ
              </span>
              <span className="bg-[#C26A3D] text-white text-xs px-2 py-1 rounded">
                -16%
              </span>
            </div>

            {/* PROMOTION */}
            <div className="border border-dashed border-[#C26A3D] rounded-xl p-4 bg-[#FFF7F2] space-y-2">
              <p className="flex items-center gap-2 font-medium text-[#C26A3D]">
                🎁 KHUYẾN MÃI - ƯU ĐÃI
              </p>
              <ul className="text-sm text-dark space-y-1 list-disc pl-5">
                <li>
                  Nhập mã <strong>WEB10</strong> giảm 10% đơn hàng
                </li>
                <li>Giảm 15% cho đơn hàng tiếp theo</li>
                <li>Tặng khay Oval khi mua 2 ly nến</li>
                <li>FREESHIP đơn từ 500.000đ</li>
              </ul>
            </div>

            {/* SIZE */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Kích thước:</p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm border border-[#C26A3D] text-[#C26A3D] rounded">
                  Nến size nhỏ
                </button>
                <button className="px-3 py-1.5 text-sm border rounded text-gray-500">
                  Nến size lớn
                </button>
              </div>
            </div>

            {/* QUANTITY + CTA */}
            <div className="flex gap-4 mt-4">
              <div className="flex border rounded-lg overflow-hidden">
                <button className="px-3">−</button>
                <div className="px-4 py-2">1</div>
                <button className="px-3">+</button>
              </div>

              <button className="flex-1 border cursor-pointer border-dark rounded-lg font-medium hover:bg-dark hover:text-white transition">
                THÊM VÀO GIỎ
              </button>
            </div>

            <button className="w-full cursor-pointer bg-[#C26A3D] text-white py-3 rounded-lg font-semibold hover:opacity-90">
              MUA NGAY
            </button>

            {/* HOTLINE */}
            <p className="text-sm text-center text-dark/70">
              Gọi đặt mua{" "}
              <span className="text-[#C26A3D] font-semibold">0395.621.315</span>{" "}
              (7:30 - 22:00)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-dark border-t border-dashed border-gray-200 pt-6">
              <div className="flex gap-3">
                <img src="/policy/policy_product_image_1.png" alt="Giao hàng" className="w-6 h-6" />
                Giao hàng toàn quốc
              </div>

              <div className="flex gap-3">
                <img src="/policy/policy_product_image_2.png" alt="Thông điệp" className="w-6 h-6" />
                Hỗ trợ làm thông điệp miễn phí
              </div>

              <div className="flex gap-3">
                <img src="/policy/policy_product_image_3.png" alt="Giảm giá" className="w-6 h-6" />
                Giảm 15% cho đơn hàng tiếp theo
              </div>
            </div>
          </div>
        </div>

        <section className="py-12">
          <div className="max-w-4xl">
            <div className="flex mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-medium text-base transition-colors ${
                  activeTab === 'description'
                    ? 'text-dark border-b-2 border-primary'
                    : 'text-gray-500 hover:text-dark'
                }`}
              >
                Mô tả sản phẩm
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`px-6 py-3 font-medium text-base transition-colors ${
                  activeTab === 'shipping'
                    ? 'text-dark border-b-2 border-primary'
                    : 'text-gray-500 hover:text-dark'
                }`}
              >
                Chính sách giao hàng
              </button>
              <button
                onClick={() => setActiveTab('exchange')}
                className={`px-6 py-3 font-medium text-base transition-colors ${
                  activeTab === 'exchange'
                    ? 'text-dark border-b-2 border-primary'
                    : 'text-gray-500 hover:text-dark'
                }`}
              >
                Chính sách đổi trả
              </button>
            </div>

            <div className="min-h-100">

              {activeTab === 'description' && (
                <div className="space-y-8">
                  <div className="text-dark text-justify leading-relaxed space-y-4">
                    <p>
                      {product.description || "Mô tả sản phẩm không có sẵn"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-dark mb-4">
                      Cấu tạo mùi hương
                    </h3>
                    <ul className="space-y-2 text-dark">
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span><strong>Tổng hương:</strong> Ngọt ngào, âm áp</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span><strong>Top:</strong> Gừng</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span><strong>Middle:</strong> Quế, Đinh hương</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span><strong>Base:</strong> Hạnh nhân, Nhục đậu khấu</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-dark mb-4">
                      Về nến thơm nhà MISSCANDLE
                    </h3>
                    <ul className="space-y-3 text-dark text-justify leading-relaxed">
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">🎁</span>
                        <span>Sản phẩm nến MISSCANDLE với thành phần và chứng nhận an toàn</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">🎁</span>
                        <span>Sáp đậu nành, sáp cọ và bác gỗ, thân thiện với môi trường</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">🎁</span>
                        <span>Lý nến handmade làm từ vật liệu an toàn cho da và sức khỏe</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">🎁</span>
                        <span><strong>Size:</strong> 200g (50 giờ đốt) | 100g (25 giờ đốt)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-dark mb-6">
                    Chính sách giao hàng
                  </h3>
                  <div className="grid grid-cols-1 gap-5 text-dark">
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                      <div>
                        <p className="font-semibold">Giao hàng toàn quốc</p>
                        <p className="text-sm text-gray-600">Chúng tôi hỗ trợ giao hàng nhanh chóng đến tất cả các tỉnh thành</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                      <div>
                        <p className="font-semibold">Đóng gói chuyên nghiệp</p>
                        <p className="text-sm text-gray-600">Sản phẩm được đóng gói cẩn thận với 3 lớp chống sốc</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                      <div>
                        <p className="font-semibold">Miễn phí vận chuyển</p>
                        <p className="text-sm text-gray-600">FREESHIP cho đơn hàng từ 500.000đ trở lên</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'exchange' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-dark mb-6">
                    Chính sách đổi trả
                  </h3>
                  <div className="grid grid-cols-1 gap-5 text-dark">
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                      <div>
                        <p className="font-semibold">Đổi trả trong 30 ngày</p>
                        <p className="text-sm text-gray-600">Bạn có thể đổi hoặc trả hàng trong vòng 30 ngày kể từ ngày mua</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                      <div>
                        <p className="font-semibold">Hàng nguyên trạng</p>
                        <p className="text-sm text-gray-600">Sản phẩm phải còn nguyên tem, chưa qua sử dụng</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                      <div>
                        <p className="font-semibold">Hỗ trợ tối đa</p>
                        <p className="text-sm text-gray-600">Liên hệ hotline 0395.621.315 để được hỗ trợ nhanh chóng</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
