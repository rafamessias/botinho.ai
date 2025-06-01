

const ContainerApp = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full py-12">
            {children}
        </div>
    );
};

export default ContainerApp;