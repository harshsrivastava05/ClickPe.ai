import { useState, useCallback, useRef } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UseClickPeChatOptions {
  api: string;
  productId: string;
  initialMessages?: Message[];
}

export function useClickPeChat({ api, productId, initialMessages = [] }: UseClickPeChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref to keep track of the abort controller for the current request
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const append = useCallback(async (message: { role: 'user', content: string }) => {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.content,
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    
    // Create assistant placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };
    
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          productId,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        accumulatedContent += chunkValue;

        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === assistantMessageId 
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err);
        console.error('Chat error:', err);
        // Optionally remove the empty assistant message or show an error state in it
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [api, messages, productId]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!input.trim()) return;

    const currentInput = input;
    setInput(''); // Clear input immediately
    await append({ role: 'user', content: currentInput });
  }, [input, append]);

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    error,
  };
}
