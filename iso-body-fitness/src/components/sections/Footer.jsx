const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Community', href: '#community' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[#0a0a0a]">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          {/* Brand */}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.15em] text-white">
              Iso&#8209;Body{' '}
              <span className="text-[#d4a017]">Fitness</span>
            </p>
            <p className="mt-1 text-[0.65rem] leading-relaxed text-white/20 max-w-xs">
              All programs require coach review before activation.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-xs text-white/30 transition-colors duration-150 hover:text-[#d4a017]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        {/* Bottom line */}
        <div className="mt-8 border-t border-white/[0.05] pt-6 flex flex-col gap-1 sm:flex-row sm:justify-between">
          <p className="text-[0.6rem] text-white/15">
            © {new Date().getFullYear()} Iso-Body Fitness. All rights reserved.
          </p>
          <p className="text-[0.6rem] text-white/15">
            MAT® is a registered trademark of Muscle Activation Techniques, LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}
