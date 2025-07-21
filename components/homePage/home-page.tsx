"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProjectCard from "@/components/homePage/project-card"
import { Plus, Search, Loader2, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Project, StrapiImage } from "@/components/types/strapi"
import { useEffect, useState, useCallback } from "react"
import { Link } from "@/i18n/navigation"
import { useUser } from "@/components/UserProvider"
import { getFilteredProjects, searchProjects } from "@/components/actions/project-actions"

interface HomePageProps {
    initialProjects: Project[];
}

export default function HomePage({ initialProjects }: HomePageProps) {
    const t = useTranslations('homepage');
    const { user } = useUser();
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('active');
    const [loading, setLoading] = useState(false);

    // Check if user is a project user
    const isProjectUser = user?.type === 'projectUser';

    // Update projects when initialProjects prop changes
    useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects]);

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId: NodeJS.Timeout;
            return (search: string, status: string) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(async () => {
                    setLoading(true);
                    try {
                        let response;
                        if (search.trim()) {
                            response = await searchProjects(search, status);
                        } else {
                            response = await getFilteredProjects(status);
                        }

                        if (response.success && response.data) {
                            setProjects(response.data);
                        }
                    } catch (error) {
                        console.error('Error fetching projects:', error);
                    } finally {
                        setLoading(false);
                    }
                }, 300); // 300ms delay
            };
        })(),
        []
    );

    // Handle status filter change
    const handleStatusChange = async (status: string) => {
        setStatusFilter(status);
        setLoading(true);
        try {
            let response;
            if (searchTerm.trim()) {
                response = await searchProjects(searchTerm, status);
            } else {
                response = await getFilteredProjects(status);
            }

            if (response.success && response.data) {
                setProjects(response.data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle search term change
    const handleSearchChange = (search: string) => {
        setSearchTerm(search);
        debouncedSearch(search, statusFilter);
    };

    return (
        <>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder={t('home.searchProjects')}
                        className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-10 bg-white"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            aria-label={t('home.clearSearch') || 'Clear search'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                            onClick={() => handleSearchChange('')}
                            tabIndex={0}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder={t('home.allProjects')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('home.allProjects')}</SelectItem>
                            <SelectItem value="active">{t('home.activeProjects')}</SelectItem>
                            <SelectItem value="inactive">{t('home.inactiveProjects')}</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Only show create button for non-project users */}
                    {projects.length !== 0 && !isProjectUser && (
                        <Link href="/project/create">
                            <Button className="bg-primary hover:bg-primary/90">
                                <Plus className="h-4 w-4 mr-2" />
                                {t('home.newProject')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            )}

            {!loading && projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-muted-foreground text-lg mb-2">
                        {searchTerm || statusFilter !== 'active' ? t('home.empty.noResults') : t('home.empty.noProjects')}
                    </div>
                    <p className="text-sm text-muted-foreground/70 mb-4">
                        {searchTerm || statusFilter !== 'active'
                            ? t('home.empty.adjustSearch')
                            : t('home.empty.getStarted')
                        }
                    </p>
                    {/* Only show create button for non-project users */}
                    {!searchTerm && !isProjectUser && (
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
                        {projects.map((project: Project) => {
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
        </>
    );
} 