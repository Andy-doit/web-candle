import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

type TMissCandleSpecialCollectionProps = {
  product: {
    id: number;
    name: string;
    description: string;
    image: string;
    restock: number;
    note1: string | null;
  };
}

const MissCandleSpecialCollection: FunctionComponent<TMissCandleSpecialCollectionProps> = ({product}) => {
  if (!product) {
    return null;
  }

  return (
    <div className="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] active:shadow-lg transition-all duration-700 w-full h-full touch-manipulation">
      <img
        src={product.image}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.15]"
      />

      {/* Premium overlay với layout cân chỉnh đều trên card */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/25 group-hover:from-black/65 group-hover:via-black/40 group-hover:to-black/10 group-active:from-black/75 group-active:via-black/50 group-active:to-black/20 transition-all duration-700 flex h-full flex-col justify-between p-6 sm:p-7 md:p-8 lg:p-10">
        <div className="space-y-2 sm:space-y-3 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-700">
          <p className="text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.32em] uppercase text-[#E9E3DD]/80 font-medium">
            {`${product.restock} SẢN PHẨM`}
          </p>
          <h3 className="font-semibold text-[#E9E3DD] text-xl sm:text-2xl md:text-3xl leading-tight">
            {product.name}
          </h3>
          <p className="text-[#E9E3DD]/90 text-sm sm:text-base font-extralight leading-relaxed max-w-xs">
            {product.note1}
          </p>
        </div>

        <div className="mt-4 sm:mt-6 flex items-center justify-between">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#E9E3DD]/35 to-transparent mr-4 sm:mr-6 opacity-80" />
          <Link to={`/products/category/${product.name}/${product.id}`} className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer border-white/40 bg-white/10 text-[#E9E3DD] hover:bg-white/20 hover:text-[#2E251F] rounded-full px-5 sm:px-6 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
            >
              <span>Khám phá</span>
              <span className="text-base sm:text-lg translate-y-[1px]">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MissCandleSpecialCollection;
