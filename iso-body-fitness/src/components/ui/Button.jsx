export default function Button({ children, variant = 'primary', href, onClick, className = '' }) {
  const base =
    'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-none px-7 py-4 text-sm uppercase';

  const variants = {
    primary:
      'bg-[#d4a017] text-black hover:bg-[#f0c040] focus-visible:ring-[#d4a017]',
    outline:
      'border border-[#d4a017] text-[#d4a017] hover:bg-[#d4a017] hover:text-black focus-visible:ring-[#d4a017]',
    ghost:
      'group text-white/70 hover:text-white normal-case tracking-normal focus-visible:ring-white/40',
  };

  const classes = `${base} ${variants[variant] ?? ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
