'use client';

import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');
  
  return (
    <div className="not-found">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}