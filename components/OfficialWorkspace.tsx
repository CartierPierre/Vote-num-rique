
import React, { useState } from 'react';
import { Proposal, ProposalStatus } from '../types';
// import { verifyAndSummarizeArguments } from '../services/geminiService'; // Disabled for simulation

interface OfficialWorkspaceProps {
  proposal: Proposal;
  onUpdate: (updated: Proposal) => void;
  onBack: () => void;
}

// Pre-filled scenario text
const PREFILL_MAJORITY = "Notre projet de végétalisation de la place de l'Église est indispensable pour lutter contre les îlots de chaleur urbains. Il permettra de baisser la température de 4°C en été. C'est aussi un lieu de convivialité retrouvé.";
const PREFILL_OPPOSITION = "Ce projet coûte trop cher (500 000€) pour seulement 10 arbres plantés. De plus, il supprime 30 places de parking indispensables aux commerçants du centre-ville qui vont faire faillite.";

export const OfficialWorkspace: React.FC<OfficialWorkspaceProps> = ({ proposal, onUpdate, onBack }) => {
  const [currentStep, setCurrentStep] = useState<ProposalStatus>(proposal.status);
  const [majorityArgs, setMajorityArgs] = useState(proposal.rawMajorityArgs || PREFILL_MAJORITY);
  const [oppositionArgs, setOppositionArgs] = useState(proposal.rawOppositionArgs || PREFILL_OPPOSITION);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStatusChange = (newStatus: ProposalStatus) => {
    setCurrentStep(newStatus);
    onUpdate({ ...proposal, status: newStatus });
  };

  const handleRunAiCheck = async () => {
    setIsProcessing(true);
    
    // SIMULATION: Fake AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // SIMULATION: Hardcoded "Smart" response for the demo scenario
    const mockReport = {
        neutralSummary: "Ce projet vise à réaménager la place de l'Église en remplaçant le stationnement actuel par un espace vert. L'objectif est de créer un îlot de fraîcheur en centre-ville. Le débat cristallise les tensions entre l'urgence de l'adaptation climatique (végétalisation) et les contraintes économiques des commerces locaux (accessibilité automobile).",
        factCheckAnalysis: "✅ **Donnée Vérifiée** : La baisse de température de 4°C est cohérente avec les études du GIEC sur les effets d'ombrage et d'évapotranspiration.\n✅ **Coût** : Le budget de 500 000€ est conforme aux prix du marché pour 1000m² de voirie paysagère.\n⚠️ **A Nuancer** : L'affirmation de l'opposition sur la 'faillite' des commerçants est contredite par plusieurs études (CEREMA) montrant que la piétonisation tend à augmenter le panier moyen, bien que l'accessibilité reste un point de vigilance.",
        sources: ["ADEME - Rafraîchissement urbain (2023)", "CEREMA - Impact commerce centre-ville", "Délibération budgétaire Voirie 2024"]
    };

    const updatedProposal: Proposal = {
      ...proposal,
      title: proposal.title === "Nouvelle Proposition Municipale" ? "Végétalisation de la Place de l'Église" : proposal.title,
      summary: "Transformation de la place minérale en parc urbain : suppression de 30 places de stationnement au profit de 1200m² d'espaces verts.",
      pros: ["Réduction de la température (-4°C)", "Cadre de vie et santé publique", "Gestion des eaux pluviales"],
      cons: ["Suppression de stationnement (30 places)", "Coût d'investissement (500k€)", "Modification des habitudes d'accès"],
      verificationReport: mockReport,
      rawMajorityArgs: majorityArgs,
      rawOppositionArgs: oppositionArgs,
      status: 'ARGUMENTATION' 
    };
    
    onUpdate(updatedProposal);
    setIsProcessing(false);
  };

  const publishVote = () => {
    handleStatusChange('VOTING');
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button onClick={onBack} className="mb-4 text-slate-700 font-medium hover:text-black flex items-center underline decoration-slate-400 underline-offset-4">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Retour au tableau de bord
      </button>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 border border-slate-200">
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{proposal.title}</h1>
            <p className="text-slate-300 font-medium">Édition par le Conseil Municipal</p>
          </div>
          <div className="flex space-x-2">
             {/* Progress Steps */}
             {['DRAFT', 'COUNCIL_REVIEW', 'ARGUMENTATION', 'VOTING'].map((s, idx) => (
               <div key={s} className={`flex items-center ${currentStep === s ? 'opacity-100' : 'opacity-50'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${currentStep === s ? 'bg-marianne-red text-white border-white' : 'bg-slate-800 text-slate-300 border-slate-600'}`}>
                   {idx + 1}
                 </div>
                 {idx < 3 && <div className="w-8 h-0.5 bg-slate-600 mx-1"></div>}
               </div>
             ))}
          </div>
        </div>

        <div className="p-8">
          
          {currentStep === 'DRAFT' && (
            <div className="text-center py-8">
              <p className="text-lg text-slate-900 font-medium mb-6">La proposition est en cours de rédaction.</p>
              <button onClick={() => handleStatusChange('COUNCIL_REVIEW')} className="bg-marianne-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 shadow-md">
                Soumettre au Conseil Municipal
              </button>
            </div>
          )}

          {currentStep === 'COUNCIL_REVIEW' && (
            <div className="text-center py-8">
              <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 mb-6 max-w-2xl mx-auto">
                <h3 className="font-bold text-purple-900 text-lg mb-2">Conseil Municipal en cours</h3>
                <p className="text-purple-900 font-medium">La proposition est présentée physiquement aux élus. Les débats ont lieu en séance.</p>
              </div>
              <button onClick={() => handleStatusChange('ARGUMENTATION')} className="bg-marianne-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 shadow-md">
                Ouvrir la phase d'Argumentaire Public
              </button>
            </div>
          )}

          {(currentStep === 'ARGUMENTATION' || currentStep === 'VOTING') && (
            <div className="space-y-8">
              <div className="bg-blue-50 border-l-4 border-marianne-blue p-4">
                <p className="text-slate-900 font-medium">
                  <strong>Phase d'Argumentaire :</strong> Les groupes politiques soumettent leurs textes ci-dessous. L'IA générera ensuite un résumé neutre et vérifiera la factuelité des propos pour éviter la désinformation.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="majority-args" className="block text-base font-bold text-black mb-3">
                    Argumentaire Majorité (Pour)
                  </label>
                  <textarea 
                    id="majority-args"
                    className="w-full h-56 p-4 border-2 border-slate-800 rounded-lg text-slate-900 bg-white focus:ring-4 focus:ring-blue-200 focus:border-marianne-blue text-base shadow-inner"
                    value={majorityArgs}
                    onChange={(e) => setMajorityArgs(e.target.value)}
                    disabled={currentStep === 'VOTING'}
                    aria-label="Zone de texte pour l'argumentaire de la majorité"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="opposition-args" className="block text-base font-bold text-black mb-3">
                    Argumentaire Opposition (Contre)
                  </label>
                  <textarea 
                    id="opposition-args"
                    className="w-full h-56 p-4 border-2 border-slate-800 rounded-lg text-slate-900 bg-white focus:ring-4 focus:ring-red-200 focus:border-marianne-red text-base shadow-inner"
                    value={oppositionArgs}
                    onChange={(e) => setOppositionArgs(e.target.value)}
                    disabled={currentStep === 'VOTING'}
                    aria-label="Zone de texte pour l'argumentaire de l'opposition"
                  ></textarea>
                </div>
              </div>

              {currentStep === 'ARGUMENTATION' && (
                <div className="flex justify-center pt-4">
                  <button 
                    onClick={handleRunAiCheck}
                    disabled={isProcessing}
                    className="bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-800 transition-all shadow-lg flex items-center text-lg border-2 border-indigo-900 focus:ring-4 focus:ring-indigo-300"
                  >
                    {isProcessing ? (
                       <>
                         <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         Analyse et Vérification IA en cours...
                       </>
                    ) : (
                       <>
                         <span className="text-2xl mr-3">✨</span> Générer Synthèse & Vérifier les Faits
                       </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AI Report Section */}
          {proposal.verificationReport && (
            <div className="mt-10 animate-fade-in border-t-2 border-slate-100 pt-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="bg-green-100 text-green-800 p-2 rounded-lg mr-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </span>
                Rapport de Vérification IA
              </h3>
              
              <div className="bg-white border-2 border-slate-300 rounded-xl p-6 space-y-6 shadow-sm">
                <div>
                   <h4 className="font-bold text-slate-900 uppercase text-sm tracking-wider mb-3 flex items-center">
                     <span className="w-2 h-2 bg-slate-900 rounded-full mr-2"></span>
                     Synthèse Neutre Générée
                   </h4>
                   <p className="text-slate-900 bg-slate-100 p-5 rounded-lg border-l-4 border-slate-500 leading-relaxed text-lg">
                     {proposal.verificationReport.neutralSummary}
                   </p>
                </div>

                <div className="bg-orange-50 p-5 rounded-lg border-2 border-orange-200">
                   <h4 className="font-bold text-orange-900 uppercase text-sm tracking-wider mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      Analyse Fact-Checking & Fake News
                   </h4>
                   <p className="text-slate-900 text-base whitespace-pre-wrap leading-relaxed font-medium">
                     {proposal.verificationReport.factCheckAnalysis}
                   </p>
                </div>

                {proposal.verificationReport.sources.length > 0 && (
                  <div className="pt-2">
                    <h4 className="font-bold text-slate-700 uppercase text-xs tracking-wider mb-2">Sources Vérifiées</h4>
                    <ul className="text-sm text-blue-700 space-y-1 font-medium">
                      {proposal.verificationReport.sources.map((src, i) => (
                        <li key={i} className="flex items-center">
                          <svg className="w-3 h-3 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/></svg>
                          <a href="#" className="hover:underline hover:text-blue-900">{src}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {currentStep === 'ARGUMENTATION' && (
                <div className="mt-10 flex justify-end">
                   <button 
                     onClick={publishVote}
                     className="bg-green-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-800 shadow-xl transform hover:scale-105 transition-all text-lg border-2 border-green-900"
                   >
                     Valider et Ouvrir le Vote aux Citoyens
                   </button>
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
