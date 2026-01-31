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
} | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [lang, setLangState] = useState('ja');

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
    }, []);

    const setLang = (l: string) => {
        if (dictionaries[l]) {
            setLangState(l);
            localStorage.setItem('preferred_lang', l);
        }
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
        <ConfigContext.Provider value={{ config, setConfig, refreshConfig, lang, setLang, t }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) throw new Error('useConfig must be used within a ConfigProvider');
    return context;
}
