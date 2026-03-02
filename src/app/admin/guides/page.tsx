'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/context/LanguageContext';

export default function GuidesPage() {
  const { T } = useLanguage();
  const [selectedGuide, setSelectedGuide] = useState<'google-ads' | 'email-sequences' | 'lead-scoring' | null>('google-ads');

  const guides = [
    { id: 'google-ads', label: '📢 Google Ads - AI Agents Setup', icon: '📢' },
    { id: 'email-sequences', label: '📧 Email Sequences (n8n)', icon: '📧' },
    { id: 'lead-scoring', label: '⭐ Lead Scoring System', icon: '⭐' },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '32px', color: 'white' }}>
          📚 Setup Guides
        </h1>

        {/* Guide Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {guides.map(guide => (
            <button
              key={guide.id}
              onClick={() => setSelectedGuide(guide.id as any)}
              style={{
                padding: '24px',
                borderRadius: '16px',
                border: selectedGuide === guide.id ? '2px solid #60a5fa' : '1px solid rgba(255,255,255,0.1)',
                background: selectedGuide === guide.id ? 'rgba(96, 165, 250, 0.1)' : 'rgba(255,255,255,0.02)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {guide.icon} {guide.label}
            </button>
          ))}
        </div>

        {/* Google Ads Guide */}
        {selectedGuide === 'google-ads' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '32px', color: '#60a5fa' }}>
              📢 Google Ads Campaign: AI Agents
            </h2>

            {/* Campaign Overview */}
            <div style={{ marginBottom: '40px', padding: '24px', background: 'rgba(96, 165, 250, 0.05)', borderRadius: '12px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'white' }}>🎯 Campaign Overview</h3>
              <ul style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                <li>✅ Service: <strong>AI Agents for Business</strong></li>
                <li>✅ Landing Page: <strong>https://ecmdigital-28074.web.app/landing/ai-agents</strong></li>
                <li>✅ Budget: <strong>$10/day (~300 PLN/month)</strong></li>
                <li>✅ Expected: <strong>7-13 leads/month</strong></li>
                <li>✅ Target: <strong>Poland, Polish language</strong></li>
              </ul>
            </div>

            {/* Step 1 */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Step 1: Create Campaign</h3>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #60a5fa' }}>
                <ol style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 2, paddingLeft: '20px' }}>
                  <li>Go to <strong>https://ads.google.com</strong></li>
                  <li>Click <strong>"+Campaign"</strong></li>
                  <li>Select <strong>"Sales"</strong> → <strong>"Search"</strong></li>
                  <li>Campaign name: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>AI Agents - Lead Generation</code></li>
                  <li>Final URL: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>https://ecmdigital-28074.web.app/landing/ai-agents</code></li>
                  <li>Daily budget: <strong>$10</strong></li>
                </ol>
              </div>
            </div>

            {/* Ad Groups */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Step 2: Create 4 Ad Groups</h3>

              {[
                {
                  name: 'Business Automation',
                  keywords: ['AI agents for business', 'AI business automation', 'intelligent automation solutions', 'business process automation', 'AI workflow automation', 'automated business processes', 'enterprise AI agents'],
                },
                {
                  name: 'AI Customer Service',
                  keywords: ['AI customer service chatbot', 'AI agent for customer support', 'automated customer service', '24/7 customer support AI', 'customer service automation', 'chatbot solution', 'conversational AI'],
                },
                {
                  name: 'Workflow Automation',
                  keywords: ['workflow automation software', 'process automation tool', 'business workflow automation', 'task automation software', 'workflow automation platform', 'intelligent process automation', 'RPA solutions'],
                },
                {
                  name: 'Branded',
                  keywords: ['ECM Digital AI agents', 'ECM Digital automation', 'ECM Digital'],
                },
              ].map((group, idx) => (
                <div key={idx} style={{ marginBottom: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <h4 style={{ color: '#60a5fa', fontWeight: 700, marginBottom: '12px' }}>Ad Group #{idx + 1}: {group.name}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '12px', fontSize: '0.9rem' }}>Keywords:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {group.keywords.map((kw, i) => (
                      <code key={i} style={{ background: 'rgba(96, 165, 250, 0.1)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', color: '#93c5fd', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                        {kw}
                      </code>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(group.keywords.join('\n'));
                      alert('Copied to clipboard!');
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: 'rgba(96, 165, 250, 0.2)',
                      border: '1px solid rgba(96, 165, 250, 0.4)',
                      color: '#93c5fd',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    📋 Copy Keywords
                  </button>
                </div>
              ))}
            </div>

            {/* Ad Copy */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Step 3: Write Ad Copy</h3>
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>Use this for Ad Group 1 & 2:</p>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace', lineHeight: 1.8 }}>
                  <strong>Headline 1:</strong> AI Agents That Reduce Costs 70%<br />
                  <strong>Headline 2:</strong> Automate Customer Service 24/7<br />
                  <strong>Headline 3:</strong> No Hiring Needed<br />
                  <br />
                  <strong>Description:</strong> Deploy intelligent AI agents in days, not months. Handle customer inquiries, qualify leads, process data automatically. Join 100+ companies saving thousands monthly.
                </div>
              </div>
            </div>

            {/* Conversion Tracking */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Step 4: Setup Conversion Tracking</h3>
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                <ol style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 2, paddingLeft: '20px' }}>
                  <li>In Google Ads: <strong>Tools → Conversions</strong></li>
                  <li>Click <strong>"+Conversion"</strong> → <strong>"Website"</strong></li>
                  <li>Name: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>Lead - Pricing Calculator</code></li>
                  <li>Category: <strong>"Sign-ups"</strong></li>
                  <li>Value: <strong>1</strong> (or average lead value)</li>
                  <li>Google will provide tracking code - add to page header</li>
                </ol>
              </div>
            </div>

            {/* Monitoring */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', color: 'white' }}>📊 Monitor & Optimize</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: 'rgba(255,255,255,0.8)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(96, 165, 250, 0.3)' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Metric</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Target</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Action if Low</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: 'Impressions', target: '500+/week', action: 'Increase budget' },
                    { metric: 'CTR', target: '5%+', action: 'Improve ad copy' },
                    { metric: 'Conversion Rate', target: '5%+', action: 'Optimize landing page' },
                    { metric: 'Cost per Lead', target: '<100 PLN', action: 'Refine keywords' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px' }}>{row.metric}</td>
                      <td style={{ padding: '12px', color: '#10b981' }}>{row.target}</td>
                      <td style={{ padding: '12px', color: '#f59e0b' }}>{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Links */}
            <div style={{ padding: '20px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <h4 style={{ color: 'white', marginBottom: '12px', fontWeight: 700 }}>🔗 Quick Links</h4>
              <ul style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li><a href="https://ads.google.com" target="_blank" rel="noopener" style={{ color: '#60a5fa', textDecoration: 'none' }}>Google Ads Dashboard</a></li>
                <li><a href="https://ecmdigital-28074.web.app/landing/ai-agents" target="_blank" rel="noopener" style={{ color: '#60a5fa', textDecoration: 'none' }}>Landing Page</a></li>
                <li><a href="https://analytics.google.com" target="_blank" rel="noopener" style={{ color: '#60a5fa', textDecoration: 'none' }}>Google Analytics</a></li>
              </ul>
            </div>
          </div>
        )}

        {/* Email Sequences Placeholder */}
        {selectedGuide === 'email-sequences' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa', marginBottom: '16px' }}>📧 Email Sequences (n8n)</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Coming soon! We'll set up automated email follow-ups.</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Day 1: Welcome email<br />Day 3: Reminder<br />Day 7: Final offer</p>
          </div>
        )}

        {/* Lead Scoring Placeholder */}
        {selectedGuide === 'lead-scoring' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa', marginBottom: '16px' }}>⭐ Lead Scoring System</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Coming soon! Track and score your leads automatically.</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Hot leads • Warm leads • Cold leads</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
