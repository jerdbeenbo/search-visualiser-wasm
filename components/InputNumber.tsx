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
}

export default function InputNumber({
  val,
  setVal,
  setResult,
  handleSearch,
  wasmLoaded,
  setIsAnimating,
}: InputNumberProps) {
  return (
    <div className="mt-20 justify-items-center">
      <label className="block mb-2 font-mono tracking-wide text-green-200">
        Search for a number:
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
            handleSearch(val as number);
            setIsAnimating(true);
          }}
          disabled={!wasmLoaded}
          //className={styles.button}
        >
          <ChevronRight className="text-black" />
        </Button>
      </div>
    </div>
  );
}
