// ============================================================
// 🇮🇱 מדברים ביחד — Hebrew Toddler Speech Practice PWA v2
// Features: Daily Mission · Smart Words · Parent Voice ·
//           Mascot · Experimental SR · Parent Decision State
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// 📚 WORD DATA — add/edit words here
// Each word needs a unique `id` (used as localStorage key).
// Structure: { id, word, level2, level3, emoji }
// TO ADD MORE CATEGORIES: add a new key to this object.
// ============================================================
const WORD_DATA = {
  חיות: [
    { id:"c1",  word:"כלב",    level2:"כלב גדול",         level3:"זה כלב גדול",          emoji:"🐶" },
    { id:"c2",  word:"חתול",   level2:"חתול חמוד",        level3:"זה חתול חמוד",         emoji:"🐱" },
    { id:"c3",  word:"פרה",    level2:"פרה לבנה",         level3:"הפרה אוכלת עשב",       emoji:"🐄" },
    { id:"c4",  word:"אריה",   level2:"אריה גדול",        level3:"האריה ישן עכשיו",      emoji:"🦁" },
    { id:"c5",  word:"ברווז",  level2:"ברווז קטן",        level3:"הברווז שוחה במים",     emoji:"🦆" },
    { id:"c6",  word:"פיל",    level2:"פיל ענק",          level3:"הפיל שותה מים",        emoji:"🐘" },
    { id:"c7",  word:"ארנב",   level2:"ארנב לבן",         level3:"הארנב קופץ מהר",       emoji:"🐰" },
    { id:"c8",  word:"דג",     level2:"דג קטן",           level3:"הדג שוחה בים",         emoji:"🐟" },
    { id:"c9",  word:"ציפור",  level2:"ציפור קטנה",       level3:"הציפור עפה גבוה",      emoji:"🐦" },
    { id:"c10", word:"סוס",    level2:"סוס גדול",         level3:"הסוס רץ מהר",          emoji:"🐴" },
    { id:"c11", word:"כבשה",   level2:"כבשה לבנה",        level3:"הכבשה רכה וחמה",       emoji:"🐑" },
    { id:"c12", word:"חזרזיר", level2:"חזרזיר ורוד",      level3:"החזרזיר אוכל",         emoji:"🐷" },
    { id:"c13", word:"קוף",    level2:"קוף שובב",         level3:"הקוף טיפס על עץ",      emoji:"🐵" },
    { id:"c14", word:"דובי",   level2:"דובי חמוד",        level3:"הדובי ישן בבית",       emoji:"🐻" },
    { id:"c15", word:"פרפר",   level2:"פרפר יפה",         level3:"הפרפר עף בגינה",       emoji:"🦋" },
    { id:"c16", word:"צב",     level2:"צב איטי",          level3:"הצב הולך לאט",         emoji:"🐢" },
    { id:"c17", word:"דבורה",  level2:"דבורה מתוקה",      level3:"הדבורה עושה דבש",      emoji:"🐝" },
    { id:"c18", word:"תנין",   level2:"תנין ירוק",        level3:"התנין גר בנהר",        emoji:"🐊" },
    { id:"c19", word:"זברה",   level2:"זברה פסים",        level3:"לזברה יש פסים שחורים", emoji:"🦓" },
    { id:"c20", word:"ג׳ירף",  level2:"ג׳ירף גבוה",      level3:"הג׳ירף גבוה מאוד",    emoji:"🦒" },
  ],
  "כלי מטבח": [
    { id:"k1",  word:"כוס",    level2:"כוס מים",          level3:"שתי מים מהכוס",        emoji:"🥤" },
    { id:"k2",  word:"צלחת",   level2:"צלחת גדולה",       level3:"שים אוכל בצלחת",       emoji:"🍽️" },
    { id:"k3",  word:"כף",     level2:"כף קטנה",          level3:"אכול עם הכף",          emoji:"🥄" },
    { id:"k4",  word:"מזלג",   level2:"מזלג כסוף",        level3:"אכול עם המזלג",        emoji:"🍴" },
    { id:"k5",  word:"קומקום", level2:"קומקום חם",        level3:"הקומקום רותח עכשיו",   emoji:"🫖" },
    { id:"k6",  word:"מחבת",   level2:"מחבת חמה",         level3:"אמא מחממת את המחבת",   emoji:"🍳" },
    { id:"k7",  word:"קערה",   level2:"קערה עמוקה",       level3:"שמי מרק בקערה",        emoji:"🥣" },
    { id:"k8",  word:"בקבוק",  level2:"בקבוק מים",        level3:"שתי מהבקבוק שלך",      emoji:"🍶" },
    { id:"k9",  word:"סיר",    level2:"סיר מרק",          level3:"אמא בישלה בסיר",       emoji:"🍲" },
    { id:"k10", word:"מגבת",   level2:"מגבת רכה",         level3:"נגבי ידיים עם המגבת",  emoji:"🧼" },
    { id:"k11", word:"קנקן",   level2:"קנקן מיץ",         level3:"מזגי מיץ מהקנקן",      emoji:"🫙" },
    { id:"k12", word:"תנור",   level2:"תנור חם",          level3:"אמא אפתה בתנור",       emoji:"🔥" },
    { id:"k13", word:"מגש",    level2:"מגש גדול",         level3:"שים כוס על המגש",      emoji:"🫙" },
    { id:"k14", word:"כלים",   level2:"כלים נקיים",       level3:"שטפי את הכלים",        emoji:"🫧" },
  ],
  צבעים: [
    { id:"r1",  word:"אדום",    level2:"עגבנייה אדומה",   level3:"העגבנייה היא אדומה",   emoji:"🔴" },
    { id:"r2",  word:"כחול",    level2:"שמיים כחולים",    level3:"השמיים הם כחולים",     emoji:"🔵" },
    { id:"r3",  word:"ירוק",    level2:"עלה ירוק",        level3:"העלה הוא ירוק",        emoji:"🟢" },
    { id:"r4",  word:"צהוב",    level2:"שמש צהובה",       level3:"השמש היא צהובה",       emoji:"🟡" },
    { id:"r5",  word:"כתום",    level2:"תפוז כתום",       level3:"התפוז הוא כתום",       emoji:"🟠" },
    { id:"r6",  word:"ורוד",    level2:"פרח ורוד",        level3:"הפרח הזה ורוד",        emoji:"🌸" },
    { id:"r7",  word:"סגול",    level2:"ענב סגול",        level3:"הענב הוא סגול",        emoji:"🟣" },
    { id:"r8",  word:"לבן",     level2:"שלג לבן",         level3:"השלג הוא לבן",         emoji:"⬜" },
    { id:"r9",  word:"שחור",    level2:"חתול שחור",       level3:"החתול הזה שחור",       emoji:"⬛" },
    { id:"r10", word:"חום",     level2:"דובי חום",        level3:"הדובי הוא חום",        emoji:"🟫" },
    { id:"r11", word:"אפור",    level2:"פיל אפור",        level3:"הפיל הוא אפור",        emoji:"🩶" },
    { id:"r12", word:"תכלת",    level2:"שמיים תכלות",     level3:"השמיים תכולות ויפות",  emoji:"🩵" },
    { id:"r13", word:"זהב",     level2:"כוכב זהב",        level3:"הכוכב הוא זהב",        emoji:"⭐" },
    { id:"r14", word:"צבעוני",  level2:"פרפר צבעוני",     level3:"הפרפר הוא צבעוני",     emoji:"🦋" },
  ],
  מספרים: [
    { id:"n1",  word:"אחד",     level2:"כדור אחד",        level3:"יש לי כדור אחד",       emoji:"1️⃣" },
    { id:"n2",  word:"שתיים",   level2:"שתי ידיים",       level3:"יש לי שתי ידיים",      emoji:"2️⃣" },
    { id:"n3",  word:"שלוש",    level2:"שלושה כלבים",     level3:"ראיתי שלושה כלבים",    emoji:"3️⃣" },
    { id:"n4",  word:"ארבע",    level2:"ארבע כסאות",      level3:"יש ארבע כסאות",        emoji:"4️⃣" },
    { id:"n5",  word:"חמש",     level2:"חמש אצבעות",      level3:"יש לי חמש אצבעות",    emoji:"5️⃣" },
    { id:"n6",  word:"שש",      level2:"שש ביצים",        level3:"יש שש ביצים בסל",      emoji:"6️⃣" },
    { id:"n7",  word:"שבע",     level2:"שבעה ימים",       level3:"יש שבעה ימים בשבוע",   emoji:"7️⃣" },
    { id:"n8",  word:"שמונה",   level2:"שמונה כוכבים",    level3:"ספרי שמונה כוכבים",    emoji:"8️⃣" },
    { id:"n9",  word:"תשע",     level2:"תשעה פרחים",      level3:"יש תשעה פרחים בגינה",  emoji:"9️⃣" },
    { id:"n10", word:"עשר",     level2:"עשרה ילדים",      level3:"יש עשרה ילדים בכיתה",  emoji:"🔟" },
    { id:"n11", word:"הרבה",    level2:"הרבה כוכבים",     level3:"יש הרבה כוכבים",      emoji:"⭐" },
    { id:"n12", word:"מעט",     level2:"מעט מים",         level3:"יש מעט מים בכוס",      emoji:"💧" },
    { id:"n13", word:"זוג",     level2:"זוג גרביים",      level3:"יש לי זוג גרביים",     emoji:"🧦" },
  ],
  "כלי תחבורה": [
    { id:"t1",  word:"אוטו",      level2:"אוטו אדום",      level3:"זה אוטו אדום גדול",    emoji:"🚗" },
    { id:"t2",  word:"אוטובוס",   level2:"אוטובוס צהוב",   level3:"אני נוסעת באוטובוס",  emoji:"🚌" },
    { id:"t3",  word:"רכבת",      level2:"רכבת מהירה",     level3:"הרכבת נוסעת מהר",      emoji:"🚂" },
    { id:"t4",  word:"מטוס",      level2:"מטוס גדול",      level3:"המטוס עף בשמיים",      emoji:"✈️" },
    { id:"t5",  word:"אופניים",   level2:"אופניים כחולות", level3:"אני רוכבת על אופניים", emoji:"🚲" },
    { id:"t6",  word:"ספינה",     level2:"ספינה גדולה",    level3:"הספינה שטה בים",       emoji:"🚢" },
    { id:"t7",  word:"מסוק",      level2:"מסוק קטן",       level3:"המסוק עף גבוה",        emoji:"🚁" },
    { id:"t8",  word:"טרקטור",    level2:"טרקטור ירוק",    level3:"הטרקטור חורש בשדה",    emoji:"🚜" },
    { id:"t9",  word:"אמבולנס",   level2:"אמבולנס לבן",    level3:"האמבולנס נוסע מהר",    emoji:"🚑" },
    { id:"t10", word:"משאית",     level2:"משאית גדולה",    level3:"המשאית נוסעת בכביש",   emoji:"🚛" },
    { id:"t11", word:"קורקינט",   level2:"קורקינט קטן",    level3:"אני נוסעת על קורקינט", emoji:"🛴" },
    { id:"t12", word:"טיל",       level2:"טיל בחלל",       level3:"הטיל עף לחלל",         emoji:"🚀" },
    { id:"t13", word:"מונית",     level2:"מונית צהובה",    level3:"ניסעתי במונית צהובה",   emoji:"🚕" },
    { id:"t14", word:"כבאית",     level2:"כבאית אדומה",    level3:"הכבאית מכבה שריפה",    emoji:"🚒" },
  ],
  אוכל: [
    { id:"f1",  word:"לחם",     level2:"לחם טוב",         level3:"אני אוכלת לחם",        emoji:"🍞" },
    { id:"f2",  word:"גבינה",   level2:"גבינה צהובה",     level3:"שמי גבינה על הלחם",    emoji:"🧀" },
    { id:"f3",  word:"ביצה",    level2:"ביצה מטוגנת",     level3:"אמא טיגנה ביצה",       emoji:"🍳" },
    { id:"f4",  word:"חלב",     level2:"כוס חלב",         level3:"שתי כוס חלב",          emoji:"🥛" },
    { id:"f5",  word:"אורז",    level2:"אורז לבן",        level3:"האורז מוכן לאכול",     emoji:"🍚" },
    { id:"f6",  word:"פסטה",    level2:"פסטה טעימה",      level3:"אמא בישלה פסטה",       emoji:"🍝" },
    { id:"f7",  word:"מרק",     level2:"מרק חם",          level3:"שתי מרק חם בחורף",     emoji:"🍲" },
    { id:"f8",  word:"שוקולד",  level2:"שוקולד מתוק",     level3:"השוקולד מתוק ומשמח",   emoji:"🍫" },
    { id:"f9",  word:"עוגה",    level2:"עוגה טעימה",      level3:"אמא אפתה עוגה",        emoji:"🎂" },
    { id:"f10", word:"עוגייה",  level2:"עוגייה מתוקה",    level3:"אכלי עוגייה אחת",      emoji:"🍪" },
    { id:"f11", word:"גלידה",   level2:"גלידה קרה",       level3:"הגלידה קרה ומתוקה",    emoji:"🍦" },
    { id:"f12", word:"פיצה",    level2:"פיצה חמה",        level3:"אכלי פרוסת פיצה",      emoji:"🍕" },
    { id:"f13", word:"דבש",     level2:"דבש מתוק",        level3:"הדבש מתוק מאוד",       emoji:"🍯" },
    { id:"f14", word:"יוגורט",  level2:"יוגורט לבן",      level3:"אכלי יוגורט בבוקר",    emoji:"🥛" },
    { id:"f15", word:"סנדוויץ", level2:"סנדוויץ טעים",    level3:"אמא הכינה סנדוויץ",    emoji:"🥪" },
  ],
  פירות: [
    { id:"fr1", word:"תפוח",    level2:"תפוח אדום",       level3:"זה תפוח אדום מתוק",    emoji:"🍎" },
    { id:"fr2", word:"בננה",    level2:"בננה צהובה",      level3:"הבננה צהובה ומתוקה",   emoji:"🍌" },
    { id:"fr3", word:"תפוז",    level2:"תפוז כתום",       level3:"התפוז כתום ועגול",     emoji:"🍊" },
    { id:"fr4", word:"ענבים",   level2:"ענבים סגולים",    level3:"הענבים מתוקים",        emoji:"🍇" },
    { id:"fr5", word:"תות",     level2:"תות אדום",        level3:"התות אדום ומתוק",      emoji:"🍓" },
    { id:"fr6", word:"אבטיח",   level2:"אבטיח גדול",      level3:"האבטיח קר ומתוק",      emoji:"🍉" },
    { id:"fr7", word:"אפרסק",   level2:"אפרסק מתוק",      level3:"האפרסק רך ומתוק",      emoji:"🍑" },
    { id:"fr8", word:"דובדבן",  level2:"דובדבן אדום",     level3:"הדובדבנים אדומים",     emoji:"🍒" },
    { id:"fr9", word:"מנגו",    level2:"מנגו מתוק",       level3:"המנגו מתוק ועסיסי",    emoji:"🥭" },
    { id:"fr10",word:"קיווי",   level2:"קיווי ירוק",      level3:"הקיווי ירוק מבפנים",   emoji:"🥝" },
    { id:"fr11",word:"לימון",   level2:"לימון חמוץ",      level3:"הלימון חמוץ מאוד",     emoji:"🍋" },
    { id:"fr12",word:"אננס",    level2:"אננס גדול",       level3:"האננס מתוק ויפה",      emoji:"🍍" },
    { id:"fr13",word:"אוכמניות",level2:"אוכמניות כחולות", level3:"האוכמניות טעימות",     emoji:"🫐" },
  ],
  ירקות: [
    { id:"v1",  word:"גזר",     level2:"גזר כתום",        level3:"הגזר כתום ובריא",      emoji:"🥕" },
    { id:"v2",  word:"מלפפון",  level2:"מלפפון ירוק",     level3:"המלפפון ירוק וקריר",   emoji:"🥒" },
    { id:"v3",  word:"עגבנייה", level2:"עגבנייה אדומה",   level3:"העגבנייה אדומה",       emoji:"🍅" },
    { id:"v4",  word:"ברוקולי", level2:"ברוקולי ירוק",    level3:"הברוקולי ירוק ובריא",  emoji:"🥦" },
    { id:"v5",  word:"פלפל",    level2:"פלפל אדום",       level3:"הפלפל אדום ומתוק",     emoji:"🌶️" },
    { id:"v6",  word:"חציל",    level2:"חציל סגול",       level3:"החציל סגול ועגול",     emoji:"🍆" },
    { id:"v7",  word:"תירס",    level2:"תירס צהוב",       level3:"התירס צהוב ומתוק",     emoji:"🌽" },
    { id:"v8",  word:"שום",     level2:"שום לבן",         level3:"השום קטן ולבן",        emoji:"🧄" },
    { id:"v9",  word:"בצל",     level2:"בצל גדול",        level3:"הבצל גדול ועגול",      emoji:"🧅" },
    { id:"v10", word:"פטרייה",  level2:"פטרייה חומה",     level3:"הפטרייה קטנה וחומה",   emoji:"🍄" },
    { id:"v11", word:"כרוב",    level2:"כרוב ירוק",       level3:"הכרוב ירוק ועגול",     emoji:"🥬" },
    { id:"v12", word:"אפונה",   level2:"אפונה ירוקה",     level3:"האפונה ירוקה ועגולה",  emoji:"🟢" },
  ],
  משפחה: [
    { id:"m1",  word:"אמא",     level2:"אמא שלי",         level3:"אני אוהבת את אמא",     emoji:"👩" },
    { id:"m2",  word:"אבא",     level2:"אבא שלי",         level3:"אני אוהבת את אבא",     emoji:"👨" },
    { id:"m3",  word:"סבתא",    level2:"סבתא חמודה",      level3:"סבתא מכינה עוגה",      emoji:"👵" },
    { id:"m4",  word:"סבא",     level2:"סבא שלי",         level3:"סבא מספר סיפורים",     emoji:"👴" },
    { id:"m5",  word:"אחות",    level2:"אחות קטנה",       level3:"יש לי אחות קטנה",      emoji:"👧" },
    { id:"m6",  word:"אח",      level2:"אח גדול",         level3:"האח שלי גדול",         emoji:"👦" },
    { id:"m7",  word:"תינוק",   level2:"תינוק חמוד",      level3:"התינוק ישן כרגע",      emoji:"👶" },
    { id:"m8",  word:"דוד",     level2:"דוד שלי",         level3:"הדוד שלי מצחיק",       emoji:"🧔" },
    { id:"m9",  word:"דודה",    level2:"דודה יפה",        level3:"הדודה שלי חמודה",      emoji:"👩‍🦰" },
    { id:"m10", word:"משפחה",   level2:"משפחה שלי",       level3:"אני אוהבת את המשפחה",  emoji:"👨‍👩‍👧" },
    { id:"m11", word:"חבר",     level2:"חבר טוב",         level3:"הוא חבר טוב שלי",      emoji:"🤝" },
    { id:"m12", word:"מורה",    level2:"מורה טובה",       level3:"המורה שלי טובה",       emoji:"👩‍🏫" },
  ],
  פעולות: [
    { id:"a1",  word:"אוכלת",   level2:"אוכלת תפוח",      level3:"אני אוכלת תפוח עסיסי", emoji:"😋" },
    { id:"a2",  word:"שותה",    level2:"שותה מים",        level3:"אני שותה מים קרים",    emoji:"💧" },
    { id:"a3",  word:"ישנה",    level2:"ישנה במיטה",      level3:"אני ישנה במיטה שלי",   emoji:"😴" },
    { id:"a4",  word:"רצה",     level2:"רצה מהר",         level3:"אני רצה מהר בחוץ",     emoji:"🏃" },
    { id:"a5",  word:"קופצת",   level2:"קופצת גבוה",      level3:"אני קופצת גבוה גבוה",  emoji:"🤸" },
    { id:"a6",  word:"שרה",     level2:"שרה שיר",         level3:"אני שרה שיר יפה",      emoji:"🎵" },
    { id:"a7",  word:"צוחקת",   level2:"צוחקת בקול",      level3:"אני צוחקת הרבה",       emoji:"😂" },
    { id:"a8",  word:"מצייר",   level2:"מצייר ציור",      level3:"אני מציירת ציור יפה",  emoji:"🎨" },
    { id:"a9",  word:"קוראת",   level2:"קוראת ספר",       level3:"אני קוראת ספר מעניין", emoji:"📖" },
    { id:"a10", word:"משחקת",   level2:"משחקת בגינה",     level3:"אני משחקת בגינה",      emoji:"⚽" },
    { id:"a11", word:"רוחצת",   level2:"רוחצת ידיים",     level3:"אני רוחצת ידיים",      emoji:"🧼" },
    { id:"a12", word:"לובשת",   level2:"לובשת שמלה",      level3:"אני לובשת שמלה יפה",   emoji:"👗" },
    { id:"a13", word:"חיבקת",   level2:"חיבקת חזק",       level3:"חיבקת את אמא חזק",     emoji:"🤗" },
  ],
};

// ============================================================
// 💾 LOCALSTORAGE KEYS & HELPERS
// ============================================================
const LS_STATS    = "mdb_wordstats_v1";
const LS_SETTINGS = "mdb_settings_v1";
const LS_DAILY    = "mdb_daily_v1";
const LS_VOICES   = "mdb_voices_v1";

const todayKey  = () => new Date().toISOString().slice(0, 10);
const loadJSON  = (key, fallback) => { try { return { ...fallback, ...JSON.parse(localStorage.getItem(key) || "{}") }; } catch { return fallback; } };
const saveJSON  = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const loadStats    = () => loadJSON(LS_STATS, {});
const loadSettings = () => loadJSON(LS_SETTINGS, { speechRecog: false });
const loadDaily    = () => loadJSON(LS_DAILY, {});
const loadVoices   = () => loadJSON(LS_VOICES, {});

// ============================================================
// 🔊 SPEECH SYNTHESIS (TTS)
// iOS Safari rules:
//   1. speechSynthesis.speak() MUST be called synchronously inside
//      a user-gesture handler (tap/click). It cannot be called from
//      useEffect, setTimeout, or Promise callbacks.
//   2. Voices are available immediately on iOS — no need to wait.
//   3. Cancel before speaking to avoid queue buildup.
//   4. Do NOT double-call: the voiceschanged + setTimeout pattern
//      causes two utterances. We just call directly.
// ============================================================
const speak = (text, onEnd) => {
  if (!window.speechSynthesis) { onEnd?.(); return; }

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();

  const fire = () => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang    = "he-IL";
    u.rate    = 0.82;
    u.pitch   = 1.05;
    u.volume  = 1;

    const voices = window.speechSynthesis.getVoices();
    // Prefer Hebrew, fall back to Arabic (phonetically similar), then any voice
    u.voice = voices.find(v => v.lang.startsWith("he"))
           || voices.find(v => v.lang.startsWith("ar"))
           || voices[0]
           || null;

    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
  };

  // On iOS voices are ready immediately after first page interaction.
  // On Chrome desktop they may load async — handle both without double-firing.
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    fire();
  } else {
    // Only listen once — no setTimeout fallback to avoid double-speak
    window.speechSynthesis.addEventListener("voiceschanged", fire, { once: true });
  }
};

// ============================================================
// 🎙️ PARENT VOICE — recorded phrases stored as base64 audio
// Phrases: "tagidi" | "kol_hakavod" | "bo_necase" | "alufah"
// TO ADD MORE PHRASES: extend PARENT_PHRASES array below.
// ============================================================
const PARENT_PHRASES = [
  { key: "tagidi",      label: "תגידי" },
  { key: "kol_hakavod", label: "כל הכבוד" },
  { key: "bo_necase",   label: "בואי ננסה שוב" },
  { key: "alufah",      label: "אלופה" },
];

const playParentVoice = (key, fallback) => {
  const v = loadVoices();
  if (v[key]) { try { new Audio(v[key]).play(); return; } catch {} }
  speak(fallback);
};

// ============================================================
// 🧠 SMART SESSION BUILDER — weighted random selection
// Weights: favorite ×3 · low success ×2 · not seen today ×1.5
// ============================================================
const SESSION_SIZE = 5;
const DAILY_GOAL   = 5;

const buildSession = (words) => {
  const stats = loadStats();
  const today = todayKey();
  const pool  = words.map(w => {
    const s = stats[w.id] || {};
    let weight = 1;
    if (s.favorite) weight *= 3;
    if (s.attempts > 0 && (s.successes / s.attempts) < 0.6) weight *= 2;
    if (!s.lastDate || s.lastDate !== today) weight *= 1.5;
    return { ...w, _w: weight };
  });
  const picked = [];
  const bucket = [...pool];
  while (picked.length < Math.min(SESSION_SIZE, bucket.length)) {
    const total = bucket.reduce((a, b) => a + b._w, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (let i = 0; i < bucket.length; i++) { r -= bucket[i]._w; if (r <= 0) { idx = i; break; } }
    picked.push(bucket[idx]);
    bucket.splice(idx, 1);
  }
  return picked;
};

const recordAttempt = (wordId, success) => {
  const stats = loadStats();
  const s = stats[wordId] || { attempts: 0, successes: 0, favorite: false, lastDate: "" };
  s.attempts++;
  if (success) s.successes++;
  s.lastDate = todayKey();
  stats[wordId] = s;
  saveJSON(LS_STATS, stats);
};

const toggleFav = (wordId) => {
  const stats = loadStats();
  const s = stats[wordId] || { attempts: 0, successes: 0, favorite: false, lastDate: "" };
  s.favorite = !s.favorite;
  stats[wordId] = s;
  saveJSON(LS_STATS, stats);
  return s.favorite;
};

// ============================================================
// 🎊 CONFETTI
// ============================================================
const Confetti = () => {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 0.8,
    color: ["#FF6B9D","#FFD93D","#6BCB77","#4D96FF","#FF6B35","#C77DFF"][i % 6],
    size: 8 + Math.random() * 10,
  }));
  return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:998,overflow:"hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:"absolute", top:"-20px", left:`${p.left}%`,
          width:p.size, height:p.size, backgroundColor:p.color, borderRadius:"2px",
          animation:`confettiFall 2.5s ease-in ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
};

// ============================================================
// ⭐ PROGRESS STARS
// ============================================================
const ProgressStars = ({ count, total = 3, size = "1.6rem" }) => (
  <div style={{ display:"flex", gap:"3px", justifyContent:"center" }}>
    {Array.from({ length: total }, (_, i) => (
      <span key={i} style={{
        fontSize: size,
        filter: i < count ? "none" : "grayscale(1) opacity(0.28)",
        transform: i < count ? "scale(1.1)" : "scale(1)",
        transition: "all 0.3s",
        animation: i === count - 1 && count > 0 ? "starPop 0.4s ease" : "none",
      }}>⭐</span>
    ))}
  </div>
);

// ============================================================
// 🐰 MASCOT — reacts to session state
// ============================================================
const MASCOT_CFG = {
  idle:      { emoji:"🐰", anim:"mascotBob 2.4s ease infinite",     sub:"..." },
  listening: { emoji:"🐰", anim:"mascotListen 0.7s ease infinite",  sub:"🎤 מקשיבה" },
  excited:   { emoji:"🥳", anim:"mascotJump 0.3s ease 4",           sub:"כל הכבוד!" },
  almost:    { emoji:"🐰", anim:"mascotNod 0.5s ease 3",            sub:"כמעט! 💪" },
  dance:     { emoji:"🎉", anim:"mascotDance 0.45s ease infinite",  sub:"יש! 🏆" },
};
const Mascot = ({ state }) => {
  const c = MASCOT_CFG[state] || MASCOT_CFG.idle;
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"2px",userSelect:"none" }}>
      <span style={{ fontSize:"2.8rem",display:"block",animation:c.anim,lineHeight:1 }}>{c.emoji}</span>
      <span style={{ fontSize:"0.72rem",color:"#aaa",fontFamily:"'Varela Round',sans-serif" }}>{c.sub}</span>
    </div>
  );
};

// ============================================================
// 📅 DAILY MISSION CARD
// ============================================================
const DailyMission = ({ successCount, onStart }) => {
  const done = successCount >= DAILY_GOAL;
  return (
    <div style={{
      background: done
        ? "linear-gradient(135deg,#6BCB77,#4D96FF)"
        : "linear-gradient(135deg,#FFF9E6,#FFF0F5)",
      borderRadius:"20px", padding:"16px 20px",
      border: done ? "none" : "2px solid #FFD93D55",
      boxShadow: done ? "0 6px 20px #6BCB7744" : "0 4px 14px rgba(0,0,0,0.06)",
      marginBottom:"16px", direction:"rtl",
    }}>
      <div style={{ fontFamily:"'Varela Round',sans-serif", display:"flex", flexDirection:"column", gap:"8px" }}>
        <div style={{ fontWeight:900,fontSize:"1.05rem",color:done?"#fff":"#333" }}>
          {done ? "✅ המשימה היומית הושלמה! 🎉" : "📅 המשימה היום"}
        </div>
        <div style={{ fontSize:"0.9rem",color:done?"rgba(255,255,255,0.85)":"#777" }}>
          {done ? "כל הכבוד — תרגלת 5 מילים היום!" : `תרגלי ${DAILY_GOAL} מילים בהצלחה`}
        </div>
        <ProgressStars count={Math.min(successCount, DAILY_GOAL)} total={DAILY_GOAL} size="1.25rem" />
        {!done && (
          <button onClick={onStart} style={{ ...btn("#FF6B9D","#fff","1rem"), marginTop:"4px" }}>
            🚀 התחילי עכשיו
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// 🎙️ PARENT VOICE PANEL (bottom sheet)
// ============================================================
const ParentVoicePanel = ({ onClose }) => {
  const [recs, setRecs]     = useState(loadVoices);
  const [recKey, setRecKey] = useState(null);
  const recRef   = useRef(null);
  const chunks   = useRef([]);

  const startRec = async (key) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const rec = new MediaRecorder(stream);
      chunks.current = [];
      rec.ondataavailable = e => chunks.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type:"audio/webm" });
        const fr = new FileReader();
        fr.onloadend = () => {
          const v = loadVoices(); v[key] = fr.result;
          saveJSON(LS_VOICES, v); setRecs(loadVoices());
          stream.getTracks().forEach(t => t.stop());
        };
        fr.readAsDataURL(blob);
      };
      rec.start(); recRef.current = rec; setRecKey(key);
    } catch { alert("אנא הרשי גישה למיקרופון בהגדרות הדפדפן."); }
  };

  const stopRec = () => { recRef.current?.stop(); setRecKey(null); };
  const delRec  = (key) => { const v = loadVoices(); delete v[key]; saveJSON(LS_VOICES, v); setRecs(loadVoices()); };
  const playRec = (key, label) => {
    const v = loadVoices();
    if (v[key]) { try { new Audio(v[key]).play(); return; } catch {} }
    speak(label);
  };

  return (
    <BottomSheet onClose={onClose}>
      <SheetTitle>🎙️ הקלט קול הורה</SheetTitle>
      <p style={{ fontSize:"0.88rem",color:"#999",fontFamily:"'Varela Round',sans-serif",lineHeight:1.5,marginBottom:"14px",direction:"rtl" }}>
        הקלטי את קולך לביטויים הנפוצים — האפליקציה תשתמש בקולך במקום הקול הממוחשב.
      </p>
      {PARENT_PHRASES.map(ph => (
        <div key={ph.key} style={{
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"13px 14px",background:"#f8f8f8",borderRadius:"14px",marginBottom:"8px",
        }}>
          <span style={{ fontFamily:"'Varela Round',sans-serif",fontWeight:700,fontSize:"1.05rem",color:"#333" }}>
            {ph.label}
            {recs[ph.key] && <span style={{ fontSize:"0.72rem",color:"#6BCB77",marginRight:"6px" }}> ✓</span>}
          </span>
          <div style={{ display:"flex",gap:"6px" }}>
            {recs[ph.key] && <>
              <button onClick={() => playRec(ph.key, ph.label)} style={smBtn("#4D96FF","#fff")}>▶️</button>
              <button onClick={() => delRec(ph.key)} style={smBtn("#ff6b6b","#fff")}>🗑️</button>
            </>}
            {recKey === ph.key
              ? <button onClick={stopRec} style={smBtn("#FF6B9D","#fff")}>⏹ סיום</button>
              : <button onClick={() => startRec(ph.key)} style={smBtn("#C77DFF","#fff")}>🔴 הקלט</button>
            }
          </div>
        </div>
      ))}
    </BottomSheet>
  );
};

// ============================================================
// ⚙️ SETTINGS PANEL (bottom sheet)
// ============================================================
const SettingsPanel = ({ settings, onSave, onClose, onVoices }) => {
  const [local, setLocal] = useState(settings);
  return (
    <BottomSheet onClose={onClose}>
      <SheetTitle>⚙️ הגדרות הורה</SheetTitle>

      {/* Speech recognition toggle */}
      <div style={{
        display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"14px",background:"#f8f8f8",borderRadius:"14px",marginBottom:"10px",
      }}>
        <div>
          <div style={{ fontFamily:"'Varela Round',sans-serif",fontWeight:700,fontSize:"0.95rem",color:"#333" }}>
            🎤 זיהוי דיבור ניסיוני
          </div>
          <div style={{ fontFamily:"'Varela Round',sans-serif",fontSize:"0.75rem",color:"#bbb",marginTop:"2px" }}>
            ההורה תמיד מחליט — לא נכשל אוטומטית
          </div>
        </div>
        <Toggle on={local.speechRecog} onToggle={() => setLocal(p => ({ ...p, speechRecog:!p.speechRecog }))} />
      </div>

      <button onClick={onVoices} style={{ ...btn("#C77DFF","#fff","1rem"),width:"100%",borderRadius:"14px",marginBottom:"10px" }}>
        🎙️ הקלט קול הורה
      </button>
      <button onClick={() => { onSave(local); onClose(); }}
        style={{ ...btn("#FF6B9D","#fff","1rem"),width:"100%",borderRadius:"14px" }}>
        💾 שמור הגדרות
      </button>
    </BottomSheet>
  );
};

// ============================================================
// 🎴 PRACTICE CARD
// ============================================================
const PracticeCard = ({ item, level, onCorrect, onAlmost, onRetry, sessionProgress, totalItems, settings, mascotState, setMascotState }) => {
  const [waitingParent, setWaitingParent] = useState(false);
  const [heardText,     setHeardText]     = useState(null);
  const [srSuggest,     setSrSuggest]     = useState(false);
  const [hasPlayed,     setHasPlayed]     = useState(false); // tracks if user tapped play yet
  const [isFav,         setIsFav]         = useState(() => (loadStats()[item.id] || {}).favorite || false);
  const recRef  = useRef(null);
  const current = level === 1 ? item.word : level === 2 ? item.level2 : item.level3;

  // Reset state when card/level changes — no auto-speak (iOS blocks it)
  useEffect(() => {
    setWaitingParent(false);
    setHeardText(null);
    setSrSuggest(false);
    setHasPlayed(false);
    setMascotState("idle");
    return () => { window.speechSynthesis?.cancel(); };
  }, [item.id, level]);

  // prompt() is always called from a tap — safe on iOS
  const prompt = useCallback(() => {
    setWaitingParent(false);
    setHeardText(null);
    setSrSuggest(false);
    setHasPlayed(true);
    setMascotState("idle");
    speak(`תגידי: ${current}`);
  }, [current, setMascotState]);

  const startListen = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || !settings.speechRecog) { setMascotState("listening"); setWaitingParent(true); return; }
    const rec = new SR();
    rec.lang = "he-IL"; rec.interimResults = false;
    rec.onstart = () => setMascotState("listening");
    rec.onend   = () => setWaitingParent(true);
    rec.onresult = (e) => {
      const said = e.results[0][0].transcript.trim();
      setHeardText(said);
      const target = current.replace(/[.,!?]/g,"");
      if (said.includes(item.word) || target.includes(said.replace(/[.,!?]/g,""))) setSrSuggest(true);
    };
    rec.onerror = () => setWaitingParent(true);
    rec.start(); recRef.current = rec;
  };

  const doCorrect = () => { setWaitingParent(false); setMascotState("excited"); onCorrect(); };
  const doAlmost  = () => { setWaitingParent(false); setMascotState("almost");  onAlmost();  };
  const doRetry   = () => { setWaitingParent(false); setMascotState("idle");    onRetry();   };

  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"10px",padding:"10px 14px",direction:"rtl" }}>
      {/* Progress bar */}
      <div style={{ display:"flex",gap:"4px",width:"100%" }}>
        {Array.from({ length: totalItems }, (_,i) => (
          <div key={i} style={{
            flex:1, height:"5px", borderRadius:"3px",
            background: i < sessionProgress ? "#6BCB77" : i === sessionProgress ? "#FFD93D" : "#eee",
            transition:"background 0.3s",
          }} />
        ))}
      </div>

      {/* Mascot (top right) */}
      <div style={{ alignSelf:"flex-end" }}><Mascot state={mascotState} /></div>

      {/* Word card — dims when parent decision needed */}
      <div style={{
        width:"100%", maxWidth:"360px",
        background:"linear-gradient(135deg,#FFF9E6,#FFF0F5)",
        borderRadius:"24px", border:"3px solid #FFD93D",
        boxShadow:"0 8px 28px rgba(255,107,157,0.13)",
        padding:"28px 18px 20px",
        display:"flex",flexDirection:"column",alignItems:"center",gap:"10px",
        opacity: waitingParent ? 0.5 : 1, transition:"opacity 0.3s",
        position:"relative",
      }}>
        {/* Favorite button */}
        <button onClick={() => setIsFav(toggleFav(item.id))} style={{
          position:"absolute",top:"10px",left:"10px",
          background:"none",border:"none",fontSize:"1.4rem",cursor:"pointer",
          filter: isFav ? "none" : "grayscale(1) opacity(0.35)",
        }}>❤️</button>

        {/* TO ADD REAL IMAGES: replace span with <img src={item.imageSrc} style={{width:160,height:160,objectFit:"contain"}} /> */}
        <span style={{ fontSize:"5.5rem",lineHeight:1,filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>
          {item.emoji}
        </span>
        <div style={{
          fontSize:"2rem",fontWeight:900,fontFamily:"'Varela Round',sans-serif",textAlign:"center",
          background:"linear-gradient(90deg,#FF6B9D,#FF6B35)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
        }}>{current}</div>
        <div style={{
          fontSize:"0.9rem",color:"#bbb",
          background:"#f0f0f0",borderRadius:"20px",padding:"3px 13px",
          fontFamily:"'Varela Round',sans-serif",
        }}>
          {level===1 ? "🌱 מילה" : level===2 ? "🌿 ביטוי" : "🌳 משפט"}
        </div>
      </div>

      {/* SR feedback */}
      {heardText && (
        <div style={{
          background:"#f0f8ff",borderRadius:"12px",padding:"9px 14px",
          fontFamily:"'Varela Round',sans-serif",fontSize:"0.9rem",
          color:"#333",width:"100%",textAlign:"center",direction:"rtl",
        }}>
          <span style={{ color:"#aaa" }}>שמעתי: </span><strong>{heardText}</strong>
          {srSuggest && <div style={{ color:"#6BCB77",fontWeight:700,marginTop:"3px" }}>נראה שהיא אמרה נכון ✅</div>}
        </div>
      )}

      {/* TAP TO HEAR — shown on new card before first tap (iOS can't auto-play) */}
      {!hasPlayed && !waitingParent && (
        <button onClick={prompt} style={{
          width:"100%", maxWidth:"360px",
          padding:"22px 20px",
          borderRadius:"20px",
          border:"3px dashed #4D96FF",
          background:"linear-gradient(135deg,#EEF6FF,#f0f8ff)",
          cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", gap:"8px",
          animation:"pulse 1.8s ease infinite",
          fontFamily:"'Varela Round',sans-serif",
        }}>
          <span style={{ fontSize:"2.8rem" }}>🔊</span>
          <span style={{ fontSize:"1.3rem", fontWeight:900, color:"#4D96FF" }}>לחצי לשמוע</span>
          <span style={{ fontSize:"0.85rem", color:"#aaa" }}>tap to hear the word</span>
        </button>
      )}

      {/* Action buttons (after first play) */}
      {hasPlayed && !waitingParent && (
        <div style={{ display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center",width:"100%" }}>
          <button onClick={prompt}       style={btn("#4D96FF","#fff")}>🔊 שמעי שוב</button>
          <button onClick={startListen}  style={btn("#C77DFF","#fff")}>🎤 דיברתי</button>
        </div>
      )}

      {/* ★ PARENT DECISION ZONE — clearly highlighted */}
      {waitingParent && (
        <div style={{
          width:"100%",
          background:"linear-gradient(135deg,#fffbe6,#fff0f5)",
          borderRadius:"20px",padding:"16px 14px",
          border:"3px solid #FFD93D",
          boxShadow:"0 4px 20px rgba(255,215,0,0.3)",
          animation:"slideUp 0.22s ease",
        }}>
          <div style={{
            textAlign:"center",fontFamily:"'Varela Round',sans-serif",
            fontSize:"1.25rem",fontWeight:900,color:"#333",
            marginBottom:"12px",direction:"rtl",
          }}>👨‍👩‍👧 הורה: איך היא אמרה?</div>
          <div style={{ display:"flex",gap:"7px",justifyContent:"center",flexWrap:"wrap" }}>
            <button onClick={doCorrect} style={{ ...btn("#6BCB77","#fff","1.05rem"),flex:1,minWidth:"90px" }}>✅ אמרה נכון</button>
            <button onClick={doAlmost}  style={{ ...btn("#FFD93D","#333","1.05rem"),flex:1,minWidth:"76px" }}>🟡 כמעט</button>
            <button onClick={doRetry}   style={{ ...btn("#FF6B35","#fff","1.05rem"),flex:1,minWidth:"90px" }}>🔁 ננסה שוב</button>
          </div>
          <button onClick={() => { setWaitingParent(false); prompt(); }} style={{
            marginTop:"9px",width:"100%",background:"none",
            border:"2px solid #ddd",borderRadius:"50px",padding:"8px",
            fontFamily:"'Varela Round',sans-serif",fontSize:"0.9rem",color:"#bbb",cursor:"pointer",
          }}>🔊 תשמעי שוב קודם</button>
        </div>
      )}

      {/* End session */}
      {!waitingParent && (
        <button onClick={() => { if (window.confirm("לסיים את האימון?")) window.location.reload(); }}
          style={{ background:"none",border:"none",fontSize:"0.85rem",color:"#ccc",fontFamily:"'Varela Round',sans-serif",cursor:"pointer",padding:"4px" }}>
          🏁 סיימנו להיום
        </button>
      )}
    </div>
  );
};

// ============================================================
// 🌈 FEEDBACK OVERLAY (correct / almost)
// ============================================================
const FeedbackOverlay = ({ type, onDone }) => {
  const msgs = {
    correct: ["כל הכבוד! ⭐","איזה יופי! 🌟","אלופה! 🏆","אמרת ממש יפה! 💖"],
    almost:  ["כמעט! בואי ננסה שוב 💪","יופי של ניסיון! 🌸"],
  };
  const msg = msgs[type][Math.floor(Math.random() * msgs[type].length)];
  const ok  = type === "correct";
  useEffect(() => {
    // setTimeout 0 keeps speech in same JS task as the tap — required on iOS Safari
    const st = setTimeout(() => speak(ok ? "כל הכבוד" : "כמעט, בואי ננסה שוב"), 0);
    const ct = setTimeout(onDone, ok ? 2000 : 1600);
    return () => { clearTimeout(st); clearTimeout(ct); };
  }, []);
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:500,
      display:"flex",alignItems:"center",justifyContent:"center",
      background: ok ? "rgba(107,203,119,0.93)" : "rgba(255,211,61,0.93)",
      animation:"fadeIn 0.2s ease",
    }}>
      {ok && <Confetti />}
      <div style={{
        fontSize:"2.4rem",fontWeight:900,fontFamily:"'Varela Round',sans-serif",
        color: ok ? "#fff" : "#333",textAlign:"center",direction:"rtl",
        animation:"bounce 0.4s ease",padding:"24px",
      }}>{msg}</div>
    </div>
  );
};

// ============================================================
// 🏆 DAILY MISSION COMPLETE SCREEN
// ============================================================
const DailyCompleteScreen = ({ onContinue }) => {
  useEffect(() => {
    const t = setTimeout(() => speak("אלופה! סיימנו להיום! כל הכבוד!"), 0);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:600,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      background:"linear-gradient(160deg,#FFF9E6,#FFF0F5)",
      padding:"32px 20px",direction:"rtl",
    }}>
      <Confetti />
      <Mascot state="dance" />
      <div style={{ fontSize:"4rem",margin:"12px 0",animation:"bounce 0.7s ease infinite alternate" }}>🏆</div>
      <h2 style={{
        fontSize:"2.2rem",fontWeight:900,textAlign:"center",
        fontFamily:"'Varela Round',sans-serif",
        background:"linear-gradient(90deg,#FF6B9D,#C77DFF)",
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
        margin:"8px 0",
      }}>סיימנו להיום!<br />כל הכבוד! 🎉</h2>
      <p style={{ fontFamily:"'Varela Round',sans-serif",color:"#888",fontSize:"1.1rem",textAlign:"center" }}>
        השלמת 5 מילים — אלופה אמיתית!
      </p>
      <ProgressStars count={5} total={5} size="1.8rem" />
      <div style={{ display:"flex",gap:"12px",marginTop:"28px",flexWrap:"wrap",justifyContent:"center" }}>
        <button onClick={onContinue} style={btn("#6BCB77","#fff")}>➕ עוד קצת</button>
        <button onClick={() => window.location.reload()} style={btn("#FF6B9D","#fff")}>🏠 לסיום</button>
      </div>
    </div>
  );
};

// ============================================================
// 🗂️ CATEGORY SCREEN
// ============================================================
const CAT_COLORS = ["#FF6B9D","#FFD93D","#6BCB77","#4D96FF","#FF6B35","#C77DFF","#FF6B9D","#6BCB77","#FFD93D","#4D96FF"];
const CAT_ICONS  = ["🐾","🍴","🎨","🔢","🚗","🍕","🍎","🥦","👨‍👩‍👧","🏃"];

const CategoryScreen = ({ onSelect, onSettings, dailySuccesses }) => {
  const stats = loadStats();
  const cats  = Object.keys(WORD_DATA);
  return (
    <div style={{ padding:"14px",direction:"rtl" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px" }}>
        <h2 style={{
          fontSize:"1.5rem",fontWeight:900,fontFamily:"'Varela Round',sans-serif",
          background:"linear-gradient(90deg,#FF6B9D,#C77DFF)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
        }}>בחרי נושא 🌈</h2>
        <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
          <div style={{ fontSize:"0.75rem",color:"#bbb",fontFamily:"'Varela Round',sans-serif",textAlign:"center" }}>
            יומי<br />{dailySuccesses}/{DAILY_GOAL}
          </div>
          <button onClick={onSettings} style={{
            background:"#f0f0f0",border:"none",borderRadius:"50%",
            width:"38px",height:"38px",fontSize:"1.15rem",cursor:"pointer",
          }}>⚙️</button>
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px" }}>
        {cats.map((cat,i) => {
          const words    = WORD_DATA[cat];
          const practiced = words.filter(w => stats[w.id]?.attempts > 0).length;
          const col = CAT_COLORS[i % CAT_COLORS.length];
          return (
            <button key={cat} onClick={() => onSelect(cat)} style={{
              padding:"16px 10px",borderRadius:"16px",border:`2px solid ${col}55`,
              background:`linear-gradient(135deg,${col}18,${col}30)`,
              cursor:"pointer",display:"flex",flexDirection:"column",
              alignItems:"center",gap:"5px",
              boxShadow:`0 3px 12px ${col}22`,
              fontFamily:"'Varela Round',sans-serif",
              WebkitTapHighlightColor:"transparent",
            }}>
              <span style={{ fontSize:"2rem" }}>{CAT_ICONS[i % CAT_ICONS.length]}</span>
              <span style={{ fontSize:"1.1rem",fontWeight:700,color:"#333" }}>{cat}</span>
              {practiced > 0 && (
                <span style={{ fontSize:"0.7rem",color:col,fontWeight:600 }}>{practiced}/{words.length} ✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// 🏠 START SCREEN
// ============================================================
const StartScreen = ({ onStart, dailySuccesses, onSettings }) => (
  <div style={{
    display:"flex",flexDirection:"column",alignItems:"center",
    minHeight:"100dvh",padding:"24px 20px 40px",
    background:"linear-gradient(160deg,#FFF9E6 0%,#FFF0F5 50%,#EEF6FF 100%)",
    direction:"rtl",
  }}>
    <div style={{ display:"flex",justifyContent:"flex-start",width:"100%",marginBottom:"8px" }}>
      <button onClick={onSettings} style={{
        background:"rgba(255,255,255,0.7)",border:"none",borderRadius:"50%",
        width:"42px",height:"42px",fontSize:"1.2rem",cursor:"pointer",
        boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
      }}>⚙️</button>
    </div>
    <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"6px" }}>
      <Mascot state="idle" />
      <h1 style={{
        fontSize:"2.5rem",fontWeight:900,textAlign:"center",
        fontFamily:"'Varela Round',sans-serif",
        background:"linear-gradient(90deg,#FF6B9D,#C77DFF,#4D96FF)",
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
        lineHeight:1.2,
      }}>מדברים ביחד!</h1>
      <p style={{ fontSize:"1.05rem",color:"#aaa",textAlign:"center",fontFamily:"'Varela Round',sans-serif" }}>
        🌟 בואי נתרגל מילים יפות 🌟
      </p>
    </div>
    <div style={{ width:"100%",maxWidth:"380px" }}>
      <DailyMission successCount={dailySuccesses} onStart={onStart} />
      <button onClick={onStart} style={{
        ...btn("#FF6B9D","#fff","1.45rem"),
        width:"100%",padding:"18px",
        animation:"pulse 2s ease infinite",
      }}>🚀 התחילי!</button>
    </div>
  </div>
);

// ============================================================
// 🎮 MAIN APP
// ============================================================
export default function App() {
  const [screen,          setScreen]         = useState("start");
  const [category,        setCategory]       = useState(null);
  const [items,           setItems]          = useState([]);
  const [itemIndex,       setItemIndex]      = useState(0);
  const [level,           setLevel]          = useState(1);
  const [miniStars,       setMiniStars]      = useState(0);
  const [sessProgress,    setSessProgress]   = useState(0);
  const [feedback,        setFeedback]       = useState(null);
  const [showReward,      setShowReward]     = useState(false);
  const [mascotState,     setMascotState]    = useState("idle");
  const [settings,        setSettings]       = useState(loadSettings);
  const [showSettings,    setShowSettings]   = useState(false);
  const [showVoices,      setShowVoices]     = useState(false);
  const [showDailyDone,   setShowDailyDone]  = useState(false);
  const [dailySuccesses,  setDailySuccesses] = useState(() => {
    const d = loadDaily(); return d[todayKey()] || 0;
  });

  useEffect(() => {
    // Pre-load voice list so it's ready when user first taps
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    // iOS Safari: speak a silent utterance on first user interaction to unlock audio
    // This runs once on the very first tap anywhere on the page
    const unlockAudio = () => {
      if (!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      u.lang = "he-IL";
      window.speechSynthesis.speak(u);
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("touchstart", unlockAudio, { once: true });
    document.addEventListener("click",      unlockAudio, { once: true });
    return () => {
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("click",      unlockAudio);
    };
  }, []);

  const selectCategory = (cat) => {
    setCategory(cat);
    setItems(buildSession(WORD_DATA[cat]));
    setItemIndex(0); setLevel(1); setMiniStars(0); setSessProgress(0);
    setScreen("practice");
  };

  const handleCorrect = () => setFeedback("correct");
  const handleAlmost  = () => setFeedback("almost");
  const handleRetry   = () => {
    const cur = level===1 ? items[itemIndex].word : level===2 ? items[itemIndex].level2 : items[itemIndex].level3;
    speak(`תגידי: ${cur}`);
  };

  const handleFeedbackDone = () => {
    if (feedback === "correct") {
      recordAttempt(items[itemIndex].id, true);
      const nd = dailySuccesses + 1;
      setDailySuccesses(nd);
      const d = loadDaily(); d[todayKey()] = nd; saveJSON(LS_DAILY, d);

      const nm = miniStars + 1;
      if (nm >= 3) { setShowReward(true); setMiniStars(0); } else setMiniStars(nm);

      setSessProgress(p => p + 1);

      if (nd === DAILY_GOAL) {
        setFeedback(null); setShowDailyDone(true); return;
      }

      if (level < 3) { setLevel(l => l + 1); }
      else {
        setLevel(1);
        if (itemIndex + 1 >= items.length) {
          setItems(buildSession(WORD_DATA[category])); setItemIndex(0);
        } else {
          setItemIndex(i => i + 1);
        }
      }
    } else {
      recordAttempt(items[itemIndex].id, false);
    }
    setFeedback(null);
  };

  const currentItem = items[itemIndex];

  return (
    <div style={{
      maxWidth:"480px",margin:"0 auto",minHeight:"100dvh",
      background:"linear-gradient(160deg,#FFF9E6 0%,#FFF0F5 50%,#EEF6FF 100%)",
      fontFamily:"'Varela Round',sans-serif",
    }}>
      {/* ── SCREENS ── */}
      {screen === "start" && (
        <StartScreen onStart={() => setScreen("category")} dailySuccesses={dailySuccesses} onSettings={() => setShowSettings(true)} />
      )}

      {screen === "category" && (
        <>
          <div style={{
            display:"flex",alignItems:"center",padding:"12px 14px",
            background:"rgba(255,255,255,0.82)",backdropFilter:"blur(8px)",
            borderBottom:"2px solid #FFD93D22",direction:"rtl",
            position:"sticky",top:0,zIndex:10,
          }}>
            <button onClick={() => setScreen("start")} style={{ background:"none",border:"none",fontSize:"1.25rem",cursor:"pointer",padding:"4px" }}>⬅️</button>
            <span style={{ flex:1,textAlign:"center",fontWeight:700,fontSize:"1.1rem",color:"#333" }}>מדברים ביחד</span>
            <ProgressStars count={Math.min(dailySuccesses,DAILY_GOAL)} total={DAILY_GOAL} size="1rem" />
          </div>
          <CategoryScreen onSelect={selectCategory} onSettings={() => setShowSettings(true)} dailySuccesses={dailySuccesses} />
        </>
      )}

      {screen === "practice" && currentItem && (
        <>
          <div style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"10px 14px",
            background:"rgba(255,255,255,0.85)",backdropFilter:"blur(8px)",
            borderBottom:"2px solid #FFD93D22",direction:"rtl",
            position:"sticky",top:0,zIndex:10,
          }}>
            <button onClick={() => setScreen("category")} style={{ background:"none",border:"none",fontSize:"1.2rem",cursor:"pointer" }}>⬅️</button>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontWeight:700,fontSize:"1.05rem",color:"#333" }}>{category}</div>
              <div style={{ fontSize:"0.75rem",color:"#ccc" }}>כרטיס {itemIndex+1} · רמה {level}</div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:"1px" }}>
              <ProgressStars count={miniStars} total={3} size="0.95rem" />
              <div style={{ fontSize:"0.68rem",color:"#ccc" }}>יומי {dailySuccesses}/{DAILY_GOAL}</div>
            </div>
          </div>
          <PracticeCard
            item={currentItem} level={level}
            onCorrect={handleCorrect} onAlmost={handleAlmost} onRetry={handleRetry}
            sessionProgress={sessProgress} totalItems={SESSION_SIZE}
            settings={settings} mascotState={mascotState} setMascotState={setMascotState}
          />
        </>
      )}

      {/* ── OVERLAYS ── */}
      {feedback    && <FeedbackOverlay type={feedback} onDone={handleFeedbackDone} />}
      {showDailyDone && <DailyCompleteScreen onContinue={() => setShowDailyDone(false)} />}

      {showReward && (
        <div style={{
          position:"fixed",inset:0,zIndex:700,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          background:"rgba(255,215,0,0.95)",animation:"fadeIn 0.3s ease",
        }}>
          <Confetti />
          <Mascot state="dance" />
          <div style={{ fontSize:"4.5rem",animation:"bounce 0.5s ease infinite alternate" }}>🏆</div>
          <div style={{
            fontSize:"2.2rem",fontWeight:900,color:"#7B2D00",
            fontFamily:"'Varela Round',sans-serif",textAlign:"center",
            margin:"10px 0",direction:"rtl",
          }}>איזה יופי!<br />אלופה!</div>
          <button onClick={() => setShowReward(false)} style={btn("#FF6B9D","#fff")}>המשיכי ⬅️</button>
        </div>
      )}

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSave={(s) => { setSettings(s); saveJSON(LS_SETTINGS, s); }}
          onClose={() => setShowSettings(false)}
          onVoices={() => { setShowSettings(false); setShowVoices(true); }}
        />
      )}
      {showVoices && <ParentVoicePanel onClose={() => setShowVoices(false)} />}
    </div>
  );
}

// ============================================================
// 🧩 SHARED UI COMPONENTS
// ============================================================
const BottomSheet = ({ children, onClose }) => (
  <div style={{
    position:"fixed",inset:0,zIndex:800,
    background:"rgba(0,0,0,0.45)",
    display:"flex",alignItems:"flex-end",
  }} onClick={onClose}>
    <div style={{
      width:"100%",maxWidth:"480px",margin:"0 auto",
      background:"#fff",borderRadius:"24px 24px 0 0",
      padding:"24px 20px 44px",direction:"rtl",
      maxHeight:"85dvh",overflowY:"auto",
    }} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const SheetTitle = ({ children }) => (
  <h3 style={{
    fontFamily:"'Varela Round',sans-serif",fontSize:"1.25rem",fontWeight:900,color:"#333",marginBottom:"16px",
  }}>{children}</h3>
);

const Toggle = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{
    width:"48px",height:"26px",borderRadius:"13px",flexShrink:0,
    background: on ? "#6BCB77" : "#ddd",position:"relative",cursor:"pointer",transition:"background 0.2s",
  }}>
    <div style={{
      position:"absolute",top:"3px",
      right: on ? "3px" : "19px",
      width:"20px",height:"20px",
      background:"#fff",borderRadius:"50%",
      boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"right 0.2s",
    }} />
  </div>
);

// ============================================================
// 🎨 STYLE HELPERS
// ============================================================
function btn(bg, color, fontSize = "1.15rem") {
  return {
    padding:"12px 18px", fontSize, borderRadius:"50px", border:"none",
    background: bg, color, fontWeight:700, cursor:"pointer",
    fontFamily:"'Varela Round',sans-serif",
    boxShadow:`0 4px 12px ${bg}55`,
    WebkitTapHighlightColor:"transparent",
    transition:"transform 0.1s",
    minWidth:"76px",
  };
}
function smBtn(bg, color) {
  return {
    padding:"7px 11px", fontSize:"0.88rem", borderRadius:"10px",
    border:"none", background:bg, color, fontWeight:700,
    cursor:"pointer", fontFamily:"'Varela Round',sans-serif",
  };
}
