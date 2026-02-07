import { useParams } from 'react-router-dom';
import DetailSection from "./DetailSection.tsx";
// import ProductsRelatedSection from "./ProductsRelatedSection.tsx";

export default function ProductDetailPage() {
  const { id } = useParams();

  return (
    <>
      <DetailSection productId={id} />
      {/* <ProductsRelatedSection />   */}
      {/* <ProductsRelatedSection currentProductId={id} /> */}
    </>
  );
}
