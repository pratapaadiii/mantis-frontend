type ChatHistoryManagerProps = {
    roadmapId: string;
    messages: ChatMessage[];
    onSendMessage: (message: ChatMessage) => void;
  };
  
  const ChatHistoryManager: React.FC<ChatHistoryManagerProps> = ({
    roadmapId,
    messages,
    onSendMessage,
  }) => {
    const [input, setInput] = useState("");
  
    const handleSendMessage = () => {
      if (!input.trim()) return;
  
      const newMessage: ChatMessage = {
        role: "user",
        content: input.trim(),
        timestamp: new Date().toLocaleTimeString(),
      };
  
      onSendMessage(newMessage);
      setInput("");
    };
  
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">AI Chat</h3>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.role === "user" ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              <p className="text-gray-800">{msg.content}</p>
              <span className="text-xs text-gray-500">{msg.timestamp}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-grow p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    );
  };