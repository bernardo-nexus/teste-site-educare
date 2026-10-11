import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { Problems } from '../components/sections/Problems';
import { Solution } from '../components/sections/Solution';
import { TryApp } from '../components/sections/TryApp';
import { Features } from '../components/sections/Features';
import { Differentials } from '../components/sections/Differentials';
import { Pricing } from '../components/sections/Pricing';
// import { Testimonials } from '../components/sections/Testimonials';
import { FAQ } from '../components/sections/FAQ';
import { CTAFinal } from '../components/sections/CTAFinal';
import { FloatingLangSwitcher } from '../components/ui/FloatingLangSwitcher';
// import { FloatingScrollButton } from '../components/ui/ScrollIndicator';

export function Home() {
  return (
    <>
      <Header />
      {/* <FloatingScrollButton /> */}
      <FloatingLangSwitcher />
      <main>
        <Hero />
        <Problems />
        <Solution />
        <TryApp />
        <Features />
        <Differentials />
        <Pricing />
        {/* <Testimonials /> */}
        <FAQ />
        <CTAFinal />
        <Footer />
      </main>
    </>
  );
}
