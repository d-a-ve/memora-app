import MaxContainer from "@components/Container/MaxContainer";

import CTA from "../components/CTA";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import HowMemoraWorks from "../components/HowMemoraWorks";

function Home() {
  // return <div>Home</div>;
  // until we have a home page, redirect to login
  return (
    <div className="bg-background">
      <MaxContainer>
        <Header />
      </MaxContainer>
      <main className="space-y-24">
        <MaxContainer>
          <div className="landing-padding space-y-24">
            <Hero />
            <Features />
            <HowMemoraWorks />
          </div>
        </MaxContainer>
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
