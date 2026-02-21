import React from 'react';
import Btn from '../components/shared/Btn';

/**
 * LandingPage – hero screen shown to unauthenticated (or new) visitors.
 *
 * @param {object}   props
 * @param {Function} props.onNavigate   - navigates to a named view
 * @param {Function} props.onAuthOpen   - opens the AuthModal
 */
function LandingPage({ onNavigate, onAuthOpen }) {
  const stats = [
    { value: '500+', label: 'Partner Shelters' },
    { value: '12k+', label: 'People Helped' },
    { value: '98%',  label: 'Satisfaction' },
    { value: '24/7', label: 'Always Available' },
  ];

  const features = [
    {
      icon: '🗺️',
      title: 'Interactive Map',
      description: 'Find shelters and nutrition resources near you with real-time availability.',
    },
    {
      icon: '🍽️',
      title: 'Nutrition Tracking',
      description: 'Access meal schedules, dietary counselling, and grocery assistance programs.',
    },
    {
      icon: '🤝',
      title: 'Community Support',
      description: 'Connect with volunteers, donors, and others in your community.',
    },
    {
      icon: '📊',
      title: 'Personal Dashboard',
      description: 'Manage your bookmarks, check-in history, and personalised recommendations.',
    },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Hero Section */}
      <section
        style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          textAlign: 'center',
          padding: '48px 16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500,
            background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '-15%', left: '-8%', width: 400, height: 400,
            background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 700, position: 'relative' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🌱</div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Find Shelter & Nutrition<br />
            <span style={{ color: '#a3e635' }}>Near You</span>
          </h1>
          <p style={{ fontSize: 18, opacity: 0.9, lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
            NutriLife connects people to emergency shelters, food resources, and community support — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn size="lg" onClick={() => onNavigate('map')} style={{ background: '#fff', color: 'var(--color-primary)' }}>
              🗺️ Find Resources
            </Btn>
            <Btn
              size="lg"
              variant="ghost"
              onClick={onAuthOpen}
              style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff', border: '2px solid rgba(255,255,255,0.6)' }}
            >
              Get Started Free
            </Btn>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#fff', padding: '48px 24px' }}>
        <div
          style={{
            maxWidth: 900, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24,
          }}
        >
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--color-bg)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 48, color: 'var(--color-text)' }}>
            Everything You Need
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {features.map(({ icon, title, description }) => (
              <div key={title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          color: '#fff',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Ready to Find Support?</h2>
        <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 32 }}>
          Join thousands of people who have found shelter and nutrition resources through NutriLife.
        </p>
        <Btn
          size="lg"
          onClick={onAuthOpen}
          style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 700 }}
        >
          Create Free Account
        </Btn>
      </section>
    </div>
  );
}

export default LandingPage;
