import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';

const NAV_LINKS = [
  { label: 'Home',         to: '/' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Features',     to: '/features' },
  { label: 'Community',    to: '/community' },
  { label: 'Pricing',      to: '/pricing' },
];

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openModal }           = useModal();

  /* Elevate navbar on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close drawer on route change & lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  const activeClass = 'text-white';
  const inactiveClass = 'text-white/40 hover:text-white';

  return (
    <>
      <header
        className={`
          fixed inset-x-0 top-0 z-50 transition-all duration-300
          ${scrolled
            ? 'border-b border-white/[0.07] bg-[#0a0a0a]/95 backdrop-blur-md'
            : 'bg-transparent'}
        `}
      >
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 lg:px-8">

          {/* ── Wordmark ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5"
            aria-label="Iso-Body Fitness — home"
            onClick={close}
          >
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center bg-[#d4a017]"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-black">
                <path d="M10 2L3 7v11h5v-6h4v6h5V7L10 2z" />
              </svg>
            </span>
            <span className="text-sm font-black uppercase tracking-[0.12em] text-white">
              Iso&#8209;Body <span className="text-[#d4a017]">Fitness</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav aria-label="Primary navigation" className="hidden md:block">
            <ul className="flex items-center gap-7" role="list">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-150 ${
                        isActive ? activeClass : inactiveClass
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Desktop CTA ── */}
          <button
            type="button"
            onClick={openModal}
            className="hidden md:inline-flex items-center gap-2 border border-[#d4a017] px-5 py-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#d4a017] transition-all duration-200 hover:bg-[#d4a017] hover:text-black"
          >
            Get Started
          </button>

          {/* ── Hamburger (mobile) ── */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span className={`block h-px w-5 bg-white transition-all duration-300 origin-center ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
            <span className={`block h-px bg-white transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-5'}`} />
            <span className={`block h-px w-5 bg-white transition-all duration-300 origin-center ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`
          fixed inset-0 z-40 flex flex-col bg-[#0a0a0a] pt-16 transition-all duration-300 md:hidden
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[#d4a017]/40 to-transparent" />

        <nav aria-label="Mobile navigation" className="flex flex-col px-6 py-8">
          <ul className="flex flex-col" role="list">
            {NAV_LINKS.map(({ label, to }, i) => (
              <li key={label}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={close}
                  className={({ isActive }) => `
                    flex items-center justify-between border-b border-white/[0.06] py-5
                    text-lg font-black uppercase tracking-tight transition-colors duration-150
                    ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}
                  `}
                  style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
                >
                  {label}
                  <svg aria-hidden="true" className="h-4 w-4 text-[#d4a017]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile CTA */}
          <button
            type="button"
            onClick={() => { close(); openModal(); }}
            className="mt-8 flex w-full items-center justify-center bg-[#d4a017] px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] text-black transition-colors hover:bg-[#f0c040]"
          >
            Get Started
          </button>

          <p className="mt-4 text-center text-[0.6rem] text-white/20">
            Coach approval required for all plans
          </p>
        </nav>
      </div>
    </>
  );
}
