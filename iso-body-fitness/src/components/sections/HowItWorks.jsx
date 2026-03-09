const STEPS = [
  {
    number: '01',
    title: 'Get Assessed',
    subtitle: 'In-person or self-guided',
    description:
      'We start with a full-body MAT assessment to map your muscular system — identifying which muscles are inhibited and where your movement is compensating.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
    detail: 'Takes 60 minutes',
  },
  {
    number: '02',
    title: 'Coach Reviews Your Plan',
    subtitle: 'Personalised to your data',
    description:
      'Your certified MAT coach analyses the results and builds a precision program targeting your specific weaknesses — no guesswork, no generic templates.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        <path d="M16 3.5A4 4 0 0119.5 7" />
        <path d="M17 11l2 2 4-4" />
      </svg>
    ),
    detail: 'Delivered within 48 hrs',
  },
  {
    number: '03',
    title: 'Train with Purpose',
    subtitle: 'Every session, every rep',
    description:
      'Follow your coach-led program with real-time guidance, progressive overload built on your body\'s actual capacity, and regular check-ins to adapt as you improve.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    detail: 'Ongoing & adaptive',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#0d0d0d] py-24 md:py-32"
      aria-labelledby="hiw-heading"
    >
      {/* Faint horizontal rule at top */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14 md:mb-20">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a017]">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-[#d4a017]" />
            The Process
          </p>
          <h2
            id="hiw-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-tight text-white"
          >
            How It{' '}
            <span className="text-[#d4a017]">Works</span>
          </h2>
          <p className="mt-4 max-w-lg text-base text-white/40 md:text-lg">
            Three focused steps from assessment to execution — built around your body, not a one-size-fits-all routine.
          </p>
        </div>

        {/* Steps — vertical on mobile, side-by-side connector on md+ */}
        <div className="relative flex flex-col gap-6 md:flex-row md:gap-0">

          {/* Connecting line (desktop only) */}
          <div
            aria-hidden="true"
            className="absolute top-[3.25rem] left-0 right-0 hidden h-px md:block"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, #d4a017 20%, #d4a017 80%, transparent 100%)',
              opacity: 0.2,
            }}
          />

          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative flex flex-col md:flex-1"
            >
              {/* Connector dot — desktop */}
              <div
                aria-hidden="true"
                className="absolute top-[3rem] left-1/2 hidden h-2 w-2 -translate-x-1/2 rounded-full bg-[#d4a017] md:block"
                style={{ boxShadow: '0 0 8px #d4a017' }}
              />

              {/* Card */}
              <div
                className={`
                  group relative flex flex-row gap-5 rounded-none border border-white/[0.07]
                  bg-white/[0.02] p-6 transition-all duration-300
                  hover:border-[#d4a017]/40 hover:bg-[#d4a017]/[0.04]
                  md:mx-4 md:mt-14 md:flex-col md:gap-6
                `}
              >
                {/* Step number — mobile left gutter, desktop top */}
                <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between">
                  {/* Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#d4a017]/30 bg-[#d4a017]/10 text-[#d4a017] transition-colors duration-300 group-hover:border-[#d4a017]/60 group-hover:bg-[#d4a017]/15 md:h-14 md:w-14">
                    <div className="h-6 w-6 md:h-7 md:w-7">{step.icon}</div>
                  </div>

                  {/* Step number badge */}
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/20 md:ml-auto">
                    {step.number}
                  </span>
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center">
                  <h3 className="mb-0.5 text-base font-bold text-white md:text-lg">
                    {step.title}
                  </h3>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#d4a017]/70">
                    {step.subtitle}
                  </p>
                  <p className="text-sm leading-relaxed text-white/45">
                    {step.description}
                  </p>

                  {/* Detail pill */}
                  <div className="mt-4 inline-flex w-fit items-center gap-1.5 border border-white/10 px-3 py-1.5">
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-[#d4a017]"
                    />
                    <span className="text-[0.65rem] font-medium uppercase tracking-widest text-white/30">
                      {step.detail}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <div className="mt-14 flex flex-col items-start gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/40">
            Ready to find out what's actually holding your body back?
          </p>
          <a
            href="#assessment"
            className="inline-flex items-center gap-2 border border-[#d4a017] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#d4a017] transition-all duration-200 hover:bg-[#d4a017] hover:text-black"
          >
            Request Your Assessment
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Faint horizontal rule at bottom */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent"
      />
    </section>
  );
}
