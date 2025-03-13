# Binary Search Visualizer with Rust + WebAssembly + Next.js

A web application that demonstrates binary search algorithm using Rust compiled to WebAssembly and integrated with a Next.js frontend.

## Description

This project showcases how to bridge high-performance Rust algorithms with a modern React web application through WebAssembly. The binary search visualizer allows you to search for a number in a sorted array and see the result in real time.

## Features

- Binary search algorithm implemented in Rust
- Rust code compiled to WebAssembly for browser execution
- Modern UI built with Next.js and Tailwind CSS
- Real-time search visualization

## Prerequisites

- Node.js (v18.17.0 or newer)
- Rust toolchain (rustc, cargo)
- wasm-pack

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/binary-search-visualizer.git
   cd binary-search-visualizer
   ```

2. Build the WebAssembly module
   ```bash
   wasm-pack build --target web --out-dir ../pkg
   ```

3. Install JavaScript dependencies
   ```bash
   npm install
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page with WASM integration
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── InputNumber.tsx   # Number input component
│   ├── Title.tsx         # Title component
│   └── ui/               # UI components
├── lib/                  # Utility functions
├── public/               # Static assets
└── src/                  # Rust source code
    └── lib.rs            # Binary search implementation
```

## How It Works

### Rust Implementation (lib.rs)

The binary search algorithm is implemented in Rust:

```rust
#[wasm_bindgen]
pub fn binary_search(js_val: JsValue) -> Result<JsValue, JsValue> {
    let mut data: SortingData = serde_wasm_bindgen::from_value(js_val)?; 
    
    let mut low: usize = 0;
    let mut high: usize = data.values.len() - 1;
    let mut middle: usize = (low + high) / 2;

    while low <= high {
        middle = (low + high) / 2;
        let guess = data.values[middle];

        if guess < data.target {
            low = middle + 1;
        }
        else if guess > data.target {
            high = middle - 1;
        }
        else {
            data.target_found_index = Some(middle as i32);
            break;
        }
    }

    if data.target_found_index.is_none() {
        data.target_found_index = None;
    }
    
    Ok(serde_wasm_bindgen::to_value(&data)?)
}
```

### Next.js Integration (page.tsx)

The Next.js page imports and initializes the WebAssembly module:

```typescript
import init, { binary_search } from "@/pkg/sorting_visualiser_wasm";

// Initialize WebAssembly
useEffect(() => {
  const loadWasm = async () => {
    try {
      await init();
      setWasmLoaded(true);

      const sortedArray = Array.from({ length: 50 }, (_, i) => i * 2);
      setArray(sortedArray);
    } catch (error) {
      console.error("Failed to load WebAssembly module:", error);
    }
  };

  loadWasm();
}, []);

// Call the binary search function
const handleSearch = (target: number) => {
  if (wasmLoaded) {
    try {
      const data = {
        values: array,
        target: target,
        target_found_index: null,
      };

      const result = binary_search(data);
      setResult(result.target_found_index);
    } catch (error) {
      console.error("Error during search:", error);
    }
  }
};
```

## Development

To modify the Rust code, edit the `src/lib.rs` file and rebuild the WebAssembly module using:

```bash
wasm-pack build --target web --out-dir ../pkg
```

For UI changes, modify the components in the `components/` directory and the main page in `app/page.tsx`.

## Technologies Used

- Rust
- WebAssembly (wasm-bindgen, serde)
- Next.js 15
- React 19
- Tailwind CSS
- shadcn/ui components

## License

MIT