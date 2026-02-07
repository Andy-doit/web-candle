import {FunctionComponent, useEffect, useState} from "react"
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import { CategoryApi } from "../apis";
import { ICategoryBase } from "../types";

const MENU_ITEMS : { label: string, path: string }[] = [
  { label: "Trang chủ", path: "/" },
  { label: "Sản phẩm", path: "/products" },
  { label: "Về chúng tôi", path: "/about-us"},
  { label: "Chính sách sỉ", path: "/wholesales" },
  { label: "Liên hệ", path: "/contact" },
];

const MissCandleHeader: FunctionComponent<unknown> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<ICategoryBase[]>([]);
  
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
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo_2.png" // Đường dẫn ảnh trong thư mục public
            alt="Miss Candle Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
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
                      transition-all duration-200
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
        {/* Icons */}
        <div className="flex items-center gap-3">
          <button className="text-dark hover:text-primary transition relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-dark">
              0
            </span>
          </button>
          {/* Mobile Menu Button */}
          <button
            className="text-textHeader hover:text-white transition md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/50 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col py-4">
            {MENU_ITEMS.map(item => (
              <Link
                to={`${item.path}`}
                className="text-dark text-sm py-3 px-4 hover:bg-black/5 hover:text-primary transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default MissCandleHeader
