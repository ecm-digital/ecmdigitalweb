'use client';

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const PricingCalculator = dynamic(() => import('@/components/PricingCalculator'), { ssr: false });

interface ServiceLandingProps {
  serviceKey: string;
  title: string;
  subtitle: string;
  heroIcon: string;
  features: Array<{ icon: string; title: string; desc: string }>;
  benefits: Array<string>;
  whyUs: string;
  caseStudyHighlight?: { title: string; result: string; image: string };
}

export default function ServiceLandingTemplate({
  serviceKey,
  title,
  subtitle,
  heroIcon,
  features,
  benefits,
  whyUs,
  caseStudyHighlight,
}: ServiceLandingProps) {
  const { T } = useLanguage();

  useEffect(() => {
    document.documentElement.style.setProperty('--scroll-progress', '0%');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ padding: '100px 24px 60px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px' }}>{heroIcon}</div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            marginBottom: '24px',
            color: 'white',
            letterSpacing: '-0.02em',
          }}>
            {title}
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            {subtitle}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '60px', color: 'white' }}>
          What's Included
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
        }}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                padding: '40px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'white' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '40px', color: 'white', textAlign: 'center' }}>
            Key Benefits
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                style={{
                  padding: '20px 24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(59,130,246,0.3)',
                  background: 'rgba(59,130,246,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>✓</div>
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          padding: '60px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.1) 100%)',
          border: '1px solid rgba(139,92,246,0.3)',
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px', color: 'white' }}>
            Why Choose ECM Digital?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, marginBottom: '32px' }}>
            {whyUs}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#60a5fa', marginBottom: '8px' }}>100+</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>Successful Projects</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', marginBottom: '8px' }}>15+</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>Years Experience</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: '8px' }}>24/7</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA with Calculator */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '60px', color: 'white' }}>
            Ready to Get Started?
          </h2>
          <div style={{
            padding: '60px 40px',
            borderRadius: '28px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
          }}>
            <PricingCalculator />
          </div>
        </div>
      </section>

      {/* Case Study */}
      {caseStudyHighlight && (
        <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '40px', color: 'white', textAlign: 'center' }}>
              Real Results
            </h2>
            <div style={{
              padding: '40px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.02)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'white' }}>
                  {caseStudyHighlight.title}
                </h3>
                <p style={{ fontSize: '3rem', fontWeight: 900, color: '#60a5fa', marginBottom: '8px' }}>
                  {caseStudyHighlight.result}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Improvement in the first 3 months
                </p>
              </div>
              {caseStudyHighlight.image && (
                <div style={{
                  width: '100%',
                  height: '300px',
                  borderRadius: '16px',
                  background: 'rgba(96,165,250,0.1)',
                  border: '1px solid rgba(96,165,250,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '3rem',
                }}>
                  {caseStudyHighlight.image}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
