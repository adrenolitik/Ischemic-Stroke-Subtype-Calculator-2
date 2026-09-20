import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Brain,
  ShieldAlert,
  FileText,
  Heart,
  Pill,
  Flame,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { TOAST_SUBTYPES_MAP, OCSP_INFO_MAP } from '../utils/calculator';
import {
  HIGH_RISK_CARDIAC_SOURCES,
  LOW_RISK_CARDIAC_SOURCES,
  RARE_ETIOLOGIES
} from '../data/protocolData';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'toast' | 'reperfusion' | 'doac' | 'malignant' | 'rare' | 'sources'>('toast');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Клиническое руководство и нормативная литература
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Протокол МЗ РБ № 1 (2026 г.) и фундаментальные руководства для врачей
              </p>
            </div>
          </div>

          <button
            id="close-reference-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 pt-2 gap-1 overflow-x-auto bg-slate-50/50 dark:bg-slate-900">
          {[
            { id: 'toast', label: 'TOAST & OCSP' },
            { id: 'reperfusion', label: 'Реперфузия (ТЛТ / ВСТЭ)' },
            { id: 'doac', label: 'ОАК & ДААТ (Таблицы)' },
            { id: 'malignant', label: 'Злокачественный инфаркт' },
            { id: 'rare', label: 'Редкие причины (ODE)' },
            { id: 'sources', label: 'Литература и источники' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-bold whitespace-nowrap rounded-t-lg transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
          
          {/* TAB 1: TOAST & OCSP */}
          {activeTab === 'toast' && (
            <div className="space-y-6">
              {/* TOAST Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>Классификация TOAST 2.0 (5 этиологических категорий)</span>
                </h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {Object.values(TOAST_SUBTYPES_MAP).map((sub) => (
                    <div key={sub.key} className={`p-3 rounded-xl border ${sub.bgColor} ${sub.borderColor}`}>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{sub.nameRu} ({sub.code})</span>
                        <span className="text-[10px] font-mono uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200">
                          {sub.nameEn}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                        {sub.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* OCSP Section */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Топографическая классификация OCSP</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(OCSP_INFO_MAP).map((ocsp) => (
                    <div key={ocsp.key} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{ocsp.key}</span>
                        <span className="text-[10px] font-medium text-slate-500">{ocsp.fullNameEn}</span>
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300">{ocsp.description}</div>
                      <div className="text-[11px] text-slate-500 font-medium pt-1">
                        Бассейн: {ocsp.territoryRu}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REPERFUSION */}
          {activeTab === 'reperfusion' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Регламент реперфузионной терапии (п. 27–38 Протокола МЗ РБ № 1)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-2">
                  <span className="font-bold text-blue-950 dark:text-blue-200 block">
                    1. Системный тромболизис (ТЛТ, Алтеплаза 0.9 мг/кг, макс. 90 мг):
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    <li>• <strong>Окно 0–4.5 ч:</strong> Всем пациентам при исключении внутричерепного кровоизлияния и противопоказаний (п. 27).</li>
                    <li>• <strong>Окно 4.5–9 ч и Wake-Up:</strong> При несоответствии объема гипоперфузии и зоны инфаркта на КТ-перфузии или DWI-FLAIR mismatch на МРТ (п. 28.2).</li>
                    <li>• <strong>Целевое АД:</strong> Снижение &lt; 185/110 перед введением, поддержание &lt; 180/105 в течение первых 24 часов (п. 26.2).</li>
                    <li>• <strong>Прием ПОАК:</strong> ТЛТ противопоказана, если ПОАК принимался &lt; 12–24 ч, кроме пациентов на Дабигатране при наличии специфического антидота Идаруцизумаба (п. 28.4).</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 space-y-2">
                  <span className="font-bold text-purple-950 dark:text-purple-200 block">
                    2. Механическая тромбэкстракция (ВСТЭ):
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    <li>• <strong>Окно 0–6 ч:</strong> Окклюзия дистальной ВСА или М1 сегмента СМА, NIHSS &ge; 6, pre-mRS 0–2, ASPECT &ge; 6 (п. 30).</li>
                    <li>• <strong>Окно 6–24 ч (DAWN / DEFUSE-3):</strong> Окклюзия ВСА/М1 при подтверждении клинико-перфузионного несоответствия (ядро &lt; 70 мл, пенумбра &gt; 15 мл) (п. 33–35).</li>
                    <li>• <strong>Окклюзия сегмента М2 СМА:</strong> Рекомендуется ВСТЭ при выраженном дефиците (п. 31).</li>
                    <li>• <strong>Окклюзия основной артерии (БА):</strong> Окно до 24 ч при pc-ASPECT 7–10 (п. 37).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOAC & DAPT TABLES */}
          {activeTab === 'doac' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4" />
                <span>Алгоритмы выбора антитромботической терапии (Приложения 14 и 15)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block mb-2">
                    Сроки возобновления / старта ОАК (Таблица п. 43.1):
                  </span>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-slate-600">
                        <th className="py-1">Срок</th>
                        <th className="py-1">Тяжесть / Размер инфаркта</th>
                        <th className="py-1">Условия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                        <td className="py-1.5 font-bold text-blue-600">1-е сутки</td>
                        <td>ТИА или инфаркт &lt; 1.5 см, NIHSS &lt; 8</td>
                        <td>КТ/МРТ: нет признаков крови</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-blue-600">3-и сутки</td>
                        <td>Очаг 1.5–3.0 см, NIHSS 8–15</td>
                        <td>Контроль КТ перед стартом</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-blue-600">6-е сутки</td>
                        <td>Очаг &gt; 3.0 см, NIHSS &gt; 15</td>
                        <td>Обязательна повторная КТ</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-rose-600">10–14-е сутки</td>
                        <td>Критический размер / геморрагическая трансформация</td>
                        <td>Решение консилиума</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Выбор ПОАК при фибрилляции предсердий (Приложение 14):
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    <li>• <strong>CrCl 15–29 мл/мин:</strong> Апиксабан (2.5 мг 2 р/д) или Варфарин (МНО 2.0–3.0). Дабигатран противопоказан!</li>
                    <li>• <strong>CrCl 30–49 мл/мин:</strong> Ривароксабан 15 мг 1 р/д, Дабигатран 110 мг 2 р/д, Апиксабан 2.5–5 мг 2 р/д.</li>
                    <li>• <strong>ЖКК в анамнезе / диспепсия:</strong> Апиксабан 5 мг 2 р/д (наименьший риск ЖКК) или Дабигатран 110 мг.</li>
                    <li>• <strong>Зондовое питание (дисфагия):</strong> Ривароксабан, Апиксабан (можно измельчать). Капсулы Дабигатрана вскрывать запрещено!</li>
                    <li>• <strong>Масса тела &gt; 120 кг:</strong> Предпочтителен Варфарин под контролем МНО.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MALIGNANT STROKE */}
          {activeTab === 'malignant' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4" />
                <span>Злокачественный инфаркт мозга (п. 17, 44 Протокола МЗ РБ № 1)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/60 space-y-2">
                  <span className="font-bold text-rose-950 dark:text-rose-200 block">
                    Критерии злокачественного инфаркта бассейна СМА (п. 17.1):
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    <li>• Ишемический очаг занимает &gt; 50% территории кровоснабжения СМА.</li>
                    <li>• Объем инфаркта &gt; 145 мл на ДВИ-МРТ.</li>
                    <li>• Смещение срединных структур мозга (латеральная дислокация) &gt; 5 мм.</li>
                    <li>• Прогрессирующее угнетение уровня сознания по шкале комы Глазго.</li>
                  </ul>
                  <div className="pt-2 text-rose-900 dark:text-rose-200 font-bold">
                    Тактика (п. 44.1): Экстренная декомпрессивная гемикраниэктомия в течение первых 48 часов от дебюта у пациентов в возрасте до 60 лет (диаметр трепанационного окна &ge; 12 см).
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Злокачественный инфаркт мозжечка (п. 17.2, 44.2):
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">
                    Инфаркт &gt; 1/3 полушария мозжечка со сдавлением IV желудочка, ствола мозга и окклюзионной гидроцефалией. Показана субокципитальная декомпрессивная краниэктомия и (при необходимости) наружное вентрикулярное дренирование.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RARE CAUSES */}
          {activeTab === 'rare' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span>Причины редкой этиологии (п. 13 и Приложение 16 к Протоколу МЗ РБ № 1)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {RARE_ETIOLOGIES.map((r) => (
                  <div key={r.key} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <span className="font-bold text-slate-900 dark:text-white block">{r.titleRu}</span>
                    <span className="text-slate-500 text-[11px]">{r.descRu}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SOURCES & LITERATURE */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Нормативные документы и фундаментальные руководства</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/40 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold uppercase">
                    Национальный клинический протокол
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Клинический протокол «Фармакотерапия и хирургическое лечение пациентов с острыми нарушениями мозгового кровообращения»
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Утвержден Постановлением Министерства здравоохранения Республики Беларусь № 1 от 05.01.2026 г. Включает приложения 1–16 (критерии кардиоэмболии, шкала NIHSS, шкала ABCD², ASPECT, протоколы ТЛТ и ВСТЭ, дозирование ПОАК, шкала HAS-BLED, хирургия декомпрессии).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/40 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold uppercase">
                    Практическое руководство для врачей (2024 г.)
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Ишемический инсульт: диагностика, лечение, реабилитация и профилактика. Руководство для врачей / О.И. Виноградов, А.А. Кулеш, Д.А. Демин. - М.: Логосфера, 2024. - 256 с.
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Фундаментальное руководство, систематизирующее принципы мультимодальной нейровизуализации (КТ- и МРТ-перфузия, DWI-FLAIR mismatch), стратификацию этиологических механизмов TOAST/ASCOD, современные режимы системного тромболизиса и эндоваскулярной тромбэкстракции, а также доказательную вторичную профилактику.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Международные валидированные классификации и шкалы:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                    <li><strong>TOAST:</strong> Adams HP Jr, et al. Classification of subtype of acute ischemic stroke. Definitions for use in a multicenter clinical trial. <em>Stroke</em>, 1993; 24(1): 35–41.</li>
                    <li><strong>OCSP:</strong> Bamford J, Sandercock P, et al. Classification and natural history of clinically identifiable subtypes of cerebral infarction. <em>Lancet</em>, 1991; 337: 1521–1526.</li>
                    <li><strong>ESUS:</strong> Hart RG, Diener HC, et al. Embolic strokes of undetermined source: the case for a new clinical construct. <em>Lancet Neurol</em>, 2014; 13(4): 429–438.</li>
                    <li><strong>ASPECTS:</strong> Barber PA, et al. Validity and reliability of a quantitative computed tomography score in predicting outcome of hyperacute stroke. <em>Lancet</em>, 2000; 355: 1670–1674.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Постановление Министерства здравоохранения Республики Беларусь № 1 от 05.01.2026
          </span>
          <button
            id="close-reference-footer-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
};
