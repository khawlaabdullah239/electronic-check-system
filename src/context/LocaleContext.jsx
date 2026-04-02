import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import ar from '../locales/ar';
import en from '../locales/en';

const locales = { ar, en };
const LocaleContext = createContext(null);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
};

export const LocaleProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(() => {
    return localStorage.getItem('locale') || 'ar';
  });

  // Set initial dir/lang on mount
  useEffect(() => {
    document.documentElement.setAttribute('dir', locales[locale].dir);
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const setLocale = useCallback((newLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.setAttribute('dir', locales[newLocale].dir);
    document.documentElement.setAttribute('lang', newLocale);
  }, []);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = locales[locale];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }, [locale]);

  const dir = locales[locale].dir;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LocaleContext.Provider>
  );
};
