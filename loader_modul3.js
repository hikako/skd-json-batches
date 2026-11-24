async function loadCheatSheets(url, builtInSheets = []) {
  const map = new Map(builtInSheets.map(s => [s.subtopicId, s]));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gagal memuat cheat sheet: ${res.status}`);
  const data = await res.json();
  for (const sheet of data.sheets) {
    map.set(sheet.subtopicId, sheet);
  }
  return Array.from(map.values());
}

// Contoh pemanggilan:
// const sheets = await loadCheatSheets('./modul3_skd_cheatsheet_19subbab.json');