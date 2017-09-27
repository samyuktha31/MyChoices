export class Case {
    constructor() { }

    CaseId?: any;
    CaseNumber: string;
    CenterId?: number;
    CaseStausId?: any;
    CounselorId?: number;

    PeaceMakerId?: number;
    ClientFirstName?: string;
    ClientLastName?: string;
    Mi?: string;
    FatherName?: string;
    GenderLookupId?: any;

    RequireAssistanceLookupId?: any;
    MaritalStatusLookupId?: any;
    Remarks?: string;

    RegisterDate?: Date;
    MobileNumber?: Date;

    CreatedBy?: number;
    CreatedDateTime?: Date;
    ModifiedBy?: number;
    ModifiedDatetime?: Date;
}

export class CaseHeader {
    constructor() { }

    CaseId: number;
    CaseNumber: string;
    ClientName: string;
    CaseStatusId: number;
    CaseStatus: string;
    RegisterDate: Date;
    RegisterDateString: string;
    CenterTitle: string;
    PeaceMaker: string;
    MobileNumber: string;
    Counselor: string;
}


export class CaseAddress {
    constructor() { }

    CaseAddressId?: number;
    CaseId?: number;
    Address?: string;
    Area?: string;
    CityId?: number;
    StateId?: number;
    PIN?: string;

    CreatedBy?: number;
    CreatedDateTime?: Date;
    ModifiedBy?: number;
    ModifiedDatetime?: Date;
}

export class vCaseAddress {
    constructor() { }

    CaseAddressId?: number;
    CaseId?: number;
    Address: string;
    Area: string;
    CityId?: number;
    StateId?: number;
    PIN: string;

    City: string;
    State: string;

    CreatedBy?: number;
    CreatedDateTime?: Date;
    ModifiedBy?: number;
    ModifiedDatetime?: Date;
}

export class CaseChildren {
    constructor() { }

    CaseChildrenId?: number;
    CaseId?: number;
    Name?: string;
    Age?: number;
    GenderLookupId?: number;
    RelationshipWithAbuserLookupId?: number;

    CreatedBy?: number;
    CreatedDateTime?: Date;
    ModifiedBy?: number;
    ModifiedDatetime?: Date;
}

export class vCaseChildren {
    constructor() { }

    CaseChildrenId?: number;
    CaseId?: number;
    Name?: string;
    Age?: number;
    GenderLookupId?: number;
    RelationshipWithAbuserLookupId?: number;

    Gender: string;
    Relation: string;

    CreatedBy?: number;
    CreatedDateTime?: Date;
    ModifiedBy?: number;
    ModifiedDatetime?: Date;
}

export class CaseFamilyHouseHold {
    constructor() { }

    CaseFamilyHouseHoldId?: number;
    CaseId?: number;

    ChildrenDeceasedLookupId: string;
    ChildrenDeceasedLookupArray: Array<Number>;

    HouseHoldIncomeLookupId?: number;
    SoughtHelpYesNoLookupId?: number;
    SoughtHelpDesc?: string;
    SoughtHelpOutPut?: string;

    PeacemakerAssistanceLookupId?: number;
    PeacemakerAssistanceLookupArray: Array<Number>;    

    PeacemakerAssistanceDesc?: string;
    PeacemakerFollowupYesNoLookupId?: number;
    ClientSignedRegistrationFormYesNoLookupId?: number;
    ClientEmailId?: string;
    ReligionLookupId?: number;
    LevelOfEducationLookupId?: number;
    VocationalSkillsLookupId?: number;
    VocationalSkillsDesc: string;

    OccupationLookupId?: number;
    OccupationDesc?: string;
    ClientIncomeLookupId?: number;

    HouseHoldMembersLivingLookupId?: number;
    HouseHoldMembersLivingLookupArray: Array<Number>;    

    YearsOfMarriage?: number;
    ClientAgeAtFirstChild?: number;
}

export class CaseSpouse {
    constructor() { }

    CaseSpouseId?: number;
    CaseId?: number;
    SpouseName?: string;
    SpouseDOB?: Date;
    SpouseHomePhone?: string;
    SpouseMobilePhone?: string;
    SpouseOccupation?: string;
    SpouseEducationLookupId?: number;
    SpouseAddress?: string;
    Area?: string;
    CityLookupId?: number;
    StateLookupId?: number;
    PIN?: string;

    PrimaryEmergencyContactName?: string;
    PrimaryEmergencyRelationshipToClientLookupId?: number;
    PrimaryEmergencyContactPhoneNumber?: string;
    PrimaryEmergencyContactAdress?: string;

    SecondaryEmergencyContactName?: string;
    SecondaryEmergencyRelationshipToClientLookupId?: number;
    SecondaryEmergencyContactPhoneNumber?: string;
    SecondaryEmergencyContactAdress?: string;
}

export class CasePhysicalHealth {
    constructor() { }

    CasePhysicalHealthId?: number;
    CaseId?: number;
    SufferingFromAnyMajorIllnessLookupId?: number;
    SufferingFromAnyMajorIllnessDesc?: string;

    DiagnosedPsychiatricIllnessLookupId?: number;
    DiagnosedPsychiatricIllnessDesc?: string;

    SleepPerNightLookupId?: number;
    AppetiteLookupId?: number;
    ExerciseLookupId?: number;

    AnyMedicationLookupId?: number;
    AnyMedicationDesc?: string;

    AnySubstanceLookupId?: number;
    AnySubstanceDesc?: string;

    CurrentlyPregnantLookup?: number;
    CurrentlyPregnantDesc?: string;

    ReasonForSeekingHelpLookupId: string;
    ReasonForSeekingHelpLookupArray: Array<number>;

    WhoIsAbusingYouLookupId: string;
    WhoIsAbusingYouLookupArray: Array<number>;

    WhoIsAbusingYouDesc?: string;
    ReasonForSeekingHelpDesc?: string;
}

export class CaseOffender {
    constructor() { }

    CaseOffenderId?: number;
    CaseId?: number;
    Name?: string;
    Age?: number;
    GenderLookupId?: number;
    RelationshipWithVictimLookupId?: number;
    OtherRelationship : string;
}

export class vCaseOffender {
    constructor() { }

    CaseOffenderId?: number;
    CaseId?: number;
    Name?: string;
    Age?: number;
    GenderLookupId?: number;
    RelationshipWithVictimLookupId?: number;
    OtherRelationship : string;

    Gender: string;
    RelationshipWithVictim: string;
}

export class CaseAbuse {
    constructor() { }

    CaseAbuseId?: number;
    CaseId?: number;

    SufferingFromAbuseLookupId?: number;
    SufferingFromAbuseDesc?: string;

    FeelAboutAbuseLookupId: string;
    FeelAboutAbuseLookupArray: Array<number>;
    ParentsFeelAboutAbuseLookupId: string;
    ParentsFeelAboutAbuseLookupArray: Array<number>;

    LawFeelAboutAbuseLookupId: string;
    LawFeelAboutAbuseLookupArray: Array<number>;

    SignsOfPhysicalAbuseLookupId?: number;
    SignsOfPhysicalAbuseDesc?: string;

    WeaponsUsedLookupId: string;
    WeaponsUsedLookupArray: Array<number>;

    WeaponsUsedDesc?: string;

    TypesOfPhyscialAbuseLookupId: string;
    TypesOfPhyscialAbuseLookupArray: Array<number>;
    FrequencyOfPhyscialAbuseLookupId?: number;
    NumberOfYearsOfPhyscialAbuse?: number;

    TypesOfEmotionalAbuseLookupId: string;
    TypesOfEmotionalAbuseLookupArray: Array<number>;
    FrequencyOfEmotionalAbuseLookupId?: number;
    NumberOfYearsOfEmotionalAbuse?: number;

    TypesOfSexualAbuseLookupId: string;
    TypesOfSexualAbuseLookupArray: Array<number>;
    FrequencyOfSexualAbuseLookupId?: number;
    NumberOfYearsOfSexualAbuse?: number;

    TypesOfEconomicAbuseLookupId: string;
    TypesOfEconomicAbuseLookupArray: Array<number>;
    FrequencyOfEconomicAbuseLookupId?: number;
    NumberOfYearsOfEconomicAbuse?: number;

    ReasonsForAbuseLookupId: string;
    ReasonsForAbuseLookupArray: Array<number>;
    ReasonForAbuseDesc?: string;

    PhysicalAbuseDesc: string;
    EmotionalAbuseDesc: string;
    SexualAbuseDesc: string;
    EconomicAbuseDesc: string;
}

export class CaseManage {
    constructor() { }

    CaseManageId?: number;
    CaseId?: number;
    //CaseStatusId?: number;
    ReferredToWhom: string;

    SourceOfCaseLookupId?: number;
    SourceOfCaseDesc?: string;

    TypesOfCounselingLookupId?: number;
    TypesOfCounselingLookupArray: Array<Number>;    

    TotalNoOfSessionsLookupId?: number;
    TotalHoursSpentLookupId?: number;


    ReasonForClosureStatus?: string;
    CaseSubject?: string;
    CaseDescription?: string;

    RelationshipWithPMLookupId?: number;
    ResolutionLog: string;
}

export class CaseMental {
    constructor() { }

    CaseMentalId?: number;
    CaseId?: number;

    MentalDressLookupId?: string;
    MentalHygieneLookupId?: string;
    MentalBodyTypeLookupId?: string;
    MentalExpressionLookupId?: string;
    MentalMotorActivityLookupId?: string;
    MentalVocabularyLookupId?: string;
    MentalImpulseControlLookupId?: string;
    MentalSpeechLookupId?: string;
    MentalBehaviourLookupId?: string;
    MentalContentLookupId?: string;
    MentalFlowOfThoughtLookupId?: string;
    MentalOrientationLookupId?: string;
    MentalEstimatedIntellectLookupId?: string;
    MentalAttentionLookupId?: string;
    MentalInsightLookupId?: string;
    MentalJudgementLookupId?: string;
    MentalMemoryLookupId?: string;
    MentalInformationLookupId?: string;
    MentalAbstractionLookupId?: string;

    MentalDressLookupArray: Array<number>;
    MentalHygieneLookupArray: Array<number>;
    MentalBodyTypeLookupArray: Array<number>;
    MentalExpressionLookupArray: Array<number>;
    MentalMotorActivityLookupArray: Array<number>;
    MentalVocabularyLookupArray: Array<number>;
    MentalImpulseControlLookupArray: Array<number>;
    MentalSpeechLookupArray: Array<number>;
    MentalBehaviourLookupArray: Array<number>;
    MentalContentLookupArray: Array<number>;
    MentalFlowOfThoughtLookupArray: Array<number>;
    MentalOrientationLookupArray: Array<number>;
    MentalEstimatedIntellectLookupArray: Array<number>;
    MentalAttentionLookupArray: Array<number>;
    MentalInsightLookupArray: Array<number>;
    MentalJudgementLookupArray: Array<number>;
    MentalMemoryLookupArray: Array<number>;
    MentalInformationLookupArray: Array<number>;
    MentalAbstractionLookupArray: Array<number>;
}

export class vCaseMental {
    constructor() { }

    CaseMentalId?: number;
    CaseId?: number;

    MentalDressLookupId?: string;
    MentalHygieneLookupId?: string;
    MentalBodyTypeLookupId?: string;
    MentalExpressionLookupId?: string;
    MentalMotorActivityLookupId?: string;
    MentalVocabularyLookupId?: string;
    MentalImpulseControlLookupId?: string;
    MentalSpeechLookupId?: string;
    MentalBehaviourLookupId?: string;
    MentalContentLookupId?: string;
    MentalFlowOfThoughtLookupId?: string;
    MentalOrientationLookupId?: string;
    MentalEstimatedIntellectLookupId?: string;
    MentalAttentionLookupId?: string;
    MentalInsightLookupId?: string;
    MentalJudgementLookupId?: string;
    MentalMemoryLookupId?: string;
    MentalInformationLookupId?: string;
    MentalAbstractionLookupId?: string;

    MentalDress: string;
    MentalHygiene: string;
    MentalBodyType: string;
    MentalExpression: string;
    MentalMotorActivity: string;
    MentalVocabulary: string;
    MentalImpulseControl: string;
    MentalSpeech: string;
    MentalBehaviour: string;
    MentalContent: string;
    MentalFlowOfThought: string;
    MentalOrientation: string;
    MentalEstimatedIntellect: string;
    MentalAttention: string;
    MentalInsight: string;
    MentalJudgement: string;
    MentalMemory: string;
    MentalInformation: string;
    MentalAbstraction: string;

    MentalDressLookupArray: Array<number>;
    MentalHygieneLookupArray: Array<number>;
    MentalBodyTypeLookupArray: Array<number>;
    MentalExpressionLookupArray: Array<number>;
    MentalMotorActivityLookupArray: Array<number>;
    MentalVocabularyLookupArray: Array<number>;
    MentalImpulseControlLookupArray: Array<number>;
    MentalSpeechLookupArray: Array<number>;
    MentalBehaviourLookupArray: Array<number>;
    MentalContentLookupArray: Array<number>;
    MentalFlowOfThoughtLookupArray: Array<number>;
    MentalOrientationLookupArray: Array<number>;
    MentalEstimatedIntellectLookupArray: Array<number>;
    MentalAttentionLookupArray: Array<number>;
    MentalInsightLookupArray: Array<number>;
    MentalJudgementLookupArray: Array<number>;
    MentalMemoryLookupArray: Array<number>;
    MentalInformationLookupArray: Array<number>;
    MentalAbstractionLookupArray: Array<number>;
}

export class CaseSessionLog {
    constructor() { }

    CaseSessionLogId?: number;
    CaseId?: number;    

    CounselingDate?: Date;
    TypeOfCounselingLookupId?: number;
    TypeOfCounselingDesc?: string;

    DurationOfSessionMIn?: number;
    NextSessionScheduled?: Date;
    SessionNotes?: string;    
}
export class vCaseSessionLog {
    constructor() { }

    CaseSessionLogId?: number;
    CaseId?: number;

    CounselingDate?: Date;
    TypeOfCounselingLookupId?: number;
    TypeOfCounselingDesc?: string;

    DurationOfSessionMIn?: number;
    NextSessionScheduled?: Date;
    SessionNotes?: string;
}

export class CaseFeedback {
    constructor() { }

    CaseFeedbackId?: number;
    CaseId?: number;

    RespectedDuringYourVisitLookupId?: number;
    FeelSafeAndSecureLookupId?: number;

    FeelThatCounsellingLookupId?: number;
    AssistanceOfPeacemakerLookupId?: number;

    RecommendFreeCounsellingLookupId?: number;
    AbleToImproveLookupId?: number;

    OPMTeamToFollowupLookupId?: number;
    AnySuggestions?: string;
}

export class vCaseFeedback {
    constructor() { }

    CaseFeedbackId?: number;
    CaseId?: number;

    RespectedDuringYourVisitLookupId?: number;
    FeelSafeAndSecureLookupId?: number;

    FeelThatCounsellingLookupId?: number;
    AssistanceOfPeacemakerLookupId?: number;

    RecommendFreeCounsellingLookupId?: number;
    AbleToImproveLookupId?: number;

    OPMTeamToFollowupLookupId?: number;
    AnySuggestions?: string;

    RespectedDuringYourVisit?: string;
    FeelSafeAndSecure?: string;

    FeelThatCounselling?: string;
    AssistanceOfPeacemaker?: string;

    RecommendFreeCounselling?: string;
    AbleToImprove?: string;

    OPMTeamToFollowup?: string;
}

export class CaseLegal {
    constructor() { }

    CaseLegalId?: number;
    CaseId?: number;

    CaseNumber?: string;
    Court?: string;

    Prayer?: string;
    LegalRepresentative?: string;

    LegalConsentFormLookupId?: number;
    LegalActionLookupId?: number;

    OutcomeLookupId: string;
    OutcomeLookupArray: Array<number>;

    DocumentsLookupId?: number;    
    DocumentsLookupArray: Array<number>;
}

export class CaseBook {
    constructor() { }

    Case: Case;
    CaseHeader: CaseHeader;

    vAddresses: Array<vCaseAddress>;
    vChildren: Array<vCaseChildren>;
    vOffender: Array<vCaseOffender>;
    vMental: Array<vCaseMental>;
    vSessionLog: Array<vCaseSessionLog>;
    FeedBack: Array<vCaseFeedback>;

    SelectedAddress: CaseAddress;
    SelectedChildren: CaseChildren;
    SelectedOffender: CaseOffender;
    SelectedMental: CaseMental;
    SelectedSessionLog: CaseSessionLog;
    SelectedFeedback: CaseFeedback;

    FamilyHouseHold: CaseFamilyHouseHold;
    Spouse: CaseSpouse;
    PhysicalHealth: CasePhysicalHealth;
    Abuse: CaseAbuse;
    Manage: CaseManage;
    Legal: CaseLegal;
}
