import Button from '../ui/Button';
import { useModal } from '../../context/ModalContext';

const STATS = [
  { value: '500+', label: 'Athletes Trained' },
  { value: '94%', label: 'Injury Reduction' },
  { value: '12 wk', label: 'Avg. Transformation' },
];

export default function Hero() {
  const { openModal } = useModal();
  return (
    <section
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#0a0a0a]"
      aria-label="Hero"
    >
      {/* ── Background layer stack ── */}

      {/* Grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#d4a017 1px, transparent 1px), linear-gradient(90deg, #d4a017 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Large diagonal gold slash — right side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-0 h-full w-[55%] origin-top-right opacity-[0.06]"
        style={{
          background: 'linear-gradient(135deg, #d4a017 0%, transparent 60%)',
          transform: 'skewX(-12deg)',
        }}
      />

      {/* Gold glow — top-right corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[700px] w-[700px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 65%)' }}
      />

      {/* Gold glow — bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #d4a017 0%, transparent 65%)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-28 md:py-36 lg:px-8">

        {/* Eyebrow */}
        <div className="mb-8 inline-flex items-center gap-3 rounded-none border border-[#d4a017]/30 bg-[#d4a017]/5 px-4 py-2">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d4a017]"
          />
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d4a017]">
            Muscle Activation Techniques
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.97] tracking-[-0.02em] text-white">
          Precision{' '}
          <span
            className="relative inline-block text-[#d4a017]"
            style={{ WebkitTextStroke: '0px' }}
          >
            Fitness.
          </span>
          <br />
          <span className="text-white/90">Coach&#8209;Led.</span>
          <br />
          <span
            className="relative"
            style={{
              background: 'linear-gradient(90deg, #ffffff 60%, #d4a017 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Built for You.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-xl text-[1.05rem] leading-relaxed text-white/50 md:text-lg">
          Our MAT-based assessment identifies the root cause of muscular
          imbalances — then your certified coach builds a program around{' '}
          <em className="not-italic text-white/80">your</em> body, not a
          generic template.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button variant="primary" onClick={openModal}>
            Get Started
          </Button>
          <Button variant="ghost" href="#learn-more">
            Learn More
            <svg
              aria-hidden="true"
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-10 sm:gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[clamp(1.6rem,4vw,2.4rem)] font-black leading-none tracking-tight text-[#d4a017]">
                {value}
              </span>
              <span className="text-[0.7rem] font-medium uppercase tracking-widest text-white/40">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical side label */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 right-6 hidden rotate-90 origin-right items-center gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white/20 lg:flex"
      >
        <span className="inline-block h-px w-8 bg-white/20" />
        Iso&#8209;Body Fitness
      </div>

      {/* Bottom gold rule */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4a017]/50 to-transparent"
      />
    </section>
  );
}
