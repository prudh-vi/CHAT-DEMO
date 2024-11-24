"use client"

import { useState, useEffect, useRef, FormEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { HomeIcon, LogOut, Menu, Send, Trash2 } from 'lucide-react'

type Message = {
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
    setMessages((prevMessages) => [...prevMessages, warningMessage])
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
        const newMessages = data.messages
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
          setMessages((prevMessages) => [...prevMessages, ...newMessages])
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
    if (isSending) return // Prevent multiple sends while a send is in progress

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
      setMessages((prevMessages) => [...prevMessages, newMessage])
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
    <div className="h-screen bg-background flex flex-col">
      <nav className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          className="text-primary-foreground hover:text-primary-foreground/80"
          onClick={() => (window.location.href = "/")}
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          <span>Home</span>
        </Button>
        <Button variant="destructive" onClick={() => (window.location.href = "/")}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </nav>

      <Card className="flex-1 flex flex-col shadow-lg">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
              <AvatarImage src="/api/placeholder/40/40" alt="User Avatar" />
              <AvatarFallback>Pru</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Prudhvi</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">User</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="lg">
              <Menu className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleRemoveHistory}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chat
            </Button>
          </div>
        </div>

        <div id="messageContainer" className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex flex-col space-y-2 ${msg.isIncoming ? "" : "items-end"}`}
            >
              <div
                className={`p-3 max-w-[80%] ${
                  msg.serverResponse
                    ? "bg-red-500 text-white rounded-2xl rounded-tl-none self-start"
                    : msg.isIncoming
                    ? "bg-muted text-muted-foreground rounded-2xl rounded-tl-none self-start"
                    : "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
                }`}
              >
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t bg-background p-4">
          <form className="flex items-center space-x-2" onSubmit={handleSendMessage}>
            <Input
              name="messageInput"
              placeholder="Type your message here..."
              className="flex-1"
            />
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSending}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}