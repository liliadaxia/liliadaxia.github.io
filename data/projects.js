const projects = [
  {
    id: "simonkids",
    number: "01",
    title: "SIMONKIDS 托育品牌视觉系统",
    subtitle: "0-3岁托育品牌的 VI、IP 延展、空间物料与活动传播设计",
    description: "为托育品牌建立温柔、清晰且可延展的视觉系统，让品牌在家长沟通、空间场景和日常物料中保持一致识别。",
    category: "品牌系统",
    theme: "brand",
    type: "VI System / Kids Brand / IP Extension",
    tags: ["VI System", "Kids Brand", "IP Extension", "Brand Materials"],
    year: "2026",
    status: "Selected",
    featuredOrder: 1,
    cover: "images/featured/simonkids.jpg",
    url: "project-simonkids.html",
    images: ["images/featured/simonkids.jpg", "images/projects/simonkids-01.jpg", "images/projects/simonkids-02.jpg"],
  },
  {
    id: "study-tour",
    number: "02",
    title: "国际研学品牌衍生物料系统",
    subtitle: "行李箱、书包、贴纸、旗帜、手机壳与研学场景移动传播物料设计",
    description: "把研学品牌从一张视觉图延展成一组可携带、可使用、可传播的品牌物料，让孩子和家长在旅程中反复遇见品牌。",
    category: "衍生产品",
    theme: "merch",
    type: "Study Tour / Merchandise / Mobile Touchpoints",
    tags: ["Study Tour", "Merchandise", "Luggage", "Sticker", "Bag", "Flag"],
    year: "2026",
    status: "Selected",
    featuredOrder: 3,
    cover: "images/featured/ai-visual.jpg",
    url: "project-study-tour.html",
    images: ["images/featured/ai-visual.jpg", "images/projects/ai-visual-01.jpg", "images/projects/ai-visual-02.jpg"],
  },
  {
    id: "haido-restaurant",
    number: "03",
    title: "Les Poissons｜海朵餐饮品牌活动视觉系统",
    displayTitle: "<span>Les Poissons</span><span>海朵餐饮品牌活动视觉系统</span>",
    subtitle: "餐饮品牌视觉 · 活动传播 · 空间与物料延展",
    description: "围绕菜品推广、节气内容、活动视觉与现场落地，建立统一且可持续延展的餐饮品牌视觉系统。",
    category: "空间物料",
    theme: "space",
    type: "Brand Visual / Campaign / Space & Materials",
    tags: ["Brand Visual", "Campaign", "Space & Materials"],
    year: "2025",
    status: "Selected",
    featuredOrder: 2,
    cover: "assets/haiduo/03-event-visual/haiduo-event-art-exhibition-01.jpg",
    url: "project-haido-restaurant.html",
    images: [
      "assets/haiduo/03-event-visual/haiduo-event-art-exhibition-01.jpg",
      "assets/haiduo/01-campaign-posters/haiduo-campaign-award.jpg",
      "assets/haiduo/04-onsite-implementation/haiduo-onsite-whiskey-table-01.jpg"
    ],
  },
  {
    id: "campaign-archive",
    number: "04",
    title: "商业活动与传播视觉归档",
    subtitle: "活动海报、邀请函、电视背景、节日视觉与现场传播物料合集",
    description: "将不同活动中的海报、邀请函、电视背景和现场物料进行系统整理，让活动视觉不止停留在单张海报，而能形成完整传播氛围。",
    category: "活动传播",
    theme: "campaign",
    type: "Campaign Visual / Poster / Invitation",
    tags: ["Campaign Visual", "Poster", "Invitation", "Event Materials"],
    year: "2025-2026",
    status: "Archive",
    cover: "images/featured/campaign.jpg",
    url: "project-campaign-archive.html",
    images: ["images/featured/campaign.jpg", "images/projects/campaign-01.jpg", "images/projects/campaign-02.jpg"],
  },
  {
    id: "space-graphics",
    number: "05",
    title: "空间墙面广告与场景视觉",
    subtitle: "幼教、餐饮与商业场景中的墙面广告、导视与氛围物料设计",
    description: "把品牌视觉放进真实空间中，通过墙面、导视和场景物料，让用户在环境中自然感知品牌。",
    category: "空间物料",
    theme: "space",
    type: "Space Graphics / Wall Visual / Scene Design",
    tags: ["Space Graphics", "Wall Visual", "Scene Design"],
    year: "2025",
    status: "Archive",
    cover: "images/featured/live-commerce.jpg",
    url: "",
    images: ["images/featured/live-commerce.jpg"],
  },
];

const archiveItems = [
  { id: "archive-01", title: "品牌包装样机", category: "品牌物料", image: "images/archive/archive-01.jpg", url: "project-simonkids.html" },
  { id: "archive-02", title: "活动海报延展", category: "活动延展", image: "images/archive/archive-02.jpg", url: "project-campaign-archive.html" },
  { id: "archive-03", title: "邀请函设计", category: "活动延展", image: "images/archive/archive-03.jpg", url: "project-campaign-archive.html" },
  { id: "archive-04", title: "IP形象延展", category: "IP延展", image: "images/archive/archive-04.jpg", url: "project-simonkids.html" },
  { id: "archive-05", title: "儿童服饰物料", category: "衍生产品", image: "images/archive/archive-05.jpg", url: "project-study-tour.html" },
  { id: "archive-06", title: "行李箱视觉", category: "衍生产品", image: "images/archive/archive-06.jpg", url: "project-study-tour.html" },
  { id: "archive-07", title: "研学场景样机", category: "衍生产品", image: "images/archive/archive-07.jpg", url: "project-study-tour.html" },
  { id: "archive-08", title: "门店空间视觉", category: "空间视觉", image: "images/archive/archive-08.jpg", url: "project-haido-restaurant.html" },
  { id: "archive-09", title: "品牌手册片段", category: "品牌物料", image: "images/archive/archive-09.jpg", url: "project-simonkids.html" },
  { id: "archive-10", title: "社媒视觉模板", category: "社媒视觉", image: "images/archive/archive-10.jpg", url: "project-haido-restaurant.html" },
  { id: "archive-11", title: "主视觉现场延展", category: "活动延展", image: "images/archive/archive-11.jpg", url: "project-campaign-archive.html" },
  { id: "archive-12", title: "商业物料组合", category: "品牌物料", image: "images/archive/archive-12.jpg", url: "" },
];

const eventPhotographyItems = [
  {
    title: "SimonKids 活动现场",
    label: "儿童互动 / 远景记录",
    image: "images/photography/simonkids-event-01.jpg",
    alt: "SimonKids 活动现场远景摄影记录"
  },
  {
    title: "SimonKids 品牌物料",
    label: "活动物料 / 局部细节",
    image: "images/photography/simonkids-materials-01.jpg",
    alt: "SimonKids 活动物料局部摄影记录"
  },
  {
    title: "国际研学集合场景",
    label: "旅程识别 / 背影记录",
    image: "images/photography/study-tour-scene-01.jpg",
    alt: "国际研学集合场景摄影记录"
  },
  {
    title: "国际研学品牌物料",
    label: "行前沟通 / 物料细节",
    image: "images/photography/study-tour-materials-01.jpg",
    alt: "国际研学品牌物料摄影记录"
  },
  {
    title: "品牌现场物料",
    label: "邀请函 / 桌面触点",
    image: "assets/haiduo/04-onsite-implementation/haiduo-onsite-art-invitation.jpg",
    alt: "品牌现场邀请函物料摄影记录"
  },
  {
    title: "活动落地场景",
    label: "空间应用 / 现场氛围",
    image: "assets/haiduo/04-onsite-implementation/haiduo-onsite-art-scene-01.jpg",
    alt: "品牌活动现场空间摄影记录"
  }
];

const testimonials = [
  {
    initial: "S",
    name: "SIMONKIDS",
    category: "品牌视觉系统",
    avatarTone: "blue",
    messages: [
      "视觉系统不只是好看，落到空间和物料里也保持了统一识别。",
      "后续家长沟通和内部协作都更顺了，品牌气质也更清晰。"
    ],
    meta: "品牌视觉系统 / 幼教品牌 / 2026",
  },
  {
    initial: "C",
    name: "商业活动项目",
    category: "活动传播视觉",
    avatarTone: "coral",
    messages: [
      "活动主视觉延展到邀请函、电视背景和现场物料之后，整体氛围更完整了。",
      "信息传达更集中，活动现场也更有统一感。"
    ],
    meta: "活动传播视觉 / 商业活动 / 2026",
  },
  {
    initial: "T",
    name: "国际研学品牌",
    category: "衍生物料系统",
    avatarTone: "lilac",
    messages: [
      "样机和物料呈现帮助我们更快判断品牌触点的质感。",
      "团队在讨论方向时也更容易形成共识。"
    ],
    meta: "衍生产品 / 国际研学品牌 / 2026",
  },
  {
    initial: "H",
    name: "海朵餐饮品牌",
    category: "门店与空间视觉",
    avatarTone: "olive",
    messages: [
      "墙面和门店物料统一之后，品牌氛围更容易被顾客感知。",
      "线上社媒和线下空间的视觉关系也更清楚了。"
    ],
    meta: "空间物料 / 餐饮品牌 / 2025",
  },
];

window.projects = projects;
window.siteProjects = projects;
window.archiveItems = archiveItems;
window.eventPhotographyItems = eventPhotographyItems;
window.testimonials = testimonials;
