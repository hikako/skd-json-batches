/**
 * Modul 4: Generator Soal Prosedural Hitung Cepat TIU (CPNS SKD)
 * Tanpa dependensi eksternal — dapat langsung ditempel ke tag <script> single-file HTML
 * atau diimpor sebagai modul CommonJS.
 *
 * Kategori didukung:
 * 1. 'aritmatika'               -> subtopic: 'tiu_numerik_berhitung'
 * 2. 'pecahan_persen'           -> subtopic: 'tiu_numerik_berhitung'
 * 3. 'deret'                    -> subtopic: 'tiu_numerik_deret'
 * 4. 'perbandingan_kuantitatif' -> subtopic: 'tiu_numerik_perbandingan'
 * 5. 'soal_cerita'              -> subtopic: 'tiu_numerik_cerita'
 * 6. 'mixed'                    -> acak dari seluruh kategori
 *
 * Tingkat kesulitan: 'easy' | 'medium' | 'hard'
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TIUProceduralGenerator = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let seqCounter = 0;

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function formatIDNumber(num) {
    if (Number.isInteger(num)) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    const fixed = Number(num.toFixed(2));
    const parts = fixed.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.length > 1 ? parts[0] + ',' + parts[1] : parts[0];
  }

  function buildNumericDistractors(answer, isDecimal = false, allowNegative = false) {
    const set = new Set();
    const deltas = isDecimal
      ? [-2, -1, -0.5, 0.5, 1, 2, -1.5, 1.5, -10, 10]
      : [-1, 1, -2, 2, -5, 5, -10, 10, -20, 20, -4, 4, -8, 8];

    const shuffledDeltas = shuffle(deltas);
    for (const d of shuffledDeltas) {
      if (set.size >= 4) break;
      const cand = isDecimal ? Number((answer + d).toFixed(2)) : answer + d;
      if (cand === answer) continue;
      if (!allowNegative && cand < 0) continue;
      set.add(cand);
    }

    let step = 1;
    while (set.size < 4) {
      const cand = answer + step * 3;
      if (cand !== answer && (allowNegative || cand >= 0)) set.add(cand);
      step++;
    }
    return Array.from(set).slice(0, 4);
  }

  function formatQuestionObj(subtopic, questionText, correctText, distractorTexts, explanationText) {
    seqCounter += 1;
    const uniqueDistractors = [];
    for (const d of distractorTexts) {
      if (d !== correctText && !uniqueDistractors.includes(d)) {
        uniqueDistractors.push(d);
      }
    }
    const combined = shuffle([
      { text: correctText, points: 5 },
      ...uniqueDistractors.slice(0, 4).map(t => ({ text: t, points: 0 }))
    ]);
    const keys = ['A', 'B', 'C', 'D', 'E'];
    const options = combined.map((item, idx) => ({
      key: keys[idx],
      text: item.text,
      points: item.points
    }));
    const correctKey = options.find(o => o.points === 5).key;
    return {
      id: `tiu_proc_${Date.now()}_${seqCounter}`,
      category: 'TIU',
      subtopic,
      question: questionText,
      options,
      explanation: `Jawaban benar: ${correctKey}. ${explanationText}`
    };
  }

  // 1. ARITMATIKA & OPERASI CAMPURAN
  function genAritmatika(difficulty) {
    if (difficulty === 'easy') {
      const a = randInt(12, 45);
      const b = randInt(6, 15);
      const c = randInt(15, 60);
      const ans = a * b + c;
      const dist = buildNumericDistractors(ans).map(formatIDNumber);
      return formatQuestionObj(
        'tiu_numerik_berhitung',
        `Hasil dari (${a} × ${b}) + ${c} adalah...`,
        formatIDNumber(ans),
        dist,
        `${a} × ${b} = ${formatIDNumber(a * b)}, lalu ${formatIDNumber(a * b)} + ${c} = ${formatIDNumber(ans)}.`
      );
    }

    if (difficulty === 'medium') {
      const variant = randInt(1, 2);
      if (variant === 1) {
        const a = randInt(16, 65);
        const targetSum = pick([50, 100, 150, 200]);
        const b = randInt(13, targetSum - 13);
        const c = targetSum - b;
        const ans = a * targetSum;
        const dist = [ans - a, ans + a, ans - 100, ans + 100].map(formatIDNumber);
        return formatQuestionObj(
          'tiu_numerik_berhitung',
          `Hasil dari (${a} × ${b}) + (${a} × ${c}) adalah...`,
          formatIDNumber(ans),
          dist,
          `Gunakan sifat distributif: ${a} × (${b} + ${c}) = ${a} × ${targetSum} = ${formatIDNumber(ans)}.`
        );
      } else {
        const n = randInt(12, 35);
        const diff = randInt(4, 14);
        const m = n + diff;
        const ans = m + n;
        const dist = buildNumericDistractors(ans).map(formatIDNumber);
        return formatQuestionObj(
          'tiu_numerik_berhitung',
          `Nilai dari (${m}² - ${n}²) ÷ (${m} - ${n}) adalah...`,
          formatIDNumber(ans),
          dist,
          `Gunakan identitas (a² - b²) ÷ (a - b) = a + b. Maka ${m} + ${n} = ${formatIDNumber(ans)}.`
        );
      }
    }

    const diff = pick([2, 4, 6, 8]);
    const b = randInt(21, 45);
    const a = b + diff;
    const c = randInt(12, 25);
    const d = randInt(5, 12);
    const sqDiff = (a + b) * (a - b);
    const ans = sqDiff - (c * d);
    const dist = buildNumericDistractors(ans, false, true).map(formatIDNumber);
    return formatQuestionObj(
      'tiu_numerik_berhitung',
      `Hasil dari (${a}² - ${b}²) - (${c} × ${d}) adalah...`,
      formatIDNumber(ans),
      dist,
      `${a}² - ${b}² = (${a} + ${b})(${a} - ${b}) = ${a + b} × ${diff} = ${formatIDNumber(sqDiff)}. Lalu ${c} × ${d} = ${formatIDNumber(c * d)}. Hasil akhir = ${formatIDNumber(sqDiff)} - ${formatIDNumber(c * d)} = ${formatIDNumber(ans)}.`
    );
  }

  // 2. PECAHAN & PERSENTASE ISTIMEWA
  function genPecahanPersen(difficulty) {
    const specialFractions = [
      { label: '12,5%', num: 1, den: 8 },
      { label: '25%', num: 1, den: 4 },
      { label: '37,5%', num: 3, den: 8 },
      { label: '62,5%', num: 5, den: 8 },
      { label: '75%', num: 3, den: 4 },
      { label: '87,5%', num: 7, den: 8 },
      { label: '20%', num: 1, den: 5 },
      { label: '40%', num: 2, den: 5 },
      { label: '60%', num: 3, den: 5 },
      { label: '80%', num: 4, den: 5 }
    ];

    if (difficulty === 'easy') {
      const f = pick(specialFractions);
      const mult = randInt(5, 40) * 2;
      const base = f.den * mult;
      const ans = f.num * mult;
      const dist = buildNumericDistractors(ans).map(formatIDNumber);
      return formatQuestionObj(
        'tiu_numerik_berhitung',
        `Nilai dari ${f.label} × ${formatIDNumber(base)} adalah...`,
        formatIDNumber(ans),
        dist,
        `Konversi pecahan istimewa: ${f.label} = ${f.num}/${f.den}. Maka (${f.num}/${f.den}) × ${formatIDNumber(base)} = ${formatIDNumber(ans)}.`
      );
    }

    if (difficulty === 'medium') {
      const f1 = pick(specialFractions);
      const f2 = pick(specialFractions);
      const m1 = randInt(10, 40);
      const m2 = randInt(5, 25);
      const b1 = f1.den * m1;
      const b2 = f2.den * m2;
      const v1 = f1.num * m1;
      const v2 = f2.num * m2;
      const ans = v1 + v2;
      const dist = buildNumericDistractors(ans).map(formatIDNumber);
      return formatQuestionObj(
        'tiu_numerik_berhitung',
        `Hasil dari (${f1.label} × ${formatIDNumber(b1)}) + (${f2.label} × ${formatIDNumber(b2)}) adalah...`,
        formatIDNumber(ans),
        dist,
        `${f1.label} × ${formatIDNumber(b1)} = ${formatIDNumber(v1)}, dan ${f2.label} × ${formatIDNumber(b2)} = ${formatIDNumber(v2)}. Total = ${formatIDNumber(ans)}.`
      );
    }

    const d1 = pick([10, 15, 20, 25, 30]);
    const d2 = pick([10, 20]);
    const price = pick([200000, 250000, 400000, 500000, 800000]);
    const after1 = price * (100 - d1) / 100;
    const ans = after1 * (100 - d2) / 100;
    const trapNaive = price * (100 - d1 - d2) / 100;
    const rawDist = [trapNaive, ans + 10000, ans - 10000, ans + 20000, ans - 20000]
      .filter((v, i, a) => v > 0 && v !== ans && a.indexOf(v) === i)
      .slice(0, 4);
    const totalDisc = d1 + d2 - (d1 * d2) / 100;
    return formatQuestionObj(
      'tiu_numerik_berhitung',
      `Sebuah barang seharga Rp${formatIDNumber(price)} mendapat diskon bertingkat ${d1}% + ${d2}%. Berapa harga yang harus dibayar?`,
      `Rp${formatIDNumber(ans)}`,
      rawDist.map(v => `Rp${formatIDNumber(v)}`),
      `Diskon efektif = ${d1} + ${d2} - (${d1}×${d2}/100) = ${formatIDNumber(totalDisc)}%. Harga bayar = Rp${formatIDNumber(price)} × ${(100 - d1) / 100} × ${(100 - d2) / 100} = Rp${formatIDNumber(ans)}.`
    );
  }

  // 3. DERET ANGKA
  function genDeret(difficulty) {
    if (difficulty === 'easy') {
      const start = randInt(3, 25);
      const step0 = randInt(2, 7);
      const inc = pick([0, 2, 3]);
      const seq = [start];
      for (let i = 0; i < 5; i++) {
        seq.push(seq[seq.length - 1] + step0 + i * inc);
      }
      const shown = seq.slice(0, 5);
      const ans = seq[5];
      const dist = buildNumericDistractors(ans).map(formatIDNumber);
      const exp = inc === 0
        ? `Deret aritmatika dengan beda tetap +${step0}. Suku berikutnya = ${shown[4]} + ${step0} = ${ans}.`
        : `Deret bertingkat dengan selisih +${step0}, +${step0 + inc}, +${step0 + 2 * inc}, +${step0 + 3 * inc}, +${step0 + 4 * inc}. Suku berikutnya = ${shown[4]} + ${step0 + 4 * inc} = ${ans}.`;
      return formatQuestionObj(
        'tiu_numerik_deret',
        `Lanjutan dari deret angka: ${shown.join(', ')}, ... adalah...`,
        formatIDNumber(ans),
        dist,
        exp
      );
    }

    if (difficulty === 'medium') {
      const start = randInt(2, 9);
      const k = randInt(1, 5);
      const isAdd = pick([true, false]);
      const seq = [start];
      for (let i = 0; i < 6; i++) {
        const prev = seq[seq.length - 1];
        if (i % 2 === 0) {
          seq.push(prev * 2);
        } else {
          seq.push(isAdd ? prev + k : prev - k);
        }
      }
      const shown = seq.slice(0, 6);
      const ans = seq[6];
      const dist = buildNumericDistractors(ans).map(formatIDNumber);
      const opLabel = isAdd ? `+${k}` : `-${k}`;
      return formatQuestionObj(
        'tiu_numerik_deret',
        `Angka berikutnya pada deret: ${shown.join(', ')}, ... adalah...`,
        formatIDNumber(ans),
        dist,
        `Pola bergantian ×2 lalu ${opLabel}. Karena suku terakhir hasil ${opLabel}, suku berikutnya = ${shown[5]} × 2 = ${ans}.`
      );
    }

    const a1 = randInt(2, 8);
    const r1 = pick([2, 3]);
    const b1 = randInt(30, 70);
    const d2 = randInt(3, 8);
    const seq = [];
    for (let i = 0; i < 4; i++) {
      seq.push(a1 * Math.pow(r1, i));
      seq.push(b1 - i * d2);
    }
    const shown = seq.slice(0, 6);
    const ans1 = seq[6];
    const ans2 = seq[7];
    const correctText = `${formatIDNumber(ans1)} dan ${formatIDNumber(ans2)}`;
    const dist = [
      `${formatIDNumber(ans1)} dan ${formatIDNumber(ans2 - d2)}`,
      `${formatIDNumber(ans1)} dan ${formatIDNumber(ans2 + d2)}`,
      `${formatIDNumber(ans1 + a1)} dan ${formatIDNumber(ans2)}`,
      `${formatIDNumber(ans1 - r1)} dan ${formatIDNumber(ans2 + 1)}`
    ];
    return formatQuestionObj(
      'tiu_numerik_deret',
      `Dua angka berikutnya dari deret: ${shown.join(', ')}, ..., ... adalah...`,
      correctText,
      dist,
      `Deret dua larik: larik ganjil (×${r1}) menghasilkan ${formatIDNumber(ans1)}, dan larik genap (-${d2}) menghasilkan ${formatIDNumber(ans2)}.`
    );
  }

  // 4. PERBANDINGAN KUANTITATIF (X vs Y)
  function genPerbandinganKuantitatif(difficulty) {
    const stdChoices = [
      'X > Y',
      'X < Y',
      'X = Y',
      'X = 2Y',
      'Hubungan X dan Y tidak dapat ditentukan'
    ];

    if (difficulty === 'easy') {
      const b = pick([5, 6, 7, 8, 9, 11]);
      const a = randInt(2, b - 1);
      const d = pick([5, 6, 7, 8, 9, 11].filter(v => v !== b));
      const c = randInt(2, d - 1);
      const left = a * d;
      const right = c * b;
      const correct = left > right ? 'X > Y' : (left < right ? 'X < Y' : 'X = Y');
      const dist = stdChoices.filter(o => o !== correct);
      return formatQuestionObj(
        'tiu_numerik_perbandingan',
        `Jika X = ${a}/${b} dan Y = ${c}/${d}, maka hubungan antara X dan Y adalah...`,
        correct,
        dist,
        `Perkalian silang: ${a} × ${d} = ${left} (kiri) vs ${c} × ${b} = ${right} (kanan). Maka ${correct}.`
      );
    }

    if (difficulty === 'medium') {
      if (randInt(0, 1) === 0) {
        const xVal = randInt(4, 15);
        const yVal = randInt(4, 15);
        const k1 = randInt(2, 5);
        const c1 = randInt(3, 12);
        const r1 = k1 * xVal + c1;
        const k2 = randInt(2, 5);
        const c2 = randInt(2, 10);
        const r2 = k2 * yVal - c2;
        const correct = xVal > yVal ? 'X > Y' : (xVal < yVal ? 'X < Y' : 'X = Y');
        const dist = stdChoices.filter(o => o !== correct);
        return formatQuestionObj(
          'tiu_numerik_perbandingan',
          `Diketahui ${k1}X + ${c1} = ${r1} dan ${k2}Y - ${c2} = ${r2}. Hubungan antara X dan Y adalah...`,
          correct,
          dist,
          `Dari persamaan pertama diperoleh X = ${xVal}, dan dari persamaan kedua diperoleh Y = ${yVal}. Maka ${correct}.`
        );
      } else {
        const p = pick([16, 18, 24, 32, 36]);
        const q = pick([25, 50, 75]);
        const correct = 'X = Y';
        const dist = stdChoices.filter(o => o !== correct);
        return formatQuestionObj(
          'tiu_numerik_perbandingan',
          `Jika X = ${p}% dari ${q} dan Y = ${q}% dari ${p}, maka hubungan antara X dan Y adalah...`,
          correct,
          dist,
          `Sifat simetri persentase: a% × b selalu sama dengan b% × a. Maka X = Y.`
        );
      }
    }

    if (randInt(0, 1) === 0) {
      const k = randInt(4, 12);
      const correct = 'Hubungan X dan Y tidak dapat ditentukan';
      const dist = stdChoices.filter(o => o !== correct);
      return formatQuestionObj(
        'tiu_numerik_perbandingan',
        `Diketahui X² = ${k * k} dan Y = ${k}. Hubungan antara X dan Y yang paling tepat adalah...`,
        correct,
        dist,
        `Dari X² = ${k * k}, nilai X dapat bernilai +${k} (sehingga X = Y) atau -${k} (sehingga X < Y). Karena ada dua hubungan berbeda, hubungan X dan Y tidak dapat ditentukan.`
      );
    } else {
      const v1 = pick([40, 60]);
      const v2 = v1 === 40 ? 60 : 90;
      const vAvg = (2 * v1 * v2) / (v1 + v2);
      const yVal = (v1 + v2) / 2;
      const correct = 'X < Y';
      const dist = stdChoices.filter(o => o !== correct);
      return formatQuestionObj(
        'tiu_numerik_perbandingan',
        `Sebuah mobil pergi dari Kota A ke B dengan kecepatan ${v1} km/jam lalu pulang lewat rute sama dengan kecepatan ${v2} km/jam. Jika X adalah kecepatan rata-rata pulang-pergi (km/jam) dan Y = ${yVal}, maka hubungan X dan Y adalah...`,
        correct,
        dist,
        `Kecepatan rata-rata PP = (2 × ${v1} × ${v2}) / (${v1} + ${v2}) = ${vAvg} km/jam. Karena ${vAvg} < ${yVal}, maka X < Y.`
      );
    }
  }

  // 5. PERBANDINGAN SENILAI & BERBALIK NILAI (SOAL CERITA PENDEK)
  function genSoalCerita(difficulty) {
    if (difficulty === 'easy') {
      const units1 = randInt(3, 8);
      const perUnit = randInt(4, 12) * 5;
      const total1 = units1 * perUnit;
      const units2 = units1 + randInt(3, 7);
      const ans = units2 * perUnit;
      const dist = buildNumericDistractors(ans).map(v => `${formatIDNumber(v)} lembar`);
      return formatQuestionObj(
        'tiu_numerik_cerita',
        `Sebanyak ${units1} printer identik mencetak ${formatIDNumber(total1)} lembar dokumen dalam 1 jam. Berapa lembar yang dicetak ${units2} printer identik dalam waktu yang sama?`,
        `${formatIDNumber(ans)} lembar`,
        dist,
        `Perbandingan senilai: 1 printer = ${formatIDNumber(total1)} ÷ ${units1} = ${perUnit} lembar/jam. Untuk ${units2} printer = ${units2} × ${perUnit} = ${formatIDNumber(ans)} lembar.`
      );
    }

    if (difficulty === 'medium') {
      const pairs = [
        { d1: 24, w1: 15, d2: 18 },
        { d1: 30, w1: 12, d2: 20 },
        { d1: 20, w1: 18, d2: 15 },
        { d1: 28, w1: 15, d2: 21 },
        { d1: 36, w1: 10, d2: 24 }
      ];
      const p = pick(pairs);
      const totalNew = (p.d1 * p.w1) / p.d2;
      const added = totalNew - p.w1;
      const rawDist = [added - 1, added + 1, added + 2, totalNew]
        .filter((v, i, a) => v > 0 && v !== added && a.indexOf(v) === i);
      return formatQuestionObj(
        'tiu_numerik_cerita',
        `Suatu pekerjaan direncanakan selesai dalam ${p.d1} hari oleh ${p.w1} pekerja. Jika pekerjaan ingin dipercepat selesai dalam ${p.d2} hari, berapa jumlah TAMBAHAN pekerja yang diperlukan?`,
        `${added} pekerja`,
        rawDist.map(v => `${v} pekerja`),
        `Perbandingan berbalik nilai: ${p.d1} × ${p.w1} = ${p.d2} × N -> N = ${totalNew} pekerja total. Tambahan pekerja = ${totalNew} - ${p.w1} = ${added} pekerja.`
      );
    }

    const scenarios = [
      { w: 20, target: 30, done: 10, stop: 4 },
      { w: 24, target: 40, done: 16, stop: 6 },
      { w: 18, target: 30, done: 12, stop: 6 },
      { w: 15, target: 25, done: 5, stop: 5 },
      { w: 16, target: 30, done: 10, stop: 4 }
    ];
    // Verify last scenario: 16*4 / (30-10-4) = 64 / 16 = 4 (exact integer!)
    const s = pick(scenarios);
    const remEffective = s.target - s.done - s.stop;
    const added = (s.w * s.stop) / remEffective;
    const rawDist = [added - 1, added + 1, added + 2, s.w + added]
      .filter((v, i, a) => v > 0 && v !== added && a.indexOf(v) === i);
    return formatQuestionObj(
      'tiu_numerik_cerita',
      `Sebuah proyek ditargetkan selesai dalam ${s.target} hari oleh ${s.w} pekerja. Setelah berjalan ${s.done} hari, pekerjaan terhenti selama ${s.stop} hari. Agar proyek tetap selesai tepat waktu, berapa tambahan pekerja yang dibutuhkan?`,
      `${added} pekerja`,
      rawDist.map(v => `${v} pekerja`),
      `Sisa hari efektif = ${s.target} - ${s.done} - ${s.stop} = ${remEffective} hari. Tambahan pekerja = (${s.w} × ${s.stop}) ÷ ${remEffective} = ${added} pekerja.`
    );
  }

  function generateQuestion(category = 'mixed', difficulty = 'medium') {
    const validDiff = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';
    const generators = {
      aritmatika: genAritmatika,
      pecahan_persen: genPecahanPersen,
      deret: genDeret,
      perbandingan_kuantitatif: genPerbandinganKuantitatif,
      soal_cerita: genSoalCerita
    };
    const keys = Object.keys(generators);
    const chosen = category === 'mixed' || !generators[category] ? pick(keys) : category;
    return generators[chosen](validDiff);
  }

  function generateSession({ count = 20, category = 'mixed', difficulty = 'medium' } = {}) {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(generateQuestion(category, difficulty));
    }
    return list;
  }

  return {
    version: '2026.1',
    categories: ['aritmatika', 'pecahan_persen', 'deret', 'perbandingan_kuantitatif', 'soal_cerita', 'mixed'],
    difficulties: ['easy', 'medium', 'hard'],
    generateQuestion,
    generateSession
  };
}));
