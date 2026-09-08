import type { AppLocale } from "@/hooks/use-locale";

type ContentLocale = Exclude<AppLocale, "en">;

export const catalogLabelTranslations: Record<ContentLocale, Record<string, string>> = {
  hi: { "Sri Aurobindo & The Mother": "श्री अरविंद एवं श्री माँ", PORTAL: "वेब पोर्टल", FLIPBOOK: "पलटने योग्य पुस्तक", "TEXT + AUDIO": "पाठ + ऑडियो" },
  bn: { "Sri Aurobindo & The Mother": "শ্রী অরবিন্দ ও শ্রীমা", PORTAL: "ওয়েব পোর্টাল", FLIPBOOK: "পাতা ওল্টানো বই", "TEXT + AUDIO": "পাঠ + অডিও" },
  gu: { "Sri Aurobindo & The Mother": "શ્રી અરવિંદ અને શ્રી માતાજી", PORTAL: "વેબ પોર્ટલ", FLIPBOOK: "પાનાં ફેરવી શકાય તેવું પુસ્તક", "TEXT + AUDIO": "લખાણ + ઑડિયો" },
  mr: { "Sri Aurobindo & The Mother": "श्री अरविंद आणि श्रीमाताजी", PORTAL: "वेब पोर्टल", FLIPBOOK: "पाने उलटण्याचे पुस्तक", "TEXT + AUDIO": "मजकूर + ध्वनी" },
  ta: { "Sri Aurobindo & The Mother": "ஸ்ரீ அரவிந்தர் மற்றும் ஸ்ரீ அன்னை", PORTAL: "இணையத் தளம்", FLIPBOOK: "பக்கங்களைப் புரட்டும் நூல்", "TEXT + AUDIO": "உரை + ஒலி" },
  te: { "Sri Aurobindo & The Mother": "శ్రీ అరవిందులు మరియు శ్రీ మాత", PORTAL: "వెబ్ వేదిక", FLIPBOOK: "పేజీలు తిప్పే పుస్తకం", "TEXT + AUDIO": "పాఠ్యం + శ్రవణం" },
  ml: { "Sri Aurobindo & The Mother": "ശ്രീ അരവിന്ദനും ശ്രീ മാതാവും", PORTAL: "വെബ് പോർട്ടൽ", FLIPBOOK: "താളുകൾ മറിക്കുന്ന പുസ്തകം", "TEXT + AUDIO": "പാഠം + ശബ്ദം" },
  kn: { "Sri Aurobindo & The Mother": "ಶ್ರೀ ಅರವಿಂದರು ಮತ್ತು ಶ್ರೀ ಮಾತೆ", PORTAL: "ಜಾಲತಾಣ", FLIPBOOK: "ಪುಟ ತಿರುಗಿಸುವ ಪುಸ್ತಕ", "TEXT + AUDIO": "ಪಠ್ಯ + ಧ್ವನಿ" },
  or: { "Sri Aurobindo & The Mother": "ଶ୍ରୀ ଅରବିନ୍ଦ ଓ ଶ୍ରୀମା", PORTAL: "ୱେବ୍ ପୋର୍ଟାଲ", FLIPBOOK: "ପୃଷ୍ଠା ଓଲଟାଇ ପଢ଼ିବା ପୁସ୍ତକ", "TEXT + AUDIO": "ପାଠ୍ୟ + ଧ୍ୱନି" },
  pa: { "Sri Aurobindo & The Mother": "ਸ੍ਰੀ ਅਰਬਿੰਦੋ ਅਤੇ ਸ੍ਰੀ ਮਾਂ", PORTAL: "ਵੈੱਬ ਪੋਰਟਲ", FLIPBOOK: "ਸਫ਼ੇ ਪਲਟਣ ਵਾਲੀ ਪੁਸਤਕ", "TEXT + AUDIO": "ਲਿਖਤ + ਧੁਨੀ" },
  as: { "Sri Aurobindo & The Mother": "শ্ৰী অৰবিন্দ আৰু শ্ৰীমা", PORTAL: "ৱেব পোৰ্টেল", FLIPBOOK: "পৃষ্ঠা লুটিয়াই পঢ়া কিতাপ", "TEXT + AUDIO": "পাঠ + ধ্বনি" },
};
