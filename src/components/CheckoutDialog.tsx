import React, { useEffect, useMemo, useState } from "react";
import { EmailApi } from "../apis/email.api";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    note?: string;
  };
  total: number;
  shippingFee: number;
  onSubmit: () => Promise<void> | void;
}

import { useCartStore } from "../store/cartStore";
const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onClose,
  customerInfo,
  total,
  shippingFee,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  const { executeRecaptcha } = useGoogleReCaptcha();
  const [error, setError] = useState<string | null>(null);

  // Đổi orderId thành useMemo
  const orderId = useMemo(
    () => `ORD-${Math.floor(Math.random() * 999999)}`,
    []
  );
  // ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // ← reset lỗi cũ

    try {
      if (!executeRecaptcha) {
        setError("Recaptcha chưa sẵn sàng, vui lòng thử lại.");
        setLoading(false);
        return;
      }
      const captchaToken = await executeRecaptcha("create_order");

      const productRows = items
        .map(
          (item, idx) =>
            `<tr>
            <td style='border:1px solid #ccc;padding:4px 8px;'>${idx + 1}</td>
            <td style='border:1px solid #ccc;padding:4px 8px;'>${escapeHtml(item.name)}</td>
            <td style='border:1px solid #ccc;padding:4px 8px;'>${escapeHtml(item.name)}${item.variant ? `<br/><span style='color:#C26A3D;font-size:12px;'>${escapeHtml(item.variant.name)}</span>` : ''}</td>

            <td style='border:1px solid #ccc;padding:4px 8px;'>${escapeHtml(item.sku)}</td>
            <td style='border:1px solid #ccc;padding:4px 8px;'>${item.quantity}</td>
            <td style='border:1px solid #ccc;padding:4px 8px;'>${item.price.toLocaleString("vi-VN")} đ</td>
          </tr>`,
        )
        .join("");

      await EmailApi.sendEmail({
        to: import.meta.env.VITE_EMAIL_RECEIVED,
        subject: "Đơn hàng mới từ Misscandle",
        text: "Hello from NodeJS",
        html: `
          <div>
            <h2>Thông tin đặt hàng</h2>
            <ul>
              <li><b>Tên:</b> ${escapeHtml(customerInfo.name)}</li>
              <li><b>Số điện thoại:</b> ${escapeHtml(customerInfo.phone)}</li>
              <li><b>Email:</b> ${escapeHtml(customerInfo.email)}</li>
              <li><b>Ghi chú:</b> ${escapeHtml(customerInfo.note || "-")}</li>
            </ul>
            <h3>Danh sách sản phẩm</h3>
            <table style='border-collapse:collapse;'>
              <thead>
                <tr>
                  <th style='border:1px solid #ccc;padding:4px 8px;'>#</th>
                  <th style='border:1px solid #ccc;padding:4px 8px;'>Tên sản phẩm</th>
                  <th style='border:1px solid #ccc;padding:4px 8px;'>SKU</th>
                  <th style='border:1px solid #ccc;padding:4px 8px;'>Số lượng</th>
                  <th style='border:1px solid #ccc;padding:4px 8px;'>Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                ${productRows}
              </tbody>
            </table>
            <div style="margin-top:16px;font-size:16px;font-weight:bold;color:#d97706;">
              Tổng tiền: ${(total + shippingFee).toLocaleString("vi-VN")} đ
            </div>
          </div>
        `,
        captchaToken,
      });

    } catch (e) {
      console.error("Send email error", e);
      setError("Đặt hàng thất bại, vui lòng thử lại."); // ← báo user
      setLoading(false);
      return; // ← không chạy tiếp xuống success
    }

    setLoading(false);
    setSuccess(true);
    clearCart();
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      await onSubmit();
      clearCart();
      navigate("/products");
      onClose();
    } catch (e) {
      console.error("Order completion error", e);
    } finally {
      setLoading(false);
    }
  };

  const closeHandler = async () => {
    if (success) {
      clearCart();
      await onSubmit();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeHandler}
        >
          <motion.div
            className={
              success
                ? "bg-transparent shadow-none w-full max-w-md p-0 relative"
                : "bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative flex flex-col md:flex-row"
            }
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={closeHandler}
            >
              ×
            </button>

            {/* LEFT */}
            {!success && (
              <div className="flex-1 pr-0 md:pr-8 border-r border-gray-100 mb-6 md:mb-0">
                <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🧾 Đặt Hàng
                </h2>

                <div className="text-xs text-gray-500 mb-4">{orderId}</div>

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold mb-1">Tên người nhận</div>
                    <div className="flex gap-2">
                      <span>{customerInfo.name}</span>
                      <span className="text-gray-400">|</span>
                      <span>{customerInfo.phone}</span>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <span>{customerInfo.email}</span>
                  </div>

                  <div>
                    <div className="font-semibold mb-1">Ghi chú</div>
                    <span>{customerInfo.note || "-"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* RIGHT */}
            <div className="flex-1 pl-0 md:pl-8">
              {!success ? (
                <>
                  <div className="bg-gray-50 rounded-xl p-6 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tiền hàng</span>
                      <span>{total.toLocaleString("vi-VN")} đ</span>
                    </div>

                    <div className="flex justify-between text-sm mb-2">
                      <span>Phí ship</span>
                      <span>
                        {shippingFee === 0
                          ? "0 đ"
                          : shippingFee.toLocaleString("vi-VN") + " đ"}
                      </span>
                    </div>

                    <div className="flex justify-between text-lg font-bold text-orange-600 mt-4">
                      <span>Tổng tiền</span>
                      <span>
                        {(total + shippingFee).toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-xl p-4 mb-4 text-xs text-gray-700 flex gap-2">
                    📝 Nhân viên sale sẽ liên hệ với bạn trong thời gian sớm
                    nhất.
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm text-center mb-2">{error}</div>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full font-semibold py-3 rounded-xl transition cursor-pointer text-lg ${
                      loading
                        ? "bg-gray-400"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {loading ? "Đang xử lý..." : "Đặt Hàng"}
                  </button>

                  <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
                    <span>SSL Secure</span>
                    <span>100% Safe</span>
                  </div>
                </>
              ) : (
                <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Header */}
                  <div className="relative bg-gradient-to-r from-yellow-400 to-orange-400 h-24">
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border-4 border-orange-500 flex items-center justify-center">
                      <img
                        src="/logo_2.png"
                        alt="Miss Candle"
                        className="h-12 object-contain"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-14 pb-6 px-6 text-center">
                    <h3 className="text-2xl font-bold text-orange-500 mb-2">
                      Thanh Toán Thành Công
                    </h3>

                    <p className="text-sm text-orange-900/70 mb-4">
                      Cảm ơn bạn đã mua hàng của chúng tôi! Đơn hàng của bạn đã
                      được tiếp nhận và bộ phận bán hàng sẽ liên hệ sớm.
                    </p>

                    <button
                      onClick={handleContinue}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
