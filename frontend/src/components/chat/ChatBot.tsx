import { useState, useRef, useEffect } from 'react'
import { Market, Product } from '../../types'
import { MOCK_MARKETS } from '../../data/mockMarkets'
import './ChatBot.css'

interface ChatBotProps {
    onNavigate: (market: Market, product?: Product) => void
}

interface Message {
    id: string
    text: string
    sender: 'bot' | 'user'
    action?: {
        label: string
        marketId: string
        productId?: string
    }
}

export default function ChatBot({ onNavigate }: ChatBotProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Merhaba! Ben Pazar Asistanı. Size nasıl yardımcı olabilirim? (Örn: "En ucuz domates nerede?", "Beşiktaş pazarı açık mı?")', sender: 'bot' }
    ])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!inputText.trim()) return

        const userText = inputText.trim()
        addMessage(userText, 'user')
        setInputText('')
        setIsTyping(true)

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            })

            const data = await response.json()

            // Handle "double encoded" JSON string if necessary
            let parsedData = data
            if (typeof data === 'string') {
                try {
                    parsedData = JSON.parse(data)
                } catch (e) {
                    parsedData = { text: data }
                }
            }

            const botText = parsedData.text || "Anlaşılamadı."
            let action = undefined

            if (parsedData.action && parsedData.action.type === 'NAVIGATE') {
                action = {
                    label: 'Haritada Göster',
                    marketId: parsedData.action.marketId,
                    productId: parsedData.action.productId
                }
            }

            setIsTyping(false)
            addMessage(botText, 'bot', action)

        } catch (error) {
            console.error('AI Error:', error)
            setIsTyping(false)
            addMessage("Bağlantı hatası oluştu. Lütfen servislerin çalıştığından emin olun.", 'bot')
        }
    }

    const addMessage = (text: string, sender: 'bot' | 'user', action?: Message['action']) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text,
            sender,
            action
        }])
    }

    const handleActionClick = (action: Message['action']) => {
        if (!action) return
        const market = MOCK_MARKETS.find(m => m.id === action.marketId)
        if (market) {
            // Create a temporary product object if we have an ID but no ful data
            // In a real app we would fetch the product details
            const product = action.productId ? {
                id: action.productId,
                name: 'Seçilen Ürün',
                category: 'Genel',
                unit: 'adet',
                location: { x: 5, y: 5, z: 0 },
                minPrice: 0
            } : undefined

            onNavigate(market, product)

            // Optional: Close Chat?
            // setIsOpen(false) 
        }
    }

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>🤖 Pazar Asistanı (AI)</h3>
                        <button onClick={() => setIsOpen(false)} className="chat-close-btn">×</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                {msg.text}
                                {msg.action && (
                                    <button
                                        className="chat-action-btn"
                                        onClick={() => handleActionClick(msg.action)}
                                    >
                                        {msg.action.label}
                                    </button>
                                )}
                            </div>
                        ))}
                        {isTyping && <div className="message bot">Düşünüyor...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Bir şeyler sorun..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="chat-send-btn">➤</button>
                    </div>
                </div>
            )}

            <button
                className="chatbot-fab"
                onClick={() => setIsOpen(!isOpen)}
                title="Yapay Zeka Asistanı"
            >
                ✨
            </button>
        </div>
    )
}
