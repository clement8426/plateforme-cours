// Création du PDF dans le navigateur, chargée seulement au clic. Lisible en noir et blanc.
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Fiche } from './fiches';
import { blocs, identite, NON_RENSEIGNE, type Reponses } from './exports';

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
