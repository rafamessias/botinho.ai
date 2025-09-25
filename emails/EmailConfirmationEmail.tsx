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

interface EmailConfirmationEmailProps {
    userName?: string;
    confirmationLink?: string;
    lang?: string;
    baseUrl?: string;
}

const EmailConfirmationEmail = ({
    userName = 'User',
    confirmationLink = 'https://example.com',
    lang = 'en',
    baseUrl = 'http://localhost:3000'
}: EmailConfirmationEmailProps) => {
    const isPt = lang === 'pt-BR' || lang === 'pt_BR';

    const { companyName, logoURL } = emailConfig;

    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>
                    {isPt ? `${companyName} - Confirme seu email` : `${companyName} - Confirm your email`}
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
                                ? `Você solicitou uma nova confirmação de email para sua conta ${companyName}. Para ativar sua conta, clique no botão abaixo:`
                                : `You requested a new email confirmation for your ${companyName} account. To activate your account, click the button below:`
                            }
                        </Text>
                        <Button style={button} href={confirmationLink}>
                            {isPt ? 'Confirmar email' : 'Confirm email'}
                        </Button>
                        <Text style={text}>
                            {isPt
                                ? 'Se você não solicitou esta confirmação ou não reconhece esta conta, apenas ignore e delete esta mensagem.'
                                : 'If you didn\'t request this confirmation or don\'t recognize this account, just ignore and delete this message.'
                            }
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? 'Para manter sua conta segura, por favor não encaminhe este email para ninguém.'
                                : 'To keep your account secure, please don\'t forward this email to anyone.'
                            }
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? 'Após confirmar seu email, você terá acesso completo à plataforma Obraguru.'
                                : 'After confirming your email, you will have full access to the Obraguru platform.'
                            }
                        </Text>
                        <Text style={text}>
                            {isPt ? `Bem-vindo ao ${companyName}!` : `Welcome to ${companyName}!`}
                        </Text>
                        <Hr style={hr} />
                        <Text style={text}>
                            {isPt
                                ? 'Se você não conseguiu clicar no botão acima, copie e cole o link abaixo:'
                                : 'If you could not click the button above, copy and paste the URL below:'
                            }
                        </Text>
                        <Text style={anchor}>
                            {confirmationLink}
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

EmailConfirmationEmail.PreviewProps = {
    userName: 'Alan',
    confirmationLink: 'http://localhost:3000/api/auth/email-confirmation?confirmation=token123',
    lang: 'pt-BR',
    baseUrl: 'http://localhost:3000',
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

export default EmailConfirmationEmail; 