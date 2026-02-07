import CollectionSpecialSection from "./CollectionSpecialSection.tsx";
import CollectionSpecialSection2 from "./CollectionSpecialSection2.tsx";
import HeroSection from "./HeroSection.tsx";
import ReviewSection from "./ReviewSection.tsx";
import StorySection from "./StorySection.tsx";

export default function HomePage() {
  return (
    <>
      <HeroSection></HeroSection>
      <CollectionSpecialSection></CollectionSpecialSection>
      <StorySection></StorySection>
      <CollectionSpecialSection2></CollectionSpecialSection2>
      <ReviewSection></ReviewSection>
    </>
  )
}
