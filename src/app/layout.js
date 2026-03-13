import './globals.css';

export const metadata = {
  title: 'Krysos Trust — Compliance Advisory for Fintech & Crypto',
  description: 'Cross-border compliance and regulatory advisory for fintech, digital assets, and financial institutions in Southeast Asia. AML, licensing, M&A readiness.',
  keywords: 'AML, KYC, compliance, fintech, crypto, audit, licensing, M&A, Vietnam, Southeast Asia, VASP, regulatory',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Krysos Trust — Bankable. Audit-ready. Deal-ready.',
    description: 'Cross-border compliance and regulatory advisory for fintech and digital asset enterprises across Southeast Asia.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
