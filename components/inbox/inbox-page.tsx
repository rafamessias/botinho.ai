"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Bot, User, Clock, CheckCheck } from "lucide-react"
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
    lastMessage: string
    timestamp: string
    unread: number
    messages: Message[]
}

const mockConversations: Conversation[] = [
    {
        id: "1",
        customerName: "Maria Silva",
        customerPhone: "+55 11 98765-4321",
        lastMessage: "Obrigada pela ajuda!",
        timestamp: "2 min ago",
        unread: 0,
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
        lastMessage: "Qual o preço do produto X?",
        timestamp: "15 min ago",
        unread: 2,
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
        lastMessage: "Vocês aceitam cartão?",
        timestamp: "1 hour ago",
        unread: 1,
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
        lastMessage: "Obrigado!",
        timestamp: "2 hours ago",
        unread: 0,
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

export default function InboxPage() {
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
    const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0])
    const [searchQuery, setSearchQuery] = useState("")
    const [messageInput, setMessageInput] = useState("")

    const filteredConversations = conversations.filter(
        (conv) =>
            conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || conv.customerPhone.includes(searchQuery),
    )

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
                    }
                    : conv,
            ),
        )

        setSelectedConversation({
            ...selectedConversation,
            messages: [...selectedConversation.messages, newMessage],
            lastMessage: messageInput,
            timestamp: "Just now",
        })

        setMessageInput("")
    }

    return (
        <div className="h-[calc(100vh-2rem)] m-4">
            <Card className="elegant-card h-full flex overflow-hidden">
                {/* Conversations List */}
                <div className="w-96 border-r border-border flex flex-col bg-card">
                    {/* Search Header */}
                    <div className="p-4 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="elegant-input pl-10"
                            />
                        </div>
                    </div>

                    {/* Conversations */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => setSelectedConversation(conversation)}
                                className={cn(
                                    "w-full p-4 flex items-start gap-3 conversation-item",
                                    selectedConversation.id === conversation.id && "conversation-item-active",
                                )}
                            >
                                <Avatar className="w-12 h-12 flex-shrink-0">
                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                        {conversation.customerName
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className="font-semibold text-foreground truncate">{conversation.customerName}</h4>
                                        <span className="text-xs text-muted-foreground flex-shrink-0">{conversation.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                                </div>
                                {conversation.unread > 0 && (
                                    <Badge className="bg-primary text-primary-foreground flex-shrink-0">{conversation.unread}</Badge>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col chat-container">
                    {/* Chat Header */}
                    <div className="h-16 chat-header px-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {selectedConversation.customerName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-foreground">{selectedConversation.customerName}</h3>
                                <p className="text-xs text-muted-foreground">{selectedConversation.customerPhone}</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="gap-1">
                            <Bot className="w-3 h-3" />
                            AI Active
                        </Badge>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {selectedConversation.messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn("flex items-end gap-2", message.sender === "bot" && "flex-row-reverse")}
                            >
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                    <AvatarFallback
                                        className={cn(
                                            "text-xs font-semibold",
                                            message.sender === "customer" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
                                        )}
                                    >
                                        {message.sender === "customer" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={cn(
                                        "max-w-[70%] rounded-2xl px-4 py-2.5",
                                        message.sender === "customer"
                                            ? "message-bubble-customer rounded-bl-sm"
                                            : "message-bubble-bot rounded-br-sm",
                                    )}
                                >
                                    <p className="text-sm leading-relaxed">{message.text}</p>
                                    <div
                                        className={cn(
                                            "flex items-center gap-1 mt-1 text-xs",
                                            message.sender === "customer" ? "text-muted-foreground" : "text-primary/80",
                                        )}
                                    >
                                        <Clock className="w-3 h-3" />
                                        <span>{message.timestamp}</span>
                                        {message.sender === "bot" && message.status && (
                                            <CheckCheck
                                                className={cn("w-3.5 h-3.5 ml-1", message.status === "read" && "text-primary/60")}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="bg-card border-t border-border p-4">
                        <div className="flex items-center gap-3">
                            <Input
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim()}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            AI is handling responses automatically. You can take over anytime.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
