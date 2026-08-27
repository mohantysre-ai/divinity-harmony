const vowels: Record<string, string> = { 'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'ṛ','ॠ':'ṝ','ऌ':'ḷ','ए':'e','ऐ':'ai','ओ':'o','औ':'au' };
const signs: Record<string, string> = { 'ा':'ā','ि':'i','ी':'ī','ु':'u','ू':'ū','ृ':'ṛ','ॄ':'ṝ','ॢ':'ḷ','े':'e','ै':'ai','ो':'o','ौ':'au' };
const consonants: Record<string, string> = { 'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ','च':'c','छ':'ch','ज':'j','झ':'jh','ञ':'ñ','ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ','त':'t','थ':'th','द':'d','ध':'dh','न':'n','प':'p','फ':'ph','ब':'b','भ':'bh','म':'m','य':'y','र':'r','ल':'l','व':'v','श':'ś','ष':'ṣ','स':'s','ह':'h','ळ':'ḻ' };
const marks: Record<string, string> = { 'ं':'ṃ','ः':'ḥ','ँ':'m̐','ऽ':'’','ॐ':'oṃ','।':'.','॥':'..' };

export function devanagariToIast(input: string): string {
  let output = '';
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (vowels[char]) { output += vowels[char]; continue; }
    if (marks[char]) { output += marks[char]; continue; }
    if (!consonants[char]) { output += char; continue; }
    output += consonants[char];
    const next = input[index + 1];
    if (next === '्') { index += 1; continue; }
    if (signs[next]) { output += signs[next]; index += 1; continue; }
    output += 'a';
  }
  return output;
}
