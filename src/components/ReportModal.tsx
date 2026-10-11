import React, { useState, useEffect, useRef } from 'react';
import { CalculationResult, PatientData } from '../types';
import { X, Printer, Copy, Check, FileText, Download, Share2, ArrowLeft, FileDown, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const reportPaperRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.error('Print error:', e);
    }
  };

  const reportText = `
===================================================================
МЕДИЦИНСКОЕ ЗАКЛЮЧЕНИЕ / ВРАЧЕБНЫЙ ПРОТОКОЛ
«Клинический калькулятор этиологического подтипа ишемического инсульта» v2.0
Соответствует Клиническому протоколу МЗ РБ № 1 от 05.01.2026
Дата расчета: ${result.calcDate || new Date().toLocaleString('ru-RU')}
Пациент: ${patientData.patientName || 'Без указания ФИО'} | Возраст: ${patientData.age} лет | Пол: ${patientData.gender === 'male' ? 'Мужской' : 'Женский'}
pre-mRS: ${patientData.preStrokeMRS} | NIHSS: ${patientData.nihssScore} баллов | Время дебюта: ${patientData.onsetTimeHours} ч. ${patientData.isWakeUpStroke ? '(Wake-up)' : ''}
СКФ / CrCl: ${patientData.estimatedCrCl} мл/мин | Масса тела: ${patientData.weightKg} кг
===================================================================

1. ЭТИОЛОГИЧЕСКИЙ ПОДТИП (TOAST 2.0):
   • Ведущий подтип: ${result.dominantSubtype?.nameRu || ''} (${result.dominantSubtype?.code || ''})
   • Уровень достоверности: ${result.confidenceLevelRu || ''}
   • Обоснование: ${result.confidenceDescriptionRu || ''}
   • Спектр вероятностей:
${(result.toastSubtypes || []).map((s) => `     - ${s.key.toUpperCase()}: ${s.score} б. (${s.percentage}%)`).join('\n')}

2. ТОПОГРАФИЧЕСКАЯ ПОДГРУППА (OCSP):
   • Категория: ${result.ocspResult?.key || ''} (${result.ocspResult?.fullNameRu || ''})
   • Анатомический бассейн: ${result.ocspResult?.territoryRu || ''}

3. ОЦЕНКА РЕПЕРФУЗИОННОЙ ТЕРАПИИ (п. 27–38 Протокола МЗ РБ № 1):
   • Системный тромболизис (ТЛТ): ${result.reperfusion?.ivtEligible ? 'ПОКАЗАН' : 'НЕ ПОКАЗАН / ПРОТИВОПОКАЗАН'}
     Окно: ${result.reperfusion?.ivtWindowStatus || ''}
     ${(result.reperfusion?.ivtContraindications || []).length > 0 ? `Противопоказания: ${result.reperfusion.ivtContraindications.join('; ')}` : 'Противопоказаний не выявлено.'}
   • Внутрисосудистая тромбэкстракция (ВСТЭ): ${result.reperfusion?.evtEligible ? 'ПОКАЗАНА' : 'НЕ ПОКАЗАНА'}
     Окно: ${result.reperfusion?.evtWindowStatus || ''}
     Обоснование: ${result.reperfusion?.evtRationale || ''}

4. ВТОРИЧНАЯ ПРОФИЛАКТИКА ТРОМБОЗА (Протокол МЗ РБ № 1 от 05.01.2026):
   • Нормативное основание: ${result.antithromboticPlan?.protocolCitation || ''} (${result.antithromboticPlan?.ruleTitle || ''})
   • Стратегия: ${result.antithromboticPlan?.strategy === 'OAC' ? 'Пероральная антикоагулянтная терапия (ОАК)' : 'Антиагрегантная терапия'}
   • Срок старта / возобновления: ${result.antithromboticPlan?.timingDay || ''}
   • Обоснование: ${result.antithromboticPlan?.timingRationale || ''}
   ${result.antithromboticPlan?.preOACBridge ? `• Мост-терапия: ${result.antithromboticPlan.preOACBridge}\n   ` : ''}• Препарат и режим: ${result.antithromboticPlan?.primaryRegimen || ''}
   • Дозирование: ${result.antithromboticPlan?.dosingDetails || ''}
   ${result.antithromboticPlan?.phase1 ? `• Фаза 1: ${result.antithromboticPlan.phase1.timing} — ${result.antithromboticPlan.phase1.dosing}\n   ` : ''}${result.antithromboticPlan?.phase2 ? `• Фаза 2: ${result.antithromboticPlan.phase2.timing} — ${result.antithromboticPlan.phase2.dosing}\n   ` : ''}${result.antithromboticPlan?.phase3 ? `• Фаза 3: ${result.antithromboticPlan.phase3.timing} — ${result.antithromboticPlan.phase3.dosing}\n   ` : ''}• Длительность: ${result.antithromboticPlan?.duration || ''}
   • Безопасность: ${result.antithromboticPlan?.safetyNotes || ''}

5. СТРАТИФИКАЦИЯ РИСКОВ:
   • Шкала ABCD²: ${result.abcd2Score?.score ?? 0}/7 (${result.abcd2Score?.riskCategory || ''} риск)
   • Шкала HAS-BLED: ${result.hasBledScore?.score ?? 0}/9 (${result.hasBledScore?.riskLevel || ''} риск)
   ${result.malignantAlert?.isSuspected ? `• ВНИМАНИЕ: ${result.malignantAlert.alertTitle} — ${result.malignantAlert.actionPlan}` : ''}

6. ПЛАН ВТОРИЧНОЙ ПРОФИЛАКТИКИ И ДООБСЛЕДОВАНИЯ:
   • Статины: ${result.recommendations?.lipidTherapy || ''}
   • Целевое АД: ${result.recommendations?.bpControl || ''}
   • Дообследование:
${(result.recommendations?.furtherWorkup || []).map((w) => `     - ${w}`).join('\n')}
${result.recommendations?.surgicalOrInterventional ? `   • Интервенционное/хирургическое лечение: ${result.recommendations.surgicalOrInterventional}` : ''}

===================================================================
Заключение сформировано в соответствии с клиническими стандартами
Врач-невролог: ______________________ / _____________________
===================================================================
`;

  const fallbackCopy = () => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = reportText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
    }
  };

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(reportText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  };

  const handleDownloadTxt = () => {
    try {
      const element = document.createElement('a');
      const file = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      const safeName = patientData.patientName
        ? patientData.patientName.replace(/[^a-zA-Zа-яА-Я0-9_]/g, '_')
        : 'Пациент';
      element.download = `Протокол_инсульт_${safeName}_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Врачебный протокол-заключение по инсульту',
          text: reportText
        });
      } catch (err) {
        // User closed the share sheet or cancelled
        console.log('Share dismissed or cancelled', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleExportPdf = async () => {
    if (!reportPaperRef.current || isExportingPdf) return;
    setIsExportingPdf(true);
    setPdfError(null);

    try {
      const reportElement = reportPaperRef.current;

      // Render the report element using html2canvas with 2x scale for sharp typography
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 820,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.querySelector('[data-report-paper="true"]') as HTMLElement | null;
          if (clonedEl) {
            clonedEl.style.backgroundColor = '#ffffff';
            clonedEl.style.color = '#0f172a';
            clonedEl.style.width = '794px'; // Standard A4 width at 96 DPI
            clonedEl.style.padding = '28px 36px';
            clonedEl.style.boxSizing = 'border-box';

            // Clean up dark classes in cloned element to make paper strictly print-white
            const elements = clonedEl.querySelectorAll('*');
            elements.forEach((node) => {
              const el = node as HTMLElement;
              el.classList.remove('dark');
              if (el.classList.contains('text-slate-100') || el.classList.contains('dark:text-white')) {
                el.style.color = '#0f172a';
              }
            });
          }
        }
      });

      // Standard A4 portrait in millimeters
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10; // 10mm margins
      const contentWidth = pageWidth - margin * 2; // 190mm
      const maxPageContentHeight = pageHeight - margin * 2; // 277mm
      const totalImgHeightMm = (canvas.height * contentWidth) / canvas.width;

      if (totalImgHeightMm <= maxPageContentHeight) {
        // Single page document
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, totalImgHeightMm, undefined, 'FAST');
      } else {
        // Multi-page document: slice canvas cleanly by page height
        const pxPerPage = (canvas.width * maxPageContentHeight) / contentWidth;
        let renderedPx = 0;
        let pageIndex = 0;

        while (renderedPx < canvas.height) {
          const slicePxHeight = Math.min(pxPerPage, canvas.height - renderedPx);
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = slicePxHeight;
          const ctx = pageCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(
              canvas,
              0,
              renderedPx,
              canvas.width,
              slicePxHeight,
              0,
              0,
              canvas.width,
              slicePxHeight
            );
            const sliceData = pageCanvas.toDataURL('image/png');
            const sliceHeightMm = (slicePxHeight * contentWidth) / canvas.width;

            if (pageIndex > 0) {
              pdf.addPage();
            }
            pdf.addImage(sliceData, 'PNG', margin, margin, contentWidth, sliceHeightMm, undefined, 'FAST');
            pageIndex++;
          }
          renderedPx += pxPerPage;
        }
      }

      const safeName = patientData.patientName
        ? patientData.patientName.trim().replace(/[^a-zA-Zа-яА-Я0-9_]/g, '_')
        : 'Пациент';
      const dateStamp = new Date().toISOString().slice(0, 10);
      const fileName = `Заключение_инсульт_${safeName}_${dateStamp}.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setPdfError('Ошибка при создании PDF. Воспользуйтесь кнопкой «Печать».');
      setTimeout(() => setPdfError(null), 5000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh] my-auto overflow-hidden">
        
        {/* Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 sticky top-0 z-20 print:hidden shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="sm:hidden p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
              title="Назад"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0 hidden xs:block">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">
                Медицинский протокол-заключение
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                Протокол МЗ РБ № 1 от 05.01.2026
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {canShare && (
              <button
                id="share-report-btn"
                type="button"
                onClick={handleShare}
                className="px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 transition flex items-center space-x-1"
                title="Поделиться через мессенджер или отправить"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Поделиться</span>
              </button>
            )}

            <button
              id="copy-report-text-btn"
              type="button"
              onClick={handleCopy}
              className="px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition flex items-center space-x-1"
              title="Скопировать текст в буфер обмена"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Скопировано!' : 'Копировать'}</span>
            </button>

            <button
              id="download-txt-report-btn"
              type="button"
              onClick={handleDownloadTxt}
              className="px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition flex items-center space-x-1"
              title="Скачать файл протокола (.txt)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">.txt</span>
            </button>

            {/* Direct PDF Export Button in Header */}
            <button
              id="export-pdf-report-btn"
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg shadow-xs transition flex items-center space-x-1 shrink-0 cursor-pointer"
              title="Экспортировать врачебное заключение в PDF"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>{isExportingPdf ? 'PDF...' : 'PDF'}</span>
            </button>

            <button
              id="print-report-btn"
              type="button"
              onClick={handlePrint}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition flex items-center space-x-1 shrink-0"
              title="Печать заключения"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Печать</span>
            </button>

            <button
              id="close-report-modal-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Закрыть"
              title="Закрыть заключение"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error notification if PDF export fails */}
        {pdfError && (
          <div className="mx-4 mt-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-xl flex items-center justify-between">
            <span>{pdfError}</span>
            <button
              type="button"
              onClick={() => setPdfError(null)}
              className="text-rose-600 hover:text-rose-800 font-bold ml-2 text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Printable Paper Canvas */}
        <div
          ref={reportPaperRef}
          data-report-paper="true"
          className="p-4 sm:p-7 overflow-y-auto space-y-4 font-sans text-slate-900 dark:text-slate-100 print:text-black print:bg-white text-xs sm:text-sm flex-1 bg-white dark:bg-slate-900"
        >
          
          <div className="text-center border-b border-slate-200 pb-3">
            <h1 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
              Медицинский протокол-заключение
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
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
            <div className="col-span-2">
              <strong>СКФ / CrCl:</strong> {patientData.estimatedCrCl} мл/мин | <strong>Масса:</strong> {patientData.weightKg} кг
            </div>
            <div className="col-span-2">
              <strong>АД при поступлении:</strong> {patientData.systolicBP}/{patientData.diastolicBP} мм рт.ст.
            </div>
          </div>

          {/* Alert if Malignant */}
          {result.malignantAlert?.isSuspected && (
            <div className="p-3 bg-rose-100 text-rose-900 border border-rose-300 rounded-lg text-xs space-y-1">
              <strong className="block">ВНИМАНИЕ: {result.malignantAlert?.alertTitle}</strong>
              <p>{result.malignantAlert?.urgencyRationale}</p>
              <p className="font-semibold">Тактика: {result.malignantAlert?.actionPlan}</p>
            </div>
          )}

          {/* 1. Subtype & OCSP */}
          <div className="space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-blue-700 dark:text-blue-400">
              1. Этиологический подтип (TOAST 2.0) и топография (OCSP):
            </div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              {result.dominantSubtype?.nameRu} ({result.dominantSubtype?.code}) — {result.confidenceLevelRu || result.dominantCertaintyRu}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {result.confidenceDescriptionRu}
            </p>
            {result.ocspResult && (
              <div className="text-xs text-slate-700 dark:text-slate-300 pt-1">
                <strong>Топографический синдром OCSP:</strong> {result.ocspResult.key} ({result.ocspResult.fullNameRu}), бассейн: {result.ocspResult.territoryRu}
              </div>
            )}
          </div>

          {/* 2. Reperfusion */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
              2. Заключение по реперфузионной терапии (п. 27–38):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                <strong>Системная ТЛТ (алтеплаза):</strong> {result.reperfusion?.ivtEligible ? 'ПОКАЗАНА' : 'НЕ ПОКАЗАНА'}
                <div className="text-[11px] text-slate-500 mt-1">Окно: {result.reperfusion?.ivtWindowStatus}</div>
                {(result.reperfusion?.ivtContraindications || []).length > 0 && (
                  <div className="text-[11px] text-rose-600 mt-1">Противопоказания: {result.reperfusion.ivtContraindications.join('; ')}</div>
                )}
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                <strong>Тромбэкстракция (ВСТЭ):</strong> {result.reperfusion?.evtEligible ? 'ПОКАЗАНА' : 'НЕ ПОКАЗАНА'}
                <div className="text-[11px] text-slate-500 mt-1">Окно: {result.reperfusion?.evtWindowStatus}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{result.reperfusion?.evtRationale}</div>
              </div>
            </div>
          </div>

          {/* 3. Antithrombotic Secondary Prevention */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="font-bold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400">
              3. Вторичная профилактика тромбоза (Протокол МЗ РБ № 1):
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <p><strong>• Нормативное основание:</strong> {result.antithromboticPlan?.protocolCitation}: {result.antithromboticPlan?.ruleTitle}</p>
              <p><strong>• Срок старта:</strong> {result.antithromboticPlan?.timingDay} ({result.antithromboticPlan?.timingRationale})</p>
              {result.antithromboticPlan?.preOACBridge && (
                <p className="text-amber-800 dark:text-amber-300 font-semibold">
                  <strong>• Мост-терапия:</strong> {result.antithromboticPlan.preOACBridge}
                  {result.antithromboticPlan.heparinBridge && ` (${result.antithromboticPlan.heparinBridge})`}
                </p>
              )}
              <p><strong>• Основной препарат и режим:</strong> {result.antithromboticPlan?.primaryRegimen}</p>
              <p><strong>• Дозирование:</strong> {result.antithromboticPlan?.dosingDetails}</p>
              {result.antithromboticPlan?.phase1 && (
                <div className="pl-3 border-l-2 border-purple-400 dark:border-purple-600 text-[11px] space-y-0.5 my-1 bg-purple-50/40 dark:bg-purple-950/20 p-2 rounded">
                  <div><strong>1 этап (острый):</strong> {result.antithromboticPlan.phase1.timing} — {result.antithromboticPlan.phase1.dosing}</div>
                  {result.antithromboticPlan.phase2 && (
                    <div><strong>2 этап (ранний):</strong> {result.antithromboticPlan.phase2.timing} — {result.antithromboticPlan.phase2.dosing}</div>
                  )}
                  {result.antithromboticPlan.phase3 && (
                    <div><strong>3 этап (долговременный):</strong> {result.antithromboticPlan.phase3.timing} — {result.antithromboticPlan.phase3.dosing}</div>
                  )}
                </div>
              )}
              <p><strong>• Длительность:</strong> {result.antithromboticPlan?.duration}</p>
              <p><strong>• Безопасность:</strong> {result.antithromboticPlan?.safetyNotes}</p>
            </div>
          </div>

          {/* 4. Secondary Prevention */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              4. Комплексная вторичная профилактика:
            </div>
            <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <p><strong>• Гиполипидемическая терапия:</strong> {result.recommendations?.lipidTherapy}</p>
              <p><strong>• Контроль АД:</strong> {result.recommendations?.bpControl}</p>
              <p><strong>• Дообследование:</strong> {(result.recommendations?.furtherWorkup || []).join('; ')}</p>
              {result.recommendations?.surgicalOrInterventional && (
                <p><strong>• Хирургия/интервенция:</strong> {result.recommendations.surgicalOrInterventional}</p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
            <span>Врач-невролог: ______________________</span>
            <span>Подпись: ______________</span>
          </div>

        </div>

        {/* Sticky Mobile/Desktop Footer Bar with Quick Exit & Action Buttons */}
        <div className="px-4 py-3 sm:px-5 sm:py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 print:hidden shrink-0">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            Клинический протокол МЗ РБ № 1 от 05.01.2026
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="close-report-bottom-btn"
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition min-h-[40px] flex items-center justify-center space-x-1.5"
            >
              <X className="w-4 h-4" />
              <span>Закрыть заключение</span>
            </button>

            {canShare && (
              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-2 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 rounded-xl hover:bg-purple-100 transition min-h-[40px] flex items-center space-x-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Отправить</span>
              </button>
            )}

            <button
              id="download-txt-report-bottom-btn"
              type="button"
              onClick={handleDownloadTxt}
              className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition min-h-[40px] flex items-center space-x-1.5"
              title="Скачать заключение в текстовом формате (.txt)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">.txt</span>
            </button>

            {/* Direct PDF Export Button in Bottom Action Bar */}
            <button
              id="export-pdf-report-bottom-btn"
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-xl shadow-xs transition min-h-[40px] flex items-center space-x-1.5 cursor-pointer"
              title="Экспортировать врачебное заключение в PDF файл"
            >
              {isExportingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              <span>{isExportingPdf ? 'Формирование PDF...' : 'Экспорт в PDF'}</span>
            </button>

            <button
              id="print-report-bottom-btn"
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition min-h-[40px] flex items-center space-x-1.5"
              title="Печать заключения"
            >
              <Printer className="w-4 h-4" />
              <span>Печать</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
