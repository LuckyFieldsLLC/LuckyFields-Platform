import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
    title: "LuckyFields.Lab",
    description: "Unified hub for LuckyFields.LLC creative output",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body>
                <div id="app">
                    <AppShell>
                        {children}
                    </AppShell>
                </div>
            </body>
        </html>
    );
}
