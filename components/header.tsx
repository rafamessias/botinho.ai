"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { logoutAction } from "@/components/actions/logout-action"
import { useUser } from "./UserProvider"
import { useState } from "react"
import { useEffect } from "react"

export default function Header() {
  const { user } = useUser();

  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      setUserName(user.firstName.charAt(0) + user.lastName.charAt(0));
    }
  }, [user]);

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
                <Link href="/projeto/create" className="w-full">Criar Projeto</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer w-full">
                <Link href="/incidente/create" className="w-full">Criar Incidente</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {userName ? (
                    <span className="text-sm font-medium">{userName}</span>
                  ) : (
                    <span className="text-sm font-medium">OG</span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer w-full">
                <Link href="/profile" className="w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer w-full">
                <Link href="/company" className="w-full">Company</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer w-full" onClick={logoutAction}>
                Logoff
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  ) : null
}
