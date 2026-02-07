import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Fonction pour annoncer du contenu aux lecteurs d'écran
  const announce = (message, priority = 'polite') => {
    const id = Date.now();
    setAnnouncements(prev => [...prev, { id, message, priority }]);
    
    // Nettoyer après 1 seconde
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, 1000);
  };

  // Détecter les préférences système
  useEffect(() => {
    // Détecter la préférence de mouvement réduit
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Appliquer les styles d'accessibilité
  useEffect(() => {
    const root = document.documentElement;
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    root.setAttribute('data-font-size', fontSize);
    root.setAttribute('data-reduced-motion', reducedMotion);
  }, [highContrast, fontSize, reducedMotion]);

  const value = {
    announce,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      
      {/* Zone d'annonces pour les lecteurs d'écran */}
      <div className="sr-only">
        {announcements.map(({ id, message, priority }) => (
          <div
            key={id}
            role="status"
            aria-live={priority}
            aria-atomic="true"
          >
            {message}
          </div>
        ))}
      </div>
    </AccessibilityContext.Provider>
  );
};