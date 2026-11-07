// Création du PDF dans le navigateur, chargée seulement au clic. Lisible en noir et blanc.
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Fiche } from './fiches';
import { blocs, identite, NON_RENSEIGNE, type Reponses } from './exports';
import { calculerScore } from './score';

// Les polices intégrées au PDF ne connaissent pas ces espaces fines.
const propre = (v: string) => v.replace(/[  ]/g, ' ');

export type Page = { titre: string; lignes: { type: 'titre' | 'texte' | 'gras'; texte: string }[] };

function outil() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const marge = 18;
  const largeur = doc.internal.pageSize.getWidth() - marge * 2;
  const hauteur = doc.internal.pageSize.getHeight() - marge;
  let y = marge;
  const place = (h: number) => { if (y + h > hauteur) { doc.addPage(); y = marge; } };
  const ecrire = (texte: string, taille: number, style: 'normal' | 'bold', apres = 2) => {
    doc.setFont('helvetica', style).setFontSize(taille).setTextColor(0);
    const lignes: string[] = doc.splitTextToSize(propre(texte), largeur);
    const h = taille * 0.42;
    for (const l of lignes) { place(h); doc.text(l, marge, y + h * 0.8); y += h; }
    y += apres;
  };
  return { doc, marge, ecrire, place, get y() { return y; }, set y(v: number) { y = v; } };
}

export function ficheEnPdf(fiche: Fiche, r: Reponses) {
  const o = outil();
  o.ecrire(fiche.titre, 18, 'bold', 4);
  for (const [nom, valeur] of identite(fiche, r)) o.ecrire(`${nom} : ${valeur}`, 11, 'normal', 1);
  o.y += 3;
  const score = calculerScore(fiche, r);
  if (score) { o.ecrire('Ton score', 14, 'bold', 3); for (const l of score.lignes) o.ecrire(l, 11, 'normal', 1); o.y += 3; }
  for (const b of blocs(fiche, r)) {
    if (b.type === 'section') { o.y += 3; o.ecrire(b.titre, 14, 'bold', 3); if (b.intro) o.ecrire(b.intro, 11, 'normal', 3); }
    if (b.type === 'texte') o.ecrire(b.texte, 11, 'normal', 3);
    if (b.type === 'question') { o.ecrire(b.question, 11, 'bold', 1); o.ecrire(b.reponse, 11, 'normal', 3); }
    if (b.type === 'choix') {
      const choisis = b.options.filter((c) => c.coche).map((c) => c.nom);
      o.ecrire(b.question, 11, 'bold', 1);
      o.ecrire((choisis.join(', ') || NON_RENSEIGNE) + (b.autre ? ` : ${b.autre}` : ''), 11, 'normal', 3);
    }
    if (b.type === 'table') {
      o.ecrire(b.question, 11, 'bold', 2);
      autoTable(o.doc, {
        startY: o.y, margin: { left: o.marge, right: o.marge }, theme: 'grid',
        head: [b.colonnes.map(propre)], body: b.lignes.map((l) => l.map(propre)),
        styles: { font: 'helvetica', fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1, overflow: 'linebreak' },
        headStyles: { fillColor: 235, textColor: 0, fontStyle: 'bold' },
      });
      o.y = (o.doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;
    }
  }
  return o.doc.output('arraybuffer');
}

// Le modèle vide à imprimer : cases à cocher et lignes à remplir.
export function modeleEnPdf(fiche: Fiche) {
  const o = outil();
  const ligne = () => { o.place(8); o.y += 6; o.doc.setDrawColor(120).setLineWidth(0.2).line(o.marge, o.y, o.doc.internal.pageSize.getWidth() - o.marge, o.y); o.y += 2; };
  const tableau = (head: string[], body: string[][]) => {
    autoTable(o.doc, { startY: o.y, margin: { left: o.marge, right: o.marge }, theme: 'grid', head: [head.map(propre)], body: body.map((l) => l.map(propre)), styles: { font: 'helvetica', fontSize: 9, textColor: 0, lineColor: 0, lineWidth: 0.1, minCellHeight: 8 }, headStyles: { fillColor: 235, textColor: 0, fontStyle: 'bold' } });
    o.y = (o.doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;
  };
  o.ecrire(fiche.titre, 18, 'bold', 4);
  o.ecrire(fiche.intro, 11, 'normal', 3);
  for (const nom of [fiche.identite.projet, fiche.identite.nom, 'Date'].filter(Boolean) as string[]) { o.ecrire(`${nom} :`, 11, 'bold', 0); ligne(); }
  for (const s of fiche.sections) {
    o.y += 4;
    o.ecrire(s.titre, 14, 'bold', 3);
    if (s.intro) o.ecrire(s.intro, 11, 'normal', 3);
    for (const c of s.champs) {
      if (c.type === 'texte') o.ecrire(c.texte, 11, 'normal', 3);
      if (c.type === 'ligne' || c.type === 'zone') { o.ecrire(c.label, 11, 'bold', 0); if (c.aide) o.ecrire(c.aide, 10, 'normal', 0); for (let i = 0; i < (c.type === 'zone' ? c.lignes : 1); i += 1) ligne(); o.y += 2; }
      if (c.type === 'mots') { o.ecrire(c.label, 11, 'bold', 0); ligne(); o.y += 2; }
      if (c.type === 'choix') {
        o.ecrire(c.label, 11, 'bold', 2);
        for (const option of c.options) {
          o.place(7);
          o.doc.setDrawColor(0).setLineWidth(0.25).rect(o.marge, o.y + 0.6, 3.4, 3.4);
          const y = o.y;
          o.doc.setFont('helvetica', 'normal').setFontSize(11).setTextColor(0);
          const lignes: string[] = o.doc.splitTextToSize(propre(option), o.doc.internal.pageSize.getWidth() - o.marge * 2 - 6);
          lignes.forEach((l, i) => o.doc.text(l, o.marge + 6, y + 3.6 + i * 4.8));
          o.y = y + lignes.length * 4.8 + 1.6;
        }
        o.y += 2;
      }
      if (c.type === 'grille') { o.ecrire(c.label, 11, 'normal', 2); tableau(['Notion', '1', '2', '3', '4', '5'], c.notions.map((n) => [n, '', '', '', '', ''])); }
      if (c.type === 'tableau') { o.ecrire(c.label, 11, 'bold', 2); tableau(c.colonnes, Array.from({ length: c.lignes }, () => c.colonnes.map(() => ''))); }
      if (c.type === 'fonctionnalites') tableau(['N°', 'Fonctionnalité', 'Pourquoi l’utilisateur en a besoin', 'MVP', 'Priorité'], Array.from({ length: 15 }, (_, i) => [String(i + 1), '', '', '', '']));
    }
  }
  return o.doc.output('arraybuffer');
}

export function pageEnPdf(page: Page) {
  const o = outil();
  o.ecrire(page.titre, 18, 'bold', 4);
  for (const l of page.lignes) {
    if (l.type === 'titre') { o.y += 3; o.ecrire(l.texte, 13, 'bold', 2); }
    if (l.type === 'gras') o.ecrire(l.texte, 11, 'bold', 1);
    if (l.type === 'texte') o.ecrire(l.texte, 11, 'normal', 2);
  }
  return o.doc.output('arraybuffer');
}
