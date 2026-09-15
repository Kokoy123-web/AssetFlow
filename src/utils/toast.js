import {$} from "./dom.js";
let timer;
export function showToast(message,isError=false){const toast=$("#toast");if(!toast)return;clearTimeout(timer);toast.textContent=message;toast.className=`toast show ${isError?"bad":""}`;timer=setTimeout(()=>toast.className="toast",2800);}
