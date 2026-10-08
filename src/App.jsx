import { ContentImage } from './content/ContentImage.jsx';
import { baselineCatalogItems } from './catalog.js';
import { categoryReference } from './content/site-images.js';
import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, BadgeCheck, Box, Check, CircleHelp, ClipboardCheck,
  ClipboardList, Clock3, FileText, Gem, Globe2, Handshake, Headphones,
  Layers3, Mail, MapPin, Menu, Package, PenLine, Phone, Search, Send,
  Settings2, ShieldCheck, ShoppingBag, Truck, UsersRound, X,
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
      <span>{getLocale() === 'zh' ? '箱包参考系列与定制开发' : 'REFERENCE COLLECTIONS & CUSTOM DEVELOPMENT'}</span>
      <div className="utility-right">
        <span><MapPin size={13} /> {t('ui.jinjiangChina')}</span>
        <a href={`mailto:${COMPANY.email}`}><Mail size={13} /> {COMPANY.email}</a>
        <a href={`tel:${COMPANY.phoneHref}`}><Phone size={13} /> {COMPANY.phone}</a>
        <span className="language-switch"><Globe2 size={13} /> <a href={languageHref('en')} lang="en" aria-current={locale === 'en' ? 'true' : undefined} onClick={event => switchLanguage(event, 'en')}>English</a><span aria-hidden="true">/</span><a href={languageHref('zh')} lang="zh-CN" aria-current={locale === 'zh' ? 'true' : undefined} onClick={event => switchLanguage(event, 'zh')}>中文</a></span>
      </div>
    </div></div>
    <header className="site-header"><div className="container header-inner">
      <a href={localHref('/')} className="wordmark" aria-label={t('ui.stardotsHome')}><strong>STARDOTS</strong><small>BAGS / {getLocale() === 'zh' ? '携行新可能' : 'CARRY POSSIBILITY'}</small></a>
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
  return <section className="banner-cta"><div className="container"><span className="chapter-label">STARDOTS / {zh ? '下一程，由您定义' : 'THE NEXT CHAPTER IS YOURS'}</span><h2>{zh ? '想好下一款了吗？' : 'What will you carry next?'}</h2><div className="banner-actions"><a className="btn btn-dark" href={quoteHref(useCatalog())}>{zh ? '聊聊您的项目' : 'Start a conversation'} <ArrowRight size={20}/></a><p>{zh ? '从一个想法、一张草图或一个参考款式开始。' : 'Begin with an idea, a sketch, or a reference model.'}</p></div></div></section>;
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

function Home() {
  const items = useCatalog();
  const { categories, articles } = getSiteData(getLocale());
  const zh = getLocale() === 'zh';
  const copy = (en, cn) => zh ? cn : en;
  const selected = ['MH-2506023', 'JSD-250407', 'WA-2506014'].map(sku => items.find(item => item.sku === sku)).filter(Boolean);
  return <main id="main" className="home-page editorial-home">
    <section className="carry-hero">
      <div className="carry-intro"><div className="carry-kicker"><span>STARDOTS / {copy('BAG SOURCING', '箱包采购')}</span><span>{copy('CHINA → YOUR NEXT CHAPTER', '中国 → 您的下一程')}</span></div>
        <h1>{copy('Carry what', '装载所想')}<br /><span>{copy('comes next.', '奔赴下一程。')}</span></h1>
        <div className="carry-bottom"><p>{copy('A new collection begins with a point of view. Explore reference designs. Shape a bag around your buyer.', '每一组新产品，都从一个清晰的想法开始。探索参考款式，为您的客户构思下一款箱包。')}</p><a className="carry-circle" href={localHref('/products')} aria-label={copy('Explore the bag collection', '探索箱包系列')}><ArrowRight size={32} /></a></div>
        <a className="carry-text-link" href={localHref('/products')}>{copy('EXPLORE THE COLLECTION', '探索参考系列')} <span>↗</span></a>
      </div>
      <figure className="carry-visual"><img src="/images/hero-bags.jpg" alt={copy('Illustrative arrangement of bags on stone plinths', '石台上的箱包系列示意图')} fetchpriority="high" /><figcaption><span>01 / {copy('THE CARRY EDIT', '携行选集')}</span><span>{copy('Collection illustration', '系列示意图')}</span></figcaption></figure>
    </section>
    <div className="editorial-band"><span>{copy('OBJECTS FOR EVERYDAY POSSIBILITY', '为日常的更多可能')}</span><span>{copy('REFERENCE COLLECTION · CUSTOM DEVELOPMENT', '参考系列 · 定制开发')}</span><span>STARDOTS BAGS</span></div>
    <section className="section edit-selection"><div className="container">
      <div className="chapter-heading"><span className="chapter-label">01 / {copy('SELECTED REFERENCES', '精选参考')}</span><h2>{copy('A different way', '用另一种方式')}<br /><em>{copy('to carry.', '随身携行。')}</em></h2><p>{copy('Start with a shape, a detail, a daily ritual. The reference is the beginning of the conversation.', '从包型、细节，或一种日常习惯出发。参考款式，是沟通的起点。')}</p></div>
      <div className="edit-products">{selected.map((item, i) => <a className={`edit-product edit-product-${i}`} href={localHref(`/products/models/${item.slug}`)} key={item.sku}><div className="edit-object"><span className="object-number">0{i+1}</span><img src={item.images[0]} alt={item.name[zh ? 1 : 0]} loading="lazy" /><span className="object-arrow" aria-hidden="true">↗</span></div><div className="edit-caption"><h3>{item.name[zh ? 1 : 0]}</h3><span>{item.sku}</span></div></a>)}</div>
      <div className="edit-footnote"><p>{copy('Actual reference photographs. Specifications, materials and availability are confirmed for each project.', '真实参考款式图片。规格、材料与可供情况，按具体项目确认。')}</p><a className="text-link" href={localHref('/products')}>{copy(`View all ${items.length} reference models`, `查看全部 ${items.length} 款参考款式`)} <ArrowRight size={18} /></a></div>
    </div></section>
    <section className="family-chapter"><div className="container family-layout"><div className="family-intro"><span className="chapter-label">02 / {copy('FIND YOUR FORM', '找到您的包型')}</span><h2>{copy('One collection.', '一个系列。')}<br /><em>{copy('Many lives.', '多种生活。')}</em></h2><p>{copy('For the commute, the long weekend, and everything carried in between.', '从每日通勤到周末远行，探索不同使用场景中的携行方式。')}</p><a className="text-link" href={localHref('/products')}>{copy('The complete collection', '探索完整系列')} <ArrowRight size={18}/></a></div><div className="family-index">{categories.map((c,i)=><a href={localHref(`/products/${c.slug}`)} key={c.slug}><span className="family-number">{String(i+1).padStart(2,'0')}</span><h3>{c.name}</h3><span className="family-count">{items.filter(item=>item.category===c.slug).length} {copy('models','款')}</span><ArrowRight size={23}/></a>)}</div></div></section>
    <section className="development-chapter"><div className="development-photo"><img src="/images/design-reference.jpg" alt={copy('Illustrative bag sketches and development references', '箱包草图和开发参考示意图')} loading="lazy"/><span>{copy('DEVELOPMENT NOTEBOOK / ILLUSTRATION', '开发笔记 / 示意图')}</span></div><div className="development-story"><span className="chapter-label">03 / {copy('MADE AROUND YOUR BRIEF', '围绕您的需求')}</span><h2>{copy('Your idea.', '您的想法。')}<br /><em>{copy('The next move.', '下一步行动。')}</em></h2><p>{copy('A sketch. A reference. A detail you cannot stop thinking about. Bring us a starting point, and we can discuss the path from brief to sample.', '一张草图、一个参考，或一个反复琢磨的细节。带着您的想法，从需求到样品，共同讨论接下来的路径。')}</p><div className="notebook-steps">{[[copy('Define the brief','定义需求'),copy('Buyer, use, quantity and destination.','客户、用途、数量与目的地。')],[copy('Review the sample','审核样品'),copy('Agree on form, details and written requirements.','确认包型、细节与书面要求。')],[copy('Plan the order','规划订单'),copy('Confirm terms, checks and delivery responsibilities.','确认条款、检查与交付责任。')]].map(([title,desc],i)=><div key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{desc}</p></div></div>)}</div><a className="btn btn-dark" href={localHref('/services')}>{copy('Explore the development process','了解开发流程')} <ArrowRight size={18}/></a></div></section>
    <section className="section journal-chapter"><div className="container"><div className="chapter-heading"><span className="chapter-label">04 / {copy('THE BUYER’S NOTEBOOK','买家笔记')}</span><h2>{copy('Good questions.', '好问题。')}<br/><em>{copy('Better beginnings.', '好开始。')}</em></h2><a className="text-link" href={localHref('/resources')}>{copy('Read the journal','阅读采购指南')} <ArrowRight size={18}/></a></div><div className="resource-grid">{articles.map(article=><ArticleCard article={article} key={article.slug}/>)}</div></div></section>
    <BannerCTA />
  </main>;
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
