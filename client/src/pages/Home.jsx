import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AiTools from "../components/AiTools";
import Testimonial from "../components/Testimonial";
import Plan from "../components/Plan";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <section id="hero">
        <Hero />
      </section>
      <section id="features">
        <AiTools />
      </section>
      <section id="testimonials">
        <Testimonial />
      </section>
      <section id="pricing">
        <Plan />
      </section>

      <Footer />
    </>
  );
};

export default Home;
