const KEY='iconMediaDrafts';
const $=id=>document.getElementById(id);
const form=$('storyForm');
const fields=['title','deck','category','author','date','reading','image','body','featured'];
const today=new Date().toISOString().slice(0,10);
$('date').value=today;

function getDrafts(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
function setDrafts(items){localStorage.setItem(KEY,JSON.stringify(items))}
function slugify(text){return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)}
function value(id){return $(id).type==='checkbox'?$(id).checked:$(id).value.trim()}
function storyFromForm(){return{slug:slugify(value('title')),title:value('title'),deck:value('deck'),category:value('category'),author:value('author'),date:value('date'),reading:value('reading'),image:value('image'),body:value('body'),featured:value('featured'),savedAt:new Date().toISOString()}}
function updatePreview(){
  $('previewTitle').textContent=value('title')||'Tu titular aparecerá aquí';
  $('previewDeck').textContent=value('deck')||'La bajada de tu noticia aparecerá aquí.';
  $('previewCategory').textContent=(value('category')||'VIRAL').toUpperCase();
  $('previewAuthor').textContent=(value('author')||'REDACCIÓN ICON').toUpperCase();
  $('previewDate').textContent=value('date')||'HOY';
  const image=value('image'); const box=$('previewImage');
  if(image){box.style.backgroundImage=`url("${image.replace(/"/g,'')}")`;box.classList.add('has-image')}else{box.style.backgroundImage='';box.classList.remove('has-image')}
}
fields.forEach(id=>$(id).addEventListener('input',updatePreview));
form.addEventListener('submit',e=>{e.preventDefault();saveDraft()});
function saveDraft(){const story=storyFromForm();if(!story.title||!story.deck||!story.body){toast('Completa titular, bajada y contenido.');return}const drafts=getDrafts();const idx=drafts.findIndex(d=>d.slug===story.slug);if(idx>=0)drafts[idx]=story;else drafts.unshift(story);setDrafts(drafts);renderDrafts();$('saveStatus').textContent='GUARDADO';toast('Borrador guardado en este navegador.')}

$('publishBtn').addEventListener('click',publishStory);
async function publishStory(){
  const story=storyFromForm();
  const password=$('adminPassword').value;
  if(!story.title||!story.deck||!story.body){toast('Completa titular, bajada y contenido.');return}
  if(!password){toast('Escribe la contraseña editorial.');$('adminPassword').focus();return}
  const button=$('publishBtn');
  button.disabled=true;button.textContent='PUBLICANDO…';$('saveStatus').textContent='PUBLICANDO';
  try{
    const response=await fetch('/api/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password,article:story})});
    let data={};try{data=await response.json()}catch{}
    if(!response.ok)throw new Error(data.error||'No se pudo publicar la noticia.');
    $('saveStatus').textContent='PUBLICADA';
    toast('✓ Noticia publicada correctamente.');
    $('adminPassword').value='';
    const drafts=getDrafts().filter(d=>d.slug!==story.slug);setDrafts(drafts);renderDrafts();
    setTimeout(()=>{window.location.href='article.html?slug='+encodeURIComponent(data.slug||story.slug)},700);
  }catch(error){
    $('saveStatus').textContent='ERROR';
    toast(error.message.includes('Failed to fetch')?'No se encontró /api/publish. Conecta el proyecto con Vercel para publicar.':error.message);
  }finally{button.disabled=false;button.textContent='PUBLICAR'}
}

$('previewBtn').addEventListener('click',()=>{updatePreview();$('previewImage').scrollIntoView({behavior:'smooth',block:'center'});toast('Vista previa actualizada.')});
$('clearBtn').addEventListener('click',()=>{form.reset();$('date').value=today;$('adminPassword').value='';updatePreview();$('saveStatus').textContent='SIN GUARDAR'});
function renderDrafts(){const list=$('draftList');const drafts=getDrafts();if(!drafts.length){list.innerHTML='<p class="empty-state">Todavía no hay borradores guardados en este navegador.</p>';return}list.innerHTML=drafts.map((d,i)=>`<div class="draft-item"><div><strong>${escapeHtml(d.title)}</strong><small>${escapeHtml(d.category.toUpperCase())} · ${escapeHtml(d.date)}${d.featured?' · EN PORTADA':''}</small></div><button data-load="${i}">Editar</button><button data-delete="${i}">Eliminar</button></div>`).join('');list.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>loadDraft(Number(b.dataset.load)));list.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{const drafts=getDrafts();drafts.splice(Number(b.dataset.delete),1);setDrafts(drafts);renderDrafts();toast('Borrador eliminado.')})}
function loadDraft(i){const d=getDrafts()[i];fields.forEach(id=>{if(id==='featured')$(id).checked=!!d[id];else $(id).value=d[id]||''});updatePreview();$('saveStatus').textContent='EDITANDO';window.scrollTo({top:0,behavior:'smooth'});toast('Borrador cargado.')}
$('exportBtn').addEventListener('click',()=>{const data=JSON.stringify(getDrafts(),null,2);const blob=new Blob([data],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='icon-media-drafts.json';a.click();URL.revokeObjectURL(a.href);toast('JSON exportado.')});
function escapeHtml(s){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove('show'),3500)}
renderDrafts();updatePreview();