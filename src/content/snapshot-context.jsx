import React,{createContext,useContext,useMemo} from 'react';
import {getBuildSnapshot,validateSnapshot} from './snapshot.js';
import {toBagCatalog} from './catalog-adapter.js';
const Context=createContext(getBuildSnapshot());
const Assets=createContext({});
export function ContentSnapshotProvider({snapshot,children,assetUrls={}}){return <Context.Provider value={validateSnapshot(snapshot)}><Assets.Provider value={assetUrls}>{children}</Assets.Provider></Context.Provider>;}
export const useContentSnapshot=()=>useContext(Context);
export function useCatalog(){const snapshot=useContentSnapshot(),urls=useContext(Assets);return useMemo(()=>toBagCatalog({...snapshot,products:snapshot.products.map(p=>({...p,images:p.images.map(a=>({...a,sourceUrl:urls[a.id]??a.sourceUrl,cardUrl:urls[a.id]?undefined:a.cardUrl}))}))}),[snapshot,urls]);}
export function useSiteImage(slot,fallback){const image=useContentSnapshot().imageSlots[slot]?.image,urls=useContext(Assets);return image?(urls[image.id]??image.sourceUrl):fallback;}

export function useAssetUrls(){return useContext(Assets);}
