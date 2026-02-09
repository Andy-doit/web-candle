import { Trash2 } from "lucide-react";
import { motion } from "motion/react";

export const CartPage = () => {
  return (
    <section className="bg-light">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-60 md:h-70 lg:h-80 overflow-hidden shrink-0"
      >
        {/* Darker Overlay for Contrast */}
        <div className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-700 hover:bg-black/30" />

        <img
          src="/banner/cart.png"
          alt="banner"
          className="w-full h-full object-cover object-center scale-105"
        />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-[0.2em] uppercase mb-4 [text-shadow:_0_4px_20px_rgb(0_0_0_/_80%)]">
            Giỏ hàng
          </h1>
          <div className="w-24 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Cart Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm p-6">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 border-b pb-4">
              <div className="col-span-1">
                <input type="checkbox" />
              </div>
              <div className="col-span-2">Hình ảnh</div>
              <div className="col-span-3">Tên sản phẩm</div>
              <div className="col-span-2">Đơn giá</div>
              <div className="col-span-1 text-center">Giảm (%)</div>
              <div className="col-span-1 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            {/* Item */}
            {[
              {
                id: 1,
                name: "Nến thường",
                price: 16000,
                image: "/products/candle.png",
              },
              {
                id: 2,
                name: "Olong Tea - 220gr",
                price: 250000,
                oldPrice: 300000,
                discount: "-17%",
                image: "/products/olong.png",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b last:border-b-0"
              >
                <div className="md:col-span-1">
                  <input type="checkbox" />
                </div>

                <div className="md:col-span-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-lg bg-gray-50"
                  />
                </div>

                <div className="md:col-span-3 font-medium">{item.name}</div>

                <div className="md:col-span-2 text-gray-700">
                  {item.oldPrice && (
                    <p className="text-sm line-through text-gray-400">
                      {item.oldPrice.toLocaleString()} đ
                    </p>
                  )}
                  <p>{item.price.toLocaleString()} đ</p>
                </div>

                <div className="md:col-span-1 text-center">
                  {item.discount ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-500">
                      {item.discount}
                    </span>
                  ) : (
                    "-"
                  )}
                </div>

                <div className="md:col-span-1 flex justify-center">
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="w-16 text-center border rounded-lg px-2 py-1"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-end gap-3">
                  <span className="text-red-500 font-semibold">
                    {item.price.toLocaleString()} đ
                  </span>
                  <button className="p-2 rounded-full bg-red-50 hover:bg-red-100">
                    <Trash2
                      size={16}
                      className="text-red-500"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 top-28">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                🛒 Tổng Tiền Tạm Tính
              </h3>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Số lượng sản phẩm</span>
                  <span className="font-medium">2 sản phẩm</span>
                </div>

                <div className="bg-[#FFF6EC] rounded-xl p-4 flex justify-between items-center">
                  <span className="font-semibold">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-black">
                    266,000 đ
                  </span>
                </div>
              </div>

              <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition">
                Thanh Toán →
              </button>

              <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
                <span>🔒 Bảo mật</span>
                <span>✔ Cam kết chất lượng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
