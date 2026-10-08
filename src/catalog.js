// One listing per distinct reference design, with edited gallery views.
// Descriptions cover visible details only; measurements and materials need confirmation.
import { getBuildSnapshot } from './content/snapshot.js';
import { toBagCatalog } from './content/catalog-adapter.js';
import { expandedCatalogRows } from './catalog-expanded.js';
export const catalogImageBase = '/images/catalog';

const items = [
  ['JSD-250401', 'sports', 'Compact Utility Bag', '轻便多用途包', 'Black compact bag with a top handle, zip closure and a contrasting front panel.', '黑色轻便包，带顶部提手、拉链开合及拼色前片。'],
  ['JSD-250418', 'sports', 'Zip Waist Bag', '拉链腰包', 'Black waist bag with an adjustable strap and multiple visible zip compartments.', '黑色腰包，带可调节肩带及可见的多个拉链袋位。'],
  ['JSD-250420', 'sports', 'Olive Barrel Bag', '橄榄绿筒形包', 'Olive barrel-shaped bag with dark straps and a long zip opening.', '橄榄绿色筒形包，带深色肩带及长拉链开口。'],
  ['JSD-250421', 'briefcase', 'Olive Document Bag', '橄榄绿文件包', 'Olive flat-profile bag with top handles, a shoulder strap and a front zip pocket.', '橄榄绿色扁平包型，带顶部提手、肩带及正面拉链袋。'],
  ['MH-2506013', 'backpack', 'Two-tone Backpack', '双色双肩背包', 'Gray and black backpack with a vertical front zip detail and padded shoulder straps.', '灰黑双色双肩包，正面有竖向拉链细节，背面带肩带。'],
  ['MH-2506023', 'backpack', 'Olive Strap Backpack', '橄榄绿搭扣背包', 'Olive backpack with dark front straps, buckles and multiple zip openings.', '橄榄绿双肩包，带深色正面织带、搭扣与多个拉链开口。'],
  ['MH-2506030', 'backpack', 'Blue Panel Backpack', '蓝色拼接双肩包', 'Blue and black backpack with a front zip pocket and padded shoulder straps.', '蓝黑拼接双肩包，带正面拉链袋及肩带。'],
  ['WA-2506012', 'smallgoods', 'Brown Zip Wallet', '棕色拉链钱包', 'Brown zip wallet with a compact rectangular shape and visible inner sections.', '棕色长方形拉链钱包，展开后可见内部分区。'],
  ['WA-2506014', 'smallgoods', 'Blue Wristlet Pouch', '浅蓝色腕带小包', 'Light blue zip pouch with a detachable-looking wrist strap and a front zip pocket.', '浅蓝色拉链小包，配腕带，正面带拉链袋。'],
  ['WA-2506021', 'smallgoods', 'Color-block Zip Wallet', '拼色拉链钱包', 'Pink color-block zip wallet with visible card and storage sections inside.', '粉色拼接拉链钱包，展开后可见卡位及收纳分区。'],
];

const initialCatalogItems = items.map(([sku, category, en, zh, enDesc, zhDesc]) => ({
  sku,
  slug: sku.toLowerCase(),
  category,
  name: [en, zh],
  description: [enDesc, zhDesc],
  images: [1, 2].map((number) => `${catalogImageBase}/${sku}-0${number}.webp`),
  debranded: sku === 'JSD-250420',
}));

export const baselineCatalogItems = [
  ...initialCatalogItems,
  ...expandedCatalogRows.map((item) => ({
    ...item,
    images: Array.from(
      { length: item.viewCount },
      (_, index) => `${catalogImageBase}/${item.sku}-${String(index + 1).padStart(2, '0')}.webp`,
    ),
    debranded: false,
  })),
];

export const catalogItems = toBagCatalog(getBuildSnapshot());
