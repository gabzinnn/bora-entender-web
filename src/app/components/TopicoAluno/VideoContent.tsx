'use client';
import { Maximize, Pause, Play, Settings, Volume2, VolumeX, X, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";

interface VideoContentProps {
    titulo: string;
    modulo: string;
    videoUrl: string;
    duracao?: number; // em segundos
    cor?: string;
    status?: 'PROCESSANDO' | 'PRONTO' | 'ERRO';
    onProgress?: (percentual: number) => void;
    onComplete?: () => void;
}

export default function VideoContent({
    titulo,
    modulo,
    videoUrl,
    duracao,
    cor = '#0cc3e4',
    status,
    onProgress,
    onComplete
}: VideoContentProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(duracao || 0);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [qualityLevels, setQualityLevels] = useState<{ height: number; index: number }[]>([]);
    const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = auto

    const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const isHLS = videoUrl?.endsWith('.m3u8');

    // ─── HLS Setup ──────────────────────────────────────────────────────────

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;

        // Se status ainda está processando, não carrega o vídeo
        if (status === 'PROCESSANDO') return;

        if (isHLS && Hls.isSupported()) {
            const hls = new Hls({
                startLevel: -1, // auto
                capLevelToPlayerSize: true,
            });

            hls.loadSource(videoUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
                const levels = data.levels.map((level, index) => ({
                    height: level.height,
                    index,
                }));
                setQualityLevels(levels);
                setCurrentQuality(-1); // auto
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
                if (hlsRef.current?.autoLevelEnabled) {
                    setCurrentQuality(-1);
                }
            });

            hlsRef.current = hls;

            return () => {
                hls.destroy();
                hlsRef.current = null;
            };
        } else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari nativo
            video.src = videoUrl;
        } else {
            // MP4 fallback
            video.src = videoUrl;
        }
    }, [videoUrl, isHLS, status]);

    // ─── Quality Control ────────────────────────────────────────────────────

    const handleQualityChange = useCallback((levelIndex: number) => {
        if (!hlsRef.current) return;

        if (levelIndex === -1) {
            hlsRef.current.currentLevel = -1; // auto
            setCurrentQuality(-1);
        } else {
            hlsRef.current.currentLevel = levelIndex;
            setCurrentQuality(levelIndex);
        }
    }, []);

    // ─── Player Controls ────────────────────────────────────────────────────

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

    // ─── Status: Processando ────────────────────────────────────────────────

    if (status === 'PROCESSANDO') {
        return (
            <div className="w-full max-w-6xl flex flex-col gap-4 py-4">
                <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg aspect-video flex flex-col items-center justify-center gap-4">
                    <Loader2 size={48} className="animate-spin" style={{ color: cor }} />
                    <div className="text-center px-6">
                        <p className="text-white text-lg font-semibold">Processando vídeo...</p>
                        <p className="text-gray-400 text-sm mt-1">
                            O vídeo está sendo otimizado para streaming. Isso pode levar alguns minutos.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'ERRO') {
        return (
            <div className="w-full max-w-6xl flex flex-col gap-4 py-4">
                <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg aspect-video flex flex-col items-center justify-center gap-4">
                    <AlertCircle size={48} className="text-red-400" />
                    <div className="text-center px-6">
                        <p className="text-white text-lg font-semibold">Erro no processamento</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Houve um erro ao processar o vídeo. Tente fazer o upload novamente.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Render ─────────────────────────────────────────────────────────────

    return (
        <div className="w-full max-w-6xl flex flex-col gap-4 py-4">
            {/* Video Player Container */}
            <div className="relative bg-black rounded-xl overflow-hidden shadow-lg group">
                {/* Video Element */}
                <video
                    ref={videoRef}
                    className="w-full aspect-video"
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
                    <div className="absolute bottom-20 right-4 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 overflow-hidden z-20 min-w-52">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                            <span className="text-white text-sm font-semibold">Configurações</span>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Qualidade (somente HLS) */}
                        {isHLS && qualityLevels.length > 0 && (
                            <div className="border-b border-gray-700">
                                <p className="px-4 pt-2 pb-1 text-xs text-gray-500 uppercase tracking-wider">Qualidade</p>
                                <button
                                    onClick={() => handleQualityChange(-1)}
                                    className={`w-full px-4 py-1.5 text-left text-sm transition-colors cursor-pointer flex items-center justify-between ${
                                        currentQuality === -1
                                            ? 'bg-white/10 text-white font-semibold'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span>Automático</span>
                                    {currentQuality === -1 && <span style={{ color: cor }}>✓</span>}
                                </button>
                                {qualityLevels
                                    .sort((a, b) => b.height - a.height)
                                    .map((level) => (
                                        <button
                                            key={level.index}
                                            onClick={() => handleQualityChange(level.index)}
                                            className={`w-full px-4 py-1.5 text-left text-sm transition-colors cursor-pointer flex items-center justify-between ${
                                                currentQuality === level.index
                                                    ? 'bg-white/10 text-white font-semibold'
                                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                            }`}
                                        >
                                            <span>{level.height}p</span>
                                            {currentQuality === level.index && <span style={{ color: cor }}>✓</span>}
                                        </button>
                                    ))}
                            </div>
                        )}

                        {/* Velocidade */}
                        <div>
                            <p className="px-4 pt-2 pb-1 text-xs text-gray-500 uppercase tracking-wider">Velocidade</p>
                            {playbackRates.map((rate) => (
                                <button
                                    key={rate}
                                    onClick={() => handlePlaybackRateChange(rate)}
                                    className={`w-full px-4 py-1.5 text-left text-sm transition-colors cursor-pointer flex items-center justify-between ${
                                        playbackRate === rate
                                            ? 'bg-white/10 text-white font-semibold'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                                    {playbackRate === rate && <span style={{ color: cor }}>✓</span>}
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
        </div>
    );
}