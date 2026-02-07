import {Outlet} from 'react-router-dom';
import { SiZalo } from "react-icons/si";
import { FaPhone } from "react-icons/fa";
import {MissCandleFooter, MissCandleHeader} from "../components";
import {CommonConstant} from "../constants/clients";

const MainLayout = () => {
  return (
    <div>
      <MissCandleHeader></MissCandleHeader>

      {/* Outlet là nơi nội dung con sẽ được render vào đây */}
      <main className="min-h-screen">
        <Outlet />
      </main>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-center">
        <a
          href={`https://zalo.me/${CommonConstant.ZALO_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
          title="Chat Zalo"
        >
          <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
            Chat Zalo
          </span>
          <SiZalo className="w-6 h-6 text-white"/>
        </a>

        <a
          href={`tel:${CommonConstant.INFOMATION.PHONE}`}
          className="group relative flex items-center justify-center w-12 h-12 bg-primary rounded-full shadow-lg  transition-colors duration-300"
          title="Gọi ngay"
        >
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-pulse"></span>

          {/* Tooltip text */}
          <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
          Gọi ngay: {CommonConstant.INFOMATION.PHONE}
        </span>
          <FaPhone className="w-6 h-6 text-light animate-ring"/>
        </a>

      </div>

      <MissCandleFooter></MissCandleFooter>
    </div>
  );
};

export default MainLayout;
