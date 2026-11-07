import PageFiche, { metaFiche } from '@/composants/PageFiche';

export const metadata = metaFiche('test');
export default function Page() { return <PageFiche slug="test" suite={{ href: '/demarrer/idee/', nom: 'la fiche 1' }} />; }
