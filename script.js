const defaults={
html:`<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body><main class="card"><h1>Hello, World! 👋</h1><p>Edit HTML, CSS and JavaScript in tabs.</p><button onclick="sayHello()">Click me</button><p id="message"></p></main></body></html>`,
css:`body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f3f6ff;color:#25324d;font:16px system-ui}.card{text-align:center;padding:2rem}h1{font-size:clamp(2rem,5vw,3.5rem);color:#6857ff}button{border:0;border-radius:12px;padding:13px 26px;background:linear-gradient(120deg,#7c3cff,#168bff);color:#fff;cursor:pointer;font-size:1rem}`,
javascript:`function sayHello(){document.querySelector('#message').textContent='It works! 🎉';console.log('Hello from JavaScript');}`
};
let editor,active="html",timer;const preview=document.querySelector("#preview");
function makeDoc(){let h=editorValues.html,c=editorValues.css,j=editorValues.javascript;
 const style=`<style>${c.replace(/<\/style/gi,'<\\\\/style')}</style>`;
 const script=`<script>${j.replace(/<\/script/gi,'<\\\\/script')}<\\/script>`;
 let doc=h;
 if(/<\/head>/i.test(doc))doc=doc.replace(/<\/head>/i,style+"</head>");else doc=`<!doctype html><html><head>${style}</head><body>${doc}</body></html>`;
 if(/<\/body>/i.test(doc))doc=doc.replace(/<\/body>/i,script+"</body>");else doc+=script;
 return doc;}
const editorValues={...defaults};
function update(){preview.srcdoc=makeDoc();document.querySelector("#status").textContent="Preview updated";}
function setTab(lang){active=lang;document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===lang));editor.setModel(models[lang]);editor.focus();}
const models={};
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
document.querySelector("#runBtn").onclick=update;
document.querySelector("#resetBtn").onclick=()=>{Object.keys(defaults).forEach(k=>editorValues[k]=defaults[k]);Object.keys(models).forEach(k=>models[k].setValue(defaults[k]));update();};
document.querySelector("#themeBtn").onclick=()=>{document.body.classList.toggle("light");monaco.editor.setTheme(document.body.classList.contains("light")?"vs":"vs-dark")};
document.querySelector("#fullscreen").onclick=()=>preview.requestFullscreen?.();
document.querySelector("#downloadBtn").onclick=async()=>{const z=new JSZip();z.file("index.html",editorValues.html);z.file("style.css",editorValues.css);z.file("script.js",editorValues.javascript);z.file("preview.html",makeDoc());z.file("README.md","Upload index.html, style.css and script.js to GitHub Pages.");const blob=await z.generateAsync({type:"blob"});const a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download="code-playground.zip";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"){e.preventDefault();document.querySelector("#downloadBtn").click()}});
document.querySelector("#splitter").addEventListener("pointerdown",e=>{e.preventDefault();let x=e.clientX,w=document.querySelector(".layout").getBoundingClientRect().width,left=document.querySelector(".editorPane").getBoundingClientRect().width;const move=ev=>{let p=Math.max(25,Math.min(75,(left+ev.clientX-x)/w*100));document.querySelector(".layout").style.gridTemplateColumns=`${p}% 6px minmax(0,${100-p}%)`};const up=()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",up)};window.addEventListener("pointermove",move);window.addEventListener("pointerup",up)});
require.config({paths:{vs:"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"}});
require(["vs/editor/editor.main"],()=>{models.html=monaco.editor.createModel(defaults.html,"html");models.css=monaco.editor.createModel(defaults.css,"css");models.javascript=monaco.editor.createModel(defaults.javascript,"javascript");editor=monaco.editor.create(document.querySelector("#editor"),{model:models.html,theme:"vs-dark",automaticLayout:true,minimap:{enabled:false},fontSize:14,tabSize:2,wordWrap:"on"});Object.entries(models).forEach(([k,m])=>m.onDidChangeContent(()=>{editorValues[k]=m.getValue();clearTimeout(timer);timer=setTimeout(update,180)}));update();});