import { LoadingOverlay } from "./LoadingOverlay";


const ContainerApp = ({ children, form = true }: { children: React.ReactNode, form?: boolean }) => {
    return (
        <div className="py-12">
            <div className={`relative mx-auto w-full ${form ? 'max-w-[680px]  px-6 py-6 bg-white rounded-lg shadow-md' : ''}`}>
                <LoadingOverlay />
                {children}
            </div>
        </div>
    );
};

export default ContainerApp;