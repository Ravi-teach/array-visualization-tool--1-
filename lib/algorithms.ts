export const codeTemplates = {
  create: `// Array Creation Template
int arr[10] = {64, 34, 25, 12, 22, 11, 90, 5, 77, 30};
int size = 10;

// Display the array
cout << "Array created with " << size << " elements:" << endl;
for(int i = 0; i < size; i++) {
    cout << arr[i] << " ";
}
cout << endl;`,

  insert: `// Insert Element Template
int arr[20] = {64, 34, 25, 12, 22, 11, 90};
int size = 7;
int pos = 3;
int value = 99;

// Shift elements to the right
for(int i = size; i > pos; i--) {
    arr[i] = arr[i-1];
}

// Insert the new element
arr[pos] = value;
size++;

cout << "Element " << value << " inserted at position " << pos << endl;`,

  update: `// Update Element Template
int arr[10] = {64, 34, 25, 12, 22, 11, 90, 5, 77, 30};
int size = 10;
int pos = 2;
int newValue = 100;

cout << "Old value at position " << pos << ": " << arr[pos] << endl;

// Update the element
arr[pos] = newValue;

cout << "New value at position " << pos << ": " << arr[pos] << endl;`,

  delete: `// Delete Element Template
int arr[10] = {64, 34, 25, 12, 22, 11, 90, 5, 77, 30};
int size = 10;
int pos = 4;

cout << "Deleting element at position " << pos << ": " << arr[pos] << endl;

// Shift elements to the left
for(int i = pos; i < size - 1; i++) {
    arr[i] = arr[i + 1];
}

size--;
cout << "Element deleted successfully" << endl;`,

  display: `// Display Array Template
int arr[10] = {64, 34, 25, 12, 22, 11, 90, 5, 77, 30};
int size = 10;

cout << "Array elements:" << endl;
cout << "Index: ";
for(int i = 0; i < size; i++) {
    cout << "[" << i << "] ";
}
cout << endl;

cout << "Value: ";
for(int i = 0; i < size; i++) {
    cout << " " << arr[i] << "  ";
}
cout << endl;`,

  "linear-search": `// Linear Search Template
int arr[10] = {64, 34, 25, 12, 22, 11, 90, 5, 77, 30};
int size = 10;
int target = 22;

int linearSearch(int arr[], int n, int target) {
    cout << "Searching for " << target << " in the array..." << endl;
    
    for(int i = 0; i < n; i++) {
        cout << "Checking index " << i << ": " << arr[i] << endl;
        
        if(arr[i] == target) {
            cout << "Found " << target << " at index " << i << endl;
            return i;
        }
    }
    
    cout << target << " not found in the array" << endl;
    return -1;
}

int result = linearSearch(arr, size, target);`,

  "binary-search": `// Binary Search Template (Array must be sorted)
int arr[10] = {5, 11, 12, 22, 25, 30, 34, 64, 77, 90};
int size = 10;
int target = 25;

int binarySearch(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    
    cout << "Searching for " << target << " using binary search..." << endl;
    
    while(left <= right) {
        int mid = left + (right - left) / 2;
        
        cout << "Checking middle element at index " << mid << ": " << arr[mid] << endl;
        
        if(arr[mid] == target) {
            cout << "Found " << target << " at index " << mid << endl;
            return mid;
        }
        
        if(arr[mid] < target) {
            cout << "Target is greater, searching right half" << endl;
            left = mid + 1;
        } else {
            cout << "Target is smaller, searching left half" << endl;
            right = mid - 1;
        }
    }
    
    cout << target << " not found in the array" << endl;
    return -1;
}

int result = binarySearch(arr, size, target);`,

  "bubble-sort": `// Bubble Sort Template
int arr[10] = {64, 34, 25, 12, 22, 11, 90, 5, 77, 30};
int size = 10;

void bubbleSort(int arr[], int n) {
    cout << "Starting Bubble Sort..." << endl;
    
    for(int i = 0; i < n-1; i++) {
        cout << "Pass " << (i+1) << ":" << endl;
        bool swapped = false;
        
        for(int j = 0; j < n-i-1; j++) {
            cout << "Comparing " << arr[j] << " and " << arr[j+1] << endl;
            
            if(arr[j] > arr[j+1]) {
                cout << "Swapping " << arr[j] << " and " << arr[j+1] << endl;
                
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
                swapped = true;
            }
        }
        
        if(!swapped) {
            cout << "Array is already sorted!" << endl;
            break;
        }
    }
    
    cout << "Bubble Sort completed!" << endl;
}

bubbleSort(arr, size);`,

  "selection-sort": `// Selection Sort Template
int arr[10] = {64, 34, 25, 12, 22, 11, 90, 5, 77, 30};
int size = 10;

void selectionSort(int arr[], int n) {
    cout << "Starting Selection Sort..." << endl;
    
    for(int i = 0; i < n-1; i++) {
        int minIndex = i;
        cout << "Finding minimum element from index " << i << endl;
        
        for(int j = i+1; j < n; j++) {
            cout << "Comparing " << arr[j] << " with current minimum " << arr[minIndex] << endl;
            
            if(arr[j] < arr[minIndex]) {
                minIndex = j;
                cout << "New minimum found: " << arr[minIndex] << " at index " << minIndex << endl;
            }
        }
        
        if(minIndex != i) {
            cout << "Swapping " << arr[i] << " and " << arr[minIndex] << endl;
            
            // Swap elements
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
        
        cout << "Position " << i << " is now sorted with value " << arr[i] << endl;
    }
    
    cout << "Selection Sort completed!" << endl;
}

selectionSort(arr, size);`,

  "insertion-sort": `// Insertion Sort Template
int arr[10] = {64, 34, 25, 12, 22, 11, 90, 5, 77, 30};
int size = 10;

void insertionSort(int arr[], int n) {
    cout << "Starting Insertion Sort..." << endl;
    
    for(int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        cout << "Inserting " << key << " into sorted portion" << endl;
        
        // Move elements greater than key one position ahead
        while(j >= 0 && arr[j] > key) {
            cout << "Moving " << arr[j] << " one position right" << endl;
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        
        arr[j + 1] = key;
        cout << "Inserted " << key << " at position " << (j + 1) << endl;
    }
    
    cout << "Insertion Sort completed!" << endl;
}

insertionSort(arr, size);`,
}

export function getCodeTemplate(templateId: string): string {
  return codeTemplates[templateId as keyof typeof codeTemplates] || codeTemplates.create
}

export function getAlgorithmComplexity(algorithmId: string): string {
  const complexities: Record<string, string> = {
    "linear-search": "O(n)",
    "binary-search": "O(log n)",
    "bubble-sort": "O(n²)",
    "selection-sort": "O(n²)",
    "insertion-sort": "O(n²)",
  }

  return complexities[algorithmId] || "O(1)"
}
