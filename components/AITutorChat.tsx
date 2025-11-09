
import React, { useState, useRef, useEffect } from 'react';
import { chatSession, isApiKeySet } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { SendIcon } from './icons/SendIcon';

// FIX: Added a basic markdown renderer to display formatted AI responses.
const renderMarkdown = (text: string) => {
  // A basic markdown to HTML conversion. For robust parsing, a dedicated library is recommended.
  // This handles code blocks, bold, italics, lists, and newlines.
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Process code blocks first to prevent markdown parsing within them
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => `<pre><code>${code}</code></pre>`);
  
  // Process other markdown for parts that are not inside <pre> tags
  const parts = html.split(/(<pre>[\s\S]*?<\/pre>)/g);

  return parts.map((part, index) => {
    if (index % 2 === 1) { // It's a code block, return as is
      return part;
    }
    return part
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\s*[-*]\s(.*)/gm, '<li>$1</li>')
      .replace(/(\<\/li\>)\s*(\<li\>)/g, '</li><li>') // Join list items
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n/g, '<br />')
      .replace(/<\/ul><br \/>/g, '</ul>')
      .replace(/<br \/><ul>/g, '<ul>')
      .replace(/<\/pre><br \/>/g, '</pre>');
  }).join('');
};


const AITutorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am FocusFlow, your AI study partner. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    if (!isApiKeySet) {
        setError("API Key not configured. Please set up your API key to use the AI Tutor.");
        setMessages(prev => [...prev, {role: 'model', text: "I can't respond right now. My API key is missing."}]);
        setIsLoading(false);
        return;
    }

    try {
      // FIX: Use non-null assertion as chatSession is guaranteed to be available if isApiKeySet is true.
      const stream = await chatSession!.sendMessageStream({ message: input });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = modelResponse;
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong. Please try again.');
       setMessages(prev => [...prev, {role: 'model', text: 'An error occurred while getting my response.'}]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-center">AI Tutor</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <BotIcon />}
              <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary-light text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 rounded-bl-none'}`}>
                 <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
              </div>
              {msg.role === 'user' && <UserIcon />}
            </div>
          ))}
          {isLoading && messages[messages.length - 1].role === 'user' && (
            <div className="flex items-start gap-3">
              <BotIcon />
              <div className="max-w-md p-3 rounded-lg bg-slate-200 dark:bg-slate-700 rounded-bl-none">
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
       {error && <div className="p-2 text-center text-red-500 text-sm">{error}</div>}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || input.trim() === ''}
            className="p-2 rounded-md bg-primary text-white disabled:bg-slate-400 dark:disabled:bg-slate-600 hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AITutorChat;
