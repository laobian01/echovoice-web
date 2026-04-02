import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://echovoiceai.net"),
  title: "灵动之声 EchoVoice - AI 配音官网",
  description: "灵动之声 EchoVoice：角色、语调、情绪可控的中文 AI 配音工具，支持在线试用、订阅和加量包。",
  keywords: [
    "AI配音",
    "中文TTS",
    "文案转语音",
    "配音工具",
    "EchoVoice",
    "voice over",
  ],
  openGraph: {
    title: "灵动之声 EchoVoice",
    description: "30 秒生成高质量中文 AI 配音，支持网页端试用与会员订阅。",
    url: "https://echovoiceai.net",
    siteName: "EchoVoice",
    locale: "zh_CN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://echovoiceai.net",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#efaac6]/60 blur-[120px]" style={{ animation: "float 18s ease-in-out infinite alternate" }} />
          <div className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-[#94bbe9]/60 blur-[120px]" style={{ animation: "float-reverse 22s ease-in-out infinite alternate" }} />
        </div>
        {children}
      </body>
    </html>
  );
}
