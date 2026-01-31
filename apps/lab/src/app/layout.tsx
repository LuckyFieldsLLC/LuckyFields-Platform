import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { ConfigProvider } from "@/components/ConfigProvider";

export const metadata: Metadata = {
    title: "LuckyFields.Lab | Interactive Creator Hub",
    description: "Exploring the intersection of creativity, AI, and interactive experiences. Join the LuckyFields evolution.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body>
                <ConfigProvider>
                    <div id="app">
                        <AppShell>
                            {children}
                        </AppShell>
                    </div>
                </ConfigProvider>
            </body>
        </html>
    );
}
