import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function Navbar() {
  const { auth } = usePage().props;
  const user = auth ? auth.user : null;
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    if (user) {
      axios.put('/api/user/preferences', { language: lng })
        .catch(err => console.error('Failed to save language preference:', err));
    }
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 py-4 px-6 sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-500">GDF</Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-400 transition-colors">{t('Home')}</Link>
          <Link href="/freebies" className="hover:text-blue-400 transition-colors">{t('Freebies')}</Link>
          
          {user ? (
            <>
              <Link href="/profile" className="hover:text-blue-400 transition-colors">{t('Profile')}</Link>
              <Link
                href="/logout"
                method="post"
                as="button"
                className="bg-red-600/80 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded transition-colors"
              >
                {t('Logout')}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-400 transition-colors">{t('Login')}</Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded transition-colors">{t('Signup')}</Link>
            </>
          )}

          {/* Quick Language Selector */}
          <select 
            value={i18n.language} 
            onChange={handleLanguageChange}
            className="bg-gray-900 border border-gray-700 text-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
