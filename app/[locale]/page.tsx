import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProjectCard from "@/components/homePage/project-card"
import { Plus, Search } from "lucide-react"
import { fetchContentApi } from "@/components/actions/fetch-content-api"
import { getTranslations } from "next-intl/server"
import ContainerApp from "@/components/Container-app"
import { Project } from "@/components/types/strapi"
export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'homepage' });

    let allProjects: any;
    try {
        allProjects = await fetchContentApi<Project>('projects?populate=*')

    } catch (error) {
        console.error('Failed to fetch projects:', error);
        allProjects = { data: [] };
    }

    return (
        <ContainerApp form={false}>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full ">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder={t('home.searchProjects')} className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10 bg-white" />
                </div>
                <div className="flex items-center gap-4">
                    <Select defaultValue="todos">
                        <SelectTrigger className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full sm:w-[180px] bg-white">
                            <SelectValue>{t('home.allProjects')}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">{t('home.allProjects')}</SelectItem>
                            <SelectItem value="ativos">{t('home.activeProjects')}</SelectItem>
                            <SelectItem value="inativos">{t('home.inactiveProjects')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="bg-primary hover:bg-primary/80">
                        <Plus className="h-4 w-4" />
                        {t('home.newProject')}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {allProjects.data.map((project: any) => (
                    <ProjectCard
                        key={project.id}
                        id={project.id}
                        documentId={project.documentId}
                        title={project.name}
                        description={project.description}
                        imageUrl={project.image?.url}
                        isActive={project.projectStatus === "active"}
                    />
                ))}
            </div>

        </ContainerApp>
    );
} 