/* === CONFIGURATION GÉNÉRALE === */
const algoFrenchNames = {
  "Bubble Sort": "Tri à bulles",
  "Selection Sort": "Tri par sélection",
  "Insertion Sort": "Tri par insertion",
  "Gnome Sort": "Tri gnome",
  "Cocktail Sort": "Tri cocktail",
  "Comb Sort": "Tri peigne",
  "Shell Sort": "Tri Shell",
  "Quick Sort": "Tri rapide",
  "Merge Sort": "Tri fusion",
  "Heap Sort": "Tri par tas",
  "Counting Sort": "Tri par comptage",
  "Bucket Sort": "Tri par seaux",
  "Radix Sort": "Tri par base",
  "TimSort": "Tri Timsort",
  "Introsort": "Tri introsort",
  "SmoothSort": "Tri smoothsort",
  "Stooge Sort": "Tri stooges",
  "Pancake Sort": "Tri crêpes",
};

const algorithms = [
  "Bubble Sort", "Selection Sort", "Insertion Sort", "Gnome Sort", "Cocktail Sort",
  "Comb Sort", "Shell Sort", "Quick Sort", "Merge Sort", "Heap Sort",
  "Counting Sort", "Bucket Sort", "Radix Sort",
  "Stooge Sort", "Pancake Sort"
];

let array = [];
const size = 100;
const speed = 50; // ms
let visualizers = {};

/* === GÉNÉRER UN TABLEAU ALÉATOIRE === */
function generateArray() {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  createCanvases();
}
document.getElementById("generateArray").addEventListener("click", generateArray);

/* === CRÉER LES CANVAS ET LES LIGNES DE TABLE === */
function createCanvases() {
  const container = document.getElementById("canvaContainer");
  const tableBody = document.getElementById("timeTable");
  container.innerHTML = "";
  tableBody.innerHTML = "";
  visualizers = {};

  algorithms.forEach(algo => {
    const col = document.createElement("div");
    col.className = "col-md-6";

    const title = document.createElement("h5");
    title.className = "algorithm-title";
    title.textContent = `${algo} (${algoFrenchNames[algo] || ""})`;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 200;

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "control-buttons mt-2";

    const playBtn = document.createElement("button");
    playBtn.textContent = "▶️ Lancer";
    playBtn.className = "play";

    const pauseBtn = document.createElement("button");
    pauseBtn.textContent = "⏸️ Pause";
    pauseBtn.className = "pause";

    const resumeBtn = document.createElement("button");
    resumeBtn.textContent = "🔁 Reprendre";
    resumeBtn.className = "resume";

    buttonsDiv.append(playBtn, pauseBtn, resumeBtn);
    col.append(title, canvas, buttonsDiv);
    container.appendChild(col);

    // Ligne du tableau
    const row = document.createElement("tr");
    row.innerHTML = `<td>${algo}</td><td id="time-${algo}">-</td><td>Contrôle au-dessus</td>`;
    tableBody.appendChild(row);

    visualizers[algo] = { canvas, ctx, playing: false, paused: false, speed, duration: 0 };

    playBtn.addEventListener("click", () => startAlgorithm(algo));
    pauseBtn.addEventListener("click", () => pauseAlgorithm(algo));
    resumeBtn.addEventListener("click", () => resumeAlgorithm(algo));

    drawArray(ctx, array);
  });
}

/* === DESSIN DU TABLEAU === */
function drawArray(ctx, arr, color = "#0d6efd") {
  const width = ctx.canvas.width / arr.length;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  arr.forEach((value, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i * width, ctx.canvas.height - value * 1.8, width - 1, value * 1.8);
  });
}

/* === ANIMATEUR GÉNÉRIQUE === */
async function visualizeAlgorithm(algo, sortFunc) {
    const v = visualizers[algo];
    const arr = [...array];
    const start = performance.now();

    v.playing = true;
    await sortFunc(arr, v);
    const end = performance.now();
    v.duration = formatTime(end - start);
    document.getElementById(`time-${algo}`).textContent = v.duration;

    drawArray(v.ctx, arr, "#198754");
}

/* === PAUSE / REPRISE === */
function pauseAlgorithm(algo) {
  if (visualizers[algo]) visualizers[algo].paused = true;
}
function resumeAlgorithm(algo) {
  if (visualizers[algo]) visualizers[algo].paused = false;
}
async function sleep(ms, algo) {
  const v = visualizers[algo];
  while (v && v.paused) await new Promise(r => setTimeout(r, 50));
  return new Promise(r => setTimeout(r, ms));
}

/* === ALGORITHMES === */
async function bubbleSort(arr, v) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      drawArray(v.ctx, arr);
      await sleep(v.speed, v);
    }
  }
}

async function selectionSort(arr, v) {
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) if (arr[j] < arr[min]) min = j;
    [arr[i], arr[min]] = [arr[min], arr[i]];
    drawArray(v.ctx, arr);
    await sleep(v.speed, v);
  }
}

async function insertionSort(arr, v) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      drawArray(v.ctx, arr);
      await sleep(v.speed, v);
    }
    arr[j + 1] = key;
  }
  drawArray(v.ctx, arr);
}

async function gnomeSort(arr, v) {
  let i = 0;
  while (i < arr.length) {
    if (i === 0 || arr[i] >= arr[i - 1]) i++;
    else {
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      i--;
    }
    drawArray(v.ctx, arr);
    await sleep(v.speed, v);
  }
}

/* === TRI RAPIDE (QuickSort) === */
async function quickSort(arr, v, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = await partition(arr, v, low, high);
    await quickSort(arr, v, low, pi - 1);
    await quickSort(arr, v, pi + 1, high);
  }
}
/* === MERGE SORT === */
async function mergeSort(arr, v) {
  async function merge(l, m, r) {
    let L = arr.slice(l, m + 1);
    let R = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < L.length && j < R.length) {
      if (L[i] <= R[j]) arr[k++] = L[i++];
      else arr[k++] = R[j++];
      drawArray(v.ctx, arr);
      await sleep(v.speed, v);
    }
    while (i < L.length) { arr[k++] = L[i++]; drawArray(v.ctx, arr); await sleep(v.speed, v); }
    while (j < R.length) { arr[k++] = R[j++]; drawArray(v.ctx, arr); await sleep(v.speed, v); }
  }

  async function ms(l, r) {
    if (l >= r) return;
    let m = Math.floor((l + r) / 2);
    await ms(l, m);
    await ms(m + 1, r);
    await merge(l, m, r);
  }
  await ms(0, arr.length - 1);
}

/* === HEAP SORT === */
async function heapSort(arr, v) {
  function heapify(n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      drawArray(v.ctx, arr);
      return heapify(n, largest);
    }
  }

  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  for (let i = n - 1; i >= 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    drawArray(v.ctx, arr);
    await sleep(v.speed, v);
    heapify(i, 0);
  }
}

/* === SHELL SORT === */
async function shellSort(arr, v) {
  let n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i], j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
        drawArray(v.ctx, arr);
        await sleep(v.speed, v);
      }
      arr[j] = temp;
      drawArray(v.ctx, arr);
      await sleep(v.speed, v);
    }
  }
}

/* === COMB SORT === */
async function combSort(arr, v) {
  let gap = arr.length;
  const shrink = 1.3;
  let sorted = false;
  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) { gap = 1; sorted = true; }
    for (let i = 0; i + gap < arr.length; i++) {
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        drawArray(v.ctx, arr);
        sorted = false;
        await sleep(v.speed, v);
      }
    }
  }
}

/* === COCKTAIL SORT === */
async function cocktailSort(arr, v) {
  let swapped = true;
  let start = 0, end = arr.length - 1;
  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        drawArray(v.ctx, arr);
        swapped = true;
        await sleep(v.speed, v);
      }
    }
    if (!swapped) break;
    swapped = false;
    end--;
    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        drawArray(v.ctx, arr);
        swapped = true;
        await sleep(v.speed, v);
      }
    }
    start++;
  }
}

/* === COUNTING SORT === */
async function countingSort(arr, v) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const count = Array(max - min + 1).fill(0);
  arr.forEach(val => count[val - min]++);
  let idx = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i]-- > 0) {
      arr[idx++] = i + min;
      drawArray(v.ctx, arr);
      await sleep(v.speed, v);
    }
  }
}

/* === RADIX SORT === */
async function radixSort(arr, v) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = Array(arr.length).fill(0);
    const count = Array(10).fill(0);
    arr.forEach(num => count[Math.floor(num / exp) % 10]++);
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
      const d = Math.floor(arr[i] / exp) % 10;
      output[--count[d]] = arr[i];
    }
    for (let i = 0; i < arr.length; i++) arr[i] = output[i];
    drawArray(v.ctx, arr);
    await sleep(v.speed, v);
  }
}

/* === BUCKET SORT === */
async function bucketSort(arr, v) {
  const n = arr.length;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const bucketCount = Math.floor(Math.sqrt(n)) || 1;
  const buckets = Array.from({ length: bucketCount }, () => []);
  arr.forEach(val => {
    const idx = Math.floor((val - min) / (max - min + 1) * bucketCount);
    buckets[Math.min(idx, bucketCount - 1)].push(val);
  });
  let idx = 0;
  for (const b of buckets) {
    b.sort((a, b) => a - b);
    for (const val of b) {
      arr[idx++] = val;
      drawArray(v.ctx, arr);
      await sleep(v.speed, v);
    }
  }
}

/* === TIMSORT / INTROSORT / SMOOTHSORT (simplifiés) === */
async function simpleSort(arr, v) {
  arr.sort((a, b) => a - b);
  drawArray(v.ctx, arr, "#198754");
}

/* === STOOGE SORT === */
async function stoogeSort(arr, v, l = 0, h = arr.length - 1) {
  if (arr[l] > arr[h]) { [arr[l], arr[h]] = [arr[h], arr[l]]; drawArray(v.ctx, arr); await sleep(v.speed, v); }
  if (h - l + 1 > 2) {
    const t = Math.floor((h - l + 1) / 3);
    await stoogeSort(arr, v, l, h - t);
    await stoogeSort(arr, v, l + t, h);
    await stoogeSort(arr, v, l, h - t);
  }
}

/* === PANCAKE SORT === */
async function pancakeSort(arr, v) {
  const flip = async (i) => {
    let start = 0;
    while (start < i) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      start++; i--;
      drawArray(v.ctx, arr); await sleep(v.speed, v);
    }
  };
  for (let currSize = arr.length; currSize > 1; currSize--) {
    let mi = 0;
    for (let i = 0; i < currSize; i++) if (arr[i] > arr[mi]) mi = i;
    if (mi != currSize - 1) { await flip(mi); await flip(currSize - 1); }
  }
}

/* === BITONIC SORT === */
async function partition(arr, v, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      drawArray(v.ctx, arr);
      await sleep(v.speed, v);
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

/* === PLACEHOLDERS POUR AUTRES ALGORITHMES === */
async function simpleSort(arr, v) {
  arr.sort((a, b) => a - b);
  drawArray(v.ctx, arr, "#198754");
}

/* === LANCEMENT === */
/* === LANCEMENT DE CHAQUE ALGORITHME === */
function startAlgorithm(algo) {
  if (!visualizers[algo] || visualizers[algo].playing) return;

  switch (algo) {
    case "Bubble Sort":
      visualizeAlgorithm(algo, bubbleSort);
      break;
    case "Selection Sort":
      visualizeAlgorithm(algo, selectionSort);
      break;
    case "Insertion Sort":
      visualizeAlgorithm(algo, insertionSort);
      break;
    case "Gnome Sort":
      visualizeAlgorithm(algo, gnomeSort);
      break;
    case "Cocktail Sort":
      visualizeAlgorithm(algo, cocktailSort);
      break;
    case "Comb Sort":
      visualizeAlgorithm(algo, combSort);
      break;
    case "Shell Sort":
      visualizeAlgorithm(algo, shellSort);
      break;
    case "Quick Sort":
      visualizeAlgorithm(algo, quickSort);
      break;
    case "Merge Sort":
      visualizeAlgorithm(algo, mergeSort);
      break;
    case "Heap Sort":
      visualizeAlgorithm(algo, heapSort);
      break;
    case "Counting Sort":
      visualizeAlgorithm(algo, countingSort);
      break;
    case "Bucket Sort":
      visualizeAlgorithm(algo, bucketSort);
      break;
    case "Radix Sort":
      visualizeAlgorithm(algo, radixSort);
      break;
    case "Stooge Sort":
      visualizeAlgorithm(algo, stoogeSort);
      break;
    case "Pancake Sort":
      visualizeAlgorithm(algo, pancakeSort);
      break;
    case "Bitonic Sort":
      visualizeAlgorithm(algo, bitonicSort);
      break;
    default:
      console.warn(`Algorithme ${algo} non reconnu !`);
      break;
  }
}
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor(ms % 1000);
  
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const mmm = String(milliseconds).padStart(3, '0');
  
  return `${mm}:${ss}.${mmm}`;
}


/* === CONTRÔLES GLOBAUX === */
document.getElementById("startAll").addEventListener("click", () => {
  algorithms.forEach(a => startAlgorithm(a));
});
document.getElementById("pauseAll").addEventListener("click", () => {
  algorithms.forEach(a => pauseAlgorithm(a));
});
document.getElementById("resumeAll").addEventListener("click", () => {
  algorithms.forEach(a => resumeAlgorithm(a));
});

/* === INITIALISATION === */
generateArray();
