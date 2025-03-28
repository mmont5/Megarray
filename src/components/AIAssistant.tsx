import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, MicOff, Send, X, Maximize2, Minimize2, Volume2, VolumeX, Globe } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onAction?: (action: string, params: any) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onAction }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessages([
        {
          id: 'welcome',
          type: 'assistant',
          content: t('ai.assistant.welcome'),
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      resetTranscript();
      SpeechRecognition.startListening({ 
        continuous: true,
        language: i18n.language // Use current language for speech recognition
      });
    } else {
      toast.error(t('ai.assistant.speechNotSupported'));
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
  };

  const speak = (text: string) => {
    if (!isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language; // Use current language for speech synthesis
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      // Process commands
      const command = input.toLowerCase();
      
      if (command.includes('schedule') || command.includes('post')) {
        // Handle scheduling commands
        const platform = command.includes('tiktok') ? 'tiktok' : 
                        command.includes('instagram') ? 'instagram' :
                        command.includes('facebook') ? 'facebook' : 'unknown';
                        
        const timeMatch = command.match(/at (\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
        const time = timeMatch ? timeMatch[1] : null;

        if (platform !== 'unknown' && time) {
          onAction?.('schedule', { platform, time });
        }
      }

      // Simulate AI response in current language
      const response = await simulateAIResponse(command, i18n.language);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (isSpeaking) {
        speak(response);
      }
    } catch (error) {
      toast.error(t('ai.assistant.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (command: string, language: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, this would call your AI service with the user's preferred language
    // For now, we'll use translations
    if (command.includes('help')) {
      return t('ai.assistant.helpResponse');
    }

    if (command.includes('schedule') || command.includes('post')) {
      return t('ai.assistant.scheduleResponse');
    }

    if (command.includes('analytics') || command.includes('performance')) {
      return t('ai.assistant.analyticsResponse');
    }

    if (command.includes('integration') || command.includes('connect')) {
      return t('ai.assistant.integrationResponse');
    }

    return t('ai.assistant.defaultResponse');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-colors duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed right-4 bottom-20 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 ${
            isExpanded ? 'w-[600px] h-[80vh]' : 'w-[400px] h-[500px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold text-gray-900">{t('ai.assistant.title')}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSpeech}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                {isSpeaking ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleExpand}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 animate-pulse">
                  <div className="h-4 w-12 bg-gray-300 rounded"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={t('ai.assistant.placeholder')}
                  className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
                  rows={1}
                  style={{ maxHeight: '120px' }}
                />
                <button
                  onClick={listening ? stopListening : startListening}
                  className={`absolute right-2 bottom-2 p-1 rounded-full ${
                    listening ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {listening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;