import { FunctionComponent } from "react";
import {
  FaTiktok,
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { MdOutlinePlace } from "react-icons/md";
import { Link } from "react-router-dom";
import { CommonConstant } from "../constants/clients";

const footerLinks = [
  {
    title: "Hỗ trợ",
    links: [
      { label: "Chính sách bảo mật", path: "/page/privacy" },
      { label: "Chính sách đổi trả", path: "/page/exchange" },
      { label: "Chính sách vận chuyển & giao nhận", path: "/page/shipping" },
      { label: "Hướng dẫn mua hàng", path: "/page/guide" },
    ],
  },
  // {
  //   title: "Về MissCandle",
  //   links: [
  //     { label: "Câu Chuyện Thương Hiệu", path: "/about" },
  //     { label: "Quy Trình Thủ Công", path: "/process" },
  //     { label: "Blog Cảm Hứng", path: "/blog" },
  //     { label: "Tuyển Dụng", path: "/careers" },
  //   ],
  // },
];

const socialLinks = [
  {
    icon: <FaFacebook className="text-dark" />,
    href: CommonConstant.SOCIAL_LINKS.FACEBOOK,
    label: "Facebook",
  },
  {
    icon: <FaInstagram className="text-dark" />,
    href: CommonConstant.SOCIAL_LINKS.INSTAGRAM,
    label: "Instagram",
  },
  {
    icon: <FaTiktok className="text-dark" />,
    href: CommonConstant.SOCIAL_LINKS.TIKTOK,
    label: "Tiktok",
  },
];

const contactInfo = [
  {
    icon: <FaPhoneAlt className="text-dark w-3 h-3 md:w-4 md:h-4" />,
    text: CommonConstant.INFOMATION.PHONE,
  },
  {
    icon: <FaEnvelope className="text-dark w-3 h-3 md:w-4 md:h-4" />,
    text: CommonConstant.INFOMATION.EMAIL,
  },
  {
    icon: <MdOutlinePlace className="text-dark w-3 h-3 md:w-4 md:h-4" />,
    text: CommonConstant.INFOMATION.ADDRESS,
  },
];

const FANPAGE_LINK =
  "https://www.facebook.com/MissCandleQM?mibextid=wwXIfr&rdid=BzuPF8PPhytLrM6W&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DSWyjdQh9%2F%3Fmibextid%3DwwXIfr#";

const MissCandleFooter: FunctionComponent = () => {
  return (
    <footer className="bg-[#ede8e1] border-t border-[#e8dfd4] pt-12 pb-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center"
            >
              <img
                src="/logo_2.png"
                alt="Miss Candle Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 text-sm md:text-[15px] leading-7 text-[#3d3d3d] max-w-lg">
              Lan tỏa cảm xúc và sự bình yên với những dòng nến thơm thủ công
              cao cấp, được tạo nên từ nguyên liệu thiên nhiên an toàn và tinh
              tế.
            </p>

            <div className="mt-6 space-y-3">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-sm text-[#222]"
                >
                  <div className="mt-1 text-primary">{item.icon}</div>

                  <span className="leading-6">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="
                w-10 h-10
                rounded-full
                border border-[#d8c8b6]
                bg-white
                flex items-center justify-center
                text-[#222]
                hover:bg-primary
                hover:border-primary
                transition-all duration-300
              "
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-[#1f1f1f] font-semibold text-base mb-5">
                {section.title}
              </h4>

              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="
                    text-sm text-[#222]
                    hover:text-primary
                    transition-colors duration-300
                  "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Fanpage */}
          <div>
            <h4 className="text-[#1f1f1f] font-semibold text-base mb-5">
              Fanpage MissCandle
            </h4>

            <div className="bg-white rounded-2xl border border-[#eee] p-5 shadow-sm">
              <div className="flex gap-4">
                <a
                  href={FANPAGE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <img
                    src="/logo_2.png"
                    alt="MissCandle Fanpage"
                    className="w-16 h-16 rounded-xl object-cover border border-[#eee]"
                  />
                </a>

                <div className="min-w-0">
                  <a
                    href={FANPAGE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#222] hover:text-primary transition"
                  >
                    MissCandle
                  </a>

                  <p className="text-sm text-[#222] leading-6 mt-1">
                    Theo dõi fanpage để cập nhật ưu đãi, bộ sưu tập mới và cảm
                    hứng mỗi ngày.
                  </p>
                </div>
              </div>

              <a
                href={FANPAGE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="
              mt-5 w-full
              inline-flex items-center justify-center gap-2
              bg-primary
              text-dark
              rounded-xl
              px-4 py-3
              text-sm font-medium
              hover:opacity-90
              transition
            "
              >
                <FaFacebook />
                Theo dõi Fanpage
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#c8b9a8] mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#555]">
            <p>©2026 MissCandle. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MissCandleFooter;
