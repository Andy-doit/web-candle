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
import { useCartStore } from "../../../store/cartStore";
import { Toast } from "../../../components";
import { ShoppingCart } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { VariantApi } from "../../../apis";
import { IVariant } from "../../../types";

export default function DetailSection({ productId }: { productId?: string }) {
  const { categoryId, name } = useParams<{
    categoryId: string;
    name: string;
  }>();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const [activeTab, setActiveTab] = useState<"description" | "shipping" | "exchange">("description");
  const [product, setProduct] = useState<IProductBase | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCartStore();
  const [variants, setVariants] = useState<IVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type?: "success" | "error" | "info" }>
  >([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      // Keep max 4 notifications shown at once.
      return next.length > 4 ? next.slice(next.length - 4) : next;
    });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
  if (!product) return;

  const variantImages = selectedVariant?.images ?? [];

  const cartProduct = {
    ...product,
    images: variantImages.length > 0
      ? variantImages
      : product.images,
  };

  addItem(
    cartProduct,
    quantity,
    selectedVariant
      ? {
          id: selectedVariant.id,
          name: selectedVariant.name,
        }
      : undefined
  );

  addToast("Đã thêm sản phẩm vào giỏ hàng", "success");
};

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

  useEffect(() => {
    if (!productId) return;

    const fetchVariants = async () => {
      try {
        const res = await VariantApi.getByProductId(productId);

        setVariants(res.data || []);

        if (res.data?.length) {
          setSelectedVariant(res.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchVariants();
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
  const resolveImage = (img: string) => {
    if (!img) return "https://misscandle.com.vn/banner/openGraph.jpg";
    if (img.startsWith('http')) return img;
    return `https://misscandle.com.vn${img}`;
  };
  const images =
    selectedVariant?.images?.length
      ? selectedVariant.images
      : product.images?.length
        ? product.images
        : ["/product-detail.png"];
  const categoryName = name || product.categories?.[0]?.name || "default";
  return (
    <>
      <Helmet>
        <title>{product.name} - MissCandle</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={resolveImage(product.images?.[0] || '')} />
        <meta
          property="og:url"
          content={`https://misscandle.com.vn/products/category/${categoryName}/${categoryId}/detail/${product.id}`}
        />
      </Helmet>

      <div data-helmet-ready="true" style={{ display: 'none' }}></div>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          open={true}
          onClose={() => removeToast(toast.id)}
          message={toast.message}
          type={toast.type}
        />
      ))}
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
                key={selectedVariant?.id || product.id}
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
                  key={`thumb-${selectedVariant?.id || product.id}`}
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  freeMode={true}
                  watchSlidesProgress={true}
                  observer={true}
                  observeParents={true}
                  watchOverflow={true}
                  slidesPerView="auto"
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="thumbs-gallery h-full"
                >
                  {images.map((img, index) => (
                    <SwiperSlide
                      key={index}
                      className="w-14! sm:w-16! md:w-20!
                                aspect-square 
                                rounded-lg overflow-hidden 
                                border border-gray-200 
                                cursor-pointer 
                                opacity-60 hover:opacity-100 
                                transition-all"
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
                Mã sản phẩm:{" "}
                <span className="text-primary font-medium">{product.sku}</span>
              </p>
            </div>

            {/* PRICE */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-[#C26A3D]">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {/* <span className="text-gray-400 line-through text-sm">
                250.000đ
              </span>
              <span className="bg-[#C26A3D] text-white text-xs px-2 py-1 rounded">
                -16%
              </span> */}
            </div>

            {/* SHORT DESCRIPTION */}
            {variants.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`
                        relative px-5 py-2 border rounded-sm cursor-pointer
                        overflow-hidden transition-all
                        ${
                          selectedVariant?.id === variant.id
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 bg-white hover:border-primary"
                        }
                      `}
                    >
                      <span className="text-sm">{variant.name}</span>

                      {selectedVariant?.id === variant.id && (
                        <>
                          {/* Tam giác góc phải */}
                          <div
                            className="
                              absolute top-0 right-0
                              w-0 h-0
                              border-t-[22px]
                              border-l-[22px]
                              border-l-transparent
                            "
                          />

                          {/* Dấu tick */}
                          <span
                            className="
                              absolute top-[1px] right-[2px]
                              text-black text-[10px] font-bold
                              leading-none
                            "
                          >
                            ✓
                          </span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="border border-dashed border-[#C26A3D] rounded-xl p-4 bg-[#FFF7F2] space-y-2">
              <div 
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-row gap-3 w-full">
              
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shrink-0">
                
                <button
                  onClick={handleDecrease}
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
                            flex items-center justify-center 
                            text-lg md:text-xl 
                            hover:bg-gray-100 active:bg-gray-200 
                            transition-colors cursor-pointer"
                >
                  −
                </button>

                <div className="w-10 sm:w-12 md:w-14 
                                h-10 sm:h-11 md:h-12
                                flex items-center justify-center 
                                text-sm md:text-base font-semibold 
                                border-x border-gray-300">
                  {quantity}
                </div>

                <button
                  onClick={handleIncrease}
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
                            flex items-center justify-center 
                            text-lg md:text-xl 
                            hover:bg-gray-100 active:bg-gray-200 
                            transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 
                          h-10 sm:h-11 md:h-12
                          bg-[#C26A3D] hover:bg-[#A95C36] 
                          text-white font-medium 
                          text-sm cursor-pointer
                          rounded-lg shadow-sm 
                          flex items-center justify-center gap-2
                          active:scale-[0.98] transition-all duration-200"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="truncate">Thêm vào giỏ hàng</span>
              </button>

            </div>

            {/* HOTLINE */}
            <p className="text-sm text-center text-dark/70">
              Gọi đặt mua{" "}
              <span className="text-[#C26A3D] font-semibold">0903.955.018</span>{" "}
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
          <div className="w-full">
            <div className="flex mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 text-center sm:text-left px-6 py-3 font-medium text-base transition-colors ${
                  activeTab === 'description'
                    ? 'text-dark border-b-2 border-primary'
                    : 'text-gray-500 hover:text-dark'
                }`}
              >
                <span className="sm:hidden">Mô tả</span>
                <span className="hidden sm:inline">Mô tả sản phẩm</span>
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`flex-1 text-center sm:text-left px-6 py-3 font-medium text-base transition-colors ${
                  activeTab === 'shipping'
                    ? 'text-dark border-b-2 border-primary'
                    : 'text-gray-500 hover:text-dark'
                }`}
              >
                <span className="sm:hidden">Giao hàng</span>
                <span className="hidden sm:inline">Chính sách giao hàng</span>
              </button>
              <button
                onClick={() => setActiveTab('exchange')}
                className={`flex-1 text-center sm:text-left px-6 py-3 font-medium text-base transition-colors ${
                  activeTab === 'exchange'
                    ? 'text-dark border-b-2 border-primary'
                    : 'text-gray-500 hover:text-dark'
                }`}
              >
                <span className="sm:hidden">Đổi trả</span>
                <span className="hidden sm:inline">Chính sách đổi trả</span>
              </button>
            </div>

            <div className="min-h-100">

              {activeTab === 'description' && (
                <div className="space-y-8">
                  <div className="text-dark text-justify leading-relaxed space-y-4">
                    <div 
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
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
    </>
  );
}
