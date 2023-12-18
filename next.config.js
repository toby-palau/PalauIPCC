/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: "export",
    experimental: {
        serverActions: true,
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/ipcc",
                permanent: true,
            }
        ]
    }
}

module.exports = nextConfig
