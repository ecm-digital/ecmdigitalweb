'use client';

import { useState, useEffect } from 'react';
import { UserFile, getProjectFiles, uploadProjectFile } from '@/lib/firestoreService';
import { useAuth } from '@/context/AuthContext';

export default function ProjectVault({ projectId, isAdmin }: { projectId: string, isAdmin?: boolean }) {
    const { user } = useAuth();
    const [files, setFiles] = useState<UserFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const loadFiles = async () => {
        setLoading(true);
        try {
            const data = await getProjectFiles(projectId);
            setFiles(data);
        } catch (error) {
            console.error('Błąd ładowania plików', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (projectId) loadFiles();
    }, [projectId]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];

        setUploading(true);
        try {
            const uploaderId = isAdmin ? 'admin' : (user?.uid || 'unknown');
            await uploadProjectFile(projectId, file, uploaderId);
            await loadFiles();
        } catch (error) {
            console.error('Błąd wgrywania pliku', error);
            alert('Wystąpił błąd podczas wgrywania pliku.');
        } finally {
            setUploading(false);
            if (e.target) e.target.value = ''; // reset input
        }
    };

    return (
        <div className={`p-8 rounded-[32px] ${isAdmin ? 'bg-[rgba(255,255,255,0.02)] border border-white/5' : 'bg-white/5 border border-white/5'}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h4 className={`text-sm font-black uppercase tracking-[0.2em] italic mb-1 ${isAdmin ? 'text-white/40' : 'text-white/30'}`}>Teczka Projektu</h4>
                    <p className={`text-xl font-black font-space-grotesk tracking-tighter uppercase italic ${isAdmin ? 'text-white' : 'text-white'}`}>
                        Wymiana Plików 📁
                    </p>
                </div>
                <label className={`cursor-pointer px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${uploading ? 'bg-white/10 text-white/50 cursor-wait' : 'bg-brand-accent text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'}`}>
                    {uploading ? 'Wgrywam...' : '+ Dodaj Plik'}
                    <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
            </div>

            {loading ? (
                <div className="flex justify-center p-8"><div className="w-8 h-8 rounded-full border-t-2 border-brand-accent animate-spin"></div></div>
            ) : files.length === 0 ? (
                <div className="text-center py-10 opacity-30">
                    <div className="text-5xl mb-4 grayscale">📂</div>
                    <p className="font-bold uppercase tracking-widest text-xs">Brak wgranych plików.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {files.map(file => (
                        <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 hover:bg-white/5 hover:border-brand-accent/50 transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black border border-white/10 ${file.type === 'PDF' ? 'bg-red-500/20 text-red-500' :
                                    file.type === 'IMG' ? 'bg-blue-500/20 text-blue-500' :
                                        file.type === 'DOC' ? 'bg-blue-600/20 text-blue-600' :
                                            file.type === 'XLS' ? 'bg-green-500/20 text-green-500' :
                                                'bg-white/10 text-white'
                                }`}>
                                {file.type}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{file.name}</p>
                                <p className="text-xs text-white/40 uppercase tracking-widest mt-1 italic">{file.size} • {new Date(file.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                            </div>
                            <div className="text-white/20 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                ⬇️
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
