import { FunctionComponent, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { IProductBase } from "../types";
import { useCartStore } from "../store/cartStore";
import { Toast } from "./index";

type TMissCandleProductCard = { product: IProductBase };

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const MissCandleProductCard: FunctionComponent<TMissCandleProductCard> = ({
  product,
}) => {
  const { categoryId, name } = useParams<{
    categoryId: string;
    name: string;
  }>();

  const { addItem } = useCartStore();
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type?: "success" | "error" | "info" }>
  >([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      // Keep max 4 notifications shown at once.
      return next.length > 4 ? next.slice(next.length - 4) : next;
    });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const imageUrl =
  product.variants?.[0]?.images?.[0] ||
  product.images?.[0] ||
  null;
  // const categories =
  //   product.categories && product.categories.length > 0
  //     ? product.categories.map((c) => c.name).join(", ")
  //     : "Danh mục";
  const priceDisplay =
    typeof product.price === "number"
      ? currencyFormatter.format(product.price)
      : product.price || "—";
  const categoryName = name || product.categories?.[0]?.name || "default";
  const categoryID = categoryId || product.categories?.[0]?.id || "default";

  const handleAddToCart = () => {
    const firstVariant = product.variants?.[0];

    addItem(
      {
        ...product,
        images: firstVariant?.images?.length
          ? firstVariant.images
          : product.images,
      },
      1,
      firstVariant
        ? {
            id: firstVariant.id,
            name: firstVariant.name,
          }
        : undefined
    );

    addToast("Đã thêm sản phẩm vào giỏ hàng", "success");
  };

  return (
    <>
    <div className="bg-white rounded-lg p-3 md:p-4 group hover:shadow-lg hover:border-primary/20 border border-gray-100 transition-all duration-300 ease-out hover:-translate-y-1 h-full flex flex-col will-change-transform">
      <div className="relative overflow-hidden rounded-md mb-3 md:mb-4 aspect-square bg-gray-50 border border-gray-50">
        <Link
          to={`/products/category/${categoryName}/${categoryID}/detail/${product.id}`}
          className="block w-full h-full"
        >
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
      <div className="flex flex-col flex-1 text-center">
        <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">
          {product.name || "Untitled"}
        </h3>
        <span className="font-bold text-primary text-base md:text-lg mb-3">
          {priceDisplay}
        </span>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleAddToCart}
        className="mt-auto bg-primary text-white text-xs md:text-sm px-3 md:px-4 py-2 rounded-md hover:bg-primary/90 transition cursor-pointer flex items-center justify-center gap-2 w-full"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Thêm vào Giỏ</span>
      </button>
      {/* Toast notifications (one per click) */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          open={true}
          onClose={() => removeToast(toast.id)}
          message={toast.message}
          type={toast.type}
        />
      ))}
    </div>
    </>
  );
};

export default MissCandleProductCard;
