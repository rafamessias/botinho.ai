"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProjectCard from "@/components/homePage/project-card"
import { Plus, Search } from "lucide-react"
import { fetchContentApi } from "@/components/actions/fetch-content-api"
import { useTranslations } from "next-intl"
import ContainerApp from "@/components/Container-app"
import { Project, StrapiImage } from "@/components/types/strapi"
import { useEffect, useState } from "react"
import { Link } from "@/i18n/navigation"

export default function HomePage() {
    const t = useTranslations('homepage');
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true);
                const response = await fetchContentApi<Project[]>('projects?populate=*&sort=id:desc');
                if (response.success && response.data) {
                    setAllProjects(response.data);
                    setFilteredProjects(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch projects:', error);
                setAllProjects([]);
                setFilteredProjects([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        let filtered = allProjects;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.id?.toString().includes(searchTerm)
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(project => project.projectStatus === statusFilter);
        }

        setFilteredProjects(filtered);
    }, [allProjects, searchTerm, statusFilter]);

    if (isLoading) {
        return (
            <ContainerApp form={false} title={t('home.projects')} showBackButton={false}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-muted-foreground">Loading projects...</div>
                </div>
            </ContainerApp>
        );
    }

    return (
        <ContainerApp form={false} title={t('home.projects')} showBackButton={false}>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={t('home.searchProjects')}
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder={t('home.allProjects')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('home.allProjects')}</SelectItem>
                            <SelectItem value="active">{t('home.activeProjects')}</SelectItem>
                            <SelectItem value="inactive">{t('home.inactiveProjects')}</SelectItem>
                        </SelectContent>
                    </Select>
                    {allProjects.length !== 0 && (<Link href="/project/create">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            {t('home.newProject')}
                        </Button>
                    </Link>
                    )}
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-muted-foreground text-lg mb-2">
                        {allProjects.length === 0 ? t('home.empty.noProjects') : t('home.empty.noResults')}
                    </div>
                    <p className="text-sm text-muted-foreground/70 mb-4">
                        {allProjects.length === 0
                            ? t('home.empty.getStarted')
                            : t('home.empty.adjustSearch')
                        }
                    </p>
                    {allProjects.length === 0 && (
                        <Link href="/project/create">
                            <Button className="bg-primary hover:bg-primary/90">
                                <Plus className="h-4 w-4 mr-2" />
                                {t('home.newProject')}
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <>

                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {filteredProjects.map((project: Project) => {
                            let projectImage: StrapiImage | null = null;
                            if (project.image) {
                                projectImage = project.image as StrapiImage;
                            }

                            return (
                                <ProjectCard
                                    key={project.id}
                                    id={project.id?.toString() || ''}
                                    documentId={project.documentId || ''}
                                    title={project.name}
                                    description={project.description}
                                    imageUrl={projectImage?.url || ''}
                                    isActive={project.projectStatus === "active"}
                                />
                            )
                        })}
                    </div>
                </>
            )}
        </ContainerApp>
    );
} 