/**
 * Clinical Calculator of Etiological Subtype of Ischemic Stroke (TOAST 2.0 & OCSP)
 * Main Application Component
 */

import React, { useState, useEffect } from 'react';
import { PatientData, CalculationResult, ClinicalCasePreset } from './types';
import { calculateStrokeSubtypes } from './utils/calculator';
import { Header } from './components/Header';
import { Step1Demographics } from './components/WizardSteps/Step1Demographics';
import { Step2OnsetSeverity } from './components/WizardSteps/Step2OnsetSeverity';
import { Step3OCSPDeficits } from './components/WizardSteps/Step3OCSPDeficits';
import { Step4Hemodynamics } from './components/WizardSteps/Step4Hemodynamics';
import { Step5Imaging } from './components/WizardSteps/Step5Imaging';
import { ResultsView } from './components/ResultsView';
import { NIHSSModal } from './components/NIHSSModal';
import { ReportModal } from './components/ReportModal';
import { ReferenceModal } from './components/ReferenceModal';
import { SavedCasesModal, SavedCaseEntry } from './components/SavedCasesModal';
import {
  User,
  Clock,
  Brain,
  Activity,
  FileScan,
  ChevronRight,
  ChevronLeft,
  Calculator,
  CheckCircle2,
  Sparkles,
  FileText
} from 'lucide-react';

const DEFAULT_PATIENT_DATA: PatientData = {
  patientName: '',
  age: 65,
  gender: 'male',
  hypertension: true,
  coronaryHeartDisease: false,
  diabetesMellitus: false,
  chfOrPostMI: false,
  previousStrokeOrTIA: false,
  previousStrokeWithin1Month: false,
  previousICH: false,
  previousICHWithin1Year: false,
  recentSTEMIwithin7days: false,

  targetVesselStenosisNascet: 0,
  plaqueUlcerationOrThrombus: false,
  amaurosisFugaxOrTIAinTargetVesselLastMonth: false,
  watershedInfarctPattern: false,
  acuteArterialOcclusionOrSubocclusion: false,
  contralateralArteryDisease: false,

  highRiskCardiacSources: [],
  lowRiskCardiacSources: [],
  systemicEmbolism: false,
  bihemisphericAcuteInfarcts: false,

  lacunarDiameterUnder20mm: false,
  stereotypicTIAsLastWeek: false,
  pureMotorStroke: false,
  pureSensoryStroke: false,
  sensorimotorStroke: false,
  ataxicHemiparesis: false,
  dysarthriaClumsyHand: false,

  selectedRareCauses: [],
  dissectionOrSurgeryTemporalLink: false,

  onsetMode: 'sudden',
  onsetTimeHours: 2.0,
  isWakeUpStroke: false,
  nihssScore: 8,
  preStrokeMRS: 0,

  corticalSigns: true,
  hemianopia: false,
  motorDeficit: true,
  sensoryDeficit: true,
  brainstemCerebellarSigns: false,

  systolicBP: 155,
  diastolicBP: 90,
  bpAsymmetry20: false,
  oxygenSaturation: 98,
  temperatureC: 36.6,
  bloodGlucoseMmol: 5.6,
  plateletCountThousand: 220,
  takingDOACwithin12h: false,
  activeBleeding: false,
  intracranialHemorrhageCT: false,

  neuroimagingPerformed: true,
  imagingModality: 'CT',
  aspectScore: 8,
  imagingFocusSize: 'large_territorial',
  infarctDiameterCm: 2.5,
  isMalignantMCASuspected: false,
  isMalignantCerebellarSuspected: false,
  largeVesselOcclusionConfirmed: false,
  occludedArterySegment: 'none',

  estimatedCrCl: 65,
  historyOfGIBleeding: false,
  dyspepsia: false,
  weightKg: 74,
  elevatedLiverEnzymesALT2x: false,
  dysphagiaOrNasogastricTube: false,
  recurrentTIAonAntiplatelets: false,
  multivascularDisease: false
};

const STEP_LABELS = [
  { id: 1, title: 'Анамнез', desc: 'Возраст и ФР', icon: User },
  { id: 2, title: 'Дебют, NIHSS & СКФ', desc: 'Окно, тяжесть, CrCl', icon: Clock },
  { id: 3, title: 'Неврология & OCSP', desc: 'Симптомы и очаг', icon: Brain },
  { id: 4, title: 'Гемодинамика', desc: 'АД, ЭКГ, ЭхоКГ', icon: Activity },
  { id: 5, title: 'КТ / МРТ', desc: 'Нейровизуализация', icon: FileScan }
];

export default function App() {
  const [patientData, setPatientData] = useState<PatientData>(DEFAULT_PATIENT_DATA);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Modals
  const [isNIHSSModalOpen, setIsNIHSSModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState<boolean>(false);
  const [isSavedCasesModalOpen, setIsSavedCasesModalOpen] = useState<boolean>(false);

  // Saved Cases History
  const [savedCases, setSavedCases] = useState<SavedCaseEntry[]>(() => {
    try {
      const stored = localStorage.getItem('stroke_calculator_saved_cases');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('stroke_calculator_saved_cases', JSON.stringify(savedCases));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [savedCases]);

  const handleDataChange = (updated: Partial<PatientData>) => {
    setPatientData((prev) => ({
      ...prev,
      ...updated
    }));
  };

  const handleSelectSamplePreset = (preset: ClinicalCasePreset) => {
    setPatientData(preset.patientData);
    setShowResults(true);
  };

  const handleResetForm = () => {
    setPatientData(DEFAULT_PATIENT_DATA);
    setActiveStep(1);
    setShowResults(false);
  };

  const handleSaveCurrentCase = () => {
    const newEntry: SavedCaseEntry = {
      id: Date.now().toString(),
      patientName: patientData.patientName || `Пациент ${patientData.age} лет`,
      savedAt: new Date().toLocaleString('ru-RU'),
      data: patientData
    };
    setSavedCases((prev) => [newEntry, ...prev]);
    alert('Карта пациента успешно сохранена в локальный архив!');
  };

  const handleDeleteSavedCase = (id: string) => {
    setSavedCases((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllSavedCases = () => {
    if (confirm('Очистить всю историю сохраненных карт?')) {
      setSavedCases([]);
    }
  };

  const calculationResult: CalculationResult = calculateStrokeSubtypes(patientData);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Header Bar */}
      <Header
        onSelectSampleCase={handleSelectSamplePreset}
        onOpenSavedCases={() => setIsSavedCasesModalOpen(true)}
        onOpenReference={() => setIsReferenceModalOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
        onReset={handleResetForm}
        activeStep={activeStep}
        totalSteps={5}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Wizard Stepper Bar (if not directly showing full results) */}
        {!showResults && (
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {STEP_LABELS.map((step) => {
                const isActive = activeStep === step.id;
                const isCompleted = activeStep > step.id;
                const IconComponent = step.icon;

                return (
                  <button
                    key={step.id}
                    id={`step-tab-${step.id}`}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className={`p-2 sm:p-3 rounded-xl transition text-left flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-3 border ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/20'
                        : isCompleted
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'bg-transparent border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="hidden md:block">
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {step.id}. {step.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {step.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Body Content */}
        {showResults ? (
          <ResultsView
            result={calculationResult}
            patientData={patientData}
            onEditInputs={() => setShowResults(false)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSaveCase={handleSaveCurrentCase}
          />
        ) : (
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            
            {/* Active Step Component */}
            {activeStep === 1 && (
              <Step1Demographics data={patientData} onChange={handleDataChange} />
            )}

            {activeStep === 2 && (
              <Step2OnsetSeverity
                data={patientData}
                onChange={handleDataChange}
                onOpenNIHSSModal={() => setIsNIHSSModalOpen(true)}
              />
            )}

            {activeStep === 3 && (
              <Step3OCSPDeficits data={patientData} onChange={handleDataChange} />
            )}

            {activeStep === 4 && (
              <Step4Hemodynamics data={patientData} onChange={handleDataChange} />
            )}

            {activeStep === 5 && (
              <Step5Imaging data={patientData} onChange={handleDataChange} />
            )}

            {/* Stepper Navigation Footer */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              
              {activeStep > 1 ? (
                <button
                  id="wizard-prev-step-btn"
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition flex items-center space-x-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Назад</span>
                </button>
              ) : <div />}

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
                {/* Instant Calculation Shortcut Button */}
                <button
                  id="instant-calculate-btn"
                  type="button"
                  onClick={() => setShowResults(true)}
                  className="px-3.5 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 transition flex items-center space-x-1.5"
                  title="Показать шкалы, вероятности подтипов и аналитику"
                >
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">Аналитика</span>
                  <span className="sm:hidden">Расчет</span>
                </button>

                {/* Direct Conclusion / Report Modal Button */}
                <button
                  id="wizard-open-report-btn"
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-100 transition flex items-center space-x-1.5"
                  title="Открыть официальное медицинское заключение (Протокол МЗ РБ № 1)"
                >
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Заключение</span>
                </button>

                {activeStep < 5 ? (
                  <button
                    id="wizard-next-step-btn"
                    type="button"
                    onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition flex items-center space-x-1.5"
                  >
                    <span>Далее</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="wizard-finish-btn"
                    type="button"
                    onClick={() => {
                      setShowResults(true);
                      setIsReportModalOpen(true);
                    }}
                    className="px-5 sm:px-6 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Сформировать и открыть заключение</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto space-y-1">
          <p className="font-medium">
            Веб-приложение «Клинический калькулятор этиологического подтипа ишемического инсульта» v2.0 (TOAST + OCSP)
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-3xl mx-auto">
            Предназначено для врачей-неврологов, анестезиологов-реаниматологов и специалистов сосудистых центров. Носит вспомогательный консультативный характер и не заменяет врачебного консилиума.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <NIHSSModal
        isOpen={isNIHSSModalOpen}
        onClose={() => setIsNIHSSModalOpen(false)}
        currentScore={patientData.nihssScore}
        onApplyScore={(score) => handleDataChange({ nihssScore: score })}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        result={calculationResult}
        patientData={patientData}
      />

      <ReferenceModal
        isOpen={isReferenceModalOpen}
        onClose={() => setIsReferenceModalOpen(false)}
      />

      <SavedCasesModal
        isOpen={isSavedCasesModalOpen}
        onClose={() => setIsSavedCasesModalOpen(false)}
        savedCases={savedCases}
        onLoadCase={(data) => {
          setPatientData(data);
          setShowResults(true);
        }}
        onDeleteCase={handleDeleteSavedCase}
        onClearAll={handleClearAllSavedCases}
      />

    </div>
  );
}
