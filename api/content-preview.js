const backend='https://www.stardotsglobal.com';
const safeHeaders={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer','Content-Type':'application/json'};
export default async function handler(req,res){for(const [k,v]of Object.entries(safeHeaders))res.setHeader(k,v);if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'METHOD_NOT_ALLOWED'});}
 const origin=req.headers.origin,allowed=['https://stardotsbags.com',process.env.VERCEL_URL?`https://${process.env.VERCEL_URL}`:null];if(origin&&!allowed.includes(origin))return res.status(403).json({error:'FORBIDDEN'});
 try{let raw=req.body;if(raw===undefined){let text='',size=0;for await(const chunk of req){size+=Buffer.byteLength(chunk);if(size>2048)throw Error('size');text+=chunk;}raw=JSON.parse(text);}else if(typeof raw==='string')raw=JSON.parse(raw);
  if(Buffer.byteLength(JSON.stringify(raw))>2048||!raw||Object.keys(raw).some(k=>k!=='ticket')||!/^[A-Za-z0-9_-]{43}$/.test(raw.ticket))throw Error('ticket');
  const configured=process.env.CMS_PREVIEW_BACKEND_ORIGIN??backend;
  if(configured!==backend&&!/^https:\/\/stardots-global-partner-[a-z0-9]+-mrlin728-s-projects\.vercel\.app$/.test(configured))throw Error('backend');
  const response=await fetch(configured+'/api/content/preview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ticket:raw.ticket,siteId:'bags'}),redirect:'error',signal:AbortSignal.timeout(12000)});
  if(!response.ok)return res.status(403).json({error:'PREVIEW_UNAVAILABLE'});
  if(Number(response.headers.get('content-length'))>2*1024*1024)throw Error('size');const reader=response.body?.getReader();if(!reader)throw Error('body');let size=0;const chunks=[];try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2*1024*1024){await reader.cancel();throw Error('size');}chunks.push(Buffer.from(value));}}finally{reader.releaseLock();}const data=JSON.parse(Buffer.concat(chunks,size).toString());if(data.snapshot?.siteId!=='bags')throw Error('site');return res.status(200).json(data);
 }catch{return res.status(400).json({error:'PREVIEW_UNAVAILABLE'});}
}
