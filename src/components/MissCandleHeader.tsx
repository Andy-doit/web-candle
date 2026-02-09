import { FunctionComponent, useEffect, useState } from "react"
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { CategoryApi } from "../apis";
import { ICategoryBase } from "../types";

const MENU_ITEMS: { label: string, path: string }[] = [
  { label: "Trang chủ", path: "/" },
  { label: "Sản phẩm", path: "/products" },
  { label: "Về chúng tôi", path: "/about-us" },
  { label: "Chính sách sỉ", path: "/wholesales" },
  { label: "Liên hệ", path: "/contact" },
];

const MissCandleHeader: FunctionComponent<unknown> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<ICategoryBase[]>([]);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await CategoryApi.getAllCategories({});
        if (res?.data) {
          const rootCategories = res.data.filter(
            (cat: ICategoryBase) => cat.parent_uuid === null
          );
          setCategories(rootCategories);
        }
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
                      {categories.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/products/category/${cat.name}/${cat.id}`}
                          className="
                            flex items-center gap-3
                            text-sm text-dark
                            hover:text-primary transition
                          "
                        >
                          <div className="w-14 h-14 shrink-0">
                            {cat.image_url ? (
                              <img
                                src={cat.image_url}
                                alt={cat.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full rounded bg-gray-100" />
                            )}
                          </div>
                          <div className="text-lg tracking-wide">
                            {cat.name}
                          </div>
                        </Link>
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
              0
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-50 h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col py-2">
            {MENU_ITEMS.map(item => {
              if (item.path === "/products") {
                const isExpanded = expandedMobileMenu === item.path;
                const isActiveProduct = location.pathname.startsWith('/products');

                return (
                  <div key={item.path} className="border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition">
                      <Link
                        to="/products"
                        className={`text-base font-medium transition ${isActiveProduct ? 'text-primary font-semibold' : 'text-dark hover:text-primary'}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <div
                        className="flex-1 flex justify-end self-stretch items-center cursor-pointer pl-8"
                        onClick={() => setExpandedMobileMenu(isExpanded ? null : item.path)}
                      >
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Sub-menu for products (Text Only) */}
                    <div className={`bg-gray-50 flex flex-col overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0'}`}>
                      {categories.map(cat => (
                        <NavLink
                          key={cat.id}
                          to={`/products/category/${cat.name}/${cat.id}`}
                          className={({ isActive }) =>
                            `flex items-center gap-3 text-sm py-3 pl-10 pr-6 transition border-b border-gray-100 last:border-0
                             ${isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}
                            `
                          }
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-10 h-10 shrink-0">
                            {cat.image_url ? (
                              <img
                                src={cat.image_url}
                                alt={cat.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full rounded bg-gray-100" />
                            )}
                          </div>
                          <span>{cat.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-base font-medium py-4 px-6 border-b border-gray-100 last:border-0 transition hover:bg-gray-50
                     ${isActive ? 'text-primary font-semibold' : 'text-dark hover:text-primary'}
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
      )}
    </header>
  )
}

export default MissCandleHeader
