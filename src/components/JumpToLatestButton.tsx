import { useState, useEffect, useCallback } from "react";

type JumpToLatestButtonProps = {
  chatBodyRef: React.RefObject<HTMLDivElement>;
};

const JumpToLatestButton: React.FC<JumpToLatestButtonProps> = ({ chatBodyRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when the user is not near the bottom of the chat body.
  const handleScroll = useCallback(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    const { scrollTop, scrollHeight, clientHeight } = chatBody;
    const SCROLL_THRESHOLD = 100;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
    setIsVisible(!isAtBottom);
  }, [chatBodyRef]);

  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    chatBody.addEventListener("scroll", handleScroll);
    // Run immediately to set the initial state
    handleScroll();

    return () => {
      chatBody.removeEventListener("scroll", handleScroll);
    };
  }, [chatBodyRef, handleScroll]);

  const scrollToBottom = useCallback(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatBodyRef]);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToBottom}
      aria-label="Jump to latest message"
      className="
        sticky bottom-8 left-1/2 transform -translate-x-1/2 z-50
        flex items-center justify-center
        h-8 w-8
        rounded-full border border-gray-300 dark:border-gray-600
        bg-white/80 dark:bg-gray-800/80
        shadow-md
        transition-transform duration-200
        hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-800 dark:text-gray-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

export default JumpToLatestButton;
