import React from 'react';
import { Proposal } from '../types';

interface ProposalReaderProps {
  proposal: Proposal;
  onFinishReading: () => void;
}

export const ProposalReader: React.FC<ProposalReaderProps> = ({ proposal, onFinishReading }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden my-8">
      <div className="bg-slate-900 text-white p-8">
        <h2 className="text-3xl font-bold mb-2">{proposal.title}</h2>
        <div className="flex items-center space-x-2 text-slate-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span>{proposal.location}</span>
        </div>
      </div>

      <div className="p-8">
        <div className="prose prose-slate max-w-none mb-10">
          <h3 className="text-xl font-bold text-slate-900 mb-3">La Proposition</h3>
          <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border-l-4 border-slate-900">
            {proposal.summary}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Arguments Pour
            </h3>
            <ul className="space-y-3">
              {proposal.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start text-emerald-900">
                  <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-xl border border-red-100">
            <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Arguments Contre
            </h3>
            <ul className="space-y-3">
              {proposal.cons.map((con, idx) => (
                <li key={idx} className="flex items-start text-red-900">
                   <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                   {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-blue-900 mb-4 text-center font-medium">Avez-vous bien analysé les enjeux ?</p>
            <button
                onClick={onFinishReading}
                className="bg-marianne-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-800 transform hover:-translate-y-0.5 transition-all flex items-center"
            >
                Passer à la vérification
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
        </div>
      </div>
    </div>
  );
};