import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-background border border-border shadow-sm",
                        headerTitle: "text-foreground",
                        headerSubtitle: "text-muted-foreground",
                        socialButtonsBlockButton: "bg-background text-foreground border border-border hover:bg-accent hover:text-accent-foreground",
                        formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
                        footerActionLink: "text-primary hover:text-primary/90",
                        formFieldLabel: "text-foreground",
                        formFieldInput: "bg-background text-foreground border border-input",
                        dividerLine: "bg-border",
                        dividerText: "text-muted-foreground",
                    },
                }}
            />
        </div>
    );
} 