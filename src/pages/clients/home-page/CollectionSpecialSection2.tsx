import { useEffect, useRef, useState } from "react";
import {MissCandleSpecialCollection} from "../../../components";

export default function CollectionSpecialSection2() {
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

  const specialProducts = [
    {
      id: 1,
      restock: 24,
      name: 'Nến Trang Trí',
      description: 'Điểm nhấn hoàn hảo',
      image: '/collection_1.png'
    },
    {
      id: 2,
      restock: 18,
      name: 'Nến Thư Giãn',
      description: 'Thư thái tâm hồn',
      image: '/collection_2.png'
    },
    {
      id: 3,
      restock: 12,
      name: 'Quà Tặng',
      description: 'Ý nghĩa yêu thương',
      image: '/collection_3.png'
    }
  ]

  const bigProduct = specialProducts[0];
  const smallProducts = specialProducts.slice(1, 3);

  return (
    <section 
      ref={sectionRef}
      className="bg-light py-16 sm:py-20 md:py-24 lg:py-28 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/3 right-0 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] bg-[#9C775B]/4 rounded-full blur-[90px] sm:blur-[110px] transition-all duration-2000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} animate-float`}></div>
        <div className={`absolute bottom-1/3 left-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-[#9C775B]/4 rounded-full blur-[80px] sm:blur-[100px] transition-all duration-2500 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'} animate-float`} style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 opacity-[0.008] bg-[radial-gradient(circle_at_60%_40%,rgba(191,128,85,1)_2px,transparent_2px)] bg-[length:100px_100px] sm:bg-[length:120px_120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header with animation */}
        <div className={`text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="inline-flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="h-[1.5px] sm:h-[2px] w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#9C775B]/40 to-[#9C775B]/60"></div>
            <p className="text-[#9C775B]/75 text-[10px] sm:text-xs md:text-sm font-extralight tracking-[0.3em] sm:tracking-[0.4em] uppercase whitespace-nowrap">
              Khám Phá
            </p>
            <div className="h-[1.5px] sm:h-[2px] w-24 sm:w-32 bg-gradient-to-l from-transparent via-[#9C775B]/40 to-[#9C775B]/60"></div>
          </div>
          
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-[#2E251F] leading-[1.15] sm:leading-[0.95] tracking-[-0.02em] sm:tracking-[-0.04em] mb-4 sm:mb-6 relative">
            <span className="relative z-10">Bộ Sưu Tập</span>
            {/* Luôn xuống dòng giữa 2 phần tiêu đề để mobile không bị dính chữ */}
            <br />
            <span className="text-[#9C775B] italic font-extralight relative z-10">
              Đặc Biệt
            </span>
            <span className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 w-32 sm:w-40 md:w-48 h-[2px] sm:h-[3px] bg-gradient-to-r from-transparent via-[#9C775B]/60 to-transparent hidden md:block animate-shimmer"></span>
          </h2>
        </div>
        
        {/* Premium Grid Layout with stagger */}
        <div className="hidden lg:grid grid-cols-2 gap-6 sm:gap-8 h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px]">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-20 scale-95'}`}>
            <MissCandleSpecialCollection 
              product={bigProduct} 
              isLarge={false} 
              styles="h-full"
            />
          </div>
          <div className="flex flex-col gap-6 sm:gap-8 h-full">
            {smallProducts.map((product, index) => (
              <div
                key={product.id}
                className={`flex-1 min-h-[180px] sm:min-h-[200px] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-20 scale-95'}`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <MissCandleSpecialCollection
                  product={product}
                  isLarge={false}
                  styles="h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="grid grid-cols-1 lg:hidden gap-5 sm:gap-6">
          {specialProducts.map((product, index) => (
            <div
              key={product.id}
              className={`h-[280px] sm:h-[320px] md:h-[350px] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <MissCandleSpecialCollection
                product={product}
                isLarge={false}
                styles="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
