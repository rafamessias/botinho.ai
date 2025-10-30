"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    Search,
    Send,
    Bot,
    User,
    Clock,
    CheckCheck,
    Info,
    MessageSquare,
    Phone,
    Mail,
    MapPin,
    X,
    Sparkles,
    History,
    Star,
    AlertCircle,
    PanelRight,
    PanelRightClose,
    ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    text: string
    sender: "customer" | "bot"
    timestamp: string
    status?: "sent" | "delivered" | "read"
}

interface Conversation {
    id: string
    customerName: string
    customerPhone: string
    customerEmail?: string
    customerAddress?: string
    lastMessage: string
    timestamp: string
    unread: number
    messages: Message[]
    tags?: string[]
    priority?: "low" | "medium" | "high"
    satisfactionScore?: number
}

interface SuggestedResponse {
    id: string
    text: string
    category: string
}

const mockConversations: Conversation[] = [
    {
        id: "1",
        customerName: "Maria Silva",
        customerPhone: "+55 11 98765-4321",
        customerEmail: "maria.silva@example.com",
        customerAddress: "São Paulo, SP",
        lastMessage: "Obrigada pela ajuda!",
        timestamp: "2 min ago",
        unread: 0,
        priority: "low",
        satisfactionScore: 5,
        tags: ["VIP", "Returning Customer"],
        messages: [
            {
                id: "1",
                text: "Olá! Qual o horário de funcionamento?",
                sender: "customer",
                timestamp: "10:30 AM",
            },
            {
                id: "2",
                text: "Olá Maria! Funcionamos de segunda a sexta das 9h às 18h, e sábado das 10h às 16h. Estamos fechados aos domingos. 😊",
                sender: "bot",
                timestamp: "10:30 AM",
                status: "read",
            },
            {
                id: "3",
                text: "Perfeito! E vocês fazem entrega?",
                sender: "customer",
                timestamp: "10:31 AM",
            },
            {
                id: "4",
                text: "Sim! Fazemos entrega gratuita para pedidos acima de R$ 50. O prazo é de 2-3 dias úteis. 🚚",
                sender: "bot",
                timestamp: "10:31 AM",
                status: "read",
            },
            {
                id: "5",
                text: "Obrigada pela ajuda!",
                sender: "customer",
                timestamp: "10:32 AM",
            },
        ],
    },
    {
        id: "2",
        customerName: "João Santos",
        customerPhone: "+55 11 91234-5678",
        customerEmail: "joao.santos@example.com",
        lastMessage: "Qual o preço do produto X?",
        timestamp: "15 min ago",
        unread: 2,
        priority: "high",
        tags: ["Price Inquiry"],
        messages: [
            {
                id: "1",
                text: "Oi! Qual o preço do produto X?",
                sender: "customer",
                timestamp: "10:15 AM",
            },
            {
                id: "2",
                text: "Olá João! O produto X custa R$ 99,90. Temos promoção esta semana com 10% de desconto! 🎉",
                sender: "bot",
                timestamp: "10:15 AM",
                status: "delivered",
            },
        ],
    },
    {
        id: "3",
        customerName: "Ana Costa",
        customerPhone: "+55 11 99876-5432",
        customerEmail: "ana.costa@example.com",
        lastMessage: "Vocês aceitam cartão?",
        timestamp: "1 hour ago",
        unread: 1,
        priority: "medium",
        messages: [
            {
                id: "1",
                text: "Vocês aceitam cartão?",
                sender: "customer",
                timestamp: "9:30 AM",
            },
        ],
    },
    {
        id: "4",
        customerName: "Pedro Lima",
        customerPhone: "+55 11 97654-3210",
        customerEmail: "pedro.lima@example.com",
        lastMessage: "Obrigado!",
        timestamp: "2 hours ago",
        unread: 0,
        priority: "low",
        satisfactionScore: 4,
        messages: [
            {
                id: "1",
                text: "Como faço para trocar um produto?",
                sender: "customer",
                timestamp: "8:30 AM",
            },
            {
                id: "2",
                text: "Olá Pedro! Você tem 30 dias para trocar qualquer produto. Basta trazer o item com a nota fiscal. Posso ajudar com mais alguma coisa?",
                sender: "bot",
                timestamp: "8:31 AM",
                status: "read",
            },
            {
                id: "3",
                text: "Obrigado!",
                sender: "customer",
                timestamp: "8:32 AM",
            },
        ],
    },
]

const getSuggestedResponses = (conversation: Conversation): SuggestedResponse[] => {
    const lastCustomerMessage = conversation.messages
        .filter((m) => m.sender === "customer")
        .pop()?.text.toLowerCase() || ""

    if (lastCustomerMessage.includes("horário") || lastCustomerMessage.includes("horario")) {
        return [
            {
                id: "1",
                text: "Funcionamos de segunda a sexta das 9h às 18h, e sábado das 10h às 16h.",
                category: "Hours",
            },
            {
                id: "2",
                text: "Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.",
                category: "Hours",
            },
        ]
    }

    if (lastCustomerMessage.includes("preço") || lastCustomerMessage.includes("preco") || lastCustomerMessage.includes("valor")) {
        return [
            {
                id: "1",
                text: "Posso ajudar você com informações sobre preços. Qual produto você está interessado?",
                category: "Pricing",
            },
            {
                id: "2",
                text: "Temos promoções especiais esta semana! Posso enviar nosso catálogo com preços.",
                category: "Pricing",
            },
        ]
    }

    if (lastCustomerMessage.includes("entrega") || lastCustomerMessage.includes("delivery")) {
        return [
            {
                id: "1",
                text: "Fazemos entrega gratuita para pedidos acima de R$ 50. O prazo é de 2-3 dias úteis.",
                category: "Delivery",
            },
            {
                id: "2",
                text: "Sim! Oferecemos entrega em toda a região metropolitana.",
                category: "Delivery",
            },
        ]
    }

    return [
        {
            id: "1",
            text: "Como posso ajudar você hoje?",
            category: "General",
        },
        {
            id: "2",
            text: "Obrigado por entrar em contato! Estou aqui para ajudar.",
            category: "General",
        },
    ]
}

export default function InboxPage() {
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
    const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0])
    const [searchQuery, setSearchQuery] = useState("")
    const [messageInput, setMessageInput] = useState("")
    const [showContextPanel, setShowContextPanel] = useState(false)
    const [showConversationsList, setShowConversationsList] = useState(false)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const filteredConversations = conversations.filter(
        (conv) =>
            conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.customerPhone.includes(searchQuery) ||
            conv.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const suggestedResponses = getSuggestedResponses(selectedConversation)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [selectedConversation.messages])

    useEffect(() => {
        if (selectedConversation) {
            messageInputRef.current?.focus()
        }
    }, [selectedConversation.id])

    const handleSendMessage = () => {
        if (!messageInput.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            text: messageInput,
            sender: "bot",
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            status: "sent",
        }

        setConversations(
            conversations.map((conv) =>
                conv.id === selectedConversation.id
                    ? {
                        ...conv,
                        messages: [...conv.messages, newMessage],
                        lastMessage: messageInput,
                        timestamp: "Just now",
                        unread: 0,
                    }
                    : conv,
            ),
        )

        setSelectedConversation({
            ...selectedConversation,
            messages: [...selectedConversation.messages, newMessage],
            lastMessage: messageInput,
            timestamp: "Just now",
            unread: 0,
        })

        setMessageInput("")
        messageInputRef.current?.focus()
    }

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation)
        setConversations(
            conversations.map((conv) => (conv.id === conversation.id ? { ...conv, unread: 0 } : conv)),
        )
        setShowConversationsList(false)
    }

    const handleUseSuggestedResponse = (text: string) => {
        setMessageInput(text)
        messageInputRef.current?.focus()
    }

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case "high":
                return "bg-red-500/10 text-red-600 border-red-500/20"
            case "medium":
                return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
            default:
                return "bg-muted/50 text-muted-foreground"
        }
    }

    const ContextPanelContent = () => (
        <>
            <ScrollArea className="h-full">
                <div className="p-4 md:p-5 space-y-4">
                    {/* Customer Info */}
                    <Card className="refined-card border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                                <User className="w-4 h-4 text-primary" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3.5">
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p className="text-sm font-medium">{selectedConversation.customerPhone}</p>
                                </div>
                            </div>
                            {selectedConversation.customerEmail && (
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-sm font-medium truncate">{selectedConversation.customerEmail}</p>
                                    </div>
                                </div>
                            )}
                            {selectedConversation.customerAddress && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground">Location</p>
                                        <p className="text-sm font-medium">{selectedConversation.customerAddress}</p>
                                    </div>
                                </div>
                            )}
                            {selectedConversation.satisfactionScore && (
                                <div className="flex items-start gap-3">
                                    <Star className="w-4 h-4 mt-0.5 flex-shrink-0 fill-yellow-500 text-yellow-500" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground">Satisfaction</p>
                                        <p className="text-sm font-medium">{selectedConversation.satisfactionScore}/5</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Conversation Summary */}
                    <Card className="refined-card border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                Conversation Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                {selectedConversation.messages.length} message
                                {selectedConversation.messages.length !== 1 ? "s" : ""} in this conversation
                            </p>
                            {selectedConversation.priority && (
                                <div>
                                    <Badge
                                        variant="outline"
                                        className={cn("text-xs px-2 py-1 font-medium border", getPriorityColor(selectedConversation.priority))}
                                    >
                                        Priority: {selectedConversation.priority}
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Suggested Responses */}
                    <Card className="refined-card border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Suggested Responses
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {suggestedResponses.map((suggestion) => (
                                <Button
                                    key={suggestion.id}
                                    variant="outline"
                                    className="w-full justify-start text-left h-auto py-2.5 px-3.5 text-sm whitespace-normal hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group"
                                    onClick={() => {
                                        handleUseSuggestedResponse(suggestion.text)
                                        setShowContextPanel(false)
                                    }}
                                >
                                    <span className="line-clamp-2 group-hover:text-foreground transition-colors">
                                        {suggestion.text}
                                    </span>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="refined-card border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                                <History className="w-4 h-4 text-primary" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start text-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                                size="sm"
                            >
                                <Star className="w-4 h-4 mr-2 text-primary" />
                                Mark as Important
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                                size="sm"
                            >
                                <AlertCircle className="w-4 h-4 mr-2 text-primary" />
                                Escalate to Manager
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                                size="sm"
                            >
                                <History className="w-4 h-4 mr-2 text-primary" />
                                View History
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </>
    )

    return (
        <div className="h-full w-full flex flex-col overflow-hidden">
            <div className="flex-1 flex overflow-hidden bg-muted/30">
                {/* Conversations List - Mobile: Hidden by default, Desktop: Always visible */}
                <div className="hidden md:flex w-80 lg:w-96 border-r border-border/60 flex-col bg-card/95 backdrop-blur-sm flex-shrink-0 shadow-sm overflow-hidden">
                    {/* Search Header */}
                    <div className="p-4 h-16 border-b border-border/60 bg-card/80 backdrop-blur-md flex-shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="elegant-input pl-10 bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Conversations */}
                    <ScrollArea className="flex-1 min-h-0">
                        <div className="p-2 space-y-1">
                            {filteredConversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    onClick={() => handleSelectConversation(conversation)}
                                    className={cn(
                                        "w-full p-3 md:p-4 flex items-start gap-3 rounded-xl transition-all duration-200 group",
                                        "hover:bg-primary/5 hover:shadow-sm border border-transparent",
                                        selectedConversation.id === conversation.id
                                            ? "bg-primary/10 border-primary/20 shadow-sm"
                                            : "hover:border-border/50",
                                    )}
                                >
                                    <Avatar className="w-11 h-11 md:w-12 md:h-12 flex-shrink-0 ring-2 ring-offset-2 ring-offset-background ring-primary/10 group-hover:ring-primary/20 transition-all duration-200">
                                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                                            {conversation.customerName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()
                                                .slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <h4 className="font-semibold text-sm text-foreground truncate">
                                                {conversation.customerName}
                                            </h4>
                                            <span className="text-xs text-muted-foreground flex-shrink-0 font-medium">
                                                {conversation.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-xs md:text-sm text-muted-foreground truncate mb-2 leading-relaxed">
                                            {conversation.lastMessage}
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {conversation.priority && (
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs px-2 py-0.5 font-medium border",
                                                        getPriorityColor(conversation.priority),
                                                    )}
                                                >
                                                    {conversation.priority}
                                                </Badge>
                                            )}
                                            {conversation.tags?.slice(0, 1).map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="text-xs px-2 py-0.5 font-medium bg-muted/80"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    {conversation.unread > 0 && (
                                        <Badge className="bg-primary text-primary-foreground flex-shrink-0 h-6 min-w-6 items-center justify-center text-xs font-semibold shadow-sm animate-pulse">
                                            {conversation.unread}
                                        </Badge>
                                    )}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Mobile Conversations List Sheet */}
                <Sheet open={showConversationsList} onOpenChange={setShowConversationsList}>
                    <SheetContent side="left" className="w-full sm:w-80 p-0 flex flex-col">
                        <SheetHeader className="px-4 py-4 border-b border-border/60">
                            <SheetTitle className="text-left">Conversations</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                            {/* Search */}
                            <div className="p-4 border-b border-border/60 bg-card/80 backdrop-blur-md flex-shrink-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search conversations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="elegant-input pl-10 bg-background/50 border-border/60 focus:bg-background transition-all duration-200"
                                    />
                                </div>
                            </div>
                            {/* Conversations */}
                            <ScrollArea className="flex-1 min-h-0">
                                <div className="p-2 space-y-1">
                                    {filteredConversations.map((conversation) => (
                                        <button
                                            key={conversation.id}
                                            onClick={() => handleSelectConversation(conversation)}
                                            className={cn(
                                                "w-full p-3 flex items-start gap-3 rounded-xl transition-all duration-200 group",
                                                "hover:bg-primary/5 hover:shadow-sm border border-transparent",
                                                selectedConversation.id === conversation.id
                                                    ? "bg-primary/10 border-primary/20 shadow-sm"
                                                    : "hover:border-border/50",
                                            )}
                                        >
                                            <Avatar className="w-11 h-11 flex-shrink-0 ring-2 ring-offset-2 ring-offset-background ring-primary/10 group-hover:ring-primary/20 transition-all duration-200">
                                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                                                    {conversation.customerName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()
                                                        .slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0 text-left">
                                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                                    <h4 className="font-semibold text-sm text-foreground truncate">
                                                        {conversation.customerName}
                                                    </h4>
                                                    <span className="text-xs text-muted-foreground flex-shrink-0 font-medium">
                                                        {conversation.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate mb-2 leading-relaxed">
                                                    {conversation.lastMessage}
                                                </p>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {conversation.priority && (
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-xs px-2 py-0.5 font-medium border",
                                                                getPriorityColor(conversation.priority),
                                                            )}
                                                        >
                                                            {conversation.priority}
                                                        </Badge>
                                                    )}
                                                    {conversation.tags?.slice(0, 1).map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                            className="text-xs px-2 py-0.5 font-medium bg-muted/80"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            {conversation.unread > 0 && (
                                                <Badge className="bg-primary text-primary-foreground flex-shrink-0 h-6 min-w-6 items-center justify-center text-xs font-semibold shadow-sm animate-pulse">
                                                    {conversation.unread}
                                                </Badge>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-muted/20 via-muted/10 to-muted/30 overflow-hidden">
                    {/* Chat Header */}
                    <div className="h-16 px-3 md:px-4 lg:px-6 flex items-center justify-between border-b border-border/60 bg-card/80 backdrop-blur-md shadow-sm flex-shrink-0">
                        <div className="flex items-center gap-2 md:gap-3 lg:gap-4 min-w-0 flex-1">
                            {/* Mobile: Back button to conversations */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowConversationsList(true)}
                                className="md:hidden flex-shrink-0"
                                title="Back to conversations"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <Avatar className="w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 flex-shrink-0 ring-2 ring-offset-2 ring-offset-background ring-primary/10">
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                    {selectedConversation.customerName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm md:text-base lg:text-lg text-foreground truncate">
                                    {selectedConversation.customerName}
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground truncate mt-0.5">
                                    {selectedConversation.customerPhone}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                            <Badge
                                variant="secondary"
                                className="gap-1.5 text-xs px-2 md:px-3 py-1 md:py-1.5 bg-primary/10 text-primary border-primary/20 font-medium"
                            >
                                <Bot className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                <span className="hidden sm:inline">AI Active</span>
                            </Badge>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowContextPanel(!showContextPanel)}
                                className="hover:bg-primary/5 transition-colors"
                                title={showContextPanel ? "Hide context panel" : "Show context panel"}
                            >
                                {showContextPanel ? (
                                    <PanelRightClose className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                ) : (
                                    <PanelRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground hover:text-foreground transition-colors" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="min-h-0 overflow-hidden">
                        <ScrollArea className="h-[calc(100vh-195px)]">
                            <div className="p-3 md:p-4 lg:p-6 space-y-2 md:space-y-3 lg:space-y-4">
                                {selectedConversation.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex items-end gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                            message.sender === "bot" && "flex-row-reverse",
                                        )}
                                    >
                                        <Avatar className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0">
                                            <AvatarFallback
                                                className={cn(
                                                    "text-xs font-semibold",
                                                    message.sender === "customer"
                                                        ? "bg-muted text-muted-foreground"
                                                        : "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
                                                )}
                                            >
                                                {message.sender === "customer" ? (
                                                    <User className="w-4 h-4" />
                                                ) : (
                                                    <Bot className="w-4 h-4" />
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={cn(
                                                "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 md:px-5 py-2.5 md:py-3 shadow-sm transition-all duration-200",
                                                message.sender === "customer"
                                                    ? "rounded-bl-sm bg-card border border-border/50 text-card-foreground"
                                                    : "rounded-br-sm bg-primary text-primary-foreground",
                                            )}
                                        >
                                            <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                                            <div
                                                className={cn(
                                                    "flex items-center gap-1.5 mt-2 text-xs",
                                                    message.sender === "customer"
                                                        ? "text-muted-foreground"
                                                        : "text-primary-foreground/70",
                                                )}
                                            >
                                                <Clock className="w-3 h-3" />
                                                <span className="font-medium">{message.timestamp}</span>
                                                {message.sender === "bot" && message.status && (
                                                    <CheckCheck
                                                        className={cn(
                                                            "w-3.5 h-3.5 ml-1",
                                                            message.status === "read" && "text-primary-foreground/50",
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Message Input */}
                    <div className="bg-card/95 backdrop-blur-md border-t border-border/60 p-3 md:p-4 lg:p-5 shadow-lg flex-shrink-0">
                        <div className="flex items-end gap-2 md:gap-3 lg:gap-4">
                            <div className="flex-1 relative">
                                <Textarea
                                    ref={messageInputRef}
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSendMessage()
                                        }
                                    }}
                                    className="flex-1 min-h-[56px] md:min-h-[64px] max-h-[120px] md:max-h-[140px] resize-none text-sm md:text-base bg-background/80 border-border/60 focus:bg-background focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-200 pr-10 md:pr-12"
                                    rows={2}
                                />
                                {messageInput.trim() && (
                                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                        {messageInput.length}
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim()}
                                size="icon"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground h-[56px] w-[56px] md:h-[64px] md:w-[64px] flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 md:mt-3 hidden md:flex items-center gap-1.5">
                            <Bot className="w-3.5 h-3.5" />
                            AI is handling responses automatically. You can take over anytime.
                        </p>
                    </div>
                </div>

                {/* Desktop Context Panel */}
                {showContextPanel && (
                    <div className="hidden md:flex w-80 lg:w-96 border-l border-border/60 flex-col bg-card/95 backdrop-blur-sm flex-shrink-0 shadow-sm animate-in slide-in-from-right duration-200 overflow-hidden">
                        <div className="h-16 px-4 md:px-5 flex items-center justify-between border-b border-border/60 bg-card/80 backdrop-blur-md flex-shrink-0">
                            <h3 className="font-semibold text-sm md:text-base flex items-center gap-2 text-foreground">
                                <Info className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                Context
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowContextPanel(false)}
                                className="hover:bg-muted/50 transition-colors"
                                title="Close context panel"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <ContextPanelContent />
                        </div>
                    </div>
                )}

                {/* Mobile Context Panel Sheet */}
                <Sheet open={showContextPanel} onOpenChange={setShowContextPanel}>
                    <SheetContent side="right" className="w-full sm:w-80 md:hidden p-0 flex flex-col overflow-hidden">
                        <SheetHeader className="px-4 py-4 border-b border-border/60 flex-shrink-0">
                            <SheetTitle className="text-left flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" />
                                Context
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <ContextPanelContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
