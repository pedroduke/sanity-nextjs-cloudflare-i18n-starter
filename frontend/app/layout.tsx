// The root layout is intentionally minimal because <html lang> must be locale-dependent.
// All pages live under app/[locale]/, and the [locale]/layout.tsx renders <html>, <body>,
// fonts, providers, header, footer, etc. If you ever add a route outside [locale], it must
// own its own <html>+<body> tags.
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
