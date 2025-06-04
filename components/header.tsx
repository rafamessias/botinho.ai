"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { logoutAction } from "@/components/actions/logout-action"
import { useUser } from "./UserProvider"
import { useLoading } from "./LoadingProvider"
import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const { user, setUser } = useUser();
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [companyId, setCompanyId] = useState<string | null>(null);

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
    router.push('/sign-in'); // Redirect to sign in page
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
                  Criar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer w-full">
                  <Link href="/rdo/create" className="w-full">Criar RDO</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer w-full">
                  <Link href="/project/create" className="w-full">Criar Projeto</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer w-full">
                  <Link href="/incident/create" className="w-full">Criar Incidente</Link>
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
                    <Link href="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer w-full">
                    <Link href={`/company/${companyId}`} className="w-full">Company</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem className="cursor-pointer w-full" onClick={handleLogout}>
                Logoff
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  ) : null
}
