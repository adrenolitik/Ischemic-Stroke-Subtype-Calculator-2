import React from 'react';
import { CalculationResult, PatientData } from '../types';
import { X, Printer, Copy, Check, FileText } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
  patientData: PatientData;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  result,
  patientData
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const reportText = `
===================================================================
МЕДИЦИНСКОЕ ЗАКЛЮЧЕНИЕ / ВРАЧЕБНЫЙ ПРОТОКОЛ
«Клинический калькулятор этиологического подтипа ишемического инсульта» v2.0
Соответствует Клиническому протоколу МЗ РБ № 1 от 05.01.2026
Дата расчета: ${result.calcDate}
Пациент: ${patientData.patientName || 'Без указания ФИО'} | Возраст: ${patientData.age} лет | Пол: ${patientData.gender === 'male' ? 'Мужской' : 'Женский'}
pre-mRS: ${patientData.preStrokeMRS} | NIHSS: ${patientData.nihssScore} баллов | Время дебюта: ${patientData.onsetTimeHours} ч. ${patientData.isWakeUpStroke ? '(Wake-up)' : ''}
===================================================================

1. ЭТИОЛОГИЧЕСКИЙ ПОДТИП (TOAST 2.0):
   • Ведущий подтип: ${result.dominantSubtype.nameRu} (${result.dominantSubtype.code})
   • Уровень достоверности: ${result.confidenceLevelRu}
   • Обоснование: ${result.confidenceDescriptionRu}
   • Спектр вероятностей:
${result.toastSubtypes.map((s) => `     - ${s.key.toUpperCase()}: ${s.score} б. (${s.percentage}%)`).join('\n')}

2. ТОПОГРАФИЧЕСКАЯ ПОДГРУППА (OCSP):
   • Категория: ${result.ocspResult.key} (${result.ocspResult.fullNameRu})
   • Анатомический бассейн: ${result.ocspResult.territoryRu}

3. ОЦЕНКА РЕПЕРФУЗИОННОЙ ТЕРАПИИ (п. 27–38 Протокола МЗ РБ № 1):
   • Системный тромболизис (ТЛТ): ${result.reperfusion.ivtEligible ? 'ПОКАЗАН' : 'НЕ ПОКАЗАН / ПРОТИВОПОКАЗАН'}
     Окно: ${result.reperfusion.ivtWindowStatus}
     ${result.reperfusion.ivtContraindications.length > 0 ? `Противопоказания: ${result.reperfusion.ivtContraindications.join('; ')}` : 'Противопоказаний не выявлено.'}
   • Внутрисосудистая тромбэкстракция (ВСТЭ): ${result.reperfusion.evtEligible ? 'ПОКАЗАНА' : 'НЕ ПОКАЗАНА'}
     Окно: ${result.reperfusion.evtWindowStatus}
     Обоснование: ${result.reperfusion.evtRationale}

4. ПЕРСОНАЛИЗИРОВАННЫЙ АНТИТРОМБОТИЧЕСКИЙ ПЛАН (п. 43, Приложения 14 и 15):
   • Стратегия: ${result.antithromboticPlan.strategy}
   • Срок старта / возобновления: ${result.antithromboticPlan.timingDay} (${result.antithromboticPlan.timingRationale})
   • Препарат и режим: ${result.antithromboticPlan.primaryRegimen}
   • Дозирование: ${result.antithromboticPlan.dosingDetails}
   • Длительность: ${result.antithromboticPlan.duration}
   • Безопасность: ${result.antithromboticPlan.safetyNotes}

5. СТРАТИФИКАЦИЯ РИСКОВ:
   • Шкала ABCD²: ${result.abcd2Score.score}/7 (${result.abcd2Score.riskCategory} риск)
   • Шкала HAS-BLED: ${result.hasBledScore.score}/9 (${result.hasBledScore.riskLevel} риск)
   ${result.malignantAlert.isSuspected ? `• ВНИМАНИЕ: ${result.malignantAlert.alertTitle} — ${result.malignantAlert.actionPlan}` : ''}

6. ПЛАН ВТОРИЧНОЙ ПРОФИЛАКТИКИ И ДООБСЛЕДОВАНИЯ:
   • Статины: ${result.recommendations.lipidTherapy}
   • Целевое АД: ${result.recommendations.bpControl}
   • Дообследование:
${result.recommendations.furtherWorkup.map((w) => `     - ${w}`).join('\n')}
${result.recommendations.surgicalOrInterventional ? `   • Интервенционное/хирургическое лечение: ${result.recommendations.surgicalOrInterventional}` : ''}

===================================================================
Заключение сформировано в соответствии с клиническими стандартами
Врач-невролог: ______________________ / _____________________
===================================================================
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl sticky top-0 z-10 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                Медицинский протокол заключение
              </h2>
              <p className="text-[11px] text-slate-500">
                Клинический протокол МЗ РБ № 1 от 05.01.2026
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="copy-report-text-btn"
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
            </button>

            <button
              id="print-report-btn"
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Печать</span>
            </button>

            <button
              id="close-report-modal-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 font-sans text-slate-900 dark:text-slate-100 print:text-black print:bg-white text-xs sm:text-sm">
          
          <div className="text-center border-b border-slate-200 pb-3">
            <h1 className="text-base sm:text-lg font-bold uppercase tracking-wide">
              Медицинский протокол-заключение
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Оценка этиологического подтипа ишемического инсульта и персонализированная тактика лечения
            </p>
            <div className="text-[11px] text-slate-500 mt-1">
              Регламент: Клинический протокол Министерства здравоохранения Республики Беларусь № 1 от 05.01.2026
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Дата формирования: {result.calcDate}
            </div>
          </div>

          {/* Patient Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <strong>Пациент:</strong> {patientData.patientName || 'Не указан'}
            </div>
            <div>
              <strong>Возраст / Пол:</strong> {patientData.age} лет, {patientData.gender === 'male' ? 'М' : 'Ж'}
            </div>
            <div>
              <strong>pre-mRS:</strong> {patientData.preStrokeMRS} | <strong>NIHSS:</strong> {patientData.nihssScore} б.
            </div>
            <div>
              <strong>Дебют:</strong> {patientData.onsetTimeHours} ч. {patientData.isWakeUpStroke ? '(Wake-up)' : ''}
            </div>
          </div>

          {/* Alert if Malignant */}
          {result.malignantAlert.isSuspected && (
            <div className="p-3 bg-rose-100 text-rose-900 border border-rose-300 rounded-lg text-xs space-y-1">
              <strong className="block">ВНИМАНИЕ: {result.malignantAlert.alertTitle}</strong>
              <p>{result.malignantAlert.urgencyRationale}</p>
              <p className="font-semibold">Тактика: {result.malignantAlert.actionPlan}</p>
            </div>
          )}

          {/* 1. Subtype & OCSP */}
          <div className="space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-blue-700 dark:text-blue-400">
              1. Этиологический подтип (TOAST 2.0) и топография (OCSP):
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              {result.dominantSubtype.nameRu} ({result.dominantSubtype.code}) — {result.confidenceLevelRu}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {result.confidenceDescriptionRu}
            </p>
            <div className="text-xs text-slate-700 dark:text-slate-300 pt-1">
              <strong>Топографический синдром OCSP:</strong> {result.ocspResult.key} ({result.ocspResult.fullNameRu}), бассейн: {result.ocspResult.territoryRu}
            </div>
          </div>

          {/* 2. Reperfusion */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
              2. Заключение по реперфузионной терапии (п. 27–38):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                <strong>Системная ТЛТ (алтеплаза):</strong> {result.reperfusion.ivtEligible ? 'ПОКАЗАНА' : 'НЕ ПОКАЗАНА'}
                <div className="text-[11px] text-slate-500 mt-1">Окно: {result.reperfusion.ivtWindowStatus}</div>
                {result.reperfusion.ivtContraindications.length > 0 && (
                  <div className="text-[11px] text-rose-600 mt-1">Противопоказания: {result.reperfusion.ivtContraindications.join('; ')}</div>
                )}
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                <strong>Тромбэкстракция (ВСТЭ):</strong> {result.reperfusion.evtEligible ? 'ПОКАЗАНА' : 'НЕ ПОКАЗАНА'}
                <div className="text-[11px] text-slate-500 mt-1">Окно: {result.reperfusion.evtWindowStatus}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{result.reperfusion.evtRationale}</div>
              </div>
            </div>
          </div>

          {/* 3. Antithrombotic */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="font-bold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400">
              3. Персонализированный антитромботический план (п. 43, Прил. 14–15):
            </div>
            <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <p><strong>• Срок старта:</strong> {result.antithromboticPlan.timingDay} ({result.antithromboticPlan.timingRationale})</p>
              <p><strong>• Режим:</strong> {result.antithromboticPlan.primaryRegimen}</p>
              <p><strong>• Дозирование:</strong> {result.antithromboticPlan.dosingDetails}</p>
              <p><strong>• Длительность:</strong> {result.antithromboticPlan.duration}</p>
              <p><strong>• Безопасность:</strong> {result.antithromboticPlan.safetyNotes}</p>
            </div>
          </div>

          {/* 4. Secondary Prevention */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              4. Комплексная вторичная профилактика:
            </div>
            <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <p><strong>• Гиполипидемическая терапия:</strong> {result.recommendations.lipidTherapy}</p>
              <p><strong>• Контроль АД:</strong> {result.recommendations.bpControl}</p>
              <p><strong>• Дообследование:</strong> {result.recommendations.furtherWorkup.join('; ')}</p>
              {result.recommendations.surgicalOrInterventional && (
                <p><strong>• Хирургия/интервенция:</strong> {result.recommendations.surgicalOrInterventional}</p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
            <span>Врач-невролог: ______________________</span>
            <span>Подпись: ______________</span>
          </div>

        </div>

      </div>
    </div>
  );
};
