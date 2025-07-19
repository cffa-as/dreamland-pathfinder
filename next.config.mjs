/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  distDir: 'out',
  // 添加trailingSlash配置，优化静态导出
  trailingSlash: true,
  // 确保生成index.html而不是/index/index.html
  cleanDistDir: true
}

export default nextConfig
