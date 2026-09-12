import React from 'react';
import { CalculationResult, PatientData } from '../types';
import {
  Award,
  BarChart3,
  Brain,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  HeartPulse,
  Info,
  Printer,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  BookmarkPlus,
  Flame,
  AlertTriangle,
  Clock,
  Droplet,
  Pill,
  Sparkles,
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';

interface ResultsViewProps {
  result: CalculationResult;
  patientData: PatientData;
  onEditInputs: () => void;
  onOpenReportModal: () => void;
  onSaveCase: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  patientData,
  onEditInputs,
  onOpenReportModal,
  onSaveCase
}) => {
  const {
    dominantSubtype,
    confidenceLevelRu,
    confidenceDescriptionRu,
    toastSubtypes,
    ocspResult,
    contributingPredictors,
    recommendations,
    reperfusion,
    antithromboticPlan,
    malignantAlert,
    abcd2Score,
    hasBledScore
  } = result;

  return (
    <div className="space-y-6">
      
      {/* 1. Malignant Stroke Emergency Banner (If active) */}
      {malignantAlert.isSuspected && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-600 text-white shadow-lg space-y-2 border-2 border-rose-700 animate-pulse">
          <div className="flex items-center space-x-3">
            <Flame className="w-6 h-6 shrink-0" />
            <div className="text-base sm:text-lg font-black uppercase tracking-wide">
              {malignantAlert.alertTitle}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
            {malignantAlert.urgencyRationale}
          </p>
          <div className="pt-2 border-t border-rose-500/80 flex flex-wrap items-center justify-between text-xs font-semibold text-rose-100">
            <span>Рекомендация консилиума: {malignantAlert.actionPlan}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">Протокол МЗ РБ № 1, п. 17, 44</span>
          </div>
        </div>
      )}

      {/* 2. Dominant Subtype Highlight Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${dominantSubtype.bgColor} ${dominantSubtype.borderColor} shadow-xs`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-white/90 dark:bg-slate-900/90 shadow-xs border border-slate-200 dark:border-slate-700">
                TOAST: {dominantSubtype.code}
              </span>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${ocspResult.badgeBg}`}>
                OCSP: {ocspResult.key}
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                {confidenceLevelRu}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                NIHSS: {patientData.nihssScore} баллов
              </span>
            </div>

            <h2 className={`text-2xl sm:text-3xl font-black ${dominantSubtype.color}`}>
              {dominantSubtype.nameRu}
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
              {dominantSubtype.description}
            </p>

            <p className="text-xs italic text-slate-500 dark:text-slate-400">
              {confidenceDescriptionRu}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 self-start lg:self-center shrink-0">
            <button
              id="save-case-btn"
              type="button"
              onClick={onSaveCase}
              className="px-3.5 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/60 shadow-xs transition flex items-center space-x-1.5"
            >
              <BookmarkPlus className="w-4 h-4 text-purple-600" />
              <span>Сохранить в архив</span>
            </button>

            <button
              id="open-report-btn"
              type="button"
              onClick={onOpenReportModal}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Печать / Протокол МЗ РБ</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. Reperfusion Therapy (IVT & EVT) Decision Engine */}
      <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Оценка кандидатуры на реперфузионную терапию (ТЛТ / ВСТЭ, п. 27–38)</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Окно: {patientData.onsetTimeHours} ч. {patientData.isWakeUpStroke ? '(Wake-up)' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IVT Assessment */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            reperfusion.ivtEligible
              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  1. Системный тромболизис (ТЛТ, алтеплаза)
                </span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  reperfusion.ivtEligible
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                }`}>
                  {reperfusion.ivtEligible ? 'ПОКАЗАН' : 'НЕ ПОКАЗАН / ПРОТИВОПОКАЗАН'}
                </span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300">
                <strong>Статус терапевтического окна:</strong> {reperfusion.ivtWindowStatus}
              </div>

              {reperfusion.ivtContraindications.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 text-xs text-rose-700 dark:text-rose-400 space-y-1">
                  <span className="font-bold">Выявленные противопоказания / ограничения:</span>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5">
                    {reperfusion.ivtContraindications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {reperfusion.ivtEligible && (
              <div className="mt-3 p-2 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-200 font-medium">
                Режим: Алтеплаза 0.9 мг/кг (макс. 90 мг), 10% болюс за 1 мин, 90% в/в капельно 60 мин. Контроль АД &lt; 180/105 мм рт. ст. (п. 27–28).
              </div>
            )}
          </div>

          {/* EVT Assessment */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            reperfusion.evtEligible
              ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800'
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  2. Внутрисосудистая тромбэкстракция (ВСТЭ)
                </span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  reperfusion.evtEligible
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {reperfusion.evtEligible ? 'ПОКАЗАНА' : 'НЕ ПОКАЗАНА'}
                </span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300">
                <strong>Статус окна:</strong> {reperfusion.evtWindowStatus}
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300">
                <strong>Анатомический статус:</strong> {patientData.largeVesselOcclusionConfirmed ? `Окклюзия ${patientData.occludedArterySegment} (ASPECT: ${patientData.aspectScore}/10)` : 'Крупная окклюзия не подтверждена'}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {reperfusion.evtRationale}
              </p>
            </div>

            {reperfusion.evtEligible && (
              <div className="mt-3 p-2 rounded-lg bg-purple-100/60 dark:bg-purple-900/40 text-[11px] text-purple-900 dark:text-purple-200 font-medium">
                Рекомендована экстренная доставка в ангиографическую операционную. Проведение ТЛТ не задерживает выполнение ВСТЭ (п. 30).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Precision Antithrombotic Plan & DOAC Selection (Item 43, App 14) */}
      <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-4 h-4 text-blue-600" />
            <span>Персонализированный антитромботический протокол (п. 43, Приложения 14 и 15)</span>
          </h3>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {antithromboticPlan.strategy === 'OAC' ? 'Антикоагулянтная стратегия' : 'Антиагрегантная стратегия'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Timing / Start Day */}
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-2">
            <span className="text-xs font-bold text-blue-950 dark:text-blue-300 uppercase tracking-wider block">
              1. Срок старта / возобновления
            </span>
            <div className="text-base font-extrabold text-blue-900 dark:text-blue-100">
              {antithromboticPlan.timingDay}
            </div>
            <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
              {antithromboticPlan.timingRationale}
            </p>
          </div>

          {/* Regimen & Dosing */}
          <div className="p-4 bg-purple-50/60 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-900/50 space-y-2">
            <span className="text-xs font-bold text-purple-950 dark:text-purple-300 uppercase tracking-wider block">
              2. Препарат и режим дозирования
            </span>
            <div className="text-sm font-extrabold text-purple-900 dark:text-purple-100">
              {antithromboticPlan.primaryRegimen}
            </div>
            <p className="text-xs text-purple-800/80 dark:text-purple-300/80 leading-relaxed">
              {antithromboticPlan.dosingDetails}
            </p>
          </div>

          {/* Duration & Follow-up */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                3. Длительность и безопасность
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {antithromboticPlan.duration}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {antithromboticPlan.safetyNotes}
              </p>
            </div>

            {antithromboticPlan.alternativeRegimen && (
              <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                <strong>Альтернатива:</strong> {antithromboticPlan.alternativeRegimen}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Clinical Scores Strip (ABCD2 & HAS-BLED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ABCD2 */}
        <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Шкала риска повторного инсульта ABCD² (п. 20)
            </span>
            <span className="text-xs text-slate-500">
              Стратификация риска раннего повторного инсульта после ТИА
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {abcd2Score.score}
            </span>
            <span className="text-xs text-slate-400"> / 7</span>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {abcd2Score.riskCategory} риск
            </div>
          </div>
        </div>

        {/* HAS-BLED */}
        <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Шкала риска кровотечений HAS-BLED (Приложение 13)
            </span>
            <span className="text-xs text-slate-500">
              Оценка риска геморрагических осложнений при ОАК
            </span>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black ${hasBledScore.score >= 3 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {hasBledScore.score}
            </span>
            <span className="text-xs text-slate-400"> / 9</span>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {hasBledScore.riskLevel} риск
            </div>
          </div>
        </div>
      </div>

      {/* 6. Subtype Probability Spectrum */}
      <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Вероятностный спектр этиологических подтипов (TOAST 2.0)</span>
          </h3>
          <span className="text-xs text-slate-500">Автоматический взвешенный расчет баллов</span>
        </div>

        <div className="space-y-3.5">
          {toastSubtypes.map((sub) => {
            const isTop = sub.key === dominantSubtype.key;
            return (
              <div key={sub.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={`flex items-center gap-2 ${isTop ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                    <span>{sub.key === 'atherothrombotic' ? 'LAA: Атеротромботический (крупные артерии)' : sub.key === 'cardioembolic' ? 'CE: Кардиоэмболический' : sub.key === 'lacunar' ? 'SVO: Лакунарный (церебральная микроангиопатия)' : sub.key === 'other' ? 'ODE: Другой установленной этиологии' : 'UDE: Неопределенной этиологии (в т.ч. ESUS)'}</span>
                    {isTop && (
                      <span className="px-1.5 py-0.2 text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                        Ведущий подтип
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                    {sub.score} баллов ({sub.percentage}%)
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      sub.key === 'atherothrombotic'
                        ? 'bg-amber-500'
                        : sub.key === 'cardioembolic'
                        ? 'bg-rose-500'
                        : sub.key === 'lacunar'
                        ? 'bg-blue-500'
                        : sub.key === 'other'
                        ? 'bg-purple-500'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.max(4, sub.percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Predictor Matrix Table */}
      <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Матрица учтенных клинико-диагностических предикторов</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="p-2.5">Предиктор / Фактор риска</th>
                <th className="p-2.5">Параметр у пациента</th>
                <th className="p-2.5 text-center">Баллы</th>
                <th className="p-2.5">Подтипы-реципиенты</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {contributingPredictors.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-2.5 font-medium">{item.predictorName}</td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-300">{item.valueDescription}</td>
                  <td className="p-2.5 text-center font-bold text-blue-600 dark:text-blue-400">
                    +{item.pointsAdded}
                  </td>
                  <td className="p-2.5">
                    <div className="flex flex-wrap gap-1">
                      {item.subtypesAffected.map((st) => (
                        <span
                          key={st}
                          className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        >
                          {st === 'atherothrombotic'
                            ? 'LAA'
                            : st === 'cardioembolic'
                            ? 'CE'
                            : st === 'lacunar'
                            ? 'SVO'
                            : st === 'other'
                            ? 'ODE'
                            : 'UDE'}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. Comprehensive Clinical Recommendations */}
      <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-3">
          <Stethoscope className="w-4 h-4 text-blue-600" />
          <span>План вторичной профилактики и обследования (Протокол МЗ РБ № 1)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-1">
            <div className="text-xs font-bold text-blue-950 dark:text-blue-300 uppercase tracking-wider">
              1. Антитромботическая терапия
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {recommendations.antithrombotic}
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-1">
            <div className="text-xs font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider">
              2. Гиполипидемическая терапия
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {recommendations.lipidTherapy}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              3. Контроль артериального давления
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {recommendations.bpControl}
            </p>
          </div>

          <div className="p-3.5 bg-purple-50/60 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-900/60 space-y-1">
            <div className="text-xs font-bold text-purple-950 dark:text-purple-300 uppercase tracking-wider">
              4. План диагностического дообследования
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1">
              {recommendations.furtherWorkup.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {recommendations.surgicalOrInterventional && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 font-medium">
            <strong>Хирургические / Интервенционные рекомендации:</strong> {recommendations.surgicalOrInterventional}
          </div>
        )}
      </div>

      {/* Edit Inputs Link */}
      <div className="text-center pt-2">
        <button
          id="back-to-wizard-btn"
          type="button"
          onClick={onEditInputs}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Вернуться к редактированию введенных параметров пациента
        </button>
      </div>

    </div>
  );
};
