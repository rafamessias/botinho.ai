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

interface OTPEmailProps {
    userName?: string;
    otpCode?: string;
    lang?: string;
    baseUrl?: string;
}

const OTPEmail = ({ userName = 'User', otpCode = '123456', lang = 'en', baseUrl = 'http://localhost:3000' }: OTPEmailProps) => {
    const isPt = lang === 'pt-BR' || lang === 'pt_BR';

    const { companyName, logoURL } = emailConfig;
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Preview>
                    {isPt ? `${companyName} - Seu código de verificação` : `${companyName} - Your verification code`}
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
                                ? `Para completar a verificação da sua conta, use o código de verificação abaixo:`
                                : `To complete your account verification, use the verification code below:`
                            }
                        </Text>

                        {/* OTP Code Display */}
                        <Section style={otpContainer}>
                            <Text style={otpCodeCss}>{otpCode}</Text>
                        </Section>

                        <Text style={text}>
                            {isPt
                                ? `Este código expira em 10 minutos. Se você não solicitou este código, pode ignorar este email com segurança.`
                                : `This code expires in 10 minutes. If you didn't request this code, you can safely ignore this email.`
                            }
                        </Text>

                        <Text style={text}>
                            {isPt
                                ? `Digite este código na página de verificação para ativar sua conta.`
                                : `Enter this code on the verification page to activate your account.`
                            }
                        </Text>

                        <Hr style={hr} />

                        <Text style={text}>
                            {isPt
                                ? `Se você não conseguiu ver o código acima, aqui está novamente:`
                                : `If you couldn't see the code above, here it is again:`
                            }
                        </Text>
                        <Text style={anchor}>
                            {baseUrl}
                        </Text>

                        <Hr style={hr} />

                        <Text style={text}>
                            {isPt
                                ? `Se você não solicitou este código ou está tendo problemas, entre em contato conosco.`
                                : `If you didn't request this code or are having trouble, please contact us.`
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

OTPEmail.PreviewProps = {
    userName: 'Alan',
    otpCode: '123456',
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

const otpContainer = {
    backgroundColor: '#f8f9fa',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    margin: '20px 0',
    textAlign: 'center' as const,
};

const otpCodeCss = {
    fontSize: '32px',
    fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
    fontWeight: 'bold',
    color: '#007ee6',
    letterSpacing: '8px',
    margin: '0',
    textAlign: 'center' as const,
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

export default OTPEmail;
