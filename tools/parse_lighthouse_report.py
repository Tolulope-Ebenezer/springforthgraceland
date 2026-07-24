import json, re, sys
p='lighthouse-report-local.html'
try:
    s=open(p,'r',encoding='utf-8').read()
except Exception as e:
    print('ERROR reading',p,e); sys.exit(2)
idx=s.find('window.__LIGHTHOUSE_JSON__')
if idx==-1:
    print('ERROR: JSON marker not found'); sys.exit(2)
idx_eq=s.find('=', idx)
start=s.find('{', idx_eq)
if start==-1:
    print('ERROR: JSON start not found'); sys.exit(2)
count=0
end=None
for i,ch in enumerate(s[start:], start):
    if ch=='{': count+=1
    elif ch=='}': count-=1
    if count==0:
        end=i+1
        break
if end is None:
    print('ERROR: JSON end not found'); sys.exit(2)
json_text=s[start:end]
try:
    j=json.loads(json_text)
except Exception as e:
    print('ERROR parsing JSON', e); sys.exit(2)
# categories
cats=j.get('categories',{})
out={'categories':{}}
for k,v in cats.items():
    out['categories'][k]={'score':v.get('score'), 'title':v.get('title')}
# performance failing audits
perf=cats.get('performance',{})
auditRefs=perf.get('auditRefs',[])
fails=[]
for ref in auditRefs:
    aid=ref.get('id')
    audit=j.get('audits',{}).get(aid)
    if not audit:
        continue
    score=audit.get('score')
    # Treat null as not scored; include if score is numeric and < 1
    if isinstance(score,(int,float)) and score < 1:
        fails.append({'id':aid,'title':audit.get('title'),'score':score,'displayValue':audit.get('displayValue')})
# sort by score asc
fails=sorted(fails, key=lambda x: (x['score'] if x['score'] is not None else 1))
out['performance_failing_audits']=fails[:20]
print(json.dumps(out, indent=2))
