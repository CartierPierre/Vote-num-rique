
import React, { useState } from 'react';
import { Proposal, AppStep, User, VoteType, UserRole } from './types';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ProposalReader } from './components/ProposalReader';
import { QuizModule } from './components/QuizModule';
import { VoteInterface } from './components/VoteInterface';
import { OfficialWorkspace } from './components/OfficialWorkspace';

// Hardcoded initial data
const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop_001',
    title: "Extension du réseau de chaleur rue de la République",
    location: "Secteur Centre-Ville",
    deadline: "2023-11-30",
    status: 'VOTING',
    // Static image: Urban construction/pipes
    imageUrl: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80",
    summary: "Le projet consiste à raccorder 500 logements supplémentaires au réseau de chaleur urbain existant via une extension des canalisations sur 1,2km le long de la rue de la République. L'énergie proviendra principalement de la valorisation des déchets de l'usine d'incinération locale.",
    pros: [
      "Réduction de l'empreinte carbone estimée à 30% sur le long terme par rapport au gaz.",
      "Stabilité des prix de l'énergie décorrélée des cours mondiaux du pétrole.",
      "Suppression des chaudières individuelles vétustes."
    ],
    cons: [
      "Augmentation estimée des charges de copropriété de 15€/mois pour l'abonnement.",
      "Coût des travaux de voirie très élevé (2.5M€) impactant le budget municipal.",
      "Nuisances sonores et de circulation pendant les 3 mois de travaux."
    ]
  },
  {
    id: 'prop_002',
    title: "Piétonisation de la Place du Marché le dimanche",
    location: "Quartier Sud",
    deadline: "2023-12-15",
    status: 'VOTING',
    // Static image: Market
    imageUrl: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=800&q=80",
    summary: "Interdiction totale de la circulation automobile tous les dimanches de 8h à 20h pour favoriser les commerces de bouche et les activités familiales.",
    pros: ["Sécurité des piétons", "Réduction du bruit", "Convivialité"],
    cons: ["Report de trafic sur les rues adjacentes", "Accès difficile pour les livraisons"]
  }
];

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [voteChoice, setVoteChoice] = useState<VoteType>(null);

  const handleLogin = (role: UserRole) => {
    setUser({ 
      name: role === 'OFFICIAL' ? "Maire Adjoint" : "Jean Dupont", 
      role: role,
      franceConnectId: role === 'OFFICIAL' ? "elu_007" : "fc_123456" 
    });
    setStep(AppStep.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedProposal(null);
    setVoteChoice(null);
    setStep(AppStep.LOGIN);
  };

  const handleCreateProposal = () => {
    const newProposal: Proposal = {
      id: `prop_${Date.now()}`,
      title: "Nouvelle Proposition Municipale",
      location: "À définir",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'DRAFT',
      // Static image: Park/Vegetation for the scenario
      imageUrl: "https://images.unsplash.com/photo-1459259191495-52eccde892c7?auto=format&fit=crop&w=800&q=80",
      summary: "",
      pros: [],
      cons: []
    };
    setProposals([...proposals, newProposal]);
    setSelectedProposal(newProposal);
    setStep(AppStep.OFFICIAL_WORKSPACE);
  };

  const handleEditProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setStep(AppStep.OFFICIAL_WORKSPACE);
  };

  const handleUpdateProposal = (updatedProposal: Proposal) => {
    setProposals(proposals.map(p => p.id === updatedProposal.id ? updatedProposal : p));
    setSelectedProposal(updatedProposal);
  };

  const handleSelectProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setStep(AppStep.READING);
  };

  const handleFinishReading = () => {
    setStep(AppStep.QUIZ);
  };

  const handleQuizSuccess = () => {
    setStep(AppStep.VOTING);
  };

  const handleQuizFailure = () => {
    alert("Vous n'avez pas validé le test de connaissances. Veuillez relire attentivement la proposition.");
    setStep(AppStep.READING);
  };

  const handleVote = (choice: VoteType) => {
    setVoteChoice(choice);
    setStep(AppStep.CONFIRMATION);
  };

  const handleBackToDashboard = () => {
    setSelectedProposal(null);
    setVoteChoice(null);
    setStep(AppStep.DASHBOARD);
  };

  // --- Render Header ---
  const renderHeader = () => (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => user && handleBackToDashboard()}>
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-slate-800 tracking-tight">
                <span className="text-marianne-blue">Civic</span>
                <span className="text-marianne-red">Verify</span>
              </span>
            </div>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${user.role === 'OFFICIAL' ? 'bg-marianne-red text-white' : 'bg-blue-100 text-blue-800'}`}>
                {user.role === 'OFFICIAL' ? 'ÉLU' : 'CITOYEN'}
              </span>
              <div className="text-right hidden sm:block">
                 <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                 <div className="text-xs text-gray-500">Connecté</div>
              </div>
              <button
                  onClick={handleLogout}
                  className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Se déconnecter"
              >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Progress Bar for Citizen Flow */}
      {user?.role === 'CITIZEN' && selectedProposal && step !== AppStep.CONFIRMATION && step !== AppStep.DASHBOARD && (
        <div className="bg-gray-50 border-b">
            <div className="max-w-3xl mx-auto flex justify-between px-4 py-2 text-xs font-medium text-gray-400">
                <span className={step === AppStep.READING ? 'text-marianne-blue' : ''}>1. Lecture</span>
                <span className={step === AppStep.QUIZ ? 'text-marianne-blue' : ''}>2. Vérification</span>
                <span className={step === AppStep.VOTING ? 'text-marianne-blue' : ''}>3. Vote</span>
            </div>
            <div className="h-1 w-full bg-gray-200">
                <div 
                    className="h-full bg-marianne-blue transition-all duration-500 ease-in-out" 
                    style={{ width: step === AppStep.READING ? '33%' : step === AppStep.QUIZ ? '66%' : '100%' }}
                ></div>
            </div>
        </div>
      )}
    </header>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {step !== AppStep.LOGIN && renderHeader()}

      <main className="flex-grow">
        {step === AppStep.LOGIN && (
          <Login onLogin={handleLogin} />
        )}

        {step === AppStep.DASHBOARD && user && (
          <div className="py-10">
             <Dashboard 
               user={user}
               proposals={proposals} 
               onSelectProposal={handleSelectProposal} 
               onCreateProposal={handleCreateProposal}
               onEditProposal={handleEditProposal}
             />
          </div>
        )}

        {step === AppStep.OFFICIAL_WORKSPACE && selectedProposal && (
          <div className="py-10 px-4">
            <OfficialWorkspace 
               proposal={selectedProposal} 
               onUpdate={handleUpdateProposal} 
               onBack={handleBackToDashboard}
            />
          </div>
        )}

        {step === AppStep.READING && selectedProposal && (
          <div className="py-10 px-4">
            <ProposalReader proposal={selectedProposal} onFinishReading={handleFinishReading} />
          </div>
        )}

        {step === AppStep.QUIZ && selectedProposal && (
          <div className="py-10 px-4">
            <QuizModule 
                proposal={selectedProposal} 
                onSuccess={handleQuizSuccess} 
                onFailure={handleQuizFailure} 
            />
          </div>
        )}

        {step === AppStep.VOTING && selectedProposal && (
          <div className="py-10 px-4">
            <VoteInterface proposal={selectedProposal} onVote={handleVote} />
          </div>
        )}

        {step === AppStep.CONFIRMATION && (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                         <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">A voté !</h2>
                    <p className="text-gray-600 mb-6">
                        Votre vote <span className="font-bold text-slate-900">{voteChoice === 'FOR' ? 'POUR' : voteChoice === 'AGAINST' ? 'CONTRE' : 'ABSTENTION'}</span> a bien été enregistré dans la blockchain municipale.
                    </p>
                    <button 
                        onClick={handleBackToDashboard}
                        className="text-marianne-blue font-medium hover:underline"
                    >
                        Retour aux consultations
                    </button>
                </div>
            </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2024 CivicVerify - Initiative de transparence démocratique.</p>
          <p className="mt-2 text-xs text-slate-600">Données protégées. Conformité RGPD.</p>
        </div>
      </footer>
    </div>
  );
}
