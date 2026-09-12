/**
 * Clinical Protocol of the Ministry of Health of the Republic of Belarus
 * Resolution No. 1 of 05.01.2026
 * Constants, Appendixes and Clinical Knowledge Base
 */

import {
  HighRiskCardiacSourceKey,
  LowRiskCardiacSourceKey,
  RareCauseKey
} from '../types';

export const HIGH_RISK_CARDIAC_SOURCES: {
  key: HighRiskCardiacSourceKey;
  num: number;
  nameRu: string;
  detailRu: string;
}[] = [
  {
    key: 'af_or_flutter',
    num: 1,
    nameRu: 'Фибрилляция и трепетание предсердий (ФП/ТП)',
    detailRu: 'Пароксизмальная, персистирующая или постоянная форма'
  },
  {
    key: 'atrial_or_ventricular_thrombus',
    num: 2,
    nameRu: 'Тромб левого предсердия или левого желудочка',
    detailRu: 'Подтвержденный на ТТ-ЭхоКГ, ЧП-ЭхоКГ или МРТ сердца'
  },
  {
    key: 'sick_sinus_syndrome',
    num: 3,
    nameRu: 'Синдром слабости синусового узла (СССУ)',
    detailRu: 'Стенокардия пауз, тахи-бради синдром'
  },
  {
    key: 'mitral_stenosis_or_rheumatic',
    num: 4,
    nameRu: 'Митральный стеноз или ревматическое поражение клапанов',
    detailRu: 'Умеренно-тяжелый стеноз митрального отверстия'
  },
  {
    key: 'prosthetic_valve',
    num: 5,
    nameRu: 'Биопротезы и механические клапаны сердца',
    detailRu: 'Любой механический или биологический протез'
  },
  {
    key: 'recent_mi_under_1m',
    num: 6,
    nameRu: 'Недавний инфаркт миокарда (< 1 месяца до инсульта)',
    detailRu: 'Острый или подострый период ИМ'
  },
  {
    key: 'post_mi_ef_under_28',
    num: 7,
    nameRu: 'Последствия ИМ со снижением ФВ (< 28%)',
    detailRu: 'Тяжелая систолическая дисфункция левого желудочка'
  },
  {
    key: 'dcm_ef_under_40',
    num: 8,
    nameRu: 'Дилатационная кардиомиопатия (ДКМП)',
    detailRu: 'Дилатация ЛЖ с фракцией выброса < 40% или укорочением < 25%'
  },
  {
    key: 'infective_endocarditis',
    num: 9,
    nameRu: 'Инфекционный / небактериальный тромботический эндокардит',
    detailRu: 'Вегетации на створках клапанов'
  },
  {
    key: 'papillary_fibroelastoma',
    num: 10,
    nameRu: 'Папиллярная фиброэластома клапанов',
    detailRu: 'Доброкачественная опухоль клапанного аппарата'
  },
  {
    key: 'atrial_myxoma',
    num: 11,
    nameRu: 'Миксома левого предсердия',
    detailRu: 'Внутриполостное объемное образование сердца'
  }
];

export const LOW_RISK_CARDIAC_SOURCES: {
  key: LowRiskCardiacSourceKey;
  num: number;
  nameRu: string;
  detailRu: string;
}[] = [
  {
    key: 'mitral_annular_calcification',
    num: 1,
    nameRu: 'Кальциноз митрального кольца',
    detailRu: 'Изолированный фиброкальциноз без тяжелого стеноза'
  },
  {
    key: 'pfo_or_asa',
    num: 2,
    nameRu: 'Открытое овальное окно (ООО) и/или аневризма МПП',
    detailRu: 'Потенциальный путь парадоксальной венозно-артериальной эмболии'
  },
  {
    key: 'lv_aneurysm_no_thrombus',
    num: 3,
    nameRu: 'Аневризма левого желудочка без тромба',
    detailRu: 'Постинфарктная аневризма без признаков пристеночного тромбоза'
  },
  {
    key: 'spontaneous_echo_contrast',
    num: 4,
    nameRu: 'Феномен спонтанного эхо-контрастирования в левом предсердии',
    detailRu: 'Стаз крови («дым») в полости предсердия или ушке'
  },
  {
    key: 'chf_ef_under_30',
    num: 5,
    nameRu: 'Застойная сердечная недостаточность с ФВ < 30%',
    detailRu: 'ХСН IIБ-III стадии'
  },
  {
    key: 'wall_motion_abnormality',
    num: 6,
    nameRu: 'Нарушения локальной кинетики стенок ЛЖ',
    detailRu: 'Гипокинезия, акинезия, дискинезия, апикальный акинез'
  },
  {
    key: 'hcm_or_lvh',
    num: 7,
    nameRu: 'Гипертрофическая КМП или выраженная гипертрофия ЛЖ',
    detailRu: 'Толщина МЖП / ЗСЛЖ > 15 мм'
  },
  {
    key: 'lv_noncompaction',
    num: 8,
    nameRu: 'Гипертрабекулярность (некомпактность) левого желудочка',
    detailRu: 'Двухслойный миокард с глубокими трабекулярными углублениями'
  },
  {
    key: 'aortic_atheroma_over_4mm',
    num: 9,
    nameRu: 'Атерома в восходящей аорте / дуге (> 4 мм или изъязвленная)',
    detailRu: 'Мобильные атероматозные бляшки дуги аорты'
  }
];

export const RARE_CAUSES_LIST: {
  key: RareCauseKey;
  nameRu: string;
  categoryRu: string;
  preventionRu: string;
}[] = [
  {
    key: 'arterial_dissection',
    nameRu: 'Диссекция экстра- или интракраниальных артерий',
    categoryRu: 'Невоспалительные артериопатии',
    preventionRu: 'ОАК (ПОАК / Варфарин) или ДААТ (Клопидогрел + АСК) на 3–6 месяцев (п. 43.3)'
  },
  {
    key: 'rcvs',
    nameRu: 'Синдром обратимой церебральной вазоконстрикции (RCVS)',
    categoryRu: 'Вазоконстрикторные синдромы',
    preventionRu: 'Симптоматическая терапия, избегание вазоконстрикторов, нимодипин'
  },
  {
    key: 'moyamoya',
    nameRu: 'Болезнь / синдром Мойя-Мойя',
    categoryRu: 'Невоспалительные артериопатии',
    preventionRu: 'АСК 75–100 мг/сут. длительно, рассмотрение реваскуляризации (Приложение 16)'
  },
  {
    key: 'fibromuscular_dysplasia',
    nameRu: 'Фибромускулярная дисплазия',
    categoryRu: 'Невоспалительные артериопатии',
    preventionRu: 'АСК 75–150 мг/сут. или Клопидогрел 75 мг/сут. длительно (Приложение 16)'
  },
  {
    key: 'cadasil_carasil',
    nameRu: 'CADASIL / CARASIL / MELAS',
    categoryRu: 'Генетические микроангиопатии',
    preventionRu: 'Контроль факторов риска, антиагреганты с осторожностью при микрокровоизлияниях'
  },
  {
    key: 'fabry_disease',
    nameRu: 'Болезнь Фабри',
    categoryRu: 'Болезни накопления',
    preventionRu: 'Ферментозаместительная терапия, антиагреганты'
  },
  {
    key: 'cns_vasculitis',
    nameRu: 'Изолированный ангиит ЦНС / гигантоклеточный артериит',
    categoryRu: 'Воспалительные заболевания сосудов',
    preventionRu: 'Глюкокортикоиды, иммуносупрессивная терапия'
  },
  {
    key: 'antiphospholipid_syndrome',
    nameRu: 'Антифосфолипидный синдром (АФС)',
    categoryRu: 'Гематологические причины',
    preventionRu: 'Варфарин (целевое МНО 2.0–3.0) при доказанном АФС; при изолированных АФА — АСК 75–150 мг/сут (Приложение 16)'
  },
  {
    key: 'hereditary_thrombophilia',
    nameRu: 'Наследственная тромбофилия (Лейден, протромбин 20210A)',
    categoryRu: 'Гематологические причины',
    preventionRu: 'АСК 75–150 мг/сут. или клопидогрел 75 мг/сут. (Приложение 16) либо ОАК при венозных тромбоэмболиях'
  },
  {
    key: 'sinus_venous_thrombosis',
    nameRu: 'Тромбоз венозных синусов ГМ',
    categoryRu: 'Церебральные венозные тромбозы',
    preventionRu: 'Лечебные дозы НМГ/гепарина в острой фазе, затем ОАК на 3–12 месяцев'
  },
  {
    key: 'migrainous_infarction',
    nameRu: 'Мигренозный инфаркт мозга',
    categoryRu: 'Редкие функциональные причины',
    preventionRu: 'Профилактика мигрени, антиагреганты, запрет триптанов в острой фазе'
  }
];

export const RARE_ETIOLOGIES = RARE_CAUSES_LIST.map((r) => ({
  key: r.key,
  titleRu: r.nameRu,
  descRu: `${r.categoryRu}. ${r.preventionRu}`
}));

export const DOAC_APPENDIX_14_RULES = [
  {
    situation: 'Механический клапан или ФП с тяжелым митральным стенозом',
    recommended: 'Варфарин (целевое МНО 2.5–3.5 + АСК 75-100 мг при митральном клапане)',
    rationale: 'ПОАК строго противопоказаны при механических клапанах сердца!'
  },
  {
    situation: 'Высокий риск кровотечения (HAS-BLED ≥ 3) или тревога пациента',
    recommended: 'Апиксабан или Дабигатран 110 мг 2 р/сут или Ривароксабан',
    rationale: 'Снижение риска кровотечений по сравнению с Варфарином'
  },
  {
    situation: 'Желудочно-кишечное кровотечение (ЖКК) в анамнезе',
    recommended: 'Апиксабан или Дабигатран 110 мг 2 р/сут или Варфарин',
    rationale: 'Избегать Дабигатран 150 мг 2 р/сут и Ривароксабан (более высокие риски повторного ЖКК)'
  },
  {
    situation: 'Диспепсия при приеме препаратов',
    recommended: 'Апиксабан, Ривароксабан или Варфарин',
    rationale: 'Диспепсия возникает у 10% на дабигатране (при необходимости приема — добавить ИПП пантопразол)'
  },
  {
    situation: 'Тяжелая почечная недостаточность (CrCl < 30 мл/мин)',
    recommended: 'Апиксабан или Варфарин',
    rationale: 'Дабигатран противопоказан (выводится почками на 80%). Апиксабан наименее выводится почками (27%)'
  },
  {
    situation: 'Умеренная почечная недостаточность (CrCl 30–50 мл/мин)',
    recommended: 'Апиксабан или Ривароксабан 15 мг 1 раз в сутки',
    rationale: 'Ингибиторы фактора Ха в меньшей степени зависят от почечной экскреции'
  },
  {
    situation: 'Масса тела > 120 кг или ИМТ > 40 кг/м²',
    recommended: 'Варфарин (под контролем МНО)',
    rationale: 'Недостаточно данных об эффективности ПОАК при экстремальном ожирении'
  },
  {
    situation: 'Затруднения глотания или введение через желудочный/назогастральный зонд',
    recommended: 'Апиксабан (измельчить) или Ривароксабан (измельчить с жирной пищей)',
    rationale: 'Капсулы Дабигатрана категорически запрещено вскрывать или измельчать!'
  }
];

export const ASPECT_REGIONS = [
  { id: 'C', nameRu: 'Хвостатое ядро (Caudate)' },
  { id: 'I', nameRu: 'Кора островка (Insular ribbon)' },
  { id: 'IC', nameRu: 'Внутренняя капсула (Internal Capsule)' },
  { id: 'L', nameRu: 'Чечевицеобразное ядро (Lentiform nucleus)' },
  { id: 'M1', nameRu: 'M1: Передняя кора СМА' },
  { id: 'M2', nameRu: 'M2: Кора латеральнее островка' },
  { id: 'M3', nameRu: 'M3: Задняя кора СМА' },
  { id: 'M4', nameRu: 'M4: Передняя территория на уровне желудочков' },
  { id: 'M5', nameRu: 'M5: Латеральная территория на уровне желудочков' },
  { id: 'M6', nameRu: 'M6: Задняя территория на уровне желудочков' }
];

export const PC_ASPECT_REGIONS = [
  { id: 'left_thalamus', nameRu: 'Левый таламус (-1 б.)' },
  { id: 'right_thalamus', nameRu: 'Правый таламус (-1 б.)' },
  { id: 'left_cerebellum', nameRu: 'Левое полушарие мозжечка (-1 б.)' },
  { id: 'right_cerebellum', nameRu: 'Правое полушарие мозжечка (-1 б.)' },
  { id: 'left_pca', nameRu: 'Левая затылочная доля / ЗМА (-1 б.)' },
  { id: 'right_pca', nameRu: 'Правая затылочная доля / ЗМА (-1 б.)' },
  { id: 'midbrain', nameRu: 'Средний мозг (-2 б.)' },
  { id: 'pons', nameRu: 'Мост мозга (-2 б.)' }
];
