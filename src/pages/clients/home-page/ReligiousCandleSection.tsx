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
          setCategories(res.data.slice(1, 4));
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
      <div className="max-w-7xl mx-auto space-y-24 px-4">
        {categories.map((cat, index) => {
          const isReverse = index % 2 === 1;

          return (
            <div
              key={cat.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center"
            >
              {/* TEXT */}
              <div
                className={`md:col-span-7 ${
                  isReverse ? "md:order-2" : "md:order-1"
                }`}
              >
                <h2 className="font-heading text-[28px] sm:text-[32px] md:text-[40px] text-[#9C6A1A] mb-6 leading-tight">
                  {cat.name}
                </h2>

                <div
                  className="font-body text-[#3F3F3F] text-[15px] md:text-[15.5px] leading-7 space-y-4 lora-desc"
                  dangerouslySetInnerHTML={{ __html: cat.description }}
                />

                <MissCandleButton
                  className="mt-8 bg-buttonDefault text-white px-6 py-3 font-body text-md hover:bg-buttonHover transition"
                  onClickButton={() =>
                    navigate(`/products/category/${cat.name}/${cat.id}`)
                  }
                  textDisplay={
                    <>
                      Khám Phá Ngay
                      <ArrowRight className="w-6 h-4 ml-2 transform scale-125" />
                    </>
                  }
                  variant="primary"
                />
              </div>

              {/* IMAGE */}
              <div
                className={`md:col-span-5 ${
                  isReverse ? "md:order-1" : "md:order-2"
                }`}
              >
                <img
                  src={cat.image_url || "/images/religious-candle-section.png"}
                  alt={cat.name}
                  className="w-full h-full max-h-120 object-cover rounded-sm shadow-lg"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
