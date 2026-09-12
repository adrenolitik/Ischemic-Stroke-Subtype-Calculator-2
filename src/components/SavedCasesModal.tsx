import React from 'react';
import { PatientData } from '../types';
import { X, Bookmark, Trash2, FolderOpen, RotateCcw } from 'lucide-react';

export interface SavedCaseEntry {
  id: string;
  patientName: string;
  savedAt: string;
  data: PatientData;
}

interface SavedCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCases: SavedCaseEntry[];
  onLoadCase: (data: PatientData) => void;
  onDeleteCase: (id: string) => void;
  onClearAll: () => void;
}

export const SavedCasesModal: React.FC<SavedCasesModalProps> = ({
  isOpen,
  onClose,
  savedCases,
  onLoadCase,
  onDeleteCase,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-purple-600 text-white rounded-xl">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Сохраненные карты пациентов
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Локальный архив прошлых расчетов
              </p>
            </div>
          </div>

          <button
            id="close-saved-cases-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {savedCases.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <FolderOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Сохраненных карт пока нет.
              </p>
              <p className="text-xs text-slate-400">
                После расчета нажмите «Сохранить карту», чтобы зафиксировать пациента в локальном архиве.
              </p>
            </div>
          ) : (
            savedCases.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-purple-300 transition"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.patientName || 'Пациент без имени'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Возраст: {item.data.age} лет | Балл NIHSS: {item.data.nihssScore} | Сохранено: {item.savedAt}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadCase(item.data);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                  >
                    Загрузить
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteCase(item.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition"
                    title="Удалить карту"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedCases.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex items-center justify-between">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-medium text-rose-600 hover:underline"
            >
              Очистить всю историю
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition"
            >
              Закрыть
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
