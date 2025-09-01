import React from 'react'
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Img,
} from '@react-email/components'

interface CompanyInvitationEmailProps {
    userName: string
    companyName: string
    invitedBy: string
    invitationLink: string
    lang?: string
    baseUrl?: string
}

const main = {
    backgroundColor: '#ffffff',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
}

const logo = {
    margin: '0 auto',
}

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#484848',
}

const btnContainer = {
    textAlign: 'center' as const,
}

const button = {
    backgroundColor: '#000',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px',
    margin: '16px auto',
    maxWidth: '200px',
}

const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
}

const footer = {
    color: '#9ca299',
    fontSize: '14px',
    marginBottom: '10px',
}

const CompanyInvitationEmail: React.FC<CompanyInvitationEmailProps> = ({
    userName,
    companyName,
    invitedBy,
    invitationLink,
    lang = 'en',
    baseUrl = 'http://localhost:3000',
}) => {
    const isPortuguese = lang === 'pt-BR'

    const translations = {
        en: {
            subject: `Invitation to join ${companyName}`,
            preview: `${invitedBy} invited you to join ${companyName}`,
            greeting: `Hi ${userName},`,
            invitationText: `${invitedBy} has invited you to join ${companyName} on our platform.`,
            benefitsTitle: 'As a team member, you will be able to:',
            benefits: [
                'Collaborate with your team members',
                'Access company resources and tools',
                'Participate in team discussions',
                'Manage projects and tasks together',
            ],
            acceptButton: 'Accept Invitation',
            alternativeText: 'If the button above doesn\'t work, copy and paste this link into your browser:',
            footerText: 'If you don\'t want to join this company, you can safely ignore this email.',
            regards: 'Best regards,',
            teamName: 'The SaaS Framework Team',
        },
        'pt-BR': {
            subject: `Convite para se juntar à ${companyName}`,
            preview: `${invitedBy} convidou você para se juntar à ${companyName}`,
            greeting: `Olá ${userName},`,
            invitationText: `${invitedBy} convidou você para se juntar à ${companyName} em nossa plataforma.`,
            benefitsTitle: 'Como membro da equipe, você poderá:',
            benefits: [
                'Colaborar com os membros da sua equipe',
                'Acessar recursos e ferramentas da empresa',
                'Participar de discussões da equipe',
                'Gerenciar projetos e tarefas em conjunto',
            ],
            acceptButton: 'Aceitar Convite',
            alternativeText: 'Se o botão acima não funcionar, copie e cole este link no seu navegador:',
            footerText: 'Se você não quiser se juntar a esta empresa, pode ignorar este email com segurança.',
            regards: 'Atenciosamente,',
            teamName: 'Equipe SaaS Framework',
        },
    }

    const t = translations[isPortuguese ? 'pt-BR' : 'en']

    return (
        <Html>
            <Head />
            <Preview>{t.preview}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logo}>
                        <Img
                            src={`${baseUrl}/placeholder-logo.png`}
                            width="40"
                            height="40"
                            alt="SaaS Framework"
                        />
                    </Section>
                    <Heading
                        style={{
                            fontSize: '24px',
                            lineHeight: '1.3',
                            fontWeight: '700',
                            color: '#484848',
                            textAlign: 'center',
                        }}
                    >
                        {t.subject}
                    </Heading>
                    <Text style={paragraph}>{t.greeting}</Text>
                    <Text style={paragraph}>{t.invitationText}</Text>

                    <Text style={paragraph}>{t.benefitsTitle}</Text>
                    <ul style={{ ...paragraph, paddingLeft: '20px' }}>
                        {t.benefits.map((benefit, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <Section style={btnContainer}>
                        <Link style={button} href={invitationLink}>
                            {t.acceptButton}
                        </Link>
                    </Section>

                    <Text style={paragraph}>
                        {t.alternativeText}
                    </Text>
                    <Text style={{ ...paragraph, fontSize: '14px', color: '#9ca299' }}>
                        {invitationLink}
                    </Text>

                    <hr style={hr} />

                    <Text style={footer}>
                        {t.footerText}
                    </Text>

                    <Text style={footer}>
                        {t.regards}
                        <br />
                        {t.teamName}
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

export default CompanyInvitationEmail