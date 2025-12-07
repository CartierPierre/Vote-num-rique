
import React from 'react';
import { Proposal, User, ProposalStatus } from '../types';

interface DashboardProps {
  user: User;
  proposals: Proposal[];
  onSelectProposal: (proposal: Proposal) => void;
  onCreateProposal?: () => void;
  onEditProposal?: (proposal: Proposal) => void;
}

const StatusBadge: React.FC<{ status: ProposalStatus }> = ({ status }) => {
  const styles = {
    DRAFT: "bg-gray-100 text-gray-800",
    COUNCIL_REVIEW: "bg-purple-100 text-purple-800",
    ARGUMENTATION: "bg-orange-100 text-orange-800",
    VOTING: "bg-green-100 text-green-800",
    CLOSED: "bg-red-100 text-red-800"
  };
  
  const labels = {
    DRAFT: "Brouillon",
    COUNCIL_REVIEW: "En Conseil",
    ARGUMENTATION: "Argumentaire",
    VOTING: "Vote Ouvert",
    CLOSED: "Clos"
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ user, proposals, onSelectProposal, onCreateProposal, onEditProposal }) => {
  // Citizens only see VOTING proposals. Officials see everything.
  const visibleProposals = proposals.filter(p => 
    user.role === 'OFFICIAL' || p.status === 'VOTING'
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {user.role === 'OFFICIAL' ? 'Pilotage des Consultations' : 'Consultations en cours'}
          </h2>
          <p className="text-slate-500">
            {user.role === 'OFFICIAL' 
              ? 'Gérez le cycle de vie des propositions municipales.' 
              : 'Votre municipalité sollicite votre avis. Participez aux décisions locales.'}
          </p>
        </div>
        
        {user.role === 'OFFICIAL' && onCreateProposal && (
          <button 
            onClick={onCreateProposal}
            className="bg-marianne-red text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-red-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Nouvelle Proposition
          </button>
        )}
      </div>
      
      {visibleProposals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <p className="text-gray-500">Aucune consultation active pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleProposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full relative">
              <div className="h-48 overflow-hidden bg-gray-200 relative">
                 <img src={proposal.imageUrl} alt={proposal.title} className="w-full h-full object-cover" />
                 <div className="absolute top-2 right-2">
                    <StatusBadge status={proposal.status} />
                 </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-2">
                   <h3 className="text-xl font-bold text-slate-900 leading-tight">{proposal.title}</h3>
                </div>
                <p className="text-slate-500 text-sm mb-4 flex-1">{proposal.summary ? proposal.summary.substring(0, 100) + '...' : 'Description en attente'}</p>
                
                <div className="flex items-center text-sm text-gray-500 font-medium mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Fin: {new Date(proposal.deadline).toLocaleDateString('fr-FR')}
                </div>

                {user.role === 'OFFICIAL' ? (
                  <button 
                    onClick={() => onEditProposal && onEditProposal(proposal)}
                    className="w-full bg-slate-100 text-slate-700 border border-slate-300 py-2 px-4 rounded-lg font-medium hover:bg-white transition-colors"
                  >
                    Gérer / Éditer
                  </button>
                ) : (
                  <button 
                    onClick={() => onSelectProposal(proposal)}
                    className="w-full bg-slate-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-700 transition-colors"
                  >
                    Participer au vote
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
