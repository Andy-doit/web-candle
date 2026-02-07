import { useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IProductBase } from '../../../types';
import { ProductApi } from '../../../apis';
import Breadcrumbs from '../../../components/ui/breadcrumb';
import { useParams } from 'react-router-dom';


export default function DetailSection({ productId }: { productId?: string }) {
  const { categoryId, name } = useParams<{ categoryId: string; name: string }>();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

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
        console.error('Failed to load product', e);
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
        <div className="max-w-7xl mx-auto px-4 md:px-12">Đang tải sản phẩm...</div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-12 bg-light border-line">
        <div className="max-w-7xl mx-auto px-4 md:px-12">Sản phẩm không tồn tại.</div>
      </section>
    );
  }

  const images = product.images && product.images.length ? product.images : ['/product-detail.png'];
  const categoryName = name || product.categories?.[0]?.name || "default";
  return (
    <section className="py-8 border-line">
      
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <Breadcrumbs items={[
          { label: "Trang Chủ", link: "/" },
          { label: "Sản Phẩm", link: "/products" },
          { label: name || "Sản Phẩm", link: `/products/category/${categoryName}/${categoryId}` },
          { label: product.name }
        ]} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
          {/* --- LEFT COLUMN: IMAGES (SWIPER) --- */}
          <div className="space-y-4">

            {/* 1. Main Slider */}
            <div className="relative rounded-xl overflow-hidden aspect-square">
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
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
          <div className="space-y-4">
            <div>
              <p className="text-sm text-dark mb-2">Mã SP: <span className="text-primary font-bold">{product.sku}</span></p>
              <h1 className="text-3xl md:text-4xl font-bold text-dark mb-3">{product.name}</h1>
              <p className="text-2xl text-orange-600 font-bold">{product.price.toLocaleString('vi-VN')}đ</p>
            </div>

            <p className="text-dark/80 leading-relaxed">{product.description}</p>

          </div>
        </div>

        {/* <section className="py-12">
          <div className="max-w-4xl">
            <div className="flex mb-8">
              <div className="inline-flex p-1 gap-2 bg-light rounded-xl border border-gray-200">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex items-center px-6 py-2.5 text-sm font-medium rounded-lg border-1 border-line/70 hover:border-line ${
                    activeTab === 'specs'
                      ? 'bg-primary/40 text-dark'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Mô tả chi tiết
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex items-center px-6 py-2.5 text-sm font-medium rounded-lg border-1 border-line/70 hover:border-line ${
                    activeTab === 'info'
                      ? 'bg-primary/40 text-dark'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Đóng gói
                </button>
              </div>
            </div>

            <div className="min-h-[300px]">

              {activeTab === 'specs' && (
                <div className="bg-primary/40 p-6 rounded-xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-dark mb-4">
                      Thông số sản phẩm
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p className="flex flex-wrap justify-between sm:justify-start sm:gap-4">
                        <span className="font-semibold text-dark min-w-[200px]">Kích thước sản phẩm lẻ:</span>
                        <span>Đường kính: 1.8cm, Chiều cao: 25cm</span>
                      </p>
                      <p className="flex flex-wrap justify-between sm:justify-start sm:gap-4">
                        <span className="font-semibold text-dark min-w-[200px]">Kích thước bao bì:</span>
                        <span>12cm x 12cm x 12cm</span>
                      </p>
                    </div>
                  </div>

                  <div className="">
                    <h3 className="text-lg text-dark mb-3">
                      Phân loại: Nến tinh
                    </h3>
                    <div className="text-sm text-dark space-y-4 leading-relaxed text-justify">
                      <p>
                        Nến DEHN được thiết kế dưới dạng ly thủy tinh trong suốt kết hợp nắp đậy,
                        làm nổi bật tượng nến được chứa đựng bên trong.
                      </p>
                      <p>
                        Sản phẩm tiêu hao ít, thời gian cháy dài đến 15 giờ đồng hồ.
                        Thiết kế dạng hộp có nắp trông thật gọn gàng, cuốn hút và ngọt ngào.
                      </p>
                      <p>
                        Hương hoa và trái cây tạo nên màu sắc bắt mắt: đỏ, vàng, trắng, xanh dương.
                      </p>
                      <p className="italic text-dark">
                        Để khách hàng lựa chọn màu sắc và mùi hương thích hợp, hiển thị cá tính, nét riêng của mình.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'info' && (
                <div className="bg-primary/40 p-6 rounded-xl space-y-6">
                  <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
                    Thông tin đóng gói & Vận chuyển
                  </h3>
                  <div className="grid grid-cols-1 gap-5 text-sm text-dark">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Bao bì đạt chuẩn thiết kế châu Âu
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Có giấy chứng nhận an toàn sản phẩm
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Đóng gói chuyên nghiệp (Chống sốc 3 lớp)
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Hỗ trợ giao hàng quốc tế
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section> */}

      </div>
    </section>
  );
}
