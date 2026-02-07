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
    <div className="bg-white/50 rounded-xl p-3 md:p-4 group hover:shadow-xl transition-[transform,shadow] duration-600 ease-out hover:-translate-y-1 h-full flex flex-col will-change-transform">
      <div className="relative overflow-hidden rounded-lg mb-3 md:mb-4 aspect-square bg-itemCard">
        <Link to={`/products/category/${categoryName}/${categoryID}/detail/${product.id}`} className="block w-full h-full">
          {product.note1 && (
            <span className="absolute top-2 left-2 md:top-3 md:left-3 z-10 bg-textHover text-white text-[9px] md:text-xs font-bold px-2 py-1 rounded shadow-sm">
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
        <p className="text-[10px] md:text-xs text-dark tracking-wider uppercase font-medium">
          {categories}
        </p>

        <h3 className="font-medium text-brightenUp/90 mt-1 text-sm md:text-base hover:text-primary transition-colors line-clamp-1">
          {product.name || "Untitled"}
        </h3>

        {/* Price (Đẩy xuống đáy nếu card có chiều cao không đều) */}
        <div className="flex flex-wrap items-end gap-2 mt-auto pt-2 md:pt-3">
          <span className="font-bold text-dark text-sm md:text-base">{priceDisplay}</span>
        </div>
      </div>
    </div>
  );
};

export default MissCandleProductCard;
