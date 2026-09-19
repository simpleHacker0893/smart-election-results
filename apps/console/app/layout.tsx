import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Elections Console",
  description: "Review console for Claims and Evidence.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="en"
    className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
  >
    <body className="min-h-full flex flex-col">
      <ClerkProvider>
        <header className="flex items-center justify-between gap-4 border-b border-black/10 px-6 py-4 dark:border-white/15">
          <span className="font-semibold">Smart Elections Console</span>
          <nav className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </ClerkProvider>
    </body>
  </html>
);

export default RootLayout;
