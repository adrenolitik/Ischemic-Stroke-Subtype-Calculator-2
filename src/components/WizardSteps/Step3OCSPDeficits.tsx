import React from 'react';
import { PatientData } from '../../types';
import { calculateOCSP } from '../../utils/calculator';
import { Brain, Eye, Activity, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

interface Step3Props {
  data: PatientData;
  onChange: (updated: Partial<PatientData>) => void;
}

export const Step3OCSPDeficits: React.FC<Step3Props> = ({ data, onChange }) => {
  const ocsp = calculateOCSP(data);

  return (
    <div className="space-y-6">
      {/* OCSP Live Qualification Badge */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${ocsp.badgeBg}`}>
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-white/90 dark:bg-slate-900/90 rounded-xl shadow-xs shrink-0">
            <Brain className="w-6 h-6 text-slate-800 dark:text-slate-200" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Топографический синдром по Оксфордской классификации (OCSP):
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {ocsp.nameRu}
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 sm:text-right max-w-sm">
          {ocsp.territoryRu}
        </div>
      </div>

      {/* Neurological Deficit Checkers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Higher Cortical & Visual */}
        <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-amber-600" />
            <span>1. Корковые симптомы и поля зрения (Кора полушарий)</span>
          </h4>

          <div className="space-y-2.5">
            <label className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition">
              <input
                id="cortical-signs-checkbox"
                type="checkbox"
                checked={data.corticalSigns}
                onChange={(e) => {
                  const val = e.target.checked;
                  onChange({
                    corticalSigns: val,
                    pureMotorStroke: val ? false : data.pureMotorStroke,
                    pureSensoryStroke: val ? false : data.pureSensoryStroke
                  });
                }}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Высшие корковые нарушения (Higher Cortical Functions)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Афазия (моторная, сенсорная, тотальная), апраксия, агнозия, пространственный неглект (гемиагнозия)
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition">
              <input
                id="hemianopia-checkbox"
                type="checkbox"
                checked={data.hemianopia}
                onChange={(e) => {
                  const val = e.target.checked;
                  onChange({
                    hemianopia: val,
                    pureMotorStroke: val ? false : data.pureMotorStroke
                  });
                }}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Гомонимная гемианопсия</span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Выпадение одноименных половин полей зрения с обеих сторон (зрительный тракт / лучистость Грациоле / кора затылочной доли)
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Motor & Sensory Deficit */}
        <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>2. Двигательный и чувствительный дефицит</span>
          </h4>

          <div className="space-y-2.5">
            <label className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition">
              <input
                id="motor-deficit-checkbox"
                type="checkbox"
                checked={data.motorDeficit}
                onChange={(e) => onChange({ motorDeficit: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Двигательный дефицит (Гемипарез / Монопарез)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Снижение мышечной силы в конечностях или лицевой мускулатуре
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition">
              <input
                id="sensory-deficit-checkbox"
                type="checkbox"
                checked={data.sensoryDeficit}
                onChange={(e) => onChange({ sensoryDeficit: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Чувствительный дефицит (Гемигипестезия)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Выпадение болевой или тактильной чувствительности по гемитипу
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Classical Lacunar Syndromes (item 12.1) vs Brainstem (POCS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lacunar Syndromes */}
        <div className="bg-blue-50/60 dark:bg-blue-950/20 p-4 sm:p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-3">
          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center justify-between">
            <span>Изолированные лакунарные синдромы (п. 12.1)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-200/80 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">
              SVO
            </span>
          </h4>

          <div className="space-y-2">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                id="pure-motor-checkbox"
                type="checkbox"
                checked={data.pureMotorStroke}
                onChange={(e) => {
                  const val = e.target.checked;
                  onChange({
                    pureMotorStroke: val,
                    corticalSigns: val ? false : data.corticalSigns,
                    hemianopia: val ? false : data.hemianopia,
                    motorDeficit: val ? true : data.motorDeficit
                  });
                }}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-blue-950 dark:text-blue-200">
                Чистый двигательный инсульт (Pure Motor Stroke)
              </span>
            </label>

            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                id="pure-sensory-checkbox"
                type="checkbox"
                checked={data.pureSensoryStroke}
                onChange={(e) => {
                  const val = e.target.checked;
                  onChange({
                    pureSensoryStroke: val,
                    corticalSigns: val ? false : data.corticalSigns,
                    sensoryDeficit: val ? true : data.sensoryDeficit
                  });
                }}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-blue-950 dark:text-blue-200">
                Чистый чувствительный инсульт (Pure Sensory Stroke)
              </span>
            </label>

            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={data.sensorimotorStroke}
                onChange={(e) => onChange({ sensorimotorStroke: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-blue-950 dark:text-blue-200">
                Сенсомоторный инсульт (Sensorimotor Stroke)
              </span>
            </label>

            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={data.ataxicHemiparesis}
                onChange={(e) => onChange({ ataxicHemiparesis: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-blue-950 dark:text-blue-200">
                Атаксический гемипарез (Ataxic Hemiparesis)
              </span>
            </label>

            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={data.dysarthriaClumsyHand}
                onChange={(e) => onChange({ dysarthriaClumsyHand: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-blue-950 dark:text-blue-200">
                Синдром дизартрии и неловкой кисти (Dysarthria-Clumsy Hand)
              </span>
            </label>
          </div>

          <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/60">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={data.stereotypicTIAsLastWeek}
                onChange={(e) => onChange({ stereotypicTIAsLastWeek: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-blue-950 dark:text-blue-200 block">
                  Стереотипные повторные ТИА за последнюю неделю (п. 12.2)
                </span>
                <span className="text-[10px] text-blue-800/80 dark:text-blue-300/80">
                  Лакунарный предупреждающий синдром (Lacunar Warning Syndrome)
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Brainstem / Cerebellar (POCS) */}
        <div className="bg-purple-50/60 dark:bg-purple-950/20 p-4 sm:p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center justify-between">
              <span>Стволовые и мозжечковые симптомы</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-200/80 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-semibold">
                POCS
              </span>
            </h4>

            <label className="flex items-start space-x-3 cursor-pointer mt-3 p-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-purple-200 dark:border-purple-900/50">
              <input
                id="brainstem-checkbox"
                type="checkbox"
                checked={data.brainstemCerebellarSigns}
                onChange={(e) => onChange({ brainstemCerebellarSigns: e.target.checked })}
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
                  Стволовая и (или) мозжечковая симптоматика
                </span>
                <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 mt-1 leading-relaxed">
                  Парез взора, диплопия, бульбарный/псевдобульбарный синдром (дисфагия, дизартрия), альтернирующие синдромы (Валленберга-Захарченко, Вебера), атаксия конечностей, системное головокружение, нистагм.
                </p>
              </div>
            </label>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-100/70 dark:bg-purple-900/40 text-[11px] text-purple-900 dark:text-purple-200">
            Определяет локализацию в вертебробазилярном бассейне (ВББА). При окклюзии основной артерии — окно ВСТЭ до 24 ч при pc-ASPECT 7–10 (п. 37).
          </div>
        </div>
      </div>
    </div>
  );
};
