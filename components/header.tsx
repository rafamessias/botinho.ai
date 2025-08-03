"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, Eye, Pencil } from "lucide-react"
//import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useUser } from "@/components/UserProvider"
import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { LanguageSwitch } from "@/components/language-switch"
import { signOut } from "next-auth/react"

export default function Header() {
  const { user, setUser, companyMemberCanPost, companyMemberIsAdmin, loading } = useUser();
  const { setLoading } = useUser();
  const [userName, setUserName] = useState('');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const t = useTranslations('header');

  // Check if user is a project user
  const isProjectUser = user?.type === 'projectUser';

  useEffect(() => {
    if (user) {
      setUserName(user?.firstName?.charAt(0) + user?.lastName?.charAt(0));
      setCompanyId(user?.company?.id);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, [setLoading]);

  // Scroll handler for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 64) {
        // Scrolling down and past header height
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    setLoading(true);
    setUser(null);
    // signOut with redirect: false to control navigation manually
    await signOut({ redirect: false });

    // Add timestamp to force cache refresh
    const timestamp = Date.now();
    router.push(`/sign-in?_t=${timestamp}`);

  };

  // Don't render header content while loading
  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-header">
        <div className="container max-w-[1280px] flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-700 text-white">
                <Logo className="h-10 w-10 text-blue-700" />
              </div>
              <span className="text-lg font-semibold">Obraguru</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return user ? (
    <header className={`sticky top-0 z-50 w-full border-b bg-header transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="container max-w-[1280px] flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-700 text-white">
              <Logo className="h-10 w-10 text-blue-700" />
            </div>
            <span className="text-lg font-semibold">Obraguru</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* Only show create button for non-project users */}
          {companyMemberCanPost && !isProjectUser && (
            <DropdownMenu open={createDropdownOpen} onOpenChange={setCreateDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                  {t('create')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer w-full" onClick={() => setCreateDropdownOpen(false)}>
                  <Link href="/rdo/create" className="w-full">{t('createRDO')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer w-full" onClick={() => setCreateDropdownOpen(false)}>
                  <Link href="/project/create" className="w-full">{t('createProject')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer w-full" onClick={() => setCreateDropdownOpen(false)}>
                  <Link href="/incident/create" className="w-full">{t('createIncident')}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {user.avatar && typeof user.avatar === 'object' && 'formats' in user.avatar ? (
                    <img
                      src={user.avatar.formats.thumbnail.url}
                      alt={userName || 'User avatar'}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : userName ? (
                    <span className="text-sm font-medium">{userName}</span>
                  ) : (
                    <span className="text-sm font-medium">OG</span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">

              <DropdownMenuItem className="cursor-pointer w-full" onClick={() => setUserDropdownOpen(false)}>
                <Link href="/profile" className="w-full">{t('profile')}</Link>
              </DropdownMenuItem>
              {!isProjectUser && companyMemberIsAdmin && (
                <>
                  <DropdownMenuItem className="cursor-pointer w-full" onClick={() => setUserDropdownOpen(false)}>
                    <Link href={`/company/${companyId}`} className="w-full">{t('company')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer w-full" onClick={() => setUserDropdownOpen(false)}>
                    <Link href={`/subscription`} className="w-full">{t('subscription')}</Link>
                  </DropdownMenuItem>
                </>
              )}


              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer w-full" onClick={() => setUserDropdownOpen(false)}>
                <LanguageSwitch userId={user.id?.toString()} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer w-full" onClick={handleLogout}>
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  ) : null
}

export function SubHeader({ title, showBackButton = false, editButton = "" }: { title: string, showBackButton?: boolean, editButton?: string }) {
  const router = useRouter();
  const { user, loading } = useUser();
  const isProjectUser = user?.type === 'projectUser';
  const [isMainHeaderVisible, setIsMainHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll handler for SubHeader positioning only
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only control positioning based on main header visibility
      if (currentScrollY > lastScrollY && currentScrollY > 64) {
        // Scrolling down and past header height - main header will be hidden
        setIsMainHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - main header will be visible
        setIsMainHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Don't render subheader while loading
  if (loading) {
    return (
      <div className="w-full h-12 sm:h-16 bg-muted border-b flex justify-start items-center py-2 sticky top-16 z-40">
        <div className="container max-w-[1280px] flex justify-start items-center">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-12 sm:h-16 bg-muted border-b flex justify-start items-center py-2 sticky top-16 z-40 transition-transform duration-300 ${!isMainHeaderVisible ? '-translate-y-16' : 'translate-y-0'}`}>
      <div className="container max-w-[1280px] flex justify-start items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-base sm:text-lg font-normal">{title}</h2>
        {editButton && (
          <>
            <Button variant="ghost" size="icon" onClick={() => router.push(editButton.replace('/edit/', '/view/'))} className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
            {!isProjectUser && (
              <Button variant="ghost" size="icon" onClick={() => router.push(editButton)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
