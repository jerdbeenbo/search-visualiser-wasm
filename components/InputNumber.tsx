import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface InputNumberProps {
    val: number | null;
    setVal: (value: number | null) => void;
    setResult: (result: number | null) => void;
    handleSearch: (target: number) => void;
    wasmLoaded: boolean;
    setIsAnimating: (value: boolean) => void;
    animateSearch: (e: any, guesses_immediate: any) => void;
    resetAnimations: () => void;
}

export default function InputNumber({
  val,
  setVal,
  setResult,
  handleSearch,
  wasmLoaded,
  setIsAnimating,
  animateSearch,
  resetAnimations
}: InputNumberProps) {
  return (
    <div className="mt-6 justify-items-center">
      <label className="block mb-2 font-mono tracking-wide text-green-200">
        Search for a number:
      </label>
      <label className="block mb-2 font-mono tracking-wide text-green-200">
        &lt;or click on one&gt;
      </label>
      <div className="flex gap-2">
        <Input
          type="number"
          className="border p-2 w-32 text-green-400"
          placeholder="Enter a number"
          onChange={(e) => {
            if (e.target.value) {
              setVal(parseInt(e.target.value, 0)); // -> 0 floating point value (i32 for rust)
            } else {
              setResult(null);
            }
          }}
        />
        <Button
          variant="outline"
          size="icon"
          className="bg-green-200 border-opacity-0 hover:bg-green-100"
          onClick={() => {
            let guesses_immediate = handleSearch(val as number);
            animateSearch(val as number, guesses_immediate);
            setIsAnimating(true);
          }}
          disabled={!wasmLoaded}
          //className={styles.button}
        >
          <ChevronRight className="text-black" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-red-200 border-opacity-0 hover:bg-red-100"
          onClick={() => {
            resetAnimations();
          }}
          disabled={!wasmLoaded}
          //className={styles.button}
        >
          <div className="text-black">!</div>
        </Button>
      </div>
    </div>
  );
}
