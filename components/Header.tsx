'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { User, LogOut, Crown, BarChart3, Settings } from 'lucide-react';
import { LogoMark } from '@/components/LogoMark';

export function Header() {
  const { user, signOut, isGuest } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-slate-950/75 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/home" className="flex items-center gap-3 rounded-xl text-white transition-opacity hover:opacity-90">
              <LogoMark className="h-8 w-8 sm:h-9 sm:w-9" sizes="36px" priority />
              <div className="leading-tight">
                <span className="block text-xs font-semibold sm:text-sm">OpeningMaster</span>
                <span className="hidden text-[11px] text-slate-400 sm:block">Chess opening training</span>
              </div>
            </Link>
            {(user || isGuest) && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-cyan-400/20 hover:bg-white/[0.06] hover:text-white"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Dashboard
              </Link>
            )}
            {isGuest && (
              <div className="flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-xs text-amber-200">
                <Crown className="h-3.5 w-3.5" />
                Guest Mode
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {pathname === '/training' && (
              <Link href="/settings">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-white/10 bg-white/[0.03] px-2.5 text-[11px] text-slate-200 shadow-none hover:bg-white/[0.08] hover:text-white sm:px-3 sm:text-xs"
                >
                  <Settings className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
                  Settings
                </Button>
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden items-center gap-2 text-slate-300 sm:flex">
                  <User className="h-3.5 w-3.5" />
                  <span className="text-xs">{user.email}</span>
                </div>
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-white/10 bg-white/[0.03] px-2.5 text-[11px] text-slate-200 shadow-none hover:bg-white/[0.08] hover:text-white sm:px-3 sm:text-xs"
                >
                  <LogOut className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden xs:inline">Sign Out</span>
                  <span className="xs:hidden">Out</span>
                </Button>
              </div>
            ) : (
              <AuthModal>
                <Button variant="outline" className="h-8 rounded-full border-white/10 bg-white/[0.03] px-2.5 text-[11px] text-slate-200 shadow-none hover:bg-white/[0.08] hover:text-white sm:px-3 sm:text-xs">
                  <User className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden xs:inline">Sign In</span>
                  <span className="xs:hidden">In</span>
                </Button>
              </AuthModal>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
