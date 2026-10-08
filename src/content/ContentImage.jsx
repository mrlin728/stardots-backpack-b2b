import React from 'react';
import {useContentSnapshot,useAssetUrls} from './snapshot-context.jsx';
import {getLocale} from '../locale.js';
export function ContentImage({slot,...props}){const asset=useContentSnapshot().imageSlots[slot]?.image,urls=useAssetUrls();return <img {...props} src={asset?(urls[asset.id]??asset.sourceUrl):props.src} alt={asset?.alt[getLocale()]??props.alt} style={asset?{...props.style,objectPosition:`${asset.focal.x*100}% ${asset.focal.y*100}%`}:props.style} data-provenance={asset?.provenance}/>;}
