// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════
const DB=[
  {id:1,name:"Fresh Tomatoes",price:1.50,emoji:"🍅",cat:"food",size:"Medium",colour:"Red",texture:"Smooth",material:"Natural",details:"Freshly harvested, organic",continent:"Africa",country:"Kenya",county:"Nairobi",subcounty:"Westlands",district:"Parklands",otherLoc:"Near the market",seller:"Mary's Farm",sellerCat:"Food & Groceries",phone:"+254712345678",email:"mary@marysfarm.com",url:"https://marysfarm.com",logistics:"Local Delivery",loc:"Nairobi, Kenya"},
  {id:2,name:"Ankara Dress",price:15.00,emoji:"👗",cat:"fashion",size:"L",colour:"Multicolour",texture:"Smooth",material:"Cotton",details:"Handmade, authentic Ankara print",continent:"Africa",country:"Nigeria",county:"Lagos",subcounty:"Ikeja",district:"Central",seller:"Ade Fashion",sellerCat:"Clothing & Fashion",phone:"+2348012345678",email:"ade@adefashion.com",url:"",logistics:"National Delivery",loc:"Lagos, Nigeria"},
  {id:3,name:"Phone Case",price:3.50,emoji:"📱",cat:"electronics",size:"Universal",colour:"Black",texture:"Rough",material:"Plastic",details:"Fits most smartphones",continent:"Africa",country:"Ghana",county:"Accra",subcounty:"Osu",district:"Cantonments",seller:"Tech Shop",sellerCat:"Electronics",phone:"+233201234567",email:"info@techshop.com",url:"",logistics:"Local Delivery",loc:"Accra, Ghana"},
  {id:4,name:"Handmade Basket",price:8.00,emoji:"🧺",cat:"crafts",size:"Large",colour:"Brown",texture:"Rough",material:"Straw",details:"Traditional handwoven",continent:"Africa",country:"Uganda",county:"Kampala",subcounty:"Nakasero",district:"Central",seller:"Craft World",sellerCat:"Crafts & Handmade",phone:"+256701234567",email:"crafts@craftworld.com",url:"",logistics:"Local Delivery",loc:"Kampala, Uganda"},
  {id:5,name:"Rice 5kg",price:5.00,emoji:"🍚",cat:"food",size:"5kg",colour:"White",texture:"Smooth",material:"Natural",details:"Premium quality long grain",continent:"Africa",country:"Tanzania",county:"Dar es Salaam",subcounty:"",district:"",seller:"Grain Store",sellerCat:"Food & Groceries",phone:"+255712345678",email:"",url:"",logistics:"Local Delivery",loc:"Dar es Salaam, Tanzania"},
  {id:6,name:"Wooden Chair",price:25.00,emoji:"🪑",cat:"furniture",size:"Standard",colour:"Brown",texture:"Smooth",material:"Wood",details:"Hand-carved solid mahogany",continent:"Africa",country:"Kenya",county:"Nairobi",subcounty:"",district:"",seller:"Wood Works",sellerCat:"Furniture",phone:"+254701234567",email:"",url:"",logistics:"Local Delivery",loc:"Nairobi, Kenya"},
  {id:7,name:"T-Shirt",price:7.00,emoji:"👕",cat:"fashion",size:"XL",colour:"Blue",texture:"Soft",material:"Cotton",details:"100% cotton breathable",continent:"Africa",country:"Nigeria",county:"Lagos",subcounty:"",district:"",seller:"Fashion Hub",sellerCat:"Clothing & Fashion",phone:"+2348098765432",email:"",url:"",logistics:"National Delivery",loc:"Lagos, Nigeria"},
  {id:8,name:"Earphones",price:10.00,emoji:"🎧",cat:"electronics",size:"One Size",colour:"Black",texture:"Smooth",material:"Plastic",details:"Clear sound, noise cancelling",continent:"Africa",country:"Ghana",county:"Accra",subcounty:"",district:"",seller:"Electronics Plus",sellerCat:"Electronics",phone:"+233209876543",email:"",url:"",logistics:"Local Delivery",loc:"Accra, Ghana"},
  {id:9,name:"Silk Saree",price:22.00,emoji:"🧣",cat:"fashion",size:"One Size",colour:"Red",texture:"Smooth",material:"Silk",details:"Traditional Indian weave",continent:"Asia",country:"India",county:"Mumbai",subcounty:"",district:"",seller:"Mumbai Textiles",sellerCat:"Clothing & Fashion",phone:"+912212345678",email:"",url:"",logistics:"International",loc:"Mumbai, India"},
  {id:10,name:"Olive Oil 1L",price:9.00,emoji:"🫙",cat:"food",size:"1L",colour:"Yellow",texture:"Smooth",material:"Natural",details:"Extra virgin cold pressed",continent:"Europe",country:"Greece",county:"Crete",subcounty:"",district:"",seller:"Greek Farm",sellerCat:"Food & Groceries",phone:"+302812345678",email:"",url:"",logistics:"International",loc:"Crete, Greece"},
];

const SAMPLE_ORDERS=[
  {id:'ORD001',productName:"Fresh Tomatoes",emoji:"🍅",seller:"Mary's Farm",quantity:2,price:3.00,status:'on_the_way',date:'20 Feb 2026',phone:'+254712345678'},
  {id:'ORD002',productName:"Ankara Dress",emoji:"👗",seller:"Ade Fashion",quantity:1,price:15.00,status:'confirmed',date:'19 Feb 2026',phone:'+2348012345678'},
  {id:'ORD003',productName:"Handmade Basket",emoji:"🧺",seller:"Craft World",quantity:1,price:8.00,status:'delivered',date:'15 Feb 2026',phone:'+256701234567'},
];

// ═══════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════
let curView='home';
function go(view){
  const cur=document.getElementById('v-'+curView);
  cur.classList.add('exit');
  setTimeout(()=>{
    cur.classList.remove('active','exit');
    curView=view;
    const next=document.getElementById('v-'+view);
    next.classList.add('active');
    next.scrollTop=0;
    window.scrollTo(0,0);
    aiUpdateContext(view);
    if(view==='results') loadResults();
    if(view==='orders') loadOrders();
    if(view==='office') loadSeller();
  },250);
}

// ═══════════════════════════════════════════
// HOME / SEARCH
// ═══════════════════════════════════════════
const CMAP={africa:'DZ,AO,BJ,BW,BF,BI,CM,CV,CF,TD,KM,CG,CD,CI,DJ,EG,GQ,ER,ET,GA,GM,GH,GN,GW,KE,LS,LR,LY,MG,MW,ML,MR,MU,MA,MZ,NA,NE,NG,RW,ST,SN,SL,SO,ZA,SS,SD,SZ,TZ,TG,TN,UG,ZM,ZW',asia:'AF,AM,AZ,BH,BD,BT,BN,KH,CN,CY,GE,IN,ID,IR,IQ,IL,JP,JO,KZ,KW,KG,LA,LB,MY,MV,MN,MM,NP,KP,OM,PK,PH,QA,SA,SG,LK,SY,TW,TJ,TH,TL,TR,TM,AE,UZ,VN,YE',europe:'AL,AD,AT,BY,BE,BA,BG,HR,CZ,DK,EE,FI,FR,DE,GR,HU,IS,IE,IT,LV,LI,LT,LU,MT,MD,MC,ME,NL,MK,NO,PL,PT,RO,RU,SM,RS,SK,SI,ES,SE,CH,UA,GB,VA',north_america:'AG,BS,BB,BZ,CA,CR,CU,DM,DO,SV,GD,GT,HT,HN,JM,MX,NI,PA,KN,LC,VC,TT,US',south_america:'AR,BO,BR,CL,CO,EC,GY,PY,PE,SR,UY,VE',australia:'AU,FJ,KI,MH,FM,NR,NZ,PW,PG,WS,SB,TO,TV,VU'};

function getCont(code){if(!code)return'';const u=code.toUpperCase();for(const[c,v]of Object.entries(CMAP))if(v.split(',').includes(u))return c;return'';}

async function getGPS(){
  const btn=document.getElementById('gpsbtn'),ban=document.getElementById('gpsbanner');
  if(!navigator.geolocation){showHerr('GPS not supported.');return;}
  btn.disabled=true;btn.classList.add('loading');btn.innerHTML='<span>📡</span> Locating...';
  navigator.geolocation.getCurrentPosition(async pos=>{
    try{
      const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
      const d=await r.json();const a=d.address;
      if(a.country)g('hcountry').value=a.country;
      if(a.state||a.region)g('hcounty').value=a.state||a.region;
      if(a.suburb||a.town||a.city_district)g('hsubc').value=a.suburb||a.town||a.city_district;
      if(a.district||a.county)g('hdist').value=a.district||a.county;
      const c=getCont(a.country_code);if(c)g('hcont').value=c;
      const city=a.city||a.town||a.village||a.state;
      ban.textContent=`✅ Location found: ${city?city+', ':''}${a.country}`;ban.style.display='block';
      btn.innerHTML='<span>✅</span> Located!';
    }catch(e){btn.disabled=false;btn.classList.remove('loading');btn.innerHTML='<span>📡</span> Use My Location';showHerr('Could not read location.');}
  },e=>{btn.disabled=false;btn.classList.remove('loading');btn.innerHTML='<span>📡</span> Use My Location';const m={1:'Location access denied.',2:'Could not detect.',3:'Timed out.'};showHerr(m[e.code]||'Could not get location.');},{timeout:10000});
}

function showHerr(msg){const el=g('herr');el.textContent='⚠️ '+msg;el.style.display='block';el.scrollIntoView({behavior:'smooth',block:'center'});}

function doSearch(){
  const prod=g('hprod').value.trim(),country=g('hcountry').value.trim(),cont=g('hcont').value,county=g('hcounty').value.trim(),min=g('hmin').value,max=g('hmax').value;
  g('herr').style.display='none';
  if(!prod&&!country&&!cont&&!county){showHerr('Please enter at least a product name or location!');return;}
  if(min&&max&&parseFloat(min)>parseFloat(max)){showHerr('Min price cannot be greater than max price!');return;}
  window._SP={product:prod,minPrice:min,maxPrice:max,size:g('hsize').value.trim(),colour:g('hcol').value.trim(),texture:g('htex').value.trim(),material:g('hmat').value.trim(),continent:cont,country,county,subcounty:g('hsubc').value.trim(),district:g('hdist').value.trim()};
  go('results');
}

function quickCat(cat){window._SP={category:cat};go('results');}

// ═══════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════
let rfil=[],rorig=[];

function skeleton(){
  g('rlist').innerHTML=Array(4).fill(`<div class="sk"><div class="ski"></div><div class="skb"><div class="skl a"></div><div class="skl b"></div><div class="skl c"></div><div class="skl d"></div></div></div>`).join('');
  g('rcount').textContent='Searching...';
}

function loadResults(){
  skeleton();
  setTimeout(()=>{
    const p=window._SP||{};
    let txt='';if(p.product)txt+=`"${p.product}" `;if(p.country)txt+=`in ${p.country} `;if(p.category)txt+=`Category: ${p.category}`;
    g('rsummary').innerHTML=`Searching: <span>${txt||'All Products'}</span>`;
    rfil=DB.filter(x=>{
      if(p.product&&!x.name.toLowerCase().includes(p.product.toLowerCase()))return false;
      if(p.colour&&!x.colour.toLowerCase().includes(p.colour.toLowerCase()))return false;
      if(p.size&&!x.size.toLowerCase().includes(p.size.toLowerCase()))return false;
      if(p.material&&!x.material.toLowerCase().includes(p.material.toLowerCase()))return false;
      if(p.texture&&!x.texture.toLowerCase().includes(p.texture.toLowerCase()))return false;
      if(p.country&&!x.country.toLowerCase().includes(p.country.toLowerCase()))return false;
      if(p.continent&&x.continent.toLowerCase()!==p.continent.toLowerCase())return false;
      if(p.category&&x.cat!==p.category)return false;
      if(p.minPrice&&x.price<parseFloat(p.minPrice))return false;
      if(p.maxPrice&&x.price>parseFloat(p.maxPrice))return false;
      return true;
    });
    rorig=[...rfil];renderResults();
  },700);
}

function renderResults(){
  const list=g('rlist');
  if(!rfil.length){g('rcount').textContent='0 found';list.innerHTML=`<div class="empty"><div class="eico">📡</div><h3>No products found</h3><p>Try different filters</p><br><button class="shopbtn" onclick="go('home')">← Back to Search</button></div>`;return;}
  g('rcount').textContent=`${rfil.length} product(s) found`;
  list.innerHTML=rfil.map((p,i)=>`<div class="pcard" style="animation-delay:${i*.06}s" onclick="viewProduct(${p.id})"><div class="pthumb">${p.emoji}</div><div class="pinfo"><h4>${p.name}</h4><div class="price">$${p.price.toFixed(2)}</div><div class="tags">${p.size?`<span class="tag">📏 ${p.size}</span>`:''} ${p.colour?`<span class="tag">🎨 ${p.colour}</span>`:''} ${p.material?`<span class="tag">🧱 ${p.material}</span>`:''}</div><div class="pseller">🏪 ${p.seller}</div><div class="ploc">📍 ${p.loc}</div><button class="vbtn" onclick="event.stopPropagation();viewProduct(${p.id})">View & Order</button></div></div>`).join('');
}

function rsort(type,btn){
  document.querySelectorAll('.sortbtn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');
  if(type==='price_low')rfil.sort((a,b)=>a.price-b.price);
  else if(type==='price_high')rfil.sort((a,b)=>b.price-a.price);
  else if(type==='newest')rfil.sort((a,b)=>b.id-a.id);
  else rfil=[...rorig];
  renderResults();
}

function viewProduct(id){window._PID=id;go('product');loadProduct();}

// ═══════════════════════════════════════════
// PRODUCT
// ═══════════════════════════════════════════
let _p=null,_qty=1,_ot='unique';

function loadProduct(){
  _p=DB.find(x=>x.id===window._PID)||DB[0];
  const s=id=>document.getElementById(id);
  s('ppname').textContent=_p.name; s('ppprice').textContent='$'+_p.price.toFixed(2);
  s('pmainimg').textContent=_p.emoji; s('pt0').textContent=_p.emoji;
  s('pdsize').textContent=_p.size||'-'; s('pdcol').textContent=_p.colour||'-';
  s('pdtex').textContent=_p.texture||'-'; s('pdmat').textContent=_p.material||'-'; s('pdother').textContent=_p.details||'-';
  s('plcont').textContent=_p.continent||'-'; s('plcountry').textContent=_p.country||'-';
  s('plcounty').textContent=_p.county||'-'; s('plsubc').textContent=_p.subcounty||'-';
  s('pldist').textContent=_p.district||'-'; s('plother').textContent=_p.otherLoc||'-';
  s('psname').textContent=_p.seller||'-'; s('psscat').textContent=_p.sellerCat||'-';
  s('plbadge').textContent=_p.logistics||'-';
  s('pconfirm').style.display='none';_qty=1;_ot='unique';
  document.querySelectorAll('.otbtn').forEach(b=>b.classList.remove('on'));
  document.querySelectorAll('.otbtn')[0].classList.add('on');
  s('pqtyrow').style.display='none'; s('pqtyn').textContent='1';
  if(_p.phone){s('pcphone').textContent=_p.phone;s('pph').href='tel:'+_p.phone;}
  if(_p.email){s('pcemail').textContent=_p.email;s('pem').href=`mailto:${_p.email}?subject=Inquiry about ${encodeURIComponent(_p.name)}`;}
  if(_p.url){s('pcurl').textContent=_p.url;s('pwb').href=_p.url.startsWith('http')?_p.url:'https://'+_p.url;}else s('pwb').style.display='none';
  s('psharelink').value=`https://bizradar.app/product?id=${_p.id}`;
}

function contactWA(){window.open(`https://wa.me/${_p.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hello! I found "${_p.name}" on Biz Radar. I'm interested!`)}`,'_blank');}

function setOT(type,btn){_ot=type;document.querySelectorAll('.otbtn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');g('pqtyrow').style.display=type==='multiple'?'flex':'none';if(type==='unique')_qty=1;}
function chgQty(n){_qty=Math.max(1,_qty+n);g('pqtyn').textContent=_qty;}

function placeOrder(){
  const c=g('pconfirm');c.style.display='block';c.scrollIntoView({behavior:'smooth',block:'center'});
  const order={id:'ORD'+Date.now(),productName:_p.name,emoji:_p.emoji,seller:_p.seller,quantity:_qty,price:_p.price*_qty,status:'pending',date:new Date().toLocaleDateString()};
  const orders=JSON.parse(sessionStorage.getItem('myOrders')||'[]');orders.unshift(order);sessionStorage.setItem('myOrders',JSON.stringify(orders));
  if(_p.phone)setTimeout(()=>window.open(`https://wa.me/${_p.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi! I'd like to order ${_qty}x "${_p.name}". Please confirm.`)}`,'_blank'),800);
}

function openShare(){g('shareModal').classList.add('open');}
function closeShare(){g('shareModal').classList.remove('open');}

function shareVia(platform){
  const url=encodeURIComponent(`https://bizradar.app/product?id=${_p.id}`),text=encodeURIComponent(`Check out "${_p.name}" on Biz Radar! $${_p.price.toFixed(2)} 🌍`);
  const links={whatsapp:`https://wa.me/?text=${text}%20${url}`,facebook:`https://www.facebook.com/sharer/sharer.php?u=${url}`,twitter:`https://twitter.com/intent/tweet?text=${text}&url=${url}`,telegram:`https://t.me/share/url?url=${url}&text=${text}`,sms:`sms:?body=${text}%20${url}`,email:`mailto:?subject=Check this on Biz Radar&body=${text}%20${url}`};
  if(platform==='native'&&navigator.share){navigator.share({title:_p.name,url:`https://bizradar.app/product?id=${_p.id}`});return;}
  if(links[platform])window.open(links[platform],'_blank');
}

function copyLink(){
  navigator.clipboard.writeText(g('psharelink').value).then(()=>{const b=document.querySelector('.cpbtn');b.textContent='✅ Copied!';b.style.background='#27ae60';setTimeout(()=>{b.textContent='📋 Copy';b.style.background='';},2000);});
}

g('shareModal').addEventListener('click',function(e){if(e.target===this)closeShare();});

// ═══════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════
const OSTATUS={pending:{label:'⏳ Pending',cls:'bp',steps:[1,0,0,0]},confirmed:{label:'✅ Confirmed',cls:'bc',steps:[1,1,0,0]},on_the_way:{label:'🚚 On the Way',cls:'bo',steps:[1,1,1,0]},delivered:{label:'🎉 Delivered',cls:'bd',steps:[1,1,1,1]},cancelled:{label:'❌ Cancelled',cls:'bx',steps:[0,0,0,0]}};
const OSTEPS=[{icon:'📝',label:'Placed'},{icon:'✅',label:'Confirmed'},{icon:'🚚',label:'On the Way'},{icon:'🎉',label:'Delivered'}];
let allOrders=[],ocur='all';

function loadOrders(){const sess=JSON.parse(sessionStorage.getItem('myOrders')||'[]');allOrders=[...sess,...SAMPLE_ORDERS];renderOrders();}

function ofilter(status,tab){ocur=status;document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));tab.classList.add('on');renderOrders();}

function renderOrders(){
  const el=g('olist'),list=ocur==='all'?allOrders:allOrders.filter(o=>o.status===ocur);
  if(!list.length){el.innerHTML=`<div class="empty" style="padding:60px 20px"><div class="eico">📦</div><h3>No orders here</h3><p style="margin-bottom:20px">${ocur==='all'?"You haven't placed any orders yet":`No ${ocur} orders`}</p><button class="shopbtn" onclick="go('home')">🛍️ Start Shopping</button></div>`;return;}
  el.innerHTML=list.map((o,i)=>{
    const s=OSTATUS[o.status]||OSTATUS.pending;
    const tracker=OSTEPS.map((step,idx)=>{
      const done=s.steps[idx]===1,active=!done&&idx>0&&s.steps[idx-1]===1,lineD=idx<OSTEPS.length-1&&s.steps[idx]&&s.steps[idx+1]?'done':'';
      return`<div class="tstep"><div class="tdot ${done?'done':active?'active':''}">${done?'✓':step.icon}</div><div class="tlbl ${done?'done':active?'active':''}">${step.label}</div></div>${idx<OSTEPS.length-1?`<div class="tline ${lineD}"></div>`:''}`;
    }).join('');
    return`<div class="ocard" style="animation-delay:${i*.07}s"><div class="ohdr"><div><div class="oid">${o.id}</div><div class="odate">📅 ${o.date}</div></div><span class="badge ${s.cls}">${s.label}</span></div><div class="obody"><div class="oico">${o.emoji}</div><div class="oinf"><div class="oname">${o.productName}</div><div class="oseller">🏪 ${o.seller} · Qty: ${o.quantity}</div><div class="oprice">$${parseFloat(o.price).toFixed(2)}</div></div></div><div class="tracker"><div class="tsteps">${tracker}</div></div><div class="oacts">${o.status==='delivered'?`<button class="abtn abtnreorder" onclick="reorder('${o.id}')">🔄 Reorder</button>`:o.status==='pending'?`<button class="abtn abtncancel" onclick="ocancel('${o.id}')">❌ Cancel</button>`:''}<button class="abtn abtnwa" onclick="owa('${o.phone||''}','${o.productName}')">💬 WhatsApp</button></div></div>`;
  }).join('');
}

function ocancel(id){if(!confirm('Cancel this order?'))return;allOrders=allOrders.map(o=>o.id===id?{...o,status:'cancelled'}:o);const sess=JSON.parse(sessionStorage.getItem('myOrders')||'[]').map(o=>o.id===id?{...o,status:'cancelled'}:o);sessionStorage.setItem('myOrders',JSON.stringify(sess));renderOrders();}
function reorder(id){const o=allOrders.find(x=>x.id===id);if(o)alert(`Reordering ${o.productName}!\nConnecting you with ${o.seller}.`);}
function owa(phone,name){if(!phone){alert('Seller contact not available.');return;}window.open(`https://wa.me/${phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi! Following up on my "${name}" order from Biz Radar.`)}`,'_blank');}

// ═══════════════════════════════════════════
// SELLERS OFFICE
// ═══════════════════════════════════════════
const EMOJIS={food:'🍎',fashion:'👗',electronics:'📱',furniture:'🪑',crafts:'🎨',agriculture:'🌾',beauty:'💄',other:'📦'};
let products=[],imgs=[],editId=null;

function loadSeller(){
  const d=JSON.parse(sessionStorage.getItem('sellerData')||'null')||{storeName:"Mary's Fresh Farm",ceoName:"Mary Wanjiku",category:"Food & Groceries",country:"Kenya",county:"Nairobi",logistics:"Local Delivery",minPrice:1,maxPrice:50,url:"www.marysfarm.com",phone:"+254 712 345 678"};
  g('osname').textContent=d.storeName;g('osceo').textContent='CEO: '+(d.ceoName||'-');g('oscat').textContent=d.category||'-';
  g('odcountry').textContent=d.country||'-';g('odcounty').textContent=d.county||'-';g('odlog').textContent=d.logistics||'-';
  g('odprice').textContent=d.minPrice?`$${d.minPrice} – $${d.maxPrice}`:'-';g('odurl').textContent=d.url||'-';g('odphone').textContent=d.phone||'-';
  animCount('otviews',0,47,800);updateStats();
}

function animCount(id,from,to,dur){const el=g(id),t0=Date.now();const fn=()=>{const p=Math.min((Date.now()-t0)/dur,1);el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(fn);};requestAnimationFrame(fn);}
function updateStats(){animCount('otprod',0,products.length,400);g('optrend').textContent=products.length>0?`+${products.length} listed`:'';}

function prevImgs(e){Array.from(e.target.files).slice(0,5-imgs.length).forEach(f=>{if(f.size>5*1024*1024){toast('Image too large!');return;}const r=new FileReader();r.onload=ev=>{imgs.push(ev.target.result);renderImgs();};r.readAsDataURL(f);});}
function renderImgs(){g('oipgrid').innerHTML=imgs.map((s,i)=>`<div class="ipi"><img src="${s}"><button class="rm" onclick="rmImg(${i})">×</button></div>`).join('');}
function rmImg(i){imgs.splice(i,1);renderImgs();}

function openProd(){g('prodModal').classList.add('open');}
function closeProd(){
  g('prodModal').classList.remove('open');g('omerr').style.display='none';imgs=[];renderImgs();editId=null;
  ['opname','opmin','opmax','opsize','opcol','optex','opmat','opdesc','opstock'].forEach(id=>g(id).value='');
  g('opcat').value='';g('omtitle').textContent='➕ Add New Product';
}

function saveProd(){
  const name=g('opname').value.trim(),min=g('opmin').value,cat=g('opcat').value;
  if(!name||!min||!cat){g('omerr').style.display='block';return;}
  g('omerr').style.display='none';
  const max=g('opmax').value||min;
  const prod={id:editId||Date.now(),name,price:parseFloat(min),maxPrice:parseFloat(max),category:cat,emoji:EMOJIS[cat]||'📦',size:g('opsize').value.trim(),colour:g('opcol').value.trim(),texture:g('optex').value.trim(),material:g('opmat').value.trim(),desc:g('opdesc').value.trim(),stock:parseInt(g('opstock').value)||1,images:[...imgs],status:'active'};
  if(editId){const i=products.findIndex(p=>p.id===editId);if(i!==-1)products[i]=prod;toast('✅ Product updated!');}
  else{products.push(prod);toast(`✅ "${name}" added!`);}
  updateStats();renderProducts();closeProd();
}

function renderProducts(){
  g('opgrid').innerHTML=products.map((p,i)=>`<div class="pc" style="animation-delay:${i*.06}s"><div class="pcimg">${p.images&&p.images.length?`<img src="${p.images[0]}">`:`${p.emoji}`}</div><div class="pcnfo"><h4>${p.name}</h4><div class="pcpr">$${p.price.toFixed(2)}${p.maxPrice>p.price?'–$'+p.maxPrice.toFixed(2):''}</div><span class="pcst">● Active</span><div class="pcacts"><button class="pce" onclick="editProd(${p.id})">✏️ Edit</button><button class="pcd" onclick="delProd(${p.id})">🗑️</button></div></div></div>`).join('')+`<div class="addcard" onclick="openProd()"><div class="plus">+</div><p>Add Product</p></div>`;
}

function editProd(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  editId=id;g('omtitle').textContent='✏️ Edit Product';
  g('opname').value=p.name;g('opmin').value=p.price;g('opmax').value=p.maxPrice||'';g('opcat').value=p.category;
  g('opsize').value=p.size||'';g('opcol').value=p.colour||'';g('optex').value=p.texture||'';g('opmat').value=p.material||'';g('opdesc').value=p.desc||'';g('opstock').value=p.stock||1;
  imgs=p.images?[...p.images]:[];renderImgs();openProd();
}

function delProd(id){if(confirm('Delete this product?')){products=products.filter(p=>p.id!==id);updateStats();renderProducts();toast('🗑️ Deleted');}}
function openNotif(){g('notifModal').classList.add('open');g('nbadge').style.display='none';}
function closeNotif(){g('notifModal').classList.remove('open');}
function toast(msg){const t=document.createElement('div');t.textContent=msg;Object.assign(t.style,{position:'fixed',bottom:'80px',left:'50%',transform:'translateX(-50%)',background:'var(--ca)',color:'var(--tx)',padding:'10px 20px',borderRadius:'20px',fontSize:'13px',zIndex:'9999',border:'1px solid var(--cb)',boxShadow:'0 4px 20px rgba(0,0,0,.4)',whiteSpace:'nowrap'});document.body.appendChild(t);setTimeout(()=>t.remove(),2500);}
g('prodModal').addEventListener('click',function(e){if(e.target===this)closeProd();});
g('notifModal').addEventListener('click',function(e){if(e.target===this)closeNotif();});

// ═══════════════════════════════════════════
// AI COWORKER
// ═══════════════════════════════════════════
const AI_CTX={
  home:{label:'Search Assistant',greeting:"Hey! I'm Radar AI 👋 Describe what you need in plain words and I'll help you find it!",quick:['Help me search','Find a product for me','What can you do?'],sys:"You are Radar AI, a shopping assistant on Biz Radar - a global marketplace connecting buyers to local sellers worldwide. Help buyers find products by understanding their needs in plain language. Suggest search terms, categories, price ranges and filters. Keep replies short (2-3 sentences). Be warm and practical."},
  results:{label:'Results Guide',greeting:"I can see you're browsing results! Need help comparing or refining?",quick:['Refine my search','Compare prices','Best product for me'],sys:"You are Radar AI helping a buyer review search results on Biz Radar. Help them refine searches, compare options, understand pricing and logistics. Be concise and actionable. 2-3 sentences max."},
  product:{label:'Product Advisor',greeting:"Checking out this product? I can help you understand it or prepare questions for the seller.",quick:['Is this a good deal?','Questions for seller','Tell me about logistics'],sys:"You are Radar AI on a product page on Biz Radar. Help the buyer understand the product, think through if it meets their needs, understand logistics, and prepare questions for the seller. Be honest and helpful. Keep replies short."},
  orders:{label:'Order Support',greeting:"I'm here to help with your orders! Got a question about a delivery or an issue?",quick:['Order is late','How to contact seller','Cancel an order'],sys:"You are Radar AI customer support for Biz Radar orders. Help users with order statuses, delays, contacting sellers, and resolving issues. Be calm, empathetic, and solution-focused. Keep replies concise."},
  office:{label:'Business Coworker',greeting:"Hey boss! I'm your AI business coworker 💼 I can write product descriptions, suggest pricing, and give sales tips. What do you need?",quick:['Write a product description','Pricing advice','How to get more sales'],sys:"You are Radar AI, an AI business coworker for sellers on Biz Radar. Help sellers: write compelling product descriptions, suggest smart pricing, give actionable sales tips, improve listings. Be like a knowledgeable business partner. When writing descriptions, make them rich and appealing to buyers."}
};

let aiMsgs=[],aiTyping=false,aiStarted=false;

function aiUpdateContext(view){
  const ctx=AI_CTX[view]||AI_CTX.home;
  const el=document.getElementById('ailabel');
  if(el)el.textContent='● '+ctx.label;
  aiMsgs=[];aiStarted=false;
  const qbtns=g('aiqbtns');
  if(qbtns){qbtns.style.display='flex';qbtns.innerHTML=ctx.quick.map(q=>`<button class="aiqbtn" onclick="aiQuick('${q}')">${q}</button>`).join('');}
}

function aiOpen(){
  g('aipanel').classList.add('open');
  if(!aiStarted){
    const ctx=AI_CTX[curView]||AI_CTX.home;
    setTimeout(()=>aiAddBot(ctx.greeting),200);
    aiMsgs.push({role:'assistant',content:ctx.greeting});
    aiStarted=true;
  }
  setTimeout(()=>g('aiin').focus(),400);
}

function aiClose(){g('aipanel').classList.remove('open');}
function aiBackdrop(e){if(e.target.id==='aipanel')aiClose();}

function aiAddBot(text){const el=document.createElement('div');el.className='aimsg bot';el.textContent=text;aiAppend(el);}
function aiAddUser(text){const el=document.createElement('div');el.className='aimsg user';el.textContent=text;aiAppend(el);}
function aiAppend(el){const c=g('aimsgs');c.appendChild(el);c.scrollTop=c.scrollHeight;}

function aiShowTyping(){const el=document.createElement('div');el.className='aityping';el.id='aityping';el.innerHTML='<span></span><span></span><span></span>';aiAppend(el);}
function aiHideTyping(){const el=document.getElementById('aityping');if(el)el.remove();}
function aiHideQuick(){g('aiqbtns').style.display='none';}

function aiQuick(text){aiHideQuick();aiSendMsg(text);}
function aiSend(){const inp=g('aiin'),text=inp.value.trim();if(!text||aiTyping)return;inp.value='';aiHideQuick();aiSendMsg(text);}

async function aiSendMsg(text){
  if(aiTyping)return;
  aiTyping=true;g('aisend').disabled=true;
  aiAddUser(text);aiMsgs.push({role:'user',content:text});
  aiShowTyping();
  try{
    const ctx=AI_CTX[curView]||AI_CTX.home;
    // Note: This is a demo. For production, use your backend API
    aiHideTyping();
    aiAddBot("I'm an AI demo. To enable real AI responses, please set up an API key in your backend.");
  }catch(e){aiHideTyping();aiAddBot("Sorry, something went wrong. Make sure you're connected.");console.error(e);}
  aiTyping=false;g('aisend').disabled=false;g('aiin').focus();
}

// ═══════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════
function g(id){return document.getElementById(id);}

// Init
aiUpdateContext('home');