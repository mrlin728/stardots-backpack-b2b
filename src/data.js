import { getLocale } from './locale.js';
import { zhContent } from './data-zh.js';
export const COMPANY = {
  legal: 'JINJIANG STARDOTS CO., LTD.',
  email: 'contact@cnstardots.com',
  phone: '+86 136 5597 7639',
  phoneHref: '+8613655977639',
  whatsapp: 'https://wa.me/8613655977639',
  location: 'Jinjiang, Fujian, China',
  address: 'Room 401, Unit 1, Building 5, Baihong Shuanglong Shoufu, No. 1333 Shuanglong East Road, Jinjiang, Fujian, China',
};

export const categories = [
  { slug: 'backpack', name: 'Backpacks', sub: 'Everyday & active carry', image: '/images/catalog/MH-2506013-01.webp', intro: 'Browse actual backpack reference models, then shape compartments, comfort and branding to your brief.', uses: ['Everyday carry', 'School and campus', 'Travel collections'], options: ['Pocket layout', 'Straps and handles', 'Color and branding'] },
  { slug: 'tote', name: 'Tote Bags', sub: 'Simple, versatile shapes', image: '/images/catalog/MH-250609-01.webp', intro: 'Explore tote references and discuss the carrying, closure and presentation details your buyers need.', uses: ['Retail collections', 'Lifestyle programs', 'Everyday carry'], options: ['Body shape', 'Handles and closure', 'Logo treatment'] },
  { slug: 'pouch', name: 'Small Bags & Pouches', sub: 'Compact accessories', image: '/images/catalog/MH-250601-01.webp', intro: 'Compact crossbody and zip-pouch references for accessory collections.', uses: ['Accessories retail', 'Travel organization', 'Gifting programs'], options: ['Size and opening', 'Carry strap', 'Interior and branding'] },
  { slug: 'sports', name: 'Sports & Cycling Bags', sub: 'Utility & movement', image: '/images/catalog/JSD-250420-01.webp', intro: 'Reference bags with waist, crossbody, barrel and cycling-inspired forms.', uses: ['Active collections', 'Cycling accessories', 'Outdoor programs'], options: ['Attachment method', 'Pocket access', 'Carrying comfort'] },
  { slug: 'briefcase', name: 'Document Bags', sub: 'Workday organization', image: '/images/catalog/JSD-250421-01.webp', intro: 'A reference for professional carry; device fit and protection require project-specific confirmation.', uses: ['Office commuting', 'Business programs', 'Documents and devices'], options: ['Carry format', 'Organization', 'Device fit and branding'] },
  { slug: 'smallgoods', name: 'Wallets & Small Goods', sub: 'Wallets, wristlets & more', image: '/images/catalog/WA-2506012-01.webp', intro: 'Explore compact wallets and wristlets from the existing product collection.', uses: ['Accessories retail', 'Coordinated collections', 'Gifting'], options: ['Card layout', 'Closure and strap', 'Color and branding'] },
  { slug: 'pet', name: 'Pet Carry Accessories', sub: 'A focused reference style', image: '/images/catalog/JSD-250409-01.webp', intro: 'Explore the current pet carry reference; fit and safety requirements must be confirmed for each project.', uses: ['Pet accessories', 'Walking products', 'Specialty retail'], options: ['Fit and adjustment', 'Attachment details', 'Safety and material requirements'] },
];

export const services = [
  { slug: 'sourcing', name: 'Material Sourcing', short: 'Review material and trim options for your brief.', detail: 'Explore suitable materials, colors and trims for your target price, use case and market. Options are reviewed against your approved brief before sampling.' },
  { slug: 'oem-odm', name: 'OEM & ODM Development', short: 'From concept to market-ready products.', detail: 'Bring us a sketch, a reference, or a technical pack. We coordinate design review, material decisions and sampling with suitable production partners.' },
  { slug: 'branding-packaging', name: 'Custom Branding & Packaging', short: 'Logos, labels, hangtags and packaging solutions.', detail: 'Make every touchpoint feel like your brand. Decoration methods and packaging formats are evaluated for your product and approved sample.' },
  { slug: 'quality-control', name: 'Quality Control & Inspection', short: 'Agree inspection points, scope and reporting.', detail: 'Quality expectations are agreed through specifications and approved samples. Checks are arranged at relevant production stages for each order.' },
  { slug: 'logistics', name: 'Global Logistics Support', short: 'Flexible shipping options by air, sea or express.', detail: 'We coordinate packaging, export preparation and shipment planning around your destination, order volume and agreed delivery schedule.' },
];

// Service imagery is intentionally contextual. Quality control uses an HTML checklist,
// since no verified inspection photograph has been supplied.
export const serviceMedia = {
  sourcing: { src: '/images/materials-reference.jpg', alt: 'Material swatches for bag development' },
  'oem-odm': { src: '/images/design-reference.jpg', alt: 'Bag concept sketches' },
  'branding-packaging': { src: '/images/packaging.webp', alt: 'Packaging materials' },
  logistics: { src: '/images/harbor.jpg', alt: 'Shipping harbor' },
};

export const markets = [
  { slug: 'southeast-asia', name: 'Southeast Asia', sub: 'Planning for Southeast Asian buyers', position: '0%' },
  { slug: 'united-states', name: 'United States', sub: 'Planning for US buyers', position: '33.333%' },
  { slug: 'united-kingdom', name: 'United Kingdom', sub: 'Planning for UK buyers', position: '66.666%' },
  { slug: 'europe', name: 'Europe', sub: 'Planning for European buyers', position: '100%' },
];

export const articles = [
  { slug: 'develop-custom-bag-collection', title: 'How to Develop a Custom Bag Collection from China', date: 'Buyer Guide', image: '/images/design-reference.jpg', excerpt: 'Move from your first brief to an approved sample with clear decisions at every stage.', sections: [
    ['Start with the customer and use case', 'Define who will carry the bag, when they will use it and what they need to bring. These choices guide the shape, capacity, construction and price direction.'],
    ['Create a practical brief', 'Collect references, target dimensions, brand requirements and expected order quantities. A good brief leaves space for material and construction recommendations while making priorities clear.'],
    ['Review the sample carefully', 'Check proportions, comfort, organization, workmanship and logo placement. Record changes in one consolidated round of feedback before approving production specifications.'],
    ['Confirm the order plan', 'Agree on the final sample, packing requirements, inspection scope and delivery terms before production. This makes the quotation and timeline meaningful for both sides.'],
  ] },
  { slug: 'choosing-bag-materials', title: 'A Guide to Choosing the Right Materials for Your Bags', date: 'Materials', image: '/images/materials-reference.jpg', excerpt: 'Balance appearance, feel, intended use and project requirements.', sections: [
    ['Begin with the product role', 'A commuter bag, fashion tote and promotional pouch place different demands on their materials. Start with the intended use before comparing swatches.'],
    ['Consider the complete construction', 'Outer fabric is only one decision. Lining, reinforcement, hardware, stitching and closures all affect the experience of the finished bag.'],
    ['Check color and branding together', 'Print, embroidery, labels and embossing behave differently across surfaces. Review decoration on the selected material, not only on a digital mockup.'],
    ['Approve a physical sample', 'Evaluate hand feel, appearance and workmanship on a sample. Confirm any testing requirements for your destination market as part of the project brief.'],
  ] },
  { slug: 'shipping-bags-internationally', title: 'Shipping Bags Internationally: What Importers Need to Know', date: 'Logistics', image: '/images/harbor.jpg', excerpt: 'Plan packaging, shipping method and documentation before your collection is ready.', sections: [
    ['Plan around the destination', 'The destination, order size and required arrival window shape the shipping conversation. Share these details when you request a quote.'],
    ['Agree on packing early', 'Carton dimensions, inner packaging and labeling should be specified before production finishes. Good packing helps protect the product and supports efficient receiving.'],
    ['Choose a suitable shipping method', 'Air, sea and express each have different trade-offs. The right option depends on your schedule, volume and commercial terms.'],
    ['Keep approvals and documents aligned', 'Before dispatch, confirm the approved product, packing list and other documents required for your shipment with the relevant parties.'],
  ] },
];

export const faqs = [
  { group: 'Orders & quotations', q: 'What is the minimum order quantity (MOQ)?', a: 'MOQ depends on the bag style, material, branding method and production arrangement. Share your target quantity and we will confirm a project-specific option.' },
  { group: 'Design & sampling', q: 'Can you help with custom designs?', a: 'Yes. Send a sketch, reference image or technical pack. We can help refine the structure, materials and branding before a sample is made.' },
  { group: 'Design & sampling', q: 'How long does sample development take?', a: 'Sampling time depends on the complexity of the design, selected materials and number of revisions. We confirm the schedule after reviewing your brief.' },
  { group: 'Delivery & quality', q: 'What shipping options are available?', a: 'Sea, air and express options can be discussed based on your destination, order size and agreed delivery window.' },
  { group: 'Delivery & quality', q: 'Do you provide quality inspection?', a: 'Inspection scope is agreed for each project against the approved sample and written requirements. We can coordinate in-process and pre-shipment checks.' },
  { group: 'Design & sampling', q: 'Can I customize the logo and packaging?', a: 'Yes. We can review suitable logo techniques, labels, hangtags and packaging formats for your selected bag and materials.' },
  { group: 'Orders & quotations', q: 'What information should I send for a useful quote?', a: 'The bag category, reference images or technical drawings, intended materials, logo treatment, estimated quantity, destination and target delivery window help us evaluate the project. If some details are undecided, tell us your priorities.' },
  { group: 'Orders & quotations', q: 'Are prices shown on the website?', a: 'No. A meaningful price depends on the approved design, material, order volume, packaging and delivery terms. We discuss these requirements before preparing a project quotation.' },
  { group: 'Design & sampling', q: 'Can I approve a sample before production?', a: 'Sample review is part of the development conversation. We use the approved sample and written specifications to align the production plan; the exact sample scope and any charges are confirmed for your project.' },
  { group: 'Delivery & quality', q: 'How is delivery timing confirmed?', a: 'Timing depends on the final design, material availability, sampling approvals, production capacity and shipping method. We confirm a project schedule after those details are defined.' },
  { group: 'Delivery & quality', q: 'Can you support testing or market requirements?', a: 'Tell us the destination market and the standards or tests your buyer requires. We can discuss the relevant documentation and testing plan with the production partners. No certification is implied until confirmed for the product and order.' },
  { group: 'Working together', q: 'Do you own the factories that make the bags?', a: 'STARDOTS coordinates development and production through suitable partner factories. The production arrangement, responsibilities and inspection scope are agreed for each order.' },
];

// Buyer guidance describes decisions and possible options, not fixed product specifications.
export const categoryGuides = {
  backpacks: {
    fit: 'A backpack succeeds when carrying comfort and interior organization match the buyer’s routine. Define what must fit inside before choosing a silhouette.',
    decisions: [
      ['Carry and comfort', 'Discuss shoulder strap shape, back panel support and handles for the intended load and journey.'],
      ['Interior layout', 'Identify device, bottle, document or travel compartments that matter to your customer.'],
      ['Material and finish', 'Compare the intended look with durability, cleaning and logo application needs.'],
    ],
    brief: ['Who will carry it and what should fit inside?', 'Which features are essential versus optional?', 'What volume, destination and launch window are you planning?'],
    question: 'Do you need one core style or a coordinated family of sizes and colors?',
  },
  'tote-bags': {
    fit: 'The right tote balances appearance, load, handle comfort and how the customer will use it. A small change in construction can alter the whole impression.',
    decisions: [
      ['Shape and capacity', 'Decide whether the tote is for everyday carry, retail presentation or a compact promotional use.'],
      ['Handles and closure', 'Review handle length, reinforcement and whether an open top, zip or magnetic closure fits the brief.'],
      ['Brand expression', 'Choose a logo position and decoration approach that works with the selected body material.'],
    ],
    brief: ['What will customers carry in the tote?', 'Is the design intended for retail, events or gifting?', 'Which references show the look and branding you want?'],
    question: 'Should the bag be structured, foldable or somewhere between?',
  },
  handbags: {
    fit: 'Handbag development begins with the silhouette and how it feels in hand. Hardware, lining and finish should support the same design direction.',
    decisions: [
      ['Silhouette and scale', 'Set the intended proportions, carrying style and opening before detailing the interior.'],
      ['Surface and trim', 'Review material hand feel, edge treatment, hardware color and how they work together.'],
      ['Collection coherence', 'Consider colorways and branding details that make related styles feel like one range.'],
    ],
    brief: ['Who is the target customer and sales channel?', 'Do you have sketches, samples or visual references?', 'Which details should be consistent across the collection?'],
    question: 'Is your priority a distinctive hero style or a flexible everyday range?',
  },
  'travel-duffel-bags': {
    fit: 'Travel bags need to make packing and carrying straightforward. Start with the journey, typical contents and handling conditions.',
    decisions: [
      ['Packing access', 'Discuss opening width, separate compartments and how contents are found on the move.'],
      ['Carry options', 'Review handles, shoulder strap and attachment points for the intended use.'],
      ['Wear points', 'Identify areas that may need reinforcement, protective feet or more robust construction.'],
    ],
    brief: ['Is this for travel, sports, work or gifting?', 'What size and contents should the design accommodate?', 'How will the bag be packed and transported?'],
    question: 'Will the bag be carried alone or as part of a travel set?',
  },
  'laptop-bags': {
    fit: 'A work bag should protect and organize daily essentials without feeling bulky. Device fit and access are the first decisions.',
    decisions: [
      ['Device fit', 'Specify the devices and accessories the compartment should accommodate; dimensions are confirmed in sampling.'],
      ['Organization', 'Prioritize documents, cables, quick-access items and any travel use.'],
      ['Professional finish', 'Align material, hardware and subtle branding with the intended customer and channel.'],
    ],
    brief: ['Which devices and essentials must fit?', 'Is the main use commuting, meetings or travel?', 'What appearance and carrying format suit your buyer?'],
    question: 'Is a slim profile or generous organization more important?',
  },
  'cosmetic-bags': {
    fit: 'A useful cosmetic bag combines the right opening, interior finish and easy organization for its contents.',
    decisions: [
      ['Opening and access', 'Choose an opening that makes the contents visible and easy to reach.'],
      ['Interior treatment', 'Discuss lining, dividers and cleaning needs for the intended products.'],
      ['Presentation', 'Coordinate color, logo and any outer packaging with the retail or gifting experience.'],
    ],
    brief: ['What products will the bag hold?', 'Will it be sold alone or as part of a set?', 'Are cleaning, display or packaging needs important?'],
    question: 'Would a compact pouch or a more organized case serve your customer better?',
  },
  'promotional-bags': {
    fit: 'A promotional bag should make the brand visible while remaining useful after the campaign. Start with the audience and the moment of use.',
    decisions: [
      ['Format and usefulness', 'Select a bag type your recipients are likely to keep and use.'],
      ['Decoration', 'Review artwork size, placement and method on the actual selected material.'],
      ['Distribution', 'Consider packing, transport and handout requirements early in development.'],
    ],
    brief: ['Who will receive the bag and where?', 'What artwork and brand colors must be represented?', 'How many units and destinations are involved?'],
    question: 'What should the recipient use the bag for after the event?',
  },
};

export const serviceGuides = {
  sourcing: {
    scope: [['Material shortlist', 'Compare appearance, hand feel, intended use and price direction together.'], ['Component matching', 'Review lining, reinforcement, webbing, zippers and other trims as a complete system.'], ['Sample validation', 'Confirm shortlisted materials on a physical sample before final approval.']],
    inputs: ['Target customer and product use', 'Visual references and material preferences', 'Budget direction and destination market'],
    outcomes: ['Material and trim options for review', 'A record of approved selections', 'Items needing testing or further confirmation'],
    note: 'Availability, composition and any sustainability claim must be verified for the chosen material and order.',
  },
  'oem-odm': {
    scope: [['Design review', 'Translate your concept, reference or technical pack into a workable development brief.'], ['Prototype planning', 'Identify dimensions, construction and material decisions to test in a sample.'], ['Revision control', 'Consolidate feedback so the next sample addresses the priorities that matter.']],
    inputs: ['Sketches, reference images or technical pack', 'Target customer and use case', 'Must-have features and target quantity'],
    outcomes: ['A clear development brief', 'Sample review points and revisions', 'Approved direction for a production quotation'],
    note: 'Sample charges, number of revisions and development timing are agreed for each project.',
  },
  'branding-packaging': {
    scope: [['Logo application', 'Compare printing, embroidery, labels or other suitable methods against the selected surface.'], ['Brand components', 'Review labels, hangtags and hardware details as part of one visual system.'], ['Packing format', 'Plan individual protection, retail presentation and carton requirements.']],
    inputs: ['Vector artwork and brand guidelines', 'Preferred placements and presentation references', 'Retail, gifting or shipping requirements'],
    outcomes: ['Decoration placement for sample review', 'Approved packaging direction', 'A written list of artwork and packing details'],
    note: 'Final appearance is approved on physical materials and samples, not only on a screen mockup.',
  },
  'quality-control': {
    scope: [['Reference standard', 'Use the approved sample and written specifications to define what will be checked.'], ['Inspection points', 'Agree which production stages require checks and what information should be recorded.'], ['Issue follow-up', 'Review findings, corrective actions and any recheck needed before release.']],
    inputs: ['Approved sample and specification', 'Critical features, tolerances and packaging requirements', 'Buyer-required tests or inspection criteria'],
    outcomes: ['Agreed inspection scope', 'Recorded findings for the order', 'Clear decisions on issues and shipment readiness'],
    note: 'Inspection and testing scope varies by order; specific certifications or pass results are never assumed.',
  },
  logistics: {
    scope: [['Shipment planning', 'Discuss destination, volume and required arrival window before choosing a route.'], ['Packing coordination', 'Align carton, label and document requirements with the buyer and shipping plan.'], ['Handover', 'Confirm the agreed commercial terms and required documents before dispatch.']],
    inputs: ['Delivery address or destination port', 'Estimated volume and timing priority', 'Packing, labeling and document requirements'],
    outcomes: ['Options for sea, air or express discussion', 'Agreed packing and dispatch details', 'A shipment plan matched to the order'],
    note: 'Freight cost, transit time, duties and responsibilities depend on the route and agreed terms.',
  },
};

export const marketGuides = {
  'southeast-asia': { intro: 'Southeast Asia is a group of distinct markets. Identify the destination country and sales channel before deciding on product and shipment details.', priorities: [['Destination specificity', 'Clarify the exact country, buyer and channel rather than planning for the region as one market.'], ['Presentation needs', 'Share language, labeling and retail packaging requirements supplied by your buyer.'], ['Delivery planning', 'Confirm destination, receiving requirements and preferred shipping arrangement.']], brief: ['Destination country and buyer channel', 'Any local labeling or testing instructions', 'Product references, estimated quantity and timing'] },
  'united-states': { intro: 'For United States projects, align the bag concept with the retailer’s specifications and the importer’s documentation requirements early.', priorities: [['Retail brief', 'Define the target customer, assortment role and required presentation.'], ['Buyer requirements', 'Provide any testing, labeling or packaging criteria your buyer needs the product to meet.'], ['Receiving plan', 'Discuss destination, carton details and required arrival window before finalizing the order.']], brief: ['Retailer or brand requirements', 'Product testing and label instructions, if applicable', 'Delivery destination and receiving details'] },
  'united-kingdom': { intro: 'For United Kingdom buyers, a clear brief should connect product design, buyer requirements and the agreed delivery route.', priorities: [['Product positioning', 'Share the desired look, use and price direction for the intended channel.'], ['Compliance brief', 'Identify any testing, labeling or documentation requested by your buyer.'], ['Delivery handover', 'Agree packing, destination and commercial terms with the parties involved.']], brief: ['Sales channel and target customer', 'Buyer-specified testing and labeling', 'Delivery point, quantities and timing'] },
  europe: { intro: 'Europe spans different countries and retail channels. Plan the collection against the specific buyer and destination, not a single regional assumption.', priorities: [['Country and channel', 'Identify the exact destination and whether the project is for retail, wholesale or a brand program.'], ['Buyer criteria', 'Share the required testing, material or labeling criteria before development.'], ['Shipment setup', 'Coordinate packaging and documentation with the agreed delivery route.']], brief: ['Destination country and retail channel', 'Buyer-specified product and packaging requirements', 'Estimated quantity, delivery point and window'] },
};

export const articleExtras = {
  'develop-custom-bag-collection': {
    checklist: ['Identify the target customer and primary use.', 'Mark features as essential or optional.', 'Supply visual references and target dimensions.', 'State estimated quantity, destination and target launch window.', 'Consolidate sample feedback before approval.'],
    watch: ['Approving appearance without checking comfort or function.', 'Changing materials after price and schedule are agreed.', 'Leaving packaging and inspection requirements until production ends.'],
  },
  'choosing-bag-materials': {
    checklist: ['Compare swatches under realistic light and handling.', 'Review outer material, lining, reinforcement and trim together.', 'Check logo technique on the actual surface.', 'Record any buyer-required tests or material declarations.', 'Approve the material on a physical sample.'],
    watch: ['Choosing by appearance alone when the use is demanding.', 'Assuming a claimed recycled or certified material is documented.', 'Judging color or texture from a screen image only.'],
  },
  'shipping-bags-internationally': {
    checklist: ['Provide destination and required arrival window.', 'Confirm carton and individual packing requirements.', 'Agree the shipping method and commercial terms.', 'Review labels, packing list and buyer-required documents.', 'Assign a contact for shipment updates and receiving.'],
    watch: ['Treating production completion as the arrival date.', 'Changing carton requirements after packing is planned.', 'Assuming duties or customs responsibilities without agreed terms.'],
  },
};

// Resolve language per render; cache immutable Chinese content independently of the URL.
let chineseData;
export function getSiteData(locale = getLocale()) {
  const content = { COMPANY, categories, services, serviceMedia, markets, articles, faqs, categoryGuides, serviceGuides, marketGuides, articleExtras };
  if (locale !== 'zh') return content;
  if (chineseData) return chineseData;
  const collection = (items, translations) => items.map(item => ({ ...item, ...translations[item.slug] }));
  return chineseData = { ...content,
    COMPANY: { ...COMPANY, ...zhContent.COMPANY },
    categories: collection(categories, zhContent.categories),
    services: collection(services, zhContent.services),
    serviceMedia: Object.fromEntries(Object.entries(serviceMedia).map(([key, value]) => [key, { ...value, ...zhContent.serviceMedia[key] }])),
    markets: collection(markets, zhContent.markets),
    articles: collection(articles, zhContent.articles),
    faqs: zhContent.faqs, serviceGuides: zhContent.serviceGuides, marketGuides: zhContent.marketGuides, articleExtras: zhContent.articleExtras,
  };
}
