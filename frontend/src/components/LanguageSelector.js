import React, { useState, useContext, createContext } from 'react';

// Contexte pour la langue globale
const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ar-TN');
  
  const languages = {
    'ar-TN': {
      name: 'تونسي',
      flag: '🇹🇳',
      code: 'ar-TN',
      direction: 'rtl'
    },
    'fr-FR': {
      name: 'Français',
      flag: '🇫🇷',
      code: 'fr-FR',
      direction: 'ltr'
    },
    'ar': {
      name: 'عربي',
      flag: '🇸🇦',
      code: 'ar',
      direction: 'rtl'
    }
  };

  const switchLanguage = (langCode) => {
    if (languages[langCode]) {
      setCurrentLanguage(langCode);
      // Mettre à jour la direction du document
      document.documentElement.dir = languages[langCode].direction;
      document.documentElement.lang = langCode;
    }
  };

  const value = {
    currentLanguage,
    languages,
    switchLanguage,
    currentLangInfo: languages[currentLanguage]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, languages, switchLanguage } = useLanguage();

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentLanguage}
        onChange={(e) => switchLanguage(e.target.value)}
        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        title="Changer la langue de l'interface"
      >
        {Object.entries(languages).map(([code, lang]) => (
          <option key={code} value={code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;