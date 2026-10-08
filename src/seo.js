import { siteImage,categoryReference } from './content/site-images.js';
import { COMPANY, categories, services, serviceMedia, markets, articles } from './data.js';
import { getSiteData } from './data.js';
import { getLocale, basePath, localHref } from './locale.js';
import { catalogItems,baselineCatalogItems } from './catalog.js';

export const SITE_URL = 'https://stardotsbags.com';
export const englishRoutes = [
  '/', '/about', '/products', '/services', '/buyers', '/resources', '/faq', '/contact', '/privacy', '/terms',
  ...categories.map(({ slug }) => `/products/${slug}`),
  ...catalogItems.map(({ slug }) => `/products/models/${slug}`),
  ...services.map(({ slug }) => `/services/${slug}`),
  ...markets.map(({ slug }) => `/buyers/markets/${slug}`),
  ...articles.map(({ slug }) => `/resources/${slug}`),
];

export const publicRoutes = [...englishRoutes, ...englishRoutes.map(route => localHref(route, 'zh'))];

const staticPages = {
  '/': ['Custom & Wholesale Bags for Global Importers', 'Explore reference bag designs and project-specific sourcing, development and shipment coordination for overseas buyers.', siteImage('home-hero','/images/hero-bags.jpg')],
  '/about': ['About Our Bag Sourcing Team', 'Learn how STARDOTS coordinates bag sourcing, product development and partner-factory production for overseas buyers.'],
  '/products': ['Bag Reference Models', `Browse ${catalogItems.length} existing reference bag models by category, name or model code.`, siteImage('products-hero','/images/hero-bags.jpg')],
  '/services': ['Bag Sourcing Services', 'Explore material sourcing, product development, branding, quality planning and logistics coordination.', '/images/design-reference.jpg'],
  '/buyers': ['Bag Sourcing Guide for Buyers', 'Plan your bag brief, sampling approvals, quality checks and shipping requirements with STARDOTS.'],
  '/resources': ['Bag Buyer Resources', 'Practical guides for bag development, materials and international shipping.', '/images/materials-reference.jpg'],
  '/faq': ['Bag Sourcing FAQs', 'Answers to common questions about bag quotations, sampling, customization, inspection and delivery.'],
  '/contact': ['Request a Bag Quote', `Share your bag project brief with ${COMPANY.legal} or contact us by email and WhatsApp.`],
  '/privacy': ['Privacy Policy', 'How STARDOTS handles information supplied for bag sourcing inquiries.'],
  '/terms': ['Terms of Service', 'Information about reference bag models, enquiries, quotations and this website.'],
};

const chinesePages = {
  '/': ['为全球进口商提供定制与批量箱包采购', '浏览 STARDOTS 箱包参考款式，了解面向海外采购商的产品开发、合作工厂生产协调、质量规划及国际运输服务。', siteImage('home-hero','/images/hero-bags.jpg')],
  '/about': ['了解 STARDOTS 箱包采购团队', 'STARDOTS 位于中国福建晋江，为海外品牌、批发商与零售商协调箱包采购、产品开发及合作工厂生产。'],
  '/products': ['箱包参考款式', `按类别、名称或型号浏览 ${catalogItems.length} 款现有箱包参考设计，查看产品照片并讨论适合目标市场的开发方向。`, siteImage('products-hero','/images/hero-bags.jpg')],
  '/services': ['箱包采购与开发服务', '了解材料采购、OEM 与 ODM 开发、品牌与包装定制、质量检验规划及国际物流协调服务。', '/images/design-reference.jpg'],
  '/buyers': ['箱包采购指南', '准备产品需求、样品审批、质量检查及运输要求，让每个箱包项目的关键决策和责任分工更清晰。'],
  '/resources': ['箱包采购资源', '面向采购商的实用指南，涵盖定制箱包开发、材料选择、样品审阅和国际运输准备。', '/images/materials-reference.jpg'],
  '/faq': ['箱包采购常见问题', '了解箱包报价、起订量、打样、定制、质量检验及交付安排的常见问题，具体条件按项目确认。'],
  '/contact': ['提交箱包询价需求', '向 STARDOTS 提交产品类别、参考型号、预计数量、目的地及项目需求，或通过邮件与 WhatsApp 联系团队。'],
  '/privacy': ['隐私政策', '了解 STARDOTS 如何处理您为箱包采购询盘提供的联系资料、项目信息，以及表单邮件发送所使用的服务。'],
  '/terms': ['服务条款', '了解 STARDOTS 网站参考款式、采购询盘、报价与项目确认的使用说明；具体商务安排以双方书面约定为准。'],
};

export function pageMetadata(input) {
  const locale = getLocale(input), route = basePath(input), zh = locale === 'zh';
  const { categories, services, serviceMedia, markets, articles } = getSiteData(locale);
  const model = catalogItems.find((item) => route === `/products/models/${item.slug}`);
  const category = categories.find((item) => route === `/products/${item.slug}`);
  const service = services.find((item) => route === `/services/${item.slug}`);
  const market = markets.find((item) => route === `/buyers/markets/${item.slug}`);
  const article = articles.find((item) => route === `/resources/${item.slug}`);
  let [name, description, image] = (zh ? chinesePages : staticPages)[route] || [];
  if (model) [name, description, image] = [`${model.name[zh ? 1 : 0]} · ${model.sku}`, zh ? `${model.description[1]} 查看产品照片，并讨论该参考款式的定制需求。` : `${model.description[0]} View photographs and discuss customization for this reference model.`, model.images[0]];
  if (category) [name, description, image] = [zh ? `${category.name}参考款式` : `${category.name} Reference Models`, category.intro, categoryReference(category,catalogItems,baselineCatalogItems)?.images[0]??category.image];
  if (service) [name, description, image] = [service.name, service.detail, serviceMedia[service.slug]?.src];
  if (market) [name, description, image] = [zh ? `${market.name}箱包采购指南` : `${market.name} Bag Sourcing Guide`, zh ? `为${market.name}买家规划箱包系列，询价前明确产品、质量、包装与运输要求，并根据具体目的地讨论项目安排。` : `Plan a bag collection for buyers in ${market.name}. Review product, quality and shipping questions before requesting a quote.`, undefined];
  if (article) [name, description, image] = [article.title, article.excerpt, article.image];
  return { title: `${name || (zh ? 'STARDOTS 箱包' : 'STARDOTS Bags')} | STARDOTS`, description: description || (zh ? '了解 STARDOTS 箱包采购与开发服务。' : 'Explore bag sourcing with STARDOTS.'), image: image?.startsWith('http') ? image : image ? `${SITE_URL}${image}` : undefined };
}

export function structuredData(input) {
  const locale = getLocale(input), route = basePath(input), zh = locale === 'zh';
  const { categories, services, markets, articles } = getSiteData(locale);
  const url = path => SITE_URL + localHref(path, locale);
  const nodes = [{ '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: COMPANY.legal, url: SITE_URL, email: COMPANY.email, telephone: COMPANY.phone, address: { '@type': 'PostalAddress', addressLocality: 'Jinjiang', addressRegion: 'Fujian', addressCountry: 'CN' } }];
  const names = zh ? { '/': '首页', '/products': '产品系列', '/services': '服务', '/buyers': '采购指南', '/resources': '采购资源' } : { '/': 'Home', '/products': 'Products', '/services': 'Services', '/buyers': 'For Buyers', '/resources': 'Resources' };
  const segments = route.split('/').filter(Boolean);
  if (segments.length) {
    const crumbs = [{ '@type': 'ListItem', position: 1, name: zh ? '首页' : 'Home', item: url('/') }];
    let path = '';
    for (const segment of segments) {
      path += `/${segment}`;
      if (segment === 'models' || segment === 'markets') continue;
      const model = catalogItems.find((entry) => path === `/products/models/${entry.slug}`);
      const category = categories.find((entry) => path === `/products/${entry.slug}`);
      const service = services.find((entry) => path === `/services/${entry.slug}`);
      const market = markets.find((entry) => path === `/buyers/markets/${entry.slug}`);
      const article = articles.find((entry) => path === `/resources/${entry.slug}`);
      crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: names[path] || model?.name[zh ? 1 : 0] || category?.name || service?.name || market?.name || article?.title || pageMetadata(localHref(path, locale)).title.split(' | ')[0], item: url(path) });
    }
    nodes.push({ '@type': 'BreadcrumbList', itemListElement: crumbs });
  }
  const article = articles.find((entry) => route === `/resources/${entry.slug}`);
  if (article) nodes.push({ '@type': 'Article', headline: article.title, description: article.excerpt, image: SITE_URL + article.image, author: { '@id': `${SITE_URL}/#organization` }, publisher: { '@id': `${SITE_URL}/#organization` }, inLanguage: zh ? 'zh-CN' : 'en', mainEntityOfPage: url(route) });
  return { '@context': 'https://schema.org', '@graph': nodes };
}
