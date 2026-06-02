/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    webpack: (config, { dev }) => {
        if (dev) {
            // Cấu hình sinh Source Maps chất lượng cao khi chạy dev
            config.devtool = 'source-map';
        }
        return config;
    },
};
export default nextConfig;