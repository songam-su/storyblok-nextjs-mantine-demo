import CmsNotFoundPage from '@/components/chrome/CmsNotFoundPage/CmsNotFoundPage';
import { generateCmsNotFoundMetadata } from '@/lib/site/cmsNotFound';

export const dynamic = 'force-static';

export const generateMetadata = generateCmsNotFoundMetadata;

export default function NotFound() {
  return <CmsNotFoundPage />;
}
