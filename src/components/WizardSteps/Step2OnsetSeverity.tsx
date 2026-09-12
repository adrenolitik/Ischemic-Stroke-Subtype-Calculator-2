import React from 'react';
import { PatientData, OnsetCharacter } from '../../types';
import {
  Clock,
  Calculator,
  BarChart2,
  Moon,
  AlertCircle,
  Zap,
  HelpCircle,
  Flame
} from 'lucide-react';

interface Step2Props {
  data: PatientData;
  onChange: (updated: Partial<PatientData>) => void;
  onOpenNIHSSModal: () => void;
}

export const Step2OnsetSeverity: React.FC<Step2Props> = ({
  data,
  onChange,
  onOpenNIHSSModal
}) => {
  const ONSET_OPTIONS: {
    key: OnsetCharacter;
    labelRu: string;
    badgeRu: string;
    descRu: string;
    targetSubtypeRu: string;
  }[] = [
    {
      key: 'sudden',
      labelRu: 'Внезапное апоплектиформное начало («эмболический пик»)',
      badgeRu: 'Кардиоэмболический',
      descRu:
        'Симптомы достигают максимальной выраженности в первые секунды или минуты (часто в период активности).',
      targetSubtypeRu: '+1.0 к Кардиоэмболии'
    },
    {
      key: 'stuttering',
      labelRu: 'Мерцающее / ступенчатое нарастание симптоматики',
      badgeRu: 'Атеротромботический',
      descRu:
        'Волнообразное, ступенчатое утяжеление дефицита в течение нескольких часов или суток (часто во сне или под утро).',
      targetSubtypeRu: '+1.0 к Атеротромбозу'
    },
    {
      key: 'gradual',
      labelRu: 'Постепенное медленное нарастание',
      badgeRu: 'Лакунарный',
      descRu:
        'Постепенное изолированное прогрессирование локального очагового дефицита без угнетения сознания.',
      targetSubtypeRu: '+1.0 к Лакунарному'
    },
    {
      key: 'fluctuating',
      labelRu: 'Флюктуирующее / рецидивирующее течение',
      badgeRu: 'Другой / Неопределенный',
      descRu:
        'Чередование эпизодов транзиторного ухудшения и улучшения, рецидивирующие ТИА в одном или разных бассейнах.',
      targetSubtypeRu: '+1.0 к Другой/Неопределенной'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Window & Wake-Up Stroke */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Временное окно и обстоятельства дебюта (Оценка реперфузии, п. 27–38)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Время от начала симптомов (в часах):
              </label>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {data.onsetTimeHours} ч.
              </span>
            </div>

            <input
              type="range"
              min={0.5}
              max={24}
              step={0.5}
              value={data.onsetTimeHours}
              onChange={(e) => onChange({ onsetTimeHours: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span className="text-emerald-600 font-bold">0 — 4.5 ч (ТЛТ)</span>
              <span className="text-blue-600 font-bold">4.5 — 9 ч (ТЛТ mismatch)</span>
              <span className="text-purple-600 font-bold">0 — 6 — 24 ч (ВСТЭ)</span>
            </div>

            {data.onsetTimeHours <= 4.5 && !data.isWakeUpStroke && (
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-200">
                ✓ Стандартное терапевтическое окно ТЛТ (до 4.5 часов от дебюта) (п. 27)
              </div>
            )}
            {data.onsetTimeHours > 4.5 && data.onsetTimeHours <= 9.0 && !data.isWakeUpStroke && (
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-800 dark:text-blue-200">
                ℹ Расширенное терапевтическое окно ТЛТ (4.5–9 часов): показана при КТП/МРТ mismatch (п. 28.2)
              </div>
            )}
            {data.onsetTimeHours > 9.0 && data.onsetTimeHours <= 24.0 && (
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-800 dark:text-purple-200">
                ℹ Терапевтическое окно для ВСТЭ (до 24 часов) при окклюзии крупной артерии (DAWN / DEFUSE-3, п. 33–35)
              </div>
            )}
          </div>

          {/* Wake-Up Stroke */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.isWakeUpStroke}
                  onChange={(e) => onChange({ isWakeUpStroke: e.target.checked })}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Инсульт после пробуждения (Wake-Up Stroke) / Неизвестное время дебюта</span>
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Симптомы обнаружены при пробуждении или точное время начала неизвестно.
                  </p>
                </div>
              </label>

              {data.isWakeUpStroke && (
                <div className="mt-3 pl-7 text-[11px] text-indigo-700 dark:text-indigo-300 space-y-1">
                  <p>
                    По п. 28.2 время от середины сна должно составлять &lt; 9 часов. ТЛТ проводится при выявлении несоответствия объема гипоперфузии и зоны инфаркта на КТ-перфузии или DWI-FLAIR mismatch на МРТ!
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Регламент: Протокол МЗ РБ № 1 от 05.01.2026, п. 27–35</span>
            </div>
          </div>
        </div>
      </div>

      {/* Onset Mode Selection */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600" />
          <span>Характер и темп развития неврологического дефицита</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ONSET_OPTIONS.map((item) => {
            const isSelected = data.onsetMode === item.key;
            return (
              <label
                key={item.key}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 dark:border-blue-600 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <input
                        type="radio"
                        name="onsetMode"
                        checked={isSelected}
                        onChange={() => onChange({ onsetMode: item.key })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{item.labelRu}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-5 leading-relaxed">
                    {item.descRu}
                  </p>
                </div>

                <div className="mt-2.5 pl-5 pt-1.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    {item.targetSubtypeRu}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {item.badgeRu}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* NIHSS Score & Clinical Impact */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Тяжесть инсульта по шкале NIHSS (Приложение 3 к Протоколу МЗ РБ № 1)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Суммарный балл NIHSS определяет тактику ДААТ (п. 43.2), день старта ОАК (п. 43.1) и показания к ВСТЭ (п. 30).
            </p>
          </div>

          <button
            id="open-nihss-calculator-btn"
            type="button"
            onClick={onOpenNIHSSModal}
            className="px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition flex items-center space-x-2 self-start sm:self-auto shrink-0"
          >
            <Calculator className="w-4 h-4" />
            <span>Интерактивный расчет NIHSS (11 пунктов)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Суммарный балл NIHSS (0–42):
            </label>
            <div className="flex items-center space-x-3">
              <input
                id="nihss-score-input"
                type="number"
                min={0}
                max={42}
                value={data.nihssScore}
                onChange={(e) => {
                  const val = Math.min(42, Math.max(0, parseInt(e.target.value) || 0));
                  onChange({ nihssScore: val });
                }}
                className="w-20 px-3 py-2 text-xl font-extrabold text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-center"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                баллов
              </span>
            </div>
          </div>

          <div className="sm:col-span-2 p-3 rounded-xl border bg-white dark:bg-slate-900 text-xs space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Клинические следствия по Протоколу МЗ РБ № 1:
            </span>
            {data.nihssScore <= 3 && (
              <span className="text-blue-600 dark:text-blue-400 font-medium block">
                • Малый ишемический инсульт (NIHSS ≤ 3): показана ДААТ (Клопидогрел 300/75 мг + АСК 300/75 мг) на 21 день (п. 43.2).
              </span>
            )}
            {data.nihssScore >= 4 && data.nihssScore <= 5 && (
              <span className="text-amber-600 dark:text-amber-400 font-medium block">
                • Инсульт умеренной тяжести (NIHSS 4–5): показана ДААТ с тикагрелором (Тикагрелор 180/90 мг + АСК 75 мг) на 30 дней (п. 43.2).
              </span>
            )}
            {data.nihssScore >= 6 && data.nihssScore <= 15 && (
              <span className="text-purple-600 dark:text-purple-400 font-medium block">
                • Инсульт средней тяжести (NIHSS 6–15): достаточный неврологический дефицит для проведения ВСТЭ при окклюзии крупной артерии (п. 30).
              </span>
            )}
            {data.nihssScore > 15 && (
              <span className="text-rose-600 dark:text-rose-400 font-bold block">
                • Тяжелый инсульт (NIHSS &gt; 15): высокий риск геморрагической трансформации. Старт ОАК отсрочивается (с 6-х или 10-х суток) (п. 43.1). При окклюзии М1 — настороженность в отношении злокачественного отека (п. 44).
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
