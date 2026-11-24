from pathlib import Path
import json,re,hashlib
root=Path(__file__).resolve().parents[3]
reference=(root/'public/diapos/harnais/index.html').read_text(encoding='utf-8')
slides=json.loads((root/'docs/cours/premiers-pas-ia/contenu.json').read_text(encoding='utf-8'))
from html import escape as e
parts=[{'nom':'Essayer un chat','de':1,'a':7},{'nom':'Vérifier et se repérer','de':8,'a':12},{'nom':'De la discussion à l’assistant','de':13,'a':26},{'nom':'Agents et suite','de':27,'a':30},{'nom':'Sources','de':31,'a':len(slides),'hors':True}]
widgets=json.loads((root/'docs/cours/premiers-pas-ia/interactions.json').read_text(encoding='utf-8'))
new=[]
for i,s in enumerate(slides):
    n=i+1;part=next(j+1 for j,p in enumerate(parts) if p['de']<=n<=p['a'])
    lead='<p class="lead">'+e(s['lead'])+'</p>' if s['lead'] else ''
    items='<ul class="plain">'+''.join('<li data-step="'+str(j+1)+'">'+e(t)+'</li>' for j,t in enumerate(s['items']))+'</ul>' if s['items'] else ''
    html=s['html'].replace('class="example"','class="card"').replace('class="prompt"','class="card lead"').replace('class="ingredients"','class="plain"').replace('class="agenda"','class="plain"').replace('class="checks"','class="plain"').replace('class="signature"','class="note"').replace('class="sources"','class="plain intro-sources"').replace('<table>','<table class="tbl">')
    html=html.replace('class="flow"','class="places intro-flow"')
    html=re.sub(r'(<li>)(<strong>.*?</strong>)(<span>)',r'\1\2\3',html)
    # Chemin de lecture local : les cours et les exercices restent accessibles.
    body=lead+items+html
    if s['kind']=='cover':
        body='<div class="c5 cover-text">'+lead+html+'</div><div class="c7 cover-col"><div class="cover-vis intro-cover"><div class="sens" aria-hidden="true"><div class="sens-carte"><b>Demander</b><span>le chat</span></div><div class="sens-carte"><b>Vérifier</b><span>le résultat</span></div><div class="sens-cerveau"><b>Vous</b><span>objectif et décisions</span></div><div class="sens-carte"><b>Configurer</b><span>l’assistant</span></div><div class="sens-carte"><b>Comprendre</b><span>les agents</span></div></div></div></div>'
    if n==1: body=(root/'docs/cours/premiers-pas-ia/ouverture.html').read_text(encoding='utf-8')
    if str(n) in widgets: body=widgets[str(n)]
    cls='slide s-cover' if s['kind']=='cover' else 'slide'
    layout='g12' if s['kind']=='cover' else 'stack-m'
    widget_attr=' data-widget-slide="true"' if str(n) in widgets else ''
    new.append(f'<section{widget_attr} class="{cls}" data-part="{part}" data-key="intro-{n}"><h2 class="title">{e(s["title"])}</h2><div class="body {layout}">{body}</div></section>')
start=reference.index('<div id="slides">')+len('<div id="slides">')
end=reference.index('    <button type="button" class="edge"',start)
reference=reference[:start]+'\n'+'\n\n'.join(new)+'\n    </div>\n'+reference[end:]
config={'auteur':'Clément Bastien','theme':'light','policesUrl':'','minutes':[1]*len(slides),'parties':parts,'bonus':[],'alerteAmbre':1.10,'alerteRouge':1.25,'textes':{},'urls':{},'images':{},'sources':{},'motsCles':[[s['part'],s['title']] for s in slides],'notes':{},'question':'','vraiFaux':[],'quiz':[],'lexique':[],'references':[]}
# Des poids égaux pilotent seulement la progression ; aucun temps n’est imposé.
source_data=json.loads((root/'src/contenu/premiers-pas-ia-sources.json').read_text(encoding='utf-8'))
config['lexique']=source_data['lexique']
config['references']=source_data['references']
config['sources']=json.loads((root/'docs/cours/premiers-pas-ia/sources-par-diapo.json').read_text(encoding='utf-8'))
config['minutes']=[1]*len(slides)
a=reference.index('const CONFIG = {');b=reference.index('\n(() => {',a)
reference=reference[:a]+'const CONFIG = '+json.dumps(config,ensure_ascii=False,indent=2)+';\n'+reference[b:]
reference=re.sub(r'<title>.*?</title>','<title>Premiers pas avec l’IA · Le Labo</title>',reference,count=1)
reference=reference.replace('aria-label="Diapos du cours Le Harnais"','aria-label="Diapos Premiers pas avec l’IA"')
reference=re.sub(r'<h1 class="sr">.*?</h1>','',reference)
reference=reference.replace('<div id="viewport" role="main">','<div id="viewport">').replace('<div id="slides">','<h1 class="sr">Premiers pas avec l’IA</h1><div id="slides">')
# La bande des six est une ancienne signature : ne pas reproduire ce traitement à un seul côté.
reference=re.sub(r'\.slide::before\s*\{[^}]*\}','',reference)
reference=reference.replace('a.href = "/comprendre-ia/types-ia/";', 'a.href = "/comprendre-ia/premiers-pas-ia/";').replace("a.textContent = '← Retour au cours';","a.textContent = '← Retour au cours';")
reference=reference.replace('data-retour="/comprendre-ia/le-harnais/diapos/"','data-retour="/comprendre-ia/premiers-pas-ia/"')
# Le pont de plateforme utilisait encore les couleurs d’une ancienne charte.
reference=reference.replace('background:#17153B;color:#FBF4E4;', 'background:var(--surface);color:var(--text);border:1px solid var(--line);')
extra='''
/* Adaptateurs de contenu uniquement : jetons, scène et lecteur hérités du Harnais publié. */
.intro-flow{list-style:none;padding:0}.intro-flow li{display:grid;align-content:start;gap:24px;padding:24px 0}.intro-flow strong{font:600 var(--fs-big)/1.1 var(--font-title)}.intro-flow span{font-size:var(--fs-body);line-height:1.4}.intro-sources li{display:grid;gap:12px}.intro-sources span{color:var(--muted);font-size:var(--fs-min)}caption{text-align:left;color:var(--muted);font-size:var(--fs-meta);padding-bottom:16px}.tbl th[scope=row]{background:var(--surface);color:var(--text);font-weight:700;border-top:2px solid var(--line)}.intro-cover{border-radius:var(--r-l)}
#lecture-cours{position:fixed;right:14px;bottom:18px;z-index:50;display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1px solid var(--line);border-radius:var(--r-s);background:var(--surface);color:var(--text);font:600 15px/1 var(--font-body);text-decoration:none}.mode-lecture #lecture-cours{display:none}@media print{#lecture-cours{display:none}}
'''
reference=reference.replace('</style>',extra+'\n</style>',1)
reference=reference.replace('https://www.labonumerique.ch/comprendre-ia/types-ia/', '/comprendre-ia/types-ia/').replace('href="exercices/index.html"', 'href="/comprendre-ia/premiers-pas-ia/exercices/"')
reference=reference.replace('Math.min(window.innerWidth / 1920, window.innerHeight / 1080)', 'Math.min(window.innerWidth / 1600, window.innerHeight / 1100)')
# Retirer les fonctions temporelles de ce cours sans modifier le lecteur des autres.
reference=reference.replace("else if (low === 's') { if (e.shiftKey) timerReset(); else timerToggle(); }", "else if (low === 's') return;")
reference=reference.replace("' min allouées, étape '", "' étape '")
reference=reference.replace("+ ', ' + num(minutes[i], minutes[i] % 1 ? 1 : 0)", "")
reference=reference.replace("else if (c === 'timer') timerToggle(); else if (c === 'reset') timerReset();", "")
reference=reference.replace(", s: 'timer', S: 'timer'", "")
reference=reference.replace("'Chrono (touche S)'", "'Progression libre'")
reference=reference.replace("[].forEach(f => f());", "[initLexique, initRefs].forEach(f => f());")
reference=reference.replace('</head>', '<link rel="stylesheet" href="interactions.css"><link rel="stylesheet" href="ouverture.css">\n</head>')
reference=reference.replace('<script src="../lecture.js"', '<script src="interactions.js" defer></script>\n<script src="../lecture.js"')
reference=reference.replace('</body>','<a id="lecture-cours" href="?lecture=1">Lire le texte</a>\n</body>')
reference=re.sub(r'<!--\s*Présentation autonome.*?-->', '<!-- Première rédaction. Gabarits et lecteur repris du cours Le Harnais publié, le 15 novembre 2026. Contenu de ce cours : docs/cours/premiers-pas-ia/contenu.json. -->',reference,count=1,flags=re.S)
reference='\n'.join(line.rstrip() for line in reference.split('\n'))
(root/'public/diapos/premiers-pas-ia/index.html').write_text(reference,encoding='utf-8')
print('Cours généré :',len(slides),'diapos, sans horaire ni chronomètre.')


# Version éditoriale synchronisée pour la relecture.
markdown=['# Premiers pas avec l’IA', '', 'Parcours modulable, sans horaire ni chronomètre.', '']
for i,slide in enumerate(slides,1):
    markdown.extend([f'## {i}. {slide["title"]}', '', slide['lead'], ''])
    markdown.extend('- '+item for item in slide['items'])
    markdown.extend(['', slide['html'], '', 'Sources :'])
    markdown.extend('- ['+source['t']+']('+source['u']+')' for source in config['sources'].get('intro-'+str(i),[]))
    markdown.append('')
(root/'docs/cours/premiers-pas-ia/diapos.md').write_text('\n'.join(markdown),encoding='utf-8')
