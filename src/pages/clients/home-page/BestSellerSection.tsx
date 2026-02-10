import { MissCandleProductCard } from "../../../components";
import { useEffect, useState } from "react";
import { IProductBase } from "../../../types";
import { ProductApi } from "../../../apis";

export default function BestSellerSection() {
  const [products, setProducts] = useState<IProductBase[]>([]);

  const loadProducts = async (categoryId: string) => {
    try {
      const res = await ProductApi.getProductByCategory(categoryId);

      if (res?.data) {
        const filteredProducts = res.data;

        // Some endpoints may return lightweight product objects without `categories`.
        // If that's the case, fetch full product details for each item so
        // the card can show category names.
        const needDetails = filteredProducts.some(
          (p) => !p.categories || p.categories.length === 0
        );

        if (needDetails) {
          try {
            const detailed = await Promise.all(
              filteredProducts.map(async (p) => {
                try {
                  const d = await ProductApi.getProductById(p.id);
                  return d?.data ?? p;
                } catch (e) {
                  return p;
                }
              })
            );
            setProducts(detailed);
          } catch (e) {
            // fallback to whatever we have
            setProducts(filteredProducts);
          }
        } else {
          setProducts(filteredProducts);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProducts("0f3de8aa-52d6-4118-8731-658a29470eb5");
  }, []);

  return (
    <section className="bg-light pt-10 md:pt-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-primary text-xs md:text-sm tracking-[0.2em] font-medium mb-3 uppercase">
            Sản Phẩm Nổi Bật
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-dark font-bold leading-tight">
            Bộ Sưu Tập <span className="text-primary italic">Tinh Hoa</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <MissCandleProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
