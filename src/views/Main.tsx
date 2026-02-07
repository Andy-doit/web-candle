import {Route, Routes} from "react-router-dom";
import {MainLayout} from "../layouts";
import {HomePage, ProductDetailPage, ProductsPage} from "../pages/clients";
import { ProductsByCategoryPage } from "../pages/clients/products/ProductsByCategoryPage";

export default function Main() {
    return (
      <Routes>
          {/* Nhóm các trang có Header/Footer chung */}
          <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/category/:name/:categoryId" element={<ProductsByCategoryPage />} />
              <Route path="/products/category/:name/:categoryId/detail/:id" element={<ProductDetailPage />} />
              {/*<Route path="/contact" element={<Contact />} />*/}
          </Route>
      </Routes>
    )
}
