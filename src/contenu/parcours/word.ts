// Crée le document Word d'une fiche remplie, dans le navigateur, chargé seulement au clic.
import { AlignmentType, BorderStyle, Document, HeadingLevel, Packer, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import type { Fiche } from './fiches';
import { blocs, identite, NON_RENSEIGNE, type Reponses } from './exports';
import { calculerScore } from './score';

const propre = (v: string) => v.replace(/[  ]/g, ' ');
const texte = (v: string, gras = false) => new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: propre(v), bold: gras })] });
const bord = { style: BorderStyle.SINGLE, size: 4, color: '777777' };

function tableau(colonnes: string[], lignes: string[][]) {
  const cellule = (v: string, entete = false) => new TableCell({
    borders: { top: bord, bottom: bord, left: bord, right: bord },
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    shading: entete ? { type: ShadingType.CLEAR, fill: 'EEEEEE', color: 'auto' } : undefined,
    children: [new Paragraph({ children: [new TextRun({ text: propre(v), bold: entete })] })],
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ tableHeader: true, children: colonnes.map((c) => cellule(c, true)) }), ...lignes.map((l) => new TableRow({ children: l.map((v) => cellule(v)) }))],
  });
}

export async function ficheEnWord(fiche: Fiche, r: Reponses) {
  const corps: (Paragraph | Table)[] = [new Paragraph({ heading: HeadingLevel.TITLE, alignment: AlignmentType.LEFT, children: [new TextRun(propre(fiche.titre))] })];
  for (const [nom, valeur] of identite(fiche, r)) corps.push(texte(`${nom} : ${valeur}`));
  const score = calculerScore(fiche, r);
  if (score) {
    corps.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Ton score')] }));
    for (const l of score.lignes) corps.push(texte(l));
  }
  for (const b of blocs(fiche, r)) {
    if (b.type === 'section') {
      corps.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(propre(b.titre))] }));
      if (b.intro) corps.push(texte(b.intro));
    }
    if (b.type === 'texte') corps.push(texte(b.texte));
    if (b.type === 'question') corps.push(texte(b.question, true), ...b.reponse.split('\n').map((l) => texte(l)));
    if (b.type === 'choix') {
      const pris = b.options.filter((o) => o.coche).map((o) => o.nom).join(', ') || NON_RENSEIGNE;
      corps.push(texte(b.question, true), texte(pris + (b.autre ? ` : ${b.autre}` : '')));
    }
    if (b.type === 'table') corps.push(texte(b.question, true), tableau(b.colonnes, b.lignes), texte(''));
  }
  return Packer.toBlob(new Document({ creator: 'Le Labo', title: propre(fiche.titre), sections: [{ children: corps }] }));
}
