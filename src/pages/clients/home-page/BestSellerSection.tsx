import { MissCandleProductCard } from "../../../components";
import { useEffect, useState } from "react";
import { IProductBase } from "../../../types";
import { ProductApi } from "../../../apis";

const NOTE2_ORDER = ["1", "2", "3", "4"];

export default function BestSellerSection () {
  const [products, setProducts] = useState<IProductBase[]>([])

  const loadProducts = async (categoryId?: number) => {
    try {
      const res = await ProductApi.getAllProducts({
        categoryId
      })

      if (res?.data) {
        const filteredProducts = res.data
          .filter(
            (p) => p.note2 && NOTE2_ORDER.includes(String(p.note2))
          )
          .sort(
            (a, b) =>
              NOTE2_ORDER.indexOf(String(a.note2)) -
              NOTE2_ORDER.indexOf(String(b.note2))
          )
          .slice(0, 4);

        setProducts(filteredProducts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <section className="bg-light md:pt-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-primary text-xs md:text-sm tracking-widest font-medium mb-2 uppercase">
            Sản Phẩm Nổi Bật
          </p>
          <h2 className="text-2xl md:text-4xl font-serif text-dark font-bold">
            Bộ Sưu Tập <span className="text-primary italic">Tinh Hoa</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <MissCandleProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}