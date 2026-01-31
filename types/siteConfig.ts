export type SiteConfig = {
    isGyroEnabled: boolean;
    themeColor: string;
    activeEvent: string;
    themeMode: 'light' | 'dark';
    showZodiac: boolean;
    showParticles: boolean;
    showNews: boolean;
    primaryColor: string;
    bgOpacity: number;
    isInteractiveMode: boolean;
    aboutContent?: string;
    changelog?: { date: string; content: string }[];
    auraColor: string;
    primaryGlow: number;
    glassOpacity: number;
};
