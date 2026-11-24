async function loadDiagnosticBatches(urls) {
  const responses = await Promise.all(urls.map(url => fetch(url).then(r => r.json())));
  return responses.flatMap(batch => batch.questions);
}

// Contoh pemanggilan saat batch berikutnya ditambahkan:
// const allQuestions = await loadDiagnosticBatches([
//   './modul1_skd_diagnostik_batch01_100.json',
//   './modul1_skd_diagnostik_batch02_100.json'
// ]);