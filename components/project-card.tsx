import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoIcon } from "lucide-react"

interface ProjectCardProps {
  title: string
  description: string
  imageUrl: string
  isActive?: boolean
}

export default function ProjectCard({ title, description, imageUrl, isActive = true }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden pb-6">
      <div className="relative">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={200}
          className="h-[200px] w-full object-cover"
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
        <Button className="flex-1 bg-[#3B82F6] hover:bg-blue-600">Ver Atualizações</Button>
        <Button variant="ghost" size="icon" className="h-10 w-10 border border-gray-300">
          <InfoIcon className="h-4 w-4" />
          <span className="sr-only">Informações</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
