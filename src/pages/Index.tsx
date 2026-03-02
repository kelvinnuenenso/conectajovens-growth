import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import BenefitsSection from "@/components/BenefitsSection";
import ForWhoSection from "@/components/ForWhoSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LeadCaptureSection from "@/components/LeadCaptureSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <BenefitsSection />
        <ForWhoSection />
        <TestimonialsSection />
        <LeadCaptureSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
