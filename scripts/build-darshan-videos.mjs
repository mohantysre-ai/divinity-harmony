import fs from 'node:fs';

const raw = fs.readFileSync('.firecrawl/yt-temple-ok.json', 'utf8').replace(/^\uFEFF/, '');
const arr = JSON.parse(raw);

const existing = [
  { id: '8opaIVCposg', title: 'SVBC Live — Tirupati Balaji (Official)', deity: 'Lord Venkateswara', location: 'Tirupati, Andhra Pradesh', category: 'Temple' },
  { id: 'IyQ-ysolyho', title: 'Live Darshan — Shirdi Sai Baba Temple', deity: 'Sai Baba', location: 'Shirdi, Maharashtra', category: 'Temple' },
  { id: 'AggNPQiWRfY', title: 'Live Ganga Aarti — Varanasi', deity: 'Maa Ganga', location: 'Varanasi, Uttar Pradesh', category: 'Aarti' },
  { id: 'Wu321m2SUKY', title: 'Live Darshan — Shree Somnath Temple', deity: 'Lord Shiva', location: 'Prabhas Patan, Gujarat', category: 'Jyotirlinga' },
  { id: 'BN0-_tCu43c', title: 'Daily Darshan — Jagannath Temple, Puri', deity: 'Lord Jagannath', location: 'Puri, Odisha', category: 'Char Dham' },
  { id: 'nL8MIMlnBVA', title: 'Live — Shri Ram Janmabhoomi Mandir, Ayodhya', deity: 'Lord Ram', location: 'Ayodhya, Uttar Pradesh', category: 'Temple' },
  { id: 'X8cQRQrca28', title: 'Official SGPC Live — Golden Temple, Amritsar', deity: 'Guru Granth Sahib', location: 'Amritsar, Punjab', category: 'Gurudwara' },
  { id: '7QjUPwJOnuo', title: 'Live Darshan — Akshardham Mandir, Delhi', deity: 'Lord Swaminarayan', location: 'New Delhi', category: 'Temple' },
  { id: 'm02rvILzruA', title: 'Live — ISKCON Temple Bangalore', deity: 'Sri Sri Radha Krishna', location: 'Bangalore, Karnataka', category: 'Temple' },
  { id: 'sIDH6z4YXEY', title: 'Live — Sabarimala Sree Dharma Sastha Temple', deity: 'Lord Ayyappa', location: 'Sabarimala, Kerala', category: 'Temple' },
  { id: 'Bg1oLWuIr6U', title: 'Live — Lingaraj Temple, Bhubaneswar', deity: 'Lord Shiva', location: 'Bhubaneswar, Odisha', category: 'Temple' },
  { id: 'WS0I2NFnex8', title: 'Live Darshan — Dwarkadhish Temple', deity: 'Lord Krishna', location: 'Dwarka, Gujarat', category: 'Char Dham' },
  { id: 'aQUAFVgtCxk', title: 'Live Darshan — Shirdi Sai Baba (Alt feed)', deity: 'Sai Baba', location: 'Shirdi, Maharashtra', category: 'Temple' },
];

function metaFromTitle(title) {
  const t = title.toLowerCase();
  if (/mahakal|ujjain/.test(t)) return { title: 'Live Darshan — Mahakaleshwar Temple, Ujjain', deity: 'Lord Shiva', location: 'Ujjain, Madhya Pradesh', category: 'Jyotirlinga' };
  if (/kashi|vishwanath/.test(t)) return { title: 'Live Darshan — Kashi Vishwanath Temple', deity: 'Lord Shiva', location: 'Varanasi, Uttar Pradesh', category: 'Jyotirlinga' };
  if (/kedarnath/.test(t)) return { title: 'Live Darshan — Kedarnath Temple', deity: 'Lord Shiva', location: 'Kedarnath, Uttarakhand', category: 'Char Dham' };
  if (/badrinath/.test(t)) return { title: 'Live Darshan — Badrinath Temple', deity: 'Lord Vishnu', location: 'Badrinath, Uttarakhand', category: 'Char Dham' };
  if (/siddhivinayak|sidhivinayak/.test(t)) return { title: 'Live Darshan — Siddhivinayak Temple, Mumbai', deity: 'Lord Ganesha', location: 'Mumbai, Maharashtra', category: 'Temple' };
  if (/omkareshwar/.test(t)) return { title: 'Live Darshan — Omkareshwar Jyotirlinga', deity: 'Lord Shiva', location: 'Omkareshwar, Madhya Pradesh', category: 'Jyotirlinga' };
  if (/trimbak|trambak/.test(t)) return { title: 'Live Darshan — Trimbakeshwar Temple', deity: 'Lord Shiva', location: 'Nashik, Maharashtra', category: 'Jyotirlinga' };
  if (/srisailam|mallikarjuna/.test(t)) return { title: 'Live Darshan — Srisailam Mallikarjuna', deity: 'Lord Shiva', location: 'Srisailam, Andhra Pradesh', category: 'Jyotirlinga' };
  if (/vaishno/.test(t)) return { title: 'Live Darshan — Mata Vaishno Devi', deity: 'Mata Vaishno Devi', location: 'Katra, Jammu and Kashmir', category: 'Shakti Peeth' };
  if (/meenakshi|madurai/.test(t)) return { title: 'Live Darshan — Meenakshi Amman Temple', deity: 'Goddess Meenakshi', location: 'Madurai, Tamil Nadu', category: 'Temple' };
  if (/guruvay/.test(t)) return { title: 'Live Darshan — Guruvayur Temple', deity: 'Lord Krishna', location: 'Guruvayur, Kerala', category: 'Temple' };
  if (/banke|bihari|bakebihari/.test(t)) return { title: 'Live Darshan — Banke Bihari Temple, Vrindavan', deity: 'Lord Krishna', location: 'Vrindavan, Uttar Pradesh', category: 'Temple' };
  if (/kamakhya/.test(t)) return { title: 'Live Darshan — Kamakhya Temple', deity: 'Goddess Kamakhya', location: 'Guwahati, Assam', category: 'Shakti Peeth' };
  if (/rameshwar|rameswar|ramanathaswamy/.test(t)) return { title: 'Live Darshan — Ramanathaswamy Temple, Rameswaram', deity: 'Lord Shiva', location: 'Rameswaram, Tamil Nadu', category: 'Jyotirlinga' };
  if (/kanaka.?durga|vijayawada/.test(t)) return { title: 'Live Darshan — Kanaka Durga Temple', deity: 'Goddess Durga', location: 'Vijayawada, Andhra Pradesh', category: 'Temple' };
  if (/yadagiri|yadadri/.test(t)) return { title: 'Live Darshan — Yadagirigutta Temple', deity: 'Lord Narasimha', location: 'Yadadri, Telangana', category: 'Temple' };
  if (/bhadrachalam/.test(t)) return { title: 'Live Darshan — Bhadrachalam Temple', deity: 'Lord Rama', location: 'Bhadrachalam, Telangana', category: 'Temple' };
  if (/mantralay|raghavendra/.test(t)) return { title: 'Live Darshan — Mantralayam Raghavendra Swamy', deity: 'Sri Raghavendra Swamy', location: 'Mantralayam, Andhra Pradesh', category: 'Temple' };
  if (/annavaram|satyanarayana/.test(t)) return { title: 'Live Darshan — Annavaram Satyanarayana', deity: 'Lord Satyanarayana', location: 'Annavaram, Andhra Pradesh', category: 'Temple' };
  if (/annamalai|tiruvannamalai|arunachala/.test(t)) return { title: 'Live Darshan — Arunachaleswarar Temple', deity: 'Lord Shiva', location: 'Tiruvannamalai, Tamil Nadu', category: 'Temple' };
  if (/chamundi/.test(t)) return { title: 'Live Darshan — Chamundeshwari Temple', deity: 'Goddess Chamundi', location: 'Mysore, Karnataka', category: 'Temple' };
  if (/iskcon|mangal arati|kirtan/.test(t)) return { title: 'Live Darshan — ISKCON Live Kirtan/Darshan', deity: 'Sri Sri Radha Krishna', location: 'ISKCON', category: 'Temple' };
  if (/pandharpur|vitthal|vithal/.test(t)) return { title: 'Live Darshan — Pandharpur Vitthal Rukmini', deity: 'Lord Vitthal', location: 'Pandharpur, Maharashtra', category: 'Temple' };
  if (/shirdi/.test(t)) return { title: 'Live Darshan — Shirdi Sai Baba', deity: 'Sai Baba', location: 'Shirdi, Maharashtra', category: 'Temple' };
  return null;
}

const byTemple = new Map();
for (const e of existing) byTemple.set(e.title, e);

for (const item of arr) {
  const meta = metaFromTitle(item.title);
  if (!meta) continue;
  if (!byTemple.has(meta.title)) byTemple.set(meta.title, { id: item.id, ...meta });
}

let videos = [...byTemple.values()];
for (const item of arr) {
  if (videos.some((v) => v.id === item.id)) continue;
  const meta = metaFromTitle(item.title);
  if (!meta) continue;
  const altTitle = `${meta.title} (Alt feed)`;
  if (!videos.some((v) => v.title === altTitle) && videos.length < 36) {
    videos.push({ id: item.id, ...meta, title: altTitle });
  }
}

videos = videos.slice(0, 36).map((v, i) => ({
  id: i + 1,
  title: v.title,
  description: `Verified YouTube live/darshan stream — ${v.location}`,
  thumbnailUrl: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
  embedUrl: `https://www.youtube.com/embed/${v.id}`,
  youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
  category: v.category,
  deity: v.deity,
  location: v.location,
}));

fs.writeFileSync('src/data/darshan-videos.json', `${JSON.stringify({ videos }, null, 2)}\n`);
console.log('Wrote', videos.length, 'darshan videos');
