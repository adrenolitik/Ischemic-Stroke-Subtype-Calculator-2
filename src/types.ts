/**
 * Clinical Protocol of the Ministry of Health of the Republic of Belarus
 * Resolution of January 5, 2026 No. 1
 * "Diagnostics and Treatment of Patients (Adult Population) with Ischemic Stroke and Transient Ischemic Attack"
 * Types and Data Contracts for Version 2.0
 */

export type ToastSubtypeKey =
  | 'atherothrombotic'
  | 'cardioembolic'
  | 'lacunar'
  | 'other'
  | 'undetermined';

export type SubtypeCertainty = 'verified' | 'probable' | 'possible'; // Достоверный, Вероятный, Возможный

export interface ToastSubtypeInfo {
  key: ToastSubtypeKey;
  nameRu: string;
  shortRu: string;
  nameEn: string;
  code: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export type OCSPCategoryKey = 'TACS' | 'PACS' | 'LACS' | 'POCS';

export interface OCSPInfo {
  key: OCSPCategoryKey;
  nameRu: string;
  fullNameRu: string;
  fullNameEn: string;
  territoryRu: string;
  description: string;
  color: string;
  badgeBg: string;
}

export type OnsetCharacter = 'sudden' | 'stuttering' | 'gradual' | 'fluctuating';

export type NascetGrade =
  | 'none' // < 30%
  | 'mild' // 0-29%
  | 'moderate' // 30-49%
  | 'severe' // 50-69%
  | 'critical' // 70-99%
  | 'occlusion'; // 100%

export type HighRiskCardiacSourceKey =
  | 'af_or_flutter' // ФП и трепетание предсердий
  | 'atrial_or_ventricular_thrombus' // Тромб левого предсердия, левого желудочка
  | 'sick_sinus_syndrome' // СССУ
  | 'mitral_stenosis_or_rheumatic' // Митральный стеноз или ревматическое поражение
  | 'prosthetic_valve' // Биопротезы и механические клапаны
  | 'recent_mi_under_1m' // Недавний ИМ (< 1 месяца)
  | 'post_mi_ef_under_28' // Последствия ИМ с ФВ < 28%
  | 'dcm_ef_under_40' // ДКМП (ФВ < 40%)
  | 'infective_endocarditis' // Инфекционный / небактериальный эндокардит
  | 'papillary_fibroelastoma' // Папиллярная фиброэластома
  | 'atrial_myxoma'; // Миксома левого предсердия

export type LowRiskCardiacSourceKey =
  | 'mitral_annular_calcification' // Кальциноз митрального кольца
  | 'pfo_or_asa' // ООО и (или) аневризма МПП
  | 'lv_aneurysm_no_thrombus' // Аневризма ЛЖ без тромба
  | 'spontaneous_echo_contrast' // Феномен спонтанного эхо-контрастирования в ЛП
  | 'chf_ef_under_30' // Застойная сердечная недостаточность с ФВ < 30%
  | 'wall_motion_abnormality' // Гипокинезия / акинезия / дискинезия стенок
  | 'hcm_or_lvh' // ГКМП / гипертрофия ЛЖ
  | 'lv_noncompaction' // Некомпактный левый желудочек
  | 'aortic_atheroma_over_4mm'; // Атерома аорты > 4 мм или с изъязвлением

export type RareCauseKey =
  | 'arterial_dissection' // Диссекция церебральных артерий
  | 'rcvs' // Синдром обратимой церебральной вазоконстрикции
  | 'moyamoya' // Болезнь мойя-мойя
  | 'fibromuscular_dysplasia' // Фибромускулярная дисплазия
  | 'cadasil_carasil' // CADASIL / CARASIL
  | 'fabry_disease' // Болезнь Фабри
  | 'cns_vasculitis' // Изолированный ангиит ЦНС / височный артериит
  | 'antiphospholipid_syndrome' // Антифосфолипидный синдром (АФС)
  | 'hereditary_thrombophilia' // Наследственные тромбофилии (мутация протромбина 20210A, Лейден)
  | 'sinus_venous_thrombosis' // Тромбоз венозных синусов ГМ
  | 'migrainous_infarction'; // Мигренозный инсульт

export interface PatientData {
  id?: string;
  patientName?: string;
  age: number;
  gender: 'male' | 'female';
  calcDate?: string;

  // Anamnesis & Risk Factors
  hypertension: boolean; // Артериальная гипертензия (п. 26.2)
  coronaryHeartDisease: boolean; // ИБС
  diabetesMellitus: boolean; // Сахарный диабет (п. 26.5)
  chfOrPostMI: boolean; // ХСН или перенесенный ИМ
  previousStrokeOrTIA: boolean; // ОНМК или ТИА в анамнезе
  previousStrokeWithin1Month: boolean; // ИИ давностью менее 1 месяца (противопоказание к ТЛТ, п. 29)
  previousICH: boolean; // ВМК в анамнезе
  previousICHWithin1Year: boolean; // ВМК < 1 года назад (противопоказание к ТЛТ, п. 29)
  recentSTEMIwithin7days: boolean; // Подострый ИМ с подъемом ST < 7 дней (противопоказание к ТЛТ, п. 29)

  // Vascular & Arterial Findings (NASCET & Carotid duplex / CTA)
  targetVesselStenosisNascet: number; // Процент стеноза целевой артерии (0-100%)
  plaqueUlcerationOrThrombus: boolean; // Изъязвление или тромбоз атеросклеротической бляшки (п. 10.1)
  amaurosisFugaxOrTIAinTargetVesselLastMonth: boolean; // Преходящая монокулярная слепота, ТИА или ИИ в бассейне целевой артерии в течение последнего месяца (п. 10.2, 10.3)
  watershedInfarctPattern: boolean; // Инфаркт в зоне «водораздела» (п. 10.2)
  acuteArterialOcclusionOrSubocclusion: boolean; // Острая окклюзия или субокклюзия целевой артерии (п. 10.2)
  contralateralArteryDisease: boolean; // Поражение контралатеральной артерии

  // Cardiac Embolism Findings (Appendix 1)
  highRiskCardiacSources: HighRiskCardiacSourceKey[]; // Кардиальные источники высокого риска
  lowRiskCardiacSources: LowRiskCardiacSourceKey[]; // Источники низкого / неопределенного риска
  systemicEmbolism: boolean; // Системная эмболия (конечности, почки, селезенка) (п. 11.2)
  bihemisphericAcuteInfarcts: boolean; // Множественные инфаркты в обоих полушариях или каротидный + ВББА (п. 11.2)

  // Lacunar Characteristics (п. 12)
  lacunarDiameterUnder20mm: boolean; // Изолированный очаг < 20 мм в базальных ганглиях/мосту/стволе (п. 12.1)
  stereotypicTIAsLastWeek: boolean; // Повторные стереотипные ТИА в течение последней недели (п. 12.2)
  pureMotorStroke: boolean; // Чистый двигательный синдром
  pureSensoryStroke: boolean; // Чистый чувствительный синдром
  sensorimotorStroke: boolean; // Сенсомоторный инсульт
  ataxicHemiparesis: boolean; // Атаксический гемипарез
  dysarthriaClumsyHand: boolean; // Синдром дизартрии и неловкой кисти

  // Rare Causes (п. 13 & Appendix 16)
  selectedRareCauses: RareCauseKey[];
  dissectionOrSurgeryTemporalLink: boolean; // Связь с диссекцией артерии или операцией на сердце/артериях (п. 13.3)

  // Clinical Onset & Severity
  onsetMode: OnsetCharacter; // Внезапное, ступенчатое, постепенное, флюктуирующее
  onsetTimeHours: number; // Время от начала симптомов (в часах)
  isWakeUpStroke: boolean; // Инсульт после пробуждения (инсульт во сне)
  timeFromMidSleepHours?: number; // Время от середины сна (п. 28.2)
  nihssScore: number; // Общий балл NIHSS (0-42, Приложение 3)
  preStrokeMRS: number; // Инвалидизация до инсульта по mRS (0-5, Приложение 5)
  gcsScore?: number; // Балл GCS (Приложение 2)

  // Neurological Deficits for OCSP
  corticalSigns: boolean; // Афазия, агнозия, неглект
  hemianopia: boolean; // Гомонимная гемианопсия
  motorDeficit: boolean; // Гемипарез / монопарез
  sensoryDeficit: boolean; // Гемигипестезия
  brainstemCerebellarSigns: boolean; // Стволовая / мозжечковая симптоматика

  // Hemodynamics & Vitals
  systolicBP: number; // Систолическое АД (мм рт.ст.)
  diastolicBP: number; // Диастолическое АД (мм рт.ст.)
  bpAsymmetry20: boolean; // Асимметрия АД на руках > 20 мм рт.ст.
  oxygenSaturation: number; // SpO2 (%)
  temperatureC: number; // Температура тела (°C)
  bloodGlucoseMmol: number; // Глюкоза крови (ммоль/л, п. 26.5)
  plateletCountThousand: number; // Тромбоциты (x10^9/л, норма ≥ 100)
  inrValue?: number; // МНО (для варфарина)
  takingDOACwithin12h: boolean; // Прием ПОАК в течение 12 часов до инсульта
  doacAntiXaNormalOrCoagNormal?: boolean; // Анти-Ха < 0.5 Ед/мл или ТВ < 60 с (п. 28.4)
  activeBleeding: boolean; // Активное внутреннее кровотечение (п. 29)
  intracranialHemorrhageCT: boolean; // ВМК на КТ/МРТ (п. 29)

  // Neuroimaging (CT / MRI / CTA / CTP / DWI)
  neuroimagingPerformed: boolean;
  imagingModality: 'CT' | 'MRI' | 'CTP_CTA' | 'none';
  aspectScore: number; // Балл по шкале ASPECT (0-10, Приложение 7)
  pcAspectScore?: number; // Балл по шкале pc-ASPECT для ЗЧЯ (0-10, Приложение 8)
  imagingFocusSize: 'lacunar' | 'large_territorial' | 'multifocal' | 'no_lesion' | 'other';
  infarctDiameterCm: number; // Точный максимальный размер инфаркта на КТ (см) для сроков ОАК (п. 43.1)
  infarctVolumeMl?: number; // Объем очага инфаркта (мл)
  isMalignantMCASuspected: boolean; // Поражение > 50% бассейна СМА, ASPECT ≤ 5 (п. 17.1)
  isMalignantCerebellarSuspected: boolean; // Поражение ≥ 1/3 полушария мозжечка, дислокация (п. 17.2)
  largeVesselOcclusionConfirmed: boolean; // Окклюзия крупной артерии (ВСА, СМА М1/М2, Основная артерия)
  occludedArterySegment?: 'ICA' | 'MCA_M1' | 'MCA_M2' | 'ACA' | 'Basilar' | 'VA_PCA' | 'none';
  perfusionMismatchConfirmed?: boolean; // Несоответствие КТП / МРТ-ДВИ (ядро < 70 мл, mismatch > 10-15 мл, коэфф. ≥ 1.2 / 1.8)

  // Comorbidities for OAC and Secondary Prevention (Appendix 14 & HAS-BLED & ABCD2)
  estimatedCrCl: number; // Клиренс креатинина мл/мин (ХБП)
  historyOfGIBleeding: boolean; // ЖКК в анамнезе
  dyspepsia: boolean; // Диспепсия (связанная с дабигатраном)
  weightKg: number; // Масса тела (кг)
  bmiValue?: number; // ИМТ (кг/м2)
  elevatedLiverEnzymesALT2x: boolean; // АЛТ > 2x ULN
  dysphagiaOrNasogastricTube: boolean; // Нарушение глотания / зонд (Приложение 6, 11)
  recurrentTIAonAntiplatelets: boolean; // Рецидивирующие ТИА на фоне приема АСК/клопидогрела (п. 43.2)
  multivascularDisease: boolean; // Мультифокальный атеросклероз (ИБС + периферические артерии)
}

export interface ScoreDetailItem {
  predictorName: string;
  valueDescription: string;
  pointsAdded: number;
  subtypesAffected: ToastSubtypeKey[];
  protocolReference?: string; // Ссылка на пункт протокола МЗ РБ
}

export interface SubtypeCalculationResult {
  key: ToastSubtypeKey;
  score: number;
  percentage: number;
  certainty: SubtypeCertainty;
  certaintyRu: string;
  details: ScoreDetailItem[];
}

export interface ESUSAssessment {
  isESUS: boolean;
  criteriaMet: {
    nonLacunar: boolean;
    noStenosisOver50: boolean;
    noHighRiskCardiacSource: boolean;
    noOtherEtiology: boolean;
  };
  recommendationRu: string;
  requiresBubbleTest: boolean; // ТКДГ с пузырьковой пробой для лиц < 55 лет
}

export interface ReperfusionAssessment {
  ivtEligible: boolean;
  ivtWindowType: 'standard_4_5h' | 'extended_4_5_to_9h' | 'ineligible';
  ivtRegimen: string; // Алтеплаза 0.9 мг/кг или тенектеплаза 0.25 мг/кг
  ivtContraindications: string[];
  ivtSpecialNotes: string[];

  evtEligible: boolean;
  evtWindowType: 'window_0_6h' | 'window_6_24h' | 'ineligible';
  evtRationale: string;
  evtContraindications: string[];
  targetVesselSegment?: string;
}

export interface AntithromboticPlan {
  // Strategy & Summary
  strategy: 'OAC' | 'antiplatelet';
  timingDay: string;
  timingRationale: string;
  primaryRegimen: string;
  dosingDetails: string;
  duration: string;
  safetyNotes: string;
  alternativeRegimen?: string;

  // Additional protocol details
  acuteFirst24h: string; // АСК 150-300 мг или ЗАПРЕТ после ТЛТ/ВСТЭ (п. 39)
  secondaryPreventionCategory: 'non_cardioembolic' | 'cardioembolic' | 'dissection' | 'rare';
  regimenSummaryRu: string;
  daptDetails?: {
    drugCombination: string;
    loadingDose: string;
    maintenanceDuration: string;
    monotherapyAfter: string;
    ppiRecommended: boolean; // Пантопразол (п. 26.11)
  };
  oacPlan?: {
    recommendedStartDay: string; // "Со 2-х суток", "С 3-х суток", "С 6-х суток", "С 10-х суток"
    ruleExplanation: string; // По таблице п. 43.1 (размер очага КТ + NIHSS)
    drugChoice: string; // Апиксабан / Ривароксабан / Дабигатран / Варфарин
    drugChoiceRationale: string; // На основании Приложения 14
    targetINR?: string;
    crclWarning?: string;
  };
}

export interface MalignantStrokeAlert {
  isHighRisk: boolean;
  type: 'MCA' | 'Cerebellar' | 'None';
  riskDescription: string;
  surgicalConsultIndicated: boolean; // Консилиум нейрохирурга в течение 48 часов
  surgicalProcedure: string; // Декомпрессивная гемикраниэктомия / Вентрикулостомия (п. 44-45)
}

export interface ABCD2Result {
  score: number;
  riskCategoryRu: 'Низкий' | 'Умеренный' | 'Высокий';
  strokeRisk2Days: string;
  strokeRisk7Days: string;
  strokeRisk90Days: string;
  daptIndicated: boolean; // ABCD2 >= 4 или >= 6
}

export interface HasBledResult {
  score: number;
  riskCategoryRu: 'Низкий (< 3)' | 'Высокий (≥ 3)';
  riskDescriptionRu: string;
  compassRegimenAllowed: boolean; // При атеротромбозе и низком риске (п. 43.2)
}

export interface CalculationResult {
  dominantSubtype: ToastSubtypeInfo;
  dominantCertainty: SubtypeCertainty;
  dominantCertaintyRu: string;
  confidenceLevelRu: string; // Синоним dominantCertaintyRu для UI/протокола
  confidenceDescriptionRu: string;
  toastSubtypes: SubtypeCalculationResult[];
  ocspResult: OCSPInfo;
  esusAssessment: ESUSAssessment;
  reperfusionAssessment: ReperfusionAssessment;
  reperfusion: {
    ivtEligible: boolean;
    ivtWindowStatus: string;
    ivtContraindications: string[];
    evtEligible: boolean;
    evtWindowStatus: string;
    evtRationale: string;
  };
  antithromboticPlan: AntithromboticPlan;
  malignantStrokeAlert: MalignantStrokeAlert;
  malignantAlert: {
    isSuspected: boolean;
    alertTitle: string;
    urgencyRationale: string;
    actionPlan: string;
  };
  abcd2Result?: ABCD2Result;
  abcd2Score: {
    score: number;
    riskCategory: string;
  };
  hasBledResult: HasBledResult;
  hasBledScore: {
    score: number;
    riskLevel: string;
  };
  contributingPredictors: ScoreDetailItem[];
  basicCareRecommendations: {
    bloodPressure: string;
    glucoseControl: string;
    lipidTarget: string;
    dvtProphylaxis: string;
    feverManagement: string;
    dysphagiaAndNutrition: string;
    furtherWorkup: string[];
    carotidSurgery?: string; // КЭЭ в первые 14 дней (п. 46)
  };
  recommendations: {
    antithrombotic: string;
    lipidTherapy: string;
    bpControl: string;
    furtherWorkup: string[];
    surgicalOrInterventional?: string;
  };
  protocolVersion: string; // "Клинический протокол МЗ РБ № 1 от 05.01.2026"
  calcDate: string;
}

export interface ClinicalCasePreset {
  id: string;
  title: string;
  shortDesc: string;
  patientData: PatientData;
}

export type ImagingModality = 'CT' | 'MRI' | 'CTP_CTA' | 'none';

export type ArteryOcclusionSegment =
  | 'ICA'
  | 'MCA_M1'
  | 'MCA_M2'
  | 'ACA'
  | 'Basilar'
  | 'VA_PCA'
  | 'none';

export interface NIHSSOption {
  value: number;
  labelRu: string;
}

export interface NIHSSDomainScore {
  id: string;
  titleRu: string;
  score: number;
  maxScore: number;
  descriptionRu: string;
  options: NIHSSOption[];
}

