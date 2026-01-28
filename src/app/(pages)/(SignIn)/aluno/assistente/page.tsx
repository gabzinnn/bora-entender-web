'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import HeaderAluno from '@/app/components/HeaderAluno';
import { Send, Bot, User, Loader2, Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react';
import api from '@/services/axios';

interface Mensagem {
    id: number;
    tipo: 'USUARIO' | 'ASSISTENTE';
    conteudo: string;
    createdAt: string;
}

interface Chat {
    id: number;
    titulo: string;
    materiaId?: number;
    materia?: {
        id: number;
        nome: string;
        cor: string;
        icone: string;
    };
    ultimaMensagem?: string;
    ultimaAtividade: string;
}

// Função para converter Markdown em HTML
function parseMarkdown(texto: string): string {
    return texto
        .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-gray-900 mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-gray-900 mt-4 mb-2">$1</h1>')
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-primary px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
        .replace(/^\s*[-*]\s+(.*)$/gim, '<li class="ml-4 list-disc">$1</li>')
        .replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li class="ml-4 list-decimal">$2</li>')
        .replace(/^>\s+(.*)$/gim, '<blockquote class="border-l-4 border-primary pl-3 italic text-gray-600 my-2">$1</blockquote>')
        .replace(/\n\n/g, '</p><p class="mb-2">')
        .replace(/\n/g, '<br/>');
}

function MensagemTexto({ texto, tipo }: { texto: string; tipo: 'USUARIO' | 'ASSISTENTE' }) {
    const htmlContent = parseMarkdown(texto);
    const htmlComListas = htmlContent
        .replace(/(<li class="ml-4 list-disc">.*?<\/li>\s*)+/g, '<ul class="my-2 space-y-1">$&</ul>')
        .replace(/(<li class="ml-4 list-decimal">.*?<\/li>\s*)+/g, '<ol class="my-2 space-y-1">$&</ol>');

    return (
        <div 
            className={`text-sm leading-relaxed ${tipo === 'USUARIO' ? 'text-white' : 'text-gray-800'}`}
            dangerouslySetInnerHTML={{ __html: htmlComListas }}
        />
    );
}

export default function AssistentePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const materiaId = searchParams.get('materia');
    const chatIdParam = searchParams.get('chat');
    
    const [chats, setChats] = useState<Chat[]>([]);
    const [chatAtual, setChatAtual] = useState<number | null>(chatIdParam ? parseInt(chatIdParam) : null);
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Fechado por padrão em mobile
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensagens]);

    // Carrega lista de chats
    useEffect(() => {
        carregarChats();
    }, [materiaId]);

    // Carrega chat específico quando selecionado
    useEffect(() => {
        if (chatAtual) {
            carregarChat(chatAtual);
        } else {
            setMensagens([]);
        }
    }, [chatAtual]);

    // Fecha sidebar quando seleciona um chat em mobile
    const handleSelecionarChat = (chatId: number) => {
        selecionarChat(chatId);
        setSidebarOpen(false);
    };

    const carregarChats = async () => {
        setIsLoadingChats(true);
        try {
            const params = materiaId ? `?materiaId=${materiaId}` : '';
            const response = await api.get(`/ia/chats${params}`);
            setChats(response.data);
        } catch (error) {
            console.error('Erro ao carregar chats:', error);
        } finally {
            setIsLoadingChats(false);
        }
    };

    const carregarChat = async (chatId: number) => {
        try {
            const response = await api.get(`/ia/chats/${chatId}`);
            setMensagens(response.data.mensagens);
        } catch (error) {
            console.error('Erro ao carregar chat:', error);
        }
    };

    const criarNovoChat = () => {
        setChatAtual(null);
        setMensagens([]);
        setSidebarOpen(false);
        router.push(materiaId ? `/aluno/assistente?materia=${materiaId}` : '/aluno/assistente');
    };

    const selecionarChat = (chatId: number) => {
        setChatAtual(chatId);
        router.push(materiaId ? `/aluno/assistente?materia=${materiaId}&chat=${chatId}` : `/aluno/assistente?chat=${chatId}`);
    };

    const deletarChat = async (chatId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Tem certeza que deseja deletar esta conversa?')) return;

        try {
            await api.delete(`/ia/chats/${chatId}`);
            setChats(prev => prev.filter(c => c.id !== chatId));
            if (chatAtual === chatId) {
                criarNovoChat();
            }
        } catch (error) {
            console.error('Erro ao deletar chat:', error);
        }
    };

    const enviarPergunta = async () => {
        if (!inputValue.trim() || isLoading) return;

        const perguntaTexto = inputValue;
        setInputValue('');
        setIsLoading(true);

        const mensagemUsuario: Mensagem = {
            id: Date.now(),
            tipo: 'USUARIO',
            conteudo: perguntaTexto,
            createdAt: new Date().toISOString(),
        };
        setMensagens(prev => [...prev, mensagemUsuario]);

        try {
            const response = await api.post('/ia/perguntar', {
                pergunta: perguntaTexto,
                chatId: chatAtual || undefined,
                materiaId: materiaId ? parseInt(materiaId) : undefined,
            });

            if (!chatAtual && response.data.chatId) {
                setChatAtual(response.data.chatId);
                router.push(materiaId 
                    ? `/aluno/assistente?materia=${materiaId}&chat=${response.data.chatId}` 
                    : `/aluno/assistente?chat=${response.data.chatId}`
                );
                carregarChats();
            }

            const mensagemIA: Mensagem = {
                id: Date.now() + 1,
                tipo: 'ASSISTENTE',
                conteudo: response.data.resposta,
                createdAt: new Date().toISOString(),
            };
            setMensagens(prev => [...prev, mensagemIA]);

        } catch (error) {
            const erroMensagem: Mensagem = {
                id: Date.now() + 1,
                tipo: 'ASSISTENTE',
                conteudo: 'Desculpe, tive um problema para processar sua pergunta. Pode tentar novamente?',
                createdAt: new Date().toISOString(),
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
            
            <div className="flex-1 flex max-h-[calc(100vh-64px)] relative">
                {/* Overlay para mobile */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar com histórico de chats */}
                <aside className={`
                    fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                    w-70 sm:w-72 bg-white border-r border-gray-200 
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    lg:top-0 top-16
                `}>
                    {/* Header da Sidebar - Mobile */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
                        <h2 className="font-semibold text-gray-900">Conversas</h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-3 sm:p-4 border-b border-gray-200 lg:border-t-0">
                        <button
                            onClick={criarNovoChat}
                            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-colors text-sm sm:text-base"
                        >
                            <Plus size={18} className="sm:w-5 sm:h-5" />
                            Nova conversa
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {isLoadingChats ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-gray-400" size={24} />
                            </div>
                        ) : chats.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-sm px-4">
                                Nenhuma conversa ainda.<br/>
                                Comece uma nova!
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {chats.map(chat => (
                                    <div
                                        key={chat.id}
                                        onClick={() => handleSelecionarChat(chat.id)}
                                        className={`group flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                                            chatAtual === chat.id 
                                                ? 'bg-primary/10 text-primary' 
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        <MessageSquare size={16} className="mt-0.5 shrink-0 sm:w-4.5 sm:h-4.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-medium truncate">{chat.titulo}</p>
                                            {chat.materia && (
                                                <span 
                                                    className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full mt-1 inline-block"
                                                    style={{ 
                                                        backgroundColor: `${chat.materia.cor}20`,
                                                        color: chat.materia.cor 
                                                    }}
                                                >
                                                    {chat.materia.nome}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => deletarChat(chat.id, e)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                                        >
                                            <Trash2 size={14} className="text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Área principal do chat */}
                <div className="flex-1 bg-bg-secondary flex flex-col min-w-0">
                    {/* Header do Chat */}
                    <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                            aria-label="Abrir menu de conversas"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="size-8 sm:size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Bot className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="font-bold text-gray-900 text-sm sm:text-base truncate">Assistente IA</h1>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                                {chatAtual ? 'Continuando conversa...' : 'Nova conversa'}
                            </p>
                        </div>
                    </div>

                    {/* Mensagens */}
                    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
                        {mensagens.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <div className="size-12 sm:size-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                                    <Bot className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Como posso te ajudar?</h2>
                                <p className="text-gray-500 text-sm sm:text-base max-w-md">
                                    Pergunte sobre qualquer conteúdo que você está estudando. 
                                    Vou te ajudar a entender melhor!
                                </p>
                                
                                {/* Sugestões de perguntas - Mobile friendly */}
                                <div className="mt-6 w-full max-w-md space-y-2">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Sugestões</p>
                                    {[
                                        'Me explique o que é regra de três',
                                        'Como resolver equações de segundo grau?',
                                        'O que são funções exponenciais?'
                                    ].map((sugestao, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInputValue(sugestao)}
                                            className="w-full text-left px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-primary/30 transition-colors"
                                        >
                                            {sugestao}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {mensagens.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2 sm:gap-3 ${msg.tipo === 'USUARIO' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.tipo === 'ASSISTENTE' && (
                                    <div className="size-7 sm:size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Bot className="text-primary w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                    </div>
                                )}
                                
                                <div
                                    className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                                        msg.tipo === 'USUARIO'
                                            ? 'bg-primary text-white rounded-br-sm'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                                    }`}
                                >
                                    <MensagemTexto texto={msg.conteudo} tipo={msg.tipo} />
                                </div>

                                {msg.tipo === 'USUARIO' && (
                                    <div className="size-7 sm:size-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                        <User className="text-gray-600 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex gap-2 sm:gap-3 justify-start">
                                <div className="size-7 sm:size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot className="text-primary w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 sm:px-4 py-2.5 sm:py-3">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin text-primary w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                        <span className="text-xs sm:text-sm text-gray-500">Pensando...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="bg-white border-t border-gray-200 p-2.5 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 max-w-4xl mx-auto">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Digite sua dúvida..."
                                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm sm:text-base"
                                disabled={isLoading}
                            />
                            <button
                                onClick={enviarPergunta}
                                disabled={isLoading || !inputValue.trim()}
                                className="size-10 sm:size-12 bg-primary hover:bg-primary/90 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                            >
                                <Send size={18} className="sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}