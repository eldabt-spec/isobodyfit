const CheckIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 shrink-0 text-[#d4a017]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const DimIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 shrink-0 text-white/20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

const TIERS = [
  {
    id: 'remote',
    label: 'Remote',
    name: 'Remote / Self-Assessment',
    price: '$97',
    period: '/ month',
    tagline: 'Train smarter from anywhere',
    description:
      'Guided self-assessment protocol and coach-reviewed programming delivered remotely. Ideal for athletes who can\'t attend in person.',
    badge: null,
    highlighted: false,
    cta: 'Apply for Remote Access',
    ctaHref: '#apply-remote',
    features: [
      { text: 'Self-guided MAT assessment protocol', included: true },
      { text: 'Coach-reviewed program (monthly update)', included: true },
      { text: 'App-based progress tracking', included: true },
      { text: 'Async coach messaging', included: true },
      { text: 'In-person MAT evaluation', included: false },
      { text: 'Real-time session coaching', included: false },
      { text: 'Priority scheduling', included: false },
    ],
    note: 'Assessment depth limited to self-reported data',
  },
  {
    id: 'studio',
    label: 'Studio',
    name: 'Studio Client',
    price: '$247',
    period: '/ month',
    tagline: 'The full Iso-Body experience',
    description:
      'Full-access membership with in-person MAT evaluation, hands-on coaching, and a precision program built from direct biomechanical assessment.',
    badge: 'Recommended',
    highlighted: true,
    cta: 'Request Studio Assessment',
    ctaHref: '#apply-studio',
    features: [
      { text: 'In-person MAT evaluation (full protocol)', included: true },
      { text: 'Custom program — rebuilt every 4 weeks', included: true },
      { text: 'Unlimited real-time session coaching', included: true },
      { text: 'Priority scheduling & session holds', included: true },
      { text: 'App-based progress tracking', included: true },
      { text: 'Direct coach messaging (same-day response)', included: true },
      { text: 'Quarterly body composition review', included: true },
    ],
    note: null,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#0a0a0a] py-24 md:py-32"
      aria-labelledby="pricing-heading"
    >
      {/* Top rule */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent"
      />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 opacity-[0.04]"
        style={{ background: 'radial-gradient(ellipse, #d4a017 0%, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14 md:mb-20">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a017]">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-[#d4a017]" />
            Investment
          </p>
          <h2
            id="pricing-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-tight text-white"
          >
            Choose Your{' '}
            <span className="text-[#d4a017]">Path</span>
          </h2>
          <p className="mt-4 max-w-lg text-base text-white/40 md:text-lg">
            Both tiers are coach-led and MAT-informed. The difference is depth of assessment and access.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`
                relative flex flex-col border transition-all duration-300
                ${tier.highlighted
                  ? 'border-[#d4a017]/60 bg-[#d4a017]/[0.04]'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'}
              `}
            >
              {/* Recommended badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-6">
                  <span className="inline-flex items-center gap-1.5 bg-[#d4a017] px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.2em] text-black">
                    <svg aria-hidden="true" className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Card header */}
              <div className={`p-6 pb-0 ${tier.badge ? 'pt-8' : ''}`}>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/30">
                      {tier.label}
                    </p>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {tier.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-black text-white">{tier.price}</span>
                    <span className="ml-1 text-xs text-white/30">{tier.period}</span>
                  </div>
                </div>

                <p className="mb-1 text-sm font-semibold text-[#d4a017]/80">
                  {tier.tagline}
                </p>
                <p className="mb-6 text-sm leading-relaxed text-white/40">
                  {tier.description}
                </p>

                {/* Divider */}
                <div className={`h-px ${tier.highlighted ? 'bg-[#d4a017]/20' : 'bg-white/[0.06]'}`} />
              </div>

              {/* Features list */}
              <ul className="flex flex-col gap-3 p-6" role="list">
                {tier.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-3">
                    {f.included ? <CheckIcon /> : <DimIcon />}
                    <span
                      className={`text-sm leading-snug ${
                        f.included ? 'text-white/70' : 'text-white/25 line-through decoration-white/15'
                      }`}
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Limited-depth note */}
              {tier.note && (
                <div className="mx-6 mb-6 flex items-start gap-2 border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                  <svg aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/25" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
                  </svg>
                  <p className="text-[0.7rem] leading-relaxed text-white/25">{tier.note}</p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-auto p-6 pt-0">
                <a
                  href={tier.ctaHref}
                  className={`
                    flex w-full items-center justify-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200
                    ${tier.highlighted
                      ? 'bg-[#d4a017] text-black hover:bg-[#f0c040]'
                      : 'border border-white/20 text-white/60 hover:border-white/40 hover:text-white'}
                  `}
                >
                  {tier.cta}
                  <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Coach approval callout */}
        <div className="mt-8 flex flex-col gap-4 border border-[#d4a017]/20 bg-[#d4a017]/[0.03] p-6 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#d4a017]/30 bg-[#d4a017]/10">
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-[#d4a017]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="mb-1 text-sm font-bold text-white">
              Coach Approval Required — All Plans
            </p>
            <p className="text-sm leading-relaxed text-white/40">
              Iso-Body Fitness is not an open sign-up service. Every client goes through a brief intake review so your coach can confirm that MAT-based programming is the right fit for your goals and physical readiness. Approval is typically confirmed within 2 business days.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom rule */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent"
      />
    </section>
  );
}
