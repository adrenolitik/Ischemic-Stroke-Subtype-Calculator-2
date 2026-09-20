import React from 'react';
import { PatientData } from '../../types';
import {
  User,
  HeartPulse,
  AlertTriangle,
  Activity,
  FileCheck,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

interface Step1Props {
  data: PatientData;
  onChange: (updated: Partial<PatientData>) => void;
}

export const Step1Demographics: React.FC<Step1Props> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Patient Profile */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Паспортные данные и функциональный статус до инсульта (pre-mRS)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Идентификатор / ФИО пациента
            </label>
            <input
              id="patient-name-input"
              type="text"
              value={data.patientName || ''}
              onChange={(e) => onChange({ patientName: e.target.value })}
              placeholder="Пациент № 1042 / Иванов И.И."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Возраст (лет) *
            </label>
            <div className="relative">
              <input
                id="patient-age-input"
                type="number"
                min={18}
                max={110}
                value={data.age || ''}
                onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">лет</span>
            </div>
            {data.age < 55 ? (
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
                Возраст &lt; 55 лет: скрининг редких причин (п. 13) и bubble test на ООО при ESUS (п. 25.3)
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1">
                Возраст ≥ 55 лет (фактор атеротромботического и кардиоэмболического подтипа)
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Пол
            </label>
            <div className="flex gap-4 pt-1.5">
              <label className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  id="gender-male-radio"
                  type="radio"
                  name="gender"
                  checked={data.gender === 'male'}
                  onChange={() => onChange({ gender: 'male' })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-800 dark:text-slate-200">Мужской</span>
              </label>
              <label className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  id="gender-female-radio"
                  type="radio"
                  name="gender"
                  checked={data.gender === 'female'}
                  onChange={() => onChange({ gender: 'female' })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-800 dark:text-slate-200">Женский</span>
              </label>
            </div>
          </div>
        </div>

        {/* Pre-Stroke mRS selector */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            Уровень независимости до настоящего инсульта (модифицированная шкала Рэнкина pre-mRS, Приложение 5):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {[
              { val: 0, label: 'mRS 0: Нет симптомов' },
              { val: 1, label: 'mRS 1: Без ограничения' },
              { val: 2, label: 'mRS 2: Легкое ограничение' },
              { val: 3, label: 'mRS 3: Умеренное ограничение' },
              { val: 4, label: 'mRS 4: Выраженное' },
              { val: 5, label: 'mRS 5: Тяжелая инвалидизация' }
            ].map((m) => (
              <button
                key={m.val}
                type="button"
                onClick={() => onChange({ preStrokeMRS: m.val })}
                className={`px-2.5 py-2 text-xs rounded-xl border font-medium text-left transition ${
                  data.preStrokeMRS === m.val
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                }`}
              >
                <div className="font-bold">{m.label.split(':')[0]}</div>
                <div className="text-[10px] opacity-85 truncate">{m.label.split(':')[1]}</div>
              </button>
            ))}
          </div>
          {data.preStrokeMRS > 2 && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5">
              Внимание: pre-mRS &gt; 2 является ограничением для рутинной механической тромбэкстракции (п. 30.3), а pre-mRS 4–5 — противопоказанием к системной ТЛТ (п. 29).
            </p>
          )}
        </div>
      </div>

      {/* Comorbidities & Vascular History */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Сосудистый анамнез и коморбидный статус (Протокол МЗ РБ № 1)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* AH */}
          <label className="flex items-start p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition cursor-pointer">
            <input
              id="hypertension-checkbox"
              type="checkbox"
              checked={data.hypertension}
              onChange={(e) => onChange({ hypertension: e.target.checked })}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div className="ml-3">
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Артериальная гипертензия (АГ) в анамнезе
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Ведущий фактор церебральной микроангиопатии и лакунарного подтипа (п. 12, 26.2)
              </span>
            </div>
          </label>

          {/* CAD */}
          <label className="flex items-start p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition cursor-pointer">
            <input
              id="cad-checkbox"
              type="checkbox"
              checked={data.coronaryHeartDisease}
              onChange={(e) => onChange({ coronaryHeartDisease: e.target.checked })}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div className="ml-3">
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Ишемическая болезнь сердца (ИБС) / Инфаркт миокарда
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Стенокардия, постинфарктный кардиосклероз, атеросклероз коронарных артерий
              </span>
            </div>
          </label>

          {/* Diabetes */}
          <label className="flex items-start p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition cursor-pointer">
            <input
              id="diabetes-checkbox"
              type="checkbox"
              checked={data.diabetesMellitus}
              onChange={(e) => onChange({ diabetesMellitus: e.target.checked })}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div className="ml-3">
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Сахарный диабет 1 или 2 типа
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Диабетическая ангиопатия, целевой контроль гликемии 7.7–10.0 ммоль/л (п. 26.5)
              </span>
            </div>
          </label>

          {/* Multivascular Disease (COMPASS) */}
          <label className="flex items-start p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition cursor-pointer">
            <input
              id="multivascular-checkbox"
              type="checkbox"
              checked={data.multivascularDisease}
              onChange={(e) => onChange({ multivascularDisease: e.target.checked })}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div className="ml-3">
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Мультифокальный атеросклероз (ИБС + периферические артерии)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Показание к режиму COMPASS (АСК 100 мг + Ривароксабан 2.5 мг 2 р/с с 30 суток) (п. 43.2)
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Contraindication Flags for Thrombolysis (Item 29) */}
      <div className="bg-amber-50/60 dark:bg-amber-950/20 p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-3">
        <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Критические анамнестические противопоказания к ТЛТ (п. 29 Протокола МЗ РБ)</span>
        </h3>
        <p className="text-xs text-amber-800 dark:text-amber-300">
          Отметьте, если у пациента имеются следующие события в анамнезе:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-start space-x-2.5 p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-amber-200 dark:border-amber-900/50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.previousStrokeWithin1Month}
              onChange={(e) => onChange({ previousStrokeWithin1Month: e.target.checked })}
              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Ишемический инсульт давностью &lt; 1 месяца (п. 29)
            </span>
          </label>

          <label className="flex items-start space-x-2.5 p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-amber-200 dark:border-amber-900/50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.previousICHWithin1Year}
              onChange={(e) => onChange({ previousICHWithin1Year: e.target.checked })}
              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Внутричерепное кровоизлияние (ВМК) &lt; 1 года назад (п. 29)
            </span>
          </label>

          <label className="flex items-start space-x-2.5 p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-amber-200 dark:border-amber-900/50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.recentSTEMIwithin7days}
              onChange={(e) => onChange({ recentSTEMIwithin7days: e.target.checked })}
              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Подострый инфаркт миокарда (STEMI) &lt; 7 дней назад (п. 29)
            </span>
          </label>
        </div>
      </div>

      {/* DOAC Selection Factors & Comorbidities (Appendix 14) */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Клинические факторы выбора антикоагулянта (Приложение 14)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Масса тела (кг)
            </label>
            <div className="relative">
              <input
                id="weight-input"
                type="number"
                min={35}
                max={220}
                value={data.weightKg || ''}
                onChange={(e) => onChange({ weightKg: parseInt(e.target.value) || 70 })}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">кг</span>
            </div>
            {data.weightKg > 120 ? (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">
                Вес &gt; 120 кг: по Приложению 14 предпочтителен Варфарин под контролем МНО
              </p>
            ) : data.weightKg < 60 ? (
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
                Вес &le; 60 кг: один из критериев снижения дозы апиксабана (п. 43)
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1">Стандартная весовая категория</p>
            )}
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center space-x-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={data.historyOfGIBleeding}
                onChange={(e) => onChange({ historyOfGIBleeding: e.target.checked })}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-700 dark:text-slate-300">
                ЖК-кровотечение в анамнезе (избегать Дабигатран 150 мг)
              </span>
            </label>

            <label className="flex items-center space-x-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={data.dyspepsia}
                onChange={(e) => onChange({ dyspepsia: e.target.checked })}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-700 dark:text-slate-300">
                Склонность к диспепсии (избегать Дабигатран)
              </span>
            </label>

            <label className="flex items-center space-x-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={data.dysphagiaOrNasogastricTube}
                onChange={(e) => onChange({ dysphagiaOrNasogastricTube: e.target.checked })}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-slate-700 dark:text-slate-300">
                Зондовое питание (Дабигатран нельзя измельчать!)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
