import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { MissCandleProductCard } from "../../../components";
import { useEffect, useMemo, useState } from "react";
import { IProductBase, ICategoryBase } from "../../../types";
import { ProductApi, CategoryApi } from "../../../apis";
import Breadcrumbs from "../../../components/ui/breadcrumb";

import { NavLink, useParams } from "react-router-dom";
import { ChevronDown, Check } from "lucide-react";
import { Status } from "../../../constants/admin";

export default function ProductsPage() {
  const { categoryId, name: categoryName } = useParams<{ categoryId: string; name: string }>();
  const [products, setProducts] = useState<IProductBase[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProductBase[]>([]);
  const [parentCategories, setParentCategories] = useState<ICategoryBase[]>([]);
  const [childCategories, setChildCategories] = useState<ICategoryBase[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting State
  const [sortOption, setSortOption] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productRes, parentRes, childRes] = await Promise.all([
          ProductApi.getCategoryByStatus(Status.LIST_ALL),
          CategoryApi.getCategoryByStatus(Status.LIST_ALL),
          CategoryApi.getCategoriesWithParents()
        ]);

        if (productRes?.data) {
          setProducts(productRes.data);
        }

        const pData = Array.isArray(parentRes) ? parentRes : (parentRes?.data || []);
        const cData = Array.isArray(childRes) ? childRes : (childRes?.data || []);
        setParentCategories(pData);
        setChildCategories(cData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter products when categoryId changes or products are loaded
  useEffect(() => {
    if (categoryId) {
      const filtered = products.filter(p =>
        p.categories?.some(c => String(c.id) === categoryId)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [categoryId, products]);

  // Derived sorted products
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    switch (sortOption) {
      case "price-asc":
        return items.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      case "price-desc":
        return items.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      case "newest":
      default:
        // Sort by createdAt desc, fallback to ID if needed
        return items.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
    }
  }, [filteredProducts, sortOption]);

  const pageTitle = categoryName ? decodeURIComponent(categoryName) : "Sản Phẩm";

  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
  ];

  const metaTitle = categoryName
    ? `${decodeURIComponent(categoryName)} - MissCandle`
    : "Sản Phẩm - MissCandle";
  const metaUrl = categoryId
    ? `https://misscandle.com.vn/products/category/${categoryName}/${categoryId}`
    : "https://misscandle.com.vn/products";

  return (
  <>
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={`Khám phá ${pageTitle} tại MissCandle - Nến thơm handmade cao cấp.`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={`Khám phá ${pageTitle} tại MissCandle - Nến thơm handmade cao cấp.`} />
      <meta property="og:image" content="https://misscandle.com.vn/banner/openGraph.jpg" />
      <meta property="og:url" content={metaUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:image" content="https://misscandle.com.vn/banner/openGraph.jpg" />
    </Helmet>
    <div className="min-h-screen flex flex-col bg-light">
      {/* Banner Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-60 md:h-70 lg:h-80 overflow-hidden shrink-0"
      >
        {/* Darker Overlay for Contrast */}
        <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-700 hover:bg-black/30" />

        <img
          src="/banner/products.png"
          alt="banner"
          className="w-full h-full object-cover object-center scale-105"
        />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-[0.2em] uppercase mb-4 [text-shadow:0_4px_20px_rgb(0_0_0/80%)]">
            {pageTitle}
          </h1>
          <div className="w-24 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Trang Chủ", link: "/" },
            ...(categoryId ? [{ label: "Sản Phẩm", link: "/products" }, { label: pageTitle }] : [{ label: "Sản Phẩm" }])
          ]}
          className="mb-8 md:mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-dark mb-6 border-b border-gray-200 pb-2">
                Danh Mục
              </h3>
              <div className="flex flex-col space-y-4">
                <NavLink
                  to={`/products`}
                  end
                  className={({ isActive }) => `text-base transition-colors duration-200 hover:text-primary font-medium ${isActive ? 'text-primary font-semibold' : 'text-gray-600'}`}
                >
                  TẤT CẢ
                </NavLink>

                {parentCategories.filter(c => c.name.toUpperCase() !== 'TẤT CẢ' && c.category_id !== 'ALL' && c.category_id !== 'CAT-SPECIAL-PRODUCT' && c.name !== 'Sản phẩm nổi bật').map(parentCat => (
                  <div key={parentCat.id} className="flex flex-col">
                    <span className="text-sm font-semibold text-dark uppercase mb-2">
                      {parentCat.name}
                    </span>
                    <div className="flex flex-col pl-3 space-y-2 border-l-2 border-gray-100">
                      {childCategories.filter(c => 
                        String(c.parent_uuid) === String(parentCat.id) || 
                        c.parent_name === parentCat.name
                      ).map(childCat => (
                        <NavLink
                          key={childCat.id}
                          to={`/products/category/${childCat.name}/${childCat.id}`}
                          className={({ isActive }) => `text-sm transition-colors duration-200 hover:text-primary ${isActive ? 'text-primary font-semibold' : 'text-gray-600'}`}
                        >
                          {childCat.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner / Promo Box in Sidebar (Optional placeholders) */}
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
              <h4 className="font-bold text-primary mb-2">Free Shipping</h4>
              <p className="text-sm text-gray-600">Đơn hàng từ 500k</p>
            </div>
          </aside>

          {/* Mobile Categories (Horizontal Scroll) */}
          <div className="lg:hidden col-span-1 mb-6">
            <div className="flex flex-wrap gap-2 pb-4">
              <NavLink
                to={`/products`}
                end
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors
                                ${isActive
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                  }`
                }
              >
                TẤT CẢ
              </NavLink>
              {childCategories.filter(c => c.name.toUpperCase() !== 'TẤT CẢ' && c.category_id !== 'ALL' && c.category_id !== 'CAT-SPECIAL-PRODUCT' && c.name !== 'Sản phẩm nổi bật').map(cat => (
                <NavLink
                  key={cat.id}
                  to={`/products/category/${cat.name}/${cat.id}`}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors
                                ${isActive
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                    }`
                  }
                >
                  {cat.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="col-span-1 lg:col-span-9">
            <div className="flex justify-end mb-6">

              {/* Custom Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                  className="flex items-center gap-2 text-sm font-medium text-dark bg-white border border-gray-200 rounded-lg px-4 py-2 hover:border-primary hover:text-primary transition-colors min-w-40 justify-between"
                >
                  <span>{sortOptions.find(o => o.value === sortOption)?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-full min-w-40 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {sortOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setSortOption(option.value as any);
                          setIsSortOpen(false);
                        }}
                        className={`
                                    px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                                    ${sortOption === option.value ? 'bg-primary/5 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-dark'}
                                `}
                      >
                        {option.label}
                        {sortOption === option.value && <Check className="w-3.5 h-3.5" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08 },
                  },
                }}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10"
              >
                {sortedProducts.map((p) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  </>  

  );
}