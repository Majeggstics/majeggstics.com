/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {},
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	reactStrictMode: true,
	output: 'export',
};

export default nextConfig;
