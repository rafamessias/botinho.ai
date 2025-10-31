"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    Search,
    Send,
    Bot,
    User,
    Clock,
    CheckCheck,
    Info,
    Phone,
    Mail,
    MapPin,
    X,
    PanelRight,
    PanelRightClose,
    ArrowLeft,
    PanelLeft,
    PanelLeftClose,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "../ui/sidebar"

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

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        const mediaQueryList = window.matchMedia(query)
        const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
            setMatches(event.matches)
        }

        handleChange(mediaQueryList)

        const listener = (event: MediaQueryListEvent) => handleChange(event)
        mediaQueryList.addEventListener("change", listener)

        return () => {
            mediaQueryList.removeEventListener("change", listener)
        }
    }, [query])

    return matches
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
    const [showDesktopConversations, setShowDesktopConversations] = useState(false)
    const [showConversationsList, setShowConversationsList] = useState(false)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { setOpen } = useSidebar()

    useEffect(() => {
        setOpen(false)
    }, [])

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
        if (!isDesktop) {
            setShowContextPanel(false)
            setShowDesktopConversations(false)
            return
        }

        setShowContextPanel(true)
        setShowDesktopConversations(true)
    }, [isDesktop])

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
        <div className="h-full overflow-y-auto">
            <div className="p-4 space-y-4 pb-6">
                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Customer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{selectedConversation.customerPhone}</span>
                        </div>
                        {selectedConversation.customerEmail && (
                            <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                                <span className="truncate">{selectedConversation.customerEmail}</span>
                            </div>
                        )}
                        {selectedConversation.customerAddress && (
                            <div className="flex items-start gap-2">
                                <MapPin className="w-3.5 h-3.5 mt-0.5" aria-hidden="true" />
                                <span>{selectedConversation.customerAddress}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Quick replies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {suggestedResponses.map((suggestion) => (
                            <Button
                                key={suggestion.id}
                                variant="outline"
                                className="w-full justify-start items-start text-left text-xs h-auto py-2 px-3 whitespace-normal break-words"
                                onClick={() => {
                                    handleUseSuggestedResponse(suggestion.text)
                                }}
                            >
                                {suggestion.text}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col h-[calc(100vh-48px)] overflow-hidden bg-background">
            <div className="flex-1 min-h-0 flex overflow-hidden bg-background">
                {/* Conversations List - Mobile: Hidden by default, Desktop: Always visible */}
                {showDesktopConversations && (
                    <div className="hidden md:flex w-64 border-r border-border/60 flex-col bg-background flex-shrink-0 overflow-hidden">
                        <div className="h-14 px-4 flex items-center border-b border-border/60">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                <Input
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-9 pl-9 text-sm bg-background border-border focus-visible:ring-1 focus-visible:ring-primary"
                                    aria-label="Search conversations"
                                />
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <div className="p-2 pb-4 space-y-1">
                                {filteredConversations.map((conversation) => (
                                    <button
                                        key={conversation.id}
                                        onClick={() => handleSelectConversation(conversation)}
                                        className={cn(
                                            "w-full rounded-lg px-3 py-2 flex items-start gap-3 text-left transition-colors",
                                            selectedConversation.id === conversation.id
                                                ? "bg-primary/10 border border-primary/30"
                                                : "hover:bg-muted"
                                        )}
                                        aria-label={`Select conversation with ${conversation.customerName}`}
                                    >
                                        <Avatar className="w-10 h-10 flex-shrink-0 border border-border/70">
                                            <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                                                {conversation.customerName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="font-semibold text-sm text-foreground truncate">
                                                    {conversation.customerName}
                                                </h4>
                                                <span className="text-[11px] text-muted-foreground flex-shrink-0">
                                                    {conversation.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate mt-1">
                                                {conversation.lastMessage}
                                            </p>
                                        </div>
                                        {conversation.unread > 0 && (
                                            <Badge className="bg-primary text-primary-foreground flex-shrink-0 h-5 min-w-5 items-center justify-center text-[11px] font-semibold">
                                                {conversation.unread}
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Conversations List Sheet */}
                <Sheet open={showConversationsList} onOpenChange={setShowConversationsList}>
                    <SheetContent side="left" className="w-full sm:w-72 p-0 flex flex-col">
                        <SheetHeader className="px-4 py-4 border-b border-border/60">
                            <SheetTitle className="text-left">Conversations</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                            <div className="px-4 py-3 border-b border-border/60">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                    <Input
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-9 pl-9 text-sm bg-background border-border focus-visible:ring-1 focus-visible:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 min-h-0 overflow-y-auto">
                                <div className="p-2 pb-4 space-y-1">
                                    {filteredConversations.map((conversation) => (
                                        <button
                                            key={conversation.id}
                                            onClick={() => handleSelectConversation(conversation)}
                                            className={cn(
                                                "w-full rounded-lg px-3 py-2 flex items-start gap-3 text-left transition-colors",
                                                selectedConversation.id === conversation.id
                                                    ? "bg-primary/10 border border-primary/30"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            <Avatar className="w-10 h-10 flex-shrink-0 border border-border/70">
                                                <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                                                    {conversation.customerName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()
                                                        .slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="font-semibold text-sm text-foreground truncate">
                                                        {conversation.customerName}
                                                    </h4>
                                                    <span className="text-[11px] text-muted-foreground flex-shrink-0">
                                                        {conversation.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate mt-1">
                                                    {conversation.lastMessage}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {conversation.priority && (
                                                        <Badge
                                                            variant="outline"
                                                            className={cn("text-[11px] px-1.5 py-0.5 border", getPriorityColor(conversation.priority))}
                                                        >
                                                            {conversation.priority}
                                                        </Badge>
                                                    )}
                                                    {conversation.tags?.slice(0, 1).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-[11px] px-1.5 py-0.5">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            {conversation.unread > 0 && (
                                                <Badge className="bg-primary text-primary-foreground flex-shrink-0 h-5 min-w-5 items-center justify-center text-[11px] font-semibold">
                                                    {conversation.unread}
                                                </Badge>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Chat Area */}
                <div className="flex-1 min-h-0 flex flex-col min-w-0">
                    <div className="h-14 px-4 flex items-center justify-between border-b border-border/60 flex-shrink-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowConversationsList(true)}
                                className="md:hidden"
                                title="Toggle conversations list"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowDesktopConversations(!showDesktopConversations)}
                                className="hidden md:inline-flex hover:bg-muted"
                                title={showDesktopConversations ? "Collapse conversations" : "Show conversations"}
                            >
                                {showDesktopConversations ? (
                                    <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <PanelLeft className="w-4 h-4 text-muted-foreground" />
                                )}
                            </Button>
                            <Avatar className="w-9 h-9 flex-shrink-0 border border-border/70">
                                <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                                    {selectedConversation.customerName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-sm text-foreground truncate">{selectedConversation.customerName}</h3>
                                <p className="text-xs text-muted-foreground truncate">{selectedConversation.customerPhone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowContextPanel(!showContextPanel)}
                                className="hover:bg-muted"
                                title={showContextPanel ? "Hide context" : "Show context"}
                            >
                                {showContextPanel ? (
                                    <PanelRightClose className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <PanelRight className="w-4 h-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto bg-secondary">
                        <div className="px-4 py-5 space-y-3">
                            {selectedConversation.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn("flex items-end gap-2", message.sender === "bot" && "flex-row-reverse")}
                                >
                                    <Avatar className="w-8 h-8 flex-shrink-0 border border-border/70">
                                        <AvatarFallback
                                            className={cn(
                                                "text-xs font-semibold",
                                                message.sender === "customer"
                                                    ? "bg-muted text-muted-foreground"
                                                    : "bg-primary/10 text-primary"
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
                                            "max-w-[80%] md:max-w-[70%] rounded-lg px-3 py-2 text-sm",
                                            message.sender === "customer"
                                                ? "bg-card border border-border text-foreground"
                                                : "bg-primary/5 border border-primary/20 text-foreground"
                                        )}
                                    >
                                        <p>{message.text}</p>
                                        <div
                                            className={cn(
                                                "flex items-center gap-1.5 mt-2 text-[11px]",
                                                message.sender === "customer" ? "text-muted-foreground" : "text-primary/60"
                                            )}
                                        >
                                            <Clock className="w-3 h-3" aria-hidden="true" />
                                            <span>{message.timestamp}</span>
                                            {message.sender === "bot" && message.status && (
                                                <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="border-t border-border/60 px-4 py-3 flex-shrink-0">
                        <div className="flex items-end gap-3">
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
                                    className="flex-1 min-h-[48px] max-h-[120px] resize-none text-sm bg-background border-border focus-visible:ring-1 focus-visible:ring-primary pr-9"
                                    rows={2}
                                />
                                {messageInput.trim() && (
                                    <div className="absolute bottom-2 right-2 text-[11px] text-muted-foreground">
                                        {messageInput.length}
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim()}
                                size="icon"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground h-[48px] w-[48px] flex-shrink-0 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Desktop Context Panel */}
                {showContextPanel && (
                    <div className="hidden md:flex w-72 border-l border-border/60 flex-col bg-background flex-shrink-0 overflow-hidden">
                        <div className="h-14 px-4 flex items-center justify-between border-b border-border/60">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Info className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                                Context
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowContextPanel(false)}
                                className="hover:bg-muted"
                                title="Close context"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ContextPanelContent />
                        </div>
                    </div>
                )}

                {/* Mobile Context Panel Sheet */}
                <Sheet open={showContextPanel && !isDesktop} onOpenChange={setShowContextPanel}>
                    <SheetContent side="right" className="w-full sm:w-72 md:hidden p-0 flex flex-col overflow-hidden">
                        <SheetHeader className="px-4 py-4 border-b border-border/60 flex-shrink-0">
                            <SheetTitle className="text-left flex items-center gap-2">
                                <Info className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                                Context
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 min-h-0">
                            <ContextPanelContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
