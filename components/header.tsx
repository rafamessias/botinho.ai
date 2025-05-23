"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Infinity } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export default function Header() {
  const { theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-header">
      <div className="container max-w-[1280px] flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-700 text-white">
              <Logo className="h-10 w-10 text-[#2f4679]" />
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
              <DropdownMenuItem>
                <Link href="/rdo/create">Criar RDO</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/projeto/create">Criar Projeto</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/incidente/create">Criar Incidente</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
