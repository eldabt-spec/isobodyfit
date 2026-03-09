const PHASES = [
  {
    id: 'activation',
    index: '01',
    label: 'Activation',
    duration: '8–12 min',
    optional: false,
    color: '#d4a017',
    tagline: 'Wake up the right muscles',
    description:
      'Targeted isometric and low-load exercises chosen specifically from your MAT results. The goal is to fire inhibited muscles before they\'re asked to perform under load.',
    exercises: [
      'Isometric glute press — 3 × 30s',
      'Supine hip flexor activation — 2 × 20 reps',
      'Scapular wall slides — 3 × 12',
    ],
    why: 'Skipping activation means your compensatory muscles take over during every working set. This phase ensures the right tissue is online.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'integration',
    index: '02',
    label: 'Integration',
    duration: '10–15 min',
    optional: false,
    color: '#c49010',
    tagline: 'Translate isolation into movement',
    description:
      'Compound patterns that bridge the gap between the activated muscles and real-world movement. Think of this as teaching your nervous system to use what was just switched on.',
    exercises: [
      'Goblet squat — 3 × 10 @ controlled tempo',
      'Single-arm cable row — 3 × 12 each side',
      'Split squat — 3 × 8 each leg',
    ],
    why: 'Activated muscles need to be woven into patterns under slightly higher load — otherwise the isolation work stays isolated.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2" />
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M12 12h4M12 16h4M12 12v4" />
      </svg>
    ),
  },
  {
    id: 'strength',
    index: '03',
    label: 'Strength',
    duration: '25–35 min',
    optional: false,
    color: '#b07808',
    tagline: 'Build with intent',
    description:
      'The primary training block — progressive overload applied to movements your body is now prepared to perform correctly. Load, volume, and rest are all prescribed by your coach.',
    exercises: [
      'Trap bar deadlift — 4 × 5 @ RPE 8',
      'Incline press — 4 × 6–8',
      'Bulgarian split squat — 3 × 8 each',
      'Seated cable row — 3 × 10',
    ],
    why: 'Strength built on a correctly activated and integrated foundation compounds faster and with far less injury risk.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4M6 12h12" />
      </svg>
    ),
  },
  {
    id: 'conditioning',
    index: '04',
    label: 'Conditioning',
    duration: '10–20 min',
    optional: true,
    color: '#666',
    tagline: 'Metabolic work — when prescribed',
    description:
      'Not included in every session. Added only when your coach determines your recovery capacity and goals warrant it. Conditioning here is a tool, not a default.',
    exercises: [
      'Assault bike intervals — 6 × 20s on / 40s off',
      'Sled push — 4 × 20m',
      'Row ergometer — 3 × 500m @ 85% effort',
    ],
    why: 'Conditioning placed after strength preserves the signal. Doing cardio before heavy lifting degrades performance and muddies the adaptation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

function Phase({ phase, isLast }) {
  const isOptional = phase.optional;

  return (
    <div className="relative flex gap-5 md:gap-8">
      {/* ── Timeline spine ── */}
      <div className="flex flex-col items-center">
        {/* Node */}
        <div
          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border text-xs font-black md:h-12 md:w-12 ${
            isOptional
              ? 'border-white/15 bg-[#0d0d0d] text-white/25'
              : 'border-[#d4a017]/50 bg-[#d4a017]/10 text-[#d4a017]'
          }`}
        >
          <div className="h-5 w-5">{phase.icon}</div>
        </div>
        {/* Spine line */}
        {!isLast && (
          <div
            className="mt-1 w-px flex-1"
            style={{
              background: isOptional
                ? 'linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)'
                : 'linear-gradient(to bottom, rgba(212,160,23,0.3), rgba(212,160,23,0.05))',
              minHeight: '2rem',
            }}
          />
        )}
      </div>

      {/* ── Phase card ── */}
      <div
        className={`mb-10 flex-1 border pb-8 ${
          isLast ? 'mb-0' : ''
        } ${
          isOptional
            ? 'border-white/[0.06] bg-white/[0.01]'
            : 'border-white/[0.08] bg-white/[0.025]'
        }`}
      >
        {/* Card header */}
        <div
          className="flex items-start justify-between gap-4 p-5 pb-4"
          style={
            !isOptional
              ? { borderBottom: `1px solid ${phase.color}18` }
              : { borderBottom: '1px solid rgba(255,255,255,0.04)' }
          }
        >
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                className="text-[0.6rem] font-black uppercase tracking-[0.2em]"
                style={{ color: isOptional ? 'rgba(255,255,255,0.2)' : phase.color }}
              >
                Phase {phase.index}
              </span>
              {isOptional && (
                <span className="border border-white/10 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-widest text-white/20">
                  Optional
                </span>
              )}
            </div>
            <h3
              className={`text-xl font-black leading-none tracking-tight md:text-2xl ${
                isOptional ? 'text-white/30' : 'text-white'
              }`}
            >
              {phase.label}
            </h3>
            <p
              className={`mt-1 text-xs font-medium ${
                isOptional ? 'text-white/20' : 'text-white/45'
              }`}
            >
              {phase.tagline}
            </p>
          </div>

          {/* Duration pill */}
          <div
            className={`shrink-0 border px-3 py-1.5 text-center ${
              isOptional
                ? 'border-white/[0.06]'
                : 'border-[#d4a017]/20 bg-[#d4a017]/[0.06]'
            }`}
          >
            <p className="text-[0.55rem] font-semibold uppercase tracking-widest text-white/20">
              Duration
            </p>
            <p
              className={`mt-0.5 text-sm font-black ${
                isOptional ? 'text-white/20' : 'text-white'
              }`}
            >
              {phase.duration}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 pt-4">
          <p className={`mb-5 text-sm leading-relaxed ${isOptional ? 'text-white/25' : 'text-white/45'}`}>
            {phase.description}
          </p>

          {/* Sample exercises */}
          <div className="mb-5">
            <p className={`mb-2.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] ${isOptional ? 'text-white/15' : 'text-white/30'}`}>
              Sample Exercises
            </p>
            <ul className="flex flex-col gap-2" role="list">
              {phase.exercises.map((ex) => (
                <li
                  key={ex}
                  className={`flex items-start gap-2.5 text-xs leading-snug ${
                    isOptional ? 'text-white/20' : 'text-white/55'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                    style={{ background: isOptional ? 'rgba(255,255,255,0.15)' : phase.color }}
                  />
                  {ex}
                </li>
              ))}
            </ul>
          </div>

          {/* Why this phase */}
          <div
            className={`flex items-start gap-3 px-3.5 py-3 ${
              isOptional
                ? 'bg-white/[0.02] border border-white/[0.04]'
                : 'border-l-2'
            }`}
            style={
              !isOptional
                ? { borderLeftColor: phase.color, background: `${phase.color}08` }
                : {}
            }
          >
            <svg
              aria-hidden="true"
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              style={{ color: isOptional ? 'rgba(255,255,255,0.15)' : phase.color }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
            </svg>
            <p className={`text-xs leading-relaxed ${isOptional ? 'text-white/20' : 'text-white/40'}`}>
              {phase.why}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkoutStructure() {
  const totalMin = '53–82';

  return (
    <section
      id="workout-structure"
      className="relative overflow-hidden bg-[#0d0d0d] py-24 md:py-32"
      aria-labelledby="workout-heading"
    >
      {/* Top rule */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14 md:mb-16">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a017]">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-[#d4a017]" />
            Session Design
          </p>
          <h2
            id="workout-heading"
            className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-tight text-white"
          >
            How a Session{' '}
            <span className="text-[#d4a017]">Is Built</span>
          </h2>
          <p className="mt-4 max-w-lg text-base text-white/40">
            Every Iso-Body session follows the same four-phase structure — ordered deliberately so each phase sets up the next.
          </p>

          {/* Total time bar */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex flex-1 overflow-hidden rounded-none">
              {[
                { pct: 14, label: 'Activation', color: '#d4a017' },
                { pct: 20, label: 'Integration', color: '#c49010' },
                { pct: 50, label: 'Strength', color: '#b07808' },
                { pct: 16, label: 'Conditioning', color: '#2a2a2a' },
              ].map((seg) => (
                <div
                  key={seg.label}
                  aria-label={`${seg.label}: ${seg.pct}%`}
                  className="h-2 transition-all"
                  style={{ width: `${seg.pct}%`, background: seg.color }}
                  title={seg.label}
                />
              ))}
            </div>
            <span className="shrink-0 text-xs text-white/30">
              ~{totalMin} min total
            </span>
          </div>

          {/* Bar legend */}
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {[
              { label: 'Activation', color: '#d4a017' },
              { label: 'Integration', color: '#c49010' },
              { label: 'Strength', color: '#b07808' },
              { label: 'Conditioning', color: '#444' },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5 text-[0.6rem] text-white/30">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          {PHASES.map((phase, i) => (
            <Phase
              key={phase.id}
              phase={phase}
              isLast={i === PHASES.length - 1}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 border-t border-white/[0.06] pt-6 text-xs leading-relaxed text-white/20">
          Sample exercises shown are illustrative. Your actual program is prescribed by your coach based on your MAT assessment results and current training capacity.
        </p>

      </div>

      {/* Bottom rule */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent" />
    </section>
  );
}
