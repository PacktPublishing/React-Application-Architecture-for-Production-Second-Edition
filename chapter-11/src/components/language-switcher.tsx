import { Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { i18nConfig, languages, type Language } from '@/config/i18n';
import { useNotificationActions } from '@/stores/notifications';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation(['components', 'common']);
  const { showNotification } = useNotificationActions();

  const handleLanguageChange = async (language: Language) => {
    const formData = new FormData();
    formData.append(i18nConfig.cookieName, language);

    try {
      const response = await fetch('/api/set-language', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await i18n.changeLanguage(language);

        showNotification({
          type: 'success',
          title: t('common:languageChanged', {
            lng: language,
          }),
        });
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Globe className="h-4 w-4" />
            <span className="sr-only">
              {t('components:languageSwitcher.switchLanguage')}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([key, value]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleLanguageChange(key as Language)}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {i18n.language === key && <Check className="h-4 w-4" />}
              <span className={i18n.language === key ? '' : 'ml-6'}>
                {value}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
