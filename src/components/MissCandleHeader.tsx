import { FunctionComponent, useEffect, useState } from "react"
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react";
import { CategoryApi } from "../apis";
import { ICategoryBase } from "../types";
import { Status } from "../constants/admin";
import { useCartStore } from "../store/cartStore";

const MENU_ITEMS: { label: string, path: string }[] = [
  { label: "Trang chủ", path: "/" },
  { label: "Sản phẩm", path: "/products" },
  { label: "Bài viết", path: "/blog" },
  { label: "Về chúng tôi", path: "/page/about-us" },
  { label: "Chính sách", path: "/page/chinh-sach-si" },
  { label: "Liên hệ", path: "/page/lien-he" },
];

const MissCandleHeader: FunctionComponent<unknown> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [parentCategories, setParentCategories] = useState<ICategoryBase[]>([]);
  const [childCategories, setChildCategories] = useState<ICategoryBase[]>([]);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCartStore();
  const itemCount = getTotalItems();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [parentRes, childRes] = await Promise.all([
          CategoryApi.getCategoryByStatus(Status.LIST_ALL),
          CategoryApi.getCategoriesWithParents()
        ]);
        const pData = Array.isArray(parentRes) ? parentRes : (parentRes?.data || []);
        const cData = Array.isArray(childRes) ? childRes : (childRes?.data || []);
        setParentCategories(pData);
        setChildCategories(cData);
      } catch (e) {
        console.error(e);
      }
    };

    loadCategories();
  }, []);

  return (
    <header className="bg-white relative top-0 left-0 right-0 z-50 py-4 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Mobile Menu Button - Left on Mobile */}
        <button
          className="text-dark hover:text-primary transition md:hidden order-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo - Center on Mobile, Left on Desktop */}
        <Link to="/" className="flex items-center order-2 md:order-1 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <img
            src="/logo_2.png" // Đường dẫn ảnh trong thư mục public
            alt="Miss Candle Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav - Middle on Desktop */}
        <nav className="hidden md:flex items-center gap-8 order-2">
          {MENU_ITEMS.map(item => {
            const isProduct = item.path === "/products"

            if (isProduct) {
              return (
                <div key={item.path} className="group">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `
                      flex items-center gap-1 text-lg transition
                      ${isActive ? "text-primary font-semibold" : "text-dark hover:underline"}
                      `
                    }
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4 mt-0.5" />
                  </NavLink>

                  {/* Dropdown Categories */}
                  <div
                    className="
                      absolute left-0 top-full mt-2 min-w-full
                      bg-white shadow-lg
                      opacity-0 invisible
                      group-hover:opacity-100 group-hover:visible
                      transition-all duration-200 z-50
                    "
                  >
                    <ul className="grid grid-cols-4 gap-x-8 gap-y-6 p-6">
                      {parentCategories.slice(1).filter(c => c.category_id !== 'CAT-SPECIAL-PRODUCT' && c.name !== 'Sản phẩm nổi bật').map(parentCat => (
                        <div key={parentCat.id} className="flex flex-col gap-2">
                          <div className="flex items-center gap-3 border-b border-gray-100 pb-2 mb-2">
                            <div className="w-10 h-10 shrink-0">
                               {parentCat.image_url ? (
                                 <img
                                   src={parentCat.image_url}
                                   alt={parentCat.name}
                                   className="w-full h-full object-contain rounded"
                                 />
                               ) : (
                                 <div className="w-full h-full rounded bg-gray-100" />
                               )}
                            </div>
                            <div className="font-semibold text-dark text-base uppercase">
                              {parentCat.name}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {childCategories.filter(c => 
                              String(c.parent_uuid) === String(parentCat.id) || 
                              c.parent_name === parentCat.name
                            ).map(childCat => (
                              <Link
                                key={childCat.id}
                                to={`/products/category/${childCat.name}/${childCat.id}`}
                                className="
                                  text-sm text-gray-600
                                  hover:text-primary transition
                                "
                              >
                                {childCat.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </ul>
                  </div>

                </div>
              )
            }

            // Các menu còn lại
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  text-lg transition font-normal font-sans
                  ${isActive ? "text-primary font-semibold" : "text-dark hover:underline"}
                  `
                }
              >
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Icons (Cart) - Right on both */}
        <div className="flex items-center gap-3 order-3">
          <button
            className="group relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/cart')}
            title="Giỏ hàng"
          >
            <ShoppingBag className="w-6 h-6 text-dark group-hover:text-primary transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full text-[11px] font-semibold flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 z-60 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-70 shadow-2xl md:hidden overflow-hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <span className="text-primary font-medium">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-dark" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto py-2">
                <nav className="flex flex-col">
                  {MENU_ITEMS.map(item => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    const isProduct = item.path === "/products";
                    const isExpanded = expandedMobileMenu === item.path;

                    if (isProduct) {
                      return (
                        <div key={item.path} className="border-b border-gray-50 last:border-0">
                          <div
                            className={`flex items-center justify-between py-4 px-6 cursor-pointer transition-colors ${isActive ? 'bg-[#FDFAF5]' : 'hover:bg-gray-50'}`}
                            onClick={() => setExpandedMobileMenu(isExpanded ? null : item.path)}
                          >
                            <span className={`text-base font-medium ${isActive ? 'text-primary' : 'text-dark'}`}>
                              {item.label}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>

                          {/* Submenu Animation */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden bg-[#FAFAFA]"
                              >
                                  <div className="py-2 px-4 flex flex-col gap-4">
                                    {parentCategories.slice(1).filter(c => c.category_id !== 'CAT-SPECIAL-PRODUCT' && c.name !== 'Sản phẩm nổi bật').map(parentCat => (
                                      <div key={parentCat.id} className="flex flex-col">
                                        <div className="flex items-center gap-3 mb-2">
                                          <div className="w-8 h-8 rounded-full bg-white border border-gray-100 p-1 flex items-center justify-center shrink-0">
                                            {parentCat.image_url ? (
                                              <img src={parentCat.image_url} alt={parentCat.name} className="w-full h-full object-contain rounded-full" />
                                            ) : (
                                              <div className="w-full h-full bg-gray-200 rounded-full" />
                                            )}
                                          </div>
                                          <span className="text-sm font-semibold text-dark uppercase">{parentCat.name}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 pl-11">
                                          {childCategories.filter(c => 
                                            String(c.parent_uuid) === String(parentCat.id) || 
                                            c.parent_name === parentCat.name
                                          ).map(childCat => (
                                            <Link
                                              key={childCat.id}
                                              to={`/products/category/${childCat.name}/${childCat.id}`}
                                              className="py-2 px-3 hover:bg-gray-100 transition-colors rounded-lg text-sm text-gray-600"
                                              onClick={() => setIsMenuOpen(false)}
                                            >
                                              {childCat.name}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    }

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `block py-4 px-6 text-base font-medium border-b border-gray-50 last:border-0 transition-colors
                           ${isActive ? "text-primary bg-[#FDFAF5]" : "text-dark hover:bg-gray-50"}
                          `
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                    )
                  })}
                </nav>
              </div>

              {/* Drawer Footer */}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

export default MissCandleHeader
