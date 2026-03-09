import type { ResourceLanguage } from 'i18next';

// App-level translations (staying in app/locales)
import authTranslations from '@/features/auth/locales/es';
import ideasTranslations from '@/features/ideas/locales/es';
import profileTranslations from '@/features/profile/locales/es';
import reviewsTranslations from '@/features/reviews/locales/es';

import about from './about';
import common from './common';
import components from './components';
import dashboard from './dashboard';
import home from './home';
import navigation from './navigation';
import notFound from './not-found';

// Feature translations (imported from features)

export default {
  common,
  notFound,
  auth: authTranslations, // From features/auth
  home,
  about,
  dashboard,
  ideas: ideasTranslations, // From features/ideas
  reviews: reviewsTranslations, // From features/reviews
  profile: profileTranslations, // From features/profile
  navigation,
  components,
} satisfies ResourceLanguage;
