'use client';

import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import { IDEES_FONCTIONS, LIGNES_DEPART, PRIORITES, QUESTION_CONTROLE, SEUIL_MVP, trouverFiche, type Champ, type Section } from '@/contenu/parcours/fiches';
import { fonctions, nomFichier, telecharger, versMarkdown, type LigneFonction, type Reponses } from '@/contenu/parcours/exports';
import { calculerScore, type Score } from '@/contenu/parcours/score';

const vide = (): LigneFonction => ({ fonction: '', pourquoi: '', mvp: false, priorite: '' });
const AVERTISSEMENT = 'Tes réponses ne sont enregistrées nulle part. Si tu quittes cette page sans télécharger, elles seront perdues.';
const TEINTES = ['--b-design', '--b-friction', '--b-access', '--b-comportement', '--b-micro', '--b-perf'];
const teinte = (i: number) => ({ '--teinte': `var(${TEINTES[i % TEINTES.length]})` }) as CSSProperties;

// Une question compte comme répondue dès qu'il y a quelque chose dedans.
function compter(c: Champ, r: Reponses): [number, number] {
  const rempli = (id: string) => { const v = r[id]; return Array.isArray(v) ? v.length > 0 : typeof v === 'string' && v.trim() !== ''; };
  switch (c.type) {
    case 'texte': return [0, 0];
    case 'grille': return [c.notions.filter((_, i) => rempli(`${c.id}.${i}`)).length, c.notions.length];
    case 'mots': return [Array.from({ length: c.nombre }, (_, i) => rempli(`${c.id}.${i}`)).some(Boolean) ? 1 : 0, 1];
    case 'tableau': return [Object.keys(r).some((k) => k.startsWith(`${c.id}.`) && rempli(k)) ? 1 : 0, 1];
    case 'fonctionnalites': return [fonctions(r).some((f) => f.fonction.trim()) ? 1 : 0, 1];
    default: return [rempli(c.id) ? 1 : 0, 1];
  }
}
const avancement = (s: Section, r: Reponses) => s.champs.map((c) => compter(c, r)).reduce(([a, b], [x, y]) => [a + x, b + y], [0, 0]);

const estCourt = (c: Champ) => c.type === 'ligne' || (c.type === 'choix' && !c.autre && c.options.length <= 4 && c.options.every((o) => o.length < 24));

// Une fiche éphémère : les réponses vivent seulement dans cette page, jusqu'au téléchargement.
// Elle reçoit le slug, et non la fiche : Next.js ne transmet que des données simples aux composants du navigateur.
export default function Fiche({ slug, suite }: { slug: string; suite?: { href: string; nom: string } }) {
  const fiche = trouverFiche(slug)!;
  const [r, setR] = useState<Reponses>(() => ({ ...(fiche.sections.some((s) => s.champs.some((c) => c.type === 'fonctionnalites')) ? { fonctionnalites: Array.from({ length: LIGNES_DEPART }, vide) } : {}) }));
  const [modifie, setModifie] = useState(false);
  const [fini, setFini] = useState(false);
  const [score, setScore] = useState<Score | null>(null);
  const [statut, setStatut] = useState('');
  const [enCours, setEnCours] = useState('');
  const modifieRef = useRef(false);
  modifieRef.current = modifie;

  const changer = (id: string, valeur: Reponses[string]) => { setR((p) => ({ ...p, [id]: valeur })); setModifie(true); setFini(false); };

  useEffect(() => { setR((p) => ({ ...p, 'identite.date': new Date().toLocaleDateString('sv-SE') })); }, []);

  // Alerte avant de quitter : fermeture de l'onglet et clic sur un lien vers une autre page.
  useEffect(() => {
    const avant = (e: BeforeUnloadEvent) => { if (modifieRef.current) e.preventDefault(); };
    const clic = (e: MouseEvent) => {
      const lien = (e.target as HTMLElement).closest?.('a[href]');
      if (!lien || lien.hasAttribute('download') || lien.getAttribute('href')?.startsWith('#')) return;
      if (modifieRef.current && !window.confirm(AVERTISSEMENT)) { e.preventDefault(); e.stopPropagation(); }
    };
    window.addEventListener('beforeunload', avant);
    document.addEventListener('click', clic, true);
    return () => { window.removeEventListener('beforeunload', avant); document.removeEventListener('click', clic, true); };
  }, []);

  const terminer = (message: string) => { setModifie(false); setFini(true); setScore(calculerScore(fiche, r)); setStatut(message); };
  const pdf = async () => {
    setEnCours('pdf');
    try {
      const { ficheEnPdf } = await import('@/contenu/parcours/pdf');
      telecharger(ficheEnPdf(fiche, r), nomFichier(fiche, r, 'pdf'), 'application/pdf');
      terminer('Ton PDF est téléchargé.');
    } catch { setStatut('Le PDF n’a pas pu être créé. Télécharge la version Word ou Markdown pour garder tes réponses.'); } finally { setEnCours(''); }
  };
  const word = async () => {
    setEnCours('word');
    try {
      const { ficheEnWord } = await import('@/contenu/parcours/word');
      telecharger(await ficheEnWord(fiche, r), nomFichier(fiche, r, 'docx'), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      terminer('Ton document Word est téléchargé.');
    } catch { setStatut('Le document Word n’a pas pu être créé. Télécharge la version PDF ou Markdown pour garder tes réponses.'); } finally { setEnCours(''); }
  };
  const markdown = () => { telecharger(versMarkdown(fiche, r), nomFichier(fiche, r, 'md'), 'text/markdown;charset=utf-8'); terminer('Ton fichier Markdown est téléchargé.'); };
  const modelePdf = async () => {
    const { modeleEnPdf } = await import('@/contenu/parcours/pdf');
    telecharger(modeleEnPdf(fiche), `${fiche.fichier}-modele.pdf`, 'application/pdf');
    setStatut('Le modèle PDF est téléchargé.');
  };

  const totaux = fiche.sections.map((s) => avancement(s, r));
  const fait = totaux.reduce((n, [a]) => n + a, 0);
  const total = totaux.reduce((n, [, b]) => n + b, 0);

  return (
    <form className="fiche" onSubmit={(e) => { e.preventDefault(); void pdf(); }}>
      <div className="fiche-intro">
        <div className="fiche-consigne">
          <p className="fiche-regle">{fiche.intro}</p>
          <p><strong>Rien n’est enregistré.</strong> Tes réponses restent dans cette page. Télécharge ton fichier à la fin, sinon elles seront perdues.</p>
        </div>
        <div className="fiche-modele">
          <p><strong>Tu préfères le remplir ailleurs ?</strong> Télécharge le modèle vide.</p>
          <div className="actions">
            <a className="bouton-secondaire" href={`/telechargements/parcours/${fiche.fichier}-modele.docx`} download>Word</a>
            <button type="button" className="bouton-secondaire" onClick={() => void modelePdf()}>PDF</button>
            <a className="bouton-secondaire" href={`/telechargements/parcours/${fiche.fichier}-modele.md`} download>Markdown</a>
          </div>
        </div>
      </div>

      <div className="fiche-corps">
        <nav className="fiche-sommaire" aria-label="Parties de la fiche">
          <p className="sommaire-compte">{fait} réponse{fait > 1 ? 's' : ''} sur {total}</p>
          <div className="sommaire-jauge" aria-hidden="true"><span style={{ width: `${total ? (fait / total) * 100 : 0}%` }} /></div>
          <ol>
            {fiche.sections.map((s, i) => (
              <li key={s.titre} style={teinte(i)} className={totaux[i][1] > 0 && totaux[i][0] === totaux[i][1] ? 'est-fait' : undefined}>
                <a href={`#partie-${i + 1}`}>
                  <span>{s.titre}</span>
                  <span className="sommaire-nombre">{totaux[i][0]}/{totaux[i][1]}<span className="visuellement-cache"> réponses</span></span>
                </a>
              </li>
            ))}
            <li><a href="#terminer"><span>Terminer</span></a></li>
          </ol>
        </nav>

        <div className="fiche-contenu">
          <div className="fiche-identite">
            {fiche.identite.projet && <Texte label={fiche.identite.projet} valeur={r['identite.projet']} changer={(v) => changer('identite.projet', v)} />}
            <Texte label={fiche.identite.nom} valeur={r['identite.nom']} changer={(v) => changer('identite.nom', v)} autocomplete="name" />
            <Texte label="Date" type="date" valeur={r['identite.date']} changer={(v) => changer('identite.date', v)} />
          </div>

          {fiche.sections.map((s, i) => (
            <section className="fiche-section" id={`partie-${i + 1}`} key={s.titre} style={teinte(i)}>
              <header className="fiche-section-tete">
                <h2>{s.titre}</h2>
                {s.intro && <p>{s.intro}</p>}
              </header>
              <div className="fiche-champs">
                {s.champs.map((c) => <div key={c.id} className={estCourt(c) ? 'champ-demi' : 'champ-plein'}><ChampFiche champ={c} r={r} changer={changer} setStatut={setStatut} /></div>)}
              </div>
            </section>
          ))}

          <section className="fiche-fin" id="terminer" aria-labelledby="fiche-fin-titre">
            <h2 id="fiche-fin-titre">Terminer</h2>
            <p>Le fichier part directement dans tes téléchargements. Garde-le : le site n’en conserve aucune copie.</p>
            <div className="actions">
              <button type="submit" className="bouton" disabled={!!enCours}>{enCours === 'pdf' ? 'Création du PDF…' : 'Terminer et télécharger en PDF'}</button>
              <button type="button" className="bouton-secondaire" disabled={!!enCours} onClick={() => void word()}>{enCours === 'word' ? 'Création du document…' : 'Télécharger en Word'}</button>
              <button type="button" className="bouton-secondaire" onClick={markdown}>Télécharger en Markdown</button>
            </div>
            {fini && score && (
              <div className="score">
                <h3>Ton score</h3>
                <dl>
                  <div><dt>Bonnes réponses</dt><dd>{score.questions}<span> sur {score.questionsMax}</span></dd></div>
                  <div><dt>Auto-évaluation</dt><dd>{score.niveau}<span> sur {score.niveauMax}</span></dd></div>
                </dl>
                <p>Il est aussi dans ton fichier. Refais le test dans un mois et compare tes deux fichiers.</p>
              </div>
            )}
            {fini && suite && <p><Link className="lien-fleche" href={suite.href}>Continuer : {suite.nom}</Link></p>}
            <p className="fiche-statut" role="status" aria-live="polite">{statut}</p>
          </section>
        </div>
      </div>
    </form>
  );
}

function Texte({ label, valeur, changer, type = 'text', autocomplete = 'off', aide }: { label: string; valeur: Reponses[string] | undefined; changer: (v: string) => void; type?: string; autocomplete?: string; aide?: string }) {
  const id = useId();
  return (
    <div className="champ">
      <label htmlFor={id}>{label}</label>
      {aide && <p className="champ-aide" id={`${id}-aide`}>{aide}</p>}
      <input id={id} type={type} autoComplete={autocomplete} aria-describedby={aide ? `${id}-aide` : undefined} value={typeof valeur === 'string' ? valeur : ''} onChange={(e) => changer(e.target.value)} />
    </div>
  );
}

function Zone({ label, aide, lignes, max, valeur, changer }: { label: string; aide?: string; lignes: number; max?: number; valeur: Reponses[string] | undefined; changer: (v: string) => void }) {
  const id = useId();
  const texte = typeof valeur === 'string' ? valeur : '';
  const compte = texte ? texte.split('\n').length : 0;
  const decrit = [aide && `${id}-aide`, max && `${id}-compte`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="champ">
      <label htmlFor={id}>{label}</label>
      {aide && <p className="champ-aide" id={`${id}-aide`}>{aide}</p>}
      <textarea id={id} rows={Math.max(lignes, 2)} aria-describedby={decrit} value={texte} onChange={(e) => changer(max ? e.target.value.split('\n').slice(0, max).join('\n') : e.target.value)} />
      {max && <p className="champ-aide" id={`${id}-compte`}>{compte} ligne{compte > 1 ? 's' : ''} sur {max}</p>}
    </div>
  );
}

function ChampFiche({ champ, r, changer, setStatut }: { champ: Champ; r: Reponses; changer: (id: string, v: Reponses[string]) => void; setStatut: (s: string) => void }) {
  const nom = useId();
  switch (champ.type) {
    case 'texte': return <p className="champ-texte">{champ.texte}</p>;
    case 'ligne': return <Texte label={champ.label} aide={champ.aide} valeur={r[champ.id]} changer={(v) => changer(champ.id, v)} />;
    case 'zone': return <Zone label={champ.label} aide={champ.aide} lignes={champ.lignes} max={champ.max} valeur={r[champ.id]} changer={(v) => changer(champ.id, v)} />;
    case 'mots': return (
      <fieldset className="champ-groupe">
        <legend>{champ.label}</legend>
        <div className="champ-mots">
          {Array.from({ length: champ.nombre }, (_, i) => <Texte key={i} label={`Mot ${i + 1}`} valeur={r[`${champ.id}.${i}`]} changer={(v) => changer(`${champ.id}.${i}`, v)} />)}
        </div>
      </fieldset>
    );
    case 'choix': {
      const choisis = Array.isArray(r[champ.id]) ? r[champ.id] as string[] : [];
      const basculer = (o: string, coche: boolean) => changer(champ.id, champ.multiple ? (coche ? [...choisis, o] : choisis.filter((x) => x !== o)) : [o]);
      return (
        <fieldset className="champ-groupe">
          <legend>{champ.label}</legend>
          <div className="champ-options">
            {champ.options.map((o) => (
              <label className="option" key={o}>
                <input type={champ.multiple ? 'checkbox' : 'radio'} name={nom} checked={choisis.includes(o)} onChange={(e) => basculer(o, e.target.checked)} />
                <span>{o}</span>
              </label>
            ))}
          </div>
          {champ.autre && choisis.includes(champ.autre) && <Texte label="Précise :" valeur={r[`${champ.id}.autre`]} changer={(v) => changer(`${champ.id}.autre`, v)} />}
        </fieldset>
      );
    }
    case 'grille': return (
      <div className="champ-grille">
        <p className="champ-texte">{champ.label}</p>
        {champ.notions.map((n, i) => (
          <fieldset className="grille-ligne" key={n}>
            <legend>{n}</legend>
            <div className="jauge">
              {[1, 2, 3, 4, 5].map((v) => (
                <label className="niveau" key={v}>
                  <input type="radio" name={`${nom}-${i}`} checked={r[`${champ.id}.${i}`] === String(v)} onChange={() => changer(`${champ.id}.${i}`, String(v))} />
                  <span>{v}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    );
    case 'tableau': return (
      <div className="champ-lignes">
        {Array.from({ length: champ.lignes }, (_, l) => (
          <fieldset className="champ-groupe" key={l}>
            <legend>Solution {l + 1}</legend>
            <div className="champ-mots">
              {champ.colonnes.map((c, i) => <Texte key={c} label={c} valeur={r[`${champ.id}.${l}.${i}`]} changer={(v) => changer(`${champ.id}.${l}.${i}`, v)} />)}
            </div>
          </fieldset>
        ))}
      </div>
    );
    case 'fonctionnalites': return <Fonctionnalites r={r} changer={(v) => changer(champ.id, v)} setStatut={setStatut} />;
  }
}

function Fonctionnalites({ r, changer, setStatut }: { r: Reponses; changer: (v: LigneFonction[]) => void; setStatut: (s: string) => void }) {
  const lignes = useMemo(() => fonctions(r), [r]);
  const nbMvp = lignes.filter((l) => l.mvp).length;
  const maj = (i: number, partiel: Partial<LigneFonction>) => changer(lignes.map((l, n) => (n === i ? { ...l, ...partiel } : l)));
  const proposer = (idee: string) => {
    const libre = lignes.findIndex((l) => !l.fonction.trim());
    changer(libre === -1 ? [...lignes, { ...vide(), fonction: idee }] : lignes.map((l, n) => (n === libre ? { ...l, fonction: idee } : l)));
    setStatut(`« ${idee} » ajouté à la liste.`);
  };
  return (
    <div className="fonctions">
      <div className="idees">
        <p className="champ-aide">Idées de fonctionnalités courantes (pour t’aider, pas obligatoire) :</p>
        <ul>{IDEES_FONCTIONS.map((idee) => <li key={idee}><button type="button" className="puce" onClick={() => proposer(idee)}>{idee}</button></li>)}</ul>
      </div>
      <ol>
        {lignes.map((l, i) => (
          <li key={i} className="fonction">
            <span className="fonction-num" aria-hidden="true">{i + 1}</span>
            <div className="fonction-champs">
              <Texte label={`Fonctionnalité ${i + 1}`} valeur={l.fonction} changer={(v) => maj(i, { fonction: v })} />
              <Texte label="Pourquoi l’utilisateur en a besoin" valeur={l.pourquoi} changer={(v) => maj(i, { pourquoi: v })} />
              <label className="option fonction-mvp"><input type="checkbox" checked={l.mvp} onChange={(e) => maj(i, { mvp: e.target.checked })} /><span>MVP<span className="visuellement-cache"> pour la fonctionnalité {i + 1}</span></span></label>
              <Priorite numero={i + 1} valeur={l.priorite} changer={(v) => maj(i, { priorite: v })} />
              <button type="button" className="bouton-secondaire fonction-suppr" onClick={() => { changer(lignes.filter((_, n) => n !== i)); setStatut(`Ligne ${i + 1} supprimée.`); }}>Supprimer<span className="visuellement-cache"> la ligne {i + 1}</span></button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="bouton-secondaire" onClick={() => { changer([...lignes, vide()]); setStatut('Ligne ajoutée.'); }}>Ajouter une ligne</button>
      <div aria-live="polite">{nbMvp > SEUIL_MVP && <p className="fiche-alerte">{nbMvp} lignes en MVP : {QUESTION_CONTROLE}</p>}</div>
    </div>
  );
}

function Priorite({ numero, valeur, changer }: { numero: number; valeur: string; changer: (v: string) => void }) {
  const id = useId();
  return (
    <div className="champ">
      <label htmlFor={id}>Priorité<span className="visuellement-cache"> de la fonctionnalité {numero}</span></label>
      <select id={id} value={valeur} onChange={(e) => changer(e.target.value)}>
        <option value="">À choisir</option>
        {PRIORITES.map((p) => <option key={p}>{p}</option>)}
      </select>
    </div>
  );
}
