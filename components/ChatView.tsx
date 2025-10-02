import * as React from 'react';
import { ChatMessage } from '../types';
import { Send, Bot, User, CornerDownLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';


interface ChatViewProps {
  history: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ history, isLoading, onSendMessage }) => {
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(e as any);
    }
  };


  return (
    <div className="flex flex-col h-full max-h-[calc(80vh-120px)]">
      <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-4">
        {history.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Bot size={48} className="mb-4" />
                <h3 className="text-lg font-semibold text-gray-400">چت با هوش مصنوعی</h3>
                <p className="text-sm">می‌توانید سوالات خود را در مورد این پروفایل شبیه‌سازی شده بپرسید.</p>
            </div>
        )}
        {history.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-blue-400" />
              </div>
            )}
            <div
              className={`max-w-md lg:max-w-2xl p-3 rounded-lg text-white ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
                {msg.role === 'model' ? (
                     <ReactMarkdown
                        children={msg.text}
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        className="prose prose-sm prose-invert"
                        components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside" {...props} />,
                            pre: ({node, ...props}) => <pre className="bg-gray-800 p-2 rounded text-xs" {...props} />,
                        }}
                    />
                ) : (
                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-gray-300" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-blue-400" />
              </div>
            <div className="p-3 rounded-lg bg-gray-700 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <form onSubmit={handleSend} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="درباره این پروفایل سوالی بپرسید..."
            disabled={isLoading}
            rows={1}
            className="w-full bg-gray-700 text-gray-200 rounded-lg py-3 pl-12 pr-28 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500 transition-all"
            style={{ minHeight: '48px', direction: 'rtl' }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-md p-2 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            aria-label="ارسال پیام"
          >
            <Send size={18} />
          </button>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hidden md:block">
            Shift + <CornerDownLeft size={12} className="inline"/> برای خط جدید
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatView;