import { FunctionComponent } from "react";
import { FaTiktok, FaFacebook, FaInstagram, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { MdOutlinePlace } from "react-icons/md";
import { Link } from "react-router-dom";
import { CommonConstant } from "../constants/clients";

const footerLinks = [
  {
    title: "Sản Phẩm",
    links: [
      { label: "Nến Thơm Cao Cấp", path: "/products/candles" },
      { label: "Bộ Sưu Tập Mùa Hè", path: "/collections/summer" },
      { label: "Nến Thư Giãn (Yoga)", path: "/collections/yoga" },
      { label: "Set Quà Tặng", path: "/gifts" },
    ],
  },
  {
    title: "Về MissCandle",
    links: [
      { label: "Câu Chuyện Thương Hiệu", path: "/about" },
      { label: "Quy Trình Thủ Công", path: "/process" },
      { label: "Blog Cảm Hứng", path: "/blog" },
      { label: "Tuyển Dụng", path: "/careers" },
    ],
  },
];

const socialLinks = [
  { icon: <FaFacebook className="text-dark" />, href: CommonConstant.SOCIAL_LINKS.FACEBOOK, label: "Facebook" },
  { icon: <FaInstagram className="text-dark" />, href: CommonConstant.SOCIAL_LINKS.INSTAGRAM, label: "Instagram" },
  { icon: <FaTiktok className="text-dark" />, href: CommonConstant.SOCIAL_LINKS.TIKTOK, label: "Tiktok" },
];

const contactInfo = [
  { icon: <FaPhoneAlt className="text-dark w-3 h-3 md:w-4 md:h-4" />, text: CommonConstant.INFOMATION.PHONE },
  { icon: <FaEnvelope className="text-dark w-3 h-3 md:w-4 md:h-4" />, text: CommonConstant.INFOMATION.EMAIL },
  { icon: <MdOutlinePlace className="text-dark w-3 h-3 md:w-4 md:h-4" />, text: CommonConstant.INFOMATION.ADDRESS },
];

const FANPAGE_LINK =
  "https://www.facebook.com/MissCandleQM?mibextid=wwXIfr&rdid=BzuPF8PPhytLrM6W&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DSWyjdQh9%2F%3Fmibextid%3DwwXIfr#";

const MissCandleFooter: FunctionComponent = () => {
  return (
    <footer className="bg-header-footer py-8 md:py-10 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center">
              <img
                src="/logo_2.png"
                alt="Miss Candle Logo"
                className="h-15 w-auto object-contain my-3"
              />
            </Link>

            <p className="text-textHeader text-xs md:text-sm leading-relaxed max-w-xs">
              Lan tỏa cảm xúc, hạnh phúc mỗi ngày với những sản phẩm nến thơm cao cấp được làm thủ công từ nguyên liệu
              tự nhiên.
            </p>

            <div className="mt-4 md:mt-6 space-y-2 text-textHeader text-xs md:text-sm">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4 md:mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary flex items-center justify-center text-dark/60 hover:text-dark hover:border-white/40 transition"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-dark font-medium mb-3 md:mb-4 text-sm md:text-base">
                {section.title}
              </h4>
              <ul className="space-y-2 md:space-y-3 text-dark text-xs md:text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.path} className="hover:text-primary transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-dark font-medium mb-3 md:mb-4 text-sm md:text-base">
              Fanpage MissCandle
            </h4>

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <a
                  href={FANPAGE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <img
                    src="/logo_2.png"
                    alt="MissCandle Fanpage"
                    className="w-14 h-14 rounded-md object-cover border border-line"
                  />
                </a>

                <div className="min-w-0 flex-1">
                  <a
                    href={FANPAGE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base font-semibold text-dark hover:text-primary transition line-clamp-2"
                  >
                    MissCandle
                  </a>

                  <p className="text-xs md:text-sm text-dark/70 mt-1">
                    Theo dõi fanpage để cập nhật sản phẩm mới, ưu đãi và cảm hứng mỗi ngày.
                  </p>
                </div>
              </div>

              <a
                href={FANPAGE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs md:text-sm font-medium text-dark hover:opacity-90 transition"
              >
                <FaFacebook className="text-dark" />
                Theo dõi Fanpage
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-line mt-6 md:mt-8 pt-6 md:pt-8 flex justify-center items-center text-dark text-xs md:text-sm">
          <p>©2026 MissCandle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default MissCandleFooter;
