import { Link } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MissCandleProductCard } from "../../../components";
import { useEffect, useState } from "react";
import { IProductBase } from "../../../types";
import { ProductApi } from "../../../apis";

export default function ProductsRelatedSection() {
  const [products, setProducts] = useState<IProductBase[]>([])
  const loadProducts = async (categoryId?: number) => {
    try {
      const res = await ProductApi.getAllProducts({
        categoryId
      })

      if (res?.data) {
        setProducts(res.data)
      }
      } catch (e) {
        console.error(e)
      }
    }
    useEffect(() => {
    loadProducts()
  }, [])
  return (
    <section className="bg-light py-5 md:py-10 px-4 md:px-12 border-line">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-8 md:mb-12">
          <p className="text-dark text-xs md:text-sm tracking-widest mb-2">
            Suggestion For You
          </p>
          <h2 className="text-2xl md:text-4xl font-serif text-primary font-bold">
            Sản Phẩm Cùng Danh Mục
          </h2>
        </div>

        {/* --- SWIPER SECTION --- */}
        <div className="product-slider-container relative px-2 md:px-4">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            navigation={true}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              480: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="pb-8! px-2!"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <MissCandleProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View All Button */}
        <div className="text-center mt-2">
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-8 py-3 text-dark font-medium hover:text-primary transition duration-300 text-sm md:text-base group"
          >
            Xem tất cả bộ sưu tập
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
