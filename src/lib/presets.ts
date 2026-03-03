export type Role = { id: string; name: string; voiceName: string; roleDescription: string };
export type Tone = { id: string; name: string; speed: number; pitch: number };
export type Emotion = { id: string; name: string };

export const roles: Role[] = [
  { id: "male", name: "男声", voiceName: "Charon", roleDescription: "成年男性，稳重清晰" },
  { id: "female", name: "女声", voiceName: "Kore", roleDescription: "成年女性，干净明亮" },
  { id: "loli", name: "萝莉", voiceName: "Leda", roleDescription: "少女感，活泼轻快" },
  { id: "muscle", name: "猛男", voiceName: "Charon", roleDescription: "低沉有力，冲击感强" },
  { id: "warmman", name: "暖男", voiceName: "Puck", roleDescription: "温暖陪伴，亲和自然" },
  { id: "intellect", name: "知性女性", voiceName: "Kore", roleDescription: "理性专业，节奏清楚" },
  { id: "grandpa", name: "老爷爷", voiceName: "Aoede", roleDescription: "年长男性，沉稳缓慢" },
  { id: "grandma", name: "老奶奶", voiceName: "Leda", roleDescription: "年长女性，温和慈爱" },
  { id: "boy", name: "男童", voiceName: "Puck", roleDescription: "男孩声线，轻快明亮" },
  { id: "girl", name: "女童", voiceName: "Kore", roleDescription: "女孩声线，清脆可爱" },
];

export const tones: Tone[] = [
  { id: "natural", name: "自然", speed: 1.0, pitch: 1.0 },
  { id: "soft", name: "柔和", speed: 0.92, pitch: 1.06 },
  { id: "deep", name: "低沉", speed: 0.9, pitch: 0.86 },
  { id: "bright", name: "明亮", speed: 1.06, pitch: 1.14 },
  { id: "broadcast", name: "播音", speed: 1.02, pitch: 0.98 },
];

export const emotions: Emotion[] = [
  { id: "calm", name: "平静" },
  { id: "happy", name: "开心" },
  { id: "sad", name: "悲伤" },
  { id: "excited", name: "激动" },
  { id: "serious", name: "严肃" },
  { id: "warm", name: "温暖" },
  { id: "healing", name: "治愈" },
  { id: "firm", name: "坚定" },
];
