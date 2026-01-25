'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import HeaderAluno from '@/app/components/HeaderAluno';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import api from '@/services/axios';

interface Mensagem {
    id: string;
    tipo: 'usuario' | 'ia';
    texto: string;
    questoesRelacionadas?: any[];
    timestamp: Date;
}

// Função para converter Markdown em HTML
function parseMarkdown(texto: string): string {
    return texto
        // Headers (deve vir antes de outras regras)
        .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-gray-900 mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-gray-900 mt-4 mb-2">$1</h1>')
        // Negrito e Itálico
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        // Code inline
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-primary px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
        // Code block
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-3 rounded-lg my-2 overflow-x-auto text-xs"><code>$2</code></pre>')
        // Listas não ordenadas
        .replace(/^\s*[-*]\s+(.*)$/gim, '<li class="ml-4 list-disc">$1</li>')
        // Listas ordenadas
        .replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li class="ml-4 list-decimal">$2</li>')
        // Blockquote
        .replace(/^>\s+(.*)$/gim, '<blockquote class="border-l-4 border-primary pl-3 italic text-gray-600 my-2">$1</blockquote>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:text-primary/80" target="_blank">$1</a>')
        // Horizontal rule
        .replace(/^---$/gim, '<hr class="my-4 border-gray-200" />')
        // Line breaks (deve ser uma das últimas regras)
        .replace(/\n\n/g, '</p><p class="mb-2">')
        .replace(/\n/g, '<br/>')
        // Wrap em parágrafo se necessário
        .replace(/^(?!<[h|p|u|o|l|b|pre|hr])(.+)$/gim, '<p class="mb-2">$1</p>');
}

// Componente para limpar e agrupar listas
function MensagemTexto({ texto, tipo }: { texto: string; tipo: 'usuario' | 'ia' }) {
    const htmlContent = parseMarkdown(texto);
    
    // Agrupa <li> consecutivos em <ul> ou <ol>
    const htmlComListas = htmlContent
        .replace(/(<li class="ml-4 list-disc">.*?<\/li>\s*)+/g, '<ul class="my-2 space-y-1">$&</ul>')
        .replace(/(<li class="ml-4 list-decimal">.*?<\/li>\s*)+/g, '<ol class="my-2 space-y-1">$&</ol>');

    return (
        <div 
            className={`text-sm leading-relaxed ${tipo === 'usuario' ? 'text-white' : 'text-gray-800'}`}
            dangerouslySetInnerHTML={{ __html: htmlComListas }}
        />
    );
}

export default function AssistentePage() {
    const searchParams = useSearchParams();
    const materiaId = searchParams.get('materia');
    const topicoId = searchParams.get('topico');
    
    const [mensagens, setMensagens] = useState<Mensagem[]>([
        {
            id: '1',
            tipo: 'ia',
            texto: 'Olá! 👋 Sou o assistente do **Bora Entender**. Estou aqui para te ajudar a entender melhor os conteúdos. Pode me perguntar qualquer coisa!',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensagens]);

    const enviarPergunta = async () => {
        if (!inputValue.trim() || isLoading) return;

        const perguntaUsuario: Mensagem = {
            id: Date.now().toString(),
            tipo: 'usuario',
            texto: inputValue,
            timestamp: new Date(),
        };

        setMensagens(prev => [...prev, perguntaUsuario]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await api.post('/ia/perguntar', {
                pergunta: inputValue,
                materiaId: materiaId ? parseInt(materiaId) : undefined,
                topicoId: topicoId ? parseInt(topicoId) : undefined,
            });

            const respostaIA: Mensagem = {
                id: (Date.now() + 1).toString(),
                tipo: 'ia',
                texto: response.data.resposta,
                questoesRelacionadas: response.data.questoesRelacionadas,
                timestamp: new Date(),
            };

            setMensagens(prev => [...prev, respostaIA]);
        } catch (error) {
            const erroMensagem: Mensagem = {
                id: (Date.now() + 1).toString(),
                tipo: 'ia',
                texto: 'Desculpe, tive um problema para processar sua pergunta. Pode tentar novamente?',
                timestamp: new Date(),
            };
            setMensagens(prev => [...prev, erroMensagem]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarPergunta();
        }
    };

    return (
        <main className="w-full min-h-screen h-screen flex flex-col">
            <HeaderAluno />
            
            <div className="flex-1 bg-bg-secondary flex flex-col max-h-[calc(100vh-64px)]">
                {/* Header do Chat */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="text-primary" size={24} />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900">Assistente IA</h1>
                            <p className="text-sm text-gray-500">Tire suas dúvidas sobre os conteúdos</p>
                        </div>
                    </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                    {mensagens.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.tipo === 'ia' && (
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot className="text-primary" size={18} />
                                </div>
                            )}
                            
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                    msg.tipo === 'usuario'
                                        ? 'bg-primary text-white rounded-br-sm'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                                }`}
                            >
                                <MensagemTexto texto={msg.texto} tipo={msg.tipo} />
                                
                                {/* Questões Relacionadas */}
                                {msg.questoesRelacionadas && msg.questoesRelacionadas.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">Questões relacionadas:</p>
                                        {msg.questoesRelacionadas.map((q, i) => (
                                            <div key={i} className="text-xs bg-gray-50 rounded-lg p-2 mb-2">
                                                {q.enunciado.substring(0, 100)}...
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {msg.tipo === 'usuario' && (
                                <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                    <User className="text-gray-600" size={18} />
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Bot className="text-primary" size={18} />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
                                <Loader2 className="animate-spin text-primary" size={20} />
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center gap-3 max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Digite sua dúvida..."
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            disabled={isLoading}
                        />
                        <button
                            onClick={enviarPergunta}
                            disabled={isLoading || !inputValue.trim()}
                            className="size-12 bg-primary hover:bg-primary/90 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}