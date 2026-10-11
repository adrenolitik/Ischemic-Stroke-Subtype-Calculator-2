/**
 * Clinical Calculator of Stroke Etiological Subtype and Treatment Protocols
 * According to the Clinical Protocol of the Ministry of Health of the Republic of Belarus
 * Resolution No. 1 of 05.01.2026
 */

import {
  PatientData,
  CalculationResult,
  ToastSubtypeInfo,
  ToastSubtypeKey,
  SubtypeCertainty,
  SubtypeCalculationResult,
  ScoreDetailItem,
  OCSPInfo,
  OCSPCategoryKey,
  ESUSAssessment,
  ReperfusionAssessment,
  AntithromboticPlan,
  MalignantStrokeAlert,
  ABCD2Result,
  HasBledResult
} from '../types';

import {
  HIGH_RISK_CARDIAC_SOURCES,
  LOW_RISK_CARDIAC_SOURCES,
  RARE_CAUSES_LIST,
  DOAC_APPENDIX_14_RULES
} from '../data/protocolData';

export const TOAST_SUBTYPES_METADATA: Record<ToastSubtypeKey, ToastSubtypeInfo> = {
  atherothrombotic: {
    key: 'atherothrombotic',
    nameRu: 'Атеротромботический подтип (LAA)',
    shortRu: 'Атеротромботический',
    nameEn: 'Large-Artery Atherosclerosis (LAA)',
    code: 'TOAST-1 / I63.0',
    color: 'amber',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-300 dark:border-amber-800',
    description:
      'Атеросклероз церебральных и прецеребральных артерий со стенозом ≥ 50% или стенозом < 50% с изъязвлением/тромбозом бляшки.'
  },
  cardioembolic: {
    key: 'cardioembolic',
    nameRu: 'Кардиоэмболический подтип (CE)',
    shortRu: 'Кардиоэмболический',
    nameEn: 'Cardioembolism (CE)',
    code: 'TOAST-2 / I63.1',
    color: 'rose',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-300 dark:border-rose-800',
    description:
      'Окклюзия церебральной артерии эмболом кардиального происхождения при наличии подтвержденного источника эмболии высокого или умеренного риска.'
  },
  lacunar: {
    key: 'lacunar',
    nameRu: 'Лакунарный подтип (SVO)',
    shortRu: 'Лакунарный',
    nameEn: 'Small-Vessel Occlusion (SVO)',
    code: 'TOAST-3 / I63.3',
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-300 dark:border-blue-800',
    description:
      'Окклюзия перфорантных артерий малого калибра с формированием изолированного инфаркта < 20 мм (< 2 см) в подкорковых ядрах или стволе.'
  },
  other: {
    key: 'other',
    nameRu: 'Инсульт другой установленной этиологии (ODE)',
    shortRu: 'Другая этиология',
    nameEn: 'Stroke of Other Determined Etiology (ODE)',
    code: 'TOAST-4 / I63.8',
    color: 'purple',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-300 dark:border-purple-800',
    description:
      'Неатеросклеротические васкулопатии (диссекция, RCVS, Мойя-мойя), системные васкулиты, гематологические нарушения (АФС, тромбофилии).'
  },
  undetermined: {
    key: 'undetermined',
    nameRu: 'Инсульт неустановленной этиологии (UDE)',
    shortRu: 'Неустановленная этиология',
    nameEn: 'Stroke of Undetermined Etiology (UDE)',
    code: 'TOAST-5 / I63.9',
    color: 'slate',
    bgColor: 'bg-slate-50 dark:bg-slate-900/50',
    borderColor: 'border-slate-300 dark:border-slate-700',
    description:
      'Неполное обследование, криптогенный инсульт (включая ESUS) либо наличие двух и более конкурирующих причин.'
  }
};

export const OCSP_METADATA: Record<OCSPCategoryKey, OCSPInfo> = {
  TACS: {
    key: 'TACS',
    nameRu: 'Тотальный инфаркт передней циркуляции (TACS)',
    fullNameRu: 'Total Anterior Circulation Stroke',
    fullNameEn: 'Total Anterior Circulation Stroke',
    territoryRu: 'Каротидный бассейн: СМА + ПМА (полная окклюзия ствола СМА или ВСА)',
    description:
      'Триада признаков: высшие корковые нарушения (афазия/неглект) + гомонимная гемианопсия + двигательный и (или) чувствительный гемидефицит.',
    color: 'rose',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border-rose-300'
  },
  PACS: {
    key: 'PACS',
    nameRu: 'Парциальный инфаркт передней циркуляции (PACS)',
    fullNameRu: 'Partial Anterior Circulation Stroke',
    fullNameEn: 'Partial Anterior Circulation Stroke',
    territoryRu: 'Каротидный бассейн: ветви СМА или ПМА (корковые ветви)',
    description:
      'Присутствуют только 2 из 3 компонентов TACS, либо изолированное высшее корковое нарушение (например, афазия), либо изолированный монопарез.',
    color: 'amber',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-300'
  },
  LACS: {
    key: 'LACS',
    nameRu: 'Лакунарный синдром (LACS)',
    fullNameRu: 'Lacunar Stroke Syndrome',
    fullNameEn: 'Lacunar Stroke Syndrome',
    territoryRu: 'Бассейн перфорантных артерий: внутренняя капсула, базальные ганглии, мост мозга',
    description:
      'Один из классических лакунарных синдромов (чисто двигательный, чисто чувствительный, атаксический гемипарез, дизартрия-неловкая кисть) без корковых нарушений и гемианопсии.',
    color: 'blue',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-300'
  },
  POCS: {
    key: 'POCS',
    nameRu: 'Инфаркт задней циркуляции (POCS)',
    fullNameRu: 'Posterior Circulation Stroke',
    fullNameEn: 'Posterior Circulation Stroke',
    territoryRu: 'Вертебробазилярный бассейн (ВББА): ЗМА, основная и позвоночные артерии',
    description:
      'Стволовая и мозжечковая симптоматика: диплопия, парез взора, альтернирующие синдромы, мозжечковая атаксия, либо изолированная гемианопсия.',
    color: 'purple',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border-purple-300'
  }
};

export const TOAST_SUBTYPES_MAP = TOAST_SUBTYPES_METADATA;
export const OCSP_INFO_MAP = OCSP_METADATA;

/**
 * Calculates OCSP classification category
 */
export function calculateOCSP(data: PatientData): OCSPInfo {
  // Posterior circulation check
  if (data.brainstemCerebellarSigns) {
    return OCSP_METADATA.POCS;
  }

  // Pure lacunar check
  const isLacunarSyndrome =
    (data.pureMotorStroke ||
      data.pureSensoryStroke ||
      data.sensorimotorStroke ||
      data.ataxicHemiparesis ||
      data.dysarthriaClumsyHand) &&
    !data.corticalSigns &&
    !data.hemianopia;

  if (isLacunarSyndrome) {
    return OCSP_METADATA.LACS;
  }

  // Anterior circulation: count components of TACS
  let anteriorComponents = 0;
  if (data.corticalSigns) anteriorComponents++;
  if (data.hemianopia) anteriorComponents++;
  if (data.motorDeficit || data.sensoryDeficit) anteriorComponents++;

  if (anteriorComponents >= 3) {
    return OCSP_METADATA.TACS;
  }
  if (anteriorComponents >= 1) {
    return OCSP_METADATA.PACS;
  }

  // Fallback
  if (data.motorDeficit || data.sensoryDeficit) {
    return OCSP_METADATA.LACS;
  }
  return OCSP_METADATA.PACS;
}

/**
 * Calculates ABCD2 score for TIA (Appendix 13)
 */
export function calculateABCD2(data: PatientData): ABCD2Result {
  let score = 0;

  // A: Age >= 60
  if (data.age >= 60) score += 1;

  // B: BP >= 140/90
  if (data.systolicBP >= 140 || data.diastolicBP >= 90) score += 1;

  // C: Clinical features: Unilateral weakness (2 pts) or Speech disturbance without weakness (1 pt)
  if (data.motorDeficit) {
    score += 2;
  } else if (data.corticalSigns) {
    score += 1;
  }

  // D1: Duration: >= 60 min (2 pts), 10-59 min (1 pt)
  // Assuming clinical acute presentation duration >= 60 min if stroke workup
  score += 2;

  // D2: Diabetes
  if (data.diabetesMellitus) score += 1;

  let riskCategoryRu: 'Низкий' | 'Умеренный' | 'Высокий' = 'Низкий';
  let strokeRisk2Days = '1.0%';
  let strokeRisk7Days = '1.2%';
  let strokeRisk90Days = '3.1%';
  let daptIndicated = false;

  if (score >= 6) {
    riskCategoryRu = 'Высокий';
    strokeRisk2Days = '8.1%';
    strokeRisk7Days = '11.7%';
    strokeRisk90Days = '17.8%';
    daptIndicated = true;
  } else if (score >= 4) {
    riskCategoryRu = 'Умеренный';
    strokeRisk2Days = '4.1%';
    strokeRisk7Days = '5.9%';
    strokeRisk90Days = '9.8%';
    daptIndicated = true;
  }

  return {
    score,
    riskCategoryRu,
    strokeRisk2Days,
    strokeRisk7Days,
    strokeRisk90Days,
    daptIndicated
  };
}

/**
 * Calculates HAS-BLED score for bleeding risk (Appendix 15)
 */
export function calculateHASBLED(data: PatientData): HasBledResult {
  let score = 0;

  // H: Hypertension (SBP > 160)
  if (data.systolicBP > 160) score += 1;

  // A: Abnormal renal/liver function
  if (data.estimatedCrCl < 50 || data.elevatedLiverEnzymesALT2x) score += 1;

  // S: Stroke history
  if (data.previousStrokeOrTIA) score += 1;

  // B: Bleeding history
  if (data.historyOfGIBleeding || data.previousICH) score += 1;

  // L: Labile INR (if on warfarin and high inr)
  if (data.inrValue && (data.inrValue > 3.0 || data.inrValue < 2.0)) score += 1;

  // E: Elderly (Age > 65)
  if (data.age > 65) score += 1;

  // D: Drugs / Alcohol (NSAIDs or antiplatelets concomitant)
  if (data.recurrentTIAonAntiplatelets) score += 1;

  const isHighRisk = score >= 3;
  return {
    score,
    riskCategoryRu: isHighRisk ? 'Высокий (≥ 3)' : 'Низкий (< 3)',
    riskDescriptionRu: isHighRisk
      ? 'Высокий риск геморрагических осложнений (≥ 3 баллов). Требуется строгий мониторинг, устранение модифицируемых факторов риска, предпочтение Апиксабану или Дабигатрану 110 мг (Приложение 14).'
      : 'Низкий/умеренный риск кровотечения (< 3 баллов). Противопоказаний к стандартной антикоагулянтной / ДААТ терапии со стороны гемостаза нет.',
    compassRegimenAllowed: !isHighRisk && data.multivascularDisease
  };
}

/**
 * Evaluates Reperfusion Therapy (IVT & EVT) according to Chapter 4, items 27-38
 */
export function evaluateReperfusion(data: PatientData): ReperfusionAssessment {
  const ivtContraindications: string[] = [];
  const ivtSpecialNotes: string[] = [];

  // Absolute contraindications (item 29)
  if (data.intracranialHemorrhageCT) {
    ivtContraindications.push('Наличие внутричерепного кровоизлияния на КТ/МРТ головного мозга (п. 29)');
  }
  if (data.activeBleeding) {
    ivtContraindications.push('Активное внутреннее кровотечение (п. 29)');
  }
  if (data.plateletCountThousand < 100) {
    ivtContraindications.push(
      `Тромбоцитопения < 100×10⁹/л (текущее значение: ${data.plateletCountThousand}×10⁹/л) (п. 29)`
    );
  }
  if (data.takingDOACwithin12h && !data.doacAntiXaNormalOrCoagNormal) {
    ivtContraindications.push(
      'Прием ПОАК менее 12 часов назад без специфических тестов (анти-Ха < 0.5 Ед/мл или ТВ < 60 с) (п. 28.4, 29)'
    );
  }
  if (data.inrValue && data.inrValue > 1.7) {
    ivtContraindications.push(`МНО > 1.7 на фоне приема антагонистов витамина К (Варфарина) (п. 29)`);
  }
  if (data.previousICHWithin1Year) {
    ivtContraindications.push('Внутричерепное кровоизлияние в анамнезе менее 1 года назад (п. 29)');
  }
  if (data.previousStrokeWithin1Month) {
    ivtContraindications.push('Ишемический инсульт давностью менее 1 месяца (п. 29)');
  }
  if (data.recentSTEMIwithin7days) {
    ivtContraindications.push('Подострый инфаркт миокарда с подъемом сегмента ST < 7 дней назад (п. 29)');
  }
  if (data.preStrokeMRS >= 4) {
    ivtContraindications.push('Выраженная инвалидизация до инсульта (mRS 4–5) (п. 29)');
  }
  if (data.systolicBP > 185 || data.diastolicBP > 110) {
    ivtSpecialNotes.push(
      `АД > 185/110 мм рт.ст. (текущее: ${data.systolicBP}/${data.diastolicBP}). ТЛТ возможна ТОЛЬКО после экстренного снижения АД < 185/110 мм рт.ст. (п. 26.2, 28.1)`
    );
  }
  if (data.bloodGlucoseMmol < 2.8 || data.bloodGlucoseMmol > 22.2) {
    ivtSpecialNotes.push(
      `Гликемия ${data.bloodGlucoseMmol} ммоль/л требует немедленной коррекции до 7.7–10.0 ммоль/л перед ТЛТ (п. 26.5)`
    );
  }

  // IVT Window Check
  let ivtEligible = false;
  let ivtWindowType: 'standard_4_5h' | 'extended_4_5_to_9h' | 'ineligible' = 'ineligible';

  if (ivtContraindications.length === 0) {
    if (data.onsetTimeHours <= 4.5 && !data.isWakeUpStroke) {
      ivtEligible = true;
      ivtWindowType = 'standard_4_5h';
    } else if (
      (data.onsetTimeHours > 4.5 && data.onsetTimeHours <= 9.0) ||
      data.isWakeUpStroke
    ) {
      // Extended window 4.5-9h (item 28.2) requires CTP mismatch or MRI DWI-FLAIR mismatch
      if (data.perfusionMismatchConfirmed) {
        ivtEligible = true;
        ivtWindowType = 'extended_4_5_to_9h';
        ivtSpecialNotes.push(
          'Расширенное окно 4.5–9 часов / wake-up stroke: ТЛТ показана при подтвержденном КТП-несоответствии (ядро < 70 мл, отношение гипоперфузии к ядру ≥ 1.2, абсолютное несоответствие > 10 мл) либо МРТ DWI-FLAIR mismatch (п. 28.2)'
        );
      } else {
        ivtSpecialNotes.push(
          'Окно 4.5–9 часов или неизвестное время: ТЛТ возможна только после подтверждения mismatch на КТ-перфузии или МРТ DWI-FLAIR (п. 28.2)'
        );
      }
    }
  }

  // EVT (Endovascular Thrombectomy, items 30-38)
  let evtEligible = false;
  let evtWindowType: 'window_0_6h' | 'window_6_24h' | 'ineligible' = 'ineligible';
  const evtContraindications: string[] = [];
  let evtRationale = '';

  const hasLVO =
    data.largeVesselOcclusionConfirmed ||
    data.occludedArterySegment === 'ICA' ||
    data.occludedArterySegment === 'MCA_M1' ||
    data.occludedArterySegment === 'MCA_M2' ||
    data.occludedArterySegment === 'Basilar';

  if (data.intracranialHemorrhageCT) {
    evtContraindications.push('Внутричерепное кровоизлияние на КТ/МРТ');
  }

  if (hasLVO && evtContraindications.length === 0) {
    // Check 0-6h window (item 30)
    if (data.onsetTimeHours <= 6.0 && !data.isWakeUpStroke) {
      if (data.aspectScore >= 6 && data.preStrokeMRS <= 2 && data.nihssScore >= 6) {
        evtEligible = true;
        evtWindowType = 'window_0_6h';
        evtRationale = `Показана экстренная ВСТЭ в окне 0–6 часов (п. 30): окклюзия крупной артерии (${data.occludedArterySegment || 'LVO'}), NIHSS ≥ 6 (${data.nihssScore}), ASPECT ≥ 6 (${data.aspectScore}), pre-mRS ≤ 2.`;
      } else if (data.aspectScore < 6) {
        evtRationale = `ASPECT < 6 (${data.aspectScore} б.) — обширный ишемический очаг. Проведение ВСТЭ возможно по решению консилиума при благоприятных факторах (п. 30.5).`;
      }
    } else if (
      (data.onsetTimeHours > 6.0 && data.onsetTimeHours <= 24.0) ||
      data.isWakeUpStroke
    ) {
      // Check 6-24h window (items 33-35: DAWN & DEFUSE-3 criteria)
      if (data.perfusionMismatchConfirmed && data.preStrokeMRS <= 2) {
        evtEligible = true;
        evtWindowType = 'window_6_24h';
        evtRationale = `Показана ВСТЭ в расширенном окне 6–24 часа (п. 33–35, критерии DAWN / DEFUSE-3): подтвержден тканевой резерв на КТП/МРТ (объем ядра < 70 мл, mismatch > 15 мл, отношение ≥ 1.8), pre-mRS ≤ 2.`;
      } else {
        evtRationale =
          'Окно 6–24 часа / wake-up stroke: для ВСТЭ требуется подтверждение жизнеспособной пенумбры на КТ-перфузии (DAWN / DEFUSE-3 критерии, п. 33–35).';
      }
    }

    // Basilar artery special check (item 37)
    if (data.occludedArterySegment === 'Basilar') {
      const pcAspect = data.pcAspectScore ?? 8;
      if (data.onsetTimeHours <= 24.0 && pcAspect >= 7) {
        evtEligible = true;
        evtRationale += ` Окклюзия основной артерии: ВСТЭ показана в окне 0–24 часа при pc-ASPECT 7–10 (текущий: ${pcAspect}) (п. 37).`;
      }
    }
  } else if (!hasLVO) {
    evtRationale = 'Окклюзия крупной мозговой артерии (ВСА, СМА М1/М2, Основная артерия) не подтверждена на КТА/МРА.';
  }

  const ivtRegimen =
    'Алтеплаза (0.9 мг/кг массы тела, макс. 90 мг: 10% дозы в/в болюсно за 1 мин, 90% в/в инфузия за 60 мин) ИЛИ Тенектеплаза (0.25 мг/кг в/в болюсно за 5–10 сек, макс. 25 мг) (п. 27.2)';

  return {
    ivtEligible,
    ivtWindowType,
    ivtRegimen,
    ivtContraindications,
    ivtSpecialNotes,
    evtEligible,
    evtWindowType,
    evtRationale,
    evtContraindications,
    targetVesselSegment: data.occludedArterySegment
  };
}

/**
 * Evaluates Malignant Infarction Alert (MCA / Cerebellar) according to items 17, 44, 45
 */
export function evaluateMalignantStroke(data: PatientData): MalignantStrokeAlert {
  const isMCA =
    data.isMalignantMCASuspected ||
    data.aspectScore <= 5 ||
    (data.infarctVolumeMl !== undefined && data.infarctVolumeMl > 145) ||
    (data.nihssScore >= 16 && data.occludedArterySegment === 'MCA_M1');

  const isCerebellar =
    data.isMalignantCerebellarSuspected ||
    (data.brainstemCerebellarSigns && data.nihssScore >= 12);

  if (isMCA) {
    return {
      isHighRisk: true,
      type: 'MCA',
      riskDescription:
        'ВЫСОКИЙ РИСК ЗЛОКАЧЕСТВЕННОГО ИНФАРКТА СМА (п. 17.1, 44): объем ишемии > 50% бассейна СМА (ASPECT ≤ 5, объем > 145 мл). Угроза дислокационного синдрома и отека мозга.',
      surgicalConsultIndicated: true,
      surgicalProcedure:
        'Экстренная консультация нейрохирурга в течение 48 часов. Декомпрессивная гемикраниэктомия показана при возрасте ≤ 60 лет (или консилиум > 60 лет), pre-mRS 0–1, NIHSS > 15, снижении уровня бодрствования (п. 44).'
    };
  }

  if (isCerebellar) {
    return {
      isHighRisk: true,
      type: 'Cerebellar',
      riskDescription:
        'ВЫСОКИЙ РИСК ЗЛОКАЧЕСТВЕННОГО ИНФАРКТА МОЗЖЕЧКА (п. 17.2, 45): объем инфаркта ≥ 1/3 полушария мозжечка с компрессией IV желудочка, ствола или острой гидроцефалией.',
      surgicalConsultIndicated: true,
      surgicalProcedure:
        'Экстренная консультация нейрохирурга: субокципитальная декомпрессивная краниэктомия и (или) вентрикулостомия (п. 45).'
    };
  }

  return {
    isHighRisk: false,
    type: 'None',
    riskDescription: 'Признаков злокачественного инфаркта головного мозга на данный момент нет.',
    surgicalConsultIndicated: false,
    surgicalProcedure: 'Консервативное ведение в ОРИТ / инсультном отделении.'
  };
}

/**
 * Official Reference Data for Secondary Thrombosis Prevention Tables
 * (Clinical Protocol of the Ministry of Health of the Republic of Belarus No. 1 of 05.01.2026)
 */
export const NON_CARDIOEMBOLIC_PROTOCOL_RULES = [
  {
    ruleNumber: 1,
    condition: 'ИГМ <24ч, NIHSS ≤3 и ТИА высокого риска по ABCD2 ≥4',
    regimenDay1: '1 сутки: клопидогрел 300 мг/сут + АСК 300 мг/сут',
    regimenEarly: 'Со 2 суток до 21 суток: клопидогрел 75 мг/сут + АСК 75 мг/сут',
    regimenLongTerm: 'С 22 суток: монотерапия АСК 75 мг/сут или клопидогрел 75 мг/сут'
  },
  {
    ruleNumber: 2,
    condition: 'ИГМ <24ч, NIHSS ≤5 и ТИА высокого риска по ABCD2 ≥6',
    regimenDay1: '1 сутки: Тикагрелор 180 мг/сут + АСК 300 мг/сут',
    regimenEarly: 'Со 2 суток до 30 суток: тикагрелор 90 мг х 2 р/сут + АСК 75 мг/сут',
    regimenLongTerm: 'С 31 суток: монотерапия АСК 75–150 мг/сут или клопидогрел 75 мг/сут'
  },
  {
    ruleNumber: 3,
    condition: 'ИГМ NIHSS ≤3, ТИА при непереносимости двойной антиагрегантной терапии',
    regimenDay1: 'С 1 суток до 14 суток: АСК 300 мг/сут',
    regimenEarly: 'С 1 по 14 сутки: АСК 300 мг/сут',
    regimenLongTerm: 'С 15 суток и далее монотерапия: АСК 75 мг/сут или клопидогрел 75 мг/сут'
  },
  {
    ruleNumber: 4,
    condition: 'ИГМ <24ч, NIHSS ≥6',
    regimenDay1: 'С 1 по 14 сутки: АСК 150–300 мг/сут ИЛИ 1 сутки: клопидогрел 300 мг/сут',
    regimenEarly: 'Со 2 суток: клопидогрел 75 мг/сут (или продолжение АСК 150–300 мг/сут до 14 суток)',
    regimenLongTerm: 'С 15 суток: АСК 75 мг/сут ИЛИ клопидогрел 75 мг/сут'
  },
  {
    ruleNumber: 5,
    condition: 'ИГМ 24–72ч, NIHSS ≤5 и ТИА высокого риска по ABCD2 ≥4',
    regimenDay1: 'До 21 суток: клопидогрел 75 мг/сут + АСК 75 мг/сут (без нагрузочной дозы)',
    regimenEarly: 'До 21 суток: клопидогрел 75 мг/сут + АСК 75 мг/сут',
    regimenLongTerm: 'С 22 суток: монотерапия АСК 75 мг/сут или клопидогрел 75 мг/сут'
  },
  {
    ruleNumber: 6,
    condition: 'ИГМ не соответствует 5 пункту (>72ч или NIHSS >5 при поступлении >24ч)',
    regimenDay1: 'Монотерапия АСК 75 мг/сут или клопидогрел 75 мг/сут',
    regimenEarly: 'Монотерапия АСК 75 мг/сут или клопидогрел 75 мг/сут',
    regimenLongTerm: 'Пожизненная монотерапия АСК 75 мг/сут или клопидогрел 75 мг/сут'
  }
];

export const CARDIOEMBOLIC_PROTOCOL_RULES = [
  { ruleNumber: 1, condition: 'ИГМ <2 см', timingRu: 'ОАК со 2 суток' },
  { ruleNumber: 2, condition: 'ИГМ 2–5 см, NIHSS <8', timingRu: 'ОАК со 2 суток' },
  { ruleNumber: 3, condition: 'ИГМ 2–5 см, NIHSS 8–15', timingRu: 'ОАК с 3 суток' },
  { ruleNumber: 4, condition: 'ИГМ 2–5 см, NIHSS >15', timingRu: 'ОАК с 6 суток' },
  { ruleNumber: 5, condition: 'ИГМ 5–7 см, NIHSS <8', timingRu: 'ОАК с 4 суток' },
  { ruleNumber: 6, condition: 'ИГМ 5–7 см, NIHSS 8–15', timingRu: 'ОАК с 5 суток' },
  { ruleNumber: 7, condition: 'ИГМ 5–7 см, NIHSS >15', timingRu: 'ОАК с 10 суток' },
  { ruleNumber: 8, condition: 'До начала ОАК', timingRu: 'АСК 150–300 мг/сут' },
  { ruleNumber: 9, condition: 'ТИА', timingRu: 'ОАК с 1 суток' },
  { ruleNumber: 10, condition: 'ГИ-1 + ИГМ <2 см', timingRu: 'ОАК со 2 суток' },
  { ruleNumber: 11, condition: 'ГИ-1 + ИГМ 2–5 см', timingRu: 'ОАК с 7-х суток' },
  { ruleNumber: 12, condition: 'ГИ-1 + ИГМ >5 см', timingRu: 'ОАК с 14-х суток' },
  { ruleNumber: 13, condition: 'ГИ-2 + ИГМ <2 см', timingRu: 'ОАК со 2 суток' },
  { ruleNumber: 14, condition: 'ГИ-2 + ИГМ 2–5 см', timingRu: 'ОАК с 14-х суток' },
  { ruleNumber: 15, condition: 'ГИ-2 + ИГМ >5 см', timingRu: 'ОАК с 21-х суток' },
  { ruleNumber: 16, condition: 'ПГ-1 + ИГМ <2 см', timingRu: 'ОАК со 2 суток' },
  { ruleNumber: 17, condition: 'ПГ-1 + ИГМ 2–5 см', timingRu: 'ОАК с 21-х суток' },
  { ruleNumber: 18, condition: 'ПГ-1 + ИГМ >5 см', timingRu: 'ОАК с 28-х суток' },
  { ruleNumber: 19, condition: 'ПГ-2 + ИГМ <2 см', timingRu: 'ОАК со 2 суток' },
  { ruleNumber: 20, condition: 'ПГ-2 + ИГМ 2–5 см', timingRu: 'ОАК с 28-х суток' },
  { ruleNumber: 21, condition: 'ПГ-2 + ИГМ >5 см', timingRu: 'ОАК с 30-х суток' },
  { ruleNumber: 22, condition: 'ИГМ >7 см', timingRu: 'НМГ в профилактической дозе, с переводом на ОАК после 14 сут' }
];

/**
 * Calculates Antithrombotic Plan & Exact Timing according to the Official Protocols:
 * - Table 1: Non-cardioembolic Ischemic Stroke (items 1–6)
 * - Table 2: Cardioembolic Ischemic Stroke (items 1–22)
 * - Items 39, 42.1, 43.1, 43.2 and Appendix 14
 */
export function calculateAntithromboticPlan(
  data: PatientData,
  dominantSubtype: ToastSubtypeKey,
  reperfusionPerformed: boolean
): AntithromboticPlan {
  const isTIA = data.eventType === 'tia';
  const abcd2 = calculateABCD2(data).score;
  const diam = data.infarctDiameterCm || (data.imagingFocusSize === 'lacunar' ? 1.5 : 3.0);
  const ht = data.hemorrhagicTransformation || 'none';

  // Acute first 24h rule (item 39 & 42.1)
  let acuteFirst24h = '';
  if (reperfusionPerformed) {
    acuteFirst24h =
      'Внимание! После проведения ТЛТ и (или) ВСТЭ любые антиагреганты и антикоагулянты ЗАПРЕЩЕНЫ в течение первых 24 часов (п. 39). Назначение возможно только после контрольной КТ через 24 часа при отсутствии геморрагической трансформации.';
  } else {
    acuteFirst24h =
      'В первые 24 часа от развития симптомов: Ацетилсалициловая кислота (АСК) 150–300 мг внутрь (или через зонд при дисфагии) однократно (п. 42.1).';
  }

  // =========================================================================
  // BRANCH 1: CARDIOEMBOLIC ISCHEMIC STROKE (TABLE 2, ITEMS 1-22)
  // =========================================================================
  if (dominantSubtype === 'cardioembolic') {
    let ruleNumber = 1;
    let ruleTitle = '';
    let recommendedStartDay = '';
    let timingRationale = '';
    let preOACBridge = 'До начала ОАК: АСК 150–300 мг/сут (п. 8 Протокола)';
    let heparinBridge: string | undefined = undefined;

    if (isTIA) {
      // Rule 9: ТИА -> ОАК с 1 суток
      ruleNumber = 9;
      ruleTitle = 'ТИА (п. 9)';
      recommendedStartDay = 'ОАК с 1 суток';
      timingRationale = 'При ТИА риск геморрагической трансформации минимален: старт ОАК непосредственно с 1-х суток.';
      preOACBridge = 'Прием ОАК начинается с 1-х суток (мост-терапия АСК не требуется)';
    } else if (diam > 7.0) {
      // Rule 22: ИГМ >7 см
      ruleNumber = 22;
      ruleTitle = 'ИГМ >7 см (п. 22)';
      recommendedStartDay = 'После 14 суток (с переводом с НМГ)';
      timingRationale =
        'Обширный инфаркт мозга (> 7 см): критический риск геморрагической трансформации. Показан НМГ в профилактической дозе с последующим переводом на ОАК после 14 суток.';
      heparinBridge = 'НМГ в профилактической дозе, с переводом на ОАК после 14 суток (п. 22)';
    } else if (ht === 'HI1') {
      // Rules 10, 11, 12
      if (diam < 2.0) {
        ruleNumber = 10;
        ruleTitle = 'ГИ-1 + ИГМ <2 см (п. 10)';
        recommendedStartDay = 'ОАК со 2 суток';
        timingRationale = 'Геморрагический инфаркт 1 типа при малом очаге (< 2 см): старт ОАК со 2-х суток.';
      } else if (diam <= 5.0) {
        ruleNumber = 11;
        ruleTitle = 'ГИ-1 + ИГМ 2–5 см (п. 11)';
        recommendedStartDay = 'ОАК с 7-х суток';
        timingRationale = 'Геморрагический инфаркт 1 типа при очаге 2–5 см: старт ОАК с 7-х суток после контрольной КТ.';
      } else {
        ruleNumber = 12;
        ruleTitle = 'ГИ-1 + ИГМ >5 см (п. 12)';
        recommendedStartDay = 'ОАК с 14-х суток';
        timingRationale = 'Геморрагический инфаркт 1 типа при очаге > 5 см: старт ОАК с 14-х суток после контрольной КТ.';
      }
    } else if (ht === 'HI2') {
      // Rules 13, 14, 15
      if (diam < 2.0) {
        ruleNumber = 13;
        ruleTitle = 'ГИ-2 + ИГМ <2 см (п. 13)';
        recommendedStartDay = 'ОАК со 2 суток';
        timingRationale = 'Геморрагический инфаркт 2 типа при малом очаге (< 2 см): старт ОАК со 2-х суток.';
      } else if (diam <= 5.0) {
        ruleNumber = 14;
        ruleTitle = 'ГИ-2 + ИГМ 2–5 см (п. 14)';
        recommendedStartDay = 'ОАК с 14-х суток';
        timingRationale = 'Геморрагический инфаркт 2 типа при очаге 2–5 см: старт ОАК с 14-х суток после контрольной КТ.';
      } else {
        ruleNumber = 15;
        ruleTitle = 'ГИ-2 + ИГМ >5 см (п. 15)';
        recommendedStartDay = 'ОАК с 21-х суток';
        timingRationale = 'Геморрагический инфаркт 2 типа при очаге > 5 см: старт ОАК с 21-х суток после контрольной КТ.';
      }
    } else if (ht === 'PH1') {
      // Rules 16, 17, 18
      if (diam < 2.0) {
        ruleNumber = 16;
        ruleTitle = 'ПГ-1 + ИГМ <2 см (п. 16)';
        recommendedStartDay = 'ОАК со 2 суток';
        timingRationale = 'Паренхиматозная гематома 1 типа при малом очаге (< 2 см): старт ОАК со 2-х суток.';
      } else if (diam <= 5.0) {
        ruleNumber = 17;
        ruleTitle = 'ПГ-1 + ИГМ 2–5 см (п. 17)';
        recommendedStartDay = 'ОАК с 21-х суток';
        timingRationale = 'Паренхиматозная гематома 1 типа при очаге 2–5 см: старт ОАК с 21-х суток после контрольной КТ.';
      } else {
        ruleNumber = 18;
        ruleTitle = 'ПГ-1 + ИГМ >5 см (п. 18)';
        recommendedStartDay = 'ОАК с 28-х суток';
        timingRationale = 'Паренхиматозная гематома 1 типа при очаге > 5 см: старт ОАК с 28-х суток после контрольной КТ.';
      }
    } else if (ht === 'PH2') {
      // Rules 19, 20, 21
      if (diam < 2.0) {
        ruleNumber = 19;
        ruleTitle = 'ПГ-2 + ИГМ <2 см (п. 19)';
        recommendedStartDay = 'ОАК со 2 суток';
        timingRationale = 'Паренхиматозная гематома 2 типа при малом очаге (< 2 см): старт ОАК со 2-х суток.';
      } else if (diam <= 5.0) {
        ruleNumber = 20;
        ruleTitle = 'ПГ-2 + ИГМ 2–5 см (п. 20)';
        recommendedStartDay = 'ОАК с 28-х суток';
        timingRationale = 'Паренхиматозная гематома 2 типа при очаге 2–5 см: старт ОАК с 28-х суток после контрольной КТ.';
      } else {
        ruleNumber = 21;
        ruleTitle = 'ПГ-2 + ИГМ >5 см (п. 21)';
        recommendedStartDay = 'ОАК с 30-х суток';
        timingRationale = 'Паренхиматозная гематома 2 типа при очаге > 5 см: старт ОАК с 30-х суток после контрольной КТ.';
      }
    } else {
      // Without hemorrhagic transformation: Rules 1, 2, 3, 4, 5, 6, 7
      if (diam < 2.0) {
        ruleNumber = 1;
        ruleTitle = 'ИГМ <2 см (п. 1)';
        recommendedStartDay = 'ОАК со 2 суток';
        timingRationale = 'Размер очага < 2 см на КТ/МРТ: возобновление/старт ОАК со 2-х суток от развития ИИ.';
      } else if (diam <= 5.0) {
        if (data.nihssScore < 8) {
          ruleNumber = 2;
          ruleTitle = 'ИГМ 2–5 см, NIHSS <8 (п. 2)';
          recommendedStartDay = 'ОАК со 2 суток';
          timingRationale = 'Размер очага 2–5 см при легком инсульте (NIHSS < 8): старт ОАК со 2-х суток.';
        } else if (data.nihssScore <= 15) {
          ruleNumber = 3;
          ruleTitle = 'ИГМ 2–5 см, NIHSS 8–15 (п. 3)';
          recommendedStartDay = 'ОАК с 3 суток';
          timingRationale = 'Размер очага 2–5 см при инсульте средней тяжести (NIHSS 8–15): старт ОАК с 3 суток.';
        } else {
          ruleNumber = 4;
          ruleTitle = 'ИГМ 2–5 см, NIHSS >15 (п. 4)';
          recommendedStartDay = 'ОАК с 6 суток';
          timingRationale = 'Размер очага 2–5 см при тяжелом инсульте (NIHSS > 15): старт ОАК с 6 суток.';
        }
      } else {
        // 5–7 cm
        if (data.nihssScore < 8) {
          ruleNumber = 5;
          ruleTitle = 'ИГМ 5–7 см, NIHSS <8 (п. 5)';
          recommendedStartDay = 'ОАК с 4 суток';
          timingRationale = 'Размер очага 5–7 см при легком инсульте (NIHSS < 8): старт ОАК с 4 суток.';
        } else if (data.nihssScore <= 15) {
          ruleNumber = 6;
          ruleTitle = 'ИГМ 5–7 см, NIHSS 8–15 (п. 6)';
          recommendedStartDay = 'ОАК с 5 суток';
          timingRationale = 'Размер очага 5–7 см при инсульте средней тяжести (NIHSS 8–15): старт ОАК с 5 суток.';
        } else {
          ruleNumber = 7;
          ruleTitle = 'ИГМ 5–7 см, NIHSS >15 (п. 7)';
          recommendedStartDay = 'ОАК с 10 суток';
          timingRationale = 'Размер очага 5–7 см при тяжелом инсульте (NIHSS > 15): старт ОАК с 10 суток.';
        }
      }
    }

    // Drug selection according to Appendix 14
    let drugChoice = 'Апиксабан 5 мг 2 раза/сут (или 2.5 мг 2 р/сут при снижении почечной функции)';
    let drugChoiceRationale =
      'ПОАК первого выбора у пациентов с неклапанной фибрилляцией предсердий (Приложение 14).';

    const hasMechanicalValveOrMS =
      data.highRiskCardiacSources.includes('prosthetic_valve') ||
      data.highRiskCardiacSources.includes('mitral_stenosis_or_rheumatic');

    if (hasMechanicalValveOrMS) {
      drugChoice =
        'Варфарин (под контролем МНО: целевой диапазон 2.5–3.5 при механическом митральном клапане + АСК 75–100 мг; целевое МНО 2.0–3.0 при аортальном протезе)';
      drugChoiceRationale =
        'ПОАК СТРОГО ПРОТИВОПОКАЗАНЫ при наличии механических клапанов сердца или митрального стеноза! Показан только Варфарин (Приложение 14).';
    } else if (data.estimatedCrCl < 30) {
      drugChoice =
        'Апиксабан 2.5 мг 2 раза в сутки (при CrCl 15–29 мл/мин) ИЛИ Варфарин (целевое МНО 2.0–3.0)';
      drugChoiceRationale =
        'Тяжелая почечная недостаточность (CrCl < 30 мл/мин): Дабигатран противопоказан (почечный клиренс 80%). Апиксабан имеет минимальную почечную экскрецию (27%) (Приложение 14).';
    } else if (data.historyOfGIBleeding) {
      drugChoice = 'Апиксабан 5 мг 2 р/сут ИЛИ Дабигатран 110 мг 2 р/сут ИЛИ Варфарин';
      drugChoiceRationale =
        'ЖКК в анамнезе: избегать Дабигатран 150 мг и Ривароксабан 20 мг (повышенный риск ЖК-кровотечений) (Приложение 14).';
    } else if (data.weightKg > 120 || (data.bmiValue && data.bmiValue > 40)) {
      drugChoice = 'Варфарин (целевое МНО 2.0–3.0) под контролем лабораторного титрования';
      drugChoiceRationale =
        'Масса тела > 120 кг или ИМТ > 40 кг/м²: сниженная доказательная база по ПОАК при морбидном ожирении (Приложение 14).';
    } else if (data.dysphagiaOrNasogastricTube) {
      drugChoice =
        'Апиксабан (таблетку можно измельчить и ввести через зонд) ИЛИ Ривароксабан (измельчить с энтеральным питанием)';
      drugChoiceRationale =
        'Зондовое питание: капсулы Дабигатрана категорически запрещено вскрывать или измельчать! (Приложение 14).';
    } else if (data.dyspepsia) {
      drugChoice = 'Апиксабан 5 мг 2 р/сут ИЛИ Ривароксабан 20 мг 1 р/сут';
      drugChoiceRationale =
        'Диспепсия: Дабигатран часто вызывает симптомы диспепсии из-за виннокаменной кислоты в капсуле (Приложение 14).';
    }

    return {
      strategy: 'OAC',
      timingDay: recommendedStartDay,
      timingRationale,
      primaryRegimen: drugChoice,
      dosingDetails: drugChoiceRationale,
      duration: 'Пожизненный прием ОАК (неопределенно долго)',
      safetyNotes:
        'Контроль функции почек (CrCl), печеночных проб и коагулограммы. При CrCl < 30 мл/мин — коррекция дозы ПОАК или Варфарин.',
      alternativeRegimen:
        'Варфарин (целевое МНО 2.0–3.0) при механических протезах клапанов или митральном стенозе.',
      protocolTableType: 'cardioembolic',
      ruleNumber,
      ruleTitle,
      ruleDescriptionRu: `Таблица: Кардиоэмболический ИГМ | Пункт ${ruleNumber}: ${ruleTitle} → ${recommendedStartDay}`,
      protocolCitation: `Таблица «Антитромботическая терапия при кардиоэмболическом ИГМ», п. ${ruleNumber}`,
      preOACBridge,
      heparinBridge,
      acuteFirst24h,
      secondaryPreventionCategory: 'cardioembolic',
      regimenSummaryRu: `Кардиоэмболический подтип: ${ruleTitle} → ${recommendedStartDay}. ${preOACBridge}. Препарат: ${drugChoice}.`,
      phase1: {
        timing: 'До старта ОАК (острая фаза)',
        regimen: heparinBridge ? 'Гепариновый мост / АСК' : 'АСК',
        dosing: heparinBridge || 'АСК 150–300 мг/сут (п. 8)'
      },
      phase2: {
        timing: recommendedStartDay,
        regimen: 'Пероральный антикоагулянт (ПОАК / Варфарин)',
        dosing: drugChoice
      },
      phase3: {
        timing: 'Долговременная профилактика',
        regimen: 'ОАК монотерапия',
        dosing: 'Пожизненный прием (одновременный прием АСК запрещен, за исключением механических клапанов)'
      },
      oacPlan: {
        recommendedStartDay,
        ruleExplanation: timingRationale,
        drugChoice,
        drugChoiceRationale,
        crclWarning:
          data.estimatedCrCl < 50
            ? `Снижение CrCl (${data.estimatedCrCl} мл/мин): требуется коррекция дозы ПОАК!`
            : undefined
      }
    };
  }

  // =========================================================================
  // BRANCH 2: NON-CARDIOEMBOLIC ISCHEMIC STROKE (TABLE 1, ITEMS 1-6)
  // (Atherothrombotic, Lacunar, Undetermined / ESUS, and Non-cardioembolic Other)
  // =========================================================================

  // Handle DAPT Intolerance (Rule 3)
  if (data.daptIntolerance && (isTIA || data.nihssScore <= 3)) {
    return {
      strategy: 'antiplatelet',
      timingDay: 'С первых суток',
      timingRationale: 'Непереносимость двойной антиагрегантной терапии (п. 3 Протокола)',
      primaryRegimen: 'АСК монотерапия (с 1 по 14 сутки: 300 мг/сут; с 15 суток: 75 мг/сут)',
      dosingDetails: 'С 1 суток до 14 суток: АСК 300 мг/сут. С 15 суток и далее: АСК 75 мг/сут (или клопидогрел 75 мг/сут).',
      duration: 'Пожизненно',
      safetyNotes: 'Контроль переносимости, при язвенной болезни / гастропатии — ИПП (пантопразол) или монотерапия клопидогрелом.',
      alternativeRegimen: 'Клопидогрел 75 мг/сут при аспириновой бронхиальной астме или аллергии на АСК',
      protocolTableType: 'non_cardioembolic',
      ruleNumber: 3,
      ruleTitle: 'ИГМ NIHSS ≤3, ТИА при непереносимости двойной антиагрегантной терапии (п. 3)',
      ruleDescriptionRu: 'Таблица: Некардиоэмболический ИГМ | Пункт 3: ИГМ NIHSS ≤3, ТИА при непереносимости ДААТ',
      protocolCitation: 'Таблица «Антитромботическая терапия при некардиоэмболическом ИГМ», п. 3',
      daptIntoleranceHandled: true,
      phase1: {
        timing: 'С 1 суток до 14 суток',
        regimen: 'АСК монотерапия в нагрузочной дозе',
        dosing: 'АСК 300 мг/сут внутрь'
      },
      phase2: {
        timing: 'С 15 суток и далее',
        regimen: 'Монотерапия АСК или клопидогрел',
        dosing: 'АСК 75 мг/сут ИЛИ клопидогрел 75 мг/сут пожизненно'
      },
      acuteFirst24h,
      secondaryPreventionCategory: 'non_cardioembolic',
      regimenSummaryRu: 'Некардиоэмболический подтип при непереносимости ДААТ (п. 3): АСК 300 мг/сут до 14 сут, с 15 сут — АСК 75 мг/сут или клопидогрел 75 мг/сут.'
    };
  }

  // Handle Dissection (Special case of "Other" subtype)
  if (dominantSubtype === 'other' && data.selectedRareCauses.includes('arterial_dissection')) {
    return {
      strategy: 'antiplatelet',
      timingDay: 'С первых суток',
      timingRationale: 'Острая фаза диссекции церебральной артерии (п. 43.3)',
      primaryRegimen: 'ОАК (ПОАК или Варфарин МНО 2.0–3.0) ИЛИ ДААТ (Клопидогрел + АСК)',
      dosingDetails: 'Терапия на срок 3–6 месяцев под контролем ангиографии (КТА/МРА)',
      duration: '3–6 месяцев',
      safetyNotes: 'Контрольная КТА/МРА через 3–6 месяцев для оценки заживления интимы и реканализации (п. 43.3)',
      protocolTableType: 'non_cardioembolic',
      ruleNumber: 1,
      ruleTitle: 'Диссекция церебральных артерий (п. 43.3)',
      ruleDescriptionRu: 'Протокол п. 43.3: Антитромботическая терапия при диссекции церебральных артерий',
      protocolCitation: 'Клинический протокол МЗ РБ № 1, п. 43.3',
      acuteFirst24h,
      secondaryPreventionCategory: 'dissection',
      regimenSummaryRu: 'Диссекция церебральных артерий: ОАК ИЛИ ДААТ (Клопидогрел + АСК) на 3–6 месяцев (п. 43.3).'
    };
  }

  // Non-cardioembolic evaluation by onset time, NIHSS, and ABCD2:
  const isUnder24h = data.onsetTimeHours < 24;
  const is24to72h = data.onsetTimeHours >= 24 && data.onsetTimeHours <= 72;

  // Rule 2: ИГМ <24ч, NIHSS ≤5 и ТИА высокого риска по ABCD2 ≥6 (Тикагрелор + АСК)
  const qualifiesForRule2 =
    isUnder24h &&
    ((isTIA && abcd2 >= 6) ||
      (!isTIA && data.nihssScore <= 5 && (data.nihssScore >= 4 || abcd2 >= 6 || data.targetVesselStenosisNascet >= 30)));

  if (qualifiesForRule2 && !data.activeBleeding) {
    return {
      strategy: 'antiplatelet',
      timingDay: '1 сутки (в первые 24 часа)',
      timingRationale: 'Окно < 24 часов, NIHSS ≤ 5 или ТИА высокого риска по ABCD2 ≥ 6 (п. 2)',
      primaryRegimen: 'Тикагрелор + АСК (ДААТ с тикагрелором на 30 суток)',
      dosingDetails:
        '1 сутки: Тикагрелор 180 мг/сут + АСК 300 мг/сут. Со 2 суток до 30 суток: тикагрелор 90 мг 2 р/сут + АСК 75 мг/сут. С 31 суток: монотерапия АСК 75–150 мг/сут или клопидогрел 75 мг/сут.',
      duration: '30 суток ДААТ, далее пожизненная монотерапия',
      safetyNotes:
        'С 31 суток — монотерапия АСК 75–150 мг/сут или клопидогрел 75 мг/сут. Прием двух антиагрегантов более 30 суток запрещен! Обязателен ИПП (пантопразол).',
      alternativeRegimen: 'При непереносимости тикагрелора — ДААТ с клопидогрелом (300 мг нагрузка, далее 75 мг) + АСК 75 мг (п. 1)',
      protocolTableType: 'non_cardioembolic',
      ruleNumber: 2,
      ruleTitle: 'ИГМ <24ч, NIHSS ≤5 и ТИА высокого риска по ABCD2 ≥6 (п. 2)',
      ruleDescriptionRu: 'Таблица: Некардиоэмболический ИГМ | Пункт 2: Тикагрелор + АСК на 30 суток',
      protocolCitation: 'Таблица «Антитромботическая терапия при некардиоэмболическом ИГМ», п. 2',
      phase1: {
        timing: '1 сутки',
        regimen: 'Тикагрелор нагрузочная доза + АСК нагрузочная доза',
        dosing: 'Тикагрелор 180 мг однократно + АСК 300 мг однократно'
      },
      phase2: {
        timing: 'Со 2 суток до 30 суток',
        regimen: 'Тикагрелор + АСК (ДААТ)',
        dosing: 'Тикагрелор 90 мг 2 р/сут + АСК 75 мг/сут'
      },
      phase3: {
        timing: 'С 31 суток и далее',
        regimen: 'Пожизненная монотерапия',
        dosing: 'АСК 75–150 мг/сут ИЛИ клопидогрел 75 мг/сут'
      },
      daptDetails: {
        drugCombination: 'Тикагрелор + Ацетилсалициловая кислота (АСК)',
        loadingDose: 'Тикагрелор 180 мг + АСК 300 мг в 1-е сутки',
        maintenanceDuration: '30 суток с момента дебюта симптомов',
        monotherapyAfter: 'С 31 суток — монотерапия АСК 75–150 мг/сут или клопидогрел 75 мг/сут',
        ppiRecommended: true
      },
      acuteFirst24h,
      secondaryPreventionCategory: 'non_cardioembolic',
      regimenSummaryRu: 'Пункт 2: ИГМ <24ч, NIHSS ≤5 / ТИА ABCD2 ≥6: ДААТ с тикагрелором на 30 дней (1 сут: 180 мг + 300 мг, со 2 по 30 сут: 90 мг х 2р + 75 мг, с 31 сут: монотерапия 75–150 мг).'
    };
  }

  // Rule 1: ИГМ <24ч, NIHSS ≤3 и ТИА высокого риска по ABCD2 ≥4 (Клопидогрел + АСК)
  const qualifiesForRule1 =
    isUnder24h &&
    ((isTIA && abcd2 >= 4) || (!isTIA && data.nihssScore <= 3));

  if (qualifiesForRule1 && !data.activeBleeding) {
    return {
      strategy: 'antiplatelet',
      timingDay: '1 сутки (в первые 24 часа)',
      timingRationale: 'Окно < 24 часов, малый инсульт NIHSS ≤ 3 или ТИА высокого риска по ABCD2 ≥ 4 (п. 1)',
      primaryRegimen: 'Клопидогрел + АСК (ДААТ с клопидогрелом на 21 день)',
      dosingDetails:
        '1 сутки: клопидогрел 300 мг/сут + АСК 300 мг/сут. Со 2 суток до 21 суток: клопидогрел 75 мг/сут + АСК 75 мг/сут. С 22 суток: монотерапия АСК 75 мг/сут или клопидогрел 75 мг/сут.',
      duration: '21 сутки ДААТ, далее пожизненная монотерапия',
      safetyNotes:
        'С 22 суток — переход на монотерапию АСК 75 мг/сут или клопидогрел 75 мг/сут (продление ДААТ свыше 21 дня не снижает риск, но повышает риск кровотечений). Обязателен ИПП.',
      alternativeRegimen: 'При непереносимости клопидогрела — монотерапия АСК 75–100 мг/сут',
      protocolTableType: 'non_cardioembolic',
      ruleNumber: 1,
      ruleTitle: 'ИГМ <24ч, NIHSS ≤3 и ТИА высокого риска по ABCD2 ≥4 (п. 1)',
      ruleDescriptionRu: 'Таблица: Некардиоэмболический ИГМ | Пункт 1: Клопидогрел + АСК на 21 сутки',
      protocolCitation: 'Таблица «Антитромботическая терапия при некардиоэмболическом ИГМ», п. 1',
      phase1: {
        timing: '1 сутки',
        regimen: 'Клопидогрел нагрузочная доза + АСК нагрузочная доза',
        dosing: 'Клопидогрел 300 мг однократно + АСК 300 мг однократно'
      },
      phase2: {
        timing: 'Со 2 суток до 21 суток',
        regimen: 'Клопидогрел + АСК (ДААТ)',
        dosing: 'Клопидогрел 75 мг/сут + АСК 75 мг/сут'
      },
      phase3: {
        timing: 'С 22 суток и далее',
        regimen: 'Пожизненная монотерапия',
        dosing: 'АСК 75 мг/сут ИЛИ клопидогрел 75 мг/сут'
      },
      daptDetails: {
        drugCombination: 'Клопидогрел + Ацетилсалициловая кислота (АСК)',
        loadingDose: 'Клопидогрел 300 мг + АСК 300 мг в 1-е сутки',
        maintenanceDuration: '21 сутки с момента дебюта симптомов',
        monotherapyAfter: 'С 22 суток — переход на монотерапию (АСК 75 мг/сут или клопидогрел 75 мг/сут)',
        ppiRecommended: true
      },
      acuteFirst24h,
      secondaryPreventionCategory: 'non_cardioembolic',
      regimenSummaryRu: 'Пункт 1: ИГМ <24ч, NIHSS ≤3 / ТИА ABCD2 ≥4: ДААТ с клопидогрелом на 21 день (1 сут: 300 мг + 300 мг, со 2 по 21 сут: 75 мг + 75 мг, с 22 сут: монотерапия 75 мг).'
    };
  }

  // Rule 4: ИГМ <24ч, NIHSS ≥6
  if (isUnder24h && data.nihssScore >= 6 && !isTIA) {
    return {
      strategy: 'antiplatelet',
      timingDay: '1 сутки (в первые 24 часа)',
      timingRationale: 'Инсульт умеренной/тяжелой степени (NIHSS ≥ 6) в первые 24 часа (п. 4)',
      primaryRegimen: 'АСК 150–300 мг/сут с 1 по 14 сутки (ИЛИ Клопидогрел 300 мг в 1 сутки, со 2 суток 75 мг/сут)',
      dosingDetails:
        'С 1 по 14 сутки: АСК 150–300 мг/сут; с 15 суток: АСК 75 мг/сут. ИЛИ: 1 сутки: клопидогрел 300 мг/сут; со 2 суток: клопидогрел 75 мг/сут.',
      duration: 'Пожизненно',
      safetyNotes: 'При NIHSS ≥ 6 двойная антиагрегантная терапия не рекомендуется из-за риска геморрагической трансформации инфаркта.',
      alternativeRegimen: '1 сутки: клопидогрел 300 мг, со 2 суток: клопидогрел 75 мг/сут',
      protocolTableType: 'non_cardioembolic',
      ruleNumber: 4,
      ruleTitle: 'ИГМ <24ч, NIHSS ≥6 (п. 4)',
      ruleDescriptionRu: 'Таблица: Некардиоэмболический ИГМ | Пункт 4: АСК 150–300 мг или Клопидогрел 300 мг',
      protocolCitation: 'Таблица «Антитромботическая терапия при некардиоэмболическом ИГМ», п. 4',
      phase1: {
        timing: 'С 1 по 14 сутки',
        regimen: 'АСК 150–300 мг/сут (ИЛИ 1 сут Клопидогрел 300 мг, со 2 сут 75 мг)',
        dosing: 'АСК 150–300 мг 1 раз в сутки'
      },
      phase2: {
        timing: 'С 15 суток и далее',
        regimen: 'Пожизненная монотерапия',
        dosing: 'АСК 75 мг/сут ИЛИ клопидогрел 75 мг/сут'
      },
      acuteFirst24h,
      secondaryPreventionCategory: 'non_cardioembolic',
      regimenSummaryRu: 'Пункт 4: ИГМ <24ч, NIHSS ≥6: С 1 по 14 сутки: АСК 150–300 мг/сут, с 15 суток: АСК 75 мг/сут (или клопидогрел 300 мг с переходом на 75 мг).'
    };
  }

  // Rule 5: ИГМ 24–72ч, NIHSS ≤5 и ТИА высокого риска по ABCD2 ≥4
  const qualifiesForRule5 =
    is24to72h &&
    ((isTIA && abcd2 >= 4) || (!isTIA && data.nihssScore <= 5));

  if (qualifiesForRule5 && !data.activeBleeding) {
    return {
      strategy: 'antiplatelet',
      timingDay: '24–72 часа от дебюта',
      timingRationale: 'Поступление в интервале 24–72 часа, NIHSS ≤ 5 или ТИА ABCD2 ≥ 4 (п. 5)',
      primaryRegimen: 'Клопидогрел 75 мг/сут + АСК 75 мг/сут (без нагрузочной дозы) до 21 суток',
      dosingDetails:
        'До 21 суток: клопидогрел 75 мг/сут + АСК 75 мг/сут (нагрузочные дозы 300 мг НЕ применяются!). С 22 суток: монотерапия АСК 75 мг/сут или клопидогрел 75 мг/сут.',
      duration: 'До 21 суток ДААТ, далее пожизненная монотерапия',
      safetyNotes: 'Нагрузочная доза 300 мг после 24 часов не применяется. С 22 суток — переход на монотерапию.',
      alternativeRegimen: 'Монотерапия АСК 75–100 мг/сут при непереносимости клопидогрела',
      protocolTableType: 'non_cardioembolic',
      ruleNumber: 5,
      ruleTitle: 'ИГМ 24–72ч, NIHSS ≤5 и ТИА высокого риска по ABCD2 ≥4 (п. 5)',
      ruleDescriptionRu: 'Таблица: Некардиоэмболический ИГМ | Пункт 5: ДААТ без нагрузочной дозы до 21 суток',
      protocolCitation: 'Таблица «Антитромботическая терапия при некардиоэмболическом ИГМ», п. 5',
      phase1: {
        timing: 'До 21 суток',
        regimen: 'Клопидогрел 75 мг/сут + АСК 75 мг/сут',
        dosing: 'Клопидогрел 75 мг/сут + АСК 75 мг/сут (без нагрузочной дозы)'
      },
      phase2: {
        timing: 'С 22 суток и далее',
        regimen: 'Пожизненная монотерапия',
        dosing: 'АСК 75 мг/сут ИЛИ клопидогрел 75 мг/сут'
      },
      acuteFirst24h,
      secondaryPreventionCategory: 'non_cardioembolic',
      regimenSummaryRu: 'Пункт 5: ИГМ 24–72ч, NIHSS ≤5 / ТИА ABCD2 ≥4: До 21 суток — клопидогрел 75 мг + АСК 75 мг/сут без нагрузки, с 22 суток — монотерапия 75 мг.'
    };
  }

  // Rule 6: ИГМ не соответствует 5 пункту (>72ч, NIHSS >5 при поступлении >24ч, стандартная монотерапия)
  const hasBledResult = calculateHASBLED(data);
  let primaryRegimen = 'Монотерапия: АСК 75 мг/сут ИЛИ Клопидогрел 75 мг/сут';
  let dosingDetails = 'АСК 75–100 мг 1 раз в сутки утром после еды ИЛИ Клопидогрел 75 мг 1 раз в сутки';
  let compassText = '';

  if (data.multivascularDisease && hasBledResult.compassRegimenAllowed) {
    primaryRegimen = 'АСК 100 мг/сут + Ривароксабан 2.5 мг 2 р/сут (режим COMPASS с 30 суток)';
    dosingDetails = 'В первые 30 дней: АСК 100 мг/сут. С 30 суток: добавление Ривароксабана 2.5 мг 2 раза в сутки (п. 43.2).';
    compassText = ' При мультифокальном атеросклерозе (ИБС + ЗПА) с 30 суток показан режим COMPASS (АСК 100 мг + Ривароксабан 2.5 мг 2 р/с).';
  }

  return {
    strategy: 'antiplatelet',
    timingDay: 'С момента оценки',
    timingRationale: 'Инсульт не соответствует критериям пунктов 1–5 (поступление > 72ч или выраженный дефицит > 24ч) (п. 6)',
    primaryRegimen,
    dosingDetails,
    duration: 'Пожизненно',
    safetyNotes: 'Контроль артериального давления, исключение кровотечений. Двойная антиагрегантная терапия не показана.',
    alternativeRegimen: 'Клопидогрел 75 мг/сут при аспириновой язве / непереносимости АСК',
    protocolTableType: 'non_cardioembolic',
    ruleNumber: 6,
    ruleTitle: 'ИГМ не соответствует 5 пункту (п. 6)',
    ruleDescriptionRu: 'Таблица: Некардиоэмболический ИГМ | Пункт 6: Монотерапия АСК 75 мг или клопидогрел 75 мг',
    protocolCitation: 'Таблица «Антитромботическая терапия при некардиоэмболическом ИГМ», п. 6',
    phase1: {
      timing: 'Постоянно (пожизненно)',
      regimen: 'Монотерапия АСК или клопидогрел',
      dosing: 'АСК 75–100 мг/сут ИЛИ клопидогрел 75 мг/сут'
    },
    acuteFirst24h,
    secondaryPreventionCategory: 'non_cardioembolic',
    regimenSummaryRu: `Пункт 6: Монотерапия АСК 75 мг/сут или клопидогрел 75 мг/сут.${compassText}`
  };
}

/**
 * Main Calculation Function for Stroke Etiological Subtype (TOAST 2.0 & OCSP & ESUS)
 * Fully compliant with the Clinical Protocol of the Ministry of Health of the Republic of Belarus No. 1 of 05.01.2026
 */
export function calculateStrokeSubtypes(data: PatientData): CalculationResult {
  const scores: Record<ToastSubtypeKey, number> = {
    atherothrombotic: 0,
    cardioembolic: 0,
    lacunar: 0,
    other: 0,
    undetermined: 0
  };

  const details: Record<ToastSubtypeKey, ScoreDetailItem[]> = {
    atherothrombotic: [],
    cardioembolic: [],
    lacunar: [],
    other: [],
    undetermined: []
  };

  const allContributingPredictors: ScoreDetailItem[] = [];

  const addScore = (
    subtype: ToastSubtypeKey,
    points: number,
    predictorName: string,
    valueDesc: string,
    protocolRef?: string
  ) => {
    scores[subtype] += points;
    const item: ScoreDetailItem = {
      predictorName,
      valueDescription: valueDesc,
      pointsAdded: points,
      subtypesAffected: [subtype],
      protocolReference: protocolRef
    };
    details[subtype].push(item);
    allContributingPredictors.push(item);
  };

  // 1. NASCET Arterial Stenosis & Plaque Characteristics (items 10.1, 10.2, 10.3)
  const stenosis = data.targetVesselStenosisNascet || 0;
  if (stenosis >= 50) {
    addScore(
      'atherothrombotic',
      4.0,
      'Стеноз целевой церебральной/прецеребральной артерии ≥ 50% (NASCET)',
      `Гемодинамически значимый стеноз ${stenosis}% гомолатерально ишемическому очагу`,
      'п. 10.1 (Достоверный атеротромботический подтип)'
    );
  } else if (stenosis > 0 && data.plaqueUlcerationOrThrombus) {
    addScore(
      'atherothrombotic',
      3.5,
      'Стеноз < 50% с признаками изъязвления или пристеночного тромбоза',
      `Стеноз ${stenosis}% с эмбологенной/нестабильной бляшкой по УЗИ/КТА/МРА`,
      'п. 10.1 (Достоверный атеротромботический подтип)'
    );
  } else if (stenosis > 0 && stenosis < 50) {
    if (data.amaurosisFugaxOrTIAinTargetVesselLastMonth) {
      addScore(
        'atherothrombotic',
        2.0,
        'Стеноз < 50% + ТИА/amaurosis fugax в бассейне артерии за последний месяц',
        `Стеноз ${stenosis}% без изъязвления, но с клинической манифестацией в последние 30 дней`,
        'п. 10.3 (Возможный атеротромботический подтип)'
      );
    } else {
      addScore(
        'undetermined',
        1.0,
        'Стеноз < 50% без признаков изъязвления/тромбоза бляшки',
        `По п. 10 диагноз атеротромботического подтипа НЕ МОЖЕТ быть установлен при стенозе < 50% без изъязвления/тромбоза`,
        'п. 10 (Императивное диагностическое правило)'
      );
    }
  }

  // Additional LAA predictors (item 10.2)
  if (data.amaurosisFugaxOrTIAinTargetVesselLastMonth && stenosis >= 50) {
    addScore(
      'atherothrombotic',
      1.5,
      'Amaurosis fugax, ТИА или ОНМК в бассейне артерии за последний месяц',
      'Клинический маркер нестабильности каротидной бляшки',
      'п. 10.2'
    );
  }

  if (data.watershedInfarctPattern) {
    addScore(
      'atherothrombotic',
      2.0,
      'Инфаркты в зоне «водораздела» (смежного кровообращения)',
      'Характерны для гемодинамического дефицита при стенозе/окклюзии магистральной артерии',
      'п. 10.2'
    );
  }

  if (data.acuteArterialOcclusionOrSubocclusion) {
    addScore(
      'atherothrombotic',
      2.0,
      'Острая субокклюзия или окклюзия артерии в зоне атеросклеротической бляшки',
      'Окклюзирующий тромбоз на фоне атеросклеротического поражения',
      'п. 10.2'
    );
  }

  // 2. Cardiac Embolic Sources (Chapter 2, item 11 & Appendix 1)
  const highRiskSources = data.highRiskCardiacSources || [];
  const lowRiskSources = data.lowRiskCardiacSources || [];

  if (highRiskSources.length > 0) {
    const names = highRiskSources
      .map((k) => HIGH_RISK_CARDIAC_SOURCES.find((s) => s.key === k)?.nameRu)
      .filter(Boolean)
      .join(', ');
    addScore(
      'cardioembolic',
      5.0,
      'Кардиальный источник эмболии ВЫСОКОГО РИСКА (Приложение 1)',
      names,
      'п. 11.1 (Достоверный кардиоэмболический подтип)'
    );
  }

  if (data.systemicEmbolism) {
    addScore(
      'cardioembolic',
      3.0,
      'Системная артериальная эмболия в анамнезе (конечности, почки, селезенка)',
      'Подтверждает системный эмбологенный потенциал (минимум 3.0 б.)',
      'п. 11.2'
    );
  }

  if (data.bihemisphericAcuteInfarcts) {
    addScore(
      'cardioembolic',
      3.5,
      'Множественные острые инфаркты в обоих полушариях (или каротидный + ВББА)',
      'При отсутствии ипсилатеральной окклюзии свидетельствует о центральном (кардиогенном) эмболическом источнике',
      'п. 11.2'
    );
  }

  if (lowRiskSources.length > 0 && highRiskSources.length === 0) {
    const names = lowRiskSources
      .map((k) => LOW_RISK_CARDIAC_SOURCES.find((s) => s.key === k)?.nameRu)
      .filter(Boolean)
      .join(', ');
    addScore(
      'cardioembolic',
      3.0,
      'Кардиальный источник УМЕРЕННОГО / НЕОПРЕДЕЛЕННОГО РИСКА (Приложение 1)',
      names,
      'п. 11.3 (Возможный кардиоэмболический подтип — минимум 3.0 б.)'
    );
  }

  if (data.chfOrPostMI && highRiskSources.length === 0 && lowRiskSources.length === 0) {
    addScore(
      'cardioembolic',
      3.0,
      'Хроническая сердечная недостаточность / постинфарктный кардиосклероз',
      'Кардиальная коморбидность с потенциальным тромбообразованием в полостях сердца',
      'п. 11, Приложение 1'
    );
  }

  // Ensure minimum 3.0 points for cardioembolic subtype if any cardiac finding is present
  const hasAnyCardiacFinding =
    highRiskSources.length > 0 ||
    lowRiskSources.length > 0 ||
    data.systemicEmbolism ||
    data.bihemisphericAcuteInfarcts ||
    data.chfOrPostMI;

  if (hasAnyCardiacFinding && scores.cardioembolic < 3.0) {
    scores.cardioembolic = 3.0;
  }

  // 3. Small-Vessel Lacunar Stroke (Chapter 2, item 12)
  const isLacunarSyndromePresent =
    data.pureMotorStroke ||
    data.pureSensoryStroke ||
    data.sensorimotorStroke ||
    data.ataxicHemiparesis ||
    data.dysarthriaClumsyHand;

  if (data.lacunarDiameterUnder20mm && !data.corticalSigns && !data.hemianopia) {
    addScore(
      'lacunar',
      3.5,
      'Изолированный очаг инфаркта < 20 мм (< 2 см) на КТ/МРТ',
      'Локализация в базальных ганглиях, внутренней капсуле или стволе при отсутствии изменений в крупной артерии',
      'п. 12.1 (Достоверный лакунарный подтип)'
    );
  }

  if (isLacunarSyndromePresent) {
    addScore(
      'lacunar',
      2.0,
      'Классический изолированный лакунарный синдром',
      data.pureMotorStroke
        ? 'Чистый двигательный инсульт (PMS)'
        : data.pureSensoryStroke
        ? 'Чистый чувствительный инсульт (PSS)'
        : data.sensorimotorStroke
        ? 'Сенсомоторный инсульт'
        : data.ataxicHemiparesis
        ? 'Атаксический гемипарез'
        : 'Синдром дизартрии и неловкой кисти',
      'п. 12.1, 12.2'
    );
  }

  if (data.stereotypicTIAsLastWeek) {
    addScore(
      'lacunar',
      2.0,
      'Повторные стереотипные ТИА в течение последней недели',
      'Лакунарный «предупреждающий» синдром (lacunar warning syndrome)',
      'п. 12.2'
    );
  }

  if (data.hypertension) {
    addScore(
      'lacunar',
      1.0,
      'Длительная артериальная гипертензия в анамнезе',
      'Основной этиологический фактор липогиалиноза перфорантных артерий',
      'п. 12, 26.2'
    );
    addScore(
      'atherothrombotic',
      0.5,
      'Артериальная гипертензия (фактор атерогенеза)',
      'Системный сосудистый риск',
      'п. 26.2'
    );
  }

  // 4. Other Determined Etiology (ODE, Chapter 2, item 13 & Appendix 16)
  const rareCauses = data.selectedRareCauses || [];
  if (rareCauses.length > 0) {
    const rareNames = rareCauses
      .map((k) => RARE_CAUSES_LIST.find((r) => r.key === k)?.nameRu)
      .filter(Boolean)
      .join('; ');
    addScore(
      'other',
      4.0,
      'Подтвержденное редкое заболевание / артериопатия (Приложение 16)',
      rareNames,
      'п. 13.1 (Достоверный подтип другой установленной этиологии)'
    );
  }

  if (data.dissectionOrSurgeryTemporalLink) {
    addScore(
      'other',
      2.5,
      'Прямая временная связь с диссекцией или оперативным вмешательством',
      'Развитие инсульта на фоне диссекции артерии или инвазивной процедуры',
      'п. 13.2, 13.3'
    );
  }

  // 5. Clinical Onset Mode & Additional Correlates
  if (data.onsetMode === 'sudden') {
    addScore(
      'cardioembolic',
      1.0,
      'Внезапное одномоментное начало («эмболический пик»)',
      'Мгновенное развитие максимального неврологического дефицита во время бодрствования',
      'Глава 2'
    );
  } else if (data.onsetMode === 'stuttering') {
    addScore(
      'atherothrombotic',
      1.0,
      'Мерцающее / ступенчатое нарастание дефицита',
      'Нарастание симптоматики волнообразно, часто в ночные/утренние часы',
      'Глава 2'
    );
  } else if (data.onsetMode === 'gradual') {
    addScore(
      'lacunar',
      0.8,
      'Постепенное медленное нарастание дефицита',
      'Характерно для тромбоза микроциркуляторного русла',
      'Глава 2'
    );
  }

  // Cortical vs Subcortical imaging
  if (data.corticalSigns || data.hemianopia) {
    addScore(
      'atherothrombotic',
      1.0,
      'Наличие высших корковых нарушений / гемианопсии',
      'Свидетельствует о поражении коры большого мозга (бассейн крупной мозговой артерии)',
      'п. 9, 10'
    );
    addScore(
      'cardioembolic',
      1.0,
      'Корковый дефицит (афазия/неглект)',
      'Характерен для артерио-артериальной или кардиогенной эмболии',
      'п. 11'
    );
  }

  // High BP in acute period
  if (data.systolicBP >= 180 || data.diastolicBP >= 100) {
    addScore(
      'atherothrombotic',
      0.8,
      'Выраженная артериальная гипертензия в острейшем периоде (АД ≥ 180/100)',
      'Стрессовая реакция перфузии на стеноз/окклюзию магистрального ствола',
      'п. 26.2'
    );
  }

  // 6. Base / Minimum scores to avoid 0
  scores.atherothrombotic = Math.max(0.2, scores.atherothrombotic);
  scores.cardioembolic = Math.max(0.2, scores.cardioembolic);
  scores.lacunar = Math.max(0.2, scores.lacunar);
  scores.other = Math.max(0.1, scores.other);
  scores.undetermined = Math.max(0.3, scores.undetermined);

  // If both LAA and CE are high -> Coexisting causes (UDE item 14.3)
  const hasLAA_high = stenosis >= 50 || (stenosis > 0 && data.plaqueUlcerationOrThrombus);
  const hasCE_high = highRiskSources.length > 0;
  if (hasLAA_high && hasCE_high) {
    addScore(
      'undetermined',
      4.0,
      'Две и более вероятные конкурирующие причины (п. 14.3)',
      `Одновременное сочетание кардиоэмболического источника высокого риска и стеноза артерии ≥ 50%`,
      'п. 14.3 (Неустановленная этиология: конкурирующие подтипы)'
    );
  }

  // If no imaging performed or incomplete workup
  if (!data.neuroimagingPerformed) {
    addScore(
      'undetermined',
      3.0,
      'Неполное клинико-инструментальное обследование (п. 14.1)',
      'КТ/МРТ головного мозга не выполнена — достоверный диагноз подтипа невозможен',
      'п. 14.1'
    );
  }

  // Total and percentages
  const totalScore = Object.values(scores).reduce((acc, v) => acc + v, 0);

  // Determine certainty for each subtype
  const subtypeResults: SubtypeCalculationResult[] = (
    Object.keys(scores) as ToastSubtypeKey[]
  ).map((key) => {
    const s = scores[key];
    const pct = Math.round((s / totalScore) * 100);

    let certainty: SubtypeCertainty = 'possible';
    let certaintyRu = 'Возможный подтип';

    if (key === 'atherothrombotic') {
      if (stenosis >= 50 || (stenosis > 0 && data.plaqueUlcerationOrThrombus)) {
        certainty = 'verified';
        certaintyRu = 'Достоверный (п. 10.1)';
      } else if (
        data.amaurosisFugaxOrTIAinTargetVesselLastMonth ||
        data.watershedInfarctPattern ||
        data.acuteArterialOcclusionOrSubocclusion
      ) {
        certainty = 'probable';
        certaintyRu = 'Вероятный (п. 10.2)';
      }
    } else if (key === 'cardioembolic') {
      if (highRiskSources.length > 0) {
        certainty = 'verified';
        certaintyRu = 'Достоверный (п. 11.1)';
      } else if (data.systemicEmbolism || data.bihemisphericAcuteInfarcts) {
        certainty = 'probable';
        certaintyRu = 'Вероятный (п. 11.2)';
      }
    } else if (key === 'lacunar') {
      if (data.lacunarDiameterUnder20mm && isLacunarSyndromePresent) {
        certainty = 'verified';
        certaintyRu = 'Достоверный (п. 12.1)';
      } else if (data.stereotypicTIAsLastWeek || isLacunarSyndromePresent) {
        certainty = 'probable';
        certaintyRu = 'Вероятный (п. 12.2)';
      }
    } else if (key === 'other') {
      if (rareCauses.length > 0) {
        certainty = 'verified';
        certaintyRu = 'Достоверный (п. 13.1)';
      } else if (data.dissectionOrSurgeryTemporalLink) {
        certainty = 'probable';
        certaintyRu = 'Вероятный (п. 13.2)';
      }
    } else if (key === 'undetermined') {
      if (!data.neuroimagingPerformed) {
        certaintyRu = 'Неполное обследование (п. 14.1)';
      } else if (hasLAA_high && hasCE_high) {
        certaintyRu = 'Две и более причины (п. 14.3)';
      } else {
        certaintyRu = 'Криптогенный / ESUS (п. 14.2, 15)';
      }
    }

    return {
      key,
      score: Math.round(s * 10) / 10,
      percentage: pct,
      certainty,
      certaintyRu,
      details: details[key]
    };
  });

  // Sort descending by percentage
  subtypeResults.sort((a, b) => b.percentage - a.percentage);

  // If two competing causes -> dominant is undetermined
  let dominantSubtypeResult = subtypeResults[0];
  if (hasLAA_high && hasCE_high) {
    const under = subtypeResults.find((s) => s.key === 'undetermined');
    if (under) dominantSubtypeResult = under;
  }

  const dominantSubtypeInfo = TOAST_SUBTYPES_METADATA[dominantSubtypeResult.key];

  // Confidence description
  let confidenceDescriptionRu = '';
  if (dominantSubtypeResult.certainty === 'verified') {
    confidenceDescriptionRu =
      'Высокая достоверность: диагноз полностью соответствует критериям достоверного подтипа согласно Клиническому протоколу МЗ РБ № 1 от 05.01.2026.';
  } else if (dominantSubtypeResult.certainty === 'probable') {
    confidenceDescriptionRu =
      'Умеренная достоверность: диагноз квалифицируется как вероятный подтип. Рекомендуется расширенное дообследование (КТА, ЧП-ЭхоКГ, Холтер-ЭКГ).';
  } else {
    confidenceDescriptionRu =
      'Возможный подтип или конкурирующие источники. Необходим мультидисциплинарный консилиум и дообследование по стандарту протокола.';
  }

  // OCSP
  const ocspResult = calculateOCSP(data);

  // ESUS Check (items 15, 16, 25.3)
  const isNonLacunar =
    data.imagingFocusSize === 'large_territorial' ||
    data.imagingFocusSize === 'multifocal' ||
    data.infarctDiameterCm >= 2.0 ||
    data.corticalSigns ||
    data.hemianopia;
  const noStenosisOver50 = stenosis < 50 && !data.plaqueUlcerationOrThrombus;
  const noHighRiskCardiacSource = highRiskSources.length === 0;
  const noOtherEtiology = rareCauses.length === 0 && !data.dissectionOrSurgeryTemporalLink;

  const isESUS =
    isNonLacunar &&
    noStenosisOver50 &&
    noHighRiskCardiacSource &&
    noOtherEtiology &&
    data.neuroimagingPerformed;

  const requiresBubbleTest = isESUS && data.age < 55;

  let esusRecRu = '';
  if (isESUS) {
    esusRecRu =
      'Пациент соответствует критериям эмболического инсульта из неустановленного источника (ESUS, п. 15–16): нелакунарный инфаркт мозга при отсутствии стеноза артерии ≥ 50%, источников высокого риска и редких причин.';
    if (requiresBubbleTest) {
      esusRecRu +=
        ' Возраст пациента моложе 55 лет: по п. 25.3 в обязательном порядке показано проведение ТКДГ с пузырьковой пробой (bubble test) или ТТЭ с контрастированием для выявления открытого овального окна (ООО) и парадоксальной эмболии!';
    } else {
      esusRecRu +=
        ' Рекомендовано продленное мониторирование ЭКГ (Холтер ≥ 72ч / петлевой регистратор) для верификации скрытой пароксизмальной ФП (п. 25.2).';
    }
  }

  const esusAssessment: ESUSAssessment = {
    isESUS,
    criteriaMet: {
      nonLacunar: isNonLacunar,
      noStenosisOver50,
      noHighRiskCardiacSource,
      noOtherEtiology
    },
    recommendationRu: esusRecRu,
    requiresBubbleTest
  };

  // Reperfusion
  const reperfusionAssessment = evaluateReperfusion(data);

  // Antithrombotic Plan
  const antithromboticPlan = calculateAntithromboticPlan(
    data,
    dominantSubtypeResult.key,
    reperfusionAssessment.ivtEligible || reperfusionAssessment.evtEligible
  );

  // Malignant Stroke
  const malignantStrokeAlert = evaluateMalignantStroke(data);

  // ABCD2 (for TIA / minor stroke)
  const abcd2Result = calculateABCD2(data);

  // HAS-BLED
  const hasBledResult = calculateHASBLED(data);

  // Carotid surgery recommendation (items 46-47)
  let carotidSurgery = undefined;
  if (
    stenosis >= 50 &&
    stenosis < 100 &&
    dominantSubtypeResult.key === 'atherothrombotic' &&
    data.preStrokeMRS <= 2
  ) {
    if (stenosis >= 70) {
      carotidSurgery = `Симптомный критический стеноз ВСА ${stenosis}% (NASCET): абсолютное показание к проведению каротидной эндартерэктомии (КЭЭ) в первые 14 дней от развития симптомов (п. 46.1).`;
    } else {
      carotidSurgery = `Симптомный стеноз ВСА ${stenosis}% (NASCET): проведение КЭЭ показано при условии периоперационной летальности и инсульта < 6% в учреждении, предпочтительно в первые 14 дней (п. 46.2).`;
    }
  }

  // Basic care recommendations (Chapter 4, item 26)
  const basicCareRecommendations = {
    bloodPressure:
      reperfusionAssessment.ivtEligible
        ? 'Целевое АД перед ТЛТ: строго < 185/110 мм рт.ст., во время и в первые 24ч после ТЛТ < 180/105 мм рт.ст. (п. 26.2). Не использовать вазодилататоры!'
        : 'Без реперфузионного лечения: не снижать АД в первые 24–48 часов, за исключением подъема САД > 220 мм рт.ст. или ДАД > 120 мм рт.ст. (снижение не более чем на 15% за первые 24 часа) (п. 26.2). Запрещен резкий спад АД!',
    glucoseControl:
      'Контроль гликемии каждые 6 часов. При гликемии > 10.0 ммоль/л — инсулинотерапия короткого действия (целевой диапазон 7.7–10.0 ммоль/л). Не допускать гипогликемии < 3.0 ммоль/л! (п. 26.5)',
    lipidTarget:
      'Аторвастатин 80 мг/сут или Розувастатин 20–40 мг/сут с первых суток. Целевой уровень ХС-ЛПНП < 1.8 ммоль/л или снижение на ≥ 50% от исходного. При недостижении цели — добавление Эзетимиба 10 мг (п. 26.6).',
    dvtProphylaxis:
      'Профилактика ТГВ и ТЭЛА: перемежающаяся пневматическая компрессия нижних конечностей с первых суток (п. 26.8). Применение эластических бинтов и чулок ПРОТИВОПОКАЗАНО из-за отсутствия эффекта и риска повреждения кожи (п. 26.8). При высоком риске ТГВ — НМГ в профилактических дозах через 24ч.',
    feverManagement:
      'Контроль температуры тела каждые 4–6 часов. При гипертермии > 37.5°C — парацетамол 500–1000 мг, активный поиск очага инфекции (пневмония, ИМВП) (п. 26.4).',
    dysphagiaAndNutrition:
      data.dysphagiaOrNasogastricTube
        ? 'Выявлена дисфагия: строгий запрет перорального приема жидкости и пищи! Установка назогастрального зонда в первые 24–48 часов, применение компенсаторных маневров глотания (Shaker, Masako, маневр Мендельсона, глоток с усилием) (Приложения 6, 11).'
        : 'Скрининг глотания (протокол 3 глотков воды) обязателен до первого приема любых лекарств, воды или пищи (Приложение 6).',
    furtherWorkup: [
      'Дуплексное сканирование брахиоцефальных артерий (УЗДГ БЦА) для оценки бляшек и спектра кровотока (п. 24.1)',
      'Холтеровское мониторирование ЭКГ продолжительностью не менее 24–72 часов для исключения пароксизмальной ФП (п. 25.2)',
      'Трансторакальная ЭхоКГ (при подозрении на клапанную патологию / тромбоз — чреспищеводная ЧП-ЭхоКГ) (п. 25.1)',
      'Липидограмма развернутая (ХС общий, ХС-ЛПНП, ХС-ЛПВП, триглицериды), гликированный гемоглобин HbA1c (п. 23.3)',
      'Коагулограмма (ПВ, МНО, АЧТВ, фибриноген) (п. 23.2)'
    ],
    carotidSurgery
  };

  // UI compatibility structures
  const reperfusion = {
    ivtEligible: reperfusionAssessment.ivtEligible,
    ivtWindowStatus:
      reperfusionAssessment.ivtWindowType === 'standard_4_5h'
        ? 'Терапевтическое окно 0–4.5 часа (стандартное)'
        : reperfusionAssessment.ivtWindowType === 'extended_4_5_to_9h'
        ? 'Расширенное окно 4.5–9 часов / wake-up'
        : 'Вне терапевтического окна (> 4.5 ч) либо наличие противопоказаний',
    ivtContraindications: reperfusionAssessment.ivtContraindications,
    evtEligible: reperfusionAssessment.evtEligible,
    evtWindowStatus:
      reperfusionAssessment.evtWindowType === 'window_0_6h'
        ? 'Терапевтическое окно 0–6 часов'
        : reperfusionAssessment.evtWindowType === 'window_6_24h'
        ? 'Расширенное окно 6–24 часа (DAWN / DEFUSE-3)'
        : 'Вне терапевтического окна либо отсутствие окклюзии крупной артерии',
    evtRationale: reperfusionAssessment.evtRationale
  };

  const malignantAlert = {
    isSuspected: malignantStrokeAlert.isHighRisk,
    alertTitle:
      malignantStrokeAlert.type === 'MCA'
        ? 'Угроза злокачественного инфаркта в бассейне СМА'
        : malignantStrokeAlert.type === 'Cerebellar'
        ? 'Угроза злокачественного инфаркта мозжечка'
        : 'Риск отека мозга умеренный',
    urgencyRationale: malignantStrokeAlert.riskDescription,
    actionPlan: malignantStrokeAlert.surgicalProcedure
  };

  const abcd2Score = {
    score: abcd2Result?.score ?? 0,
    riskCategory: abcd2Result?.riskCategoryRu ?? 'Низкий'
  };

  const hasBledScore = {
    score: hasBledResult.score,
    riskLevel: hasBledResult.riskCategoryRu
  };

  const recommendations = {
    antithrombotic: antithromboticPlan.regimenSummaryRu,
    lipidTherapy: basicCareRecommendations.lipidTarget,
    bpControl: basicCareRecommendations.bloodPressure,
    furtherWorkup: basicCareRecommendations.furtherWorkup,
    surgicalOrInterventional: basicCareRecommendations.carotidSurgery
  };

  return {
    dominantSubtype: dominantSubtypeInfo,
    dominantCertainty: dominantSubtypeResult.certainty,
    dominantCertaintyRu: dominantSubtypeResult.certaintyRu,
    confidenceLevelRu: dominantSubtypeResult.certaintyRu,
    confidenceDescriptionRu,
    toastSubtypes: subtypeResults,
    ocspResult,
    esusAssessment,
    reperfusionAssessment,
    reperfusion,
    antithromboticPlan,
    malignantStrokeAlert,
    malignantAlert,
    abcd2Result,
    abcd2Score,
    hasBledResult,
    hasBledScore,
    contributingPredictors: allContributingPredictors,
    basicCareRecommendations,
    recommendations,
    protocolVersion: 'Клинический протокол МЗ РБ № 1 от 05.01.2026',
    calcDate: new Date().toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
}

/**
 * Initial empty patient data state
 */
export const INITIAL_PATIENT_DATA: PatientData = {
  patientName: '',
  age: 68,
  gender: 'male',

  hypertension: true,
  coronaryHeartDisease: false,
  diabetesMellitus: false,
  chfOrPostMI: false,
  previousStrokeOrTIA: false,
  previousStrokeWithin1Month: false,
  previousICH: false,
  previousICHWithin1Year: false,
  recentSTEMIwithin7days: false,

  targetVesselStenosisNascet: 0,
  plaqueUlcerationOrThrombus: false,
  amaurosisFugaxOrTIAinTargetVesselLastMonth: false,
  watershedInfarctPattern: false,
  acuteArterialOcclusionOrSubocclusion: false,
  contralateralArteryDisease: false,

  highRiskCardiacSources: [],
  lowRiskCardiacSources: [],
  systemicEmbolism: false,
  bihemisphericAcuteInfarcts: false,

  lacunarDiameterUnder20mm: false,
  stereotypicTIAsLastWeek: false,
  pureMotorStroke: false,
  pureSensoryStroke: false,
  sensorimotorStroke: false,
  ataxicHemiparesis: false,
  dysarthriaClumsyHand: false,

  selectedRareCauses: [],
  dissectionOrSurgeryTemporalLink: false,

  onsetMode: 'sudden',
  onsetTimeHours: 2.5,
  isWakeUpStroke: false,
  nihssScore: 8,
  preStrokeMRS: 0,

  corticalSigns: true,
  hemianopia: false,
  motorDeficit: true,
  sensoryDeficit: false,
  brainstemCerebellarSigns: false,

  systolicBP: 160,
  diastolicBP: 95,
  bpAsymmetry20: false,
  oxygenSaturation: 97,
  temperatureC: 36.6,
  bloodGlucoseMmol: 6.2,
  plateletCountThousand: 220,
  takingDOACwithin12h: false,
  activeBleeding: false,
  intracranialHemorrhageCT: false,

  neuroimagingPerformed: true,
  imagingModality: 'CT',
  aspectScore: 8,
  imagingFocusSize: 'large_territorial',
  infarctDiameterCm: 3.2,
  isMalignantMCASuspected: false,
  isMalignantCerebellarSuspected: false,
  largeVesselOcclusionConfirmed: true,
  occludedArterySegment: 'MCA_M1',
  perfusionMismatchConfirmed: true,

  estimatedCrCl: 65,
  historyOfGIBleeding: false,
  dyspepsia: false,
  weightKg: 78,
  elevatedLiverEnzymesALT2x: false,
  dysphagiaOrNasogastricTube: false,
  recurrentTIAonAntiplatelets: false,
  multivascularDisease: false
};
