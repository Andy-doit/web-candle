import ReligiousCandleSection from "./ReligiousCandleSection.tsx";
import { Helmet } from "react-helmet-async";
// import CollectionSpecialSection from "./CollectionSpecialSection.tsx";
import CollectionSpecialSection from "./CollectionSpecialSection.tsx";
import HeroSection from "./HeroSection.tsx";
import ReviewSection from "./ReviewSection.tsx";
import StorySection from "./StorySection.tsx";
import BestSellerSection from "./BestSellerSection.tsx";
import PostSection from "./PostSection.tsx";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>MissCandle - Nến Thơm Handmade Cao Cấp</title>
        <meta name="description" content="MissCandle - Nến thơm handmade cao cấp, nến thơm thư giãn, quà tặng ý nghĩa. Giao hàng toàn quốc." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MissCandle - Nến Thơm Handmade Cao Cấp" />
        <meta property="og:description" content="MissCandle - Nến thơm handmade cao cấp, nến thơm thư giãn, quà tặng ý nghĩa. Giao hàng toàn quốc." />
        <meta property="og:image" content="https://misscandle.com.vn/banner/openGraph.jpg" />
        <meta property="og:url" content="https://misscandle.com.vn" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MissCandle - Nến Thơm Handmade Cao Cấp" />
        <meta name="twitter:description" content="MissCandle - Nến thơm handmade cao cấp, nến thơm thư giãn, quà tặng ý nghĩa." />
        <meta name="twitter:image" content="https://misscandle.com.vn/banner/openGraph.jpg" />
      </Helmet>
      <HeroSection></HeroSection>
      <BestSellerSection></BestSellerSection>
      <ReligiousCandleSection></ReligiousCandleSection>
      <StorySection></StorySection>
      <PostSection></PostSection>
      <CollectionSpecialSection></CollectionSpecialSection>
      <ReviewSection></ReviewSection>
    </>
  )
}
