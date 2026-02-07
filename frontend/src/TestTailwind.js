import React from 'react';

const TestTailwind = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          Tailwind CSS fonctionne ! 🎉
        </h1>
        <p style={{ color: '#4b5563' }}>
          Si vous voyez ce texte stylisé, Tailwind est bien configuré.
        </p>
        <button style={{ marginTop: '1rem', backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
          Bouton de test
        </button>
        
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
            ⚠️ Les styles inline fonctionnent. Maintenant testons Tailwind...
          </p>
        </div>
        
        {/* Test avec classes Tailwind */}
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800 font-semibold">
            ✓ Si ce texte est vert avec fond vert clair, Tailwind fonctionne !
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestTailwind;
