const FEATURES = [
  {
    title: 'Personalized Programs',
    description:
      'Every program is built from your MAT assessment data — targeting your specific inhibited muscles, not a generic fitness template.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
    tag: 'Core',
  },
  {
    title: 'Founder-Recorded Videos',
    description:
      'Every exercise in your plan is demonstrated by the Iso-Body founder — precise cuing, correct form, and the intent behind each movement.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
    tag: 'Content',
  },
  {
    title: 'Community Feed',
    description:
      'Connect with other Iso-Body clients — share milestones, ask questions, and stay accountable inside a focused, coach-moderated community.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    tag: 'Social',
  },
  {
    title: 'Progress Tracking',
    description:
      'Log every session, track strength benchmarks, and visualise your body\'s adaptation over time — all tied back to your assessment baseline.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 4-8" />
      </svg>
    ),
    tag: 'Analytics',
  },
  {
    title: 'Coach Approval Workflow',
    description:
      'No client starts training without a coach sign-off. Every intake, program update, and progression milestone is reviewed before it goes live.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tag: 'Quality',
  },
  {
    title: 'Reassessment Reminders',
    description:
      'Your body changes — your program should too. Automated reminders keep reassessments on schedule so your training never falls behind your progress.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tag: 'Automation',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#0d0d0d] py-24 md:py-32"
      aria-labelledby="features-heading"
    >
      {/* Top rule */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent"
      />

      {/* Corner glow — bottom right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14 md:mb-20">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a017]">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-[#d4a017]" />
            Inside the App
          </p>
          <h2
            id="features-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-tight text-white"
          >
            Everything You Need,{' '}
            <br className="hidden sm:block" />
            <span className="text-[#d4a017]">Nothing You Don't</span>
          </h2>
          <p className="mt-4 max-w-lg text-base text-white/40 md:text-lg">
            Built specifically for MAT-informed coaching — no bloat, no generic fitness app features that don't serve your program.
          </p>
        </div>

        {/* 2-col mobile → 3-col desktop grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative flex flex-col border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-300 hover:border-[#d4a017]/40 hover:bg-[#d4a017]/[0.04] md:p-6"
            >
              {/* Subtle index watermark */}
              <span
                aria-hidden="true"
                className="absolute right-4 top-3 text-[2.5rem] font-black leading-none text-white/[0.03] select-none"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Icon */}
              <div className="mb-4 flex h-11 w-11 items-center justify-center border border-[#d4a017]/25 bg-[#d4a017]/[0.08] text-[#d4a017] transition-colors duration-300 group-hover:border-[#d4a017]/50 group-hover:bg-[#d4a017]/[0.14]">
                <div className="h-5 w-5">{feature.icon}</div>
              </div>

              {/* Tag */}
              <span className="mb-2 inline-block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#d4a017]/50">
                {feature.tag}
              </span>

              {/* Title */}
              <h3 className="mb-2 text-sm font-bold leading-snug text-white md:text-base">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed text-white/40 md:text-sm">
                {feature.description}
              </p>

              {/* Bottom accent line — appears on hover */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#d4a017]/60 to-transparent transition-transform duration-300 group-hover:scale-x-100"
              />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-white/20">
          All features available across iOS, Android, and web — no separate subscriptions.
        </p>

      </div>

      {/* Bottom rule */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent"
      />
    </section>
  );
}
