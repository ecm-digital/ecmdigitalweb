'use client';

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import TechStackSection from "@/components/sections/TechStackSection";
import BlogPreviewSection from "@/components/sections/BlogPreviewSection";
import KnowledgeSection from "@/components/sections/KnowledgeSection";
import CTABannerSection from "@/components/sections/CTABannerSection";

import './globals.css';

const NewsletterSection = dynamic(() => import('@/components/NewsletterSection'), { ssr: false });
const ContactSection = dynamic(() => import('@/components/ContactSection'), { ssr: false });
const FAQSection = dynamic(() => import('@/components/FAQSection'), { ssr: false });
const ExitIntentPopup = dynamic(() => import('@/components/ExitIntentPopup'), { ssr: false });

export default function HomePage() {
  const { lang } = useLanguage();

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));
    document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right').forEach(el => fadeObserver.observe(el));

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      revealObserver.disconnect();
      fadeObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <ExitIntentPopup />
      <div>
        <div className="scroll-progress-bar" />
        <Navbar />
        <HeroSection />
        <MarqueeSection />
        <ServicesSection />
        <CaseStudiesSection />
        <ProcessSection />
        <TestimonialsSection />
        <TechStackSection />
        <BlogPreviewSection />
        <KnowledgeSection />
        <CTABannerSection />
        <div className="reveal-on-scroll"><FAQSection /></div>
        <div className="reveal-on-scroll"><ContactSection /></div>
        <NewsletterSection lang={lang} />
        <Footer />
      </div>
    </>
  );
}
