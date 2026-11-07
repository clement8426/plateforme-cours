import PageFiche, { metaFiche } from '@/composants/PageFiche';

export const metadata = metaFiche('idee');
export default function Page() { return <PageFiche slug="idee" suite={{ href: '/demarrer/technique/', nom: 'la fiche 2' }} />; }
