const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['randomuser.me', 'localhost'],
    },
};

module.exports = withNextIntl(nextConfig); 