
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

interface ResetPasswordEmailProps {
    userName?: string;
    resetPasswordLink?: string;
    lang?: string;
    baseUrl?: string;
}

const ResetPasswordEmail = ({ userName = 'User', resetPasswordLink = 'https://example.com', lang = 'en', baseUrl = 'http://localhost:3000' }: ResetPasswordEmailProps) => {
    const isPt = lang === 'pt-BR' || lang === 'pt_BR';
    const logoURL = baseUrl + '/placeholder-logo.png';

    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>
                    {isPt ? 'Obraguru - Redefina sua senha' : 'Obraguru - Reset your password'}
                </Preview>
                <Container style={container}>
                    <Img
                        src={logoURL}
                        width="40"
                        height="40"
                        alt="Obraguru"
                        style={logo}
                    />
                    <Section>
                        <Text style={text}>
                            {isPt ? `Olá ${userName},` : `Hi ${userName},`}
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? 'Alguém solicitou recentemente uma alteração de senha para sua conta Obraguru. Se foi você, você pode definir uma nova senha aqui:'
                                : 'Someone recently requested a password change for your Obraguru account. If this was you, you can set a new password here:'
                            }
                        </Text>
                        <Button style={button} href={resetPasswordLink}>
                            {isPt ? 'Redefinir senha' : 'Reset password'}
                        </Button>
                        <Text style={text}>
                            {isPt
                                ? 'Se você não quer alterar sua senha ou não solicitou isso, apenas ignore e delete esta mensagem.'
                                : 'If you don\'t want to change your password or didn\'t request this, just ignore and delete this message.'
                            }
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? 'Para manter sua conta segura, por favor não encaminhe este email para ninguém.'
                                : 'To keep your account secure, please don\'t forward this email to anyone.'
                            }

                        </Text>
                        <Text style={text}>
                            {isPt ? 'Boa sorte com seus projetos!' : 'Good luck with your projects!'}
                        </Text>
                        <Hr style={hr} />
                        <Text style={text}>
                            {isPt
                                ? 'Se você não conseguiu clicar no botão acima, copie e cole o link abaixo:'
                                : 'If you could not click the button above, copy and paste the URL below:'
                            }
                        </Text>
                        <Text style={anchor}>
                            {resetPasswordLink}
                        </Text>
                    </Section>
                </Container>

                <Section style={footer}>
                    <Row>
                        <Text style={{ textAlign: 'center', color: '#706a7b' }}>
                            {isPt ? '© 2025 Obraguru, Todos os direitos reservados' : '© 2025 Obraguru, All Rights Reserved'}
                        </Text>
                    </Row>
                </Section>

            </Body>
        </Html>
    );
};

ResetPasswordEmail.PreviewProps = {
    userName: 'Alan',
    resetPasswordLink: 'http://localhost:3000',
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

export default ResetPasswordEmail;
