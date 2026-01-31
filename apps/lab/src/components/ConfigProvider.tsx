'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SiteConfig } from '../../../../types/siteConfig';

// Import dictionaries directly for reliability
import en from '../../../../data/i18n/en.json';
import ja from '../../../../data/i18n/ja.json';

const dictionaries: any = { en, ja };

const ConfigContext = createContext<{
    config: SiteConfig | null;
    setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
    refreshConfig: () => Promise<void>;
    lang: string;
    setLang: (l: string) => void;
    t: (key: string) => any;
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
} | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [lang, setLangState] = useState('ja');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const refreshConfig = async () => {
        try {
            const res = await fetch('/api/admin/config');
            const data = await res.json();
            setConfig(data);
        } catch (e) {
            console.error('Failed to load config', e);
        }
    };

    useEffect(() => {
        refreshConfig();
        const savedLang = localStorage.getItem('preferred_lang') || 'ja';
        if (dictionaries[savedLang]) {
            setLangState(savedLang);
        }
        const token = localStorage.getItem('admin_session');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (config) {
            document.documentElement.style.setProperty('--primary-color', config.primaryColor);
            document.documentElement.style.setProperty('--primary-glow', `${config.primaryGlow}px`);
            document.documentElement.style.setProperty('--glass-opacity', config.glassOpacity.toString());
            document.documentElement.style.setProperty('--aura-color', config.auraColor);
            document.documentElement.style.setProperty('--bg-opacity', config.bgOpacity.toString());
        }
    }, [config]);

    const setLang = (l: string) => {
        if (dictionaries[l]) {
            setLangState(l);
            localStorage.setItem('preferred_lang', l);
        }
    };

    const login = (token: string) => {
        localStorage.setItem('admin_session', token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('admin_session');
        setIsLoggedIn(false);
    };

    const saveConfig = async (newConfig: SiteConfig) => {
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig),
            });
            if (res.ok) {
                setConfig(newConfig);
                return true;
            }
        } catch (e) {
            console.error('Failed to save config', e);
        }
        return false;
    };

    const t = useMemo(() => (path: string) => {
        const dict = dictionaries[lang] || dictionaries['ja'];
        const keys = path.split('.');
        let result = dict;
        for (const key of keys) {
            result = result?.[key];
            if (result === undefined) break;
        }
        return result || path;
    }, [lang]);

    return (
        <ConfigContext.Provider value={{ config, setConfig, refreshConfig, lang, setLang, t, isLoggedIn, login, logout, saveConfig } as any}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) throw new Error('useConfig must be used within a ConfigProvider');
    return context;
}
