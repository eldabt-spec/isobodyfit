/* Simulated feed posts for the UI mockup */
const FEED_POSTS = [
  {
    id: 1,
    type: 'coach',
    avatar: 'IB',
    name: 'Coach Devon',
    role: 'Iso-Body Coach',
    time: '2h ago',
    content:
      'Week 4 check-in reminder 🔔 — if your hip flexors are still firing during split squats, revisit the activation drill in session 3. Tag me in your video and I\'ll review tonight.',
    likes: 18,
    comments: 7,
    pinned: true,
  },
  {
    id: 2,
    type: 'accountability',
    avatar: 'MT',
    name: 'Marcus T.',
    role: 'Studio Client',
    time: '5h ago',
    content:
      '📅 Weekly thread — what\'s one thing your body told you this week? Mine: my left glute finally fired during the bridge iso-hold. First time in 8 weeks. Felt insane.',
    likes: 31,
    comments: 14,
    tag: 'Accountability Thread',
  },
  {
    id: 3,
    type: 'success',
    avatar: 'SR',
    name: 'Sarah R.',
    role: 'Remote Client',
    time: '1d ago',
    content:
      'Just hit a milestone I genuinely didn\'t think was possible 3 months ago — deadlifted 120kg pain-free. No back tightness. Zero. The reassessment last month changed everything.',
    likes: 64,
    comments: 22,
    tag: 'Success Story',
  },
];

const PILLARS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Private Member Feed',
    description: 'A focused, noise-free space — no ads, no algorithms. Just clients and coaches.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        <path d="M17 11l2 2 4-4" />
      </svg>
    ),
    title: 'Coach Posts & Cues',
    description: 'Your coach shows up in the feed — technique breakdowns, MAT insights, and timely cues.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Weekly Accountability Threads',
    description: 'Structured weekly check-ins keep you honest and your progress visible to the group.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: 'Success Stories',
    description: 'Real results from real clients — documented, tagged, and celebrated by the whole community.',
  },
];

function PostTag({ label, type }) {
  const colours = {
    coach: 'bg-[#d4a017] text-black',
    accountability: 'bg-white/10 text-white/60',
    success: 'bg-emerald-900/40 text-emerald-400',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.15em] ${colours[type] ?? colours.accountability}`}>
      {label}
    </span>
  );
}

function FeedPost({ post }) {
  return (
    <div className={`relative border p-4 transition-all duration-200 ${post.pinned ? 'border-[#d4a017]/40 bg-[#d4a017]/[0.04]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
      {post.pinned && (
        <div className="mb-2 flex items-center gap-1.5">
          <svg aria-hidden="true" className="h-3 w-3 text-[#d4a017]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-[#d4a017]/70">Pinned by Coach</span>
        </div>
      )}

      {/* Post header */}
      <div className="mb-3 flex items-start gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center text-[0.6rem] font-black ${post.type === 'coach' ? 'bg-[#d4a017] text-black' : 'bg-white/10 text-white/60'}`}>
          {post.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-xs font-bold text-white">{post.name}</span>
            <span className="text-[0.6rem] text-white/30">{post.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] text-white/20">{post.time}</span>
            {post.tag && <PostTag label={post.tag} type={post.type} />}
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="mb-3 text-xs leading-relaxed text-white/55">{post.content}</p>

      {/* Reactions */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-[0.65rem] text-white/25 transition-colors hover:text-[#d4a017]">
          <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {post.likes}
        </button>
        <button className="flex items-center gap-1.5 text-[0.65rem] text-white/25 transition-colors hover:text-white/60">
          <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.comments}
        </button>
      </div>
    </div>
  );
}

export default function Community() {
  return (
    <section
      id="community"
      className="relative overflow-hidden bg-[#0a0a0a] py-24 md:py-32"
      aria-labelledby="community-heading"
    >
      {/* Top rule */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent" />

      {/* Wide gold slash — background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-[0.03]"
        style={{ background: 'linear-gradient(135deg, transparent 30%, #d4a017 100%)' }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 lg:px-8">

        {/* Split layout: copy left, feed right */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">

          {/* ── Left: copy ── */}
          <div className="lg:sticky lg:top-16 lg:w-[42%] lg:shrink-0">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a017]">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-[#d4a017]" />
              Community
            </p>

            <h2
              id="community-heading"
              className="mb-5 text-[clamp(2rem,5vw,3.25rem)] font-black leading-[1.05] tracking-tight text-white"
            >
              Train Alone.{' '}
              <br />
              <span className="text-[#d4a017]">Never in Isolation.</span>
            </h2>

            <p className="mb-8 text-base leading-relaxed text-white/40">
              The Iso-Body community isn't a bonus feature — it's where accountability gets built. Coach posts, member wins, and weekly threads create an environment that makes it harder to quit than to keep going.
            </p>

            {/* Pillars */}
            <ul className="flex flex-col gap-5" role="list">
              {PILLARS.map((p) => (
                <li key={p.title} className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#d4a017]/25 bg-[#d4a017]/[0.08] text-[#d4a017]">
                    <div className="h-4 w-4">{p.icon}</div>
                  </div>
                  <div>
                    <p className="mb-0.5 text-sm font-bold text-white">{p.title}</p>
                    <p className="text-xs leading-relaxed text-white/35">{p.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-10">
              <a
                href="#get-started"
                className="inline-flex items-center gap-2 bg-[#d4a017] px-7 py-4 text-xs font-bold uppercase tracking-[0.15em] text-black transition-colors duration-200 hover:bg-[#f0c040]"
              >
                Join the Community
                <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <p className="mt-3 text-[0.65rem] text-white/20">
                Access granted upon coach approval
              </p>
            </div>
          </div>

          {/* ── Right: live feed mockup ── */}
          <div className="flex-1 min-w-0">
            {/* Feed chrome */}
            <div className="border border-white/[0.08] bg-[#111]">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {['bg-red-500/50','bg-yellow-500/50','bg-green-500/50'].map((c) => (
                      <span key={c} aria-hidden="true" className={`h-2 w-2 rounded-full ${c}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-[0.6rem] font-medium text-white/20 tracking-widest uppercase">Iso-Body Community</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[0.6rem] text-white/20">Live</span>
                </div>
              </div>

              {/* Feed posts */}
              <div className="flex flex-col gap-0 divide-y divide-white/[0.04] p-4 gap-3">
                {FEED_POSTS.map((post) => (
                  <FeedPost key={post.id} post={post} />
                ))}

                {/* Composer hint */}
                <div className="flex items-center gap-3 border border-dashed border-white/[0.06] p-3 mt-1">
                  <div className="h-7 w-7 shrink-0 bg-white/[0.04]" />
                  <span className="text-xs text-white/15 italic">Share your win, ask a question, or check in…</span>
                </div>
              </div>

              {/* Member count footer */}
              <div className="border-t border-white/[0.06] px-4 py-3 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {['bg-[#d4a017]','bg-white/20','bg-white/10','bg-white/15'].map((c, i) => (
                    <div key={i} aria-hidden="true" className={`h-5 w-5 rounded-full border border-[#111] ${c}`} />
                  ))}
                </div>
                <span className="text-[0.6rem] text-white/20">127 members · 23 active today</span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-3 text-[0.6rem] text-white/15 text-right">
              Posts are illustrative. Actual community content is private.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom rule */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent" />
    </section>
  );
}
