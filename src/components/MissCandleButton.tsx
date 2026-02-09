import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { FunctionComponent, ReactNode } from "react";

// Hàm tiện ích để gộp class
function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

const variants = {
  primary: "bg-light hover:bg-light/70 text-dark shadow-lg px-8 py-3 rounded-md shadow-brightenUp/20 border-transparent",
  outline: "bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white font-medium px-8 py-3 rounded-md sm:w-auto transition-all duration-300",
};

type TVariants = keyof typeof variants;

type TMissCandleButtonProps = {
  className?: string,
  disabled?: boolean,
  onClickButton?: () => void,
  textDisplay?: ReactNode,
  variant?: TVariants,
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