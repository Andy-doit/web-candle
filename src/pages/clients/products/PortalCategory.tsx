import { useEffect, useState } from "react";
import { ICategoryBase } from "../../../types";
import { CategoryApi } from "../../../apis";

export const PortalCategory = () => {
  const [categories, setCategories] = useState<ICategoryBase[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await CategoryApi.getAllCategories({});
        if (res?.data) {
          setCategories(res.data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 1 hàng 4 item */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Icon */}
              <div className="w-20 h-20 shrink-0">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded bg-gray-100" />
                )}
              </div>

              {/* Text */}
              <span className="text-sm font-medium text-gray-900">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
