export const $=(selector,root=document)=>root.querySelector(selector);
export const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
export function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
export function formatDate(value){return value?new Date(value).toLocaleString():"—";}
