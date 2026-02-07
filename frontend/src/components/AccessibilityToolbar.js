import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    highContrast, 
    setHighContrast, 
    fontSize, 
    setFontSize,
    announce 
  } = useAccessibility();

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    announce(
      highContrast 
        ? 'Mode contraste élevé désactivé' 
        : 'Mode contraste élevé activé'
    );
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    const sizeLabels = {
      small: 'petite',
      normal: 'normale', 
      large: 'grande',
      xlarge: 'très grande'
    };
    announce(`Taille de police changée à ${sizeLabels[size]}`);
  };

  return (
    <>
      {/* Bouton d'accessibilité fixe */}
      <button
        className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir les options d'accessibilité"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Panel d'accessibilité */}
      {isOpen && (
        <div
          id="accessibility-panel"
          className="fixed top-20 right-4 z-40 bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-80"
          role="dialog"
          aria-labelledby="accessibility-title"
          aria-modal="false"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="accessibility-title" className="text-lg font-semibold text-gray-900">
              Options d'accessibilité
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Fermer les options d'accessibilité"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Contraste élevé */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={toggleHighContrast}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  aria-describedby="contrast-desc"
                />
                <span className="text-sm font-medium text-gray-900">
                  Contraste élevé
                </span>
              </label>
              <p id="contrast-desc" className="text-xs text-gray-600 mt-1 ml-7">
                Améliore la visibilité du texte et des éléments
              </p>
            </div>

            {/* Taille de police */}
            <div>
              <fieldset>
                <legend className="text-sm font-medium text-gray-900 mb-2">
                  Taille de police
                </legend>
                <div className="space-y-2">
                  {[
                    { value: 'small', label: 'Petite' },
                    { value: 'normal', label: 'Normale' },
                    { value: 'large', label: 'Grande' },
                    { value: 'xlarge', label: 'Très grande' }
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="fontSize"
                        value={value}
                        checked={fontSize === value}
                        onChange={() => changeFontSize(value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-900">{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Raccourcis clavier */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Raccourcis clavier
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div><kbd className="px-1 py-0.5 bg-gray-100 rounded">Tab</kbd> : Navigation</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 rounded">Entrée</kbd> : Activer</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 rounded">Échap</kbd> : Fermer</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 rounded">Alt + A</kbd> : Accessibilité</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}