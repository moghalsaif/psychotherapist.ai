import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Therapist Matching App",
  description: "Find the right therapist for your needs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 