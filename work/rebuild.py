from pathlib import Path
p=Path('src/App.jsx');s=p.read_text();s=s.replace("import { pageMetadata } from './seo.js';", "import { pageMetadata } from './seo.js';\nimport { useEditorialMotion } from './editorial-motion.js';")
a=s.index('function Home() {'); b=s.index('\nfunction PageHero',a)
s=s[:a]+'''function Home() {
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
      <figure className="carry-visual"><img src="/images/hero-bags.jpg" alt={copy('Illustrative arrangement of bags on stone plinths', '石台上的箱包系列示意图')} fetchPriority="high" /><figcaption><span>01 / {copy('THE CARRY EDIT', '携行选集')}</span><span>{copy('Collection illustration', '系列示意图')}</span></figcaption></figure>
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
''' +s[b:]
a=s.index('function BannerCTA() {');b=s.index('\nfunction SectionHeading',a)
s=s[:a]+'''function BannerCTA() {
  const zh = getLocale() === 'zh';
  return <section className="banner-cta"><div className="container"><span className="chapter-label">STARDOTS / {zh ? '下一程，由您定义' : 'THE NEXT CHAPTER IS YOURS'}</span><h2>{zh ? '想好下一款了吗？' : 'What will you carry next?'}</h2><div className="banner-actions"><a className="btn btn-dark" href={quoteHref(useCatalog())}>{zh ? '聊聊您的项目' : 'Start a conversation'} <ArrowRight size={20}/></a><p>{zh ? '从一个想法、一张草图或一个参考款式开始。' : 'Begin with an idea, a sketch, or a reference model.'}</p></div></div></section>;
}
''' +s[b:]
s=s.replace("const [delivery, setDelivery] = useState('checking');", "const delivery = 'draft';")
s=s.replace("  useEffect(() => { fetch('/api/inquiry').then(response => response.json()).then(result => setDelivery(result.local ? 'local' : result.available ? 'email' : 'draft')).catch(() => setDelivery('draft')); }, []);",'')
a=s.index('    try {\n      const response = await fetch(\'/api/inquiry\'');b=s.index('\n    setBusy(false);',a)
s=s[:a]+s[b:]
s=s.replace("{t('ui.onlineSendingIsTemporarilyUnavailableCompleteYourBriefTo')}","{getLocale() === 'zh' ? '本地预览：填写后会在您的邮件应用中生成草稿，请您自行发送。此网站不会提交或保存询盘。' : 'Local preview: this form prepares a draft in your email app. You review and send it yourself. This website does not submit or store inquiries.'}")
s=s.replace("  const path = previewPath??decodeURI(basePath());", "  const path = previewPath??decodeURI(basePath());\n  useEditorialMotion(path);")
s=s.replace("<small>{t('ui.bagsForABrighterTomorrow')}</small>","<small>BAGS / {getLocale() === 'zh' ? '携行新可能' : 'CARRY POSSIBILITY'}</small>")
s=s.replace("<span>{t('ui.yourGlobalBagSourcingPartnerFromChina')}</span>","<span>{getLocale() === 'zh' ? '箱包参考系列与定制开发' : 'REFERENCE COLLECTIONS & CUSTOM DEVELOPMENT'}</span>")
s=s.replace("{t('legalFormSubmit')}","{getLocale() === 'zh' ? '本地预览仅生成邮件草稿；您在邮件应用中确认并发送。网站不会提交或存储表单数据。' : 'This local preview prepares an email draft. You review and send it in your email application. The website does not submit or store form data.'}")
s=s.replace("{t('ui.productPhotosAreServedFromAPublicImageHost')}","{getLocale() === 'zh' ? '本预览中的图片和字体均从本地提供。' : 'Images and fonts in this preview are served locally.'}")
p.write_text(s)
p=Path('src/main.jsx');p.write_text(p.read_text()+"\nimport './editorial.css';\n")
p=Path('src/styles.css');s=p.read_text();s=s[s.index('\n')+1:] if s.startswith('@import') else s;p.write_text(s)
