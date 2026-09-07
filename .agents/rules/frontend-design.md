# Frontend Design Standard

Whenever asked to create or modify frontend UI without a specific design provided:
- **Design Language**: Follow modern SaaS aesthetics (similar to Linear, Vercel, Raycast, Stripe).
- **Theme**: Premium dark mode by default with balanced contrast (e.g., `bg-zinc-950`, borders `border-zinc-800/80`, surfaces `bg-zinc-900/50`).
- **Typography**: Modern clean fonts (Geist, Inter, Plus Jakarta Sans), explicit hierarchy (h1 with tight tracking, subtle muted captions).
- **Depth & Polish**: Use subtle glassmorphism (`backdrop-blur-md`), faint radial gradient highlights, clean 1px border dividers, and smooth transitions (`transition-all duration-200`).
- **Components**: Always use modern libraries (like `shadcn/ui`, `lucide-react`, or Tailwind) rather than plain HTML form controls or basic unstyled elements.
- **Empty States & Polish**: Include loading skeletons, subtle micro-interactions (hover states, focus rings), and sensible spacing (`gap-4`, `p-6`).
