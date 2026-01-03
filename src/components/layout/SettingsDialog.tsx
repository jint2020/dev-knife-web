/**
 * Settings Dialog Component
 *
 * A comprehensive settings dialog for customizing user experience.
 * Follows separation of concerns pattern with reusable sub-components.
 *
 * Features:
 * - Language switching
 * - Color weak mode toggle
 * - Extensible architecture for future settings
 */

import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useColorWeakModeControls } from '@/hooks/useColorWeakMode';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n/config';

/**
 * Settings Section Component
 * Reusable wrapper for grouping related settings
 */
function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium leading-none">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-2">{children}</div>
      <Separator />
    </div>
  );
}

/**
 * Language Setting Component
 * Allows users to select their preferred language
 */
function LanguageSetting() {
  const { i18n } = useTranslation();

  const currentLanguageCode = i18n.language as LanguageCode;
  const currentLanguage = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === currentLanguageCode
  ) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (languageCode: LanguageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {SUPPORTED_LANGUAGES.map((language) => (
        <Button
          key={language.code}
          variant={currentLanguage.code === language.code ? 'default' : 'outline'}
          onClick={() => handleLanguageChange(language.code)}
          className="justify-start"
        >
          {language.nativeName}
        </Button>
      ))}
    </div>
  );
}

/**
 * Color Weak Mode Toggle Component
 * Enables enhanced visibility for users with color vision deficiencies
 */
function ColorWeakToggle() {
  const { t } = useTranslation();
  const { colorWeakMode, toggleColorWeakMode } = useColorWeakModeControls();

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <label
          htmlFor="color-weak-toggle"
          className="text-sm font-medium cursor-pointer"
        >
          {t('settings.colorWeakMode')}
        </label>
        <p className="text-xs text-muted-foreground">
          {t('settings.colorWeakModeDescription')}
        </p>
      </div>
      <Button
        id="color-weak-toggle"
        variant={colorWeakMode ? 'default' : 'outline'}
        size="sm"
        onClick={toggleColorWeakMode}
        aria-pressed={colorWeakMode}
      >
        {colorWeakMode ? t('settings.enabled') : t('settings.disabled')}
      </Button>
    </div>
  );
}

/**
 * Main Settings Dialog Component
 */
export function SettingsDialog() {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title={t('common.settings')}>
          <Settings className="h-5 w-5" />
          <span className="sr-only">{t('common.settings')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('settings.title')}</DialogTitle>
          <DialogDescription>{t('settings.description')}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            {/* Language Section */}
            <SettingsSection title={t('settings.language')}>
              <LanguageSetting />
            </SettingsSection>

            {/* Accessibility Section */}
            <SettingsSection
              title={t('settings.accessibility')}
              description={t('nav.tools')}
            >
              <ColorWeakToggle />
            </SettingsSection>

            {/* Future settings sections can be added here */}
            {/* Example:
            <SettingsSection title="Appearance">
              <FontSizeSetting />
            </SettingsSection>
            */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
