import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Mail, Search, X } from 'lucide-react';
import {categoryReference} from './content/site-images.js';
import {baselineCatalogItems} from './catalog.js';
import { useCatalog } from './content/snapshot-context.jsx';
import { getSiteData } from './data.js';
import { getLocale, localHref, t } from './locale.js';

const categoryName = (id) => getSiteData(getLocale()).categories.find((category) => category.slug === id)?.name || t('referenceBags');
const modelCount = (count) => t(count === 1 ? 'modelCountOne' : 'modelCount', { count });

function ProductPhoto({ item, src, loading = 'lazy', card = false }) {

  const [failed, setFailed] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const ref=item.imageRefs?.find(a=>a.sourceUrl===src),alt=ref?.alt[getLocale()]||`${item.name[getLocale() === 'zh' ? 1 : 0]} (${item.sku})`,style=ref?{objectPosition:`${ref.focal.x*100}% ${ref.focal.y*100}%`}:undefined;
  const useThumb = card && item.cardUrl && !thumbFailed && src === item.images[0];
  return failed ? <div className="photo-unavailable" role="img" aria-label={t('photoUnavailableFor', { sku: item.sku })}><span>{t('ui.photoUnavailable')}</span><strong>{item.sku}</strong></div>
    : useThumb ? <picture><source type={item.cardUrl?.endsWith('.avif') ? 'image/avif' : 'image/webp'} srcSet={item.cardUrl} /><img src={src} alt={alt} style={style} data-provenance={ref?.provenance} loading={loading} decoding="async" onError={() => setThumbFailed(true)} /></picture>
      : <img src={src} alt={alt} style={style} data-provenance={ref?.provenance} loading={loading} decoding="async" onError={() => setFailed(true)} />;
}

export function ProductCard({ item }) {

  return <a className={`model-card category-${item.category}`} href={localHref(`/products/models/${item.slug}`)}>
    <div className="model-card-photo"><ProductPhoto item={item} src={item.images[0]} card /></div>
    <div className="model-card-copy"><span>{categoryName(item.category)}</span><h3>{item.name[getLocale() === 'zh' ? 1 : 0]}</h3><p>{item.sku}</p><ArrowRight size={18} aria-hidden="true" /></div>
  </a>;
}

export function CatalogGrid({ category, title = t('ui.exploreReferenceModels'), limit }) {
  const catalogItems = useCatalog();
  const { categories } = getSiteData(getLocale());
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(category || 'all');
  const baseItems = catalogItems.filter((item) => !category || item.category === category);
  useEffect(() => {
    if (category) return;
    const params = new URLSearchParams(window.location.search);
    const selected = params.get('category');
    if (selected && categories.some((entry) => entry.slug === selected)) setActive(selected);
    setQuery(params.get('q') || '');
  }, [category]);
  function changeFilters(nextCategory, nextQuery) {
    setActive(nextCategory);
    setQuery(nextQuery);
    if (!category) {
      const url = new URL(window.location.href);
      if (nextCategory === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', nextCategory);
      if (nextQuery.trim()) url.searchParams.set('q', nextQuery.trim()); else url.searchParams.delete('q');
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      window.dispatchEvent(new Event('stardots:locationchange'));
    }
  }
  const items = catalogItems.filter((item) => (active === 'all' || item.category === active) &&
    `${item.sku} ${item.name.join(' ')} ${item.description.join(' ')} ${(item.relatedSkus || []).join(' ')}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const visible = limit ? items.slice(0, limit) : items;
  return <section className="section catalog-section" id="models"><div className="container">
    <div className="section-heading"><div><span className="eyebrow">{t('ui.fromTheStardotsCollection')}</span><h2>{title}</h2><p>{t('ui.browseExistingReferenceDesignsFinalSpecificationsAndAvailabilityAre')}</p></div><span className="catalog-count" aria-live="polite">{modelCount(items.length)}</span></div>
    {!category && <div className="catalog-toolbar"><div className="catalog-filters" aria-label={t('ui.filterProducts')}>
      <button type="button" aria-pressed={active === 'all'} className={active === 'all' ? 'selected' : ''} onClick={() => changeFilters('all', query)}>{t('ui.allModels')}</button>
      {categories.map((item) => <button key={item.slug} type="button" aria-pressed={active === item.slug} className={active === item.slug ? 'selected' : ''} onClick={() => changeFilters(item.slug, query)}>{item.name}</button>)}
    </div><label className="catalog-search"><span className="sr-only">{t('ui.searchModelsByNameOrCode')}</span><input type="search" placeholder={t('ui.searchNameOrModelCode')} value={query} onChange={(event) => changeFilters(active, event.target.value)} /></label></div>}
    {category && baseItems.length > 1 && <label className="catalog-search category-search"><span className="sr-only">{t('ui.searchThisCategory')}</span><input type="search" placeholder={t('ui.searchThisCollection')} value={query} onChange={(event) => setQuery(event.target.value)} /></label>}
    {visible.length ? <div className={`model-grid${baseItems.length === 1 ? ' model-grid-single' : ''}`}>{visible.map((item) => <ProductCard item={item} key={item.sku} />)}</div> : <div className="catalog-empty" role="status"><p>{t('ui.noModelsMatchThisSearch')}</p><button type="button" onClick={() => changeFilters(category || 'all', '')}>{t('ui.clearSearchAndFilters')}</button></div>}
    {limit && items.length > limit && <a className="btn btn-outline catalog-more" href={localHref('/products')}>{t('ui.seeAllReferenceModels')} <ArrowRight size={16} /></a>}
  </div></section>;
}

export function CatalogCategoryPage({ category }) {

  const current=useCatalog(),reference=categoryReference(category,current,baselineCatalogItems);
  const source = encodeURIComponent(localHref(`/products/${category.slug}`));
  return <main id="main"><section className="catalog-hero"><div className="container catalog-hero-grid"><div>
    <a className="back-link" href={localHref('/products')}>{t('backAllProducts')}</a><span className="eyebrow">{t('ui.productCategory')}</span><h1>{category.name}</h1><p>{category.intro}</p><div className="page-hero-actions"><a className="btn btn-dark" href={localHref(`/contact?product=${category.slug}&source=${source}#quote`)}>{t('ui.requestAQuote')} <ArrowRight size={16} /></a><a className="text-link" href="#models">{t('ui.viewModels')} <ArrowRight size={16} /></a></div>
  </div>{reference?<ProductPhoto item={reference} src={reference.images[0]} loading="eager"/>:<img src={category.image} alt={t('categoryReferenceAlt', { name: category.name })} loading="eager" decoding="async"/>}</div></section>
  <CatalogGrid category={category.slug} title={t('categoryModels', { name: category.name })} />
  <section className="section soft-section"><div className="container catalog-guidance"><div><span className="eyebrow">{t('ui.developTheRightProduct')}</span><h2>{t('ui.decisionsToMakeForYourBuyer')}</h2><p>{t('ui.thesePhotographsAreStartingPointsWeReviewYourUse')}</p></div><div><h3>{t('ui.typicalApplications')}</h3><ul>{category.uses.map((value) => <li key={value}><Check size={18} />{value}</li>)}</ul></div><div><h3>{t('ui.detailsToDiscuss')}</h3><ul>{category.options.map((value) => <li key={value}><Check size={18} />{value}</li>)}</ul></div></div></section>
  <section className="section"><div className="container catalog-next"><h2>{t('ui.haveAReferenceInMind')}</h2><p>{t('ui.sendUsTheModelCodeIntendedMarketTargetQuantity')}</p><a className="btn btn-dark" href={localHref(`/contact?product=${category.slug}&source=${source}#quote`)}>{t('ui.requestAQuote')} <ArrowRight size={16} /></a></div></section></main>;
}

export function CatalogModelPage({ item }) {
  const catalogItems = useCatalog();
  const { categories, COMPANY } = getSiteData(getLocale());
  const [view, setView] = useState(0);
  const dialogRef = useRef(null);
  const openButtonRef = useRef(null);
  const related = catalogItems.filter((candidate) => candidate.category === item.category && candidate.sku !== item.sku).slice(0, 4);
  const query = new URLSearchParams({ product: item.category, model: item.sku, source: localHref(`/products/models/${item.slug}`) });
  const next = (direction) => setView((current) => (current + direction + item.images.length) % item.images.length);
  const category = categories.find((entry) => entry.slug === item.category);
  function galleryKeys(event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); next(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next(1); }
  }
  return <main id="main"><section className="section model-detail-section"><div className="container">
    <div className="model-breadcrumb"><a href={localHref('/products')}>{t('ui.products')}</a><span>/</span><a href={localHref(`/products/${item.category}`)}>{categoryName(item.category)}</a><span>/</span><span>{item.sku}</span></div>
    <div className="model-detail-grid"><div className="model-gallery" onKeyDown={galleryKeys}><div className="model-main-photo"><ProductPhoto key={item.images[view]} item={item} src={item.images[view]} loading="eager" />{item.images.length > 1 && <><button className="gallery-previous" type="button" aria-label={t('ui.previousPhoto')} onClick={() => next(-1)}><ChevronLeft /></button><button className="gallery-next" type="button" aria-label={t('ui.nextPhoto')} onClick={() => next(1)}><ChevronRight /></button></>}<button ref={openButtonRef} className="model-zoom-open" type="button" aria-label={t('enlargePhoto', { index: view + 1, count: item.images.length })} onClick={() => dialogRef.current?.showModal()}><Search size={20} /></button></div>{item.images.length > 1 && <div className="model-thumbs">{item.images.map((src, index) => <button className={view === index ? 'active' : ''} type="button" key={src} onClick={() => setView(index)} aria-label={t('showView', { index: index + 1, count: item.images.length })} aria-pressed={view === index}><img src={src} alt="" loading="lazy" /></button>)}</div>}</div>
    <div className="model-information"><span className="eyebrow">{categoryName(item.category)} · {item.sku}</span><h1>{item.name[getLocale() === 'zh' ? 1 : 0]}</h1><p className="model-lead">{item.description[getLocale() === 'zh' ? 1 : 0]}</p>{item.debranded && <p className="model-note">{t('ui.presentationPhotographEditedToRemoveSourceBranding')}</p>}
      {(item.imageRefs||[]).some(a=>/\bAI\b|概念|示意|concept|illustrat/i.test(a.provenance))&&<p className="model-note">{getLocale() === 'zh' ? '概念或示意参考图。产品细节与可行性需按项目确认。' : 'Concept or illustrative reference. Product details and feasibility require project review.'}</p>}
      <h2 className="model-facts-title">{t('ui.aboutThisReference')}</h2><div className="model-spec"><div><span>{t('ui.referenceCode')}</span><strong>{item.sku}</strong></div>{item.relatedSkus?.length > 0 && <div><span>{t('ui.relatedSourceCodes')}</span><strong>{item.relatedSkus.join(', ')}</strong></div>}<div><span>{t('ui.productFamily')}</span><strong>{categoryName(item.category)}</strong></div><div><span>{t('ui.visibleDetails')}</span><strong>{item.description[getLocale() === 'zh' ? 1 : 0]}</strong></div>{Object.entries(item.specs??{}).filter(([,value])=>String(value[getLocale()]??'').trim()).map(([key,value])=><div key={key}><span>{getLocale()==='zh'?({capacity:'容量',material:'材质',size:'尺寸',color:'颜色',moq:'起订量',lead_time:'交期',packaging:'包装'}[key]??key):key.replaceAll('_',' ')}</span><strong>{value[getLocale()]}</strong></div>)}</div>
      <div className="model-discuss"><h2>{t('ui.optionsToDiscuss')}</h2><ul>{category?.options.map((option) => <li key={option}><Check size={17} />{option}</li>)}</ul></div>
      <p className="model-boundary">{t('ui.dimensionsMaterialsBrandingMoqPriceAndTimingRequireA')}</p>
      <a className="btn btn-dark" href={localHref(`/contact?${query.toString()}#quote`)}>{t('ui.requestAQuote')} <ArrowRight size={16} /></a><a className="model-email" href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(t('emailReferenceSubject', { sku: item.sku }))}`}><Mail size={17} /> {t('ui.emailThisReference')}</a>
    </div></div></div></section>
    <dialog ref={dialogRef} className="model-lightbox" aria-label={t('enlargedPhoto', { name: item.name[getLocale() === 'zh' ? 1 : 0] })} onClose={() => openButtonRef.current?.focus()} onKeyDown={galleryKeys}><button type="button" className="lightbox-close" aria-label={t('ui.closePhotoPreview')} onClick={() => dialogRef.current?.close()}><X size={24} /></button><ProductPhoto key={item.images[view]} item={item} src={item.images[view]} loading="eager" /><p>{item.name[getLocale() === 'zh' ? 1 : 0]} · {item.sku} · {t('viewOf', { index: view + 1, count: item.images.length })}</p>{item.images.length > 1 && <div className="lightbox-controls"><button type="button" onClick={() => next(-1)}>{t('ui.previous')}</button><button type="button" onClick={() => next(1)}>{t('ui.next')}</button></div>}</dialog>
    <section className="section soft-section"><div className="container catalog-guidance"><div><span className="eyebrow">{t('ui.fromReferenceToBrief')}</span><h2>{t('ui.makeThisModelWorkForYourMarket')}</h2><p>{t('ui.useTheVisibleDesignAsAStartingPointAnd')}</p></div><div><h3>{t('ui.shareWithUs')}</h3><ul><li><Check size={18} />{t('ui.yourIntendedCustomerAndUse')}</li><li><Check size={18} />{t('ui.anyRequestedChangesOrArtwork')}</li><li><Check size={18} />{t('ui.targetQuantityAndDestination')}</li></ul></div><div><h3>{t('ui.confirmTogether')}</h3><ul><li><Check size={18} />{t('ui.sampleAndConstructionDetails')}</li><li><Check size={18} />{t('ui.qualityAndPackingRequirements')}</li><li><Check size={18} />{t('ui.quotationAndDeliveryTerms')}</li></ul></div></div></section>
    {related.length > 0 && <section className="section"><div className="container"><div className="section-heading"><div><h2>{t('moreInCategory', { name: categoryName(item.category) })}</h2><p>{t('ui.exploreOtherReferenceDesignsInThisCollection')}</p></div><a className="link-arrow" href={localHref(`/products/${item.category}`)}>{t('ui.viewCategory')} <ArrowRight size={16} /></a></div><div className="model-grid">{related.map((candidate) => <ProductCard key={candidate.sku} item={candidate} />)}</div></div></section>}
  </main>;
}
