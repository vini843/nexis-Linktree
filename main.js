/* Nexis System — Links | animações e interações */
"use strict";
/* ---------- INTRO: 3 segundos ---------- */
(function(){

  const msgs = ["> conectando sistemas...","> carregando estratégia...","> iniciando evolução..."];
  const typed = document.getElementById('typed');
  let mi=0, ci=0;
  const typer = setInterval(()=>{
    const m = msgs[mi];
    typed.textContent = m.slice(0, ++ci);
    if(ci >= m.length){ ci=0; mi=(mi+1)%msgs.length; }
  }, 32);

  const DURATION = 3000, start = performance.now();
  const fill = document.getElementById('barFill'), pct = document.getElementById('pct');
  function step(t){
    const p = Math.min((t-start)/DURATION,1);
    const e = 1-Math.pow(1-p,3);
    fill.style.width = (e*100)+'%';
    pct.textContent = String(Math.round(e*100)).padStart(3,'0')+'%';
    if(p<1) requestAnimationFrame(step);
    else{
      clearInterval(typer);
      document.getElementById('intro').classList.add('hide');
      document.body.classList.add('ready');
    }
  }
  requestAnimationFrame(step);
  document.getElementById('y').textContent = new Date().getFullYear();
})();

/* ---------- PAINÉIS ---------- */
(function(){
  const io = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('seen')}),{threshold:.12});
  document.querySelectorAll('.in').forEach(el=>io.observe(el));

  // revelação progressiva de cada bloco no scroll
  document.querySelectorAll('.panel .sec').forEach(sec=>{
    let k=0;
    sec.querySelectorAll(':scope > .kicker, :scope > h3, :scope > p.lead, :scope > .box, :scope > .hub, :scope > .nl-benefits, :scope > .nl-guar, :scope > .segs > .seg, :scope > .faq > .q, :scope > .cta').forEach(el=>{
      if(!el.classList.contains('sr')){el.classList.add('sr'); el.style.setProperty('--sd',(Math.min(k,5)*0.08)+'s'); k++;}
    });
  });
  const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');io2.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.sr, .ax-join, .why-sec').forEach(el=>io2.observe(el));

  function open(id){
    const p=document.getElementById(id); p.scrollTop=0; p.classList.add('open');
    document.body.style.overflow='hidden'; history.pushState({p:id},'','#'+id);
  }
  function closeAll(){document.querySelectorAll('.panel.open').forEach(p=>p.classList.remove('open'));document.body.style.overflow=''}
  document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();open(b.dataset.open)}));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{history.state&&history.state.p?history.back():closeAll()}));
  addEventListener('popstate',closeAll);

  // chips: rolar até a seção + destacar a seção visível
  document.querySelectorAll('.panel').forEach(panel=>{
    const chips=[...panel.querySelectorAll('.chip')];
    chips.forEach(c=>c.addEventListener('click',()=>{
      const s=panel.querySelector('#'+c.dataset.go); panel.scrollTo({top:s.offsetTop-128,behavior:'smooth'});
    }));
    panel.addEventListener('scroll',()=>{
      let cur=chips[0];
      chips.forEach(c=>{const s=panel.querySelector('#'+c.dataset.go);if(s.getBoundingClientRect().top<180)cur=c});
      chips.forEach(c=>c.classList.toggle('on',c===cur));
      const bar=cur.parentElement; bar.scrollTo({left:cur.offsetLeft-bar.clientWidth/2+cur.offsetWidth/2,behavior:'smooth'});
    },{passive:true});
  });

  // FAQ
  document.querySelectorAll('.q button').forEach(b=>b.addEventListener('click',()=>{
    const q=b.parentElement, was=q.classList.contains('open');
    q.parentElement.querySelectorAll('.q').forEach(x=>x.classList.remove('open'));
    if(!was)q.classList.add('open');
  }));

  // fluxo do ecossistema acendendo em sequência
  initWave(); initTimeline(); initCycle();
})();


/* ---------- ECOSSISTEMA EM SENOIDE ---------- */
function initWave(){
  const svg=document.getElementById('hubSvg'); if(!svg) return;
  const NS='http://www.w3.org/2000/svg', C=180, R=128;
  const N=[
    ['Site','Sua vitrine digital, atraindo clientes 24h por dia.','M3 5h18v11H3zM8 20h8M12 16v4'],
    ['Leads','Contatos capturados e qualificados automaticamente.','M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4 4-6 8-6s7 2 8 6'],
    ['CRM','Cada cliente organizado e acompanhado.','M4 6h16M4 12h16M4 18h10'],
    ['Automação','Tarefas repetitivas rodando sozinhas.','M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2'],
    ['Agentes IA','Atendimento e análises inteligentes, sem pausa.','M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4'],
    ['Sistemas','Sistemas sob medida para a sua operação.','M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
    ['Dados','Informações integradas em um só lugar.','M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3'],
    ['Dashboards','Indicadores em tempo real para decidir melhor.','M5 20V12M10 20V6M15 20V10M20 20V4']
  ];
  const pos=N.map((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/N.length;return [C+R*Math.cos(a),C+R*Math.sin(a)]});
  let h=`<defs>
    <radialGradient id="hubG" cx=".35" cy=".3"><stop offset="0" stop-color="#ffb04a"/><stop offset=".6" stop-color="#ff6a00"/><stop offset="1" stop-color="#c24500"/></radialGradient>
    <radialGradient id="hubGlow"><stop offset="0" stop-color="rgba(255,106,0,.45)"/><stop offset="1" stop-color="rgba(255,106,0,0)"/></radialGradient></defs>
    <circle cx="${C}" cy="${C}" r="120" fill="url(#hubGlow)" class="hb-glow"/>
    <polygon class="hb-mesh" points="${pos.map(p=>p.join(',')).join(' ')}"/>`;
  pos.forEach(([x,y],i)=>{ h+=`<line class="hb-spoke" id="sp${i}" x1="${C}" y1="${C}" x2="${x}" y2="${y}"/>`; });
  h+=`<circle class="hb-ring r1" cx="${C}" cy="${C}" r="58"/><circle class="hb-ring r2" cx="${C}" cy="${C}" r="70"/>
    <circle class="hb-wave" id="hbWave" cx="${C}" cy="${C}" r="44"/>
    <g class="hb-core"><circle cx="${C}" cy="${C}" r="44" fill="url(#hubG)"/>
      <g transform="translate(${C-13} ${C-22}) scale(1.08)"><path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 8h2M14 8h2M8 12h2M14 12h2" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>
      <text x="${C}" y="${C+19}" class="hb-ct">SUA</text><text x="${C}" y="${C+29}" class="hb-ct">EMPRESA</text></g>
    <g id="hbPk"></g>`;
  pos.forEach(([x,y],i)=>{
    const below = y>=C-5 || Math.abs(x-C)<5 && y>C;
    const ly = y<C-60 ? y-30 : y+36;
    h+=`<g class="hb-node" id="nd${i}"><circle class="hn-h" cx="${x}" cy="${y}" r="21"/><circle class="hn-o" cx="${x}" cy="${y}" r="21"/>
      <g transform="translate(${x-9} ${y-9}) scale(.75)"><path d="${N[i][2]}"/></g>
      <text x="${x}" y="${ly}">${N[i][0]}</text></g>`;
  });
  svg.innerHTML=h;
  const pk=document.getElementById('hbPk'), nodes=N.map((_,i)=>document.getElementById('nd'+i)), spokes=N.map((_,i)=>document.getElementById('sp'+i));
  // pacotes de dados viajando nas conexões (ida e volta)
  const packets=[];
  pos.forEach(([x,y],i)=>{ for(let k=0;k<2;k++){ const c=document.createElementNS(NS,'circle'); c.setAttribute('r','2.6'); c.setAttribute('class','hb-pk'); pk.appendChild(c);
    packets.push({el:c,x,y,ph:Math.random(),sp:.28+Math.random()*.2,dir:k?1:-1}); } });
  const ico=document.getElementById('hcIco'),T=document.getElementById('hcT'),D=document.getElementById('hcD'),cap=document.querySelector('.hub-cap'),wave=document.getElementById('hbWave');
  let cur=-1;
  function activate(i){
    cur=i; nodes.forEach((n,k)=>n.classList.toggle('on',k===i)); spokes.forEach((s,k)=>s.classList.toggle('on',k===i));
    ico.innerHTML=`<svg viewBox="0 0 24 24"><path d="${N[i][2]}"/></svg>`; T.textContent='Sua empresa ⇄ '+N[i][0]; D.textContent=N[i][1];
    cap.classList.remove('sw'); void cap.offsetWidth; cap.classList.add('sw');
    wave.classList.remove('go'); void wave.getBoundingClientRect(); wave.classList.add('go');
  }
  let last=0, t0=performance.now();
  function frame(t){
    const dt=(t-t0)/1000; t0=t;
    packets.forEach((p,idx)=>{ const hot = cur>=0 && Math.floor(idx/2)===cur;
      p.ph=(p.ph+dt*p.sp*(hot?2.2:1))%1; const f=p.dir>0?p.ph:1-p.ph;
      p.el.setAttribute('cx',C+(p.x-C)*f); p.el.setAttribute('cy',C+(p.y-C)*f); p.el.classList.toggle('hot',hot); });
    if(t-last>1500){ last=t; activate((cur+1)%N.length); }
    requestAnimationFrame(frame);
  }
  new IntersectionObserver((es,o)=>{ if(es[0].isIntersecting){ requestAnimationFrame(frame); o.disconnect(); } },{threshold:.25}).observe(svg);
}

/* ---------- LINHA DO TEMPO DO PROCESSO ---------- */
function initTimeline(){
  const tl=document.getElementById('tl'); if(!tl) return;
  const fill=document.getElementById('tlFill'), track=tl.querySelector('.tl-track'), steps=[...tl.querySelectorAll('.tl-step')];
  const STEP=1100, HOLD=2200; let t0=null;
  function frame(t){
    if(!t0) t0=t; let e=t-t0; const total=STEP*steps.length;
    if(e>total+HOLD){ t0=t; e=0; }
    const p=Math.min(e/total,1);
    const tr=track.getBoundingClientRect();
    const target=p*tr.height; fill.style.height=target+'px';
    let cur=-1;
    steps.forEach((s,i)=>{ const dy=s.querySelector('.tl-dot').getBoundingClientRect().top+17-tr.top;
      const on=target>=dy-2 || (i===0 && e>0); s.classList.toggle('on',on); if(on) cur=i; });
    steps.forEach((s,i)=>s.classList.toggle('cur',i===cur));
    requestAnimationFrame(frame);
  }
  new IntersectionObserver((es,o)=>{ if(es[0].isIntersecting){ requestAnimationFrame(frame); o.disconnect(); } },{threshold:.35}).observe(tl);
}


/* ---------- PILARES DA HOME (sequência) ---------- */
function initCycle(){
  const ps=[...document.querySelectorAll('#pillars .pill')]; if(!ps.length) return;
  let i=0;
  function tick(){
    if(i<ps.length){ ps.forEach((p,k)=>{p.classList.toggle('done',k<i);p.classList.toggle('cur',k===i)}); i++; setTimeout(tick,1300); }
    else{ ps.forEach(p=>p.classList.remove('cur','done')); i=0; setTimeout(tick,900); }
  }
  setTimeout(tick,4800);
}
/* ---------- BACKGROUND: rede de dados ---------- */
(function(){
  const c = document.getElementById('net'), x = c.getContext('2d');
  let W,H,pts=[],dpr=Math.min(window.devicePixelRatio||1,2);
  function resize(){
    W=c.width=innerWidth*dpr; H=c.height=innerHeight*dpr;
    const n = Math.round(Math.min(70, (innerWidth*innerHeight)/9000));
    pts = Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35*dpr,vy:(Math.random()-.5)*.35*dpr,r:(Math.random()*1.6+.6)*dpr}));
  }
  addEventListener('resize',resize); resize();
  const MAX = 120;
  function loop(){
    x.clearRect(0,0,W,H);
    const md = MAX*dpr;
    for(let i=0;i<pts.length;i++){
      const p=pts[i]; p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
      for(let j=i+1;j<pts.length;j++){
        const q=pts[j], d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<md){ x.strokeStyle=`rgba(255,106,0,${(1-d/md)*.28})`; x.lineWidth=dpr*.7; x.beginPath(); x.moveTo(p.x,p.y); x.lineTo(q.x,q.y); x.stroke(); }
      }
      x.fillStyle='rgba(255,154,60,.85)'; x.beginPath(); x.arc(p.x,p.y,p.r,0,Math.PI*2); x.fill();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
