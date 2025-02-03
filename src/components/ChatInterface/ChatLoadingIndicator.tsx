export function ChatLoadingIndicator() {
    return (
      <div className="flex space-x-1 justify-center mt-4">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
      </div>
    );
  }