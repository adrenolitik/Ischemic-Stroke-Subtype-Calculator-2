import React, { useState } from 'react';
import {
  PatientData,
  RareCauseKey,
  ArteryOcclusionSegment,
  ImagingModality
} from '../../types';
import {
  ASPECT_REGIONS,
  PC_ASPECT_REGIONS,
  RARE_ETIOLOGIES
} from '../../data/protocolData';
import {
  FileScan,
  Brain,
  Layers,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  Sparkles
} from 'lucide-react';

interface Step5Props {
  data: PatientData;
  onChange: (updated: Partial<PatientData>) => void;
}

export const Step5Imaging: React.FC<Step5Props> = ({ data, onChange }) => {
  const [showAspectDetail, setShowAspectDetail] = useState(false);
  const [showRareDetails, setShowRareDetails] = useState(false);

  const toggleRareCause = (key: RareCauseKey) => {
    const current = data.selectedRareCauses || [];
    const exists = current.includes(key);
    const updated = exists
      ? current.filter((k) => k !== key)
      : [...current, key];
    onChange({ selectedRareCauses: updated });
  };

  return (
    <div className="space-y-6">
      {/* 1. Modality and Primary CT/MRI Rules */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileScan className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Нейровизуализация (КТ / МРТ) по Протоколу МЗ РБ № 1</span>
          </h3>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Метод:</span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700">
              {(['CT', 'MRI', 'CTP_CTA'] as ImagingModality[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChange({ imagingModality: mode })}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    data.imagingModality === mode
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {mode === 'CT' && 'КТ'}
                  {mode === 'MRI' && 'МРТ'}
                  {mode === 'CTP_CTA' && 'КТА + КТ-перфузия'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Intracranial Hemorrhage Checker (Absolute Exclusion for IVT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="flex items-start space-x-3 p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/50 cursor-pointer">
            <input
              type="checkbox"
              checked={!data.intracranialHemorrhageCT}
              onChange={(e) => onChange({ intracranialHemorrhageCT: !e.target.checked })}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block">
                Внутричерепное кровоизлияние (ВМК/САК) ИСКЛЮЧЕНО
              </span>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300">
                Обязательное условие начала системного тромболизиса (п. 27)
              </span>
            </div>
          </label>

          <label className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={data.perfusionMismatchConfirmed}
              onChange={(e) => onChange({ perfusionMismatchConfirmed: e.target.checked })}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Перфузионно-диффузионное несоответствие (Mismatch)
              </span>
              <span className="text-[10px] text-slate-500">
                Объем ядра &lt; 70 мл, пенумбра &gt; 15 мл (для окон 4.5–9 ч и Wake-up) (п. 28.2)
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* 2. ASPECT Score & Large Vessel Occlusion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ASPECT Score */}
        <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Шкала ASPECT (Приложение 8)</span>
            </h4>
            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
              {data.aspectScore} / 10 баллов
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={data.aspectScore}
              onChange={(e) => onChange({ aspectScore: parseInt(e.target.value) || 0 })}
              className="w-full accent-purple-600 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span className="text-rose-600 font-bold">0–5 (Большой инфаркт)</span>
              <span className="text-amber-600 font-bold">6–7 (ВСТЭ допустима)</span>
              <span className="text-emerald-600 font-bold">8–10 (Идеально для ВСТЭ)</span>
            </div>

            {data.aspectScore < 6 && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900/50">
                ⚠ ASPECT &lt; 6: обширный очаг ишемии. Повышенный риск геморрагической трансформации. ВСТЭ требует взвешивания пользы/риска (п. 30).
              </p>
            )}
            {data.aspectScore >= 6 && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                ✓ ASPECT ≥ 6: критерий включения для механической тромбэкстракции (п. 30.2, 33).
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setShowAspectDetail(!showAspectDetail)}
              className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              {showAspectDetail ? 'Скрыть 10 зон ASPECT' : 'Развернуть 10 анатомических зон ASPECT'}
            </button>

            {showAspectDetail && (
              <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                {ASPECT_REGIONS.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">{r.id}:</span>
                    <span className="text-[10px] text-slate-500 truncate ml-1">{r.nameRu}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Large Vessel Occlusion & EVT */}
        <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-rose-600" />
            <span>Окклюзия крупной артерии (LVO) и ВСТЭ (п. 30–37)</span>
          </h4>

          <div className="space-y-3">
            <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                checked={data.largeVesselOcclusionConfirmed}
                onChange={(e) => {
                  const val = e.target.checked;
                  onChange({
                    largeVesselOcclusionConfirmed: val,
                    occludedArterySegment: val ? (data.occludedArterySegment === 'none' ? 'MCA_M1' : data.occludedArterySegment) : 'none'
                  });
                }}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Подтверждена окклюзия крупной внутричерепной артерии (КТА/МРА)
                </span>
                <span className="text-[10px] text-slate-500">
                  Показание к экстренной эндоваскулярной тромбэкстракции (ВСТЭ)
                </span>
              </div>
            </label>

            {data.largeVesselOcclusionConfirmed && (
              <div className="space-y-1.5 pl-2">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Сегмент окклюзированной артерии (п. 30.1, 37):
                </label>
                <select
                  value={data.occludedArterySegment || 'MCA_M1'}
                  onChange={(e) => onChange({ occludedArterySegment: e.target.value as ArteryOcclusionSegment })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-medium outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="MCA_M1">СМА: сегмент М1 (окно 0–6 ч, до 24 ч по DAWN/DEFUSE-3)</option>
                  <option value="ICA_T">ВСА: дистальный отдел / Т-сифон (окно 0–6 ч, до 24 ч)</option>
                  <option value="MCA_M2">СМА: сегмент М2 (рекомендуется ВСТЭ, п. 31)</option>
                  <option value="Basilar">Основная артерия (BA) (окно до 24 ч при pc-ASPECT 7–10, п. 37)</option>
                  <option value="ACA">Передняя мозговая артерия (ПМА)</option>
                  <option value="VA_PCA">Позвоночная артерия (ПА) / ЗМА</option>
                  <option value="none">Без окклюзии крупной артерии</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Infarct Size & Precision OAC Timing */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Размеры очага инфаркта и сроки начала антикоагулянтов (п. 12, 43.1)</span>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            Диаметр: {data.infarctDiameterCm} см
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
              Максимальный размер очага ишемии (см):
            </label>
            <input
              type="number"
              step="0.1"
              min={0.1}
              max={12.0}
              value={data.infarctDiameterCm || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                onChange({
                  infarctDiameterCm: val,
                  lacunarDiameterUnder20mm: val <= 2.0,
                  imagingFocusSize: val <= 1.5 ? 'lacunar' : 'large_territorial'
                });
              }}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
            />

            <div className="text-[11px] text-slate-500 space-y-1">
              <div>• &le; 1.5 см (&le; 2.0 см на МРТ) — лакунарный очаг (п. 12.3)</div>
              <div>• 1.5–3.0 см — инфаркт средней величины (старт ОАК на 3-и сутки)</div>
              <div>• &gt; 3.0 см — крупный инфаркт (старт ОАК на 6-е сутки) (п. 43.1)</div>
            </div>
          </div>

          {/* OAC Start Rule Preview */}
          <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 flex flex-col justify-between text-xs">
            <div>
              <span className="font-bold text-blue-950 dark:text-blue-200 block mb-1">
                Таблица сроков возобновления / назначения ОАК (п. 43.1 Протокола МЗ РБ № 1):
              </span>
              <ul className="text-[11px] text-blue-900 dark:text-blue-300 space-y-1">
                <li>• <strong>1-е сутки:</strong> ТИА или инфаркт &lt; 1.5 см при NIHSS &lt; 8</li>
                <li>• <strong>3-и сутки:</strong> Инфаркт 1.5–3 см при NIHSS 8–15</li>
                <li>• <strong>6-е сутки:</strong> Инфаркт &gt; 3 см при NIHSS &gt; 15</li>
                <li>• <strong>10–14-е сутки:</strong> Критический размер, геморрагическая трансформация</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-blue-200 dark:border-blue-900/60 mt-2 font-semibold text-[11px] text-blue-800 dark:text-blue-200">
              Перед стартом ОАК обязательна контрольная КТ/МРТ для исключения геморрагической трансформации!
            </div>
          </div>
        </div>
      </div>

      {/* 4. Malignant Stroke Warnings (Item 17, 44) */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 p-4 sm:p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 space-y-3">
        <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-600" />
          <span>Критерии злокачественного инфаркта (п. 17, 44 Протокола МЗ РБ № 1)</span>
        </h3>
        <p className="text-xs text-rose-800 dark:text-rose-300">
          Угроза сдавления ствола мозга и дислокации — показание к экстренной декомпрессивной краниэктомии:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-start space-x-2.5 p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-rose-200 dark:border-rose-900/50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.isMalignantMCASuspected}
              onChange={(e) => onChange({ isMalignantMCASuspected: e.target.checked })}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-bold text-rose-950 dark:text-rose-200 block">
                Злокачественный инфаркт в бассейне СМА (п. 17.1, 44.1)
              </span>
              <span className="text-[10px] text-rose-800 dark:text-rose-300">
                Очаг &gt; 50% бассейна СМА, объем &gt; 145 мл (DWI), смещение срединных структур &gt; 5 мм. Декомпрессивная гемикраниэктомия в первые 48 ч!
              </span>
            </div>
          </label>

          <label className="flex items-start space-x-2.5 p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-rose-200 dark:border-rose-900/50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.isMalignantCerebellarSuspected}
              onChange={(e) => onChange({ isMalignantCerebellarSuspected: e.target.checked })}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-bold text-rose-950 dark:text-rose-200 block">
                Злокачественный инфаркт мозжечка (п. 17.2, 44.2)
              </span>
              <span className="text-[10px] text-rose-800 dark:text-rose-300">
                Инфаркт &gt; 1/3 полушария мозжечка, деформация 4-го желудочка, гидроцефалия. Субокципитальная декомпрессия задней черепной ямки.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* 5. Rare Etiology Checklist (Item 13, Appendix 16) */}
      <div className="bg-white dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Инсульт другой установленной этиологии (ODE, п. 13 и Приложение 16)</span>
          </h3>
          <button
            type="button"
            onClick={() => setShowRareDetails(!showRareDetails)}
            className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            {showRareDetails ? 'Свернуть список' : 'Показать редкие причины (11)'}
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Особенно актуально у пациентов моложе 55 лет, при отсутствии кардиальной эмболии и атеротромбоза:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(showRareDetails ? RARE_ETIOLOGIES : RARE_ETIOLOGIES.slice(0, 4)).map((rare) => {
            const isChecked = (data.selectedRareCauses || []).includes(rare.key);
            return (
              <label
                key={rare.key}
                className={`p-2.5 rounded-lg border transition cursor-pointer flex items-start space-x-2 ${
                  isChecked
                    ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-400 dark:border-purple-700'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleRareCause(rare.key)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4 shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {rare.titleRu}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {rare.descRu}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        <div className="pt-2">
          <label className="flex items-start space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={data.dissectionOrSurgeryTemporalLink}
              onChange={(e) => onChange({ dissectionOrSurgeryTemporalLink: e.target.checked })}
              className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Временная связь с травмой шеи, мануальной терапией, ангиографией или операцией (п. 13)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
