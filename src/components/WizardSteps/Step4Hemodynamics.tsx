import React, { useState } from 'react';
import {
  PatientData,
  HighRiskCardiacSourceKey,
  LowRiskCardiacSourceKey
} from '../../types';
import {
  HIGH_RISK_CARDIAC_SOURCES,
  LOW_RISK_CARDIAC_SOURCES
} from '../../data/protocolData';
import {
  Activity,
  Heart,
  Droplets,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  HelpCircle,
  Stethoscope
} from 'lucide-react';

interface Step4Props {
  data: PatientData;
  onChange: (updated: Partial<PatientData>) => void;
}

export const Step4Hemodynamics: React.FC<Step4Props> = ({ data, onChange }) => {
  const [showAllHighSources, setShowAllHighSources] = useState(false);
  const [showAllLowSources, setShowAllLowSources] = useState(false);

  const toggleHighRiskSource = (key: HighRiskCardiacSourceKey) => {
    const current = data.highRiskCardiacSources || [];
    const exists = current.includes(key);
    const updated = exists
      ? current.filter((k) => k !== key)
      : [...current, key];
    onChange({ highRiskCardiacSources: updated });
  };

  const toggleLowRiskSource = (key: LowRiskCardiacSourceKey) => {
    const current = data.lowRiskCardiacSources || [];
    const exists = current.includes(key);
    const updated = exists
      ? current.filter((k) => k !== key)
      : [...current, key];
    onChange({ lowRiskCardiacSources: updated });
  };

  return (
    <div className="space-y-6">
      {/* 1. Vitals & Laboratory Safety (Protocol Items 26, 28, 29) */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Гемодинамические параметры и лабораторные критерии допуска (п. 26.2, 28, 29)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* BP Systolic / Diastolic */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Артериальное давление (АД)
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="systolic-bp-input"
                type="number"
                min={70}
                max={260}
                value={data.systolicBP || ''}
                onChange={(e) => onChange({ systolicBP: parseInt(e.target.value) || 120 })}
                placeholder="САД"
                className="w-1/2 px-2.5 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-center font-bold"
              />
              <span className="text-slate-400">/</span>
              <input
                id="diastolic-bp-input"
                type="number"
                min={40}
                max={160}
                value={data.diastolicBP || ''}
                onChange={(e) => onChange({ diastolicBP: parseInt(e.target.value) || 80 })}
                placeholder="ДАД"
                className="w-1/2 px-2.5 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-center font-bold"
              />
            </div>
            {data.systolicBP > 185 || data.diastolicBP > 110 ? (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold leading-tight">
                ⚠ АД &gt; 185/110 мм рт. ст. — перед ТЛТ требуется коррекция гипотензивными препаратами (п. 26.2)!
              </p>
            ) : (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ АД в допустимых пределах для ТЛТ (&lt; 185/110)
              </p>
            )}
          </div>

          {/* Blood Glucose */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Гликемия (ммоль/л)
            </label>
            <div className="relative">
              <input
                id="glucose-input"
                type="number"
                step="0.1"
                min={1.0}
                max={35.0}
                value={data.bloodGlucoseMmol || ''}
                onChange={(e) => onChange({ bloodGlucoseMmol: parseFloat(e.target.value) || 5.5 })}
                className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-center font-bold"
              />
            </div>
            {data.bloodGlucoseMmol < 2.7 ? (
              <p className="text-[11px] text-rose-600 font-bold leading-tight">
                ⚠ Гипогликемия (&lt; 2.7) — Stroke mimic! Коррекция декстрозой (п. 26.5).
              </p>
            ) : data.bloodGlucoseMmol > 10.0 ? (
              <p className="text-[11px] text-amber-600 font-medium leading-tight">
                Гипергликемия &gt; 10.0 ммоль/л — показан короткий инсулин, цель 7.7–10.0 (п. 26.5).
              </p>
            ) : (
              <p className="text-[11px] text-emerald-600 font-medium">
                Нормогликемия (цель 7.7–10.0 ммоль/л)
              </p>
            )}
          </div>

          {/* Platelets */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Тромбоциты (×10⁹/л)
            </label>
            <div className="relative">
              <input
                id="platelets-input"
                type="number"
                min={20}
                max={800}
                value={data.plateletCountThousand || ''}
                onChange={(e) => onChange({ plateletCountThousand: parseInt(e.target.value) || 200 })}
                className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-center font-bold"
              />
            </div>
            {data.plateletCountThousand < 100 ? (
              <p className="text-[11px] text-rose-600 font-bold leading-tight">
                ⚠ Тромбоциты &lt; 100×10⁹/л — противопоказание к ТЛТ (п. 29)!
              </p>
            ) : (
              <p className="text-[11px] text-emerald-600 font-medium">
                ✓ Тромбоциты ≥ 100×10⁹/л (норма для ТЛТ)
              </p>
            )}
          </div>

          {/* DOAC & Bleeding safety */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Антикоагулянтная безопасность
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center space-x-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.takingDOACwithin12h}
                  onChange={(e) => onChange({ takingDOACwithin12h: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  Прием ПОАК за посл. 12–24 ч (п. 28.4)
                </span>
              </label>

              <label className="flex items-center space-x-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.activeBleeding}
                  onChange={(e) => onChange({ activeBleeding: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-rose-700 dark:text-rose-400 font-bold">
                  Активное кровотечение (п. 29)
                </span>
              </label>
            </div>
            <div className="text-[10px] text-slate-500">
              Прием Дабигатрана: ТЛТ возможна после Идаруцизумаба (п. 28.4)
            </div>
          </div>
        </div>
      </div>

      {/* 2. Large Artery Atherosclerosis Evaluation (Item 10) */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Оценка атеротромбоза крупной артерии (LAA, п. 10)</span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-bold">
            Критерии NASCET
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex justify-between items-center gap-2">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Стеноз симптомной артерии (NASCET):
              </label>
              <div className="flex items-center space-x-1 shrink-0">
                <input
                  id="nascet-stenosis-number-input"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={data.targetVesselStenosisNascet}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onChange({ targetVesselStenosisNascet: isNaN(val) ? 0 : Math.min(100, Math.max(0, val)) });
                  }}
                  className="w-16 px-2 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">%</span>
              </div>
            </div>

            <input
              id="nascet-stenosis-slider"
              type="range"
              min={0}
              max={100}
              step={1}
              value={data.targetVesselStenosisNascet}
              onChange={(e) => onChange({ targetVesselStenosisNascet: parseInt(e.target.value) || 0 })}
              className="w-full accent-blue-600 cursor-pointer"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1">
              {[
                { val: 0, label: '0%' },
                { val: 30, label: '30%' },
                { val: 50, label: '50% (LAA)' },
                { val: 70, label: '70% (КЭЭ)' },
                { val: 90, label: '90%' },
                { val: 100, label: '100%' }
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => onChange({ targetVesselStenosisNascet: p.val })}
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium border transition ${
                    data.targetVesselStenosisNascet === p.val
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 font-medium pt-1 border-t border-slate-200 dark:border-slate-700/60">
              <span>0%</span>
              <span className="text-amber-600 font-bold">≥ 50% (LAA)</span>
              <span className="text-rose-600 font-bold">70–99% (КЭЭ)</span>
              <span>100%</span>
            </div>

            {data.targetVesselStenosisNascet >= 70 && data.targetVesselStenosisNascet <= 99 && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-1">
                ★ Показание к каротидной эндартерэктомии (КЭЭ) или стентированию в первые 14 дней от инсульта (п. 43.2)!
              </p>
            )}
            {data.targetVesselStenosisNascet >= 50 && data.targetVesselStenosisNascet < 70 && (
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                Подтвержден гемодинамически значимый стеноз ≥ 50% (критерий LAA)
              </p>
            )}
          </div>

          {/* Morphological & Clinical LAA Markers */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.plaqueUlcerationOrThrombus}
                onChange={(e) => onChange({ plaqueUlcerationOrThrombus: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Изъязвление бляшки или пристеночный тромб (п. 10.1)
                </span>
                <span className="text-[10px] text-slate-500">
                  Критерий LAA даже при стенозе &lt; 50%
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.amaurosisFugaxOrTIAinTargetVesselLastMonth}
                onChange={(e) => onChange({ amaurosisFugaxOrTIAinTargetVesselLastMonth: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  ТИА или amaurosis fugax за посл. месяц (п. 10.2)
                </span>
                <span className="text-[10px] text-slate-500">
                  В бассейне стенозированной сонной артерии
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.watershedInfarctPattern}
                onChange={(e) => onChange({ watershedInfarctPattern: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Инфаркт в зоне смежного водораздела (п. 10.3)
                </span>
                <span className="text-[10px] text-slate-500">
                  Характерно для сосудистой недостаточности при критическом стенозе
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.contralateralArteryDisease}
                onChange={(e) => onChange({ contralateralArteryDisease: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Атеросклероз контрлатеральной артерии ≥ 50% (п. 10.5)
                </span>
                <span className="text-[10px] text-slate-500">
                  Генерализованный церебральный атеросклероз
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* 3. High & Low Risk Cardiac Sources (Appendix 1) */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Кардиоэмболические источники (Приложение 1 к Протоколу МЗ РБ № 1)</span>
          </div>
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            Высокий риск: {data.highRiskCardiacSources?.length || 0} | Низкий/неопределенный: {data.lowRiskCardiacSources?.length || 0}
          </span>
        </h3>

        {/* High Risk Section */}
        <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider">
              Источники высокого риска кардиоэмболии (п. 11.1 и Приложение 1)
            </span>
            <button
              type="button"
              onClick={() => setShowAllHighSources(!showAllHighSources)}
              className="text-xs text-rose-700 dark:text-rose-300 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{showAllHighSources ? 'Свернуть' : 'Показать все (11)'}</span>
              {showAllHighSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(showAllHighSources ? HIGH_RISK_CARDIAC_SOURCES : HIGH_RISK_CARDIAC_SOURCES.slice(0, 4)).map((item) => {
              const isChecked = (data.highRiskCardiacSources || []).includes(item.key);
              return (
                <label
                  key={item.key}
                  className={`p-2.5 rounded-lg border transition cursor-pointer flex items-start space-x-2 ${
                    isChecked
                      ? 'bg-rose-100 dark:bg-rose-900/50 border-rose-400 dark:border-rose-700'
                      : 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/40 hover:border-rose-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleHighRiskSource(item.key)}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4 shrink-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {item.nameRu}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.detailRu}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Low / Uncertain Risk Section */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Источники низкого или неопределенного риска (Приложение 1)
            </span>
            <button
              type="button"
              onClick={() => setShowAllLowSources(!showAllLowSources)}
              className="text-xs text-slate-600 dark:text-slate-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{showAllLowSources ? 'Свернуть' : 'Показать все (9)'}</span>
              {showAllLowSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(showAllLowSources ? LOW_RISK_CARDIAC_SOURCES : LOW_RISK_CARDIAC_SOURCES.slice(0, 4)).map((item) => {
              const isChecked = (data.lowRiskCardiacSources || []).includes(item.key);
              return (
                <label
                  key={item.key}
                  className={`p-2.5 rounded-lg border transition cursor-pointer flex items-start space-x-2 ${
                    isChecked
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleLowRiskSource(item.key)}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4 shrink-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {item.nameRu}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.detailRu}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Embolic distribution flags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={data.bihemisphericAcuteInfarcts}
              onChange={(e) => onChange({ bihemisphericAcuteInfarcts: e.target.checked })}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Биполушарные острые инфаркты (п. 11.2)
              </span>
              <span className="text-[10px] text-slate-500">
                Очаги в разных сосудистых бассейнах — сильный маркер кардиоэмболии
              </span>
            </div>
          </label>

          <label className="flex items-start space-x-2.5 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={data.systemicEmbolism}
              onChange={(e) => onChange({ systemicEmbolism: e.target.checked })}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Системная тромбоэмболия в анамнезе (п. 11.2)
              </span>
              <span className="text-[10px] text-slate-500">
                Тромбоэмболия почечных, селезеночных или артерий конечностей
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
