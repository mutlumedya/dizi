export const metadata = {
  title: 'Mutlu Player • EPG',
  description: 'Türkiye EPG yayın akışı - şu anda ne var?',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, background: '#f2f4f8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </body>
    </html>
  );
}
