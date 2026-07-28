"use client";

import ScrollProgressBar from "./ScrollProgressBar";
import Header from "./Header";
import Hero from "./Hero";
import Stats from "./Stats";
import Services from "./Services";
import Arsenal from "./Arsenal";
import Gallery from "./Gallery";
import Testimonials from "./Testimonials";
import FinalCta from "./FinalCta";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <>
      <ScrollProgressBar />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Arsenal />
        <Gallery />
        <Testimonials />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
