'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useUser } from "../user-provider"
import { sendContactEmail } from "../server-actions/contact"

interface FormData {
    name: string
    email: string
    message: string
}

interface FormErrors {
    name?: string
    email?: string
    message?: string
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export default function ContactSection() {
    const t = useTranslations()
    const { user } = useUser()
    const [formData, setFormData] = useState<FormData>({
        name: user?.name || '',
        email: user?.email || '',
        message: ''
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [status, setStatus] = useState<FormStatus>('idle')

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = t('contact.form.required')
        }

        if (!formData.email.trim()) {
            newErrors.email = t('contact.form.required')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('contact.form.invalidEmail')
        }

        if (!formData.message.trim()) {
            newErrors.message = t('contact.form.required')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            setStatus('sending')

            // Send email using server action
            const result = await sendContactEmail({
                name: formData.name,
                email: formData.email,
                message: formData.message,
            })

            if (result.success) {
                // Show success message and clear form
                setStatus('success')
                setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    message: ''
                })
            } else {
                setStatus('error')
            }
        } catch (error) {
            console.error('Error sending contact email:', error)
            setStatus('error')
        }
    }

    return (
        <section id="contact" className="py-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.title')}</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('contact.subtitle')}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto flex justify-center">
                    {/* Contact Form */}
                    <Card className="p-6 md:p-8 ">
                        <CardHeader className="text-center">
                            <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                            <CardTitle className="text-xl">{t('contact.form.submitButton')}</CardTitle>
                            <CardDescription className="text-base">
                                {t('contact.form.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status === 'success' ? (
                                /* Success Feedback - Hide Form */
                                <div className="text-center py-8">
                                    <div className="flex items-center justify-center p-6 bg-green-50 border border-green-200 rounded-lg mb-4">
                                        <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-green-800 mb-1">
                                                {t('contact.form.success')}
                                            </h3>
                                            <p className="text-green-700 text-sm">
                                                {t('contact.form.successDescription')}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            setStatus('idle')
                                            setFormData({
                                                name: user?.name || '',
                                                email: user?.email || '',
                                                message: ''
                                            })
                                            setErrors({})
                                        }}
                                        variant="outline"
                                        className="mt-4"
                                    >
                                        {t('contact.form.sendAnother')}
                                    </Button>
                                </div>
                            ) : (
                                /* Contact Form */
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                                            {t('contact.form.nameLabel')}
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            readOnly
                                            placeholder={t('contact.form.namePlaceholder')}
                                            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.name ? 'border-red-500' : 'border-input'
                                                }`}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                                            {t('contact.form.emailLabel')}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                            placeholder={t('contact.form.emailPlaceholder')}
                                            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.email ? 'border-red-500' : 'border-input'
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                                            {t('contact.form.messageLabel')}
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            autoFocus
                                            value={formData.message}
                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                            placeholder={t('contact.form.messagePlaceholder')}
                                            rows={4}
                                            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical ${errors.message ? 'border-red-500' : 'border-input'
                                                }`}
                                        />
                                        {errors.message && (
                                            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={status === 'sending'}
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                {t('contact.form.sending')}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                {t('contact.form.submitButton')}
                                            </>
                                        )}
                                    </Button>

                                    {/* Error Message */}
                                    {status === 'error' && (
                                        <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-md">
                                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                            <span className="text-red-700">{t('contact.form.error')}</span>
                                        </div>
                                    )}
                                </form>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </section>
    )
}
