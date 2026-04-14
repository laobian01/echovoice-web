import type { Metadata } from "next";
import Script from "next/script";
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
    "AI voice generator",
    "text to speech",
    "中文语音合成",
    "短视频配音",
  ],
  openGraph: {
    title: "灵动之声 EchoVoice - AI 配音工作台",
    description: "30 秒生成高质量中文 AI 配音，支持角色、语调、情绪控制。网页端免费试用。",
    url: "https://echovoiceai.net",
    siteName: "EchoVoice",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "EchoVoice Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "灵动之声 EchoVoice - AI 配音工作台",
    description: "角色、语调、情绪可控的 AI 配音工具，30 秒出结果。",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: "https://echovoiceai.net",
    languages: {
      "zh-CN": "https://echovoiceai.net/zh",
      "en": "https://echovoiceai.net/en",
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "EchoVoice",
      alternateName: "灵动之声",
      url: "https://echovoiceai.net",
      logo: "https://echovoiceai.net/logo.png",
      sameAs: [],
    },
    {
      "@type": "SoftwareApplication",
      name: "EchoVoice",
      alternateName: "灵动之声",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "macOS, Web",
      url: "https://echovoiceai.net",
      offers: [
        {
          "@type": "Offer",
          name: "Pro Monthly",
          price: "5.99",
          priceCurrency: "USD",
          description: "200 credits per month",
        },
        {
          "@type": "Offer",
          name: "Pack 100",
          price: "2.99",
          priceCurrency: "USD",
          description: "One-time 100 credits top-up",
        },
      ],
      description: "AI voice generation tool with role, tone and emotion controls for content creators.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "EchoVoice 是什么？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "EchoVoice（灵动之声）是一款面向创作者的 AI 配音工具，支持角色、语调、情绪的自由组合，30 秒即可生成高质量中文配音。",
          },
        },
        {
          "@type": "Question",
          name: "可以免费试用吗？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "可以！注册后即可获得 5 次免费试用额度，无需付费即可体验全部功能。",
          },
        },
        {
          "@type": "Question",
          name: "支持哪些平台？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "EchoVoice 提供 macOS 客户端和网页端两种使用方式，随时随地进行配音创作。",
          },
        },
      ],
    },
  ],
};

import { SeoFooter } from "@/components/seo-footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="baidu-site-verification" content="codeva-InL9RdOkuj" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N1Z2GDF29D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N1Z2GDF29D');
          `}
        </Script>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#efaac6]/60 blur-[120px]" style={{ animation: "float 18s ease-in-out infinite alternate" }} />
          <div className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-[#94bbe9]/60 blur-[120px]" style={{ animation: "float-reverse 22s ease-in-out infinite alternate" }} />
        </div>
        {children}
        <SeoFooter />
      </body>
    </html>
  );
}
