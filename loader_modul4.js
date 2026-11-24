// 1. Mode Hitung Cepat TIU (Prosedural)
const tiuDrill = window.TIUProceduralGenerator.generateSession({
  count: 20,
  category: 'mixed', // 'aritmatika' | 'pecahan_persen' | 'deret' | 'perbandingan_kuantitatif' | 'soal_cerita' | 'mixed'
  difficulty: 'medium' // 'easy' | 'medium' | 'hard'
});

// 2. Mode Eliminasi Cepat TWK/TKP & Mode Simulasi Tempo (Gabungan)
async function buildDrillSession(jsonUrls, { tiuCount = 10, twkCount = 10, tkpCount = 10, difficulty = 'medium' } = {}) {
  const batches = await Promise.all(jsonUrls.map(u => fetch(u).then(r => r.json())));
  const pool = batches.flatMap(b => b.questions);

  const pickRandom = (arr, n) => arr.slice().sort(() => Math.random() - 0.5).slice(0, n);
  const twk = pickRandom(pool.filter(q => q.category === 'TWK'), twkCount);
  const tkp = pickRandom(pool.filter(q => q.category === 'TKP'), tkpCount);
  const tiu = window.TIUProceduralGenerator.generateSession({ count: tiuCount, category: 'mixed', difficulty });

  return [...twk, ...tiu, ...tkp];
}