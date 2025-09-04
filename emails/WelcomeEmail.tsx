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
import { emailConfig } from '@/lib/emailConfig';

interface WelcomeEmailProps {
    userName?: string;
    confirmationUrl?: string;
    lang?: string;
    baseUrl?: string;
}

const WelcomeEmail = ({ userName = 'User', confirmationUrl = 'https://example.com', lang = 'en', baseUrl = 'http://localhost:3000' }: WelcomeEmailProps) => {
    const isPt = lang === 'pt-BR' || lang === 'pt_BR';

    const { companyName, logoURL } = emailConfig;
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>
                    {isPt ? `${companyName} - Bem-vindo à sua nova conta!` : `${companyName} - Welcome to your new account!`}
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
                                ? `Bem-vindo ao ${companyName}! Sua conta foi criada com sucesso e você já pode começar a gerenciar seus projetos de forma eficiente.`
                                : `Welcome to ${companyName}! Your account has been successfully created and you can now start managing your projects efficiently.`
                            }
                        </Text>
                        <Text style={text}>
                            {isPt
                                ? `Com o ${companyName}, você terá acesso a ferramentas poderosas para organizar, planejar e executar seus projetos com excelência.`
                                : `With ${companyName}, you\'ll have access to powerful tools to organize, plan, and execute your projects with excellence.`
                            }
                        </Text>
                        <Button style={button} href={confirmationUrl}>
                            {isPt ? 'Acessar minha conta' : 'Access my account'}
                        </Button>
                        <Text style={text}>
                            {isPt
                                ? 'Estamos aqui para ajudar você a alcançar seus objetivos. Se tiver alguma dúvida, não hesite em entrar em contato conosco.'
                                : 'We\'re here to help you achieve your goals. If you have any questions, don\'t hesitate to contact us.'
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
                            {confirmationUrl}
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

WelcomeEmail.PreviewProps = {
    userName: 'Alan',
    loginLink: 'http://localhost:3000',
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

export default WelcomeEmail; 