(function(){
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const categories=['\u5168\u90e8','\u54c1\u724c\u7cfb\u7edf','\u6d3b\u52a8\u4f20\u64ad','\u7a7a\u95f4\u7269\u6599','\u884d\u751f\u4ea7\u54c1'];
  const themeByCategory={
    '\u54c1\u724c\u7cfb\u7edf':'brand',
    '\u6d3b\u52a8\u4f20\u64ad':'campaign',
    '\u7a7a\u95f4\u7269\u6599':'space',
    '\u884d\u751f\u4ea7\u54c1':'merch'
  };
  const projects=()=>window.projects||window.siteProjects||[];
  const cover=p=>p.cover||p.image||'';
  const link=p=>p.url||'';
  const themeOf=item=>item.theme||themeByCategory[item.category]||'default';

  function imageFrame(src,alt,extraClass=''){
    const className=['img-wrapper','image-frame',extraClass].filter(Boolean).join(' ');
    return `<div class="${className}"><img src="${src}" alt="${alt}" loading="lazy" data-fallback></div>`;
  }

  function bindFallbacks(root=document){
    qsa('img[data-fallback]',root).forEach(img=>{
      img.addEventListener('load',()=>{
        img.classList.add('is-loaded');
        img.closest('.image-frame')?.classList.remove('is-placeholder');
      },{once:true});
      img.addEventListener('error',()=>{
        img.removeAttribute('src');
        img.alt='';
        img.closest('.image-frame')?.classList.add('is-placeholder');
        img.closest('.tool-badge')?.classList.add('is-text-fallback');
      },{once:true});
    });
  }

  function setupMenu(){
    const toggle=qs('.menu-toggle');
    if(!toggle)return;
    toggle.addEventListener('click',()=>{
      const open=document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded',String(open));
    });
    qsa('.site-nav a').forEach(a=>a.addEventListener('click',()=>{
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  function setupFilters(list){
    let holder=qs('[data-project-filters]');
    if(!holder&&list){
      holder=document.createElement('div');
      holder.className='project-filters reveal';
      holder.dataset.projectFilters='';
      list.parentNode.insertBefore(holder,list);
    }
    if(!holder)return;
    holder.innerHTML=categories.map((name,index)=>`<button class="filter-button ${index===0?'is-active':''}" type="button" data-filter="${name}" data-cursor="Go">${name}</button>`).join('');
    holder.addEventListener('click',event=>{
      const button=event.target.closest('[data-filter]');
      if(!button)return;
      qsa('.filter-button',holder).forEach(item=>item.classList.remove('is-active'));
      button.classList.add('is-active');
      renderProjectCards(button.dataset.filter);
    });
  }

  function projectCard(project){
    const tags=(project.tags||[]).map(tag=>`<span>${tag}</span>`).join('');
    const status=link(project)?'\u67e5\u770b\u9879\u76ee View Project':'\u6574\u7406\u4e2d';
    const titleMarkup=project.displayTitle||project.title;
    const body=`${imageFrame(cover(project),project.title,'work-card-media')}<span class="floating-view">${status}</span><div class="project-card-body work-card-body"><div class="project-card-meta"><span>${project.category||''}</span><span>${project.year||project.status||''}</span></div><h3>${titleMarkup}</h3><p>${project.description||project.summary||''}</p><div class="tag-list">${tags}</div></div>`;
    const theme=themeOf(project);
    if(link(project))return `<a class="project-card work-card reveal" href="${link(project)}" data-category="${project.category||''}" data-theme-trigger="${theme}" data-cursor="View">${body}</a>`;
    return `<article class="project-card work-card is-disabled reveal" data-category="${project.category||''}" data-theme-trigger="${theme}" aria-label="${project.title} coming soon">${body}</article>`;
  }

  function renderProjectCards(filter='\u5168\u90e8'){
    const grid=qs('[data-project-grid]')||qs('[data-featured-list]');
    if(!grid)return;
    grid.classList.add('work-list','is-switching');
    const selected=projects().filter(project=>filter==='\u5168\u90e8'||project.category===filter);
    window.setTimeout(()=>{
      grid.innerHTML=selected.map(projectCard).join('');
      bindFallbacks(grid);
      setupProjectInteractions(grid);
      grid.classList.remove('is-switching');
      window.dispatchEvent(new CustomEvent('content:updated'));
    },reduced?0:140);
  }

  function renderWorksPage(){
    const grid=qs('[data-works-grid]');
    if(!grid)return;
    grid.innerHTML=projects().map(project=>{
      const theme=themeOf(project);
      const body=`${imageFrame(cover(project),project.title)}<div class="project-card-body"><div class="project-card-meta"><span>${project.category||''}</span><span>${project.year||project.status||''}</span></div><h3>${project.title}</h3><p>${project.description||project.summary||''}</p></div>`;
      return `<article class="project-card reveal" id="${project.id||project.slug||''}" data-theme-trigger="${theme}">${link(project)?`<a href="${link(project)}" data-cursor="View">${body}</a>`:body}</article>`;
    }).join('');
    bindFallbacks(grid);
    setupProjectInteractions(grid);
    window.dispatchEvent(new CustomEvent('content:updated'));
  }

  function renderArchive(){
    const grid=qs('[data-archive-grid]');
    if(!grid||!window.archiveItems)return;
    grid.innerHTML=window.archiveItems.map(item=>{
      const media=`<div class="img-wrapper image-frame"><img src="${item.image}" alt="${item.title}" loading="lazy" data-fallback><span class="archive-tag">${item.category||''}</span></div>`;
      const action=item.url?`<a class="archive-link" href="${item.url}" data-cursor="View">${media}</a>`:`<button class="image-button" type="button" data-lightbox="${item.image}" data-cursor="Open" aria-label="Open ${item.title}">${media}</button>`;
      return `<figure class="archive-item reveal">${action}<figcaption><span>${item.title}</span><span>${item.category||''}</span></figcaption></figure>`;
    }).join('');
    bindFallbacks(grid);
    window.dispatchEvent(new CustomEvent('content:updated'));
  }

  function renderTestimonials(){
    const holder=qs('[data-testimonials]');
    if(!holder||!window.testimonials)return;
    holder.innerHTML=window.testimonials.map(item=>{
      const messages=(item.messages||[item.quote||'']).filter(Boolean).map(message=>`<p class="chat-bubble" data-cursor="Note">${message}</p>`).join('');
      return `<article class="quote-card chat-card reveal" data-cursor="Read">
        <header class="chat-card-header">
          <span class="chat-avatar is-${item.avatarTone||'blue'}" aria-hidden="true">${item.initial||item.name?.charAt(0)||'L'}</span>
          <span class="chat-project"><strong>${item.name||''}</strong><small>${item.category||item.type||''}</small></span>
        </header>
        <div class="chat-messages">${messages}</div>
        <footer class="chat-meta">${item.meta||item.type||''}</footer>
      </article>`;
    }).join('');
  }

  function setupProjectInteractions(root=document){
    if(!finePointer)return;
    const themeTarget=qs('.main-content[data-theme],.about-page')||document.body;
    qsa('.project-card[data-theme-trigger]',root).forEach(card=>{
      card.addEventListener('mouseenter',()=>{themeTarget.dataset.theme=card.dataset.themeTrigger||'default';});
      card.addEventListener('mouseleave',()=>{
        themeTarget.dataset.theme='default';
        card.style.setProperty('--card-x','0px');
        card.style.setProperty('--card-y','0px');
      });
      card.addEventListener('mousemove',event=>{
        const rect=card.getBoundingClientRect();
        const x=((event.clientX-rect.left)/rect.width-.5)*10;
        const y=((event.clientY-rect.top)/rect.height-.5)*8;
        card.style.setProperty('--card-x',x.toFixed(1)+'px');
        card.style.setProperty('--card-y',y.toFixed(1)+'px');
      },{passive:true});
    });
  }

  function setupHoverPreview(){
    const rows=qsa('.work-row[data-preview]');
    const preview=qs('.hover-preview');
    if(!rows.length||!preview||reduced||!finePointer)return;
    const image=qs('img',preview);
    let x=0,y=0,raf=0;
    function move(){
      raf=0;
      const width=preview.offsetWidth||320;
      const height=preview.offsetHeight||240;
      const left=Math.max(18,Math.min(x+28,innerWidth-width-20));
      const top=Math.max(18,Math.min(y+24,innerHeight-height-20));
      preview.style.setProperty('--preview-transform',`translate3d(${left}px,${top}px,0)`);
    }
    rows.forEach(row=>{
      row.addEventListener('mouseenter',()=>{
        image.src=row.dataset.preview;
        image.alt=row.querySelector('.work-title')?.textContent||'Project preview';
        preview.classList.add('is-visible');
      });
      row.addEventListener('mousemove',event=>{
        x=event.clientX;
        y=event.clientY;
        if(!raf)raf=requestAnimationFrame(move);
      });
      row.addEventListener('mouseleave',()=>preview.classList.remove('is-visible'));
    });
  }

  function setupLightbox(){
    const lightbox=qs('.lightbox');
    if(!lightbox)return;
    const image=qs('img',lightbox);
    const closeButton=qs('.lightbox-close',lightbox);
    const close=()=>{
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden','true');
      document.body.classList.remove('lock-scroll');
    };
    document.addEventListener('click',event=>{
      const trigger=event.target.closest('[data-lightbox]');
      if(!trigger)return;
      image.src=trigger.dataset.lightbox;
      image.alt=qs('img',trigger)?.alt||'Preview image';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden','false');
      document.body.classList.add('lock-scroll');
    });
    closeButton?.addEventListener('click',close);
    lightbox.addEventListener('click',event=>{if(event.target===lightbox)close();});
    addEventListener('keydown',event=>{if(event.key==='Escape')close();});
  }

  function prepareProjectGallery(){
    qsa('.project-image').forEach(button=>{
      button.dataset.lightbox=button.dataset.image||qs('img',button)?.getAttribute('src')||'';
      button.dataset.cursor='Open';
    });
  }

  function prepareNowCards(){
    qsa('.now-list li').forEach(item=>{
      if(!item.dataset.cursor)item.dataset.cursor='Read';
      item.setAttribute('tabindex','0');
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const featured=qs('[data-featured-list]');
    const themedMain=qs('.main-content');
    if(themedMain&&!themedMain.dataset.theme)themedMain.dataset.theme='default';
    setupFilters(featured);
    renderProjectCards();
    renderWorksPage();
    renderArchive();
    renderTestimonials();
    setupMenu();
    prepareProjectGallery();
    prepareNowCards();
    bindFallbacks();
    setupHoverPreview();
    setupLightbox();
    setupProjectInteractions();
    setTimeout(()=>document.body.classList.add('is-loaded'),80);
  });
})();
