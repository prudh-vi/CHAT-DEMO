"use client"

import { useState, useEffect, useRef, FormEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { HomeIcon, LogOut, Send, Trash2 } from 'lucide-react'

interface Message {
  id?: string
  message: string
  user: string
  isIncoming: boolean
  serverResponse?: boolean
  timestamp?: number
}

export default function Chat() {
  const [lastMessageId, setLastMessageId] = useState<number>(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messageCache = useRef(new Set<string>())

  const displayWarning = (warning: string): void => {
    const warningMessage: Message = {
      id: `warning-${Date.now()}`,
      message: warning,
      user: "System",
      isIncoming: true,
      serverResponse: true,
      timestamp: Date.now(),
    }
    setMessages((prevMessages: Message[]) => [...prevMessages, warningMessage])
  }

  const createMessageHash = (msg: Message): string => {
    return `${msg.message}-${msg.user}-${msg.timestamp || Date.now()}`
  }

  const fetchMessages = async () => {
    if (isFetching) return
    setIsFetching(true)

    try {
      const response = await fetch(
        `https://repo-ecaf.onrender.com/api/messages?lastMessageId=${lastMessageId}`
      )
      const data = await response.json()

      if (data.messages && data.messages.length > 0) {
        const newMessages: Message[] = data.messages
          .map((msg: { message: string; user: string; timestamp?: number }) => ({
            id: `${msg.user}-${msg.timestamp || Date.now()}`,
            message: msg.message,
            user: msg.user,
            isIncoming: msg.user !== "User",
            serverResponse: msg.user !== "User",
            timestamp: msg.timestamp || Date.now(),
          }))
          .filter((msg: Message) => {
            const hash = createMessageHash(msg)
            if (!messageCache.current.has(hash)) {
              messageCache.current.add(hash)
              return true
            }
            return false
          })

        if (newMessages.length > 0) {
          setMessages((prevMessages: Message[]) => [...prevMessages, ...newMessages])
          setLastMessageId(data.lastMessageId)
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      displayWarning("Failed to fetch messages. Please try again.")
    } finally {
      setIsFetching(false)
    }
  }

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (isSending) return

    setIsSending(true)
    const form = e.target as HTMLFormElement
    const messageInput = form.elements.namedItem("messageInput") as HTMLInputElement
    const message = messageInput.value.trim()

    if (!message) {
      setIsSending(false)
      return
    }

    const newMessage: Message = {
      id: `user-${Date.now()}`,
      message,
      user: "User",
      isIncoming: false,
      timestamp: Date.now(),
    }

    const messageHash = createMessageHash(newMessage)
    if (!messageCache.current.has(messageHash)) {
      messageCache.current.add(messageHash)
      setMessages((prevMessages: Message[]) => [...prevMessages, newMessage])
    }

    messageInput.value = ""

    try {
      const response = await fetch("https://repo-ecaf.onrender.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "User", message }),
      })

      const data = await response.json()
      if (data.safetyAnalysis && data.safetyAnalysis !== "SAFE") {
        displayWarning(data.safetyAnalysis)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      displayWarning("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleRemoveHistory = async (): Promise<void> => {
    setMessages([])
    setLastMessageId(0)
    messageCache.current.clear()

    try {
      const response = await fetch("https://repo-ecaf.onrender.com/api/messages/clear", {
        method: "DELETE",
      })

      if (!response.ok) {
        console.error("Failed to clear chat history on server.")
        displayWarning("Failed to clear history on server. Please try again.")
      }
    } catch (error) {
      console.error("Error clearing chat history:", error)
      displayWarning("Failed to clear history on server. Please try again.")
    }
  }

  useEffect(() => {
    const interval = setInterval(fetchMessages, 1000)
    return () => clearInterval(interval)
  }, [lastMessageId])

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => (window.location.href = "/")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
        >
          <HomeIcon className="h-5 w-5 text-green" />
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => (window.location.href = "/")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <Card className="flex-1 flex flex-col shadow-lg mx-auto w-full max-w-5xl rounded-xl">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
              <AvatarImage src="/api/placeholder/40/40" alt="User Avatar" />
              <AvatarFallback>Pru</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">Prudhvi</h2>
              <p className="text-sm sm:text-base text-muted-foreground">User</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="lg"
            onClick={handleRemoveHistory}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Clear Chat</span>
          </Button>
        </div>

        <div id="messageContainer" className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg: Message, index) => (
            <div
              key={msg.id || index}
              className={`flex flex-col space-y-2 ${msg.isIncoming ? "" : "items-end"}`}
            >
              <div
                className={`p-4 max-w-[50%] ${
                  msg.serverResponse
                    ? "bg-red-400/30 text-red-500 rounded-2xl rounded-tl-none self-start"
                    : msg.isIncoming
                    ? "bg-muted text-muted-foreground rounded-2xl rounded-tl-none self-start"
                    : "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
                }`}
              >
                <p className="text-base">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t bg-background p-6">
          <form className="flex items-center space-x-4 max-w-4xl mx-auto" onSubmit={handleSendMessage}>
            <Input
              name="messageInput"
              placeholder="Type your message here..."
              className="flex-1 text-base"
            />
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
              disabled={isSending}
            >
              <Send className="mr-2 h-5 w-5" />
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}