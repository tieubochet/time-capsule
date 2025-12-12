import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stacks Time Capsule",
  description: "A decentralized time capsule app built on Stacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, boxSizing: "border-box" }}>
        {children}
      </body>
    </html>
  );
}