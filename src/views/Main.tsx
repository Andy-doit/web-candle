import { Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts";
import { BlogDetailPage, BlogListPage, HomePage, ProductDetailPage, ProductsPage } from "../pages/clients";
import { CartPage } from "../pages/clients/cart/CartPage";
import PageDetail from "../pages/clients/detailPages/detailPages";


export default function Main() {
    return (
        <Routes>
            {/* Nhóm các trang có Header/Footer chung */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/products/category/:name/:categoryId" element={<ProductsPage />} />
                <Route path="/products/category/:name/:categoryId/detail/:id" element={<ProductDetailPage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />
                <Route path="/page/:slug" element={<PageDetail />} />
                {/*<Route path="/contact" element={<Contact />} />*/}
            </Route>
        </Routes>
    )
}
