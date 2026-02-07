import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ProductApi } from "../../../apis";
import { IProductBase } from "../../../types";
import Breadcrumbs from "../../../components/ui/breadcrumb";
import productBanner from "../../../assets/images/miss-candle-gl8-1 (1).jpg";
import { MissCandleProductCard } from "../../../components";
import { useParams } from "react-router-dom";

export const ProductsByCategoryPage = () => {
  const { categoryId, name } = useParams<{ categoryId: string; name: string }>();
  const [products, setProducts] = useState<IProductBase[]>([]);

  const loadProducts = async () => {
    try {
      const res = await ProductApi.getProductByCategory(categoryId!);

      if (res?.data) {
        setProducts(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (categoryId) {
      loadProducts();
    }
  }, [categoryId]);

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full h-[240px] md:h-[340px] lg:h-[420px] xl:h-[500px] overflow-hidden shrink-0"
      >
        <img
          src={productBanner}
          alt="banner"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      <Breadcrumbs
        items={[
          { label: "Trang Chủ", link: "/" },
          { label: "Sản Phẩm", link: "/products" },
          { label: `${name}` },
        ]}
      />

      {/* Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
      >
        {products.map((p) => (
          <motion.div
            key={p.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <MissCandleProductCard product={p} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
