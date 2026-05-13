"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, X, Download, User, Clock, CheckCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_type: "user" | "agent";
  sender_name: string;
  created_at: string;
  attachments?: Array<{ name: string; url: string; size: number }>;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

interface TicketDetailProps {
  ticketId: string;
}

export default function TicketDetail({ ticketId }: TicketDetailProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/support/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch ticket");

      const data = await response.json();
      setTicket(data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 3) {
      alert("Maximum 3 files allowed per message");
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSendReply = async () => {
    if (!replyText.trim() && files.length === 0) return;

    setSending(true);

    try {
      const formData = new FormData();
      formData.append("ticket_id", ticketId);
      formData.append("content", replyText);

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await fetch(`/api/v1/support/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to send reply");

      setReplyText("");
      setFiles([]);
      fetchTicket();
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/v1/support/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      fetchTicket();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Ticket not found</p>
      </div>
    );
  }

  const statusOptions = ["open", "in-progress", "resolved", "closed"];

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{ticket.subject}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Ticket #{ticket.id}</span>
              <span>•</span>
              <span className="capitalize">{ticket.category}</span>
              <span>•</span>
              <span>Created {formatDate(ticket.created_at)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              ticket.priority === "urgent"
                ? "bg-red-100 text-red-800"
                : ticket.priority === "high"
                ? "bg-orange-100 text-orange-800"
                : ticket.priority === "medium"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
            </span>
          </div>
        </div>

        {/* Status Update */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <div className="flex items-center gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  ticket.status === status
                    ? status === "open"
                      ? "bg-blue-600 text-white"
                      : status === "in-progress"
                      ? "bg-yellow-600 text-white"
                      : status === "resolved"
                      ? "bg-green-600 text-white"
                      : "bg-gray-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Conversation</h3>
          <p className="text-sm text-gray-600">{ticket.messages.length} message{ticket.messages.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
          {ticket.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender_type === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.sender_type === "user"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}>
                <User className="w-5 h-5" />
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-[70%] ${
                message.sender_type === "user" ? "text-right" : ""
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{message.sender_name}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(message.created_at)}
                  </span>
                </div>

                <div className={`p-3 rounded-lg ${
                  message.sender_type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-2 rounded text-xs ${
                          message.sender_type === "user"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        <Download className="w-3 h-3" />
                        <span>{attachment.name}</span>
                        <span className="text-xs opacity-75">
                          ({(attachment.size / 1024).toFixed(1)} KB)
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Form */}
        {ticket.status !== "closed" && (
          <div className="p-4 border-t border-gray-200">
            {/* File Attachments */}
            {files.length > 0 && (
              <div className="mb-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="file"
                id="attach-file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="attach-file"
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Paperclip className="w-5 h-5 text-gray-600" />
              </label>

              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
                placeholder="Type your reply..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleSendReply}
                disabled={sending || (!replyText.trim() && files.length === 0)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        )}

        {ticket.status === "closed" && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">This ticket is closed. Reopen it to continue the conversation.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
