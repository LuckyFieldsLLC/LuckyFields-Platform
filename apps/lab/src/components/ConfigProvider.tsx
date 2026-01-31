'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig } from '../../../../types/siteConfig';

const ConfigContext = createContext<{
    config: SiteConfig | null;
    setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
    refreshConfig: () => Promise<void>;
} | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<SiteConfig | null>(null);

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
    }, []);

    return (
        <ConfigContext.Provider value={{ config, setConfig, refreshConfig }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) throw new Error('useConfig must be used within a ConfigProvider');
    return context;
}
