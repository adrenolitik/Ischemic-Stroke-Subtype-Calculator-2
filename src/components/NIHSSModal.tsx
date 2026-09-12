import React, { useState } from 'react';
import { NIHSS_DOMAINS } from '../data/nihssData';
import { X, Check, Calculator, AlertCircle, RefreshCw } from 'lucide-react';

interface NIHSSModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  onApplyScore: (score: number) => void;
}

export const NIHSSModal: React.FC<NIHSSModalProps> = ({
  isOpen,
  onClose,
  currentScore,
  onApplyScore
}) => {
  const [domainScores, setDomainScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    NIHSS_DOMAINS.forEach((d) => {
      initial[d.id] = 0;
    });
    return initial;
  });

  if (!isOpen) return null;

  const totalScore = Object.values(domainScores).reduce((acc: number, curr: number) => acc + curr, 0);

  const handleSelect = (domainId: string, val: number) => {
    setDomainScores((prev) => ({
      ...prev,
      [domainId]: val
    }));
  };

  const handleReset = () => {
    const resetObj: Record<string, number> = {};
    NIHSS_DOMAINS.forEach((d) => {
      resetObj[d.id] = 0;
    });
    setDomainScores(resetObj);
  };

  const handleSave = () => {
    onApplyScore(totalScore);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Шкала инсульта NIHSS (National Institutes of Health Stroke Scale)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                11 доменов калибровки тяжести неврологического дефицита
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 rounded-xl border border-purple-200 dark:border-purple-800">
              <span className="text-xs text-purple-700 dark:text-purple-300 block font-medium">Сумма:</span>
              <span className="text-xl font-extrabold">{totalScore} баллов</span>
            </div>

            <button
              id="close-nihss-modal-x"
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {NIHSS_DOMAINS.map((domain, index) => {
            const currentSelected = domainScores[domain.id] ?? 0;
            return (
              <div key={domain.id} className={index > 0 ? 'pt-4' : ''}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {domain.titleRu}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Выбрано: {currentSelected} / {domain.maxScore}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {domain.descriptionRu}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {domain.options.map((opt) => {
                    const isSelected = currentSelected === opt.value;
                    return (
                      <button
                        key={opt.value}
                        id={`nihss-opt-${domain.id}-${opt.value}`}
                        type="button"
                        onClick={() => handleSelect(domain.id, opt.value)}
                        className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between border ${
                          isSelected
                            ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-950 dark:text-purple-200 font-semibold ring-1 ring-purple-500/30'
                            : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{opt.labelRu}</span>
                        {isSelected && <Check className="w-4 h-4 text-purple-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex items-center justify-between">
          <button
            id="reset-nihss-btn"
            type="button"
            onClick={handleReset}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Сбросить баллы</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              id="cancel-nihss-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition"
            >
              Отмена
            </button>
            <button
              id="apply-nihss-score-btn"
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-xl shadow-md transition"
            >
              Применить балл ({totalScore}) в расчет
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
