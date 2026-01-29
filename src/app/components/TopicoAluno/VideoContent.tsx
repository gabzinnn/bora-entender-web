'use client';
import { BookOpen, Maximize, Pause, Play, Settings, Volume2, VolumeX, X } from "lucide-react";
import { useRef, useState } from "react";

interface VideoContentProps {
    titulo: string;
    modulo: string;
    videoUrl: string;
    duracao?: number; // em segundos
    resumoHtml?: string;
    cor?: string;
    onProgress?: (percentual: number) => void;
    onComplete?: () => void;
}

export default function VideoContent({
    titulo,
    modulo,
    videoUrl,
    duracao,
    resumoHtml,
    cor = '#0cc3e4',
    onProgress,
    onComplete
}: VideoContentProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(duracao || 0);
    const [showResumo, setShowResumo] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setCurrentTime(current);
            
            const percentual = Math.round((current / duration) * 100);
            onProgress?.(percentual);

            // Considera completo quando atinge 90%
            if (percentual >= 90) {
                onComplete?.();
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setVideoDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const handlePlaybackRateChange = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
            setShowSettings(false);
        }
    };

    const progressPercent = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

    return (
        <div className="w-full max-w-4xl flex flex-col gap-4">
            {/* Video Player Container */}
            <div className="relative bg-black rounded-xl overflow-hidden shadow-lg group">
                {/* Video Element */}
                <video
                    ref={videoRef}
                    className="w-full aspect-video"
                    src={videoUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    onClick={togglePlay}
                >
                    Seu navegador não suporta vídeos.
                </video>

                {/* Overlay Play Button (quando pausado) */}
                {!isPlaying && (
                    <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                        onClick={togglePlay}
                    >
                        <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110"
                            style={{ backgroundColor: cor }}
                        >
                            <Play size={36} className="text-white ml-1" fill="white" />
                        </div>
                    </div>
                )}

                {/* Settings Menu */}
                {showSettings && (
                    <div className="absolute bottom-20 right-4 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 overflow-hidden z-20 min-w-45">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                            <span className="text-white text-sm font-semibold">Velocidade</span>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="py-1">
                            {playbackRates.map((rate) => (
                                <button
                                    key={rate}
                                    onClick={() => handlePlaybackRateChange(rate)}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer flex items-center justify-between ${
                                        playbackRate === rate
                                            ? 'bg-white/10 text-white font-semibold'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                                    {playbackRate === rate && (
                                        <span className="text-primary">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Progress Bar */}
                    <div className="relative mb-3">
                        <input
                            type="range"
                            min={0}
                            max={videoDuration}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, ${cor} 0%, ${cor} ${progressPercent}%, rgba(255,255,255,0.3) ${progressPercent}%, rgba(255,255,255,0.3) 100%)`
                            }}
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={togglePlay}
                                className="text-white hover:text-primary transition-colors cursor-pointer"
                            >
                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                            </button>
                            
                            <button 
                                onClick={toggleMute}
                                className="text-white hover:text-primary transition-colors cursor-pointer"
                            >
                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>

                            <span className="text-white text-sm font-mono">
                                {formatTime(currentTime)} / {formatTime(videoDuration)}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setShowSettings(!showSettings)}
                                className={`text-white hover:text-primary transition-colors relative cursor-pointer ${
                                    showSettings ? 'text-primary' : ''
                                }`}
                            >
                                <Settings size={20} />
                                {playbackRate !== 1 && (
                                    <span 
                                        className="absolute -top-1 -right-1 text-[10px] font-bold px-1 rounded-full"
                                        style={{ backgroundColor: cor, color: 'white' }}
                                    >
                                        {playbackRate}x
                                    </span>
                                )}
                            </button>
                            <button 
                                onClick={toggleFullscreen}
                                className="text-white hover:text-primary transition-colors cursor-pointer"
                            >
                                <Maximize size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Info Card - Redesenhado */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header com gradiente */}
                <div 
                    className="px-6 py-4 relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${cor}15 0%, ${cor}05 100%)`
                    }}
                >
                    {/* Pattern decorativo */}
                    <div 
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, ${cor} 1px, transparent 0)`,
                            backgroundSize: '24px 24px'
                        }}
                    />
                    
                    <div className="relative flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span 
                                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                                    style={{ 
                                        backgroundColor: `${cor}20`,
                                        color: cor
                                    }}
                                >
                                    {modulo}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500 font-medium">
                                    {formatTime(videoDuration)}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">
                                {titulo}
                            </h2>
                        </div>
                        
                        {resumoHtml && (
                            <button
                                onClick={() => setShowResumo(!showResumo)}
                                className="shrink-0 flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-sm"
                                style={{ 
                                    backgroundColor: showResumo ? cor : 'white',
                                    color: showResumo ? 'white' : cor,
                                    border: `2px solid ${cor}`,
                                    boxShadow: showResumo ? `0 4px 12px ${cor}30` : 'none'
                                }}
                            >
                                <BookOpen size={16} />
                                <span className="hidden sm:inline">
                                    {showResumo ? 'Ocultar' : 'Ver'} Resumo
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Resumo do Vídeo - Redesenhado */}
                {showResumo && resumoHtml && (
                    <div className="relative">
                        {/* Linha decorativa superior */}
                        <div 
                            className="h-1 w-full"
                            style={{
                                background: `linear-gradient(90deg, ${cor} 0%, ${cor}50 50%, ${cor} 100%)`
                            }}
                        />
                        
                        {/* Conteúdo do resumo */}
                        <div className="px-6 py-5 bg-linear-to-b from-gray-50 to-white">
                            <div className="flex items-center gap-2 mb-3">
                                <div 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ 
                                        backgroundColor: `${cor}15`,
                                        color: cor
                                    }}
                                >
                                    <BookOpen size={16} />
                                </div>
                                <h3 className="font-bold text-gray-900">Resumo do Conteúdo</h3>
                            </div>
                            
                            <div 
                                className="prose prose-sm max-w-none
                                    prose-headings:text-gray-900 
                                    prose-p:text-gray-700 prose-p:leading-relaxed
                                    prose-strong:text-gray-900
                                    prose-ul:my-2 prose-li:my-1 prose-li:text-gray-700
                                    prose-a:no-underline hover:prose-a:underline"
                                style={{
                                    '--tw-prose-links': cor,
                                    '--tw-prose-bullets': cor
                                } as React.CSSProperties}
                                dangerouslySetInnerHTML={{ __html: resumoHtml }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}