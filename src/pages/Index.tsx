import HeroSection from "@/components/HeroSection";
import PurposeSection from "@/components/PurposeSection";
import StepsSection from "@/components/StepsSection";
import SignupForm from "@/components/SignupForm";
import PageFooter from "@/components/PageFooter";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <PurposeSection />
      <StepsSection />
      <SignupForm />
      <PageFooter />
    </main>
  );
};

export default Index;
