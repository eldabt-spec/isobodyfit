import { useState, useEffect, useRef } from 'react';
import { useModal } from '../../context/ModalContext';

const GOALS = [
  { value: '', label: 'Select your primary goal…' },
  { value: 'strength',          label: 'Strength' },
  { value: 'mobility',          label: 'Mobility' },
  { value: 'pain-free-movement', label: 'Pain-Free Movement' },
  { value: 'performance',       label: 'Performance' },
];

const ASSESSMENT_TYPES = [
  {
    value: 'studio',
    label: 'In-Person Studio',
    description: 'Full MAT evaluation with your coach on-site.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    value: 'remote',
    label: 'Self-Guided Remote',
    description: 'Complete the assessment protocol at home.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
];

const EMPTY = { name: '', email: '', goal: '', type: '' };

export default function AssessmentModal() {
  const { open, closeModal } = useModal();
  const [fields, setFields]     = useState(EMPTY);
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  /* Focus trap + restore on open/close */
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      setFields(EMPTY);
      setErrors({});
      setSubmitted(false);
    }
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeModal]);

  /* Prevent body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function validate() {
    const e = {};
    if (!fields.name.trim())    e.name  = 'Name is required.';
    if (!fields.email.trim())   e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
                                e.email = 'Please enter a valid email.';
    if (!fields.goal)           e.goal  = 'Please select a goal.';
    if (!fields.type)           e.type  = 'Please choose an assessment type.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitted(true);
  }

  function set(key, val) {
    setFields((f) => ({ ...f, [key]: val }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center px-0 sm:px-4"
    >
      {/* Backdrop */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg bg-[#111] border border-white/[0.09] shadow-2xl flex flex-col max-h-[95dvh] sm:max-h-[90vh]">

        {/* Gold top bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#d4a017] to-transparent shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
          <div>
            <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#d4a017]">
              Start Here
            </p>
            <h2 id="modal-title" className="text-xl font-black tracking-tight text-white">
              Request Your Assessment
            </h2>
            <p className="mt-1 text-xs text-white/35">
              A coach will review your request and reach out within 2 business days.
            </p>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close modal"
            className="ml-4 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 text-white/30 transition-colors hover:border-white/30 hover:text-white"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="h-px bg-white/[0.06] shrink-0" />

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {submitted ? (
            /* ── Confirmation state ── */
            <div className="flex flex-col items-center justify-center gap-5 px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center border border-[#d4a017]/40 bg-[#d4a017]/10">
                <svg aria-hidden="true" className="h-7 w-7 text-[#d4a017]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-black text-white">Request Received</h3>
                <p className="max-w-xs text-sm leading-relaxed text-white/45">
                  Your request has been received. A coach will review and reach out shortly.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="mt-2 border border-white/15 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white/50 transition-colors hover:border-white/30 hover:text-white"
              >
                Close
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 px-6 py-6">

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/50" htmlFor="modal-name">
                  Full Name
                </label>
                <input
                  ref={firstInputRef}
                  id="modal-name"
                  type="text"
                  autoComplete="name"
                  value={fields.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Jane Smith"
                  className={`w-full border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#d4a017]/60 focus:bg-[#d4a017]/[0.04] ${
                    errors.name ? 'border-red-500/60' : 'border-white/10'
                  }`}
                />
                {errors.name && <p className="mt-1.5 text-[0.65rem] text-red-400">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/50" htmlFor="modal-email">
                  Email Address
                </label>
                <input
                  id="modal-email"
                  type="email"
                  autoComplete="email"
                  value={fields.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="jane@example.com"
                  className={`w-full border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-[#d4a017]/60 focus:bg-[#d4a017]/[0.04] ${
                    errors.email ? 'border-red-500/60' : 'border-white/10'
                  }`}
                />
                {errors.email && <p className="mt-1.5 text-[0.65rem] text-red-400">{errors.email}</p>}
              </div>

              {/* Goal */}
              <div>
                <label className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/50" htmlFor="modal-goal">
                  Primary Goal
                </label>
                <div className="relative">
                  <select
                    id="modal-goal"
                    value={fields.goal}
                    onChange={(e) => set('goal', e.target.value)}
                    className={`w-full appearance-none border bg-[#111] px-4 py-3 text-sm outline-none transition-colors focus:border-[#d4a017]/60 focus:bg-[#d4a017]/[0.04] ${
                      fields.goal ? 'text-white' : 'text-white/30'
                    } ${errors.goal ? 'border-red-500/60' : 'border-white/10'}`}
                  >
                    {GOALS.map((g) => (
                      <option key={g.value} value={g.value} disabled={!g.value} className="bg-[#111] text-white">
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.goal && <p className="mt-1.5 text-[0.65rem] text-red-400">{errors.goal}</p>}
              </div>

              {/* Assessment type */}
              <div>
                <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/50">
                  Assessment Type
                </p>
                <div className="flex flex-col gap-2">
                  {ASSESSMENT_TYPES.map((t) => {
                    const checked = fields.type === t.value;
                    return (
                      <label
                        key={t.value}
                        className={`flex cursor-pointer items-start gap-4 border p-4 transition-all duration-150 ${
                          checked
                            ? 'border-[#d4a017]/50 bg-[#d4a017]/[0.06]'
                            : 'border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          name="assessment-type"
                          value={t.value}
                          checked={checked}
                          onChange={() => set('type', t.value)}
                          className="sr-only"
                        />
                        {/* Radio indicator */}
                        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${checked ? 'border-[#d4a017]' : 'border-white/20'}`}>
                          {checked && <span className="h-2 w-2 rounded-full bg-[#d4a017]" />}
                        </span>
                        {/* Icon */}
                        <span className={`h-5 w-5 shrink-0 ${checked ? 'text-[#d4a017]' : 'text-white/25'}`}>
                          {t.icon}
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className={`text-sm font-bold ${checked ? 'text-white' : 'text-white/60'}`}>
                            {t.label}
                          </span>
                          <span className="text-xs text-white/30">{t.description}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.type && <p className="mt-1.5 text-[0.65rem] text-red-400">{errors.type}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-1 flex w-full items-center justify-center gap-2 bg-[#d4a017] px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-black transition-colors hover:bg-[#f0c040]"
              >
                Submit Request
                <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              <p className="text-center text-[0.6rem] text-white/20">
                No payment required. Coach approval is confirmed within 2 business days.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
