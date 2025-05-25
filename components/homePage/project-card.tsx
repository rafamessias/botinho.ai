"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoIcon } from "lucide-react"
import Link from "next/link"
import { strapiUrl } from "@/lib/strapi"
interface ProjectCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  isActive?: boolean
  priority?: boolean
}

export default function ProjectCard({ id, title, description, imageUrl, isActive = true, priority = false }: ProjectCardProps) {



  const image = imageUrl ? imageUrl : "/placeholder-image.webp"
  console.log(image)

  return (
    <Card className="overflow-hidden pb-6 shadow-sm hover:shadow-md">
      <div className="relative h-[200px] bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            // If image fails to load, set src to placeholder
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-image.webp"
          }}
        />
        {isActive ? (
          <Badge className="absolute right-3 top-3 bg-emerald-100 text-emerald-900 px-3 py-1 text-sm font-medium hover:bg-emerald-100">
            Ativo
          </Badge>
        ) : (
          <Badge className="absolute right-3 top-3 bg-gray-100 text-gray-900 px-3 py-1 text-sm font-medium hover:bg-gray-100">
            Inativo
          </Badge>
        )}
      </div>
      <CardHeader className="px-6 pt-3">
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex gap-2 px-6 pt-3">
        <Link href={`/rdo/${id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90">Ver Atualizações</Button>
        </Link>
        <Button variant="ghost" size="icon" className="h-10 w-10 border border-gray-300">
          <InfoIcon className="h-4 w-4" />
          <span className="sr-only">Informações</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
