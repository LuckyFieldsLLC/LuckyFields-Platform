import { Config, Context } from "@netlify/functions";
import Parser from "rss-parser";
import { getStore } from "@netlify/blobs";
import { setJson } from "../../packages/blobs-utils/src/index";
import fs from "fs";
import path from "path";

const parser = new Parser();

export default async (req: Request, context: Context) => {
    console.log("Starting RSS Polling...");

    try {
        // Load sources from the bundled data directory
        const sourcesPath = path.resolve(process.cwd(), "data/sources.json");
        const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf-8"));

        const store = getStore("rss-cache");
        const results = [];

        for (const source of sources) {
            if (!source.enabled || source.type !== 'rss') continue;

            console.log(`Fetching: ${source.name} (${source.url})`);
            try {
                const feed = await parser.parseURL(source.url);

                const items = feed.items.map(item => ({
                    id: item.guid || item.link,
                    title: item.title,
                    url: item.link,
                    date: item.isoDate || item.pubDate,
                    summary: item.contentSnippet || item.content,
                    sourceId: source.id,
                    persona: source.persona,
                    category: source.category
                }));

                results.push(...items);
            } catch (err) {
                console.error(`Failed to fetch ${source.name}:`, err);
            }
        }

        // Sort by date descending
        results.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

        // Store in Blobs
        // Note: setJson expects ComputedStore | NormalizedStore. Netlify getStore() result is compatible.
        await setJson(store as any, "latest-feed", results);

        return new Response(JSON.stringify({ success: true, count: results.length }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        console.error("RSS Polling Error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config = {
    path: "/api/rss-poll",
    // schedule: "@hourly" // Commented out temporarily if type conflicts occur
};
