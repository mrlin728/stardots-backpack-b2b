import json, pathlib, urllib.request, concurrent.futures
root=pathlib.Path('.')
p=root/'content/release.snapshot.json'
s=json.loads(p.read_text())
urls=set()
def collect(v):
 if isinstance(v,dict):
  for k,x in v.items():
   if k in ('sourceUrl','cardUrl') and isinstance(x,str) and x.startswith('https:'):urls.add(x)
   else: collect(x)
 elif isinstance(v,list):
  for x in v:collect(x)
collect(s)
def fetch(url):
 name=url.rsplit('/',1)[-1]; target=root/'public/images/catalog'/name; target.parent.mkdir(parents=True,exist_ok=True)
 if not target.exists():
  req=urllib.request.Request(url,headers={'User-Agent':'StardotsLocalPreview/1.0'})
  target.write_bytes(urllib.request.urlopen(req,timeout=50).read())
 return url,'/images/catalog/'+name
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex: mapping=dict(ex.map(fetch,sorted(urls)))
def rewrite(v):
 if isinstance(v,dict):return {k:rewrite(x) for k,x in v.items()}
 if isinstance(v,list):return [rewrite(x) for x in v]
 return mapping.get(v,v) if isinstance(v,str) else v
(root/'content/local.snapshot.json').write_text(json.dumps(rewrite(s),ensure_ascii=False)+'\n')
(root/'docs/local-media-provenance.json').write_text(json.dumps(mapping,indent=2))
for file in ['src/catalog.js','src/data.js','src/data-zh.js']:
 p=root/file;text=p.read_text();text=text.replace('https://ugxxaokbqkajqkgxdngz.supabase.co/storage/v1/object/public/stardots-bags','/images/catalog');p.write_text(text)
font='https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/DMSans%5Bopsz,wght%5D.ttf'
(root/'public/fonts/dm-sans.ttf').write_bytes(urllib.request.urlopen(font).read())
(root/'public/fonts/OFL.txt').write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt').read())
print('Localized',len(mapping),'product photographs and DM Sans font')
