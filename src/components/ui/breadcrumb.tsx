import React from "react";
import { Link } from "react-router-dom";
import { CommonUtils } from "../../utils";

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Additional class for the wrapper */
  className?: string;
  /** Separator between items (defaults to "/") */
  separator?: React.ReactNode;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  separator = "/",
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={CommonUtils.cn("mb-8", className)}
    >
      <ol className="inline-flex items-center space-x-2 text-md text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              {item.link && !isLast ? (
                <Link
                  to={item.link}
                  className="text-gray-700 hover:text-primary transition"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={CommonUtils.cn(
                    isLast ? "font-semibold text-gray-900" : "",
                  )}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="mx-2 text-gray-400">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

