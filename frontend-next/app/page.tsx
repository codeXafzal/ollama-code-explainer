"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [codeInput, setCodeInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [codeInput]);

  const sendMessage = async () => {
    if (!codeInput.trim()) return;
    const userMessage: Message = { role: "user", content: codeInput };
    setMessages((prev) => [...prev, userMessage]);
    setCodeInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
      });
      if (!res.ok) throw new Error("Server error: " + res.status);
      const data: { explanation: string } = await res.json();
      const aiMessage: Message = { role: "assistant", content: data.explanation };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Error: " + err.message,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCodeInput("");
  };

  const insertSampleCode = (code: string) => {
    setCodeInput(code);
  };

  const suggestedPrompts = [
    {
      icon: "💡",
      title: "Explain Code",
      description: "Get detailed explanations",
    },
    {
      icon: "🐛",
      title: "Debug Issues",
      description: "Find and fix bugs",
    },
    {
      icon: "✨",
      title: "Optimize",
      description: "Improve performance",
    },
    {
      icon: "📚",
      title: "Add Comments",
      description: "Document your code",
    },
  ];

  const sampleCodes = [
    "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
    "function quickSort(arr) {\n    if (arr.length <= 1) return arr;\n    // implementation\n}",
    "SELECT * FROM users WHERE age > 18 ORDER BY name;",
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .message-animation {
          animation: fadeIn 0.5s ease-out;
        }

        .typing-indicator span {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #64748b;
          margin: 0 2px;
          animation: pulse 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0f172a;
          overflow: hidden;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1e293b;
        }

        ::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: "#e2e8f0",
          position: "relative",
        }}
      >
        {/* Sidebar Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 40,
              backdropFilter: "blur(4px)",
            }}
          />
        )}

        {/* Sidebar */}
        <div
          style={{
            width: sidebarOpen ? "280px" : "0",
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(148, 163, 184, 0.1)",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.3s ease",
            overflow: "hidden",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 50,
          }}
        >
          <div style={{ padding: "20px" }}>
            <button
              onClick={clearChat}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)";
              }}
            >
              <span style={{ fontSize: "18px" }}>✨</span>
              New Chat
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "12px",
              }}
            >
              Sample Code
            </div>
            {sampleCodes.map((code, i) => (
              <button
                key={i}
                onClick={() => {
                  insertSampleCode(code);
                  setSidebarOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  borderRadius: "8px",
                  color: "#cbd5e1",
                  fontSize: "13px",
                  cursor: "pointer",
                  marginBottom: "8px",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  fontFamily: "'Fira Code', monospace",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.8)";
                  e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.5)";
                  e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.1)";
                }}
              >
                {code.split("\n")[0]}...
              </button>
            ))}
          </div>

          <div
            style={{
              padding: "20px",
              borderTop: "1px solid rgba(148, 163, 184, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "rgba(30, 41, 59, 0.5)",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                A
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#e2e8f0" }}>
                  Afzal
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Pro User</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            marginLeft: sidebarOpen ? "280px" : "0",
            transition: "margin-left 0.3s ease",
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              height: "72px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  width: "44px",
                  height: "44px",
                  background: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#cbd5e1",
                  fontSize: "20px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.8)";
                  e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.5)";
                  e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.1)";
                }}
              >
                ☰
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  🧠
                </div>
                <div>
                  <h1
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Code Explainer AI
                  </h1>
                  <p style={{ fontSize: "12px", color: "#64748b" }}>
                    Your intelligent coding assistant
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={clearChat}
                style={{
                  padding: "10px 18px",
                  background: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  borderRadius: "10px",
                  color: "#cbd5e1",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.8)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.5)";
                  e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.1)";
                }}
              >
                <span>🗑️</span>
                Clear
              </button>
              <div
                style={{
                  padding: "6px 14px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#fff",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Pro
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 20px",
                  maxWidth: "1000px",
                  margin: "0 auto",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "72px",
                    marginBottom: "24px",
                    animation: "fadeIn 0.8s ease-out",
                  }}
                >
                  👋
                </div>
                <h2
                  style={{
                    fontSize: "42px",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "16px",
                    textAlign: "center",
                    animation: "fadeIn 0.8s ease-out 0.2s backwards",
                  }}
                >
                  Hello, I'm your Code Assistant!
                </h2>
                <p
                  style={{
                    fontSize: "18px",
                    color: "#94a3b8",
                    marginBottom: "48px",
                    textAlign: "center",
                    maxWidth: "600px",
                    animation: "fadeIn 0.8s ease-out 0.4s backwards",
                  }}
                >
                  I can explain, debug, optimize, and help you understand any code snippet.
                  What would you like to work on today?
                </p>

                {/* Suggested Prompts */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "16px",
                    width: "100%",
                    maxWidth: "900px",
                    animation: "fadeIn 0.8s ease-out 0.6s backwards",
                  }}
                >
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setCodeInput(prompt.title)}
                      style={{
                        padding: "24px",
                        background: "rgba(30, 41, 59, 0.5)",
                        border: "1px solid rgba(148, 163, 184, 0.1)",
                        borderRadius: "16px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(30, 41, 59, 0.8)";
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 30px rgba(59, 130, 246, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(30, 41, 59, 0.5)";
                        e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.1)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ fontSize: "32px", marginBottom: "12px" }}>
                        {prompt.icon}
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#e2e8f0",
                          marginBottom: "6px",
                        }}
                      >
                        {prompt.title}
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        {prompt.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "40px 20px",
                  maxWidth: "900px",
                  margin: "0 auto",
                  width: "100%",
                }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className="message-animation"
                    style={{
                      marginBottom: "32px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background:
                            msg.role === "user"
                              ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                              : "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "#fff",
                          boxShadow:
                            msg.role === "user"
                              ? "0 4px 15px rgba(59, 130, 246, 0.3)"
                              : "0 4px 15px rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        {msg.role === "user" ? "A" : "🤖"}
                      </div>

                      {/* Message Content */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#64748b",
                            marginBottom: "8px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {msg.role === "user" ? "You" : "Code Explainer"}
                        </div>
                        <div
                          style={{
                            fontSize: "15px",
                            lineHeight: "1.7",
                            color: "#cbd5e1",
                          }}
                        >
                          <ReactMarkdown
                            components={{
                              h1: ({ node, ...props }) => (
                                <h1
                                  style={{
                                    fontSize: "1.8rem",
                                    fontWeight: "700",
                                    marginTop: "20px",
                                    marginBottom: "12px",
                                    color: "#e2e8f0",
                                  }}
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "600",
                                    marginTop: "18px",
                                    marginBottom: "10px",
                                    color: "#e2e8f0",
                                  }}
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  style={{
                                    fontSize: "1.2rem",
                                    fontWeight: "600",
                                    marginTop: "16px",
                                    marginBottom: "8px",
                                    color: "#e2e8f0",
                                  }}
                                  {...props}
                                />
                              ),
                              code: ({ node, inline, ...props }) =>
                                inline ? (
                                  <code
                                    style={{
                                      backgroundColor: "rgba(59, 130, 246, 0.15)",
                                      color: "#60a5fa",
                                      padding: "3px 8px",
                                      borderRadius: "6px",
                                      fontFamily: "'Fira Code', monospace",
                                      fontSize: "0.9em",
                                      fontWeight: "500",
                                    }}
                                    {...props}
                                  />
                                ) : (
                                  <code
                                    style={{
                                      display: "block",
                                      backgroundColor: "rgba(15, 23, 42, 0.8)",
                                      color: "#94a3b8",
                                      padding: "20px",
                                      borderRadius: "12px",
                                      fontFamily: "'Fira Code', monospace",
                                      fontSize: "14px",
                                      overflowX: "auto",
                                      marginTop: "12px",
                                      marginBottom: "12px",
                                      border: "1px solid rgba(59, 130, 246, 0.2)",
                                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                                    }}
                                    {...props}
                                  />
                                ),
                              pre: ({ node, ...props }) => (
                                <pre style={{ margin: 0 }} {...props} />
                              ),
                              p: ({ node, ...props }) => (
                                <p style={{ marginBottom: "14px" }} {...props} />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  style={{
                                    marginLeft: "20px",
                                    marginBottom: "14px",
                                  }}
                                  {...props}
                                />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol
                                  style={{
                                    marginLeft: "20px",
                                    marginBottom: "14px",
                                  }}
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li style={{ marginBottom: "6px" }} {...props} />
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>

                        {/* Action Buttons */}
                        {msg.role === "assistant" && !loading && (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginTop: "16px",
                            }}
                          >
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(msg.content)
                              }
                              style={{
                                padding: "8px 14px",
                                background: "rgba(30, 41, 59, 0.5)",
                                border: "1px solid rgba(148, 163, 184, 0.1)",
                                borderRadius: "8px",
                                color: "#94a3b8",
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(30, 41, 59, 0.8)";
                                e.currentTarget.style.borderColor =
                                  "rgba(59, 130, 246, 0.5)";
                                e.currentTarget.style.color = "#cbd5e1";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(30, 41, 59, 0.5)";
                                e.currentTarget.style.borderColor =
                                  "rgba(148, 163, 184, 0.1)";
                                e.currentTarget.style.color = "#94a3b8";
                              }}
                            >
                              <span>📋</span>
                              Copy
                            </button>
                            <button
                              style={{
                                padding: "8px 14px",
                                background: "rgba(30, 41, 59, 0.5)",
                                border: "1px solid rgba(148, 163, 184, 0.1)",
                                borderRadius: "8px",
                                color: "#94a3b8",
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(30, 41, 59, 0.8)";
                                e.currentTarget.style.borderColor =
                                  "rgba(16, 185, 129, 0.5)";
                                e.currentTarget.style.color = "#cbd5e1";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(30, 41, 59, 0.5)";
                                e.currentTarget.style.borderColor =
                                  "rgba(148, 163, 184, 0.1)";
                                e.currentTarget.style.color = "#94a3b8";
                              }}
                            >
                              <span>👍</span>
                              Good
                            </button>
                            <button
                              style={{
                                padding: "8px 14px",
                                background: "rgba(30, 41, 59, 0.5)",
                                border: "1px solid rgba(148, 163, 184, 0.1)",
                                borderRadius: "8px",
                                color: "#94a3b8",
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(30, 41, 59, 0.8)";
                                e.currentTarget.style.borderColor =
                                  "rgba(239, 68, 68, 0.5)";
                                e.currentTarget.style.color = "#cbd5e1";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(30, 41, 59, 0.5)";
                                e.currentTarget.style.borderColor =
                                  "rgba(148, 163, 184, 0.1)";
                                e.currentTarget.style.color = "#94a3b8";
                              }}
                            >
                              <span>👎</span>
                              Bad
                            </button>
                            <button
                              onClick={() => setCodeInput("Explain this in more detail")}
                              style={{
                                padding: "8px 14px",
                                background: "rgba(30, 41, 59, 0.5)",
                                border: "1px solid rgba(148, 163, 184, 0.1)",
                                borderRadius: "8px",
                                color: "#94a3b8",
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(30, 41, 59, 0.8)";
                                e.currentTarget.style.borderColor =
                                  "rgba(139, 92, 246, 0.5)";
                                e.currentTarget.style.color = "#cbd5e1";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(30, 41, 59, 0.5)";
                                e.currentTarget.style.borderColor =
                                  "rgba(148, 163, 184, 0.1)";
                                e.currentTarget.style.color = "#94a3b8";
                              }}
                            >
                              <span>🔄</span>
                              Regenerate
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message-animation" style={{ marginBottom: "32px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "20px",
                          color: "#fff",
                          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                        }}
                      >
                        🤖
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#64748b",
                            marginBottom: "8px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Code Explainer
                        </div>
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "24px",
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(148, 163, 184, 0.1)",
            }}
          >
            <div
              style={{
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  background: "rgba(30, 41, 59, 0.6)",
                  borderRadius: "20px",
                  padding: "8px",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-end",
                }}
              >
                {/* Attach button */}
                <button
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    fontSize: "20px",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)";
                    e.currentTarget.style.color = "#3b82f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#64748b";
                  }}
                >
                  📎
                </button>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Paste your code or ask a question..."
                  onKeyDown={handleKeyDown}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#e2e8f0",
                    fontSize: "15px",
                    fontFamily: "inherit",
                    resize: "none",
                    minHeight: "40px",
                    maxHeight: "200px",
                    padding: "10px 8px",
                    lineHeight: "1.5",
                  }}
                  rows={1}
                />

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <button
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#64748b",
                      fontSize: "18px",
                      borderRadius: "12px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)";
                      e.currentTarget.style.color = "#8b5cf6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#64748b";
                    }}
                  >
                    🎤
                  </button>

                  <button
                    onClick={sendMessage}
                    disabled={loading || !codeInput.trim()}
                    style={{
                      width: "40px",
                      height: "40px",
                      background:
                        loading || !codeInput.trim()
                          ? "rgba(51, 65, 85, 0.5)"
                          : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      border: "none",
                      cursor: loading || !codeInput.trim() ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "20px",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      opacity: loading || !codeInput.trim() ? 0.5 : 1,
                      boxShadow:
                        loading || !codeInput.trim()
                          ? "none"
                          : "0 4px 15px rgba(59, 130, 246, 0.4)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && codeInput.trim()) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(59, 130, 246, 0.5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        loading || !codeInput.trim()
                          ? "none"
                          : "0 4px 15px rgba(59, 130, 246, 0.4)";
                    }}
                  >
                    ↑
                  </button>
                </div>
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#475569",
                  textAlign: "center",
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <span>⚡</span>
                Press <kbd style={{ padding: "2px 6px", background: "rgba(30, 41, 59, 0.5)", borderRadius: "4px", fontSize: "11px" }}>Enter</kbd> to send, <kbd style={{ padding: "2px 6px", background: "rgba(30, 41, 59, 0.5)", borderRadius: "4px", fontSize: "11px" }}>Shift+Enter</kbd> for new line
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}