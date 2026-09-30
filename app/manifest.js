export default function manifest() {
    return {
        name: "موسسه حمل و نقل کامران",
        short_name: "حمل و نقل کامران",
        description: "سیستم مدیریت حمل‌ونقل",

        start_url: "/",
        scope: "/",

        display: "standalone",

        background_color: "#ffffff",
        theme_color: "#0f172a",

        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
        ],
    };
}