import { useEffect, useState } from "react";
import { MissCandleButton } from "../../../components";
import { ArrowRight } from "lucide-react";
import { ICategoryBase } from "../../../types";
import { CategoryApi } from "../../../apis";
import { useNavigate } from "react-router-dom";

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
  console.log("categories:", categories);
  return (
    <section className="bg-light py-16">
      <div className="max-w-7xl mx-auto space-y-24">
        {categories.map((cat, index) => {
          const isReverse = index % 2 === 1;

          return (
            <div
              key={cat.id}
              className={`grid md:grid-cols-2 gap-14 lg:gap-24 items-center ${
                isReverse ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* LEFT CONTENT */}
              <div className={isReverse ? "md:order-2" : ""}>
                <h2 className="font-heading text-[32px] md:text-[40px] text-[#9C6A1A] mb-6 leading-tight">
                  {cat.name}
                </h2>

                <div
                  className="font-body text-[#3F3F3F] text-[15.5px] leading-7 space-y-4 lora-desc"
                  dangerouslySetInnerHTML={{ __html: cat.description }}
                />

                <MissCandleButton
                  className="mt-8 bg-buttonDefault text-white px-6 py-3 font-body text-md hover:bg-buttonHover transition"
                  onClickButton={() => {
                    navigate(`/products/category/${cat.name}/${cat.id}`);
                  }}
                  textDisplay={
                    <>
                      Khám Phá Ngay
                      <ArrowRight className="w-6 h-4 ml-2 transform scale-125" />
                    </>
                  }
                  variant="primary"
                />
              </div>

              {/* RIGHT IMAGE */}
              <div className={`relative ${isReverse ? "md:order-1" : ""}`}>
                <img
                  src={cat.image_url || "/images/religious-candle-section.png"}
                  alt={cat.name}
                  className="w-full h-auto object-cover rounded-sm shadow-lg"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
