import React, { useState } from 'react';
import { Proposal, VoteType } from '../types';

interface VoteInterfaceProps {
  proposal: Proposal;
  onVote: (choice: VoteType) => void;
}

export const VoteInterface: React.FC<VoteInterfaceProps> = ({ proposal, onVote }) => {
  const [selected, setSelected] = useState<VoteType>(null);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 text-center animate-fade-in">
      <div className="mb-8">
         <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
         </div>
         <h2 className="text-2xl font-bold text-slate-900">Vous êtes éligible au vote</h2>
         <p className="text-slate-500">Vous avez démontré une bonne compréhension du dossier "{proposal.title}".</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setSelected('FOR')}
          className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
            selected === 'FOR' 
              ? 'border-green-500 bg-green-50 text-green-800' 
              : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
          }`}
        >
          <span className="text-3xl mb-2">👍</span>
          <span className="font-bold text-lg">POUR</span>
        </button>

        <button
          onClick={() => setSelected('AGAINST')}
          className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
            selected === 'AGAINST' 
              ? 'border-red-500 bg-red-50 text-red-800' 
              : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
          }`}
        >
          <span className="text-3xl mb-2">👎</span>
          <span className="font-bold text-lg">CONTRE</span>
        </button>

        <button
          onClick={() => setSelected('ABSTAIN')}
          className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
            selected === 'ABSTAIN' 
              ? 'border-slate-500 bg-slate-50 text-slate-800' 
              : 'border-gray-200 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <span className="text-3xl mb-2">✋</span>
          <span className="font-bold text-lg">S'ABSTENIR</span>
        </button>
      </div>

      <button
        onClick={() => selected && onVote(selected)}
        disabled={!selected}
        className="w-full bg-marianne-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
      >
        Confirmer mon vote
      </button>
      <p className="text-xs text-gray-400 mt-4">Votre vote est anonyme et sécurisé par chiffrement.</p>
    </div>
  );
};