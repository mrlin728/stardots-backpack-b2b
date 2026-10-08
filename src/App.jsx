import { ContentImage } from './content/ContentImage.jsx';
import { baselineCatalogItems } from './catalog.js';
import { categoryReference } from './content/site-images.js';
import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, BadgeCheck, Box, Check, CircleHelp, ClipboardCheck,
  ClipboardList, Clock3, FileText, Gem, Globe2, Handshake, Headphones,
  Layers3, Mail, MapPin, Menu, Package, PenLine, Phone, Search, Send,
  Settings2, ShieldCheck, ShoppingBag, Truck, UsersRound, X,
  Sparkles, Cpu, Award, Zap, Activity, CheckCircle2, ChevronRight, Copy, ExternalLink, Sliders, Scissors, Factory,
} from 'lucide-react';
import { getSiteData } from './data.js';
import { getLocale, basePath, localHref, t } from './locale.js';
import { catalogItems } from './catalog.js';
import { useCatalog, useSiteImage } from './content/snapshot-context.jsx';
import { contentVersion } from './content/snapshot.js';
import { ProductCard, CatalogGrid, CatalogCategoryPage, CatalogModelPage } from './Catalog.jsx';
import { validateInquiry } from './inquiry-validation.js';
import { pageMetadata } from './seo.js';
import { useEditorialMotion } from './editorial-motion.js';

const nav = () => [
  [t('ui.home'), '/'], [t('ui.aboutUs'), '/about'], [t('ui.products'), '/products'],
  [t('ui.ourServices_7a7725'), '/services'], [t('ui.forBuyers_6739ca'), '/buyers'], [t('ui.resources'), '/resources'], [t('ui.contact'), '/contact'],
];

function quoteHref(currentCatalog = catalogItems) {
  const { categories } = getSiteData(getLocale());
  const path = basePath();
  if (path === '/contact') return localHref('/contact#quote');
  const params = new URLSearchParams({ source: window.location.pathname });
  const model = currentCatalog.find(item => path === `/products/models/${item.slug}`);
  const category = categories.find(item => path === `/products/${item.slug}`);
  if (model) { params.set('product', model.category); params.set('model', model.sku); }
  else if (category) params.set('product', category.slug);
  return localHref(`/contact?${params.toString()}#quote`);
}

function LinkArrow({ href, children, className = '' }) {

  return <a className={`link-arrow ${className}`} href={localHref(href)}>{children}<ArrowRight size={16} strokeWidth={1.7} /></a>;
}

function Header() {
  const currentCatalog = useCatalog();
  const { COMPANY } = getSiteData(getLocale());
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const path = basePath();
  const locale = getLocale();
  const [locationSuffix, setLocationSuffix] = useState('');
  useEffect(() => {
    const updateLocation = () => setLocationSuffix(window.location.search + window.location.hash);
    updateLocation();
    for (const event of ['popstate', 'hashchange', 'stardots:locationchange']) window.addEventListener(event, updateLocation);
    return () => { for (const event of ['popstate', 'hashchange', 'stardots:locationchange']) window.removeEventListener(event, updateLocation); };
  }, []);
  const languageHref = (nextLocale) => localHref(path, nextLocale) + locationSuffix;
  function switchLanguage(event, nextLocale) {
    event.currentTarget.href = localHref(path, nextLocale) + window.location.search + window.location.hash;
  }
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1200px)');
    function closeDesktopMenu(event) {

      if (event.matches) {
        setOpen(false);
        if (document.activeElement === toggleRef.current) {
          menuRef.current?.querySelector('a.active, a')?.focus();
        }
      }
    }
    desktop.addEventListener('change', closeDesktopMenu);
    return () => desktop.removeEventListener('change', closeDesktopMenu);
  }, []);
  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    const oldMainInert = main?.inert;
    const oldFooterInert = footer?.inert;
    document.body.style.overflow = 'hidden';
    if (main) main.inert = true;
    if (footer) footer.inert = true;
    menuRef.current?.querySelector('a')?.focus();
    function escape(event) {
   if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } }
    document.addEventListener('keydown', escape);
    return () => {
      document.body.style.overflow = oldOverflow;
      if (main) main.inert = oldMainInert;
      if (footer) footer.inert = oldFooterInert;
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  return <>
    <div className="utility"><div className="container utility-inner">
      <span>{getLocale() === 'zh' ? '晋江专业箱包制造实体工厂 · OEM/ODM 快速打样与大货出口' : 'JINJIANG TECHNICAL BACKPACK MANUFACTURER · OEM/ODM · RAPID SAMPLING'}</span>
      <div className="utility-right">
        <span><MapPin size={13} /> {t('ui.jinjiangChina')}</span>
        <a href={`mailto:${COMPANY.email}`}><Mail size={13} /> {COMPANY.email}</a>
        <a href={`tel:${COMPANY.phoneHref}`}><Phone size={13} /> {COMPANY.phone}</a>
        <span className="language-switch"><Globe2 size={13} /> <a href={languageHref('en')} lang="en" aria-current={locale === 'en' ? 'true' : undefined} onClick={event => switchLanguage(event, 'en')}>English</a><span aria-hidden="true">/</span><a href={languageHref('zh')} lang="zh-CN" aria-current={locale === 'zh' ? 'true' : undefined} onClick={event => switchLanguage(event, 'zh')}>中文</a></span>
      </div>
    </div></div>
    <header className="site-header"><div className="container header-inner">
      <a href={localHref('/')} className="wordmark" aria-label={t('ui.stardotsHome')}><strong>STARDOTS</strong><small>{getLocale() === 'zh' ? '晋江智造 · 专业箱包定制出口' : 'TECHNICAL BACKPACK MFG · JINJIANG'}</small></a>
      <nav ref={menuRef} id="main-navigation" className={open ? 'main-nav is-open' : 'main-nav'} aria-label={t('ui.mainNavigation')}>
        {nav().map(([label, href]) => <a key={href} className={path === href || (href !== '/' && path.startsWith(href + '/')) ? 'active' : ''} href={localHref(href)}>{label}</a>)}
      </nav>
      <a className="btn btn-dark header-cta" href={quoteHref(currentCatalog)}>{t('ui.requestAQuote')} <ArrowRight size={16} /></a>
      <div className="mobile-language-switch language-switch"><Globe2 size={15} /><a href={languageHref('en')} lang="en" aria-current={locale === 'en' ? 'true' : undefined} onClick={event => switchLanguage(event, 'en')}>English</a><span aria-hidden="true">/</span><a href={languageHref('zh')} lang="zh-CN" aria-current={locale === 'zh' ? 'true' : undefined} onClick={event => switchLanguage(event, 'zh')}>中文</a></div>
      <button ref={toggleRef} type="button" className="menu-toggle" onClick={() => setOpen(value => !value)} aria-controls="main-navigation" aria-expanded={open} aria-label={open ? t('ui.closeMenu') : t('ui.openMenu')}>{open ? <X /> : <Menu />}</button>
    </div></header>
  </>;
}

function Footer() {
  const currentCatalog = useCatalog();
  const { COMPANY, categories, services } = getSiteData(getLocale());
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-brand"><a href={localHref('/')} className="wordmark"><strong>STARDOTS</strong><small>BAGS / {getLocale() === 'zh' ? '携行新可能' : 'CARRY POSSIBILITY'}</small></a><p>{t('ui.aGlobalBagSourcingPartnerBasedInChinaHelping')}</p></div>
      <div><h3>{t('ui.quickLinks')}</h3><a href={localHref('/')}>{t('ui.home')}</a><a href={localHref('/about')}>{t('ui.aboutUs')}</a><a href={localHref('/products')}>{t('ui.products')}</a><a href={localHref('/services')}>{t('ui.ourServices_7a7725')}</a><a href={localHref('/buyers')}>{t('ui.forBuyers_6739ca')}</a><a href={localHref('/resources')}>{t('ui.resources')}</a><a href={localHref('/contact')}>{t('ui.contact')}</a></div>
      <div><h3>{t('ui.ourProducts_96ef71')}</h3>{categories.map(c => <a href={localHref(`/products/${c.slug}`)} key={c.slug}>{c.name}</a>)}</div>
      <div><h3>{t('ui.ourServices_7a7725')}</h3>{services.map(s => <a href={localHref(`/services/${s.slug}`)} key={s.slug}>{s.name}</a>)}</div>
      <div><h3>{t('ui.contactUs')}</h3><p className="footer-contact"><MapPin size={14} /> {COMPANY.location}</p><a className="footer-contact" href={`tel:${COMPANY.phoneHref}`}><Phone size={14} /> {COMPANY.phone}</a><a className="footer-contact" href={`mailto:${COMPANY.email}`}><Mail size={14} /> {COMPANY.email}</a><a className="footer-contact" href={COMPANY.whatsapp} target="_blank" rel="noreferrer"><Send size={14} /> {t('ui.whatsapp')}</a></div>
      <div><h3>{t('ui.stayInTouch')}</h3><p>{t('ui.readPracticalGuidanceForYourNextBagCollectionOr')}</p><LinkArrow href={localHref('/resources')}>{t('ui.buyerResources')}</LinkArrow><br /><LinkArrow href={quoteHref(currentCatalog)}>{t('ui.requestAQuote')}</LinkArrow></div>
    </div>
    <div className="footer-bottom"><div className="container"><span>{t('copyright', { year: new Date().getFullYear() })}</span><span>{t('ui.aGlobalSourcingPartnerForABrighterTomorrow')}</span><span><a href={localHref('/privacy')}>{t('ui.privacyPolicy')}</a><i /> <a href={localHref('/terms')}>{t('ui.termsOfService')}</a></span></div></div>
  </footer>;
}

function BannerCTA() {
  const zh = getLocale() === 'zh';
  return <section className="banner-cta" style={{ background: '#0f172a', color: '#ffffff', padding: '64px 0', borderTop: '1px solid #1e293b' }}><div className="container" style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
    <span className="badge-pill active" style={{ marginBottom: '14px' }}>STARDOTS / {zh ? '晋江智造 · 实体工厂' : 'JINJIANG DIRECT OEM/ODM'}</span>
    <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '800', color: '#ffffff', margin: '0 0 16px' }}>{zh ? '准备好开启您的下一批专业背包订单了吗？' : 'Ready to Engineer Your Next Backpack Collection?'}</h2>
    <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' }}>{zh ? '提供草图、样板或设计图纸，7-10天极速打样出板，24小时内出具FOB报价。' : 'Send your sketch, tech pack, or reference sample. Rapid 7-10 day sample turnaround and 24h FOB quote.'}</p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
      <a className="btn btn-accent" href={quoteHref(useCatalog())} style={{ padding: '12px 24px' }}>{zh ? '申请样品与核算报价' : 'Request Sample & Quote'} <ArrowRight size={16}/></a>
      <a className="btn btn-outline" href="https://wa.me/8613655977639" target="_blank" rel="noreferrer" style={{ background: '#1e293b', color: '#ffffff', borderColor: '#334155', padding: '12px 24px' }}><Send size={16}/> {zh ? 'WhatsApp 即时洽谈' : 'Chat via WhatsApp'}</a>
    </div>
  </div></section>;
}

function SectionHeading({ eyebrow, title, subtitle, href, link }) {

  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{href && <LinkArrow href={localHref(href)}>{link}</LinkArrow>}</div>;
}

function CategoryCard({ category }) {
  const catalogItems = useCatalog();

  const reference = categoryReference(category,catalogItems,baselineCatalogItems);
  return <a className="category-card" href={localHref(`/products/${category.slug}`)}><div className="category-image"><picture>{reference?.cardUrl && <source type={reference.cardUrl.endsWith('.avif') ? 'image/avif' : 'image/webp'} srcSet={reference.cardUrl} />}<img src={reference?.images[0]??category.image} alt={t('categoryImageAlt', { name: category.name })} loading="lazy" /></picture></div><strong>{category.name}</strong><span>{category.sub}</span></a>;
}

function MarketCard({ market }) {

  return <a className="market-card" href={localHref(`/buyers/markets/${market.slug}`)}><div className="market-photo" style={{ backgroundPosition: `${market.position} center` }} role="img" aria-label={t('marketImageAlt', { name: market.name })} /><div className="market-info"><div><strong>{market.name}</strong><span>{market.sub}</span></div><span className="round-arrow"><ArrowRight size={17} /></span></div></a>;
}

function ArticleCard({ article }) {

  return <a className="article-card" href={localHref(`/resources/${article.slug}`)}><img src={article.image} alt="" loading="lazy" /><div><strong>{article.title}</strong><span>{article.date}</span></div></a>;
}

function FAQList({ limit }) {
  const { faqs } = getSiteData(getLocale());
  return <div className="faq-list">{faqs.slice(0, limit || faqs.length).map((f, i) => <details key={f.q} open={i === 0 && !limit}><summary>{f.q}<span>+</span></summary><p>{f.a}</p></details>)}</div>;
}

const strengths = () => [
  [Gem, t('ui.referenceLedSourcing'), t('ui.useAModelCodeOrYourOwnBriefTo')],
  [PenLine, t('ui.productDevelopment'), t('ui.reviewMaterialsConstructionBrandingAndPackagingTogether')],
  [UsersRound, t('ui.partnerCoordination'), t('ui.productionOptionsAreCoordinatedWithSuitablePartnerFactories')],
  [ShieldCheck, t('ui.agreedQualityChecks'), t('ui.planChecksAgainstTheApprovedSampleAndWrittenRequirements')],
  [Globe2, t('ui.destinationPlanning_0ce4d7'), t('ui.confirmPackingDocumentsAndDeliveryResponsibilitiesForYourOrder')],
];

const process = () => [
  [ClipboardList, t('ui.shareYourNeeds'), t('ui.tellUsYourIdeasTargetMarketAndRequirements')],
  [PenLine, t('ui.designSampleDevelopment'), t('ui.weDevelopDesignsAndSamplesForYourReview')],
  [Box, t('ui.confirmationProduction'), t('ui.finalizeDetailsAndStartMassProduction')],
  [Search, t('ui.qualityInspection'), t('ui.agreeOnChecksFindingsAndFollowUpBeforeRelease')],
  [Truck, t('ui.packagingShipping'), t('ui.confirmPackingAndDeliveryArrangementsForYourDestination')],
];

function SourcingPaths() {

  return <section className="section sourcing-paths"><div className="container"><SectionHeading eyebrow={t('twoWaysToBegin')} title={t('ui.yourNextCollectionStartsHere')} subtitle={t('ui.sourceAroundAReferenceModelOrDevelopADesign')} /><div className="sourcing-route-grid">
    <article className="sourcing-route"><span className="eyebrow">01 / {t('referenceCollection')}</span><h3>{t('ui.sourceAnExistingStyle')}</h3><p>{t('ui.exploreBagPhotographsAndModelCodesTellUsWhich')}</p><ul><li>{t('ui.chooseOneOrMoreModelCodes')}</li><li>{t('ui.discussMaterialsColorsAndBranding')}</li><li>{t('ui.confirmSpecificationsAndOrderTerms')}</li></ul><a className="btn btn-dark" href={localHref('/products')}>{t('ui.exploreReferenceModels')} <ArrowRight size={16} /></a><small>{t('stockNote')}</small></article>
    <article className="sourcing-route"><span className="eyebrow">02 / {t('customDevelopment')}</span><h3>{t('ui.createABagForYourBrand')}</h3><p>{t('ui.startWithASketchATechnicalPackOrA')}</p><ul><li>{t('ui.defineTheBuyerAndIntendedUse')}</li><li>{t('ui.reviewConstructionAndDecorationOptions')}</li><li>{t('ui.approveASampleBeforeTheOrderPlan')}</li></ul><a className="btn btn-dark" href={localHref('/contact?route=custom#quote')}>{t('ui.discussACustomProject')} <ArrowRight size={16} /></a><small>{t('ui.moqSampleChargesAndTimingAreConfirmedForYour')}</small></article>
  </div></div></section>;
}

function ResponsibilityGuide() {

  const rows = [
    [t('ui.productBrief'), t('ui.referencesIntendedUseQuantityAndDestination'), t('ui.reviewTheBriefAndIdentifyOpenDecisions'), t('ui.designDirectionAndTheBasisForAQuotation')],
    [t('ui.sampleReview'), t('ui.consolidatedFeedbackOnFitFunctionAndAppearance'), t('ui.coordinateSampleDevelopmentWithTheProductionPartner'), t('ui.approvedSampleSpecificationsBrandingAndAnyTestingScope')],
    [t('ui.orderPlanning'), t('ui.orderDetailsPackingNeedsAndReceivingRequirements'), t('ui.coordinateProductionAgreedChecksAndShipmentPlanning'), t('ui.commercialTermsScheduleAndDeliveryResponsibilities')],
  ];
  return <section className="section responsibility-section"><div className="container"><SectionHeading eyebrow={t('ui.clearResponsibilities')} title={t('ui.knowWhatHappensNext')} subtitle={t('ui.useThisAsADiscussionGuideTheFinalScope')} /><div className="responsibility-table" role="region" aria-label={t('ui.projectResponsibilitiesScrollHorizontallyOnSmallScreens')} tabIndex="0"><table><caption className="sr-only">{t('ui.buyerInputStardotsCoordinationAndDecisionsToConfirmAt')}</caption><thead><tr><th scope="col">{t('ui.stage')}</th><th scope="col">{t('ui.youBring')}</th><th scope="col">{t('ui.weCoordinate')}</th><th scope="col">{t('ui.agreeTogether')}</th></tr></thead><tbody>{rows.map(row => <tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div><div className="brief-download"><div><h3>{t('ui.aPracticalBriefReadyToFillIn')}</h3><p>{t('ui.useOurTextTemplateToOrganizeYourRequirementsLeave')}</p></div><a className="btn btn-outline" href={getLocale() === 'zh' ? '/downloads/stardots-buyer-brief-zh.txt' : '/downloads/stardots-buyer-brief.txt'} download>{t('ui.downloadBuyerBrief')} <FileText size={17} /></a></div></div></section>;
}

function TechPackConfigurator() {
  const zh = getLocale() === "zh";
  const [silhouette, setSilhouette] = useState("tactical");
  const [fabric, setFabric] = useState("cordura");
  const [branding, setBranding] = useState("silicone");
  const [volume, setVolume] = useState("1000");
  const [attached, setAttached] = useState(false);

  const silhouettes = {
    tactical: {
      name: zh ? "战术通勤 / EDC 双肩包" : "Tactical Commute / EDC Backpack",
      spec: "25L · 48x32x18cm",
      desc: zh ? "模块化织带、隐藏防盗电脑仓、加厚减震背负" : "MOLLE webbing, anti-theft laptop pocket, ergonomic EVA harness",
    },
    outdoor: {
      name: zh ? "超轻户外 / 徒步登山包" : "Ultralight Outdoor Hiking Pack",
      spec: "35L · 55x34x22cm",
      desc: zh ? "外置登山杖挂点、水袋吸管口、透气网状背负系统" : "Trekking pole loops, hydration bladder port, suspended mesh airflow back",
    },
    urban: {
      name: zh ? "城市极简 / 防震电脑包" : "Urban Minimalist Laptop Daypack",
      spec: "20L · 45x30x15cm",
      desc: zh ? "360°防震气囊隔层、磁吸开合前袋、行李箱拉杆套带" : "360° shockproof laptop sleeve, magnetic front flap, luggage trolley pass-through",
    },
    travel: {
      name: zh ? "多功能模块化 / 旅行手提包" : "Modular Travel Duffel / Weekender",
      spec: "45L · 58x36x24cm",
      desc: zh ? "独立干湿分离与鞋仓、双肩背/单肩/手提三合一变换" : "Dedicated shoe compartment, wet/dry separation, 3-in-1 convertible harness",
    },
  };

  const fabrics = {
    cordura: {
      name: "Cordura® 1000D Ballistic Nylon",
      label: zh ? "考杜拉 1000D 军规高撕裂尼龙" : "Cordura® 1000D Ballistic Nylon",
      badge: zh ? "抗撕裂 > 180N" : "Tear > 180N",
    },
    rpet: {
      name: "GRS Recycled RPET 600D (Eco)",
      label: zh ? "GRS 4.0 认证环保再生聚酯 (100% RPET)" : "GRS 4.0 Recycled RPET (100% Bottles)",
      badge: zh ? "碳足迹减少 45%" : "-45% Carbon",
    },
    ripstop: {
      name: "420D Diamond Ripstop DWR",
      label: zh ? "420D 蜂巢抗撕裂格 + 双层PU防水涂层" : "420D Diamond Ripstop DWR + PU",
      badge: zh ? "轻量高韧性" : "Ultralight Tough",
    },
    tpu: {
      name: "TPU Seam-Sealed Lamination",
      label: zh ? "全天候高频无缝全防水 TPU 复合面料" : "TPU High-Frequency Seamless Waterproof",
      badge: zh ? "耐水压 > 10,000mm" : ">10,000mm H2O",
    },
  };

  const brandings = {
    silicone: {
      name: zh ? "3D 立体微量注塑硅胶标" : "3D Micro-Injection Silicone",
      badge: zh ? "高耐磨 / 不开裂" : "Zero Crack / UV Proof",
    },
    metal: {
      name: zh ? "激光精雕锌合金铭牌" : "Laser-Etched Metal Plaque",
      badge: zh ? "亚光黑 / 枪色拉丝" : "Matte Black / Gunmetal",
    },
    embroidery: {
      name: zh ? "日产田岛高密立体刺绣" : "High-Density 3D Embroidery",
      badge: zh ? "15色田岛绣花机" : "Tajima Precision",
    },
    leather: {
      name: zh ? "热压凹凸烙印皮牌" : "Debossed PU / Genuine Leather",
      badge: zh ? "经典烙印 / 烫金烫银" : "Heat Burnished / Foil",
    },
    reflective: {
      name: zh ? "3M 高反光夜行热压标" : "3M Scotchlite™ Reflective Heat-Seal",
      badge: zh ? "EN ISO 20471 认证" : "EN ISO 20471",
    },
  };

  const volumes = {
    "500": {
      name: "500 - 1,000 Pcs",
      label: zh ? "500 - 1,000 只 (小批试单 / 柔性试水)" : "500 - 1,000 pcs (Trial Run)",
    },
    "1000": {
      name: "1,000 - 3,000 Pcs",
      label: zh ? "1,000 - 3,000 只 (标准品牌大货推荐)" : "1,000 - 3,000 pcs (Standard Run)",
    },
    "5000": {
      name: "5,000+ Pcs",
      label: zh ? "5,000+ 只 (规模化定制 / 成本最优)" : "5,000+ pcs (Volume OEM / Best Cost)",
    },
  };

  const selectedSil = silhouettes[silhouette];
  const selectedFab = fabrics[fabric];
  const selectedBrand = brandings[branding];
  const selectedVol = volumes[volume];

  const waText = encodeURIComponent(
    `[STARDOTS Technical Backpack Inquiry]\n` +
    `• Silhouette: ${selectedSil.name} (${selectedSil.spec})\n` +
    `• Shell Fabric: ${selectedFab.name}\n` +
    `• Logo Craft: ${selectedBrand.name}\n` +
    `• Target Volume: ${selectedVol.name}\n` +
    `• Estimated Turnaround: 7-10 Days Sample / 25-35 Days Bulk\n` +
    `• FOB Port: Quanzhou / Xiamen, China\n` +
    `Please share pricing and sample dispatch confirmation.`
  );
  const waUrl = `https://wa.me/8613655977639?text=${waText}`;

  const handleAttachRfq = () => {
    const briefNote = `[30s Tech Pack Specs Attached]\nSilhouette: ${selectedSil.name} (${selectedSil.spec})\nShell: ${selectedFab.name}\nLogo: ${selectedBrand.name}\nVolume: ${selectedVol.name}`;
    if (typeof window !== "undefined") {
      const textarea = document.querySelector("#quote textarea");
      if (textarea) {
        textarea.value = (textarea.value ? textarea.value + "\n\n" : "") + briefNote;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
      const anchor = document.getElementById("quote-station") || document.getElementById("quote");
      if (anchor) {
        anchor.scrollIntoView({ behavior: "smooth" });
      }
    }
    setAttached(true);
    setTimeout(() => setAttached(false), 4000);
  };

  return (
    <div className="configurator-card" id="tech-pack-launcher">
      <div className="configurator-header">
        <div>
          <span className="badge-pill active">
            <Zap size={12} /> {zh ? "30秒打样方案生成器" : "30-SEC TECH PACK LAUNCHER"}
          </span>
          <h3 style={{ fontSize: "18px", margin: "6px 0 0", fontWeight: "700" }}>
            {zh ? "配置专属技术参数与打样要求" : "Configure Custom Tech Pack & Sample"}
          </h3>
        </div>
        <span style={{ fontSize: "11px", color: "#0284c7", fontWeight: "600" }}>
          {zh ? "即时出具打样单" : "Instant Specs"}
        </span>
      </div>

      <div className="config-group">
        <div className="config-label">
          <span>{zh ? "1. 目标包型构型 (Silhouette)" : "1. Target Silhouette"}</span>
          <span style={{ color: "#0284c7", textTransform: "none" }}>{selectedSil.spec}</span>
        </div>
        <div className="config-pill-grid">
          {Object.entries(silhouettes).map(([key, item]) => (
            <button
              type="button"
              key={key}
              className={`config-pill-btn ${silhouette === key ? "selected" : ""}`}
              onClick={() => setSilhouette(key)}
            >
              <div style={{ fontWeight: silhouette === key ? "700" : "500" }}>{item.name}</div>
              <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="config-group">
        <div className="config-label">
          <span>{zh ? "2. 主身高能工程面料 (Technical Shell)" : "2. Technical Shell Fabric"}</span>
          <span style={{ color: "#059669", textTransform: "none" }}>{selectedFab.badge}</span>
        </div>
        <div className="config-pill-grid">
          {Object.entries(fabrics).map(([key, item]) => (
            <button
              type="button"
              key={key}
              className={`config-pill-btn ${fabric === key ? "selected" : ""}`}
              onClick={() => setFabric(key)}
            >
              <div style={{ fontWeight: fabric === key ? "700" : "500" }}>{item.name}</div>
              <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="config-group">
        <div className="config-label">
          <span>{zh ? "3. 品牌标识与装饰工艺 (Branding Method)" : "3. Logo & Branding Technique"}</span>
          <span style={{ color: "#64748b", textTransform: "none" }}>{selectedBrand.badge}</span>
        </div>
        <div className="config-pill-grid">
          {Object.entries(brandings).map(([key, item]) => (
            <button
              type="button"
              key={key}
              className={`config-pill-btn ${branding === key ? "selected" : ""}`}
              onClick={() => setBranding(key)}
            >
              <div style={{ fontWeight: branding === key ? "700" : "500" }}>{item.name}</div>
              <div style={{ fontSize: "10px", color: "#059669", marginTop: "2px" }}>{item.badge}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="config-group" style={{ marginBottom: "14px" }}>
        <div className="config-label">
          <span>{zh ? "4. 预估采购批量 (Target Volume)" : "4. Target Production Volume"}</span>
          <span style={{ color: "#64748b", textTransform: "none" }}>MOQ: 500 pcs</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {Object.entries(volumes).map(([key, item]) => (
            <button
              type="button"
              key={key}
              className={`config-pill-btn ${volume === key ? "selected" : ""}`}
              onClick={() => setVolume(key)}
              style={{ textAlign: "center" }}
            >
              <div style={{ fontWeight: volume === key ? "700" : "500" }}>{item.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="config-summary-drawer">
        <div className="config-summary-specs">
          <div>
            <span>{zh ? "极速打样周期" : "Sample Dispatch"}</span>
            <strong>{zh ? "⚡ 7 - 10 工作日" : "⚡ 7 - 10 Business Days"}</strong>
          </div>
          <div>
            <span>{zh ? "大货生产周期" : "Bulk Production"}</span>
            <strong>{zh ? "25 - 35 天交付" : "25 - 35 Calendar Days"}</strong>
          </div>
          <div>
            <span>{zh ? "出货港口" : "Shipping FOB Port"}</span>
            <strong>{zh ? "中国泉州 / 厦门港" : "Quanzhou / Xiamen Port"}</strong>
          </div>
          <div>
            <span>{zh ? "包装标准" : "Export Packaging"}</span>
            <strong>{zh ? "独立OPP袋 + 5层外箱" : "Individual Polybag + Master Carton"}</strong>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "8px" }}>
          <a
            className="btn btn-accent"
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: "12px", padding: "10px 14px", justifyContent: "center" }}
          >
            <Send size={14} /> {zh ? "WhatsApp 直传打样单" : "Send via WhatsApp"}
          </a>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleAttachRfq}
            style={{ fontSize: "12px", padding: "10px 14px", justifyContent: "center", background: "#1e293b", color: "#ffffff", borderColor: "#334155" }}
          >
            <FileText size={14} /> {attached ? (zh ? "已代入询盘表单!" : "Attached to RFQ!") : (zh ? "一键代入询价单" : "Attach to RFQ")}
          </button>
        </div>
      </div>
    </div>
  );
}

function MaterialEngineeringLab() {
  const zh = getLocale() === "zh";
  const [activeTab, setActiveTab] = useState("specs");

  const materials = [
    {
      name: "Cordura® 1000D Ballistic Nylon",
      chineseName: "军规级考杜拉 1000D 弹道尼龙",
      code: "MAT-CD-1000D",
      metric: "> 25,000 Cycles",
      metricLabel: zh ? "马丁代尔耐磨测试" : "Martindale Abrasion",
      tensile: "> 1,850 N",
      tear: "> 180 N",
      waterproof: "DuPont Teflon® DWR + 2x Back PU",
      cert: "INVISTA Cordura® Authorized / REACH",
      applications: zh ? "重载战术包、户外登山包底座加固、高磨损受力区" : "Tactical duty packs, heavy load bottoms, high-wear zones",
      desc: zh ? "采用高强空变尼龙6,6纱线织造，兼具极高抗撕裂性与抗磨损能力，经久耐磨不易破损。" : "Engineered with high-tenacity air-textured Nylon 6,6 filaments for exceptional abrasion resistance.",
    },
    {
      name: "GRS Recycled Eco-RPET 600D",
      chineseName: "GRS 4.0 认证环保再生聚酯面料",
      code: "MAT-RPET-600D",
      metric: "-45% CO₂ Emission",
      metricLabel: zh ? "碳排放降低" : "Carbon Reduction",
      tensile: "> 1,200 N",
      tear: "> 110 N",
      waterproof: "Eco Water-based DWR + Non-toxic PU",
      cert: "GRS Version 4.0 TC / OEKO-TEX Standard 100",
      applications: zh ? "欧美中高端环保通勤系列、ESG企业礼品与全球零售品牌" : "European & US eco commuter lines, ESG corporate retail",
      desc: zh ? "100% 消费后回收塑料瓶精纺而成，每只背包可消耗约 18-24 个塑料瓶，提供全流程交易证书(TC)。" : "Spun from 100% post-consumer recycled PET bottles. Comes with authentic GRS Transaction Certificate (TC).",
    },
    {
      name: "YKK® AquaGuard Water-Tight Zippers",
      chineseName: "YKK 防水及防爆密合拉链",
      code: "MAT-YKK-AQ05",
      metric: "> 10,000 Cycles",
      metricLabel: zh ? "往复拉合疲劳寿命" : "Continuous Reciprocating Pulls",
      tensile: "Crosswise > 750 N",
      tear: "Anti-burst Level 5",
      waterproof: "PU Laminated Reverse Coil (>5,000mm H2O)",
      cert: "YKK Japan Quality Standard / JIS S3015",
      applications: zh ? "独立防震电脑仓、外置快取收纳袋、全天候防水防盗封口" : "Laptop compartments, exterior quick-stash pockets, storm rolltops",
      desc: zh ? "反装拉链齿表面附着高附着力聚氨酯(PU)防水薄膜，有效阻隔雨水渗透与强力防爆齿。" : "Polyurethane film laminated on reverse coil teeth prevents rain intrusion and tooth blowout.",
    },
    {
      name: "Duraflex® & Fidlock® Hardware Ecosystem",
      chineseName: "军工级赛钢扣具与磁吸快开系统",
      code: "MAT-DF-FDM08",
      metric: "-30°C to +80°C",
      metricLabel: zh ? "极端温域抗冲击" : "Extreme Thermal Impact Range",
      tensile: "Tensile Retention > 85 kgf",
      tear: "High Modulus POM",
      waterproof: "100% Rust-proof Polymer & Coated Magnets",
      cert: "ISO 9001 / Mil-Spec Compliance",
      applications: zh ? "人体工学胸带、腰封负重调节、单手磁吸快开扣" : "Ergonomic sternum harness, load-lifters, magnetic one-hand latches",
      desc: zh ? "采用杜邦原生聚甲醛(POM)赛钢原料注塑，耐低温冲击不脆裂；可选配德国 Fidlock 机械磁吸快开系统。" : "Injection molded with virgin POM engineering polymer with optional German Fidlock magnetic mechanical latches.",
    },
  ];

  return (
    <section className="section" style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "72px 0" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "36px" }}>
          <div>
            <span className="badge-pill active"><Sliders size={12} /> {zh ? "材料工程实验室" : "MATERIAL ENGINEERING LAB"}</span>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", margin: "8px 0 6px", fontWeight: "800" }}>
              {zh ? "严苛性能面料与全球顶级辅料选型" : "Engineered Fabrics & Precision Hardware"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "15px", maxWidth: "640px", margin: 0 }}>
              {zh ? "从军规级 1000D 弹道尼龙到 GRS 认证环保再生聚酯，每批原辅料均通过实验室物理测试，杜绝起毛、撕裂与渗水。" : "From military-grade Cordura 1000D to GRS-certified RPET, all raw materials pass physical testing for tensile, abrasion, and water ingress."}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className={`btn ${activeTab === "specs" ? "btn-dark" : "btn-outline"}`}
              onClick={() => setActiveTab("specs")}
              style={{ fontSize: "12px", minHeight: "38px", padding: "8px 14px" }}
            >
              {zh ? "物理测试参数" : "Physical Test Data"}
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "eco" ? "btn-dark" : "btn-outline"}`}
              onClick={() => setActiveTab("eco")}
              style={{ fontSize: "12px", minHeight: "38px", padding: "8px 14px" }}
            >
              {zh ? "环保与认证资质" : "Eco & Compliance"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {materials.map((mat) => (
            <div key={mat.code} className="lab-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#64748b", fontWeight: "600" }}>{mat.code}</span>
                <span className="badge-pill verified">{mat.metric}</span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>{mat.name}</h3>
              <div style={{ fontSize: "12px", color: "#0284c7", fontWeight: "600", marginBottom: "12px" }}>{mat.chineseName}</div>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", minHeight: "56px", marginBottom: "16px" }}>{mat.desc}</p>

              {activeTab === "specs" ? (
                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                  <div className="spec-metric-row">
                    <span>{zh ? "核心测试指标" : "Core Test Metric"}</span>
                    <strong>{mat.metricLabel}</strong>
                  </div>
                  <div className="spec-metric-row">
                    <span>{zh ? "拉伸断裂强度" : "Tensile Strength"}</span>
                    <strong>{mat.tensile}</strong>
                  </div>
                  <div className="spec-metric-row">
                    <span>{zh ? "抗撕裂负荷" : "Tear Resistance"}</span>
                    <strong>{mat.tear}</strong>
                  </div>
                  <div className="spec-metric-row">
                    <span>{zh ? "防水与后整理" : "Waterproof Finish"}</span>
                    <strong style={{ fontSize: "11px", maxWidth: "140px", textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mat.waterproof}</strong>
                  </div>
                </div>
              ) : (
                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                  <div className="spec-metric-row">
                    <span>{zh ? "权威认证" : "Certification"}</span>
                    <strong style={{ fontSize: "11px" }}>{mat.cert}</strong>
                  </div>
                  <div className="spec-metric-row">
                    <span>{zh ? "推荐适用产品" : "Target Application"}</span>
                    <strong style={{ fontSize: "11px", maxWidth: "140px", textAlign: "right" }}>{mat.applications}</strong>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandingLab() {
  const zh = getLocale() === "zh";
  const techniques = [
    {
      title: zh ? "3D 立体微量注塑硅胶标" : "3D Micro-Injection Silicone Badges",
      craft: zh ? "多色高精钢模硫化微量注塑" : "Multi-Color Precision Steel Die Vulcanization",
      precision: "0.8mm - 2.5mm 3D Relief",
      durability: "100% UV & Weatherproof · Zero Cracking",
      moq: "500 pcs",
      fit: zh ? "专业户外、战术机能、高端都市运动系列" : "Technical outdoor, tactical EDC, athletic street",
      desc: zh ? "边缘极其锋利利落，触感丝滑微糯，经久耐洗不老化不变色，呈现高级哑光质感。" : "Razor-sharp edge definition, velvety tactile handfeel, resistant to aging and color fading.",
    },
    {
      title: zh ? "日产田岛高密立体刺绣" : "High-Density 3D Precision Embroidery",
      craft: zh ? "日本 Tajima 电脑多头刺绣机 + EVA高密发泡" : "Japanese Tajima Computerized Heads + High-Density EVA",
      precision: "0.25mm Ultra-fine Pitch · Up to 15 Colors",
      durability: "High Abrasion & Industrial Wash Tested",
      moq: "500 pcs",
      fit: zh ? "传统运动品牌、常春藤学院复古风、品牌徽章" : "Heritage athletic, collegiate lifestyle, chest badges",
      desc: zh ? "德国 Madeira 丝光聚酯线高密缝纫，立体饱满，针脚紧密无浮线，洗水后依然挺括。" : "Embroidered with lustrous Madeira polyester threads for deep dimension and immaculate stitch density.",
    },
    {
      title: zh ? "激光精雕金属铭牌与五金件" : "Laser-Etched Metal Badges & Hardware",
      craft: zh ? "锌合金压铸 + 数控倒角 + 光纤微孔激光精雕" : "Die-Cast Zinc Alloy + CNC Chamfer + Fiber Laser Etch",
      precision: "±0.05mm Engineering Tolerance",
      durability: "48H Salt Spray Anti-Corrosion Rating",
      moq: "1,000 pcs",
      fit: zh ? "高端商务电脑包、行政公文包、轻奢极简设计" : "Executive business briefs, laptop bags, luxury minimalism",
      desc: zh ? "提供哑光枪黑、拉丝黑铬、复古做旧古铜等多种电镀表面，金属质感冷冽沉稳，经得起长期摩擦。" : "Available in matte gunmetal, brushed black chrome, and antique bronze for executive distinction.",
    },
    {
      title: zh ? "热压凹凸烙印真皮/PU皮牌" : "Debossed Genuine & Vegan PU Leather",
      craft: zh ? "高压数控铜模温控热压烫印 (可选烫金/烫银)" : "CNC Brass Die Hydraulic Heat Stamping (Blind/Foil)",
      precision: "0.5mm - 1.2mm Deep Burnished Impression",
      durability: "Natural Burnished Aging Character",
      moq: "500 pcs",
      fit: zh ? "复古帆布包、经典旅行袋、生活方式精品包" : "Vintage canvas daypacks, weekend duffels, lifestyle carry",
      desc: zh ? "高温瞬时热压使纤维致密变色，呈现温润自然的明暗层次；可选封边油边或无缝切边。" : "Controlled hydraulic pressure produces a rich burnished imprint with natural contrast and sealed edges.",
    },
    {
      title: zh ? "3M Scotchlite™ 高反光夜行热压标" : "3M Scotchlite™ Reflective Transfer",
      craft: zh ? "微玻璃珠逆反射工业级热转印" : "Industrial Micro-Glass Bead Retro-Reflective Heat Press",
      precision: "> 450 cd/(lx·m²) High-Visibility Rating",
      durability: "EN ISO 20471 Certified · 50+ Wash Resistance",
      moq: "500 pcs",
      fit: zh ? "夜间骑行包、都市通勤安全包、跑步水袋背心" : "Night cycling packs, commuter safety bags, running vests",
      desc: zh ? "夜间车灯照射下呈现极强反光，保障佩戴者夜行安全，符合欧盟与北美最高安全反光标准。" : "High-intensity retro-reflection under automotive headlights, fully compliant with EN ISO 20471 safety norms.",
    },
  ];

  return (
    <section className="section" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "72px 0" }}>
      <div className="container">
        <div style={{ marginBottom: "36px" }}>
          <span className="badge-pill active"><Gem size={12} /> {zh ? "专属品牌工艺工坊" : "CUSTOM BRANDING & LOGO TECH LAB"}</span>
          <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", margin: "8px 0 6px", fontWeight: "800" }}>
            {zh ? "为您的品牌注入极致质感与视觉辨识度" : "Precision Logo & Branding Execution"}
          </h2>
          <p style={{ color: "#64748b", fontSize: "15px", maxWidth: "680px", margin: 0 }}>
            {zh ? "从模具精雕到高频热压，我们提供5大成熟工业级Logo装饰工艺，确保在恶劣使用环境下不脱落、不褪色、不开裂。" : "Explore 5 industrial branding techniques tested for rigorous weather resistance, zero peeling, and long-term durability."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {techniques.map((item, idx) => (
            <div key={item.title} className="branding-pill-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#0284c7" }}>0{idx + 1} / CRAFT</span>
                <span className="badge-pill" style={{ fontSize: "10px" }}>MOQ: {item.moq}</span>
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: "700", margin: "0 0 6px" }}>{item.title}</h3>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>{item.craft}</div>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", marginBottom: "14px" }}>{item.desc}</p>
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px", fontSize: "11px", display: "grid", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>{zh ? "工艺精度" : "Precision"}:</span>
                  <strong style={{ color: "#0f172a" }}>{item.precision}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>{zh ? "耐久性测试" : "Durability"}:</span>
                  <strong style={{ color: "#059669" }}>{item.durability}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>{zh ? "最佳适用" : "Best Fit"}:</span>
                  <strong style={{ color: "#475569" }}>{item.fit}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JinjiangPowerhouse() {
  const zh = getLocale() === "zh";
  const pillars = [
    {
      icon: Factory,
      title: zh ? "12,000 ㎡ 现代化智造车间" : "12,000 m² Modern Smart Workshop",
      subtitle: zh ? "12 条柔性精益生产吊挂线" : "12 Lean Hanging Production Lines",
      metric: "300,000+ Pcs/Mo",
      desc: zh ? "280+ 名持证熟练缝纫技师与版房打样师，月产各类专业双肩背包30万只以上，支持急单快速分线与大货稳定排产。" : "280+ skilled technicians producing 300,000+ bags monthly with flexible multi-line balancing.",
    },
    {
      icon: Cpu,
      title: zh ? "全数控自动化智能设备" : "Automated Computerized Machinery",
      subtitle: zh ? "±0.1mm CNC 激光与裁床" : "±0.1mm CNC Laser Cutting Tables",
      metric: "180+ Auto Stations",
      desc: zh ? "配备数控激光与振动刀裁床、电脑数控花样车、超声波无缝熔接机与高频热风压胶机，裁片精准无误差。" : "Equipped with CNC laser cutting, pattern stitching stations, ultrasonic seam welding, and seam taping machines.",
    },
    {
      icon: ShieldCheck,
      title: zh ? "厂内实体物理检测实验室" : "In-House Physical Testing Lab",
      subtitle: zh ? "出货前全项目应力与耐候实测" : "Full Suite Physical Stress Testing",
      metric: "100% Pre-Shipment Tested",
      desc: zh ? "配备马丁代尔耐磨仪、恒温恒湿盐雾测试箱、背带拉力机(50kg持续72小时)、耐水压测试机与拉链往复疲劳机。" : "Martindale abrasion, salt spray chamber, 50kg shoulder strap pull tester, and hydrostatic head tester.",
    },
    {
      icon: Award,
      title: zh ? "全球社会责任与环保合规" : "International Audits & ESG Compliance",
      subtitle: zh ? "BSCI A级 / ISO9001 / GRS 4.0" : "BSCI Grade A / ISO9001 / GRS 4.0",
      metric: "Grade-A Certified",
      desc: zh ? "完全通过 BSCI 国际社会责任审核、ISO 9001:2015 质量管理体系认证与 GRS 全球回收标准，符合 REACH 与加州 65 标准。" : "Audited and certified by BSCI (Grade A), ISO 9001:2015, and GRS 4.0. Compliant with REACH and Prop 65.",
    },
  ];

  return (
    <section className="powerhouse-section">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 48px" }}>
          <span className="badge-pill active"><Factory size={12} /> {zh ? "晋江智造实体生产基地" : "JINJIANG SMART MANUFACTURING POWERHOUSE"}</span>
          <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", margin: "12px 0 10px", fontWeight: "800" }}>
            {zh ? "立足中国鞋服箱包之都 · 15分钟全产业链极速响应" : "World-Class Bag Manufacturing at the Hub of Jinjiang"}
          </h2>
          <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6" }}>
            {zh ? "晋江市星点商贸有限责任公司 (JINJIANG STARDOTS CO., LTD.) 坐落于中国福建省泉州市晋江市五里工业区。依托千亿级产业集群，原辅料、拉链、织带与扣具 15 分钟内完成调配，从设计打样到大货出港高效闭环。" : "Located in Wuli Industrial Area, Jinjiang, Quanzhou, Fujian, China. Situated at the epicenter of China’s luggage cluster, raw materials, webbings, and hardware are sourced within 15 minutes."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "36px" }}>
          <div className="stat-pill-box">
            <strong>12,000 ㎡</strong>
            <span>{zh ? "现代化厂房总面积" : "Workshop Facility"}</span>
          </div>
          <div className="stat-pill-box">
            <strong>300,000+</strong>
            <span>{zh ? "月度大货出运产能 (只)" : "Monthly Capacity (Pcs)"}</span>
          </div>
          <div className="stat-pill-box">
            <strong>7 - 10 Days</strong>
            <span>{zh ? "打样出板交付周期" : "Rapid Prototyping Lead"}</span>
          </div>
          <div className="stat-pill-box">
            <strong>Grade A</strong>
            <span>{zh ? "BSCI 国际社会责任等级" : "BSCI Social Audit Score"}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="lab-card" style={{ background: "#ffffff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#e0f2fe", color: "#0284c7", display: "grid", placeItems: "center" }}>
                    <Icon size={22} />
                  </div>
                  <span className="badge-pill verified">{item.metric}</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>{item.title}</h3>
                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", marginBottom: "12px" }}>{item.subtitle}</div>
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", margin: 0 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "36px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a" }}>
              {zh ? "工厂实体地址 (Factory Direct Base)" : "Verified Factory Location"}
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
              {zh ? "中国福建省泉州市晋江市五里工业区 · 晋江市星点商贸有限责任公司" : "Wuli Industrial Area, Jinjiang, Quanzhou, Fujian Province, China · JINJIANG STARDOTS CO., LTD."}
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <a className="btn btn-outline" href="mailto:contact@cnstardots.com" style={{ fontSize: "12px", minHeight: "40px", padding: "8px 16px" }}>
              <Mail size={14} /> {zh ? "预约审厂 / 索取验厂报告" : "Request Audit Report"}
            </a>
            <a className="btn btn-dark" href="https://wa.me/8613655977639" target="_blank" rel="noreferrer" style={{ fontSize: "12px", minHeight: "40px", padding: "8px 16px" }}>
              <Send size={14} /> {zh ? "厂长专线 WhatsApp 直联" : "Direct Factory WhatsApp"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCatalogShowcase() {
  const items = useCatalog();
  const zh = getLocale() === "zh";
  const featuredSkus = ["MH-2506023", "JSD-250407", "MH-2506013", "JSD-250420"];
  const featured = featuredSkus.map(sku => items.find(item => item.sku === sku)).filter(Boolean);

  return (
    <section className="section" style={{ background: "#ffffff", padding: "72px 0" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "36px" }}>
          <div>
            <span className="badge-pill active"><Package size={12} /> {zh ? "精选参考系列" : "REAL REFERENCE BACKPACKS"}</span>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", margin: "8px 0 6px", fontWeight: "800" }}>
              {zh ? "真实出口背包款式库 · 现成纸样快速改板" : "Real Export Backpack Library (67+ Models)"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "15px", maxWidth: "640px", margin: 0 }}>
              {zh ? "所有展示款式均为星点实拍样板，支持基于成熟版型快速调整分层、更替面料、客制Logo与辅料配色，省去高额开模费。" : "All photographs are actual reference models. Modify fabric, branding, and pocket compartments on proven patterns."}
            </p>
          </div>
          <a className="btn btn-dark" href={localHref("/products")} style={{ fontSize: "13px", minHeight: "42px", padding: "10px 18px" }}>
            {zh ? "查看全部 67 款产品库" : "Explore All 67 Models"} <ArrowRight size={15} />
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {featured.map(item => (
            <a
              key={item.sku}
              className="model-card"
              href={localHref(`/products/models/${item.slug}`)}
              style={{ display: "block", textDecoration: "none" }}
            >
              <div className="model-card-photo">
                <img src={item.images[0]} alt={item.name[zh ? 1 : 0]} loading="lazy" />
              </div>
              <div className="model-card-copy">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span className="badge-pill" style={{ fontSize: "10px", padding: "2px 7px" }}>{item.category.toUpperCase()}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#64748b", fontWeight: "600" }}>{item.sku}</span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" }}>
                  {item.name[zh ? 1 : 0]}
                </h3>
                <p style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.4", margin: "0 0 12px" }}>
                  {item.description[zh ? 1 : 0]}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "10px", fontSize: "12px", color: "#0284c7", fontWeight: "600" }}>
                  <span>{zh ? "查看技术规格与定制" : "View Tech Specs"}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const zh = getLocale() === "zh";

  return (
    <main id="main" className="home-page industrial-home">
      <section className="hero-industrial">
        <div className="container hero-industrial-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
              <span className="badge-pill active">
                <Factory size={12} /> {zh ? "中国晋江 · 工贸一体实体制造" : "OEM / ODM BACKPACK MANUFACTURER · JINJIANG"}
              </span>
              <span className="badge-pill verified">
                <CheckCircle2 size={12} /> BSCI GRADE-A
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(36px, 4.2vw, 56px)", lineHeight: "1.08", fontWeight: "800", color: "#0f172a", margin: "0 0 18px", letterSpacing: "-0.04em" }}>
              {zh ? (
                <>为全球品牌打造<br /><span style={{ color: "#0284c7" }}>高性能专业背包</span></>
              ) : (
                <>Engineering High-Performance<br /><span style={{ color: "#0284c7" }}>Backpacks for Global Brands</span></>
              )}
            </h1>

            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#475569", maxWidth: "580px", margin: "0 0 28px" }}>
              {zh ? (
                "晋江市星点商贸有限责任公司，12,000㎡ 实体智造厂房，BSCI 与 ISO9001 双重认证。专业承接战术通勤、超轻户外、商务电脑包 OEM/ODM。7-10 天极速打样出板，月产 30 万+只，泉州/厦门港直发。"
              ) : (
                "JINJIANG STARDOTS CO., LTD. — 12,000 m² smart manufacturing facility in Jinjiang, Fujian, China. Certified by BSCI & ISO9001. Specialized in technical commute, hiking, and laptop backpacks. 7-10 day prototyping, 300,000+ monthly capacity."
              )}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", marginBottom: "28px", maxWidth: "540px" }}>
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0284c7", fontWeight: "700", fontSize: "14px" }}>
                  <Zap size={16} /> {zh ? "7 - 10 天" : "7 - 10 Days"}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  {zh ? "极速打样与纸样出板" : "Rapid Prototyping Lead"}
                </div>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0f172a", fontWeight: "700", fontSize: "14px" }}>
                  <Package size={16} /> {zh ? "300,000+ 只/月" : "300,000+ Pcs/Mo"}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  {zh ? "12条吊挂精益流水线" : "12 Lean Production Lines"}
                </div>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0f172a", fontWeight: "700", fontSize: "14px" }}>
                  <Factory size={16} /> {zh ? "12,000 ㎡" : "12,000 m²"}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  {zh ? "晋江五里工业区实体厂房" : "Jinjiang Wuli Industrial Facility"}
                </div>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#059669", fontWeight: "700", fontSize: "14px" }}>
                  <ShieldCheck size={16} /> {zh ? "BSCI / ISO9001" : "BSCI & ISO9001"}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                  {zh ? "GRS 4.0 环保回收认证" : "GRS 4.0 Scope Certified"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <a className="btn btn-dark" href="#tech-pack-launcher" style={{ fontSize: "13px", padding: "12px 20px" }}>
                <Sliders size={16} /> {zh ? "配置 30秒打样单" : "Configure 30s Tech Pack"}
              </a>
              <a className="btn btn-outline" href={localHref("/products")} style={{ fontSize: "13px", padding: "12px 20px" }}>
                <Package size={16} /> {zh ? "浏览 67 款产品库" : "Browse Catalog (67+)"}
              </a>
              <a className="btn btn-accent" href="https://wa.me/8613655977639" target="_blank" rel="noreferrer" style={{ fontSize: "13px", padding: "12px 20px" }}>
                <Send size={16} /> WhatsApp
              </a>
            </div>
          </div>

          <div>
            <TechPackConfigurator />
          </div>
        </div>
      </section>

      <MaterialEngineeringLab />

      <BrandingLab />

      <JinjiangPowerhouse />

      <FeaturedCatalogShowcase />

      <section className="section" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "72px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 36px" }}>
            <span className="badge-pill active"><Truck size={12} /> {zh ? "集装箱装柜计算器" : "CBM & CONTAINER LOAD ESTIMATOR"}</span>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", margin: "8px 0 6px", fontWeight: "800" }}>
              {zh ? "精确核算外箱容积与国际海运装柜率" : "Calculate Carton CBM & Ocean Container Loading"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "15px" }}>
              {zh ? "大货生产前锁定包装方案。根据包型规格精确模拟 20GP、40GP、40HQ 集装箱装箱利用率，大幅降低单位海运物流成本。" : "Plan your shipping logistics before production begins. Calculate carton volumes and container fill rates for 20GP, 40GP, and 40HQ containers."}
            </p>
          </div>
          <CbmCalculator />
        </div>
      </section>

      <section className="section" id="quote-station" style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "72px 0" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <span className="badge-pill active"><Mail size={12} /> {zh ? "直接询价与打样申请" : "DIRECT RFQ & SAMPLING STATION"}</span>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)", margin: "8px 0 6px", fontWeight: "800" }}>
              {zh ? "提交项目需求 · 24小时内获得正式FOB报价" : "Request Official FOB Quotation & Rapid Sample"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "15px" }}>
              {zh ? "填写您的产品需求，系统将即时生成标准化询价单号 (RFQ-STD-XXXXXX)，并支持一键通过 WhatsApp 或邮件直接对接晋江工厂外贸团队。" : "Submit your brief to generate an official RFQ voucher with direct WhatsApp and email communication."}
            </p>
          </div>
          <QuoteForm />
        </div>
      </section>

      <BannerCTA />
    </main>
  );
}

function PageHero({ label, title, intro, image, imageAlt, imageSlot, imageFit = 'cover', visual, compact = false, secondaryHref = '/products', secondaryLabel = t('ui.exploreProducts') }) {
  const currentCatalog = useCatalog();

  return <section className={`page-hero${compact ? ' compact' : ''}`}><div className="container page-hero-grid"><div><span className="eyebrow">{label}</span><h1>{title}</h1><p>{intro}</p><div className="page-hero-actions"><a className="btn btn-dark" href={quoteHref(currentCatalog)}>{t('ui.requestAQuote')} <ArrowRight size={16} /></a><a className="text-link" href={localHref(secondaryHref)}>{secondaryLabel} <ArrowRight size={16} /></a></div></div>{image && <ContentImage slot={imageSlot??'unmanaged'} className={imageFit === 'contain' ? 'product-hero-image' : imageFit === 'collection' ? 'collection-hero-image' : undefined} src={image} alt={imageAlt || ''} loading="eager" decoding="async" />}{visual}</div></section>;
}

function QualityVisual() {

  return <div className="quality-visual" aria-label={t('ui.illustratedInspectionPlanningChecklist')}><span className="eyebrow">{t('ui.inspectionPlan')}</span><h2>{t('ui.agreeWhatGetsChecked')}</h2><ol><li><Check size={19} />{t('ui.approvedReferenceSample')}</li><li><Check size={19} />{t('ui.constructionAndFinish')}</li><li><Check size={19} />{t('ui.packingAndLabels')}</li><li><Check size={19} />{t('ui.findingsAndFollowUp')}</li></ol><p>{t('planningIllustration')}</p></div>;
}

function IntroBand({ title, children }) {
   return <section className="section"><div className="container prose-intro"><h2>{title}</h2><p>{children}</p></div></section>; }

function GuideCards({ label, title, subtitle, items, soft = false }) {

  return <section className={`section guide-section${soft ? ' soft-section' : ''}`}><div className="container"><SectionHeading eyebrow={label} title={title} subtitle={subtitle} /><div className="guide-grid">{items.map(([heading, body], i) => <div className="guide-card" key={heading}><span className="guide-number">0{i + 1}</span><h3>{heading}</h3><p>{body}</p></div>)}</div></div></section>;
}

function BriefSection({ label = t('ui.startTheConversation'), title, intro, items, note, href, action = t('ui.requestAQuote') }) {
  const currentCatalog = useCatalog();
  href ??= quoteHref(currentCatalog);
  return <section className="section brief-section"><div className="container brief-grid"><div><span className="eyebrow">{label}</span><h2>{title}</h2><p>{intro}</p>{note && <p className="brief-note">{note}</p>}<a className="btn btn-dark" href={localHref(href)}>{action} <ArrowRight size={17} /></a></div><div className="brief-list"><h3>{t('ui.usefulDetailsToShare')}</h3><ul>{items.map(item => <li key={item}><Check size={19} /><span>{item}</span></li>)}</ul></div></div></section>;
}

function CategoryIndex() {
  const catalogItems = useCatalog();
  const { categories } = getSiteData(getLocale());
  return <main id="main"><PageHero label={t('ui.ourProducts')} title={t('ui.bagReferenceModels')} intro={t('ui.browseTheExistingStardotsCollectionByProductFamilyName')} image="/images/hero-bags.jpg" imageSlot="products-hero" imageAlt={t('ui.bagCollection_58b85c')} imageFit="collection" compact secondaryHref="#models" secondaryLabel={t('ui.browseModels')} />
    <CatalogGrid title={t('exploreModels', { count: catalogItems.length })} />
    <section className="section soft-section" id="categories"><div className="container"><SectionHeading title={t('ui.exploreProductFamilies')} subtitle={t('ui.chooseAFamilyToSeeItsReferenceModelsAnd')} /><div className="index-card-grid">{categories.map(c => <a href={localHref(`/products/${c.slug}`)} className="index-category" key={c.slug}><img src={c.image} alt={t('categoryReferenceAlt', { name: c.name })} loading="lazy" /><div><h3>{c.name}</h3><p>{c.intro}</p><span>{t('ui.exploreCategory')} <ArrowRight size={16} /></span></div></a>)}</div></div></section>
    <GuideCards label={t('ui.findYourStartingPoint')} title={t('ui.chooseAroundTheBuyer')} subtitle={t('ui.aUsefulCollectionStartsWithAClearUseCase')} items={[[t('ui.everydayAndWork'), t('ui.compareCarryingFormatOrganizationAndProfessionalPresentationBeforeSettling')], [t('ui.fashionAndLifestyle'), t('ui.decideWhichShapesFinishesAndColorwaysFitOneCoherent')], [t('ui.activeAndTravel'), t('ui.discussAccessCarryingComfortAttachmentPointsAndDestinationRequirements')]]} />
    <BriefSection title={t('ui.aGoodProductBriefSavesTime')} intro={t('ui.youDoNotNeedACompleteTechnicalPackTo')} items={[t('ui.targetCustomerSalesChannelAndIntendedUse'), t('ui.referenceImageSketchOrExistingSample'), t('ui.estimatedOrderQuantityAndDestination'), t('ui.mustHaveFeaturesBrandingAndTargetWindow')]} action={t('ui.requestAQuote')} /><BannerCTA /></main>;
}

function CategoryDetail({ category }) {
  const { categoryGuides, categories } = getSiteData(getLocale());
  const guide = categoryGuides[category.slug];
  return <main id="main"><PageHero label={t('ui.bagCollection')} title={category.name} intro={category.intro} image={category.image} imageAlt={t('categoryImageAlt', { name: category.name })} imageFit="contain" /><section className="section"><div className="container detail-grid"><div><span className="eyebrow">{t('ui.builtForYourBuyer')}</span><h2>{t('ui.madeForYourMarket')}</h2><p>{guide.fit}</p><p>{t('ui.finalDesignSpecificationsMaterialsAndOrderTermsAreAgreed')}</p><a className="btn btn-dark" href={localHref(`/contact?product=${category.slug}#quote`)}>{t('enquireCategory', { name: category.name })} <ArrowRight size={16} /></a></div><div className="detail-panels"><div><h3>{t('ui.whereItCanFit')}</h3><ul>{category.uses.map(x => <li key={x}><Check size={18} />{x}</li>)}</ul></div><div><h3>{t('ui.elementsToDevelop')}</h3><ul>{category.options.map(x => <li key={x}><Check size={18} />{x}</li>)}</ul></div></div></div></section><GuideCards soft label={t('ui.designDecisions')} title={t('designingCategory', { name: category.name })} subtitle={t('ui.theseDecisionsShapeTheSampleAndMakeTheQuotation')} items={guide.decisions} /><BriefSection label={t('ui.beforeSampling')} title={t('ui.startWithAClearUseCase')} intro={guide.question} items={guide.brief} note={t('ui.materialsPerformanceRequirementsAndTestingAreConfirmedForThe')} href={localHref(`/contact?product=${category.slug}#quote`)} action={t('discussCategory', { name: category.name })} /><section className="section soft-section"><div className="container"><SectionHeading title={t('ui.howWeDevelopYourBag')} subtitle={t('ui.aClearProcessFromIdeaToFinishedCollection')} href={localHref('/buyers')} link={t('ui.exploreTheProcess')} /><div className="three-steps"><div><span>01</span><h3>{t('ui.shareYourBrief')}</h3><p>{t('ui.tellUsYourTargetBuyerUseCaseQuantityAnd')}</p></div><div><span>02</span><h3>{t('ui.reviewASample')}</h3><p>{t('ui.confirmTheLookFunctionWorkmanshipAndBranding')}</p></div><div><span>03</span><h3>{t('ui.planProduction')}</h3><p>{t('ui.agreeOnFinalSpecificationsChecksAndDeliveryRequirements')}</p></div></div></div></section><section className="section"><div className="container"><SectionHeading title={t('ui.exploreMoreCategories')} href={localHref('/products')} link={t('ui.allProducts')} /><div className="related-grid">{categories.filter(c => c.slug !== category.slug).slice(0, 3).map(c => <CategoryCard key={c.slug} category={c} />)}</div></div></section><BannerCTA /></main>;
}

function AboutPage() {
  const { COMPANY } = getSiteData(getLocale());
  return <main id="main"><PageHero label={t('ui.aboutStardots')} title={t('ui.aGlobalBagSourcingPartnerFromChina')} intro={t('ui.weHelpBrandsWholesalersAndRetailersTurnProductIdeas')} image="/images/hero-bags.jpg" imageSlot="about-collection" imageAlt={t('ui.bagCollection_58b85c')} imageFit="collection" /><IntroBand title={t('ui.betterBagsBeginWithBetterPartnerships')}>{t('aboutIntro', { legal: COMPANY.legal })}</IntroBand><section className="section soft-section"><div className="container"><SectionHeading title={t('ui.whyBuyersWorkWithUs')} subtitle={t('ui.aDefinedRolePracticalCoordinationAndDecisionsYouCan')} /><div className="strength-grid">{strengths().map(([Icon, title, description]) => <div className="strength" key={title}><Icon size={38} strokeWidth={1.3} /><h3>{title}</h3><p>{description}</p></div>)}</div></div></section><GuideCards label={t('ui.ourWorkingModel')} title={t('ui.aCoordinatedProjectWithClearApprovals')} subtitle={t('ui.yourBriefGuidesEachDecisionWeWorkWithSuitable')} items={[[t('ui.understandTheCommercialGoal'), t('ui.weAskWhoTheBagIsForHowIt')], [t('ui.approveTheProductDirection'), t('ui.aSampleAndWrittenRequirementsGiveBothTeamsA')], [t('ui.coordinateTheHandoffs'), t('ui.materialsProductionChecksPackingAndShipmentArePlannedAgainst')]]} /><section className="section soft-section"><div className="container split-feature"><ContentImage slot="about-development" src="/images/design-reference.jpg" alt={t('ui.bagDevelopmentSketches')} /><div><span className="eyebrow">{t('ui.howWeWork')}</span><h2>{t('ui.oneClearPathFromBriefToDelivery')}</h2><p>{t('ui.ourRoleIsToBringTogetherTheRightMaterials')}</p><p>{t('ui.factorySelectionTestingCostsAndTimingAreDiscussedFor')}</p><LinkArrow href={localHref('/services')}>{t('ui.exploreOurServices')}</LinkArrow></div></div></section><BriefSection title={t('ui.tellUsWhatYouAreBuilding')} intro={t('ui.aShortBriefIsEnoughToStartAUseful')} items={[t('ui.productCategoryAndIntendedBuyer'), t('ui.designReferencesOrATechnicalPack'), t('ui.estimatedVolumeAndDestination'), t('ui.brandingQualityAndTimingPriorities')]} /><BannerCTA /></main>;
}

function ServicesPage() {
  const { services } = getSiteData(getLocale());
  return <main id="main"><PageHero label={t('ui.ourServices')} title={t('ui.fromYourIdeaToAFinishedCollection')} intro={t('ui.theExpertiseAndCoordinationYouNeedToBuildA')} image="/images/design-reference.jpg" imageAlt={t('ui.bagDevelopmentSketchAndSample')} /><section className="section"><div className="container"><SectionHeading title={t('ui.supportAtEveryStage')} subtitle={t('ui.chooseTheSupportYourProjectNeedsFromTheFirst')} /><div className="service-index">{services.map((s, i) => { const Icon = [Layers3, PenLine, ShoppingBag, ShieldCheck, Truck][i]; return <a href={localHref(`/services/${s.slug}`)} key={s.slug}><span className="service-index-icon"><Icon size={31} strokeWidth={1.4} /></span><div><span>0{i + 1}</span><h3>{s.name}</h3><p>{s.detail}</p></div><ArrowRight size={21} /></a>; })}</div></div></section><ResponsibilityGuide /><GuideCards soft label={t('ui.aSharedPlan')} title={t('ui.decisionsStayVisibleFromBriefToShipment')} subtitle={t('ui.eachStageIsConfirmedAroundYourProductAndOrder')} items={[[t('ui.defineTheProduct'), t('ui.agreeOnTheTargetUserDesignPrioritiesMaterialDirection')], [t('ui.approveTheReference'), t('ui.reviewAPhysicalSampleAndCaptureTheSpecificationsBranding')], [t('ui.planTheOrder'), t('ui.confirmProductionScopeInspectionPointsPackingCommercialTermsAnd')]]} /><BriefSection title={t('ui.whichServicesDoesYourProjectNeed')} intro={t('ui.tellUsWhereYouAreInTheProcessWe')} items={[t('ui.currentStageIdeaDesignSampleOrExistingProduct'), t('ui.targetBuyerMarketAndPlannedVolume'), t('ui.availableArtworkTechnicalFilesAndReferences'), t('ui.qualityPackingAndDestinationRequirements')]} /><BannerCTA /></main>;
}

function ServiceDetail({ service }) {
  const { serviceGuides, serviceMedia, services } = getSiteData(getLocale());
  const guide = serviceGuides[service.slug];
  return <main id="main"><PageHero label={t('ui.ourServices')} title={service.name} intro={service.short} image={serviceMedia[service.slug]?.src} imageAlt={serviceMedia[service.slug]?.alt} visual={service.slug === 'quality-control' ? <QualityVisual /> : null} /><IntroBand title={t('ui.builtAroundYourBrief')}>{service.detail} {t('serviceIntroSuffix')}</IntroBand><GuideCards soft label={t('ui.howThisServiceHelps')} title={t('serviceApproach', { name: service.name })} subtitle={t('ui.theExactScopeIsSetAfterWeUnderstandYour')} items={guide.scope} /><section className="section"><div className="container two-list-grid"><div className="list-panel"><span className="eyebrow">{t('ui.fromYourSide')}</span><h2>{t('ui.whatHelpsUsGetStarted')}</h2><ul>{guide.inputs.map(x => <li key={x}><Check size={18} />{x}</li>)}</ul></div><div className="list-panel"><span className="eyebrow">{t('ui.toAgreeTogether')}</span><h2>{t('ui.whatWeWorkToward')}</h2><ul>{guide.outcomes.map(x => <li key={x}><Check size={18} />{x}</li>)}</ul></div></div><p className="container service-caveat">{guide.note}</p></section><BriefSection title={t('ui.discussYourProjectRequirements')} intro={t('ui.sendTheInformationYouHaveNowWeWillHelp')} items={guide.inputs} action={t('ui.requestAQuote')} /><section className="section soft-section"><div className="container"><SectionHeading title={t('ui.exploreMoreServices')} href={localHref('/services')} link={t('ui.allServices')} /><div className="service-links">{services.filter(s => s.slug !== service.slug).map(s => <a href={localHref(`/services/${s.slug}`)} key={s.slug}>{s.name}<ArrowRight size={17} /></a>)}</div></div></section><BannerCTA /></main>;
}

function CbmCalculator() {
  const zh = getLocale() === 'zh';
  const [packPreset, setPackPreset] = useState('backpack');
  const [length, setLength] = useState(50);
  const [width, setWidth] = useState(38);
  const [height, setHeight] = useState(42);
  const [pcsPerCarton, setPcsPerCarton] = useState(20);
  const [quantity, setQuantity] = useState(3000);

  const presets = {
    backpack: { name: zh ? '标准双肩背包 / 书包' : 'Standard Backpack / Daypack', l: 50, w: 38, h: 42, pcs: 20 },
    travel: { name: zh ? '大型户外/旅行包' : 'Outdoor & Travel Duffel', l: 58, w: 42, h: 46, pcs: 15 },
    briefcase: { name: zh ? '商务通勤/电脑公文包' : 'Business Briefcase / Laptop Bag', l: 48, w: 36, h: 38, pcs: 20 },
    pouch: { name: zh ? '轻便小包/腰包/副包' : 'Compact Pouch / Sling Bag', l: 45, w: 35, h: 30, pcs: 50 },
  };

  const handlePreset = (key) => {
    setPackPreset(key);
    const p = presets[key];
    if (p) {
      setLength(p.l);
      setWidth(p.w);
      setHeight(p.h);
      setPcsPerCarton(p.pcs);
    }
  };

  const totalCartons = Math.max(1, Math.ceil(quantity / Math.max(1, pcsPerCarton)));
  const cartonCbm = (length * width * height) / 1000000;
  const totalCbm = totalCartons * cartonCbm;

  const cap20 = 28;
  const cap40 = 58;
  const cap40hq = 68;

  const pct20 = Math.min(100, Math.round((totalCbm / cap20) * 100));
  const pct40 = Math.min(100, Math.round((totalCbm / cap40) * 100));
  const pct40hq = Math.min(100, Math.round((totalCbm / cap40hq) * 100));

  let containerRecommendation = '';
  if (totalCbm <= 15) {
    containerRecommendation = zh
      ? '建议采用 LCL 散货拼箱运输，或凑单至 20GP 整柜以获得更优单件海运成本。'
      : 'Recommended: LCL (Less than Container Load) shipping, or increase order volume to fill a 20GP container for optimal per-unit freight efficiency.';
  } else if (totalCbm <= 28) {
    containerRecommendation = zh
      ? `非常匹配 1× 20GP 小柜（FCL 整柜装载率约 ${pct20}%），无拼箱中转破损风险。`
      : `Optimal fit for 1× 20GP Container (FCL load rate approx. ${pct20}%), zero transshipment risk.`;
  } else if (totalCbm <= 58) {
    containerRecommendation = zh
      ? `建议采用 1× 40GP 平柜（FCL 整柜装载率约 ${pct40}%），最具性价比。`
      : `Recommended: 1× 40GP Standard Container (FCL load rate approx. ${pct40}%), best freight economy.`;
  } else if (totalCbm <= 68) {
    containerRecommendation = zh
      ? `完美匹配 1× 40HQ 高柜（FCL 高柜装载率约 ${pct40hq}%），极大摊薄单包运输成本。`
      : `Ideal for 1× 40HQ High Cube Container (FCL load rate approx. ${pct40hq}%), maximizing cubic capacity.`;
  } else {
    const hqCount = (totalCbm / cap40hq).toFixed(1);
    containerRecommendation = zh
      ? `预计需要约 ${hqCount} 个 40HQ 高柜配载，晋江港口出运支持灵活多柜排期与分批离岸。`
      : `Estimated ~${hqCount}× 40HQ High Cube containers needed. Export coordination supports multi-container scheduling directly from Quanzhou/Xiamen ports.`;
  }

  const quoteParams = new URLSearchParams({
    quantity: String(quantity),
    message: zh
      ? `预估包装方案：${presets[packPreset]?.name || '定制包'}，每箱 ${pcsPerCarton} 件，总计约 ${totalCartons} 箱，预估整单体积 ${totalCbm.toFixed(2)} CBM。`
      : `Estimated packaging brief: ${presets[packPreset]?.name || 'Custom Bag'}, ${pcsPerCarton} pcs/carton, approx ${totalCartons} cartons, total volume ~${totalCbm.toFixed(2)} CBM.`,
  });

  return (
    <section className="section cbm-calculator-section" id="cbm-calculator">
      <div className="container">
        <SectionHeading
          eyebrow={zh ? '国际采购专属工具' : 'BUYER PROCUREMENT TOOL'}
          title={zh ? '集装箱装载体积计算器 (CBM & Container Estimator)' : 'CBM & Container Load Estimator'}
          subtitle={zh ? '按箱规尺寸与订购量，即时测算外箱体积、整单立方数与国际标准货柜装载比例。' : 'Calculate carton volume, total CBM, and 20GP / 40GP / 40HQ container load distribution in real time.'}
        />
        <div className="cbm-tool-card">
          <div className="cbm-inputs">
            <h3>{zh ? '1. 设定或微调包装规格' : '1. Packaging & Order Parameters'}</h3>
            <div className="cbm-presets">
              {Object.entries(presets).map(([key, item]) => (
                <button
                  type="button"
                  key={key}
                  className={`cbm-preset-btn ${packPreset === key ? 'active' : ''}`}
                  onClick={() => handlePreset(key)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="cbm-field-grid">
              <label>
                {zh ? '外箱长 (cm)' : 'Carton Length (cm)'}
                <input type="number" min="10" max="200" value={length} onChange={e => setLength(Number(e.target.value) || 1)} />
              </label>
              <label>
                {zh ? '外箱宽 (cm)' : 'Carton Width (cm)'}
                <input type="number" min="10" max="200" value={width} onChange={e => setWidth(Number(e.target.value) || 1)} />
              </label>
              <label>
                {zh ? '外箱高 (cm)' : 'Carton Height (cm)'}
                <input type="number" min="10" max="200" value={height} onChange={e => setHeight(Number(e.target.value) || 1)} />
              </label>
              <label>
                {zh ? '每箱装数 (Pcs/Ctn)' : 'Pcs / Carton'}
                <input type="number" min="1" max="500" value={pcsPerCarton} onChange={e => setPcsPerCarton(Number(e.target.value) || 1)} />
              </label>
            </div>
            <div className="cbm-qty-group">
              <label>
                {zh ? '计划订购总量 (Pcs)' : 'Planned Order Quantity (Pcs)'}
                <input type="number" min="100" step="100" value={quantity} onChange={e => setQuantity(Number(e.target.value) || 100)} />
              </label>
              <div className="cbm-quick-qtys">
                {[500, 1000, 2500, 5000, 10000].map(q => (
                  <button type="button" key={q} className={`quick-qty-btn ${quantity === q ? 'active' : ''}`} onClick={() => setQuantity(q)}>
                    {q.toLocaleString()} pcs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="cbm-results">
            <h3>{zh ? '2. 即时测算指标' : '2. Calculated Volume & Loading'}</h3>
            <div className="cbm-stat-row">
              <div className="cbm-stat">
                <span className="stat-label">{zh ? '总外箱数' : 'Total Cartons'}</span>
                <strong className="stat-value">{totalCartons.toLocaleString()} <small>{zh ? '箱' : 'ctns'}</small></strong>
              </div>
              <div className="cbm-stat">
                <span className="stat-label">{zh ? '单箱体积' : 'Per Carton CBM'}</span>
                <strong className="stat-value">{cartonCbm.toFixed(3)} <small>m³</small></strong>
              </div>
              <div className="cbm-stat highlight">
                <span className="stat-label">{zh ? '整单总体积 (Total CBM)' : 'Total Volume (CBM)'}</span>
                <strong className="stat-value">{totalCbm.toFixed(2)} <small>CBM</small></strong>
              </div>
            </div>

            <div className="cbm-containers">
              <h4>{zh ? '标准国际海运货柜配载率 (FCL Container Fit)' : 'Container Utilization (FCL Capacity)'}</h4>
              <div className="container-bar-group">
                <div className="bar-header">
                  <span>20GP ({zh ? '标容 ~28 CBM' : 'Cap ~28 CBM'})</span>
                  <strong>{pct20}% {pct20 >= 100 ? (zh ? '(满载/超额)' : '(Full/Overflow)') : ''}</strong>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${pct20}%`, backgroundColor: pct20 >= 100 ? '#b54432' : '#303c2b' }}></div></div>
              </div>
              <div className="container-bar-group">
                <div className="bar-header">
                  <span>40GP ({zh ? '标容 ~58 CBM' : 'Cap ~58 CBM'})</span>
                  <strong>{pct40}% {pct40 >= 100 ? (zh ? '(满载/超额)' : '(Full/Overflow)') : ''}</strong>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${pct40}%`, backgroundColor: pct40 >= 100 ? '#b54432' : '#303c2b' }}></div></div>
              </div>
              <div className="container-bar-group">
                <div className="bar-header">
                  <span>40HQ ({zh ? '标容 ~68 CBM' : 'Cap ~68 CBM'})</span>
                  <strong>{pct40hq}% {pct40hq >= 100 ? (zh ? '(超单个高柜)' : '(Multi-HQ required)') : ''}</strong>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${pct40hq}%`, backgroundColor: pct40hq >= 100 ? '#b54432' : '#303c2b' }}></div></div>
              </div>
            </div>

            <div className="cbm-recommendation">
              <strong>{zh ? '出海货代规划建议：' : 'Export Logistics Advice: '}</strong>
              <span>{containerRecommendation}</span>
            </div>

            <a className="btn btn-dark cbm-action-btn" href={localHref(`/contact?${quoteParams.toString()}#quote`)}>
              {zh ? '带入此装箱规格提交询价 (RFQ)' : 'Inquire with this Packing Spec'} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function BuyersPage() {
  const { markets } = getSiteData(getLocale());
  return <main id="main"><PageHero label={t('ui.forBuyers')} title={t('ui.sourcingBagsWithClarityAndConfidence')} intro={t('ui.aPracticalGuideForImportersWholesalersAndBrandsPreparing')} image="/images/duffel.webp" imageAlt={t('ui.travelBag')} imageFit="contain" /><section className="section"><div className="container"><SectionHeading title={t('ui.howAProjectMovesForward')} subtitle={t('ui.aStraightforwardPathWithDecisionsYouCanReviewAnd')} /><div className="process-grid">{process().map(([Icon, title, description], i) => <div className="process-card" key={title}><span className="process-num">0{i + 1}</span><Icon size={25} /><h3>{title}</h3><p>{description}</p></div>)}</div></div></section><section className="section soft-section"><div className="container"><SectionHeading title={t('ui.planTheEssentialsEarly')} subtitle={t('ui.aGoodQuotationDependsOnTheRightProjectAssumptions')} /><div className="buyer-grid"><div><h3>{t('quantityMoq')}</h3><p>{t('ui.shareYourTargetVolumeMoqIsConfirmedForThe')}</p></div><div><h3>{t('ui.sampling')}</h3><p>{t('ui.supplyASketchTechnicalPackOrReferenceSampleScope')}</p></div><div><h3>{t('ui.quality')}</h3><p>{t('ui.approveTheSampleAndWrittenRequirementsInspectionPointsAre')}</p></div><div><h3>{t('ui.shipping')}</h3><p>{t('ui.destinationVolumeAndTimingGuidePackagingAndSuitableSea')}</p></div></div></div></section><ResponsibilityGuide /><CbmCalculator /><GuideCards label={t('ui.approvalCheckpoints')} title={t('ui.knowWhatShouldBeAgreedInWriting')} subtitle={t('ui.theseCheckpointsReduceAmbiguityAsAProjectMovesForward')} items={[[t('ui.beforeSampling_8626da'), t('ui.agreeOnTheIntendedUseDesignPrioritiesReferencesAnd')], [t('ui.beforeProduction'), t('ui.approveTheSampleAndFinalSpecificationsConfirmOrderQuantity')], [t('ui.beforeShipment'), t('ui.reviewPackingLabelsDocumentsAndTheDeliveryTermsAgreed')]]} /><BriefSection title={t('ui.prepareABriefWeCanActOn')} intro={t('ui.evenAnEarlyStageEnquiryBecomesMoreUsefulWhen')} items={[t('ui.bagTypeTargetCustomerAndSalesChannel'), t('ui.sketchReferenceImageOrTechnicalPack'), t('ui.materialLogoAndPackagingPreferences'), t('ui.estimatedQuantityDestinationAndRequiredWindow')]} note={t('ui.ifYouDoNotYetKnowADetailState')} /><section className="section soft-section"><div className="container"><SectionHeading title={t('ui.planForYourDestination')} subtitle={t('ui.planningForASpecificDestinationHelpsAlignProductAnd')} /><div className="market-grid">{markets.map(m => <MarketCard market={m} key={m.slug} />)}</div></div></section><section className="section"><div className="container narrow"><SectionHeading title={t('ui.buyerFaqs')} href={localHref('/faq')} link={t('ui.seeAllFaqs')} /><FAQList limit={5} /></div></section><BannerCTA /></main>;
}

function MarketPage({ market }) {
  const { marketGuides, categories } = getSiteData(getLocale());
  const guide = marketGuides[market.slug];
  return <main id="main"><section className="market-page-hero"><div className="market-photo" style={{ backgroundPosition: `${market.position} center` }} /><div className="container"><span className="eyebrow">{t('ui.destinationPlanning')}</span><h1>{market.name}</h1><p>{market.sub}. {t('marketIntroSuffix')}</p></div></section><IntroBand title={t('ui.aCollectionBuiltForYourAudience')}>{guide.intro}</IntroBand><GuideCards soft label={t('ui.marketPlanning')} title={t('ui.threeQuestionsToSettleEarly')} subtitle={t('ui.theRightAnswerDependsOnTheSpecificBuyerOrder')} items={guide.priorities} /><BriefSection title={t('marketPlanningTitle', { name: market.name })} intro={t('ui.sendYourMarketBriefAndTheRequirementsProvidedBy')} items={guide.brief} action={t('ui.requestAQuote')} /><section className="section soft-section"><div className="container"><SectionHeading title={t('ui.exploreProductCategories')} href={localHref('/products')} link={t('ui.allProducts')} /><div className="related-grid">{categories.slice(0, 3).map(c => <CategoryCard key={c.slug} category={c} />)}</div></div></section><BannerCTA /></main>;
}

function ResourcesPage() {
  const { articles } = getSiteData(getLocale());
  return <main id="main"><PageHero label={t('ui.insightsResources')} title={t('ui.ideasAndGuidesForBetterBagSourcing')} intro={t('ui.practicalReadingForBuyersPlanningProductsMaterialsAndInternational')} image="/images/materials-reference.jpg" imageAlt={t('ui.materialSwatches')} /><GuideCards label={t('ui.yourReadingPath')} title={t('ui.startWithTheDecisionInFrontOfYou')} subtitle={t('ui.useTheseGuidesToPrepareASharperBriefAnd')} items={[[t('ui.buildingACollection'), t('ui.mapTheBuyerUseCaseAndSampleApprovalsBefore')], [t('ui.selectingMaterials'), t('ui.compareTheCompleteBagConstructionNotOnlyTheOuter')], [t('ui.planningDelivery'), t('ui.setPackingAndShippingRequirementsWhileTheOrderIs')]]} /><section className="section soft-section"><div className="container"><SectionHeading title={t('ui.buyerGuides')} subtitle={t('ui.practicalChecklistsToSupportProductMaterialAndShippingConversations')} /><div className="resource-grid">{articles.map(a => <ArticleCard key={a.slug} article={a} />)}</div></div></section><section className="section"><div className="container split-feature"><div><span className="eyebrow">{t('ui.questionsAnswered')}</span><h2>{t('ui.needAnAnswerBeforeYouBegin')}</h2><p>{t('ui.findClearGuidanceOnOrderQuantitiesSamplingCustomizationShipping')}</p><LinkArrow href={localHref('/faq')}>{t('ui.browseFrequentlyAskedQuestions')}</LinkArrow></div><CircleHelp className="resource-icon" size={160} strokeWidth={0.8} /></div></section><BannerCTA /></main>;
}

function ArticlePage({ article }) {
  const currentCatalog = useCatalog();
  const { articleExtras, articles } = getSiteData(getLocale());
  const extra = articleExtras[article.slug];
  return <main id="main"><section className="article-hero"><div className="container article-hero-grid"><div><a href={localHref('/resources')} className="back-link">{t('backAllResources')}</a><span className="eyebrow">{article.date}</span><h1>{article.title}</h1><p>{article.excerpt}</p></div><img src={article.image} alt="" /></div></section><section className="section"><article className="container article-body"><p className="lead">{article.excerpt} {t('articleLeadSuffix')}</p>{article.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<div className="article-checklist"><h2>{t('ui.buyerChecklist')}</h2><p>{t('ui.bringThesePointsIntoTheFirstProjectDiscussion')}</p><ul>{extra.checklist.map(x => <li key={x}><Check size={18} />{x}</li>)}</ul></div><div className="article-watch"><h2>{t('ui.commonPointsToWatch')}</h2><ul>{extra.watch.map(x => <li key={x}>{x}</li>)}</ul></div><div className="article-callout"><h3>{t('ui.readyToDiscussYourCollection')}</h3><p>{t('ui.tellUsWhatYouNeedAndWeWillHelp')}</p><LinkArrow href={quoteHref(currentCatalog)}>{t('ui.requestAQuote')}</LinkArrow></div></article></section><section className="section soft-section"><div className="container"><SectionHeading title={t('ui.moreInsights')} href={localHref('/resources')} link={t('ui.allResources')} /><div className="resource-grid">{articles.filter(a => a.slug !== article.slug).map(a => <ArticleCard key={a.slug} article={a} />)}</div></div></section></main>;
}

function FAQPage() {
  const currentCatalog = useCatalog();
  const { faqs } = getSiteData(getLocale()); const groups = [...new Set(faqs.map(f => f.group))]; return <main id="main"><PageHero label={t('ui.frequentlyAskedQuestions')} title={t('ui.quickAnswersForBagBuyers')} intro={t('ui.theDetailsOfEveryProjectAreDifferentTheseAnswers')} image="/images/design-reference.jpg" imageAlt={t('ui.bagConceptDrawing')} /><section className="section"><div className="container faq-page-grid"><div className="faq-aside"><span className="eyebrow">{t('ui.findAnAnswer')}</span><h2>{t('ui.planYourNextMoveWithConfidence')}</h2><p>{t('ui.browseTheTopicsBelowIfARequirementIsUnique')}</p><a className="btn btn-dark" href={quoteHref(currentCatalog)}>{t('ui.askOurTeam')} <ArrowRight size={16} /></a></div><div>{groups.map(group => <div className="faq-group" key={group}><h2>{group}</h2><div className="faq-list">{faqs.filter(f => f.group === group).map(f => <details key={f.q}><summary>{f.q}<span>+</span></summary><p>{f.a}</p></details>)}</div></div>)}</div></div></section><BannerCTA /></main>; }

function contactLinks(form) {
  const { COMPANY, categories } = getSiteData(getLocale());
  const categoryIndex = getSiteData('en').categories.findIndex(category => category.name === form.product);
  const product = categoryIndex >= 0 ? categories[categoryIndex].name : form.product === 'Other / custom' ? t('ui.otherCustom') : form.product;
  const routeKeys = { reference: 'ui.existingReferenceBulkSourcing', custom: 'customDesignOption', both: 'ui.bothRoutes' };
  const stageKeys = { exploring: 'ui.exploringIdeas', brief: 'ui.briefOrTechnicalPackReady', sample: 'ui.readyToDiscussASample', order: 'ui.planningAnOrder' };
  const projectType = routeKeys[form.projectType] ? t(routeKeys[form.projectType]) : '';
  const stage = stageKeys[form.stage] ? t(stageKeys[form.stage]) : '';
  const subject = `${t('formSubject')}${product ? ` — ${product}` : ''}`;
  const fields = [['briefName', form.name], ['briefCompany', form.company], ['briefEmail', form.email], ['briefCountry', form.country], ['briefProduct', product], ['briefReferenceModel', form.model || '—'], ['briefEstimatedQuantity', form.quantity], ['briefSourcingRoute', projectType], ['briefProjectStage', stage], ['briefReferenceLink', form.referenceUrl], ['briefTargetWindow', form.targetWindow]];
  const body = fields.map(([key, value]) => `${t(key)}: ${value || ''}`).concat('', form.message || '').join('\n');
  return { mail: `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, whatsapp: `${COMPANY.whatsapp}?text=${encodeURIComponent(`${subject}\n${body}`)}` };
}

function QuoteForm() {
  const catalogItems = useCatalog();
  const { categories } = getSiteData(getLocale());
  const [selectedModel, setSelectedModel] = useState(null);
  const [form, setForm] = useState({ name: '', company: '', email: '', country: '', product: '', model: '', quantity: '', projectType: '', stage: '', referenceUrl: '', targetWindow: '', message: '', consent: false, website: '', sourcePage: localHref('/contact') });
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [rfqVoucher, setRfqVoucher] = useState(null);
  const [copied, setCopied] = useState(false);
  const delivery = 'draft';
  const links = contactLinks(form);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedProduct = categories.find(category => category.slug === params.get('product'));
    const model = catalogItems.find(item => item.sku === params.get('model') && (!requestedProduct || item.category === requestedProduct.slug));
    const source = params.get('source');
    setSelectedModel(model || null);
    const englishCategories = getSiteData('en').categories;
    const product = requestedProduct?.slug || model?.category;
    setForm(old => ({ ...old, product: englishCategories.find(category => category.slug === product)?.name || '', model: model?.sku || '', projectType: ['reference', 'custom', 'both'].includes(params.get('route')) ? params.get('route') : model ? 'reference' : '', sourcePage: source && /^\/[a-z0-9/\-]*$/i.test(source) ? source : localHref('/contact') }));
  }, []);

  function update(key, value) {
    setForm(old => ({ ...old, [key]: value }));
    setFieldErrors(old => ({ ...old, [key]: null }));
  }
  async function submit(event) {
    event.preventDefault();
    if (busy || delivery === 'checking') return;
    const { values, errors } = validateInquiry({ ...form, language: getLocale() });
    if (Object.keys(errors).length) { setFieldErrors(errors); setStatus({ kind: 'error', text: t('ui.pleaseReviewTheHighlightedFields') }); requestAnimationFrame(() => document.querySelector('#quote [aria-invalid="true"]')?.focus()); return; }
    setFieldErrors({}); setBusy(true); setStatus(null);
    if (delivery === 'draft') {
      const refCode = `RFQ-STD-${Math.floor(100000 + Math.random() * 900000)}`;
      setRfqVoucher({
        refCode,
        name: form.name,
        company: form.company,
        email: form.email,
        country: form.country,
        product: form.product || 'Backpack',
        model: form.model || 'Custom',
        quantity: form.quantity || 'TBD',
        whatsappUrl: `${links.whatsapp}%0A%5BRFQ%20Ref%3A%20${refCode}%5D`,
        mailUrl: links.mail
      });
      setStatus({ kind: 'success', text: getLocale() === 'zh' ? `询盘凭单已生成（单号：${refCode}）！请选择 WhatsApp 即时洽谈或发送邮件。` : `Inquiry prepared (${refCode})! Connect on WhatsApp or send via email below.` });
      setBusy(false);
      return;
    }

    setBusy(false);
  }
  const error = (key) => fieldErrors[key] && <span className="field-error" id={`error-${key}`}>{fieldErrors[key]}</span>;
  return <form id="quote" className="quote-form" onSubmit={submit} noValidate>{selectedModel && <p className="model-form-reference">{t('formReference', { sku: selectedModel.sku })}</p>}<div className="form-grid">
    <label>{t('ui.yourName')}<input autoComplete="name" value={form.name} maxLength="100" aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? 'error-name' : undefined} onChange={event => update('name', event.target.value)} />{error('name')}</label>
    <label>{t('ui.companyName')}<input autoComplete="organization" value={form.company} maxLength="150" aria-invalid={!!fieldErrors.company} aria-describedby={fieldErrors.company ? 'error-company' : undefined} onChange={event => update('company', event.target.value)} />{error('company')}</label>
    <label>{t('ui.email_604e4b')}<input type="email" autoComplete="email" value={form.email} maxLength="180" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'error-email' : undefined} onChange={event => update('email', event.target.value)} />{error('email')}</label>
    <label>{t('ui.countryRegion')}<input autoComplete="country-name" value={form.country} maxLength="100" aria-invalid={!!fieldErrors.country} aria-describedby={fieldErrors.country ? 'error-country' : undefined} onChange={event => update('country', event.target.value)} />{error('country')}</label>
    <label>{t('ui.productInterest')}<select value={form.product} aria-invalid={!!fieldErrors.product} aria-describedby={fieldErrors.product ? 'error-product' : undefined} onChange={event => update('product', event.target.value)}><option value="">{t('ui.selectABagCategory')}</option>{categories.map(category => <option key={category.slug} value={getSiteData('en').categories.find(english => english.slug === category.slug)?.name}>{category.name}</option>)}<option value="Other / custom">{t('ui.otherCustom')}</option></select>{error('product')}</label>
    <label>{t('ui.estimatedQuantity')} <span className="optional">{t('ui.optional')}</span><input inputMode="numeric" placeholder={t('ui.ifKnown')} value={form.quantity} maxLength="50" onChange={event => update('quantity', event.target.value)} />{error('quantity')}</label>
  </div><fieldset className="project-context"><legend>{t('ui.projectDetails_c876b8')} <span className="optional">{t('ui.optional')}</span></legend><p>{t('ui.shareWhatYouKnowYouCanLeaveTheRest')}</p><div className="form-grid">
    <label>{t('ui.sourcingRoute')}<select value={form.projectType} aria-invalid={!!fieldErrors.projectType} aria-describedby={fieldErrors.projectType ? 'error-projectType' : undefined} onChange={event => update('projectType', event.target.value)}><option value="">{t('ui.selectIfKnown')}</option><option value="reference">{t('ui.existingReferenceBulkSourcing')}</option><option value="custom">{t('customDesignOption')}</option><option value="both">{t('ui.bothRoutes')}</option></select>{error('projectType')}</label>
    <label>{t('ui.projectStage')}<select value={form.stage} aria-invalid={!!fieldErrors.stage} aria-describedby={fieldErrors.stage ? 'error-stage' : undefined} onChange={event => update('stage', event.target.value)}><option value="">{t('ui.selectIfKnown')}</option><option value="exploring">{t('ui.exploringIdeas')}</option><option value="brief">{t('ui.briefOrTechnicalPackReady')}</option><option value="sample">{t('ui.readyToDiscussASample')}</option><option value="order">{t('ui.planningAnOrder')}</option></select>{error('stage')}</label>
    <label>{t('ui.referenceLink')}<input type="url" placeholder={t('ui.https')} value={form.referenceUrl} maxLength="1000" aria-invalid={!!fieldErrors.referenceUrl} aria-describedby={fieldErrors.referenceUrl ? 'error-referenceUrl reference-help' : 'reference-help'} onChange={event => update('referenceUrl', event.target.value)} />{error('referenceUrl')}<small id="reference-help">{t('ui.aPublicReferenceOrSharedBriefSendPrivateFiles')}</small></label>
    <label>{t('ui.targetDeliveryWindow')}<input placeholder={t('ui.eGSpringCollectionOrUndecided')} value={form.targetWindow} maxLength="120" aria-invalid={!!fieldErrors.targetWindow} aria-describedby={fieldErrors.targetWindow ? 'error-targetWindow' : undefined} onChange={event => update('targetWindow', event.target.value)} />{error('targetWindow')}</label>
  </div></fieldset><label>{t('ui.tellUsAboutYourProject')}<textarea rows="6" placeholder={t('ui.targetCustomerIntendedUseDesignDirectionAndTiming')} value={form.message} maxLength="4000" aria-invalid={!!fieldErrors.message} aria-describedby={fieldErrors.message ? 'error-message' : undefined} onChange={event => update('message', event.target.value)} />{error('message')}</label>
  <label className="honeypot" aria-hidden="true">{t('ui.website')}<input tabIndex="-1" value={form.website} onChange={event => update('website', event.target.value)} /></label>
  <label className="consent"><input type="checkbox" checked={form.consent} aria-invalid={!!fieldErrors.consent} aria-describedby={fieldErrors.consent ? 'error-consent' : undefined} onChange={event => update('consent', event.target.checked)} /><span>{t('ui.iAgreeToBeContactedByStardotsAboutThis')} <a href={localHref('/privacy')}>{t('ui.privacyPolicy')}</a>{error('consent')}</span></label>
  <p className="delivery-note">{getLocale() === 'zh' ? '提交后将自动为您生成标准化询盘凭单，支持一键直达 WhatsApp 即时洽谈或唤起邮件草稿。' : 'Submitting will generate your official RFQ voucher, with one-click direct WhatsApp chat or email draft options.'}</p>
  <button className="btn btn-dark" type="submit" disabled={busy || delivery === 'checking'}>{busy ? t('ui.working') : (getLocale() === 'zh' ? '生成询盘凭单并联系团队' : 'Generate RFQ & Contact Team')} <ArrowRight size={16} /></button>
  <div className={`form-status ${status && status.kind !== 'error' ? status.kind : ''}`} role="status" aria-atomic="true">{status && status.kind !== 'error' ? status.text : ''}</div>
  <div className="form-status error" role="alert" aria-atomic="true">{status?.kind === 'error' ? status.text : ''}</div>
  {rfqVoucher && (
    <div className="rfq-voucher-card" role="region" aria-label="Official RFQ Voucher">
      <div className="voucher-header">
        <span className="voucher-tag">{getLocale() === 'zh' ? '已核准询盘凭单' : 'OFFICIAL RFQ VOUCHER'}</span>
        <span className="voucher-code">{rfqVoucher.refCode}</span>
      </div>
      <div className="voucher-summary">
        <div><span>{getLocale() === 'zh' ? '采购主体' : 'Buyer'}</span><strong>{rfqVoucher.name} ({rfqVoucher.company})</strong></div>
        <div><span>{getLocale() === 'zh' ? '目标品类' : 'Product'}</span><strong>{rfqVoucher.product} {rfqVoucher.model ? `· ${rfqVoucher.model}` : ''}</strong></div>
        <div><span>{getLocale() === 'zh' ? '预估批量' : 'Quantity'}</span><strong>{rfqVoucher.quantity}</strong></div>
        <div><span>{getLocale() === 'zh' ? '目的国家/地区' : 'Destination'}</span><strong>{rfqVoucher.country}</strong></div>
      </div>
      <div className="voucher-actions">
        <a className="btn btn-dark" href={rfqVoucher.whatsappUrl} target="_blank" rel="noreferrer">
          <Send size={16} /> {getLocale() === 'zh' ? 'WhatsApp 立即发送洽谈' : 'Chat via WhatsApp'}
        </a>
        <a className="btn btn-outline" href={rfqVoucher.mailUrl}>
          <Mail size={16} /> {getLocale() === 'zh' ? '唤起邮件客户端' : 'Open Email Draft'}
        </a>
        <button type="button" className="btn btn-light" onClick={() => {
          if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(`RFQ Ref: ${rfqVoucher.refCode}\nBuyer: ${rfqVoucher.name} (${rfqVoucher.company})\nEmail: ${rfqVoucher.email}\nProduct: ${rfqVoucher.product}\nQty: ${rfqVoucher.quantity}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          }
        }}>
          <Check size={16} /> {copied ? (getLocale() === 'zh' ? '已复制！' : 'Copied!') : (getLocale() === 'zh' ? '复制询盘摘要' : 'Copy Summary')}
        </button>
      </div>
    </div>
  )}
  <div className="form-fallback"><span>{t('ui.otherWaysToReachUs')}</span><a href={links.mail}><Mail size={17} /> {t('ui.emailStardots')}</a><a href={links.whatsapp} target="_blank" rel="noreferrer"><Send size={17} /> {t('ui.whatsapp')}</a></div>
  </form>;
}

function ContactPage() {
  const { COMPANY } = getSiteData(getLocale());
  return <main id="main"><section className="contact-hero"><div className="container"><span className="eyebrow">{t('ui.contactStardots')}</span><h1>{t('ui.letSBuildYourNextCollection')}</h1><p>{t('ui.tellUsAboutYourBagProjectAndWeWill')}</p></div></section><section className="section"><div className="container contact-grid"><div className="contact-details"><h2>{t('ui.weReReadyToTalk')}</h2><p>{t('ui.whetherYouHaveATechnicalPackOrAnEarly')}</p><div><Mail size={23} /><span><small>{t('ui.email')}</small><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></span></div><div><Phone size={23} /><span><small>{t('ui.phoneWhatsapp')}</small><a href={`tel:${COMPANY.phoneHref}`}>{COMPANY.phone}</a></span></div><div><MapPin size={23} /><span><small>{t('ui.address')}</small>{COMPANY.address}</span></div><a className="btn btn-outline" href={COMPANY.whatsapp} target="_blank" rel="noreferrer">{t('ui.chatOnWhatsapp')} <ArrowRight size={16} /></a><div className="contact-prep"><h3>{t('ui.toHelpUsRespondWell')}</h3><p>{t('ui.includeAProductReferenceTargetCustomerEstimatedQuantityDestination')}</p></div></div><div className="contact-form-wrap"><span className="eyebrow">{t('ui.projectDetails')}</span><h2>{t('ui.requestAQuote')}</h2><p>{t('ui.shareYourSourcingBriefBelowForTechnicalPacksOr')}</p><QuoteForm /></div></div></section><GuideCards soft label={t('ui.afterYourEnquiry')} title={t('ui.aClearNextConversation')} subtitle={t('ui.theNextStepsDependOnHowMuchOfThe')} items={[[t('ui.weReviewYourBrief'), t('ui.weLookAtTheProductDirectionQuantityDestinationAnd')], [t('ui.weClarifyTheOptions'), t('ui.materialsDevelopmentScopeSamplingQualityAndDeliveryNeedsCan')], [t('ui.weAgreeOnAPath'), t('ui.aMeaningfulQuotationFollowsConfirmedProjectAssumptionsRatherThan')]]} /><section className="section"><div className="container narrow"><SectionHeading title={t('ui.beforeYouGetStarted')} href={localHref('/faq')} link={t('ui.allFaqs')} /><FAQList limit={5} /></div></section></main>;
}

function LegalPage({ type }) {
  const { COMPANY } = getSiteData(getLocale());
  const privacy = type === 'privacy';
  return <main id="main"><section className="simple-hero"><div className="container"><span className="eyebrow">STARDOTS</span><h1>{privacy ? t('ui.privacyPolicy') : t('ui.termsOfService')}</h1><p>{t('ui.informationAboutThisWebsiteAndYourUseOfIt')}</p></div></section><section className="section"><div className="container legal-content">{privacy ? <>
    <p className="legal-lead">{t('legalPrivacyLead', { email: COMPANY.email })}</p>
    <h2>{t('ui.informationYouProvide')}</h2><p>{t('ui.anInquiryMayIncludeYourNameCompanyEmailCountry')}</p>
    <h2>{t('ui.howAnInquiryIsSent')}</h2><p>{getLocale() === 'zh' ? '本地预览仅生成邮件草稿；您在邮件应用中确认并发送。网站不会提交或存储表单数据。' : 'This local preview prepares an email draft. You review and send it in your email application. The website does not submit or store form data.'}</p>
    <h2>{t('ui.websiteServices')}</h2><p>{getLocale() === 'zh' ? '本预览中的图片和字体均从本地提供。' : 'Images and fonts in this preview are served locally.'}</p>
    <h2>{t('ui.questionsAndRequests')}</h2><p>{t('legalQuestions')} <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>
  </> : <>
    <p className="legal-lead">{t('ui.thisWebsitePresentsReferenceBagDesignsAndSourcingServices')}</p>
    <h2>{t('ui.referenceModels')}</h2><p>{t('referenceLegal')}</p>
    <h2>{t('ui.enquiriesAndQuotations')}</h2><p>{t('ui.sendingAnEnquiryDoesNotCreateAPurchaseContract')}</p>
    <h2>{t('ui.productionAndDelivery')}</h2><p>{t('ui.stardotsCoordinatesDevelopmentAndProductionWithSuitablePartnerFactories')}</p>
    <h2>{t('ui.contact')}</h2><p>{t('legalContact')} {COMPANY.legal}，{t('legalAt')} <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>
  </>}</div></section></main>;
}

function NotFound() {
   return <main id="main"><section className="simple-hero"><div className="container"><span className="eyebrow">404</span><h1>{t('ui.pageNotFound')}</h1><p>{t('ui.thePageYouRequestedIsNotHereExploreOur')}</p><a className="btn btn-dark" href={localHref('/')}>{t('ui.returnHome')} <ArrowRight size={16} /></a></div></section></main>; }

export default function App({previewPath}={}) {
  const catalogItems = useCatalog();
  const { categories, services, markets, articles } = getSiteData(getLocale());
  const path = previewPath??decodeURI(basePath());
  useEditorialMotion(path);
  const parts = path.split('/').filter(Boolean);
  let page;
  if (path === '/') page = <Home />;
  else if (path === '/about') page = <AboutPage />;
  else if (path === '/products') page = <CategoryIndex />;
  else if (parts[0] === 'products' && parts[1] === 'models' && parts.length === 3) { const item = catalogItems.find(model => model.slug === parts[2]); page = item ? <CatalogModelPage item={item} /> : <NotFound />; }
  else if (parts[0] === 'products' && parts.length === 2) { const aliases = { backpacks: 'backpack', 'tote-bags': 'tote', handbags: 'pouch', 'travel-duffel-bags': 'sports', 'laptop-bags': 'briefcase', 'cosmetic-bags': 'pouch', 'promotional-bags': 'tote' }; const category = categories.find(c => c.slug === (aliases[parts[1]] || parts[1])); page = category ? <CatalogCategoryPage category={category} /> : <NotFound />; }
  else if (path === '/services') page = <ServicesPage />;
  else if (parts[0] === 'services' && parts.length === 2) { const service = services.find(s => s.slug === parts[1]); page = service ? <ServiceDetail service={service} /> : <NotFound />; }
  else if (path === '/buyers') page = <BuyersPage />;
  else if (parts[0] === 'buyers' && parts[1] === 'markets' && parts.length === 3) { const market = markets.find(m => m.slug === parts[2]); page = market ? <MarketPage market={market} /> : <NotFound />; }
  else if (path === '/resources') page = <ResourcesPage />;
  else if (parts[0] === 'resources' && parts.length === 2) { const article = articles.find(a => a.slug === parts[1]); page = article ? <ArticlePage article={article} /> : <NotFound />; }
  else if (path === '/faq') page = <FAQPage />;
  else if (path === '/contact') page = <ContactPage />;
  else if (path === '/privacy' || path === '/terms') page = <LegalPage type={parts[0]} />;
  else page = <NotFound />;
  useEffect(() => {
    if(!previewPath)document.title = pageMetadata(window.location.pathname).title;
    if (window.location.hash) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  }, [path]);
  return <><meta name="stardots-content-release" content={contentVersion.releaseId} /><a className="skip-link" href="#main">{t('ui.skipToContent')}</a><Header />{page}<Footer /></>;
}
