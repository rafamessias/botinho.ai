import { emailConfig } from '@/lib/emailConfig';
import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Row,
    Hr,
} from '@react-email/components';
import * as React from 'react';

interface TeamInvitationEmailProps {
    userName?: string;
    inviterName?: string;
    teamName?: string;
    invitationUrl?: string;
    lang?: string;
    baseUrl?: string;
    password?: string;
}

const TeamInvitationEmail = ({
    userName = 'User',
    inviterName = 'Team Member',
    teamName = 'Team',
    password = '',
    invitationUrl = 'https://example.com',
    lang = 'en',
    baseUrl = 'http://localhost:3000'
}: TeamInvitationEmailProps) => {
    const isPt = lang === 'pt-BR' || lang === 'pt_BR';

    const { companyName, logoURL } = emailConfig;

    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>
                    {isPt
                        ? `${companyName} - Você foi convidado para a equipe ${teamName}!`
                        : `${companyName} - You've been invited to join ${teamName}!`
                    }
                </Preview>
                <Container style={container}>
                    <Img
                        src={logoURL}
                        width="40"
                        height="40"
                        alt={companyName}
                        style={logo}
                    />
                    <Section>
                        <Text style={text}>
                            {isPt ? `Olá ${userName},` : `Hi ${userName},`}
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? `Você foi convidado(a) para se juntar à equipe "${teamName}" no ${companyName}.`
                                : `You've been invited to join the team "${teamName}" on ${companyName}.`
                            }
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? `Como membro da equipe, você terá acesso as pesquisas e resultados para colaborar com a equipe.`
                                : 'As a team member, you\'ll have access to surveys and results to collaborate with the team.'
                            }
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? `O ${companyName} oferece uma plataforma completa para gerenciamento de pesquisas, permitindo que equipes trabalhem de forma eficiente e organizada.`
                                : `${companyName} provides a comprehensive platform for survey management, enabling teams to work efficiently and organized.`
                            }
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? 'Clique no botão abaixo para aceitar o convite e se tornar parte da equipe:'
                                : 'Click the button below to accept the invitation and become part of the team:'
                            }
                        </Text>
                        <Button style={button} href={invitationUrl}>
                            {isPt ? 'Aceitar convite' : 'Accept invitation'}
                        </Button>

                        {password && (
                            <>
                                <Text style={text}>
                                    {isPt
                                        ? 'Sua senha temporária para acessar a plataforma:'
                                        : 'Your temporary password to access the platform:'
                                    }
                                </Text>
                                <Text style={{ ...text, fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                                    {password}
                                </Text>
                                <Text style={text}>
                                    {isPt
                                        ? 'Por favor, altere sua senha após o primeiro acesso para garantir a segurança da sua conta.'
                                        : 'Please change your password after your first login to ensure your account\'s security.'
                                    }
                                </Text>
                            </>
                        )}

                        <Text style={text}>
                            {isPt
                                ? 'Se você tiver alguma dúvida sobre a empresa ou a plataforma, não hesite em entrar em contato conosco.'
                                : 'If you have any questions about the company or the platform, don\'t hesitate to contact us.'
                            }
                        </Text>
                        <Hr style={hr} />
                        <Text style={text}>
                            {isPt
                                ? 'Se você não conseguiu clicar no botão acima, copie e cole o link abaixo:'
                                : 'If you could not click the button above, copy and paste the URL below:'
                            }
                        </Text>
                        <Text style={anchor}>
                            {invitationUrl}
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? 'Este convite expira em 7 dias por motivos de segurança.'
                                : 'This invitation expires in 7 days for security reasons.'
                            }
                        </Text>
                    </Section>
                </Container>

                <Section style={footer}>
                    <Row>
                        <Text style={{ textAlign: 'center', color: '#706a7b' }}>
                            {isPt ? `© 2025 ${companyName}, Todos os direitos reservados` : `© 2025 ${companyName}, All Rights Reserved`}
                        </Text>
                    </Row>
                </Section>

            </Body>
        </Html>
    );
};

TeamInvitationEmail.PreviewProps = {
    userName: 'Carlos Oliveira',
    inviterName: 'Ana Costa',
    companyName: 'Tech Solutions Ltda',
    invitationUrl: 'http://localhost:3000/company-invite/xyz789',
    lang: 'pt-BR',
    baseUrl: 'http://localhost:3000',
    password: '123456',
};

const main = {
    backgroundColor: '#f6f9fc',
    padding: '10px 0',
};

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    padding: '45px',
    borderRadius: '10px',
};

const logo = {
    width: '40px',
    height: '40px',
    borderRadius: '10%',
};

const text = {
    fontSize: '16px',
    fontFamily:
        "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: '300',
    color: '#404040',
    lineHeight: '26px',
};

const button = {
    backgroundColor: 'oklch(0.6 0.15 285)',
    borderRadius: '4px',
    color: '#fff',
    fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
    fontSize: '15px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '210px',
    padding: '14px 7px',
};

const anchor = {
    textDecoration: 'underline',
    fontSize: '16px',
    fontFamily:
        "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: '300',
    color: '#404040',
};

const footer = {
    maxWidth: '580px',
    margin: '0 auto',
};

const hr = {
    borderColor: '#e6e6e6',
    margin: '20px 0',
};

export default TeamInvitationEmail; 