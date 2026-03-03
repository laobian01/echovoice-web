import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://echovoice.ai"),
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
    url: "https://echovoice.ai",
    siteName: "EchoVoice",
    locale: "zh_CN",
    type: "website",
  },
  alternates: {
    canonical: "https://echovoice.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
