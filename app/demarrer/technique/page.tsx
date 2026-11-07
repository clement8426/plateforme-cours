import PageFiche, { metaFiche } from '@/composants/PageFiche';

export const metadata = metaFiche('technique');
export default function Page() { return <PageFiche slug="technique" suite={{ href: '/demarrer/entonnoir/', nom: 'l’entonnoir' }} />; }
