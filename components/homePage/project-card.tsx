"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoIcon } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { useTranslations } from 'next-intl'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  isActive?: boolean
  priority?: boolean
  documentId: string
}

export default function ProjectCard({ id, title, description, imageUrl, isActive = true, priority = false, documentId }: ProjectCardProps) {
  const t = useTranslations('homepage.projectCard')
  const image = imageUrl ? imageUrl : "/placeholder-image.webp"

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
            {t('active')}
          </Badge>
        ) : (
          <Badge className="absolute right-3 top-3 bg-gray-100 text-gray-900 px-3 py-1 text-sm font-medium hover:bg-gray-100">
            {t('inactive')}
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
        <Link href={`/feed/${id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90">{t('viewUpdates')}</Button>
        </Link>
        <Link href={`/project/${documentId}`} >
          <Button variant="ghost" size="icon" className="h-10 w-10 border border-gray-300">
            <InfoIcon className="h-4 w-4" />
            <span className="sr-only">{t('information')}</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
