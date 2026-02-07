import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import {FunctionComponent} from "react";

// Hàm tiện ích để gộp class
function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

const variants = {
  primary: "bg-light hover:bg-light/70 text-dark shadow-lg px-8 py-3 rounded-[30px] shadow-brightenUp/20 border-transparent",
  outline: "bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white font-medium px-8 py-3 rounded-md sm:w-auto transition-all duration-300",
};

type TVariants = keyof typeof variants;

type TMissCandleButtonProps = {
  className?: string,
  disabled?: boolean,
  onClickButton: () => void,
  textDisplay: string,
  variant: TVariants,
}

const MissCandleButton: FunctionComponent<TMissCandleButtonProps> = ({className, disabled, onClickButton, textDisplay, variant = "primary"}) => {
  // ... logic variants như cũ
  return (
    <button
      // Dùng hàm cn để gộp class thông minh hơn
      className={cn(
        "inline-flex items-center justify-center cursor-pointer ...",
        variants[variant],
        className ? className : '',
      )}
      disabled={disabled}
      onClick={onClickButton}
    >
      {textDisplay}
    </button>
  );
}

export default MissCandleButton;


// <section className="bg-primary py-12 md:py-20">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
//       {/* Image - appears first on mobile due to order */}
//       <div className="relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl bg-secondary/30 order-first md:order-last">
//         <Image
//           src="/hero-candle.jpg"
//           alt="Lần Tòa - Nến thơm cao cấp với pampas grass"
//           fill
//           className="object-cover"
//           priority
//         />
//       </div>
//
//       {/* Left Content */}
//       <div className="space-y-6">
//         <div className="space-y-2">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground leading-tight">
//             Lần Tòa
//           </h1>
//           <h2 className="text-2xl sm:text-3xl md:text-4xl italic font-light text-primary-foreground">
//             Cảm Xúc Tinh Tế
//           </h2>
//           <p className="text-base sm:text-lg md:text-xl font-bold text-primary-foreground">
//             Tinh Tế
//           </p>
//         </div>
//
//         <p className="text-primary-foreground/90 text-xs sm:text-sm md:text-base leading-relaxed max-w-md">
//           Khám phá bộ sưu tập nến thơm cao cấp của chúng tôi, được tạo ra từ những nguyên liệu tự nhiên tinh tế nhất, mang lại không gian sống của bạn sự ấm áp và thanh lịch.
//         </p>
//
//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
//           <button className="px-6 sm:px-8 py-2 sm:py-3 bg-primary-foreground text-primary font-semibold rounded-full hover:shadow-lg transition duration-300 text-sm sm:text-base">
//             Khám phá sản phẩm
//           </button>
//           <button className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-primary-foreground text-primary-foreground font-semibold rounded-full hover:bg-primary-foreground hover:text-primary transition duration-300 text-sm sm:text-base">
//             Tìm hiểu thêm
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>
