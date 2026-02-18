'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AIService } from '@/services/aiService';

interface VoiceAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    onActionDetected: (intent: string, data: any) => void;
}

export default function VoiceAssistant({ isOpen, onClose, onActionDetected }: VoiceAssistantProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'pl-PL';

            recognitionRef.current.onresult = (event: any) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            handleProcess();
        } else {
            setTranscript('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleProcess = async () => {
        if (!transcript) return;
        setIsProcessing(true);
        try {
            const response = await AIService.processVoiceIntent(transcript);
            if (response.text) {
                const result = JSON.parse(response.text);
                onActionDetected(result.intent, result.data);
                // Close after a brief moment to show success
                setTimeout(onClose, 1500);
            }
        } catch (error) {
            console.error('Error processing intent:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-[#0a0a0f]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/20 blur-[80px] -z-10" />

                <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="text-center space-y-8">
                    <div className="inline-flex flex-col items-center">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center relative transition-all duration-500 ${isListening ? 'bg-brand-accent text-white scale-110' : 'bg-white/5 text-white/40'}`}>
                            {isListening && (
                                <>
                                    <div className="absolute inset-0 rounded-full bg-brand-accent/40 animate-ping" />
                                    <div className="absolute inset-[-10px] rounded-full border border-brand-accent/20 animate-pulse" />
                                </>
                            )}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v10a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </div>
                        <h2 className="mt-8 text-2xl font-black font-space-grotesk tracking-tighter text-white uppercase italic">
                            {isListening ? 'Słucham...' : isProcessing ? 'Analizuję Polcenie...' : 'Asystent Głosowy'}
                        </h2>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">{isListening ? 'Mów teraz' : 'Kliknij mikrofon, aby zacząć'}</p>
                    </div>

                    <div className="min-h-[100px] p-6 bg-white/5 border border-white/5 rounded-3xl text-left relative overflow-hidden group">
                        <div className="absolute top-2 left-4 text-[9px] font-black text-white/20 uppercase tracking-widest">Transkrypcja</div>
                        <p className={`text-sm leading-relaxed transition-all ${transcript ? 'text-white/80' : 'text-white/20 italic'}`}>
                            {transcript || 'Tutaj pojawi się Twoja mowa...'}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={toggleListening}
                            className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20'}`}
                        >
                            {isListening ? 'Zakończ i Przetwórz' : 'Zacznij Mówić'}
                        </button>
                    </div>

                    <div className="pt-2">
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Przykłady: "Dodaj zadanie zadzwoń do Marka", "Stwórz ofertę na stronę WWW"</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
