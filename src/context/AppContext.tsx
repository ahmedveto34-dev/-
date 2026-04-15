import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Evaluation } from '../data/checklist';
import { gasApi } from '../services/gasService';

interface Policy {
  id: string;
  name: string;
  date: string;
}

export interface ArchivedReport {
  id: string;
  date: string;
  time: string;
  inspectorName: string;
  compliancePercentage: number;
  items: {
    id: string;
    departmentName: string;
    text: string;
    negatedText: string;
    correctiveAction: string;
  }[];
}

interface AppState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  evaluations: Record<string, Evaluation>;
  setEvaluation: (itemId: string, evalValue: Evaluation) => void;
  correctiveActions: Record<string, string>;
  setCorrectiveAction: (itemId: string, action: string) => void;
  reportDate: string;
  setReportDate: (date: string) => void;
  reportTime: string;
  setReportTime: (time: string) => void;
  inspectorName: string;
  setInspectorName: (name: string) => void;
  policies: Policy[];
  addPolicy: (name: string) => void;
  addPolicies: (names: string[]) => void;
  removePolicy: (id: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  customObservations: { id: string; text: string; departmentId: string }[];
  addCustomObservation: (text: string, departmentId: string) => void;
  removeCustomObservation: (id: string) => void;
  archives: ArchivedReport[];
  saveToArchive: (report: ArchivedReport) => void;
  resetReport: () => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('checklist');
  const [evaluations, setEvaluations] = useState<Record<string, Evaluation>>({});
  const [correctiveActions, setCorrectiveActions] = useState<Record<string, string>>({});
  
  // Safe date initialization
  const getInitialDate = () => {
    try {
      return new Date().toISOString().split('T')[0];
    } catch (e) {
      return '2024-01-01';
    }
  };
  
  const getInitialTime = () => {
    try {
      return new Date().toTimeString().slice(0, 5);
    } catch (e) {
      return '09:00';
    }
  };

  const [reportDate, setReportDate] = useState(getInitialDate());
  const [reportTime, setReportTime] = useState(getInitialTime());
  const [inspectorName, setInspectorName] = useState('');
  const [policies, setPolicies] = useState<Policy[]>(() => {
    try {
      const saved = localStorage.getItem('ic_policies');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [archives, setArchives] = useState<ArchivedReport[]>(() => {
    try {
      const saved = localStorage.getItem('ic_archives');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [customObservations, setCustomObservations] = useState<{ id: string; text: string; departmentId: string }[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('ic_policies', JSON.stringify(policies));
    // Save policies to Google Sheets via external API
    gasApi('savePolicies', { policies });
  }, [policies]);

  React.useEffect(() => {
    localStorage.setItem('ic_archives', JSON.stringify(archives));
  }, [archives]);

  // Load data from Google Sheets on mount
  React.useEffect(() => {
    const loadData = async () => {
      const policiesRes = await gasApi('loadPolicies');
      if (policiesRes && policiesRes.policies && policiesRes.policies.length > 0) {
        setPolicies(policiesRes.policies);
      }

      const archivesRes = await gasApi('loadArchives');
      if (archivesRes && archivesRes.archives && archivesRes.archives.length > 0) {
        setArchives(archivesRes.archives);
      }
    };
    
    loadData();
  }, []);

  const setEvaluation = (itemId: string, evalValue: Evaluation) => {
    setEvaluations((prev) => ({ ...prev, [itemId]: evalValue }));
  };

  const setCorrectiveAction = (itemId: string, action: string) => {
    setCorrectiveActions((prev) => ({ ...prev, [itemId]: action }));
  };

  const addPolicy = (name: string) => {
    setPolicies(prev => [...prev, { id: Date.now().toString() + Math.random().toString(), name, date: new Date().toLocaleDateString('ar-EG') }]);
  };

  const addPolicies = (names: string[]) => {
    const newPolicies = names.map((name, index) => ({
      id: Date.now().toString() + index + Math.random().toString(),
      name,
      date: new Date().toLocaleDateString('ar-EG')
    }));
    setPolicies(prev => [...prev, ...newPolicies]);
  };

  const removePolicy = (id: string) => {
    setPolicies(prev => prev.filter(p => p.id !== id));
    showToast('تم حذف السياسة بنجاح');
  };

  // Expose to window for easy access from components if needed
  React.useEffect(() => {
    (window as any).removePolicy = removePolicy;
  }, [policies]);

  const addCustomObservation = (text: string, departmentId: string) => {
    const newObs = { id: `custom-${Date.now()}`, text, departmentId };
    setCustomObservations(prev => [...prev, newObs]);
    setEvaluations(prev => ({ ...prev, [newObs.id]: 'not_met' }));
  };

  const removeCustomObservation = (id: string) => {
    setCustomObservations(prev => prev.filter(obs => obs.id !== id));
    setEvaluations(prev => {
      const newEvals = { ...prev };
      delete newEvals[id];
      return newEvals;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveToArchive = async (report: ArchivedReport) => {
    setArchives(prev => [report, ...prev]);
    // Save archive to Google Sheets via external API
    await gasApi('saveArchive', { archive: report });
  };

  const resetReport = () => {
    setEvaluations({});
    setCorrectiveActions({});
    setCustomObservations([]);
    setInspectorName('');
    setReportDate(new Date().toISOString().split('T')[0]);
    setReportTime(new Date().toTimeString().slice(0, 5));
    setActiveTab('checklist');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        evaluations,
        setEvaluation,
        correctiveActions,
        setCorrectiveAction,
        reportDate,
        setReportDate,
        reportTime,
        setReportTime,
        inspectorName,
        setInspectorName,
        policies,
        addPolicy,
        addPolicies,
        removePolicy,
        toastMessage,
        showToast,
        customObservations,
        addCustomObservation,
        removeCustomObservation,
        archives,
        saveToArchive,
        resetReport,
        isAdmin,
        setIsAdmin,
      }}
    >

      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 font-bold border border-slate-700">
          {toastMessage}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};


