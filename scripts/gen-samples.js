const fs = require('fs');
const path = require('path');

const BACKEND_URL = "https://echovoice-api.13770669417jj.workers.dev";
const SAMPLES_DIR = path.join(__dirname, '..', 'public', 'samples');

if (!fs.existsSync(SAMPLES_DIR)) {
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
}

const samples = [
  {
    name: 'loli',
    voice: 'Leda',
    text: '欢迎来到灵动之声！今天也要元气满满哦！',
    emotion: '开心',
    desc: '少女感，活泼轻快'
  },
  {
    name: 'warmman',
    voice: 'Puck',
    text: '不管走得多远，记得在这里，总有一盏灯为你而留。',
    emotion: '温暖',
    desc: '温暖陪伴，亲和自然'
  },
  {
    name: 'movie',
    voice: 'Charon',
    text: '注意看，这个男人叫小帅，他正在使用一款神奇的配音工具。',
    emotion: '平静',
    desc: '影视剧解说，小帅风格'
  }
];

async function generateSample(s) {
  const prompt = `你是一个专业的配音演员。请按照以下要求朗读文本：
角色设定: ${s.desc}。
表演要求: 语气极其自然，富有情感，避免机械。
语速控制: 自然中速，语调控制: 自然音高。
待朗读文本: 
${s.text}`;

  const payload = {
    text: prompt,
    voiceConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: s.voice },
      },
    },
  };

  console.log(`Generating ${s.name}...`);
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const filePath = path.join(SAMPLES_DIR, `${s.name}.mp3`);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log(`Successfully saved ${s.name} to ${filePath}`);
  } catch (error) {
    console.error(`Failed to generate ${s.name}:`, error.message);
  }
}

async function main() {
  for (const s of samples) {
    await generateSample(s);
  }
  console.log('Done!');
}

main();
