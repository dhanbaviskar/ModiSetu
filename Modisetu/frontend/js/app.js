const MODI_TO_DEV = {
  "a":"अ","aa":"आ","ah":"अः","ai":"ऐ","am":"अं",
  "e":"ए","i":"इ","ii":"ई","o":"ओ","oo":"ऊ","ou":"औ","u":"उ",
  "b":"ब","bh":"भ","ch":"च","chh":"छ","d":"ड","dh":"ढ","dha":"ध",
  "dyn":"ज्ञ","g":"ग","gh":"घ","h":"ह","ja":"ज","jh":"झ",
  "k":"क","kh":"ख","ksh":"क्ष","l":"ल","lh":"ळ","m":"म","n":"न",
  "nn":"ण","p":"प","ph":"फ","r":"र","s":"स","sh":"श","shr":"श्र",
  "ta":"त","th":"थ","tha":"ठ","thh":"थ","thha":"ठ","tr":"त्र",
  "v":"व","y":"य",
  "zero":"०","one":"१","two":"२","three":"३","four":"४",
  "five":"५","six":"६","seven":"७","eight":"८","nine":"९"
};

let activeTab = 'draw';

function switchTab(tab) {
  activeTab = tab;
  document.getElementById('tabDraw').classList.toggle('active',   tab === 'draw');
  document.getElementById('tabUpload').classList.toggle('active', tab === 'upload');
  document.getElementById('drawTab').style.display   = tab === 'draw'   ? 'block' : 'none';
  document.getElementById('uploadTab').style.display = tab === 'upload' ? 'block' : 'none';
  showEmpty();
}

function handleTryAnother() {
  activeTab === 'upload' ? clearUpload() : clearAll();
}

// ── Canvas ──
const drawCanvas  = document.getElementById('drawCanvas');
const guideCanvas = document.getElementById('guideCanvas');
const ctx  = drawCanvas.getContext('2d');
const gCtx = guideCanvas.getContext('2d');
let drawing=false, mode='pen', strokeColor='#1a1a2e', hasDrawn=false;
let allStrokes=[], curStroke=[];

function initCanvases() {
  const rect = drawCanvas.getBoundingClientRect();
  const DPR  = devicePixelRatio;
  drawCanvas.width  = rect.width * DPR;
  drawCanvas.height = rect.height * DPR;
  ctx.scale(DPR, DPR);
  ctx.fillStyle = '#fdfaf5';
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  guideCanvas.width  = rect.width * DPR;
  guideCanvas.height = rect.height * DPR;
  gCtx.scale(DPR, DPR);
}
initCanvases();

function getPos(e) {
  const rect = drawCanvas.getBoundingClientRect();
  const src  = e.touches ? e.touches[0] : e;
  return { x: src.clientX - rect.left, y: src.clientY - rect.top };
}

drawCanvas.addEventListener('mousedown', e => {
  drawing = true; curStroke = [];
  const p = getPos(e); curStroke.push(p);
  ctx.beginPath(); ctx.moveTo(p.x, p.y);
  if (!hasDrawn) { hasDrawn = true; document.getElementById('canvasHint').classList.add('hidden'); }
});

drawCanvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  const p = getPos(e);
  const size = +document.getElementById('brushSize').value;
  curStroke.push(p);
  if (mode === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = size * 4;
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = size;
  }
  ctx.lineTo(p.x, p.y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(p.x, p.y);
});

drawCanvas.addEventListener('mouseup',    endStroke);
drawCanvas.addEventListener('mouseleave', endStroke);

function endStroke() {
  if (!drawing) return; drawing = false;
  ctx.globalCompositeOperation = 'source-over';
  if (curStroke.length > 0 && mode !== 'eraser') { allStrokes.push([...curStroke]); drawGuides(); }
  curStroke = [];
}

drawCanvas.addEventListener('touchstart', e => {
  e.preventDefault();
  drawCanvas.dispatchEvent(new MouseEvent('mousedown', { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }));
}, { passive: false });
drawCanvas.addEventListener('touchmove', e => {
  e.preventDefault();
  drawCanvas.dispatchEvent(new MouseEvent('mousemove', { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }));
}, { passive: false });
drawCanvas.addEventListener('touchend', () => drawCanvas.dispatchEvent(new MouseEvent('mouseup')));

// Brush size live update
document.getElementById('brushSize').addEventListener('input', e => {
  document.getElementById('sizeVal').textContent = e.target.value;
});

function setMode(m) {
  mode = m;
  drawCanvas.style.cursor = m === 'eraser' ? 'cell' : 'crosshair';
  document.getElementById('penBtn').classList.toggle('active', m === 'pen');
  document.getElementById('eraserBtn').classList.toggle('active', m === 'eraser');
}
function setColor(c, el) {
  strokeColor = c;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  if (mode === 'eraser') setMode('pen');
}
function clearAll() {
  initCanvases(); allStrokes = []; hasDrawn = false;
  document.getElementById('canvasHint').classList.remove('hidden');
  showEmpty(); setStatus('idle', 'Draw Modi characters and click Convert');
}

// ── Status ──
function setStatus(s, t) {
  document.getElementById('statusDot').className    = 'status-indicator ' + s;
  document.getElementById('statusText').textContent = t;
}
function setUploadStatus(s, t) {
  document.getElementById('uploadStatusDot').className    = 'status-indicator ' + s;
  document.getElementById('uploadStatusText').textContent = t;
}

// ── UI States ──
function showEmpty() {
  document.getElementById('emptyState').style.display   = 'flex';
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('resultState').style.display  = 'none';
  document.getElementById('outputBadge').style.display  = 'none';
}
function showLoading() {
  document.getElementById('emptyState').style.display   = 'none';
  document.getElementById('loadingState').style.display = 'flex';
  document.getElementById('resultState').style.display  = 'none';
  document.getElementById('outputBadge').style.display  = 'none';
}
function showResult() {
  document.getElementById('emptyState').style.display   = 'none';
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('resultState').style.display  = 'flex';
  document.getElementById('outputBadge').style.display  = 'flex';
}

// ── Segmentation ──
function segmentStrokes() {
  if (allStrokes.length === 0) return [];
  const rect = drawCanvas.getBoundingClientRect();
  const boxes = allStrokes.map(stroke => {
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
    stroke.forEach(p => { if(p.x<minX)minX=p.x; if(p.x>maxX)maxX=p.x; if(p.y<minY)minY=p.y; if(p.y>maxY)maxY=p.y; });
    return { minX, maxX, minY, maxY };
  });
  boxes.sort((a,b) => ((a.minX+a.maxX)/2) - ((b.minX+b.maxX)/2));
  const GAP = rect.width * 0.08;
  const groups=[]; let current=[boxes[0]], curMaxX=boxes[0].maxX;
  for (let i=1; i<boxes.length; i++) {
    const box=boxes[i];
    if (box.minX - curMaxX > GAP) { groups.push(current); current=[box]; curMaxX=box.maxX; }
    else { current.push(box); if(box.maxX>curMaxX) curMaxX=box.maxX; }
  }
  groups.push(current);
  return groups;
}

function drawGuides() {
  const rect=drawCanvas.getBoundingClientRect();
  const W=rect.width, H=rect.height;
  const groups=segmentStrokes();
  gCtx.clearRect(0,0,W,H);
  if (groups.length<=1) return;
  gCtx.strokeStyle='rgba(124,110,245,0.4)';
  gCtx.lineWidth=1; gCtx.setLineDash([3,5]);
  for (let i=0; i<groups.length-1; i++) {
    const rx=Math.max(...groups[i].map(b=>b.maxX));
    const lx=Math.min(...groups[i+1].map(b=>b.minX));
    const mx=(rx+lx)/2;
    gCtx.beginPath(); gCtx.moveTo(mx,6); gCtx.lineTo(mx,H-6); gCtx.stroke();
  }
  gCtx.setLineDash([]);
  setStatus('idle', `${groups.length} character(s) detected — click Convert`);
}

function cropSegment(group) {
  const rect=drawCanvas.getBoundingClientRect();
  const W=rect.width, H=rect.height;
  const PAD=16, DPR=devicePixelRatio;
  let minX=Math.max(0,Math.min(...group.map(b=>b.minX))-PAD);
  let maxX=Math.min(W,Math.max(...group.map(b=>b.maxX))+PAD);
  let minY=Math.max(0,Math.min(...group.map(b=>b.minY))-PAD);
  let maxY=Math.min(H,Math.max(...group.map(b=>b.maxY))+PAD);
  const segW=maxX-minX, segH=maxY-minY;
  const off=document.createElement('canvas'); off.width=224; off.height=224;
  const oc=off.getContext('2d');
  oc.fillStyle='#fdfaf5'; oc.fillRect(0,0,224,224);
  const scale=Math.min(196/segW,196/segH);
  const dW=segW*scale, dH=segH*scale;
  const dX=(224-dW)/2, dY=(224-dH)/2;
  oc.drawImage(drawCanvas, minX*DPR, minY*DPR, segW*DPR, segH*DPR, dX, dY, dW, dH);
  return off.toDataURL('image/png').split(',')[1];
}

async function predictOne(b64) {
  const res = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: b64 })
  });
  if (!res.ok) throw new Error('Server ' + res.status);
  const d = await res.json();
  return d.top_predictions[0];
}

async function convertWord() {
  if (!hasDrawn || allStrokes.length === 0) { setStatus('idle','Please draw a Modi word first'); return; }
  const groups = segmentStrokes();
  if (groups.length === 0) { setStatus('idle','Nothing detected'); return; }
  setStatus('thinking','Converting…'); showLoading();
  try {
    const devChars=[];
    for (let i=0; i<groups.length; i++) {
      document.getElementById('loadingText').textContent = `Reading ${i+1} of ${groups.length}…`;
      const b64=cropSegment(groups[i]);
      const pred=await predictOne(b64);
      devChars.push(MODI_TO_DEV[pred.class] || '?');
    }
    const fullWord = devChars.join('');
    displayWord(fullWord, `${groups.length} character(s) recognised`);
    setStatus('done', `Done — ${groups.length} char(s) → ${fullWord}`);
  } catch(err) {
    console.error(err); showEmpty();
    setStatus('idle','❌ Flask server not running on port 5000');
  }
}

function displayWord(word, meta) {
  showResult();
  const el=document.getElementById('devWord');
  el.classList.remove('show');
  el.textContent=word;
  document.getElementById('resultMeta').textContent = meta || '';
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
}

// ── Upload Feature ──
let uploadedFile = null;

function onDragOver(e) { e.preventDefault(); document.getElementById('uploadZone').classList.add('drag-over'); }
function onDragLeave(e) { document.getElementById('uploadZone').classList.remove('drag-over'); }
function onDrop(e) {
  e.preventDefault(); document.getElementById('uploadZone').classList.remove('drag-over');
  const file=e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) loadUploadedFile(file);
  else setUploadStatus('idle','Please drop a valid image file');
}
function onFileSelect(e) { const file=e.target.files[0]; if(file) loadUploadedFile(file); }

function loadUploadedFile(file) {
  uploadedFile=file;
  const reader=new FileReader();
  reader.onload=ev => {
    document.getElementById('previewImg').src=ev.target.result;
    document.getElementById('uploadZone').style.display='none';
    document.getElementById('previewArea').style.display='flex';
    document.getElementById('uploadBtnRow').style.display='flex';
    setUploadStatus('idle', `"${file.name}" ready — click Convert`);
    showEmpty();
  };
  reader.readAsDataURL(file);
}

function clearUpload() {
  uploadedFile=null;
  document.getElementById('fileInput').value='';
  document.getElementById('previewImg').src='';
  document.getElementById('uploadZone').style.display='flex';
  document.getElementById('previewArea').style.display='none';
  document.getElementById('uploadBtnRow').style.display='none';
  setUploadStatus('idle','Upload a Modi character image to convert');
  showEmpty();
}

function encodeUploadedImage(file) {
  return new Promise((resolve,reject) => {
    const img=new Image();
    const url=URL.createObjectURL(file);
    img.onload=()=>{
      const off=document.createElement('canvas'); off.width=224; off.height=224;
      const oc=off.getContext('2d');
      oc.fillStyle='#fdfaf5'; oc.fillRect(0,0,224,224);
      const scale=Math.min(196/img.width,196/img.height);
      const dW=img.width*scale, dH=img.height*scale;
      oc.drawImage(img,(224-dW)/2,(224-dH)/2,dW,dH);
      URL.revokeObjectURL(url);
      resolve(off.toDataURL('image/png').split(',')[1]);
    };
    img.onerror=()=>{ URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src=url;
  });
}

async function convertUpload() {
  if (!uploadedFile) { setUploadStatus('idle','Please upload an image first'); return; }
  setUploadStatus('thinking','Converting…'); showLoading();
  document.getElementById('loadingText').textContent='Analysing image…';
  try {
    const b64=await encodeUploadedImage(uploadedFile);
    const pred=await predictOne(b64);
    const dev=MODI_TO_DEV[pred.class] || '?';
    displayWord(dev, `"${pred.class}" · ${(pred.confidence*100).toFixed(1)}% confidence`);
    setUploadStatus('done', `Done — "${pred.class}" → ${dev}`);
  } catch(err) {
    console.error(err); showEmpty();
    setUploadStatus('idle','❌ Flask server not running on port 5000');
  }
}