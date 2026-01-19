import NotFoundPage from '@/components/chrome/NotFoundPage/NotFoundPage';
import { generateCmsNotFoundMetadata } from '@/lib/site/cmsNotFound';

export const dynamic = 'force-static';

export const generateMetadata = generateCmsNotFoundMetadata;

export default function NotFound() {
  return <NotFoundPage />;
}
