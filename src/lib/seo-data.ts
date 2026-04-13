export interface SeoPageData {
  slug: string;
  title: Record<string, string>;
  description: Record<string, string>;
  keywords: Record<string, string[]>;
  h1: Record<string, string>;
  content: Record<string, string>;
}

export const voicesData: SeoPageData[] = [
  {
    slug: "loli",
    title: {
      zh: "萝莉音AI配音 - 可爱的少女感文字转语音工具",
      en: "Loli AI Voice - Cute Anime Style Text to Speech"
    },
    description: {
      zh: "灵动之声萝莉专题页：提供活泼轻快、带感情色彩的少女感 AI 配音，适用于动漫配音、搞笑视频和游戏解说。",
      en: "EchoVoice Loli series: High-quality anime-style AI voice with cute and energetic emotions. Perfect for character dubbing and gaming videos."
    },
    keywords: {
      zh: ["萝莉音AI", "少女音配音", "二次元配音", "文字转语音萝莉"],
      en: ["loli ai voice", "anime voice tts", "cute ai voice", "character voice generator"]
    },
    h1: {
      zh: "萝莉音 AI 配音：让你的视频瞬间充满活力",
      en: "Loli AI Voice: Bring Your Characters to Life"
    },
    content: {
      zh: "如果你正在寻找那种活泼、清脆且带有情感起伏的少女声音，EchoVoice 的萝莉音色是你的不二之选。它不仅听起来自然，还能通过我们的情绪控制功能表现出开心、撒娇或委屈的效果。",
      en: "Seeking a cute, high-pitched voice with emotional nuances? EchoVoice's Loli role is specifically trained for anime and youthful content, supporting multiple emotions to match your script perfectly."
    }
  },
  {
    slug: "warm-male",
    title: {
      zh: "暖男配音工具 - 温柔治愈系 AI 语音合成",
      en: "Warm Male AI Voice - Gentle & Healing TTS"
    },
    description: {
      zh: "EchoVoice 暖男专题页：提供磁性、温柔且极具亲和力的男性 AI 声音，适用于情感电台、治愈系短视频和有声书。",
      en: "EchoVoice Warm Male series: Magnetic, gentle, and companionable AI voice. Ideal for emotional storytelling, healing podcasts, and audiobooks."
    },
    keywords: {
      zh: ["暖男AI配音", "温柔男声TTS", "治愈系配音", "情感短视频配音"],
      en: ["warm male ai voice", "gentle tts", "healing voice generator", "emotional voice-over"]
    },
    h1: {
      zh: "暖男 AI 配音：用温柔的声音触动人心",
      en: "Warm Male AI Voice: Connect Through Kindness"
    },
    content: {
      zh: "这种声音自带一种磁性和陪伴感，非常适合那些需要建立信任感或传达情感的内容。无论是深夜电台还是温馨的产品介绍，它都能让听众感到舒适。",
      en: "This voice brings a sense of companionship and trust, perfect for content that needs to build an emotional connection. Ideal for late-night storytelling or warm product introductions."
    }
  },
  {
    slug: "broadcast",
    title: {
      zh: "专业播音腔AI配音 - 新闻科普风格文字转语音",
      en: "Professional Broadcast AI Voice - News and Documentary Style"
    },
    description: {
      zh: "灵动之声播音专题页：提供字正腔圆、节奏紧凑的专业播音员级别 AI 配音，适用于新闻播报、科普视频和企业宣传片。",
      en: "EchoVoice Broadcast series: Professional-grade AI voice with clear articulation and perfect pacing. Best for news, documentaries, and corporate presentations."
    },
    keywords: {
      zh: ["播音腔AI", "新闻配音工具", "专业配音软件", "科普视频配音"],
      en: ["broadcast ai voice", "news tts", "professional voice-over", "documentary narrator"]
    },
    h1: {
      zh: "专业播音腔 AI 配音：提升视频的权威感",
      en: "Broadcast AI Voice: Enhance Your Authority"
    },
    content: {
      zh: "还在为了找专业播音员而烦恼吗？我们的播音模式提供了稳定的语速和精准的重音控制，让你的科普视频或企业宣传片听起来既权威又高级。",
      en: "Stop searching for expensive narrators. Our broadcast mode offers stable pacing and precise emphasis, making your educational videos or corporate spots sound authoritative and premium."
    }
  }
];

export const solutionsData: SeoPageData[] = [
  {
    slug: "douyin-video",
    title: {
      zh: "抖音短视频AI配音软件 - 30秒生成爆款视频配音",
      en: "Voice-over Solution for TikTok & Douyin - Fast AI Generation"
    },
    description: {
      zh: "EchoVoice 抖音配音方案：专为短视频创作者优化，支持多种热门角色和情绪组合，帮助你快速制作高质量短视频配音。",
      en: "EchoVoice TikTok solution: Optimized for short video creators, supporting popular roles and emotional presets to help you go viral."
    },
    keywords: {
      zh: ["抖音配音工具", "短视频配音软件", "爆款视频配音", "AI短视频助手"],
      en: ["tiktok voice-over", "short video ai voice", "viral video dubbing", "douyin ai tools"]
    },
    h1: {
      zh: "抖音短视频 AI 配音：从文案到成品只需 30 秒",
      en: "TikTok AI Voice-over: From Script to Viral in 30s"
    },
    content: {
      zh: "在抖音这种快节奏平台上，效率就是生命。EchoVoice 让你可以直接输入文案，选择最火的角色的音色，一键生成配音，直接导入剪映即可开始剪辑。",
      en: "On fast-paced platforms like TikTok, efficiency is everything. EchoVoice lets you paste your script, pick a trending voice role, and generate professional audio that can be imported directly into CapCut."
    }
  },
  {
    slug: "audiobook",
    title: {
      zh: "AI有声书朗读软件 - 类似真人的长文配音工具",
      en: "AI Audiobook Generation - Human-like Long-form TTS"
    },
    description: {
      zh: "灵动之声有声书方案：支持长文本一键转换，声音自然带感情，多种音色可选，是制作有声小说和朗读类内容的最佳助手。",
      en: "EchoVoice Audiobook solution: Supports long-form text conversion with natural emotions. The best choice for producing audio novels and reading-focused content."
    },
    keywords: {
      zh: ["有声书AI", "朗读软件推荐", "AI小说配音", "长文本转语音"],
      en: ["audiobook ai voice", "long text to speech", "novel narrator ai", "reading tool"]
    },
    h1: {
      zh: "AI 有声书朗读：让文字流动在耳边",
      en: "AI Audiobook Reader: Make Stories Come Alive"
    },
    content: {
      zh: "听众对有声书的要求是‘耐听’。EchoVoice 的 AI 模型经过深度训练，能够处理冗长的叙述而不显得生硬，配合情绪模式，能完美复现小说中的氛围。",
      en: "Listeners look for immersion in audiobooks. EchoVoice's AI model is trained to handle long narrations with natural flow, recreating the atmosphere of any novel with our emotional presets."
    }
  }
];
