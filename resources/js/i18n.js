import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Home": "Home",
      "Freebies": "Freebies",
      "Profile": "Profile",
      "Login": "Login",
      "Signup": "Signup",
      "Logout": "Logout",
      "Welcome": "Welcome back",
      "My Saved Games": "My Saved Games",
      "Preferences": "Preferences",
      "Language": "Language",
      "Currency": "Currency",
      "Save Changes": "Save Changes",
      "Find Deals": "Find the best prices across all digital stores"
    }
  },
  es: {
    translation: {
      "Home": "Inicio",
      "Freebies": "Gratis",
      "Profile": "Perfil",
      "Login": "Acceso",
      "Signup": "Registrarse",
      "Logout": "Cerrar sesión",
      "Welcome": "Bienvenido de nuevo",
      "My Saved Games": "Mis juegos guardados",
      "Preferences": "Preferencias",
      "Language": "Idioma",
      "Currency": "Moneda",
      "Save Changes": "Guardar cambios",
      "Find Deals": "Encuentra los mejores precios en todas las tiendas digitales"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
