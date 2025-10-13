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

interface ProjectInvitationEmailProps {
    userName?: string;
    inviterName?: string;
    projectName?: string;
    invitationUrl?: string;
    lang?: string;
    baseUrl?: string;
    password?: string;
}

const ProjectInvitationEmail = ({
    userName = 'User',
    inviterName = 'Team Member',
    projectName = 'Project',
    invitationUrl = 'https://example.com',
    password = '',
    lang = 'en',
    baseUrl = 'http://localhost:3000'
}: ProjectInvitationEmailProps) => {
    const isPt = lang === 'pt-BR' || lang === 'pt_BR';
    const logoURL = baseUrl + '/placeholder-logo.png';

    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>
                    {isPt
                        ? `Opineeo - Você foi convidado para o time ${projectName}!`
                        : `Opineeo - You've been invited to join ${projectName}!`
                    }
                </Preview>
                <Container style={container}>
                    <Img
                        src={logoURL}
                        width="40"
                        height="40"
                        alt="Opineeo"
                        style={logo}
                    />
                    <Section>
                        <Text style={text}>
                            {isPt ? `Olá ${userName},` : `Hi ${userName},`}
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? `Você foi convidado(a) para participar do time "${projectName}" no Opineeo.`
                                : `You've been invited to join the "${projectName}" team on Opineeo.`
                            }
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? 'O Opineeo é uma plataforma poderosa para gerenciamento de pesquisas que permite colaboração eficiente, organização de tarefas e acompanhamento de progresso em tempo real.'
                                : 'Opineeo is a powerful survey management platform that enables efficient collaboration, task organization, and real-time progress tracking.'
                            }
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? 'Clique no botão abaixo para aceitar o convite e começar a colaborar imediatamente:'
                                : 'Click the button below to accept the invitation and start collaborating right away:'
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
                                ? 'Junte-se à equipe e contribua para o sucesso deste time. Estamos ansiosos para ver suas contribuições!'
                                : 'Join the team and contribute to the success of this project. We\'re excited to see your contributions!'
                            }
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? 'Se você tiver alguma dúvida sobre o time ou a plataforma, não hesite em entrar em contato conosco.'
                                : 'If you have any questions about the project or the platform, don\'t hesitate to contact us.'
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
                            {isPt ? '© 2025 Opineeo, Todos os direitos reservados' : '© 2025 Opineeo, All Rights Reserved'}
                        </Text>
                    </Row>
                </Section>

            </Body>
        </Html>
    );
};

ProjectInvitationEmail.PreviewProps = {
    userName: 'João Silva',
    inviterName: 'Maria Santos',
    projectName: 'Desenvolvimento Web',
    invitationUrl: 'http://localhost:3000/invite/abc123',
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
    backgroundColor: '#007ee6',
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

export default ProjectInvitationEmail; 