from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
import json
root=Path('dist'); missing=set();remote=set(); htmls=list(root.rglob('*.html'));counts={'html':len(htmls),'imageReferences':0,'links':0}
class Check(HTMLParser):
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ['img','script','source','link']:
   src=a.get('src') or (a.get('srcset','').split(' ')[0] if tag=='source' else None) or (a.get('href') if a.get('rel') in ['stylesheet','icon'] else None)
   if src:
    if src.startswith('http'):remote.add(src)
    elif src.startswith('/') and not(root/unquote(src).lstrip('/')).is_file():missing.add(src)
    counts['imageReferences']+=tag=='img'
  if tag=='a' and a.get('href','').startswith('/'):
   p=unquote(urlparse(a['href']).path).lstrip('/'); dest=root/p;counts['links']+=1
   if not dest.is_file() and not(dest/'index.html').is_file() and not(root/(p+'.html')).is_file():missing.add(a['href'])
for f in htmls:Check().feed(f.read_text())
report={'counts':counts,'missing':sorted(missing),'remoteRuntimeResources':sorted(remote)}
Path('docs/local-static-audit.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
