'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { defaultLocale } from '@/lib/i18n';

export async function generateStaticParams() {
  return [{ locale: defaultLocale }];
}

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="not-found">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}