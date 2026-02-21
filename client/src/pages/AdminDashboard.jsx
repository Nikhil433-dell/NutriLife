import React, { useState, useEffect } from 'react';
import { SHELTERS as FALLBACK_SHELTERS } from '../data/shelters';
import { INITIAL_INVENTORY, INITIAL_DISTRIBUTIONS } from '../data/inventory';
import { shelterApi, adminApi } from '../utils/api';
import { Tag } from '../components/shared';

/**
 * AdminDashboard – shelter management, inventory, and distributions overview.
 *
 * @param {object} props
 * @param {object} props.user
 */
function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [shelters, setShelters] = useState(FALLBACK_SHELTERS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [distributions, setDistributions] = useState(INITIAL_DISTRIBUTIONS);

  useEffect(() => {
    shelterApi.getAll().then(setShelters).catch(() => {});
    adminApi.getInventory().then(setInventory).catch(() => {});
    adminApi.getDistributions().then(setDistributions).catch(() => {});
  }, []);

  const TABS = ['overview', 'shelters', 'inventory', 'distributions'];

  const totalCapacity = shelters.reduce((s, sh) => s + sh.capacity, 0);
  const totalCurrent  = shelters.reduce((s, sh) => s + sh.current, 0);
  const lowStockItems = inventory.filter((i) => i.quantity <= i.threshold);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)' }}>⚙️ Admin Dashboard</h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Welcome, {user?.name}. Manage shelters and resources.</p>
        </div>
        {lowStockItems.length > 0 && (
          <div style={{ padding: '8px 16px', background: '#fff5f5', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--color-danger)', fontWeight: 600 }}>
            ⚠️ {lowStockItems.length} low-stock item{lowStockItems.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon="🏠" label="Active Shelters" value={shelters.length} color="var(--color-primary)" />
        <StatCard icon="👥" label="Total Occupants" value={`${totalCurrent} / ${totalCapacity}`} color="var(--color-info)" />
        <StatCard icon="📦" label="Inventory Items" value={inventory.length} color="var(--color-success)" />
        <StatCard icon="⚠️" label="Low Stock" value={lowStockItems.length} color="var(--color-danger)" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', border: 'none', borderRadius: 'var(--radius-md)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              background: activeTab === tab ? 'var(--color-primary)' : 'var(--color-border)',
              color:      activeTab === tab ? '#fff' : 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Shelter Occupancy</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {shelters.map((s) => {
              const pct = Math.round((s.current / s.capacity) * 100);
              const color = pct < 60 ? 'var(--color-success)' : pct < 85 ? 'var(--color-warning)' : 'var(--color-danger)';
              return (
                <div key={s.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{s.name}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{s.current}/{s.capacity} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 'var(--radius-full)', transition: 'width var(--transition-slow)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Shelters */}
      {activeTab === 'shelters' && (
        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>All Shelters</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  {['Name', 'Address', 'Occupancy', 'Rating', 'Hours'].map((h) => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shelters.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)' }}>{s.address}</td>
                    <td style={{ padding: '10px 12px' }}>{s.current}/{s.capacity}</td>
                    <td style={{ padding: '10px 12px' }}>⭐ {s.rating}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)' }}>{s.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Inventory */}
      {activeTab === 'inventory' && (
        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Inventory</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {inventory.map((item) => {
              const isLow = item.quantity <= item.threshold;
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: isLow ? '#fff5f5' : 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: `1px solid ${isLow ? 'var(--color-danger)' : 'var(--color-border)'}` }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>{item.item}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.category} · restocked {item.lastRestocked}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: isLow ? 'var(--color-danger)' : 'var(--color-text)' }}>
                        {item.quantity} {item.unit}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>threshold: {item.threshold}</div>
                    </div>
                    {isLow && <Tag style={{ background: '#fed7d7', color: 'var(--color-danger)' }}>Low Stock</Tag>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Distributions */}
      {activeTab === 'distributions' && (
        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Recent Distributions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {distributions.map((dist) => (
              <div key={dist.id} style={{ padding: 16, background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{dist.shelterName}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{dist.date}</div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                  By: {dist.distributedBy}
                </div>
                {dist.notes && <div style={{ fontSize: 13, color: 'var(--color-text)' }}>{dist.notes}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {dist.items.map((it) => (
                    <Tag key={it.inventoryId}>{it.item} ×{it.quantity}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default AdminDashboard;
