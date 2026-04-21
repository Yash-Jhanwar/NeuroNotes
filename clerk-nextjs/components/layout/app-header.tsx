import Link from 'next/link';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

const navLinkClassName =
  'rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-black/20 hover:bg-white';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-black text-white">
            CN
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">College Notes</p>
            <p className="text-xs text-slate-500">Frontend Starter</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/" className={navLinkClassName}>
            Home
          </Link>
          <Link href="/dashboard" className={navLinkClassName}>
            Dashboard
          </Link>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className={navLinkClassName}>Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
                Get Started
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <UserButton afterSignOutUrl="/" />
          </Show>
        </nav>
      </div>
    </header>
  );
}
