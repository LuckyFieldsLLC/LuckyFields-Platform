'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { getZodiacSign, ZodiacSign } from '@/utils/zodiac';

interface MysticLayersProps {
    config: any;
    isAdmin?: boolean;
    onInteract?: () => void;
}

export default function MysticLayers({ config, isAdmin, onInteract }: MysticLayersProps) {
    const [zodiac, setZodiac] = useState<ZodiacSign>('Aries');
    const [orientation, setOrientation] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setZodiac(getZodiacSign(new Date()));

        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (!config.isGyroEnabled) return;
            // Normalize beta (-180 to 180) and gamma (-90 to 90)
            const x = (e.gamma || 0) / 45; // -2 to 2 range approx
            const y = (e.beta || 0) / 90;
            setOrientation({ x, y });
        };

        if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
        }
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, [config.isGyroEnabled]);

    const springX = useSpring(orientation.x, { stiffness: 50, damping: 20 });
    const springY = useSpring(orientation.y, { stiffness: 50, damping: 20 });

    const currentMapping = config.zodiacMapping?.[zodiac] || {
        imageUrl: '', x: 0, y: 0, scale: 1, rotate: 0, opacity: 0.6
    };

    // Parallax multipliers for each layer
    const getParallax = (factor: number) => ({
        x: springX.get() * factor * 20,
        y: springY.get() * factor * 20
    });

    return (
        <div className="mystic-container">
            {/* Layer 1: Aura & Space */}
            <motion.div
                className="layer layer-1"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${config.auraColor}33 0%, transparent 70%)`,
                    ...getParallax(0.2)
                }}
            >
                <div className="stars-bg" />
            </motion.div>

            {/* Layer 2: Asset-Based Character */}
            <motion.div
                className="layer layer-2"
                style={{
                    opacity: currentMapping.opacity,
                    ...getParallax(0.5)
                }}
            >
                {currentMapping.imageUrl ? (
                    <motion.img
                        src={`${currentMapping.imageUrl}?nf_resize=fit&w=1200`} // Netlify Image CDN hint
                        alt={zodiac}
                        style={{
                            left: currentMapping.x,
                            top: currentMapping.y,
                            scale: currentMapping.scale,
                            rotate: currentMapping.rotate,
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            filter: `drop-shadow(0 0 50px ${config.primaryColor}33)`
                        }}
                    />
                ) : (
                    <div className="spirit-character">✨🧘✨</div>
                )}
            </motion.div>

            {/* Layer 3: Zodiac SVG */}
            <motion.div
                className="layer layer-3"
                style={{
                    ...getParallax(0.8)
                }}
            >
                <ZodiacDisplay sign={zodiac} onInteract={onInteract} />
            </motion.div>

            {/* Layer 4: Particles */}
            <motion.div
                className="layer layer-4"
                style={{
                    ...getParallax(1.2)
                }}
            >
                <div className="floating-particles">
                    {[...Array(20)].map((_, i) => (
                        <motion.span
                            key={i}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.2, 0.5, 0.2]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                            style={{
                                position: 'absolute',
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                fontSize: `${0.5 + Math.random()}rem`
                            }}
                        >
                            ◌
                        </motion.span>
                    ))}
                </div>
            </motion.div>

            <style jsx>{`
                .mystic-container {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    overflow: hidden;
                    z-index: 0;
                    pointer-events: none;
                }
                .layer {
                    position: absolute;
                    top: -10%; left: -10%; right: -10%; bottom: -10%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .stars-bg {
                    width: 100%; height: 100%;
                    background-image: radial-gradient(white 1px, transparent 1px);
                    background-size: 50px 50px;
                    opacity: 0.1;
                }
                .spirit-character {
                    font-size: 15rem;
                    filter: drop-shadow(0 0 30px ${config.primaryColor});
                }
            `}</style>
        </div>
    );
}

function ZodiacDisplay({ sign, onInteract }: { sign: ZodiacSign, onInteract?: () => void }) {
    return (
        <div className="zodiac-display">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="zodiac-svg-container"
            >
                {/* Simplified SVG Star Map for the sign */}
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
                    <text x="50%" y="20%" textAnchor="middle" fill="white" fontSize="24" opacity="0.5" fontWeight="bold">
                        {sign}
                    </text>
                    {/* Stars as motion.buttons */}
                    {[...Array(7)].map((_, i) => (
                        <motion.circle
                            key={i}
                            cx={100 + Math.random() * 200}
                            cy={100 + Math.random() * 200}
                            r="4"
                            fill="white"
                            initial={{ opacity: 0.3 }}
                            whileHover={{ scale: 2, opacity: 1, fill: 'var(--primary-color)' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onInteract?.();
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
                </svg>
            </motion.div>
            <style jsx>{`
                .zodiac-svg-container {
                    pointer-events: auto;
                }
            `}</style>
        </div>
    );
}
