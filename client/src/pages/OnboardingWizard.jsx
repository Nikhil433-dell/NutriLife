import React, { useState } from 'react';
import { ONBOARDING_STEPS } from '../data/onboardingSteps';
import Btn from '../components/shared/Btn';

/**
 * OnboardingWizard – multi-step preferences setup for new users.
 *
 * @param {object}   props
 * @param {object}   props.prefs          - current preferences state
 * @param {Function} props.onPrefsChange  - called with updated prefs
 * @param {Function} props.onComplete     - called when wizard finishes
 */
function OnboardingWizard({ prefs, onPrefsChange, onComplete }) {
  const [step, setStep] = useState(0);
  const [localPrefs, setLocalPrefs] = useState(prefs);

  const currentStep = ONBOARDING_STEPS[step];
  const isFirst     = step === 0;
  const isLast      = step === ONBOARDING_STEPS.length - 1;

  const toggle = (key) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setRange = (key, value) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const handleNext = () => {
    onPrefsChange?.(localPrefs);
    if (isLast) {
      onComplete?.();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const progress = ((step) / (ONBOARDING_STEPS.length - 1)) * 100;

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'var(--color-bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>
            <span>Step {step + 1} of {ONBOARDING_STEPS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--color-primary)', borderRadius: 'var(--radius-full)', transition: 'width var(--transition-slow)' }} />
          </div>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '40px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{currentStep.icon}</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
              {currentStep.title}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              {currentStep.description}
            </p>
          </div>

          {/* Fields */}
          {currentStep.fields.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {currentStep.fields.map((field) => {
                if (field.type === 'checkbox') {
                  return (
                    <label
                      key={field.key}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${localPrefs[field.key] ? 'var(--color-primary)' : 'var(--color-border)'}`, background: localPrefs[field.key] ? 'var(--color-primary-light)' : 'var(--color-surface)', transition: 'all var(--transition-fast)' }}
                    >
                      <input
                        type="checkbox"
                        checked={!!localPrefs[field.key]}
                        onChange={() => toggle(field.key)}
                        style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{field.label}</span>
                    </label>
                  );
                }

                if (field.type === 'range') {
                  return (
                    <div key={field.key}>
                      <label className="label">
                        {field.label}: <strong>{localPrefs[field.key] ?? field.min} miles</strong>
                      </label>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={localPrefs[field.key] ?? field.min}
                        onChange={(e) => setRange(field.key, e.target.value)}
                        style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12 }}>
            {!isFirst && (
              <Btn variant="ghost" onClick={handleBack} style={{ flex: 1 }}>
                ← Back
              </Btn>
            )}
            <Btn onClick={handleNext} style={{ flex: isFirst ? 'auto' : 1 }} fullWidth={isFirst}>
              {isLast ? '🎉 Get Started' : 'Next →'}
            </Btn>
          </div>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 'var(--radius-full)',
                background: i === step ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'all var(--transition-base)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default OnboardingWizard;
