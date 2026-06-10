import { Trash2, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useCartStore } from "../../../store/cartStore";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { CheckoutDialog } from "../../../components/CheckoutDialog";
import { User, Phone, Mail } from "lucide-react";

export const CartPage = () => {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    items.map((i) => i.cartItemId)
  );
  const selectedItems = items.filter((i) =>
    selectedIds.includes(i.cartItemId)
  );
  const totalItems = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  // Customer info state
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });
  // Shipping fee (demo: 0)
  const [shippingFee] = useState(0);

  // Handle chọn/bỏ chọn 1 sản phẩm
  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Chọn/bỏ chọn tất cả
  const handleSelectAll = () => {
    if (selectedIds.length === items.length) setSelectedIds([]);
    else setSelectedIds(items.map((i) => i.cartItemId));
  };

  // Handle open dialog
  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return; // Không cho đặt nếu không chọn gì
    if (validateForm()) {
      setOpenDialog(true);
    }
  };

  // Handle change input
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {
      name: "",
      phone: "",
    };

    if (!customerInfo.name.trim()) {
      newErrors.name = "Vui lòng nhập tên người nhận";
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0|\+84)[0-9]{9}$/.test(customerInfo.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);

    return !newErrors.name && !newErrors.phone;
  };

  // Handle submit order (demo)
  const handleSubmitOrder = async () => {
    console.log("ORDER DATA", {
      customerInfo,
      items: selectedItems,
      totalPrice,
    });

    // Clear chỉ các sản phẩm đã thanh toán khỏi giỏ
    if (selectedIds.length > 0) {
      selectedIds.forEach((id) => removeItem(id));
    }
    setSelectedIds([]);
    setCustomerInfo({ name: "", phone: "", email: "", note: "" });
    setErrors({ name: "", phone: "" });
  };

  return (
    <section className="bg-light min-h-screen">
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
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-[0.2em] uppercase mb-4 [text-shadow:0_4px_20px_rgb(0_0_0/80%)]">
            Giỏ hàng
          </h1>
          <div className="w-24 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart
                size={40}
                className="text-gray-400"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark mb-2">
                Giỏ hàng đang trống
              </h2>
              <p className="text-gray-500">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.
              </p>
            </div>
            <Link
              to="/products"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: Cart Table */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm p-6">
              {/* Mobile Select Header */}
              <div className="flex items-center justify-between mb-4 md:hidden">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === items.length && items.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4"
                  />
                  Chọn tất cả
                </label>
                <span className="text-sm text-gray-500">
                  {selectedItems.length}/{items.length} đã chọn
                </span>
              </div>
              <div className="hidden md:grid grid-cols-12 gap-4 items-center pb-4 border-b font-semibold text-sm text-gray-600">
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === items.length && items.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </div>
                <div className="col-span-2">Hình ảnh</div>
                <div className="col-span-3">Tên sản phẩm</div>
                <div className="col-span-2">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>
              {/* Items */}
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  {/* Mobile view */}
                  <div className="md:hidden py-4 border-b last:border-b-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.cartItemId)}
                          onChange={() => handleSelect(item.cartItemId)}
                          className="mt-1 h-4 w-4"
                        />
                        <img
                          src={item.images?.[0] || "/product-detail.png"}
                          alt={item.name}
                          className="w-20 h-20 object-contain rounded-lg bg-gray-50"
                        />
                        <div className="min-w-0">
                          {/* <Link
                            to={`/products/detail/${item.id}`}
                            className="block font-medium text-base text-gray-900 hover:text-primary transition line-clamp-2"
                          > */}
                            {item.name}
                          {/* </Link> */}
                          {item.variant && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.variant.name}
                            </p>
                          )}
                          <p className="mt-1 text-sm text-gray-600">
                            {item.price.toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="p-2 cursor-pointer rounded-full bg-red-50 hover:bg-red-100 transition"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2
                          size={16}
                          className="text-red-500"
                        />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-40">
                        <span className="text-sm text-gray-500">Số lượng</span>
                        <div className="flex border rounded-lg overflow-hidden h-9">
                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity - 1)
                            }
                            className="px-2 cursor-pointer hover:bg-gray-100 transition"
                          >
                            −
                          </button>
                          <div className="px-3 flex items-center justify-center min-w-10 bg-white text-sm">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity + 1)
                            }
                            className="px-2 cursor-pointer hover:bg-gray-100 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end min-w-40">
                        <div className="text-xs text-gray-500">Thành tiền</div>
                        <div className="text-red-500 font-semibold">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}{" "}
                          đ
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop/table view */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center py-6 border-b last:border-b-0">
                    <div className="md:col-span-1 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.cartItemId)}
                        onChange={() => handleSelect(item.cartItemId)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <img
                        src={item.images?.[0] || "/product-detail.png"}
                        alt={item.name}
                        className="w-20 h-20 object-contain rounded-lg bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-3 font-medium">
                      {/* <Link
                        to={`/products/detail/${item.id}`}
                        className="hover:text-primary transition"
                      > */}
                        {item.name}
                      {/* </Link> */}
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.variant.name}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 text-gray-700">
                      <p>{item.price.toLocaleString("vi-VN")} đ</p>
                    </div>

                    <div className="md:col-span-2 flex justify-center">
                      <div className="flex border rounded-lg overflow-hidden h-9">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="px-2 cursor-pointer hover:bg-gray-100 transition"
                        >
                          −
                        </button>
                        <div className="px-3 flex items-center justify-center min-w-10 bg-white text-sm">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="px-2 cursor-pointer hover:bg-gray-100 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-3">
                      <span className="text-red-500 font-semibold whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                      </span>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="p-2 cursor-pointer rounded-full bg-red-50 hover:bg-red-100 transition"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2
                          size={16}
                          className="text-red-500"
                        />
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* RIGHT: Summary + Form */}
            <div className="lg:col-span-4">
              <form
                className="bg-white rounded-2xl shadow-sm p-6 sticky top-28"
                onSubmit={handleOrder}
                autoComplete="off"
              >
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  🛒 Thông tin đặt hàng
                </h3>
                <div className="space-y-4 text-sm">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên người nhận <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          name="name"
                          placeholder="Tên người nhận"
                          value={customerInfo.name}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3
                          placeholder:text-gray-400
                          focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                          transition"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <Phone
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          name="phone"
                          placeholder="Số điện thoại"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3
                          placeholder:text-gray-400
                          focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                          transition"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3
                        placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                        transition"
                      />
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>

                    <textarea
                      name="note"
                      placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
                      value={customerInfo.note}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3
                      placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                      transition min-h-32 resize-none"
                    />
                  </div>
                </div>
                <div className="space-y-4 text-sm text-gray-700 mt-6">
                  <div className="flex justify-between">
                    <span>Số lượng sản phẩm</span>
                    <span className="font-medium">{totalItems} sản phẩm</span>
                  </div>
                  <div className="bg-[#FFF6EC] rounded-xl p-4 flex justify-between items-center">
                    <span className="font-semibold">Tổng thanh toán</span>
                    <span className="text-2xl font-bold text-black">
                      {totalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition cursor-pointer"
                >
                  Đặt Hàng →
                </button>
                <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
                  <span>🔒 Bảo mật</span>
                  <span>✔ Cam kết chất lượng</span>
                </div>
              </form>
            </div>
          </div>
        )}

        <CheckoutDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          customerInfo={customerInfo}
          total={totalPrice}
          shippingFee={shippingFee}
          onSubmit={handleSubmitOrder}
        />
      </div>
    </section>
  );
};
