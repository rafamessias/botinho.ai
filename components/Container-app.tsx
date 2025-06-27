import { SubHeader } from "./header";
import { LoadingOverlay } from "./LoadingOverlay";


const ContainerApp = ({ children, form = true, title = "", showBackButton = false }: { children: React.ReactNode, form?: boolean, title?: string, showBackButton?: boolean }) => {
    return (
        <>
            {title && <SubHeader title={title} showBackButton={showBackButton} />}
            <div className="container max-w-[1280px] pb-12 pt-6 sm:pt-12">
                <div className={`relative mx-auto w-full ${form ? 'max-w-[680px]  px-6 py-6 bg-white rounded-lg shadow-md' : ''}`}>
                    <LoadingOverlay />
                    {children}
                </div>
            </div>
        </>
    );
};

export default ContainerApp;