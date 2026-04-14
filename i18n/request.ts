import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Define a type for valid locales
type Locale = 'en' | 'fr';

// Can be imported from a shared config
const locales: Locale[] = ['en', 'fr'];

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request, fallback to default
  const locale = (await requestLocale) ?? 'en';

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
