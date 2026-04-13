export type Locale = "zh" | "en";

export function normalizeLocale(input?: string): Locale {
  return input === "en" ? "en" : "zh";
}

export function roleLabel(locale: Locale, id: string): string {
  const zh: Record<string, string> = {
    male: "男声",
    female: "女声",
    loli: "萝莉",
    muscle: "猛男",
    warmman: "暖男",
    intellect: "知性女性",
    "movie-narrator": "影视解说",
    suspense: "悬疑解说",
    "friendly-aunt": "亲切客服",
    ceo: "霸道总裁",
    gaming: "游戏解说",
    grandpa: "老爷爷",
    grandma: "老奶奶",
    boy: "男童",
    girl: "女童",
  };

  const en: Record<string, string> = {
    male: "Male",
    female: "Female",
    loli: "Youthful",
    muscle: "Deep Male",
    warmman: "Warm Male",
    intellect: "Professional Female",
    "movie-narrator": "Movie Recap",
    suspense: "Suspense",
    "friendly-aunt": "Friendly CSR",
    ceo: "CEO",
    gaming: "Gaming",
    grandpa: "Senior Male",
    grandma: "Senior Female",
    boy: "Boy",
    girl: "Girl",
  };

  return (locale === "en" ? en : zh)[id] || id;
}

export function toneLabel(locale: Locale, id: string): string {
  const zh: Record<string, string> = {
    natural: "自然",
    soft: "柔和",
    deep: "低沉",
    bright: "明亮",
    broadcast: "播音",
  };

  const en: Record<string, string> = {
    natural: "Natural",
    soft: "Soft",
    deep: "Deep",
    bright: "Bright",
    broadcast: "Broadcast",
  };

  return (locale === "en" ? en : zh)[id] || id;
}

export function emotionLabel(locale: Locale, id: string): string {
  const zh: Record<string, string> = {
    calm: "平静",
    happy: "开心",
    sad: "悲伤",
    excited: "激动",
    serious: "严肃",
    warm: "温暖",
    healing: "治愈",
    firm: "坚定",
  };

  const en: Record<string, string> = {
    calm: "Calm",
    happy: "Happy",
    sad: "Sad",
    excited: "Excited",
    serious: "Serious",
    warm: "Warm",
    healing: "Healing",
    firm: "Firm",
  };

  return (locale === "en" ? en : zh)[id] || id;
}
