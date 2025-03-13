use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
unsafe extern "C" { // => This tells rust that we want to call some externally defined functions
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
}

#[wasm_bindgen] //-> tells rust we want to export the code to use outside of the rust ecosystem -> converts to wasm binaries?
pub fn binary_search(js_val: JsValue) -> Result<JsValue, JsValue> { // -> Accept javascript as param (recieve struct, struct)

    //convert JsValue (parsed struct) into a Rust Struct
    let mut data: SortingData = serde_wasm_bindgen::from_value(js_val)?; 
    
    let mut low: usize = 0;
    let mut high: usize = data.values.len() - 1;
    let mut middle: usize = (low + high) / 2;

    let mut guess: i32 = data.values[middle];

    while low <= high {
        middle = (low + high) / 2;
        guess = data.values[middle];

        if guess < data.target {
            low = middle + 1;
        }
        else if guess > data.target {
            high = middle - 1;
        }
        else {
            //found the target
            data.target_found_index = Some(middle as i32);
            break;
        }
    }



    // If we didn't find it, set found_index to None
    if data.target_found_index.is_none() {
        data.target_found_index = None;
    }
    
    // Convert the Rust structure back to a JavaScript object
    Ok(serde_wasm_bindgen::to_value(&data)?)
}