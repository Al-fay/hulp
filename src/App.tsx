import { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";

// Fungsi untuk membersihkan format markdown
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // **bold**
    .replace(/__(.*?)__/g, "$1") // __bold__
    .replace(/\*(.*?)\*/g, "$1") // *italic*
    .replace(/_(.*?)_/g, "$1") // _italic_
    .replace(/^#+\s*(.*)$/gm, "$1") // heading
    .replace(/^- (.*)$/gm, "$1") // list
    .replace(/\n{2,}/g, "\n\n") // normalize newlines
    .trim();
}

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { from: "user" | "ai"; text: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      const cleanResponse = cleanMarkdown(data.response);

      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: cleanResponse,
          // pakai ini untuk mengetahui model yang menjawab
          // text:
          //   cleanResponse +
          //   (data.modelUsed ? `\n\n(Model: ${data.modelUsed})` : ""),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Terjadi kesalahan saat mengambil respons." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col justify-between min-h-screen p-4 bg-gray-500">
      <div className="flex-1 overflow-y-auto flex flex-col items-center">
        {/* Header atau elemen tambahan bisa ditambahkan di sini */}
      </div>

      <div className="w-5xl mx-auto bg-lime-100 rounded-md shadow-2xl p-4 flex flex-col gap-4">
        <div className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto border rounded p-2 bg-gray-100">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded break-words whitespace-pre-wrap ${
                msg.from === "user"
                  ? "bg-blue-500 text-white self-end text-justify"
                  : "bg-gray-300 text-gray-900 self-start text-justify"
              } max-w-[80%]`}
            >
              {msg.text}
            </div>
          ))}

          {isLoading && (
            <div className="bg-gray-300 text-gray-900 self-start p-2 rounded max-w-[80%] animate-pulse">
              Memproses...
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <Textarea
          className="resize-none"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
          {isLoading ? "Menunggu..." : "Kirim"}
        </Button>
      </div>
    </div>
  );
}

export default App;
