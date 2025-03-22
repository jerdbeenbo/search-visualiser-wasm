"use client"; // This is important - we need client-side functionality

import { useEffect, useState } from "react";

// Import your WebAssembly module
// Adjust the path to where your pkg directory is located
import init, { binary_search, greet } from "@/pkg/sorting_visualiser_wasm";
import Title from "../components/Title";
import InputNumber from "@/components/InputNumber";
import { Container } from "lucide-react";
import anime from "animejs";

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
        const sortedArray = Array.from({ length: 121 }, (_, i) => i * 2);
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
        setGuesses(result.guesses); //-> This takes time!

        console.log("Search result:", result);

        return result.guesses; // -> return the guesses immedately for use
      } catch (error) {
        console.error("Error during search:", error);
      }
    } else {
      console.log("WabAssembly not loaded yet");
    }
  };

  const resetAnimations = () => {


    // Stop all running animations
    anime.remove(".element-dot");
    
    // Reset all dots to original appearance
    anime({
      targets: ".element-dot",
      backgroundColor: "#0F172A", // Your original dark color
      translateY: 0,
      scale: 1,
      opacity: 0.7,
      duration: 300
    });
    
    // Reset state
    setResult(null);
    setGuesses([]);
    setCurrentGuessIndex(0);
  };

  const handleElementWithReset = (e: any) => {
    // First, stop all running animations
    anime.remove(".element-dot");
    
    // Reset all dots to original appearance
    anime({
      targets: ".element-dot",
      backgroundColor: "#0F172A",
      translateY: 0,
      scale: 1,
      opacity: 0.7,
      duration: 100, // Make this faster
      complete: function() {
        // Only after the reset animation completes, handle the click
        const index = parseInt(e.target.dataset.index);
        const num = array[index];
        setVal(num);
        
        // Create the data structure directly
        if (wasmLoaded) {
          const data = {
            values: array,
            target: num,
            target_found_index: null,
            guesses: [],
          };
          
          // Get results directly
          const result = binary_search(data);
          setResult(result.target_found_index);
          setGuesses(result.guesses);
          
          // Now animate with the results we have
          animateFromIndex(index, result.guesses);
        }
      }
    });
  };

  // Handles animation for a value (used from search bar)
  const animateSearch = (value: number, guesses_l: any) => {
    // Find the index of the value in the array
    const index = array.indexOf(value);

    if (index !== -1) {
      // Trigger the animation
      animateFromIndex(index, guesses_l);
    } else {
      // If value not found, animate all dots (unwanted animation)
      anime({
        targets: ".element-dot",
        // scale: [
        //   { value: 1.1, easing: "easeOutSine", duration: 250 },
        //   { value: 1, easing: "easeOutQuad", duration: 500 },
        // ],
        opacity: [
          { value: 1, easing: "easeOutSine", duration: 250 },
          { value: 0.7, easing: "easeOutQuad", duration: 500 },
        ],
        translateX: [
          { value: 5, easing: "easeOutSine", duration: 50 },
          { value: -5, easing: "easeOutQuad", duration: 50 },
          { value: 1, easing: "easeOutSine", duration: 50 },
        ],
        backgroundColor: [
          { value: "#ff0f0f", easing: "easeOutQuad", duration: 100 },
          { value: "#0F172A", easing: "easeOutQuad", duration: 100 },
        ],
        delay: anime.stagger(50, {
          grid: [
            Math.ceil(Math.sqrt(array.length)),
            Math.ceil(array.length / Math.ceil(Math.sqrt(array.length))),
          ],
          from: 'center',
        }),
      });
    }
  };

  // Once the index is found animate from that index (expected animation)
  const animateFromIndex = (index: number, guesses_l: any) => {
    //remove any existing animations
    anime.remove(".element-dot");

    const timeline = anime.timeline(); // => instantiate a timeline for the animations

    //create a timeline completion function
    timeline.complete = function () {
      if (guesses_l.length > 0) {
        startBounceAnimation(guesses_l[guesses_l.length - 1].current_middle);
      }
    };
    //TODO: -> This is a cool effect! Maybe for updating the array values?
    // timeline.add({
    //     targets: '.element-dot',
    //     translateX: anime.stagger(10, {grid: [14, 5], from: 'center', axis: 'x'}),
    //     translateY: anime.stagger(10, {grid: [14, 5], from: 'center', axis: 'y'}),
    //     rotateZ: anime.stagger([0, 90], {grid: [14, 5], from: 'center', axis: 'x'}),
    //     delay: anime.stagger(200, {grid: [14, 5], from: 'center'}),
    //     easing: 'easeInOutQuad',
    //     duration: 1000,
    // })

    timeline.add({
      targets: ".element-dot",
      scale: [
        { value: 1.1, easing: "easeOutSine", duration: 250 },
        { value: 1, easing: "easeOutQuad", duration: 500 },
      ],
      translateY: [
        { value: -10, easing: "easeOutSine", duration: 250 },
        { value: 0, easing: "easeOutQuad", duration: 500 },
      ],
      opacity: [
        { value: 1, easing: "easeOutSine", duration: 250 },
        { value: 0.7, easing: "easeOutQuad", duration: 500 },
      ],
      delay: anime.stagger(100, {
        grid: [
          Math.ceil(Math.sqrt(array.length)),
          Math.ceil(array.length / Math.ceil(Math.sqrt(array.length))),
        ],
        from: index,
      }),
    });

    //animate the guesses (excluding the last one)
    for (let i = 0; i < guesses_l.length; i++) {
      console.log("guess.index: " + guesses_l[i].current_middle);
      timeline.add({
        targets: `.element-dot[data-index="${guesses_l[i].current_middle}"]`,
        backgroundColor: "#16A34A", //highlight the current guess
        scale: [
          { value: 1.1, easing: "easeOutSine" },
          { value: 1, easing: "easeOutSine" },
        ],
        duration: 600,
      });
    }

    //play the animation
    timeline.play();
  };

  const startBounceAnimation = (elementIndex: any) => {
    // Clear any existing animations first
    anime.remove(`.element-dot[data-index="${elementIndex}"]`);

    // Create a standalone animation
    return anime({
      targets: `.element-dot[data-index="${elementIndex}"]`,
      backgroundColor: "#16A34A",
      translateY: -10,
      direction: "alternate",
      loop: true,
      duration: 300,
      easing: "easeInOutQuad",
    });
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
        animateSearch={animateSearch}
        resetAnimations={resetAnimations}
      />

      {/* Display the array */}
      <div
        className="group mt-10 w-full font-mono p-3 mx-auto"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.ceil(
            Math.sqrt(array.length)
          )}, minmax(30px, 50px))`,
          gap: "4px",
          justifyContent: "center",
        }}
      >
        {array.map((number, index) => (
          <div
            key={index}
            onClick={handleElementWithReset}
            data-index={index}
            className="cursor-pointer element-dot opacity-70 bg-gray-900 transition-colors hover:bg-slate-500 m-1 rounded-full text-white flex items-center justify-center text-sm w-8 h-8 sm:w-10 sm:h-10"
            style={{ 
              borderRadius: "50%",
            }}
          >
            {number}
          </div>
        ))}
      </div>
      {/* Display the position */}
      <div className="justify-items-start mt-5 ml-35">
        <h1 className="font-mono text-green-500 text-2xl">Index: {result}</h1>
      </div>
    </main>
  );
}
