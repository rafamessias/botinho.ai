import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProjectCard from "@/components/project-card"
import { Plus, Search } from "lucide-react"

export default function Home() {
  return (
    <div className="container py-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full ">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar projetos..." className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10 bg-white" />
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="todos">
            <SelectTrigger className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full sm:w-[180px] bg-white">
              <SelectValue>Todos os Projetos</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Projetos</SelectItem>
              <SelectItem value="ativos">Projetos Ativos</SelectItem>
              <SelectItem value="inativos">Projetos Inativos</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#3B82F6] hover:bg-blue-600">
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {[{ title: "construcao 1", description: "descricao 1", imageUrl: "https://placehold.co/600x400.png", isActive: true }, { title: "construcao 2", description: "descricao 2", imageUrl: "https://placehold.co/600x400.png", isActive: true }, { title: "construcao 3", description: "descricao 3", imageUrl: "https://placehold.co/600x400.png", isActive: false }].map((project) => (
          <ProjectCard
            title={project.title}
            key={project.title}
            description={project.description}
            imageUrl={project.imageUrl}
            isActive={project.isActive}
          />
        ))}

        <ProjectCard
          title="Construcao Maria 2"
          description="Projeto para construcao da casa da maria..."
          imageUrl="https://placehold.co/600x400.png"
          isActive={true}
        />
        <ProjectCard
          title="Construção casa de José"
          description="ssdfasfasd"
          imageUrl="https://placehold.co/600x400.png"
          isActive={true}
        />
      </div>
    </div>
  )
}
