export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/user/profile',
        '/api/',
      ],
    },
    sitemap: 'https://toxicgames.in/sitemap-index.xml',
  };
}
