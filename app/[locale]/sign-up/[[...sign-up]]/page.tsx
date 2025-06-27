import SignUpForm from "./sign-up-form";

export default async function SignUpPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    return (
        <div className="flex items-center justify-center xs:h-full sm:h-dvh py-12 md:py-0">
            <SignUpForm params={{ locale }} />
        </div>
    );
} 