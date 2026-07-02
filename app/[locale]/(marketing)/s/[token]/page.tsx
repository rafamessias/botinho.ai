import PublicSurveyPage from "@/components/customer-interaction/public-survey-page"

type PageProps = {
  params: Promise<{ locale: string; token: string }>
}

export default async function HostedSurveyRoutePage({ params }: PageProps) {
  const { token } = await params
  return <PublicSurveyPage accessToken={token} />
}
