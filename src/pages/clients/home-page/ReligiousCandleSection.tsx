import { useEffect, useState } from "react";
import { MissCandleButton } from "../../../components";
import { ArrowRight, ChevronDown, Minus } from "lucide-react";
import { ICategoryBase } from "../../../types";
import { CategoryApi } from "../../../apis";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function ReligiousCandleSection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategoryBase[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await CategoryApi.getAllCategories({});
        if (res?.data) {
          setCategories(res.data.slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadCategories();
  }, []);

  return (
    <section className="bg-[#FAF9F6] relative overflow-hidden">
      <div className="py-20 md:py-32 space-y-32 md:space-y-48 max-w-[1920px] mx-auto px-4 md:px-12 lg:px-20">
        {categories.map((cat, index) => (
          <CategoryItem key={cat.id} cat={cat} index={index} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}

function CategoryItem({ cat, index, navigate }: { cat: ICategoryBase, index: number, navigate: any }) {
  const isEven = index % 2 === 0;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center">
      {/* Large Watermark Background - Static or very subtle movement */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full overflow-hidden pointer-events-none opacity-[0.03]">
        <h1
          className="text-[15vw] md:text-[12vw] font-heading font-black whitespace-nowrap text-[#2E251F] text-center uppercase tracking-widest select-none"
        >
          {cat.name.split(' ')[0] || 'COLLECTION'}
        </h1>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center w-full relative z-10 ${isEven ? '' : ''}`}>
        {/* Image Block */}
        <div className={`md:col-span-7 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
          <div className="relative group perspective-1000">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden aspect-[3/4] md:aspect-[4/3] lg:aspect-[16/10] bg-gray-200"
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img
                src={cat.image_url || "/images/religious-candle-section.png"}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                loading="lazy"
              />
            </motion.div>

            {/* Floating Info Card (Desktop Only Decoration) */}
            <motion.div
              initial={{ opacity: 0, x: isEven ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={`absolute -bottom-10 ${isEven ? '-right-10' : '-left-10'} w-48 h-48 bg-white p-6 hidden lg:flex flex-col justify-between shadow-2xl z-20 border border-[#2E251F]/5`}
            >
              <span className="text-4xl font-heading text-[#BF8055]">0{index + 1}</span>
              <ArrowRight className="w-8 h-8 text-[#2E251F] stroke-[1px] self-end" />
            </motion.div>
          </div>
        </div>

        {/* Text Block */}
        <div className={`md:col-span-5 ${isEven ? 'md:order-2 pl-0 md:pl-10' : 'md:order-1 pr-0 md:pr-10'}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[1px] w-12 bg-[#BF8055]"></span>
              <span className="text-[#BF8055] text-xs font-semibold tracking-[0.3em] uppercase">Premium Collection</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading text-[#2E251F] mb-6 md:mb-8 leading-[1.1]">
              {cat.name}
            </h2>

            <div
              className={`text-[#5C5C5C] text-base md:text-lg leading-relaxed mb-4 font-body lora-desc transition-all duration-500 ${isExpanded ? '' : 'line-clamp-4'}`}
              dangerouslySetInnerHTML={{ __html: cat.description }}
            />

            <div className="mb-8 md:mb-10">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#BF8055]/30 hover:border-[#BF8055] hover:bg-[#BF8055] hover:text-white text-[#BF8055] transition-all duration-300 focus:outline-none"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <Minus className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
                )}
              </button>
            </div>

            <MissCandleButton
              className="relative overflow-hidden group bg-[#2E251F] text-white px-8 md:px-10 py-3 md:py-4 font-body text-base transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              onClickButton={() => {
                navigate(`/products/category/${cat.name}/${cat.id}`);
              }}
              textDisplay={
                <span className="relative z-10 flex items-center gap-3">
                  Khám Phá Bộ Sưu Tập
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </span>
              }
              variant="primary"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
