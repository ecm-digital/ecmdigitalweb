'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useNotifications } from '@/context/NotificationContext';
import { getGensparkProposals, updateGensparkProposal, deleteGensparkProposal, GensparkProposal } from '@/lib/firestoreService';
import posthog from 'posthog-js';
import './proposals.css';

type FilterStatus = 'all' | 'Wysłana' | 'Zaakceptowana' | 'Odrzucona' | 'Brak odpowiedzi';
type FilterPlatform = 'all' | 'email' | 'linkedin' | 'useme' | 'other';

export default function ProposalsPage() {
  const { showToast } = useNotifications();
  const [proposals, setProposals] = useState<GensparkProposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<GensparkProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPlatform, setFilterPlatform] = useState<FilterPlatform>('all');
  const [selectedProposal, setSelectedProposal] = useState<GensparkProposal | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelNotes, setPanelNotes] = useState('');

  // Load proposals
  useEffect(() => {
    loadProposals();
  }, []);

  // Filter proposals
  useEffect(() => {
    let filtered = proposals;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    if (filterPlatform !== 'all') {
      filtered = filtered.filter(p => p.platform === filterPlatform);
    }

    setFilteredProposals(filtered);
  }, [proposals, filterStatus, filterPlatform]);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const data = await getGensparkProposals();
      setProposals(data);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to load proposals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPanel = (proposal: GensparkProposal) => {
    setSelectedProposal(proposal);
    setPanelNotes(proposal.notes || '');
    setPanelOpen(true);

    posthog.capture('proposal_viewed', {
      clientId: proposal.id,
      client: proposal.client,
      platform: proposal.platform,
    });
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedProposal(null), 300);
  };

  const handleStatusChange = async (proposalId: string, newStatus: GensparkProposal['status']) => {
    try {
      await updateGensparkProposal(proposalId, { status: newStatus });
      setProposals(proposals.map(p => p.id === proposalId ? { ...p, status: newStatus } : p));

      posthog.capture('proposal_status_changed', {
        proposalId,
        newStatus,
        client: proposals.find(p => p.id === proposalId)?.client,
      });

      showToast('Status updated', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update status', 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedProposal) return;

    try {
      await updateGensparkProposal(selectedProposal.id!, { notes: panelNotes });
      setProposals(proposals.map(p => p.id === selectedProposal.id ? { ...p, notes: panelNotes } : p));
      showToast('Notes saved', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to save notes', 'error');
    }
  };

  const handleDelete = async (proposalId: string) => {
    if (!confirm('Delete this proposal?')) return;

    try {
      await deleteGensparkProposal(proposalId);
      setProposals(proposals.filter(p => p.id !== proposalId));
      handleClosePanel();
      showToast('Proposal deleted', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete proposal', 'error');
    }
  };

  // Stats
  const totalProposals = proposals.length;
  const totalValue = proposals.reduce((sum, p) => sum + (p.value || 0), 0);
  const acceptedCount = proposals.filter(p => p.status === 'Zaakceptowana').length;
  const acceptanceRate = totalProposals > 0 ? ((acceptedCount / totalProposals) * 100).toFixed(0) : 0;
  const noResponseCount = proposals.filter(p => p.status === 'Brak odpowiedzi').length;

  const platformColors: Record<GensparkProposal['platform'], string> = {
    email: '#EA4335',
    linkedin: '#0A66C2',
    useme: '#FF6B35',
    other: '#6C757D',
  };

  const statusColors: Record<GensparkProposal['status'], string> = {
    'Wysłana': '#3B82F6',
    'Zaakceptowana': '#10B981',
    'Odrzucona': '#EF4444',
    'Brak odpowiedzi': '#F59E0B',
  };

  return (
    <AdminLayout>
      <div className="crm-page">
        {/* Header */}
        <div className="crm-header">
          <h1 className="crm-title">🚀 Proposals (Genspark)</h1>
          <p className="crm-subtitle">Track proposals sent by Genspark Claw</p>
        </div>

        {/* Stats */}
        <div className="crm-mini-stats">
          <div className="crm-mini-stat">
            <div className="stat-value">{totalProposals}</div>
            <div className="stat-label">Total Proposals</div>
          </div>
          <div className="crm-mini-stat">
            <div className="stat-value">{totalValue.toLocaleString('pl-PL')} PLN</div>
            <div className="stat-label">Total Value</div>
          </div>
          <div className="crm-mini-stat">
            <div className="stat-value">{acceptanceRate}%</div>
            <div className="stat-label">Acceptance Rate</div>
          </div>
          <div className="crm-mini-stat">
            <div className="stat-value">{noResponseCount}</div>
            <div className="stat-label">No Response</div>
          </div>
        </div>

        {/* Filters */}
        <div className="proposals-filters">
          <div className="filter-group">
            <label>Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}>
              <option value="all">All</option>
              <option value="Wysłana">Wysłana</option>
              <option value="Zaakceptowana">Zaakceptowana</option>
              <option value="Odrzucona">Odrzucona</option>
              <option value="Brak odpowiedzi">Brak odpowiedzi</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Platform:</label>
            <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value as FilterPlatform)}>
              <option value="all">All</option>
              <option value="email">Email</option>
              <option value="linkedin">LinkedIn</option>
              <option value="useme">Useme</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="proposals-loading">Loading proposals...</div>
        ) : filteredProposals.length === 0 ? (
          <div className="proposals-empty">No proposals found</div>
        ) : (
          <div className="proposals-table-wrapper">
            <table className="proposals-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Platform</th>
                  <th>Subject</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map(proposal => (
                  <tr key={proposal.id}>
                    <td className="client-cell">{proposal.client}</td>
                    <td className="email-cell">{proposal.email || '—'}</td>
                    <td className="platform-cell">
                      <span className="platform-badge" style={{ backgroundColor: platformColors[proposal.platform] }}>
                        {proposal.platform}
                      </span>
                    </td>
                    <td className="subject-cell" title={proposal.subject}>
                      {proposal.subject}
                    </td>
                    <td className="value-cell">
                      {proposal.value ? `${proposal.value.toLocaleString('pl-PL')} ${proposal.currency || 'PLN'}` : '—'}
                    </td>
                    <td className="status-cell">
                      <select
                        className="status-select"
                        value={proposal.status}
                        onChange={(e) => handleStatusChange(proposal.id!, e.target.value as GensparkProposal['status'])}
                        style={{ borderColor: statusColors[proposal.status] }}
                      >
                        <option value="Wysłana">Wysłana</option>
                        <option value="Zaakceptowana">Zaakceptowana</option>
                        <option value="Odrzucona">Odrzucona</option>
                        <option value="Brak odpowiedzi">Brak odpowiedzi</option>
                      </select>
                    </td>
                    <td className="date-cell">
                      {new Date(proposal.sentAt).toLocaleDateString('pl-PL')}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn detail-btn"
                        onClick={() => handleOpenPanel(proposal)}
                        title="View details"
                      >
                        📋
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(proposal.id!)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Side Panel */}
        {selectedProposal && (
          <>
            <div
              className={`proposals-panel-backdrop ${panelOpen ? 'open' : ''}`}
              onClick={handleClosePanel}
            />
            <div className={`proposals-panel ${panelOpen ? 'open' : ''}`}>
              <div className="panel-header">
                <h2>{selectedProposal.client}</h2>
                <button className="close-btn" onClick={handleClosePanel}>✕</button>
              </div>

              <div className="panel-content">
                {/* Info */}
                <div className="info-grid">
                  <div className="info-field">
                    <label>Email:</label>
                    <p>{selectedProposal.email || '—'}</p>
                  </div>
                  <div className="info-field">
                    <label>Platform:</label>
                    <p style={{ color: platformColors[selectedProposal.platform] }}>
                      {selectedProposal.platform}
                    </p>
                  </div>
                  <div className="info-field">
                    <label>Value:</label>
                    <p>
                      {selectedProposal.value
                        ? `${selectedProposal.value.toLocaleString('pl-PL')} ${selectedProposal.currency || 'PLN'}`
                        : '—'}
                    </p>
                  </div>
                  <div className="info-field">
                    <label>Status:</label>
                    <p style={{ color: statusColors[selectedProposal.status] }}>
                      {selectedProposal.status}
                    </p>
                  </div>
                </div>

                {/* Subject */}
                <div className="field-section">
                  <label className="field-label">Subject:</label>
                  <div className="field-display">{selectedProposal.subject}</div>
                </div>

                {/* Body */}
                <div className="field-section">
                  <label className="field-label">Proposal Body:</label>
                  <div className="field-display body-display">{selectedProposal.body}</div>
                </div>

                {/* Notes */}
                <div className="field-section">
                  <label className="field-label">Notes:</label>
                  <textarea
                    className="notes-textarea"
                    value={panelNotes}
                    onChange={(e) => setPanelNotes(e.target.value)}
                    placeholder="Add notes..."
                  />
                  <button className="save-notes-btn" onClick={handleSaveNotes}>
                    💾 Save Notes
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
