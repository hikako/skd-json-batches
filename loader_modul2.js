async function loadFlashcardBatches(urls) {
  const responses = await Promise.all(urls.map(url => fetch(url).then(r => r.json())));
  const merged = new Map();
  for (const deck of responses) {
    for (const card of deck.cards) {
      merged.set(card.id, card);
    }
  }
  return Array.from(merged.values());
}

// Contoh pemanggilan:
// const allCards = await loadFlashcardBatches([
//   './modul2_skd_flashcard_batch01_100.json'
// ]);