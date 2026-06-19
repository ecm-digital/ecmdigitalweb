'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';

export default function ContactPage() {
    return (
        <div className="lp-wrapper">
            <Navbar />
            <div style={{ paddingTop: '100px' }}>
                <ContactSection />
            </div>
            <Footer />
        </div>
    );
}
