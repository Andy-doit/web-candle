import { FunctionComponent } from "react";
// import { Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { IProductBase } from "../types";

type TMissCandleProductCard = { product: IProductBase };

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const MissCandleProductCard: FunctionComponent<TMissCandleProductCard> = ({
  product,
}) => {
  const { categoryId, name } = useParams<{ categoryId: string; name: string }>();

  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;
  const categories = product.categories && product.categories.length > 0 ? product.categories.map((c) => c.name).join(", ") : "Danh mục";
  const priceDisplay = typeof product.price === "number" ? currencyFormatter.format(product.price) : product.price || "—";
  const categoryName = name || product.categories?.[0]?.name || "default";
  const categoryID = categoryId || product.categories?.[0]?.id || "default";

  return (
    <div className="bg-white rounded-lg p-3 md:p-4 group hover:shadow-lg hover:border-primary/20 border border-gray-100 transition-all duration-300 ease-out hover:-translate-y-1 h-full flex flex-col will-change-transform">
      <div className="relative overflow-hidden rounded-md mb-3 md:mb-4 aspect-square bg-gray-50 border border-gray-50">
        <Link to={`/products/category/${categoryName}/${categoryID}/detail/${product.id}`} className="block w-full h-full">
          {product.note1 && (
            <span className="absolute top-2 left-2 z-10 bg-primary text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-sm shadow-sm tracking-wide">
              {product.note1}
            </span>
          )}

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name || "product"}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <span className="text-xs">No image</span>
            </div>
          )}
        </Link>
      </div>

      {/* --- CONTENT --- */}
      <div className="flex flex-col flex-1">
        <p className="text-[10px] md:text-xs text-gray-400 tracking-wider uppercase font-medium mb-1 line-clamp-1">
          {categories}
        </p>

        <h3 className="font-semibold text-gray-800 text-sm md:text-base hover:text-primary transition-colors line-clamp-2 min-h-[40px] md:min-h-[48px]">
          <Link to={`/products/category/${categoryName}/${categoryID}/detail/${product.id}`}>
            {product.name || "Untitled"}
          </Link>
        </h3>

        {/* Price (Đẩy xuống đáy nếu card có chiều cao không đều) */}
        <div className="flex flex-wrap items-end gap-2 mt-auto pt-2">
          <span className="font-bold text-primary text-base md:text-lg">{priceDisplay}</span>
        </div>
      </div>
    </div>
  );
};

export default MissCandleProductCard;
