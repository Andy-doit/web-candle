import ReligiousCandleSection from "./ReligiousCandleSection.tsx";
// import CollectionSpecialSection from "./CollectionSpecialSection.tsx";
import CollectionSpecialSection from "./CollectionSpecialSection.tsx";
import HeroSection from "./HeroSection.tsx";
import ReviewSection from "./ReviewSection.tsx";
import StorySection from "./StorySection.tsx";
import BestSellerSection from "./BestSellerSection.tsx";

export default function HomePage() {
  return (
    <>
      <HeroSection></HeroSection>
      <BestSellerSection></BestSellerSection>
      <ReligiousCandleSection></ReligiousCandleSection>
      <StorySection></StorySection>
      <CollectionSpecialSection></CollectionSpecialSection>
      <ReviewSection></ReviewSection>
    </>
  )
}
