import {getBuildSnapshot} from './snapshot.js';
export function siteImage(slot,fallback){return getBuildSnapshot().imageSlots[slot]?.image.sourceUrl??fallback;}
export function categoryReference(category,current,baseline){const original=baseline.find(p=>p.images[0]===category.image);return current.find(p=>p.sku===original?.sku)??current.find(p=>p.category===category.slug);}
