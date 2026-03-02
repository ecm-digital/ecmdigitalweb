'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/context/LanguageContext';
import { getClients, Client } from '@/lib/firestoreService';

interface ScoredLead extends Client {
  score: number;
  tier: 'hot' | 'warm' | 'cold';
  scoreBreakdown: {
    status: number;
    service: number;
    source: number;
    age: number;
  };
}

export default function LeadScoringPage() {
  const { T } = useLanguage();
  const [leads, setLeads] = useState<ScoredLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('score');

  useEffect(() => {
    loadAndScoreLeads();
  }, []);

  const scoreLeads = (clients: Client[]): ScoredLead[] => {
    return clients.map(client => {
      let score = 0;
      const breakdown = { status: 0, service: 0, source: 0, age: 0 };

      // Status scoring
      if (client.status === 'Lead') breakdown.status = 40;
      else if (client.status === 'Prospekt') breakdown.status = 25;
      else if (client.status === 'Klient') breakdown.status = 0; // Already client, not a lead
      score += breakdown.status;

      // Service scoring (high-value services get higher scores)
      const highValueServices = ['AI Agents', 'Automation', 'MVP'];
      const mediumValueServices = ['Websites', 'E-commerce'];
      if (client.service && highValueServices.includes(client.service)) {
        breakdown.service = 30;
      } else if (client.service && mediumValueServices.includes(client.service)) {
        breakdown.service = 15;
      } else {
        breakdown.service = 5;
      }
      score += breakdown.service;

      // Source scoring (direct contact > form > other)
      if (client.source === 'Website Contact Form') breakdown.source = 15;
      else if (client.source === 'Pricing Calculator') breakdown.source = 20;
      else if (client.source === 'Exit Intent Popup') breakdown.source = 10;
      else if (client.source === 'Direct') breakdown.source = 20;
      else breakdown.source = 5;
      score += breakdown.source;

      // Age scoring (recent = better)
      if (client.createdAt) {
        const ageMs = Date.now() - new Date(client.createdAt).getTime();
        const ageDays = ageMs / (1000 * 60 * 60 * 24);
        if (ageDays <= 1) breakdown.age = 15;
        else if (ageDays <= 7) breakdown.age = 12;
        else if (ageDays <= 30) breakdown.age = 8;
        else if (ageDays <= 90) breakdown.age = 4;
        else breakdown.age = 0;
      }
      score += breakdown.age;

      // Determine tier
      let tier: 'hot' | 'warm' | 'cold';
      if (score >= 70) tier = 'hot';
      else if (score >= 40) tier = 'warm';
      else tier = 'cold';

      return {
        ...client,
        score,
        tier,
        scoreBreakdown: breakdown,
      };
    });
  };

  const loadAndScoreLeads = async () => {
    try {
      setLoading(true);
      const clients = await getClients();
      const leadsOnly = clients.filter(c => c.status !== 'Klient' && c.status !== 'Do archiwum');
      const scoredLeads = scoreLeads(leadsOnly);
      setLeads(scoredLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = filterTier === 'all'
    ? leads
    : leads.filter(l => l.tier === filterTier);

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'date') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    return a.name.localeCompare(b.name);
  });

  const stats = {
    hot: leads.filter(l => l.tier === 'hot').length,
    warm: leads.filter(l => l.tier === 'warm').length,
    cold: leads.filter(l => l.tier === 'cold').length,
    total: leads.length,
  };

  const getTierColor = (tier: 'hot' | 'warm' | 'cold') => {
    if (tier === 'hot') return '#ef4444';
    if (tier === 'warm') return '#f59e0b';
    return '#6b7280';
  };

  const getTierEmoji = (tier: 'hot' | 'warm' | 'cold') => {
    if (tier === 'hot') return '🔥';
    if (tier === 'warm') return '🟠';
    return '❄️';
  };

  return (
    <AdminLayout>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>
            ⭐ Lead Scoring Dashboard
          </h1>
          <button
            onClick={loadAndScoreLeads}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: '#60a5fa',
              border: 'none',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Hot Leads', value: stats.hot, color: '#ef4444', emoji: '🔥' },
            { label: 'Warm Leads', value: stats.warm, color: '#f59e0b', emoji: '🟠' },
            { label: 'Cold Leads', value: stats.cold, color: '#6b7280', emoji: '❄️' },
            { label: 'Total Leads', value: stats.total, color: '#60a5fa', emoji: '📊' },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                padding: '24px',
                borderRadius: '16px',
                border: `2px solid ${stat.color}33`,
                background: `${stat.color}10`,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.emoji}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Sort */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>Filter by Tier</label>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value as any)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Leads ({stats.total})</option>
              <option value="hot">🔥 Hot Leads ({stats.hot})</option>
              <option value="warm">🟠 Warm Leads ({stats.warm})</option>
              <option value="cold">❄️ Cold Leads ({stats.cold})</option>
            </select>
          </div>

          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="score">Score (High to Low)</option>
              <option value="date">Newest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.6)' }}>
            Loading leads...
          </div>
        ) : sortedLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.6)' }}>
            No leads found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem' }}>Tier</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem' }}>Score</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem' }}>Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem' }}>Service</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem' }}>Source</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem' }}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map((lead, idx) => (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(96,165,250,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent')}
                  >
                    <td style={{ padding: '16px', color: 'white', fontWeight: 700 }}>
                      <span style={{ fontSize: '1.3rem', marginRight: '4px' }}>
                        {getTierEmoji(lead.tier)}
                      </span>
                      {lead.tier.toUpperCase()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '60px',
                            height: '8px',
                            borderRadius: '4px',
                            background: `linear-gradient(to right, ${getTierColor(lead.tier)} ${Math.min(lead.score, 100)}%, rgba(255,255,255,0.1) ${Math.min(lead.score, 100)}%)`,
                          }}
                        />
                        <span style={{ color: getTierColor(lead.tier), fontWeight: 700, minWidth: '35px' }}>
                          {lead.score}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                      {lead.name}
                    </td>
                    <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>
                      {lead.service || '—'}
                    </td>
                    <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                      {lead.source || '—'}
                    </td>
                    <td style={{ padding: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                      {lead.status}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <a
                        href={`mailto:${lead.email}`}
                        style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.9rem' }}
                      >
                        {lead.email}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Scoring Legend */}
        <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(139,92,246,0.05)', borderRadius: '16px', border: '1px solid rgba(139,92,246,0.2)' }}>
          <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '16px' }}>📊 Scoring System</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {[
              {
                title: '🔥 Hot Leads (70+)',
                items: [
                  '✅ New status: Lead',
                  '✅ High-value service (AI, Automation)',
                  '✅ Recent (last 24h)',
                  '✅ Direct contact source',
                ],
              },
              {
                title: '🟠 Warm Leads (40-69)',
                items: [
                  '✅ Status: Lead or Prospect',
                  '✅ Medium value service',
                  '✅ Less than 30 days old',
                  '✅ Form submission',
                ],
              },
              {
                title: '❄️ Cold Leads (<40)',
                items: [
                  '❌ Old leads (>90 days)',
                  '❌ No service selected',
                  '❌ Lower engagement',
                  '❌ Keep for future nurture',
                ],
              },
            ].map((section, idx) => (
              <div key={idx}>
                <h4 style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '12px', fontWeight: 600 }}>
                  {section.title}
                </h4>
                <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Action Tips */}
        <div style={{ marginTop: '24px', padding: '24px', background: 'rgba(16,185,129,0.05)', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.2)' }}>
          <h3 style={{ color: 'white', fontWeight: 700, marginBottom: '12px' }}>💡 Action Tips</h3>
          <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 2 }}>
            <li>🔥 <strong>Hot Leads:</strong> Call or email within 1 hour</li>
            <li>🟠 <strong>Warm Leads:</strong> Follow up within 24-48 hours</li>
            <li>❄️ <strong>Cold Leads:</strong> Add to nurture email sequence</li>
            <li>📧 <strong>Set up n8n:</strong> Auto-send follow-up emails based on tier</li>
            <li>📞 <strong>Track conversions:</strong> Which tier converts to paying clients?</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
