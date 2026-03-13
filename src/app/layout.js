import './globals.css';

export const metadata = {
  title: 'Krysos Trust — Compliance Advisory for Fintech & Crypto',
  description: 'AML Operations, Audit Readiness, Licensing Strategy, and M&A Readiness. We help fintech and crypto enterprises achieve regulatory compliance and become Bankable.',
  keywords: 'AML, KYC, compliance, fintech, crypto, audit, licensing, M&A, Vietnam, Southeast Asia',
  openGraph: {
    title: 'Krysos Trust — Bankable. Audit-ready. Deal-ready.',
    description: 'Your trusted compliance partner for fintech and digital asset enterprises across Southeast Asia.',
    type: 'website',
    locale: 'en_US',
    // TODO: Add your domain here
    // url: 'https://krysostrust.com',
    // images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
