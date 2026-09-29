'use strict';
// EDIT ONLY HERE to update the website links and contract.
function configureLinks() {
  return {
    x: 'https://x.com/horsecleyton',
    pump: 'https://pump.fun/coin/DBZSF6kFefESpTcJVDVrKK15oaZvB7PSXvnPY3apump',
    contract: 'DBZSF6kFefESpTcJVDVrKK15oaZvB7PSXvnPY3apump'
  };
}
const WEBSITE = configureLinks();
const CONTRACT_ADDRESS = WEBSITE.contract;
function applyLinks() {
  document.querySelectorAll('[data-link="x"]').forEach(link => link.href = WEBSITE.x);
  document.querySelectorAll('[data-link="pump"]').forEach(link => link.href = WEBSITE.pump);
  document.querySelectorAll('[data-contract]').forEach(label => label.textContent = WEBSITE.contract);
}
applyLinks();
const imagePath = n => `assets/images/${n}.png`;
const videoPath = n => `assets/videos/${n}.mp4`;
const $ = selector => document.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let current = 0, paused = reducedMotion.matches, timer, transitioning = false;
const images = Array.from({length:4}, (_,i) => { const img = new Image(); img.src = imagePath(i+1); return img; });
const hero = $('#hero-image'), flash = $('.flash'), pause = $('#pause');
function updatePause(){pause.textContent = paused ? 'play session' : 'pause session';pause.setAttribute('aria-pressed', String(paused));}
function schedule(){clearTimeout(timer);if(!paused && !document.hidden && !$('#viewer').open) timer=setTimeout(()=>switchFrame(current+1),2400);}
function switchFrame(index){if(transitioning)return;transitioning=true;current=(index+4)%4;flash.classList.remove('fire');if(!reducedMotion.matches){void flash.offsetWidth;flash.classList.add('fire');}setTimeout(()=>{hero.src=imagePath(current+1);hero.alt=`Cleyton, photograph ${current+1}`;$('#frame').textContent=`FRAME 0${current+1} / 04`;transitioning=false;schedule();},reducedMotion.matches?0:90);}
pause.addEventListener('click',()=>{paused=!paused;updatePause();schedule();});
$('#previous').addEventListener('click',()=>switchFrame(current-1));$('#next').addEventListener('click',()=>switchFrame(current+1));
document.addEventListener('visibilitychange',schedule);
reducedMotion.addEventListener('change',()=>{paused=reducedMotion.matches;updatePause();schedule();});
const grid=$('#image-grid');
for(let n=1;n<=4;n++){const article=document.createElement('article');article.className='work';article.innerHTML=`<button class="media-button" aria-label="View Cleyton photograph ${n}"><img src="${imagePath(n)}" alt="Cleyton, photograph ${n}" loading="lazy"><span class="open-label">view ↗</span></button><div class="work-meta"><span>horse 0${n}</span><a href="${imagePath(n)}" download="cleyton-${n}.png">download ↓</a></div>`;article.querySelector('button').addEventListener('click',()=>openViewer('image',n-1));grid.append(article);}
const films=$('#video-grid');
for(let n=1;n<=7;n++){const article=document.createElement('article');article.className='work film';article.innerHTML=`<button class="media-button" aria-label="Play Cleyton film ${n}"><video muted playsinline preload="metadata" src="${videoPath(n)}#t=0.1" aria-hidden="true"></video><span class="film-number">VIDEO 0${n}</span><span class="play-icon">▶</span></button><div class="work-meta"><span>video 0${n}</span><a href="${videoPath(n)}" download="cleyton-film-${n}.mp4">download ↓</a></div>`;const vid=article.querySelector('video');vid.addEventListener('error',()=>{vid.hidden=true;const missing=document.createElement('span');missing.className='missing';missing.textContent=`film 0${n} — coming soon`;article.querySelector('button').append(missing);});article.querySelector('button').addEventListener('click',()=>openViewer('video',n-1));films.append(article);}
const viewer=$('#viewer');let mediaType='image',mediaIndex=0,opener;
function renderViewer(){const n=mediaIndex+1;const path=mediaType==='image'?imagePath(n):videoPath(n);const container=$('#viewer-content');const oldVideo=container.querySelector('video');if(oldVideo)oldVideo.pause();container.replaceChildren();const media=document.createElement(mediaType==='image'?'img':'video');media.src=path;if(mediaType==='image')media.alt=`Cleyton, photograph ${n}`;else{media.controls=true;media.playsInline=true;media.autoplay=true;media.preload='metadata';}media.addEventListener('error',()=>{container.replaceChildren();const message=document.createElement('p');message.textContent=mediaType==='video'?'This film is not available yet.':'This photograph is not available yet.';container.append(message);});container.append(media);$('#viewer-title').textContent=`${mediaType==='image'?'PHOTOGRAPH':'FILM'} 0${n} / 0${mediaType==='image'?4:7}`;const dl=$('#viewer-download');dl.href=path;dl.download=`cleyton-${mediaType}-${n}.${mediaType==='image'?'png':'mp4'}`;}
function openViewer(type,index){opener=document.activeElement;mediaType=type;mediaIndex=index;clearTimeout(timer);renderViewer();viewer.showModal();document.body.style.overflow='hidden';$('#close').focus();}
function navigateViewer(delta){mediaIndex=(mediaIndex+delta+(mediaType==='image'?4:7))%(mediaType==='image'?4:7);renderViewer();}
$('#portrait').addEventListener('click',()=>openViewer('image',current));$('#close').addEventListener('click',()=>viewer.close());$('#viewer-prev').addEventListener('click',()=>navigateViewer(-1));$('#viewer-next').addEventListener('click',()=>navigateViewer(1));viewer.addEventListener('close',()=>{const video=viewer.querySelector('video');if(video)video.pause();$('#viewer-content').replaceChildren();document.body.style.overflow='';opener?.focus();schedule();});
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,video'))return;if(viewer.open){if(e.key==='ArrowLeft'){e.preventDefault();navigateViewer(-1);}if(e.key==='ArrowRight'){e.preventDefault();navigateViewer(1);}}});
let toastTimer;function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2500);}
async function copyContract(){try{if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(CONTRACT_ADDRESS);}else{const input=document.createElement('textarea');input.value=CONTRACT_ADDRESS;input.style.cssText='position:fixed;left:-9999px';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();if(!ok)throw new Error('Copy failed');}toast('copied!!! neigh.');}catch{toast('Copy unavailable — ' + CONTRACT_ADDRESS);}}
document.querySelectorAll('.copy').forEach(button=>button.addEventListener('click',copyContract));updatePause();schedule();

// Keep a readable name if the local logo has not been added yet.
const logo=document.querySelector('.brand img');logo.addEventListener('error',()=>{logo.replaceWith(document.createTextNode('cleyton'));});

// Close on the backdrop or empty space around the media.
viewer.addEventListener('click', event => {
  if (event.target === viewer || event.target === document.querySelector('#viewer-content')) viewer.close();
});
