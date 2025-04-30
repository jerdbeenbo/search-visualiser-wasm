use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
unsafe extern "C" {
    // => This tells rust that we want to call some externally defined functions
    pub unsafe fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    unsafe { alert(&format!("Hello, {}!", name)) };
}

//Structure exhanged between rust and javascript
#[derive(Serialize, Deserialize)]
pub struct SortingData {
    pub values: Vec<i32>,
    pub target: i32,
    pub target_found_index: Option<i32>, // -> Return -1 if it isn't found
    pub guesses: Vec<Guess>,
}

#[wasm_bindgen]
pub fn jump_search(js_val: JsValue) -> Result<JsValue, JsValue> {

    //get data
    let mut data: SortingData = serde_wasm_bindgen::from_value(js_val)?;
    
    //Distance to Jump
    let jump_val: usize = (data.values.len() as f64).sqrt() as usize;

    //initialise the guesses array for animation purposes later
    let mut guesses_total: Vec<Guess> = Vec::new();

    //Iterate over the dataset
    'outer: for i in (0..data.values.len()).step_by(jump_val) {
        
        let current_guess: Guess = Guess {
             current_high: i,
             current_low: i,
             current_middle: i,
        };

        //Add the guess state to our guesses vector
        guesses_total.push(current_guess);

        if data.values[i] == data.target {
            //found the target
            data.target_found_index = Some(i as i32);
            break;
        }
        else if data.values[i] > data.target {
            //We jump over the target, find it by going back to last pos
            //and linear searching to this pos
            let start = if i >= jump_val { i - jump_val } else { 0 };
            for x in start..i {

                //record guess information for animation
                let current_guess: Guess = Guess {
                    current_high: x,
                    current_low: x,
                    current_middle: x,
               };

                //Add the guess state to our guesses vector
                guesses_total.push(current_guess);

                if data.values[x] == data.target {
                    data.target_found_index = Some(x as i32);
                    break 'outer;   //Break reference to outerloop with a 'label
                }
            }
        }
    }

    // If we didn't find it, set found_index to None
    if data.target_found_index.is_none() {
        data.target_found_index = None;
    }

    // Store the guesses in the data structure
    data.guesses = guesses_total;

    // Convert the Rust structure back to a JavaScript object and return result
    Ok(serde_wasm_bindgen::to_value(&data)?)
}

#[wasm_bindgen]
pub fn linear_search(js_val: JsValue) -> Result<JsValue, JsValue> {
    let mut data: SortingData = serde_wasm_bindgen::from_value(js_val)?;

    //Linear search through, checking each element iteratively

    //initialise the guesses array for animation purposes later
    let mut guesses_total: Vec<Guess> = Vec::new();


    for i in 0..data.values.len() {
        
        let current_guess = Guess {
            current_middle: i,
            current_high: i,
            current_low: i,
        };

        // Add each state to our guesses vector
        guesses_total.push(current_guess);
        if data.values[i] == data.target {
            //found the target
            data.target_found_index = Some(i as i32);
            break;
        }
    }

        // If we didn't find it, set found_index to None
        if data.target_found_index.is_none() {
            data.target_found_index = None;
        }
    
        // Store the guesses in the data structure
        data.guesses = guesses_total;

    // Convert the Rust structure back to a JavaScript object and return result
    Ok(serde_wasm_bindgen::to_value(&data)?)
} 

//Record eacch value at each step
#[derive(Serialize, Deserialize, Clone, Copy)]
pub struct Guess {
    pub current_middle: usize,
    pub current_low: usize,
    pub current_high: usize,
}

#[wasm_bindgen] //-> tells rust we want to export the code to use outside of the rust ecosystem -> converts to wasm binaries?
pub fn binary_search(js_val: JsValue) -> Result<JsValue, JsValue> {
    // -> Accept javascript as param (recieve struct, struct)

    //convert JsValue (parsed struct) into a Rust Struct
    let mut data: SortingData = serde_wasm_bindgen::from_value(js_val)?;

    let mut low: usize = 0;
    let mut high: usize = data.values.len() - 1;
    let mut middle: usize = (low + high) / 2;

    let mut guess: i32 = data.values[middle];

    //initialise the guesses array for animation purposes later
    let mut guesses_total: Vec<Guess> = Vec::new();
    
    // Add the initial state
    guesses_total.push(Guess {
        current_middle: middle,
        current_low: low,
        current_high: high,
    });

    while low <= high {
        middle = (low + high) / 2;
        guess = data.values[middle];

        let current_guess = Guess {
            current_middle: middle,
            current_low: low,
            current_high: high,
        };

        // Add each state to our guesses vector
        guesses_total.push(current_guess);

        if guess < data.target {
            low = middle + 1;
        } else if guess > data.target {
            high = middle - 1;
        } else {
            //found the target
            data.target_found_index = Some(middle as i32);
            break;
        }
    }

    // If we didn't find it, set found_index to None
    if data.target_found_index.is_none() {
        data.target_found_index = None;
    }

    // Store the guesses in the data structure
    data.guesses = guesses_total;

    // Convert the Rust structure back to a JavaScript object and return result
    Ok(serde_wasm_bindgen::to_value(&data)?)
}
