module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: [`s3.${process.env.AWS_REGION}.amazonaws.com`],
  },
  poweredByHeader: false,
};
