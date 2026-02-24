import { motion, AnimatePresence } from "motion/react";
import { MissCandleProductCard } from "../../../components";
import { useEffect, useMemo, useState, useCallback } from "react";
import { IProductBase, ICategoryBase } from "../../../types";
import { ProductApi, CategoryApi } from "../../../apis";
import Breadcrumbs from "../../../components/ui/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { Status } from "../../../constants/admin";

// ─── Accordion Item ────────────────────────────────────────────────────────────
interface AccordionItemProps {
  parent: ICategoryBase;
  selectedChildId: string | null;
  onSelectChild: (child: ICategoryBase) => void;
}

const AccordionItem = ({ parent, selectedChildId, onSelectChild }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<ICategoryBase[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toggle = useCallback(async () => {
    if (!isOpen && !loaded) {
      setLoadingChildren(true);
      try {
        const res = await CategoryApi.getCategoryByParentId(String(parent.id));
        if (res?.data) {
          setChildren(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingChildren(false);
        setLoaded(true);
      }
    }
    setIsOpen((prev) => !prev);
  }, [isOpen, loaded, parent.id]);

  const isChildSelected = children.some((c) => String(c.id) === selectedChildId);

  return (
    <div className="relative">

      {/* Parent row */}
      <button
        onClick={toggle}
        className={`w-full flex items-center justify-between pl-4 pr-1 py-3.5 text-left transition-colors duration-200 group`}
      >
        <span className={`text-[15px] tracking-wide transition-colors duration-200
          ${isOpen || isChildSelected
            ? "text-primary font-semibold"
            : "text-gray-600 font-medium group-hover:text-primary"
          }`}>
          {parent.name}
        </span>
        {loadingChildren ? (
          <Loader2 className="w-3 h-3 animate-spin text-primary/50 shrink-0" />
        ) : (
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-gray-300 group-hover:text-primary/60"
              }`}
          />
        )}
      </button>

      {/* Bottom separator */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* Children */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-8 pr-3 pt-1 pb-3 space-y-0">
              {children.length === 0 && !loadingChildren && (
                <p className="text-xs text-gray-400 py-2 italic">Không có danh mục con</p>
              )}
              {children.map((child) => {
                const isActive = String(child.id) === selectedChildId;
                return (
                  <button
                    key={child.id}
                    onClick={() => onSelectChild(child)}
                    className={`relative w-full text-left py-2 text-[14px] flex items-center gap-2 transition-colors duration-150 pl-3
                      ${isActive
                        ? "text-primary font-semibold"
                        : "text-gray-600 hover:text-primary"
                      }`}
                  >
                    {/* Left accent bar – only when active */}
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full bg-primary transition-all duration-300
                        ${isActive ? "h-4 opacity-100" : "h-0 opacity-0"}`}
                    />
                    <span className={`inline-block w-1 h-1 rounded-full shrink-0 transition-colors duration-150
                      ${isActive ? "bg-primary" : "bg-gray-300"}`}
                    />
                    {child.name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProductBase[]>([]);
  const [parentCategories, setParentCategories] = useState<ICategoryBase[]>([]);
  const [loading, setLoading] = useState(true);

  // Which child category is selected (null = all)
  const [selectedChild, setSelectedChild] = useState<ICategoryBase | null>(null);

  // Sorting
  const [sortOption, setSortOption] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // ── Load products + parent categories on mount ──────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productRes, categoryRes] = await Promise.all([
          ProductApi.getCategoryByStatus(Status.LIST_ALL),
          CategoryApi.getCategoryByStatus(Status.LIST_ALL),
        ]);

        if (productRes?.data) {
          setProducts(productRes.data);
        }

        if (categoryRes?.data) {
          // Exclude the first entry ("Sản phẩm nổi bật") and only keep root categories (no parent)
          const rootCats = categoryRes.data
            .filter((c) => !c.parent_uuid)
            .slice(1); // skip first "Sản phẩm nổi bật"
          setParentCategories(rootCats);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ── Handle child category selection ────────────────────────────────────────
  const handleSelectChild = useCallback(
    (child: ICategoryBase) => {
      if (selectedChild && String(selectedChild.id) === String(child.id)) {
        // Deselect → show all
        setSelectedChild(null);
        navigate("/products");
      } else {
        setSelectedChild(child);
        navigate(`/products/category/${encodeURIComponent(child.name)}/${child.id}`);
      }
    },
    [selectedChild, navigate]
  );

  // ── Filter products by selected child ──────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const activeId = selectedChild ? String(selectedChild.id) : categoryId;
    if (!activeId) return products;
    return products.filter((p) =>
      p.categories?.some((c) => String(c.id) === activeId)
    );
  }, [selectedChild, categoryId, products]);

  // ── Sort ───────────────────────────────────────────────────────────────────
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    switch (sortOption) {
      case "price-asc":
        return items.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      case "price-desc":
        return items.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      case "newest":
      default:
        return items.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
    }
  }, [filteredProducts, sortOption]);

  const pageTitle = selectedChild?.name ?? "Sản Phẩm";

  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-light">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-60 md:h-70 lg:h-80 overflow-hidden shrink-0"
      >
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        <Breadcrumbs
          items={[
            { label: "Trang Chủ", link: "/" },
            { label: "Sản Phẩm", link: "/products" },
            ...(selectedChild ? [{ label: selectedChild.name }] : []),
          ]}
          className="mb-8 md:mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* ── Sidebar (Desktop) ── */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6">
            {/* Category Accordion */}
            <div>
              <h3 className="text-[13px] font-extrabold text-gray-500 tracking-[0.2em] uppercase mb-5">
                Danh Mục
              </h3>
              <div className="space-y-2">
                {parentCategories.map((parent) => (
                  <AccordionItem
                    key={parent.id}
                    parent={parent}
                    selectedChildId={selectedChild ? String(selectedChild.id) : null}
                    onSelectChild={handleSelectChild}
                  />
                ))}
              </div>
            </div>

            {/* Promo box */}
            <div className="bg-primary/5 rounded-xl p-5 border border-primary/15 text-center">
              <p className="text-2xl mb-2">🕯️</p>
              <h4 className="font-bold text-primary mb-1 text-sm">Free Shipping</h4>
              <p className="text-xs text-gray-500">Đơn hàng từ 500k</p>
            </div>
          </aside>

          {/* ── Mobile: Chip-style parent categories ── */}
          <div className="lg:hidden col-span-1 mb-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedChild(null); navigate("/products"); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
                  ${!selectedChild ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"}`}
              >
                Tất cả
              </button>
              {parentCategories.map((cat) => (
                <button
                  key={cat.id}
                  className="px-4 py-1.5 rounded-full text-sm font-medium border bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Grid ── */}
          <div className="col-span-1 lg:col-span-9">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {sortedProducts.length} sản phẩm
                {selectedChild && (
                  <span className="ml-1 font-medium text-primary">trong "{selectedChild.name}"</span>
                )}
              </p>
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                  className="flex items-center gap-2 text-sm font-medium text-dark bg-white border border-gray-200 rounded-lg px-4 py-2 hover:border-primary hover:text-primary transition-colors min-w-40 justify-between"
                >
                  <span>{sortOptions.find((o) => o.value === sortOption)?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-full min-w-40 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                    {sortOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => { setSortOption(option.value as typeof sortOption); setIsSortOpen(false); }}
                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                          ${sortOption === option.value ? "bg-primary/5 text-primary font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-dark"}`}
                      >
                        {option.label}
                        {sortOption === option.value && <Check className="w-3.5 h-3.5" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-5xl mb-4">🕯️</span>
                <p className="text-gray-500 text-base">Chưa có sản phẩm trong danh mục này.</p>
                <button
                  onClick={() => { setSelectedChild(null); navigate("/products"); }}
                  className="mt-4 text-sm text-primary underline"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
                }}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10"
              >
                {sortedProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
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
  );
}
