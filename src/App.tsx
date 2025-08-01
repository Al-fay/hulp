import { useState } from "react";
import { Button } from "./components/ui/button.tsx";
import { Textarea } from "./components/ui/textarea.tsx";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Tambah pesan user
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    
    // Clear input
    setInput("");

    // Simulasi balasan AI (kamu bisa ganti ini dengan call API)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Ini balasan AI untuk: " + input }
      ]);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-500">
      <div className="w-full max-w-md bg-white rounded-md shadow-md p-4 flex flex-col gap-4">
        <div className="flex flex-col space-y-2 max-h-96 overflow-y-auto border rounded p-2 bg-gray-100">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                msg.from === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-gray-900 self-start"
              } max-w-[80%]`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <Textarea
          className="resize-none"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <Button onClick={handleSend} disabled={!input.trim()}>
          Kirim
        </Button>
      </div>
    </div>
  );
}

export default App;
