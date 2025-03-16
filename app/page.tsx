"use client"; // This is important - we need client-side functionality

import { useEffect, useState } from "react";

// Import your WebAssembly module
// Adjust the path to where your pkg directory is located
import init, { binary_search, greet } from "@/pkg/sorting_visualiser_wasm";
import Title from "../components/Title";
import InputNumber from "@/components/InputNumber";
import { Container } from "lucide-react";

export default function Home() {
  // Track if the WebAssembly module is loaded
  const [wasmLoaded, setWasmLoaded] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [array, setArray] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [val, setVal] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);

  // Load the WebAssembly module when the component mounts
  useEffect(() => {
    // We need to use an async function within useEffect
    const loadWasm = async () => {
      try {
        // Initialize the WebAssembly module
        await init();
        setWasmLoaded(true);

        //create a sorted array for binary search
        const sortedArray = Array.from({ length: 150 }, (_, i) => i * 2);
        setArray(sortedArray);

        console.log("WebAssembly module loaded successfully!");
      } catch (error) {
        console.error("Failed to load WebAssembly module:", error);
      }
    };

    loadWasm();
  }, []);

  // Function to call our Rust greet function
  const handleGreet = () => {
    if (wasmLoaded) {
      // This calls your Rust function
      greet("WebAssembly");
    } else {
      console.log("WebAssembly not loaded yet");
    }
  };

  //Function to call our Rust binary search function
  const handleSearch = (target: number) => {
    if (wasmLoaded) {
      try {
        // Create the data structure to pass to Rust
        const data = {
          values: array,
          target: target,
          target_found_index: null,
          guesses: [],
        };

        // Call our Rust function
        const result = binary_search(data);

        // Get the result
        setResult(result.target_found_index);

        // Store the guesses
        setGuesses(result.guesses);

        console.log("Search result:", result);
      } catch (error) {
        console.error("Error during search:", error);
      }
    } else {
      console.log("WabAssembly not loaded yet");
    }
  };

  return (
    <main className="p-6 bg-gradient-to-r from-slate-500 via-slate-700 to-slate-800 min-h-screen">
      <div className="justify-items-end mr-10">
        <Title />
      </div>
      <InputNumber
        val={val}
        setVal={setVal}
        setResult={setResult}
        handleSearch={handleSearch}
        wasmLoaded={wasmLoaded}
        setIsAnimating={setIsAnimating}
      />

      {/* Display the array */}
      <div className="justify-items-center justify-center mt-20 gap-2 w-full flex flex-row flex-wrap font-mono p-10">
        {array.map((number, index) => (
          <div
            key={index}
            id={`array-element-${index}`}
            className="bg-gray-900 m-1 rounded text-white flex items-center justify-center"
            style={{ width: "40px", height: "40px" }}
          >
            {number}
          </div>
        ))}
      </div>
      {/* Display the position */}
      <div className="justify-items-start mt-30 ml-35">
        <h1 className="font-mono text-green-500 text-4xl">Index: {result}</h1>
      </div>
    </main>
  );
}
