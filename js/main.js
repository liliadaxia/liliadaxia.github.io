(function(){
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const isMobile=matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  let hasRenderedArchive=false;
  let hasRenderedEventPhotography=false;
  let hasRenderedTestimonials=false;
  let selectedWorkMotionBound=false;
  const categories=['\u5168\u90e8','\u54c1\u724c\u7cfb\u7edf','\u6d3b\u52a8\u4f20\u64ad','\u7a7a\u95f4\u7269\u6599','\u884d\u751f\u4ea7\u54c1'];
  const themeByCategory={
    '\u54c1\u724c\u7cfb\u7edf':'brand',
    '\u6d3b\u52a8\u4f20\u64ad':'campaign',
    '\u7a7a\u95f4\u7269\u6599':'space',
    '\u884d\u751f\u4ea7\u54c1':'merch'
  };
  const projects=()=>window.projects||window.siteProjects||[];
  const selectedProjects=()=>projects()
    .filter(project=>project.status==='Selected'&&link(project))
    .sort((a,b)=>(a.featuredOrder||99)-(b.featuredOrder||99));
  const cover=p=>p.cover||p.image||'';
  const link=p=>p.url||'';
  const themeOf=item=>item.theme||themeByCategory[item.category]||'default';

  function imageFrame(src,alt,extraClass=''){
    const className=['img-wrapper','image-frame',extraClass].filter(Boolean).join(' ');
    return `<div class="${className}"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" data-fallback></div>`;
  }

  function bindFallbacks(root=document){
    qsa('img[data-fallback]',root).forEach(img=>{
      const applyFallback=()=>{
        if(img.hasAttribute('data-hide-card-on-error')){
          img.closest('.event-photo-card,.archive-item,.visual-archive-card,.archive-card,.photo-card,.gallery-card,.image-card')?.remove();
          return;
        }
        img.removeAttribute('src');
        img.alt='';
        img.closest('.image-frame')?.classList.add('is-placeholder');
        img.closest('.tool-badge')?.classList.add('is-text-fallback');
      };
      if(img.complete&&!img.naturalWidth){
        applyFallback();
        return;
      }
      img.addEventListener('load',()=>{
        img.classList.add('is-loaded');
        img.closest('.image-frame')?.classList.remove('is-placeholder');
      },{once:true});
      img.addEventListener('error',applyFallback,{once:true});
    });
  }

  function hideMissingProjectMedia(root=document){
    qsa('.simonkids-project-page img,.hero-visual-card img,#archive img',root).forEach(img=>{
      const hideCard=()=>{
        const card=img.closest('.sk-media-figure')||
          img.closest('.sk-hero-visual')||
          img.closest('.hero-visual-card')||
          img.closest('.archive-item')||
          img.closest('.visual-archive-card');
        card?.classList.add('is-missing');
      };
      if(img.complete&&!img.naturalWidth){
        hideCard();
        return;
      }
      img.addEventListener('error',hideCard,{once:true});
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
    const filterOptions=['\u5168\u90e8',...new Set(selectedProjects().map(project=>project.category).filter(Boolean))];
    holder.innerHTML=filterOptions.map((name,index)=>`<button class="filter-button ${index===0?'is-active':''}" type="button" data-filter="${name}" data-cursor="Go">${name}</button>`).join('');
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
    const body=`${imageFrame(cover(project),project.coverAlt||project.alt||project.title,'work-card-media')}<span class="floating-view">${status}</span><div class="project-card-body work-card-body"><div class="project-card-meta"><span>${project.category||''}</span><span>${project.year||project.status||''}</span></div><h3>${titleMarkup}</h3><p>${project.description||project.summary||''}</p><div class="tag-list">${tags}</div></div>`;
    const theme=themeOf(project);
    const projectId=project.id||project.slug||'';
    if(link(project))return `<a class="project-card work-card reveal" href="${link(project)}" data-project-id="${projectId}" data-category="${project.category||''}" data-theme-trigger="${theme}" data-cursor="View">${body}</a>`;
    return `<article class="project-card work-card is-disabled reveal" data-project-id="${projectId}" data-category="${project.category||''}" data-theme-trigger="${theme}" aria-label="${project.title} coming soon">${body}</article>`;
  }

  function renderProjectCards(filter='\u5168\u90e8'){
    const grid=qs('[data-project-grid]')||qs('[data-featured-list]');
    if(!grid)return;
    grid.classList.add('work-list','is-switching');
    const selected=selectedProjects().filter(project=>filter==='\u5168\u90e8'||project.category===filter);
    window.setTimeout(()=>{
      grid.innerHTML=selected.map(projectCard).join('');
      bindFallbacks(grid);
      setupProjectInteractions(grid);
      setupSelectedWorkMotion();
      grid.classList.remove('is-switching');
      window.dispatchEvent(new CustomEvent('content:updated'));
    },reduced?0:140);
  }

  function renderWorksPage(){
    const grid=qs('[data-works-grid]');
    if(!grid)return;
    grid.innerHTML=projects().map(project=>{
      const theme=themeOf(project);
      const body=`${imageFrame(cover(project),project.coverAlt||project.alt||project.title)}<div class="project-card-body"><div class="project-card-meta"><span>${project.category||''}</span><span>${project.year||project.status||''}</span></div><h3>${project.title}</h3><p>${project.description||project.summary||''}</p></div>`;
      return `<article class="project-card reveal" id="${project.id||project.slug||''}" data-theme-trigger="${theme}">${link(project)?`<a href="${link(project)}" data-cursor="View">${body}</a>`:body}</article>`;
    }).join('');
    bindFallbacks(grid);
    setupProjectInteractions(grid);
    window.dispatchEvent(new CustomEvent('content:updated'));
  }

  function renderArchive(){
    const grid=qs('[data-archive-grid]');
    if(hasRenderedArchive)return;
    if(!grid||!window.archiveItems)return;
    hasRenderedArchive=true;
    grid.innerHTML=window.archiveItems.slice(0,8).map(item=>{
      const image=`<img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" data-fallback data-hide-card-on-error onerror="this.closest('.visual-archive-card,.archive-item,.archive-card')?.classList.add('is-missing')">`;
      if(item.url){
        return `<a class="archive-item visual-archive-card reveal" href="${item.url}" data-cursor="View">${image}</a>`;
      }
      return `<button class="archive-item visual-archive-card image-button reveal" type="button" data-lightbox="${item.image}" data-cursor="Open" aria-label="Open ${item.title}">${image}</button>`;
    }).join('');
    bindFallbacks(grid);
    hideMissingProjectMedia(grid);
    window.dispatchEvent(new CustomEvent('content:updated'));
  }

  function renderTestimonials(){
    const holder=qs('[data-testimonials]');
    if(hasRenderedTestimonials)return;
    if(!holder||!window.testimonials)return;
    hasRenderedTestimonials=true;
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
    window.dispatchEvent(new CustomEvent('content:updated'));
  }

  function renderEventPhotography(){
    const grid=qs('[data-event-photography]');
    const items=(window.eventPhotographyItems||[]).filter(item=>item&&item.image).slice(0,6);
    if(hasRenderedEventPhotography)return;
    if(!grid||!items.length)return;
    hasRenderedEventPhotography=true;
    grid.innerHTML=items.map(item=>`
      <article class="event-photo-card reveal" data-cursor="Open">
        <button class="event-photo-button" type="button" data-lightbox="${item.image}" aria-label="Open ${item.title}">
          <div class="image-frame" data-label="${item.label||item.title}">
            <img src="${item.image}" alt="${item.alt||item.title}" loading="lazy" decoding="async" data-fallback data-hide-card-on-error onerror="this.closest('.event-photo-card')?.classList.add('is-missing')">
          </div>
        </button>
        <span>${item.label||''}</span>
      </article>
    `).join('');
    bindFallbacks(grid);
    qsa('img[data-hide-card-on-error]',grid).forEach(img=>{
      img.addEventListener('error',()=>img.closest('.event-photo-card,.archive-item,.visual-archive-card')?.remove(),{once:true});
    });
    window.dispatchEvent(new CustomEvent('content:updated'));
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

  function setupHeroStoryCollage(){
    const collage=qs('[data-hero-story-collage]');
    if(!collage||!finePointer||reduced)return;
    let raf=0;
    let targetX=0;
    let targetY=0;
    const reset=()=>{
      targetX=0;
      targetY=0;
      if(!raf)raf=requestAnimationFrame(update);
    };
    const update=()=>{
      raf=0;
      collage.style.setProperty('--story-shift-x',(targetX*7).toFixed(1)+'px');
      collage.style.setProperty('--story-shift-y',(targetY*6).toFixed(1)+'px');
      collage.style.setProperty('--story-glow-x',(targetX*-5).toFixed(1)+'px');
      collage.style.setProperty('--story-glow-y',(targetY*-4).toFixed(1)+'px');
    };
    collage.addEventListener('mousemove',event=>{
      const rect=collage.getBoundingClientRect();
      targetX=((event.clientX-rect.left)/rect.width-.5)*2;
      targetY=((event.clientY-rect.top)/rect.height-.5)*2;
      if(!raf)raf=requestAnimationFrame(update);
    },{passive:true});
    collage.addEventListener('mouseleave',reset);
  }

  function updateSelectedWorkMotion(){
    const section=qs('#works');
    if(!section)return;
    const cards=qsa('.work-list .work-card',section);
    if(!cards.length)return;
    if(reduced||isMobile){
      cards.forEach(card=>{
        card.classList.add('is-scroll-active');
        card.style.removeProperty('--work-scroll-y');
        card.style.removeProperty('--work-focus');
      });
      return;
    }
    const focusY=innerHeight*0.58;
    cards.forEach(card=>{
      const rect=card.getBoundingClientRect();
      const cardCenter=rect.top+rect.height*0.5;
      const distance=Math.abs(cardCenter-focusY);
      const focus=Math.max(0,1-distance/(innerHeight*0.62));
      const lift=(1-focus)*14;
      card.style.setProperty('--work-scroll-y',`${lift.toFixed(1)}px`);
      card.style.setProperty('--work-focus',focus.toFixed(3));
      card.classList.toggle('is-scroll-active',focus>0.52);
    });
  }

  function setupSelectedWorkMotion(){
    const section=qs('#works');
    if(!section||!qsa('.work-list .work-card',section).length)return;
    updateSelectedWorkMotion();
    if(selectedWorkMotionBound)return;
    selectedWorkMotionBound=true;
    let raf=0;
    const requestUpdate=()=>{
      if(raf)return;
      raf=requestAnimationFrame(()=>{
        raf=0;
        updateSelectedWorkMotion();
      });
    };
    addEventListener('scroll',requestUpdate,{passive:true});
    addEventListener('resize',requestUpdate);
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

  function prepareImagePerformance(root=document){
    qsa('img',root).forEach((img,index)=>{
      if(!img.hasAttribute('decoding'))img.setAttribute('decoding','async');
      if(!img.hasAttribute('loading')){
        const isHero=!!img.closest('.hero,.home-hero,.study-hero,.sk-hero,.haiduo-hero,.hero-section,.about-hero');
        img.setAttribute('loading',isHero&&index<3?'eager':'lazy');
      }
      const isPriority=!!img.closest('.hero,.home-hero,.study-hero,.sk-hero,.haiduo-hero,.hero-section');
      if(isPriority&&!img.hasAttribute('fetchpriority'))img.setAttribute('fetchpriority','high');
    });
  }

  function setupPageOutline(){
    if(qs('.page-outline'))return;
    const main=qs('main')||qs('.main-content');
    if(!main)return;
    const knownLabels={
      top:'Top',
      works:'作品',
      'event-photography':'摄影',
      archive:'归档',
      voices:'反馈',
      now:'近期',
      contact:'联系'
    };
    const kickerLabels=[
      [/PROJECT BRIEF|BRIEF & IMPACT/i,'Brief'],
      [/BRAND POSITIONING/i,'定位'],
      [/PROGRAM SYSTEM/i,'体系'],
      [/B2B PROMOTION/i,'B2B'],
      [/CAMPAIGN & SOCIAL/i,'社媒'],
      [/CAMPAIGN VISUAL/i,'海报'],
      [/SPACE & SCENE/i,'空间'],
      [/MATERIAL/i,'物料'],
      [/ITINERARY/i,'行程'],
      [/DOCUMENTATION|PHOTOGRAPHY/i,'摄影'],
      [/PROJECT VALUE/i,'总结'],
      [/CAMPAIGN POSTERS/i,'海报'],
      [/SEASONAL/i,'节气'],
      [/EVENT VISUAL/i,'活动'],
      [/ONSITE/i,'落地'],
      [/BRAND OVERVIEW/i,'总览'],
      [/PHOTO RECORD/i,'摄影']
    ];
    const clean=text=>(text||'').replace(/\s+/g,' ').trim();
    const labelFor=(section,index)=>{
      if(section.id&&knownLabels[section.id])return knownLabels[section.id];
      if(index===0&&section.matches('.hero,.home-hero,.study-hero,.sk-hero,.haiduo-hero,.hero-section'))return 'Top';
      const kicker=clean(qs('.section-kicker,.section-label,.hero-kicker,.eyebrow,.tour-card-meta',section)?.textContent);
      for(const [pattern,label] of kickerLabels){
        if(pattern.test(kicker))return label;
      }
      const heading=clean(qs('h2,h1,h3',section)?.textContent);
      if(!heading)return `Section ${index+1}`;
      const firstLine=heading.split(/[｜|/]/)[0].trim();
      return firstLine.length>8?`${firstLine.slice(0,8)}...`:firstLine;
    };
    const sections=qsa('section',main).filter(section=>qs('h1,h2,h3',section));
    const items=sections.map((section,index)=>{
      if(!section.id)section.id=`page-section-${index+1}`;
      return {id:section.id,label:labelFor(section,index),section};
    }).filter(item=>item.label);
    if(items.length<3)return;
    const nav=document.createElement('nav');
    nav.className='page-outline';
    nav.setAttribute('aria-label','页面内容导航');
    nav.innerHTML=`<span class="page-outline__label">PAGE</span><div class="page-outline__track">${items.map(item=>`<a href="#${item.id}" data-outline-target="${item.id}">${item.label}</a>`).join('')}</div>`;
    document.body.appendChild(nav);
    const links=qsa('a',nav);
    const setActive=id=>links.forEach(link=>link.classList.toggle('is-active',link.dataset.outlineTarget===id));
    setActive(items[0].id);
    if('IntersectionObserver'in window){
      const io=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting)setActive(entry.target.id);
        });
      },{rootMargin:'-35% 0px -52% 0px',threshold:0.01});
      items.forEach(item=>io.observe(item.section));
    }
  }

  function lazyRenderWhenVisible(selector,renderFn){
    const target=qs(selector);
    if(!target||typeof renderFn!=='function')return;
    if(!('IntersectionObserver' in window)){
      renderFn();
      return;
    }
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        renderFn();
        observer.disconnect();
      });
    },{rootMargin:'300px 0px'});
    observer.observe(target);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const featured=qs('[data-featured-list]');
    const themedMain=qs('.main-content');
    if(themedMain&&!themedMain.dataset.theme)themedMain.dataset.theme='default';
    setupFilters(featured);
    renderProjectCards();
    renderWorksPage();
    if(isMobile){
      lazyRenderWhenVisible('#archive',renderArchive);
      lazyRenderWhenVisible('#event-photography',renderEventPhotography);
      lazyRenderWhenVisible('#voices',renderTestimonials);
    }else{
      renderArchive();
      renderEventPhotography();
      renderTestimonials();
    }
    setupMenu();
    prepareProjectGallery();
    prepareNowCards();
    prepareImagePerformance();
    setupPageOutline();
    bindFallbacks();
    hideMissingProjectMedia();
    if(!isMobile){
      setupHeroStoryCollage();
      setupHoverPreview();
      setupProjectInteractions();
    }
    setupSelectedWorkMotion();
    setupLightbox();
    setTimeout(()=>document.body.classList.add('is-loaded'),80);
  });
  addEventListener('content:updated',()=>prepareImagePerformance());
})();
