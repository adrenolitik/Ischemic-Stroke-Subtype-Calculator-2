import React from 'react';
import {
  Activity,
  FileText,
  Bookmark,
  BookOpen,
  RotateCcw,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { ClinicalCasePreset } from '../types';
import { SAMPLE_CLINICAL_CASES } from '../data/sampleCases';

interface HeaderProps {
  onSelectSampleCase: (preset: ClinicalCasePreset) => void;
  onOpenSavedCases: () => void;
  onOpenReference: () => void;
  onOpenReport: () => void;
  onReset: () => void;
  activeStep: number;
  totalSteps: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectSampleCase,
  onOpenSavedCases,
  onOpenReference,
  onOpenReport,
  onReset,
  activeStep,
  totalSteps
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-xl shadow-sm flex items-center justify-center">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Клинический калькулятор инсульта
                </h1>
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
                  v2.0 • МЗ РБ № 1 (05.01.2026)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                TOAST 2.0, OCSP, ESUS, реперфузия (ТЛТ / ВСТЭ), выбор ПОАК и вторичная профилактика
              </p>
            </div>
          </div>

          {/* Action Buttons & Sample Cases */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Sample Case Selector */}
            <div className="relative group">
              <button
                id="sample-cases-dropdown-btn"
                type="button"
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Тестовые клинические примеры</span>
              </button>

              <div className="absolute right-0 mt-1 w-72 sm:w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 hidden group-hover:block z-50 transition-all">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Выберите готовую клиническую модель:
                </div>
                {SAMPLE_CLINICAL_CASES.map((preset) => (
                  <button
                    key={preset.id}
                    id={`preset-${preset.id}`}
                    type="button"
                    onClick={() => onSelectSampleCase(preset)}
                    className="w-full text-left px-3.5 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors border-b last:border-0 border-slate-100 dark:border-slate-700/50"
                  >
                    <div className="text-xs font-medium text-slate-900 dark:text-white">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {preset.shortDesc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conclusion / Report Button */}
            <button
              id="header-open-report-btn"
              type="button"
              onClick={onOpenReport}
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition shadow-xs flex items-center space-x-1.5"
              title="Открыть медицинское заключение (Протокол МЗ РБ № 1)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Заключение</span>
            </button>

            {/* Reference Manual Button */}
            <button
              id="open-reference-manual-btn"
              type="button"
              onClick={onOpenReference}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
              title="Справочное руководство по TOAST и OCSP"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Справочник</span>
            </button>

            {/* Saved Cases */}
            <button
              id="open-saved-cases-btn"
              type="button"
              onClick={onOpenSavedCases}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
              title="История сохраненных расчетов"
            >
              <Bookmark className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">История</span>
            </button>

            {/* Reset Form */}
            <button
              id="reset-form-btn"
              type="button"
              onClick={onReset}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Сбросить все поля"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
