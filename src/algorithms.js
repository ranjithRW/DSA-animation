export function bubbleSort(arr) {
  const a = [...arr];
  const s = [{ 
    array: [...a], 
    note: "Starting Bubble Sort", 
    explanation: `Bubble Sort works by repeatedly comparing adjacent elements and swapping them if they're in the wrong order. We'll go through ${a.length} passes, with each pass moving the largest unsorted element to its correct position at the end.`,
    highlights: {} 
  }];
  for (let i = 0; i < a.length; i++) {
    s.push({
      array: [...a],
      note: `Pass ${i + 1} of ${a.length}`,
      explanation: `Starting pass ${i + 1}. In this pass, we'll compare adjacent pairs and swap them if needed. After this pass, the largest ${i + 1} element(s) will be in their correct positions at the end.`,
      highlights: {},
    });
    for (let j = 0; j < a.length - i - 1; j++) {
      s.push({
        array: [...a],
        note: `Compare ${a[j]} and ${a[j + 1]}`,
        explanation: `Comparing elements at positions ${j} and ${j + 1}: ${a[j]} and ${a[j + 1]}. If ${a[j]} > ${a[j + 1]}, we'll swap them to put them in ascending order.`,
        highlights: { compare: [j, j + 1] },
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        s.push({
          array: [...a],
          note: `Swap ${a[j + 1]} and ${a[j]}`,
          explanation: `Swapping ${a[j + 1]} and ${a[j]} because ${a[j + 1]} > ${a[j]}. The larger element bubbles up to the right. After the swap, position ${j} has ${a[j]} and position ${j + 1} has ${a[j + 1]}.`,
          highlights: { swap: [j, j + 1] },
        });
      } else {
        s.push({
          array: [...a],
          note: `No swap needed`,
          explanation: `No swap needed! ${a[j]} (${a[j]}) is already smaller than or equal to ${a[j + 1]} (${a[j + 1]}), so they're in the correct order. Moving to the next pair.`,
          highlights: { compare: [j, j + 1] },
        });
      }
    }
  }
  s.push({ 
    array: [...a], 
    note: "Array sorted", 
    explanation: `Bubble Sort complete! All elements are now in ascending order. The algorithm made ${a.length} passes through the array, with each pass ensuring at least one element reaches its final position.`,
    highlights: {} 
  });
  return s;
}

export function insertionSort(arr) {
  const a = [...arr];
  const s = [{ 
    array: [...a], 
    note: "Starting Insertion Sort", 
    explanation: `Insertion Sort works like sorting playing cards in your hand. We'll process each element one by one, inserting it into its correct position among the already-sorted elements to the left.`,
    highlights: {} 
  }];
  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;
    s.push({ 
      array: [...a], 
      note: `Pick ${key} at position ${i}`, 
      explanation: `Selecting element ${key} at position ${i}. We'll now find the correct position for ${key} by comparing it with the sorted elements to its left (positions 0 to ${i - 1}).`,
      highlights: { compare: [i] } 
    });
    while (j >= 0 && a[j] > key) {
      s.push({ 
        array: [...a], 
        note: `Shift ${a[j]} right`, 
        explanation: `Element ${a[j]} at position ${j} is greater than ${key}, so we shift ${a[j]} one position to the right (from position ${j} to ${j + 1}). This makes room for ${key} to be inserted.`,
        highlights: { swap: [j, j + 1] } 
      });
      a[j + 1] = a[j];
      j -= 1;
    }
    a[j + 1] = key;
    s.push({ 
      array: [...a], 
      note: `Insert ${key} at position ${j + 1}`, 
      explanation: `Inserting ${key} at position ${j + 1}. All elements from position 0 to ${j + 1} are now sorted. ${key} is now in its correct position among the sorted portion of the array.`,
      highlights: { compare: [j + 1] } 
    });
  }
  s.push({ 
    array: [...a], 
    note: "Array sorted", 
    explanation: `Insertion Sort complete! All elements have been inserted into their correct positions. The array is now fully sorted in ascending order.`,
    highlights: {} 
  });
  return s;
}

export function selectionSort(arr) {
  const a = [...arr];
  const s = [{ 
    array: [...a], 
    note: "Starting Selection Sort", 
    explanation: `Selection Sort works by repeatedly finding the minimum element from the unsorted portion and placing it at the beginning. We'll do this ${a.length} times, once for each position.`,
    highlights: {} 
  }];
  for (let i = 0; i < a.length; i++) {
    let min = i;
    s.push({
      array: [...a],
      note: `Finding minimum for position ${i}`,
      explanation: `Starting from position ${i}, we'll scan through the remaining unsorted elements (positions ${i + 1} to ${a.length - 1}) to find the smallest value. This minimum will be placed at position ${i}.`,
      highlights: { compare: [i] },
    });
    for (let j = i + 1; j < a.length; j++) {
      s.push({ 
        array: [...a], 
        note: `Compare ${a[min]} and ${a[j]}`, 
        explanation: `Comparing current minimum candidate ${a[min]} (at position ${min}) with ${a[j]} (at position ${j}). If ${a[j]} < ${a[min]}, we'll update our minimum to position ${j}.`,
        highlights: { compare: [min, j] } 
      });
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      s.push({ 
        array: [...a], 
        note: `Swap minimum ${a[i]} to position ${i}`, 
        explanation: `Swapping! The minimum element ${a[i]} found at position ${min} is now moved to position ${i}. Position ${i} is now correctly filled with the smallest element from the unsorted portion.`,
        highlights: { swap: [i, min] } 
      });
    } else {
      s.push({
        array: [...a],
        note: `Element ${a[i]} already at position ${i}`,
        explanation: `No swap needed! The element at position ${i} (${a[i]}) is already the minimum in the unsorted portion, so it's already in the correct position.`,
        highlights: { compare: [i] },
      });
    }
  }
  s.push({ 
    array: [...a], 
    note: "Array sorted", 
    explanation: `Selection Sort complete! We've found and placed the minimum element for each position. The array is now fully sorted in ascending order.`,
    highlights: {} 
  });
  return s;
}

export function quickSort(arr) {
  const a = [...arr];
  const s = [];

  const partition = (low, high) => {
    const pivot = a[high];
    let i = low - 1;
    s.push({ 
      array: [...a], 
      note: `Pivot ${pivot} at position ${high}`, 
      explanation: `Selecting ${pivot} at position ${high} as the pivot. We'll partition the subarray from positions ${low} to ${high} by placing all elements ≤ ${pivot} to the left and all elements > ${pivot} to the right.`,
      highlights: { pivot: high } 
    });
    for (let j = low; j < high; j++) {
      s.push({ 
        array: [...a], 
        note: `Compare ${a[j]} <= ${pivot}`, 
        explanation: `Checking if ${a[j]} (at position ${j}) is less than or equal to the pivot ${pivot}. If yes, it belongs on the left side of the partition.`,
        highlights: { compare: [j, high] } 
      });
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        s.push({ 
          array: [...a], 
          note: `Swap ${a[i]} forward`, 
          explanation: `Swapping ${a[i]} (which is ≤ pivot) to position ${i}. This maintains the partition: all elements from ${low} to ${i} are ≤ pivot, and elements from ${i + 1} to ${j} are > pivot.`,
          highlights: { swap: [i, j], pivot: high } 
        });
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    s.push({ 
      array: [...a], 
      note: "Place pivot in final position", 
      explanation: `Placing the pivot ${pivot} at position ${i + 1}, its final sorted position. All elements to the left (positions ${low} to ${i}) are ≤ pivot, and all to the right (positions ${i + 2} to ${high}) are > pivot.`,
      highlights: { swap: [i + 1, high] } 
    });
    return i + 1;
  };

  const sort = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  };

  s.push({ 
    array: [...a], 
    note: "Starting Quick Sort", 
    explanation: `Quick Sort uses a divide-and-conquer approach. We'll repeatedly partition the array around a pivot element, then recursively sort the subarrays on either side of the pivot.`,
    highlights: {} 
  });
  sort(0, a.length - 1);
  s.push({ 
    array: [...a], 
    note: "Array sorted", 
    explanation: `Quick Sort complete! The array has been partitioned and sorted recursively. All elements are now in their correct sorted positions.`,
    highlights: {} 
  });
  return s;
}

export function mergeSort(arr) {
  const a = [...arr];
  const s = [{ 
    array: [...a], 
    note: "Starting Merge Sort", 
    explanation: `Merge Sort uses divide-and-conquer: we'll split the array in half repeatedly until we have single elements, then merge them back together in sorted order.`,
    highlights: {} 
  }];

  const merge = (left, mid, right) => {
    const leftArr = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);
    s.push({
      array: [...a],
      note: `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
      explanation: `Merging two sorted subarrays: left subarray [${leftArr.join(', ')}] and right subarray [${rightArr.join(', ')}]. We'll compare elements from both and place the smaller one first.`,
      highlights: { compare: [left, mid + 1] },
    });
    let i = 0,
      j = 0,
      k = left;
    while (i < leftArr.length && j < rightArr.length) {
      const compareIdx = [k, left + i, mid + 1 + j].filter((v) => v < a.length);
      s.push({ 
        array: [...a], 
        note: `Compare ${leftArr[i]} and ${rightArr[j]}`, 
        explanation: `Comparing ${leftArr[i]} from the left subarray with ${rightArr[j]} from the right subarray. We'll take the smaller value and place it at position ${k}.`,
        highlights: { compare: compareIdx } 
      });
      if (leftArr[i] <= rightArr[j]) {
        a[k] = leftArr[i];
        i++;
      } else {
        a[k] = rightArr[j];
        j++;
      }
      s.push({ 
        array: [...a], 
        note: `Place ${a[k]} at position ${k}`, 
        explanation: `Placing ${a[k]} at position ${k}. This element is now in its correct position in the merged array.`,
        highlights: { swap: [k] } 
      });
      k++;
    }
    while (i < leftArr.length) {
      a[k] = leftArr[i];
      s.push({ 
        array: [...a], 
        note: `Place ${a[k]} at position ${k}`, 
        explanation: `Copying remaining element ${a[k]} from the left subarray to position ${k}. The right subarray is exhausted.`,
        highlights: { swap: [k] } 
      });
      i++;
      k++;
    }
    while (j < rightArr.length) {
      a[k] = rightArr[j];
      s.push({ 
        array: [...a], 
        note: `Place ${a[k]} at position ${k}`, 
        explanation: `Copying remaining element ${a[k]} from the right subarray to position ${k}. The left subarray is exhausted.`,
        highlights: { swap: [k] } 
      });
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
  s.push({ 
    array: [...a], 
    note: "Array sorted", 
    explanation: `Merge Sort complete! All subarrays have been merged back together. The array is now fully sorted in ascending order.`,
    highlights: {} 
  });
  return s;
}

export function linearSearch(arr, target) {
  const s = [{ 
    array: [...arr], 
    note: "Starting Linear Search", 
    explanation: `Linear Search checks each element one by one from the beginning to find the target ${target}. We'll examine each position sequentially until we find a match or reach the end.`,
    highlights: {} 
  }];
  for (let i = 0; i < arr.length; i++) {
    s.push({ 
      array: [...arr], 
      note: `Check index ${i}: value ${arr[i]}`, 
      explanation: `Checking position ${i} which contains ${arr[i]}. Comparing ${arr[i]} with target ${target}. ${arr[i] === target ? 'They match!' : 'Not a match, moving to the next position.'}`,
      highlights: { compare: [i] } 
    });
    if (arr[i] === target) {
      s.push({ 
        array: [...arr], 
        note: `Found ${target} at index ${i}`, 
        explanation: `Success! Found the target ${target} at position ${i}. Linear Search found the element after checking ${i + 1} position(s).`,
        highlights: { found: [i] } 
      });
      return s;
    }
  }
  s.push({ 
    array: [...arr], 
    note: "Target not found", 
    explanation: `Target ${target} not found in the array. We've checked all ${arr.length} positions, and none of them contained the target value.`,
    highlights: {} 
  });
  return s;
}

export function binarySearch(arr, target) {
  const a = [...arr].sort((x, y) => x - y);
  const s = [{ 
    array: [...a], 
    note: "Starting Binary Search (array sorted)", 
    explanation: `Binary Search requires a sorted array. We'll repeatedly divide the search space in half by comparing the target with the middle element. This is much faster than linear search!`,
    highlights: {} 
  }];
  let l = 0;
  let r = a.length - 1;
  let step = 0;
  while (l <= r) {
    step++;
    const mid = Math.floor((l + r) / 2);
    s.push({ 
      array: [...a], 
      note: `Step ${step}: Check middle at index ${mid}`, 
      explanation: `Checking the middle element at position ${mid} which contains ${a[mid]}. Comparing ${a[mid]} with target ${target}. The search range is currently from position ${l} to ${r}.`,
      highlights: { compare: [mid] } 
    });
    if (a[mid] === target) {
      s.push({ 
        array: [...a], 
        note: `Found ${target} at index ${mid}`, 
        explanation: `Success! Found the target ${target} at position ${mid}. Binary Search found it in ${step} step(s), which is much faster than checking all ${a.length} positions.`,
        highlights: { found: [mid] } 
      });
      return s;
    }
    if (a[mid] < target) {
      l = mid + 1;
      s.push({ 
        array: [...a], 
        note: `Target > ${a[mid]}, search right half`, 
        explanation: `Since ${target} > ${a[mid]}, the target must be in the right half of the current range. Updating search range to positions ${mid + 1} to ${r} (discarding the left half).`,
        highlights: { compare: [mid] } 
      });
    } else {
      r = mid - 1;
      s.push({ 
        array: [...a], 
        note: `Target < ${a[mid]}, search left half`, 
        explanation: `Since ${target} < ${a[mid]}, the target must be in the left half of the current range. Updating search range to positions ${l} to ${mid - 1} (discarding the right half).`,
        highlights: { compare: [mid] } 
      });
    }
  }
  s.push({ 
    array: [...a], 
    note: "Target not found", 
    explanation: `Target ${target} not found in the sorted array. After ${step} step(s) of binary search, we've narrowed down to an empty search range, meaning the target doesn't exist.`,
    highlights: {} 
  });
  return s;
}

export const algorithms = {
  bubble: { label: "Bubble Sort", type: "sort", fn: bubbleSort },
  insertion: { label: "Insertion Sort", type: "sort", fn: insertionSort },
  selection: { label: "Selection Sort", type: "sort", fn: selectionSort },
  quick: { label: "Quick Sort", type: "sort", fn: quickSort },
  merge: { label: "Merge Sort", type: "sort", fn: mergeSort },
  linear: { label: "Linear Search", type: "search", fn: linearSearch },
  binary: { label: "Binary Search", type: "search", fn: binarySearch },
};

