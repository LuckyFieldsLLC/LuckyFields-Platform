'use client';

import React, { useState, useEffect } from 'react';
import { ZodiacSign } from '@/utils/zodiac';
import { motion } from 'framer-motion';

interface ZodiacAssetManagerProps {
    config: any;
    saveConfig: (config: any) => Promise<void>;
    t: any;
}

export default function ZodiacAssetManager({ config, saveConfig, t }: ZodiacAssetManagerProps) {
    const zodiacs: ZodiacSign[] = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign>('Aries');
    const [uploading, setUploading] = useState(false);

    const currentMapping = config.zodiacMapping?.[selectedZodiac] || {
        imageUrl: '', x: 0, y: 0, scale: 1, rotate: 0, opacity: 0.8
    };

    const updateMapping = (updates: Partial<typeof currentMapping>) => {
        const newMapping = {
            ...config.zodiacMapping,
            [selectedZodiac]: { ...currentMapping, ...updates }
        };
        saveConfig({ ...config, zodiacMapping: newMapping });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('zodiac', selectedZodiac);

        try {
            const res = await fetch('/api/admin/assets', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                updateMapping({ imageUrl: data.imageUrl });
            }
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="asset-manager-root">
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', opacity: 0.7 }}>🌌 Zodiac Asset Manager</h3>

            <div className="manager-layout">
                {/* Zodiac Selector */}
                <div className="zodiac-grid">
                    {zodiacs.map(z => (
                        <button
                            key={z}
                            onClick={() => setSelectedZodiac(z)}
                            className={selectedZodiac === z ? 'active' : ''}
                        >
                            {z}
                        </button>
                    ))}
                </div>

                {/* Editor Content */}
                <div className="editor-controls">
                    <div className="preview-box">
                        <div className="preview-bg" />
                        {currentMapping.imageUrl ? (
                            <motion.img
                                key={currentMapping.imageUrl}
                                src={currentMapping.imageUrl}
                                alt={selectedZodiac}
                                style={{
                                    position: 'absolute',
                                    left: currentMapping.x,
                                    top: currentMapping.y,
                                    scale: currentMapping.scale,
                                    rotate: currentMapping.rotate,
                                    opacity: currentMapping.opacity,
                                    maxWidth: '100%',
                                    pointerEvents: 'none'
                                }}
                            />
                        ) : (
                            <div className="no-image">No Image Assigned</div>
                        )}
                        <div className="zodiac-label">{selectedZodiac} Preview</div>
                    </div>

                    <div className="control-panel">
                        <div className="upload-section">
                            <label className="upload-btn">
                                📤 {uploading ? 'Uploading...' : 'Upload AI Character'}
                                <input type="file" onChange={handleFileUpload} disabled={uploading} hidden accept="image/*" />
                            </label>
                        </div>

                        <div className="sliders">
                            <ControlSlider label="X Position" min={-200} max={200} value={currentMapping.x} onChange={v => updateMapping({ x: v })} />
                            <ControlSlider label="Y Position" min={-200} max={200} value={currentMapping.y} onChange={v => updateMapping({ y: v })} />
                            <ControlSlider label="Scale" min={0.1} max={3} step={0.05} value={currentMapping.scale} onChange={v => updateMapping({ scale: v })} />
                            <ControlSlider label="Rotation" min={-180} max={180} value={currentMapping.rotate} onChange={v => updateMapping({ rotate: v })} />
                            <ControlSlider label="Opacity" min={0} max={1} step={0.05} value={currentMapping.opacity} onChange={v => updateMapping({ opacity: v })} />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .asset-manager-root { width: 100%; }
                .manager-layout { display: grid; grid-template-columns: 150px 1fr; gap: 2rem; }
                .zodiac-grid { display: grid; gap: 0.5rem; }
                .zodiac-grid button {
                    padding: 0.6rem; border-radius: 10px; background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1); color: white; cursor: pointer; text-align: left;
                    font-size: 0.8rem; transition: all 0.2s;
                }
                .zodiac-grid button.active { background: var(--primary-color); border-color: white; font-weight: bold; }
                
                .editor-controls { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; }
                .preview-box {
                    aspect-ratio: 1; background: #000; border-radius: 20px; overflow: hidden;
                    position: relative; border: 1px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                }
                .preview-bg {
                    position: absolute; inset: 0;
                    background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .zodiac-label { position: absolute; bottom: 1rem; left: 1rem; font-size: 0.7rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.1em; }
                .no-image { opacity: 0.3; font-size: 0.8rem; z-index: 10; }
                
                .control-panel { display: grid; gap: 1.5rem; align-content: start; }
                .upload-btn {
                    display: block; padding: 0.75rem; background: var(--primary-color); border-radius: 12px;
                    text-align: center; cursor: pointer; font-weight: bold; font-size: 0.9rem;
                }
                .sliders { display: grid; gap: 1.25rem; }
            `}</style>
        </div>
    );
}

function ControlSlider({ label, min, max, step = 1, value, onChange }: {
    label: string, min: number, max: number, step?: number, value: number, onChange: (v: number) => void
}) {
    return (
        <div className="slider-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.4rem' }}>
                <label>{label}</label>
                <span>{value}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step}
                value={value}
                onChange={e => onChange(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-color)' }}
            />
        </div>
    );
}
