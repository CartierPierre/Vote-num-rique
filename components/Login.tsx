
import React from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-lg overflow-hidden border-t-4 border-marianne-blue">
        <div className="p-8 text-center border-b border-gray-100">
          <h1 className="text-3xl font-bold mb-2 text-slate-800">République Française</h1>
          <h2 className="text-xl font-semibold text-slate-600">Plateforme de Vote Vérifié & Sécurisé</h2>
          <p className="text-gray-500 mt-4 text-sm max-w-lg mx-auto">
            Bienvenue sur le portail de démocratie participative. Veuillez sélectionner votre mode d'accès sécurisé.
          </p>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* Espace Citoyen */}
          <div className="p-8 hover:bg-blue-50/30 transition-colors flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-marianne-blue">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Espace Citoyen</h3>
            <p className="text-sm text-gray-500 text-center mb-8 h-10">
              Je veux m'informer, vérifier mes connaissances et voter sur les projets de ma commune.
            </p>
            <button 
              onClick={() => onLogin('CITIZEN')}
              className="w-full py-3 px-4 bg-[#000091] hover:bg-blue-900 text-white rounded-md font-medium transition-colors flex items-center justify-center shadow-sm"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/FranceConnect_Logo.svg/320px-FranceConnect_Logo.svg.png" alt="FranceConnect" className="h-6 mr-2 bg-white rounded px-1" />
              S'identifier
            </button>
          </div>

          {/* Espace Élu */}
          <div className="p-8 hover:bg-red-50/30 transition-colors flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-marianne-red">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Espace Élu</h3>
            <p className="text-sm text-gray-500 text-center mb-8 h-10">
              Je souhaite proposer une mesure, soumettre des argumentaires et lancer une consultation.
            </p>
            <button 
              onClick={() => onLogin('OFFICIAL')}
              className="w-full py-3 px-4 border-2 border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 rounded-md font-bold transition-colors"
            >
              Accès Portail Élus
            </button>
          </div>

        </div>
        
        <div className="bg-gray-50 p-4 text-center">
           <div className="flex justify-center space-x-2">
             <span className="h-1.5 w-12 bg-blue-600 rounded-full"></span>
             <span className="h-1.5 w-12 bg-white border border-gray-300 rounded-full"></span>
             <span className="h-1.5 w-12 bg-red-600 rounded-full"></span>
           </div>
        </div>
      </div>
    </div>
  );
};
