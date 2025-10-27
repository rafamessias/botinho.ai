import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Section,
    Hr,
} from '@react-email/components';
import * as React from 'react';

interface ContactEmailProps {
    name: string;
    email: string;
    message: string;
}

export default function ContactEmail({ name, email, message }: ContactEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>New contact message from {name}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>New Contact - Support Message</Heading>
                    <Text style={text}>
                        You have received a new contact message from your Opineeo support form.
                    </Text>

                    <Section style={infoSection}>
                        <Text style={infoLabel}>From:</Text>
                        <Text style={infoValue}>{name}</Text>

                        <Text style={infoLabel}>Email:</Text>
                        <Text style={infoValue}>{email}</Text>

                        <Hr style={hr} />

                        <Text style={infoLabel}>Message:</Text>
                        <Text style={messageText}>{message}</Text>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        This message was sent from the Opineeo support contact form.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0 40px',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    padding: '0 40px',
};

const infoSection = {
    padding: '24px 40px',
    backgroundColor: '#f9fafb',
    margin: '24px 40px',
    borderRadius: '8px',
};

const infoLabel = {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '4px',
    marginTop: '16px',
};

const infoValue = {
    color: '#111827',
    fontSize: '16px',
    marginTop: '0',
    marginBottom: '0',
};

const messageText = {
    color: '#111827',
    fontSize: '16px',
    lineHeight: '24px',
    whiteSpace: 'pre-wrap' as const,
    marginTop: '8px',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    padding: '0 40px',
    marginTop: '24px',
};

