import Link from 'next/link';

export default function Introuvable() {
  return (
    <div className="page">
      <header className="tete">
        <h1>Page introuvable</h1>
        <p className="chapeau">Cette adresse ne mène à aucun cours. Elle a peut-être changé.</p>
        <div className="actions"><Link className="bouton" href="/">Voir tous les thèmes</Link></div>
      </header>
    </div>
  );
}
