import { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { getJson } from "../../packages/blobs-utils/src/index";

export default async (req: Request, context: Context) => {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) {
        return new Response(JSON.stringify({ error: "Missing key" }), { status: 400 });
    }

    try {
        const store = getStore("rss-cache");
        const data = await getJson(store as any, key);

        if (!data) {
            return new Response(JSON.stringify({ data: null }), { status: 404 });
        }

        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
