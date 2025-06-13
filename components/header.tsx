"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { logoutAction } from "@/components/actions/logout-action"
import { useUser } from "./UserProvider"
import { useLoading } from "./LoadingProvider"
import { useState, useEffect } from "react"
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { LanguageSwitch } from "./language-switch"

export default function Header() {
  const { user, setUser } = useUser();
  const { setIsLoading } = useLoading();
  const [userName, setUserName] = useState('');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('header');

  useEffect(() => {
    if (user) {
      setUserName(user.firstName.charAt(0) + user.lastName.charAt(0));
      setCompanyId(user?.company?.documentId);
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoading(true); // Set loading state to true
    setUser(null); // Clear user context
    await logoutAction(); // Call logout action
    //router.push('/sign-in'); // Redirect to sign in page
  };

  const handleLanguageChange = (newLocale: string) => {
    // Get the current path without the locale prefix
    const path = window.location.pathname.replace(`/${locale}`, '');
    // Navigate to the same path with the new locale
    router.push(`/${newLocale}${path}`);
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
          {user.company && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                  {t('create')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer w-full">
                  <Link href="/rdo/create" className="w-full">{t('createRDO')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer w-full">
                  <Link href="/project/create" className="w-full">{t('createProject')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer w-full">
                  <Link href="/incident/create" className="w-full">{t('createIncident')}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {userName ? (
                    <span className="text-sm font-medium">{userName}</span>
                  ) : (
                    <span className="text-sm font-medium">OG</span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user.company && (
                <>
                  <DropdownMenuItem className="cursor-pointer w-full">
                    <Link href="/profile" className="w-full">{t('profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer w-full">
                    <Link href={`/company/${companyId}`} className="w-full">{t('company')}</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer w-full" >
                <LanguageSwitch />
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
