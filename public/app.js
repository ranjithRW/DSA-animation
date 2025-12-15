const algorithmSelect = document.getElementById("algorithm");
const arrayInput = document.getElementById("arrayInput");
const targetInput = document.getElementById("targetInput");
const targetField = document.getElementById("targetField");
const speedInput = document.getElementById("speed");
const speedLabel = document.getElementById("speedLabel");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const barsEl = document.getElementById("bars");
const noteEl = document.getElementById("note");
const statusChip = document.getElementById("statusChip");
const stepMeta = document.getElementById("stepMeta");
const explainBtn = document.getElementById("explainBtn");
const explanationEl = document.getElementById("explanation");

let steps = [];
let stepIndex = 0;
let timer = null;
let speed = Number(speedInput.value);

const setStatus = (text, color = "var(--accent)") => {
  statusChip.textContent = text;
  statusChip.style.color = color;
};

const parseArray = () =>
  arrayInput.value
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => !Number.isNaN(v));

const algorithms = {
  bubble: { label: "Bubble Sort", type: "sort", fn: bubbleSort },
  insertion: { label: "Insertion Sort", type: "sort", fn: insertionSort },
  selection: { label: "Selection Sort", type: "sort", fn: selectionSort },
  quick: { label: "Quick Sort", type: "sort", fn: quickSort },
  merge: { label: "Merge Sort", type: "sort", fn: mergeSort },
  linear: { label: "Linear Search", type: "search", fn: linearSearch },
  binary: { label: "Binary Search", type: "search", fn: binarySearch },
};

function bubbleSort(arr) {
  const a = [...arr];
  const s = [{ array: [...a], note: "Starting Bubble Sort", highlights: {} }];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      s.push({
        array: [...a],
        note: `Compare ${a[j]} and ${a[j + 1]}`,
        highlights: { compare: [j, j + 1] },
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        s.push({
          array: [...a],
          note: `Swap ${a[j]} and ${a[j + 1]}`,
          highlights: { swap: [j, j + 1] },
        });
      }
    }
  }
  s.push({ array: [...a], note: "Array sorted", highlights: {} });
  return s;
}

function insertionSort(arr) {
  const a = [...arr];
  const s = [{ array: [...a], note: "Starting Insertion Sort", highlights: {} }];
  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;
    s.push({ array: [...a], note: `Pick ${key}`, highlights: { compare: [i] } });
    while (j >= 0 && a[j] > key) {
      s.push({ array: [...a], note: `Shift ${a[j]} right`, highlights: { swap: [j, j + 1] } });
      a[j + 1] = a[j];
      j -= 1;
    }
    a[j + 1] = key;
    s.push({ array: [...a], note: `Insert ${key} at position ${j + 1}`, highlights: { compare: [j + 1] } });
  }
  s.push({ array: [...a], note: "Array sorted", highlights: {} });
  return s;
}

function selectionSort(arr) {
  const a = [...arr];
  const s = [{ array: [...a], note: "Starting Selection Sort", highlights: {} }];
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      s.push({ array: [...a], note: `Compare ${a[min]} and ${a[j]}`, highlights: { compare: [min, j] } });
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      s.push({ array: [...a], note: `Swap into position ${i}`, highlights: { swap: [i, min] } });
    }
  }
  s.push({ array: [...a], note: "Array sorted", highlights: {} });
  return s;
}

function quickSort(arr) {
  const a = [...arr];
  const s = [];

  const partition = (low, high) => {
    const pivot = a[high];
    let i = low - 1;
    s.push({ array: [...a], note: `Pivot ${pivot}`, highlights: { pivot: high } });
    for (let j = low; j < high; j++) {
      s.push({ array: [...a], note: `Compare ${a[j]} <= ${pivot}`, highlights: { compare: [j, high] } });
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        s.push({ array: [...a], note: `Swap ${a[i]} forward`, highlights: { swap: [i, j], pivot: high } });
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    s.push({ array: [...a], note: "Place pivot", highlights: { swap: [i + 1, high] } });
    return i + 1;
  };

  const sort = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  };

  s.push({ array: [...a], note: "Starting Quick Sort", highlights: {} });
  sort(0, a.length - 1);
  s.push({ array: [...a], note: "Array sorted", highlights: {} });
  return s;
}

function mergeSort(arr) {
  const a = [...arr];
  const s = [{ array: [...a], note: "Starting Merge Sort", highlights: {} }];

  const merge = (left, mid, right) => {
    const leftArr = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);
    let i = 0,
      j = 0,
      k = left;
    while (i < leftArr.length && j < rightArr.length) {
      const compareIdx = [k, left + i, mid + 1 + j].filter((v) => v < a.length);
      s.push({ array: [...a], note: `Compare ${leftArr[i]} and ${rightArr[j]}`, highlights: { compare: compareIdx } });
      if (leftArr[i] <= rightArr[j]) {
        a[k] = leftArr[i];
        i++;
      } else {
        a[k] = rightArr[j];
        j++;
      }
      s.push({ array: [...a], note: `Place ${a[k]} at ${k}`, highlights: { swap: [k] } });
      k++;
    }
    while (i < leftArr.length) {
      a[k] = leftArr[i];
      s.push({ array: [...a], note: `Place ${a[k]} at ${k}`, highlights: { swap: [k] } });
      i++;
      k++;
    }
    while (j < rightArr.length) {
      a[k] = rightArr[j];
      s.push({ array: [...a], note: `Place ${a[k]} at ${k}`, highlights: { swap: [k] } });
      j++;
      k++;
    }
  };

  const divide = (l, r) => {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    divide(l, m);
    divide(m + 1, r);
    merge(l, m, r);
  };

  divide(0, a.length - 1);
  s.push({ array: [...a], note: "Array sorted", highlights: {} });
  return s;
}

function linearSearch(arr, target) {
  const s = [{ array: [...arr], note: "Starting Linear Search", highlights: {} }];
  for (let i = 0; i < arr.length; i++) {
    s.push({ array: [...arr], note: `Check index ${i}`, highlights: { compare: [i] } });
    if (arr[i] === target) {
      s.push({ array: [...arr], note: `Found at index ${i}`, highlights: { found: [i] } });
      return s;
    }
  }
  s.push({ array: [...arr], note: "Target not found", highlights: {} });
  return s;
}

function binarySearch(arr, target) {
  const a = [...arr].sort((x, y) => x - y);
  const s = [{ array: [...a], note: "Starting Binary Search (array sorted)", highlights: {} }];
  let l = 0;
  let r = a.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    s.push({ array: [...a], note: `Mid index ${mid}`, highlights: { compare: [mid] } });
    if (a[mid] === target) {
      s.push({ array: [...a], note: `Found at index ${mid}`, highlights: { found: [mid] } });
      return s;
    }
    if (a[mid] < target) {
      l = mid + 1;
      s.push({ array: [...a], note: `Target > ${a[mid]}, move right`, highlights: { compare: [mid] } });
    } else {
      r = mid - 1;
      s.push({ array: [...a], note: `Target < ${a[mid]}, move left`, highlights: { compare: [mid] } });
    }
  }
  s.push({ array: [...a], note: "Target not found", highlights: {} });
  return s;
}

function render(step) {
  if (!step) return;
  const { array, highlights, note } = step;
  const max = Math.max(...array, 1);
  barsEl.innerHTML = "";
  array.forEach((value, idx) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    const height = (value / max) * 200 + 30;
    bar.style.height = `${height}px`;
    if (highlights?.compare?.includes(idx)) bar.classList.add("compare");
    if (highlights?.swap?.includes(idx)) bar.classList.add("swap");
    if (highlights?.found?.includes(idx)) bar.classList.add("found");
    if (highlights?.pivot === idx) bar.classList.add("compare");
    const label = document.createElement("span");
    label.textContent = value;
    bar.appendChild(label);
    barsEl.appendChild(bar);
  });
  noteEl.textContent = note || "";
  stepMeta.textContent = `${stepIndex + 1} / ${steps.length}`;
}

function startAnimation() {
  if (!steps.length) return;
  clearInterval(timer);
  timer = setInterval(() => {
    if (stepIndex >= steps.length - 1) {
      clearInterval(timer);
      setStatus("Done", "var(--success)");
      return;
    }
    stepIndex += 1;
    render(steps[stepIndex]);
  }, speed);
  setStatus("Running");
}

function reset() {
  clearInterval(timer);
  timer = null;
  stepIndex = 0;
  render(steps[0] || null);
  setStatus("Idle");
}

function handleStart() {
  const algoKey = algorithmSelect.value;
  const algo = algorithms[algoKey];
  const arr = parseArray();
  const target =
    algo?.type === "search" && targetInput.value.trim() !== ""
      ? Number(targetInput.value.trim())
      : undefined;

  if (!algo) {
    setStatus("Pick an algorithm", "var(--danger)");
    return;
  }
  if (!arr.length) {
    setStatus("Enter valid numbers", "var(--danger)");
    return;
  }
  if (algo.type === "search" && Number.isNaN(target)) {
    setStatus("Enter a target for search", "var(--danger)");
    return;
  }

  steps = algo.fn(arr, target);
  stepIndex = 0;
  render(steps[0]);
  startAnimation();
}

function handlePause() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
  setStatus("Paused", "var(--accent-2)");
}

function updateTargetVisibility() {
  const algo = algorithms[algorithmSelect.value];
  targetField.style.display = algo?.type === "search" ? "block" : "none";
}

speedInput.addEventListener("input", (e) => {
  speed = Number(e.target.value);
  speedLabel.textContent = `${speed}ms`;
  if (timer) startAnimation();
});

algorithmSelect.addEventListener("change", () => updateTargetVisibility());
startBtn.addEventListener("click", handleStart);
pauseBtn.addEventListener("click", handlePause);
resetBtn.addEventListener("click", () => {
  steps = [];
  stepIndex = 0;
  barsEl.innerHTML = "";
  noteEl.textContent = "Enter data and start to view the animation.";
  stepMeta.textContent = "0 / 0";
  setStatus("Idle");
});

explainBtn.addEventListener("click", async () => {
  const algoKey = algorithmSelect.value;
  const algo = algorithms[algoKey];
  const arr = parseArray();
  const target =
    algo?.type === "search" && targetInput.value.trim() !== ""
      ? Number(targetInput.value.trim())
      : undefined;

  explanationEl.textContent = "Requesting explanation...";
  try {
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ algorithm: algo?.label, array: arr, target }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed request");
    explanationEl.textContent = data.explanation;
  } catch (err) {
    explanationEl.textContent = `Error: ${err.message}`;
  }
});

updateTargetVisibility();
setStatus("Idle");

