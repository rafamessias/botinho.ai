"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Globe, ArrowLeft } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { logoutAction } from "@/components/actions/logout-action"
import { useUser } from "@/components/UserProvider"
import { useLoading } from "@/components/LoadingProvider"
import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { LanguageSwitch } from "@/components/language-switch"

export default function Header() {
  const { user, setUser } = useUser();
  const { setIsLoading } = useLoading();
  const [userName, setUserName] = useState('');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('header');

  // Check if user is a project user
  const isProjectUser = user?.type === 'projectUser';

  useEffect(() => {
    if (user) {
      setUserName(user.firstName.charAt(0) + user.lastName.charAt(0));
      setCompanyId(user?.company?.documentId);
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoading(true); // Set loading state to true
    setUser(null); // Clear user context
    await fetch('/api/logout', { method: 'POST' });
    router.push('/sign-in'); // Redirect to sign in page
    setIsLoading(false); // Set loading state to false
  };

  return user ? (
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
          {/* Only show create button for non-project users */}
          {user.company && !isProjectUser && (
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
              {!isProjectUser && (
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

export function SubHeader({ title, showBackButton = false }: { title: string, showBackButton?: boolean }) {
  const router = useRouter();
  return (
    <div className="w-full h-12 sm:h-16 bg-muted border-b flex justify-start items-center py-2">
      <div className="container max-w-[1280px] flex justify-start items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-base sm:text-lg font-normal">{title}</h2>
      </div>
    </div>
  );
}
