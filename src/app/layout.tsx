import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'My Goals — development foundation', description: 'Local project foundation for a journal-first application.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
