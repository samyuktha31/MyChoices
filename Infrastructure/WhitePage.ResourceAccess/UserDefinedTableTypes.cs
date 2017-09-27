using System.Data;

namespace WhitePage.ResourceAccess
{
    public static class UserDefinedTableTypes
    {
        public static DataTable Case
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseId", DbColumnType.Int)
                    .AddColumn("CaseNumber", DbColumnType.String)
                    .AddColumn("CenterId", DbColumnType.Short)
                    .AddColumn("CaseStausId", DbColumnType.Byte)
                    .AddColumn("CounselorId", DbColumnType.Int)
                    .AddColumn("PeaceMakerId", DbColumnType.Int)
                    .AddColumn("ClientFirstName", DbColumnType.String)
                    .AddColumn("ClientLastName", DbColumnType.String)
                    .AddColumn("Mi", DbColumnType.String)
                    .AddColumn("FatherName", DbColumnType.String)
                    .AddColumn("GenderLookupId", DbColumnType.Int)
                    .AddColumn("RequireAssistanceLookupId", DbColumnType.Int)
                    .AddColumn("MaritalStatusLookupId", DbColumnType.Int)
                    .AddColumn("Remarks", DbColumnType.String)
                    .AddColumn("RegisterDate", DbColumnType.DateTime)
                    .AddColumn("MobileNumber", DbColumnType.String)
                    .AddColumn("CreatedBy", DbColumnType.Int)
                    .AddColumn("CreatedDateTime", DbColumnType.DateTime)
                    .AddColumn("ModifiedBy", DbColumnType.Int)
                    .AddColumn("ModifiedDatetime", DbColumnType.DateTime);

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable CaseAddress
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseAddressId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)
                    .AddColumn("Address", DbColumnType.String)
                    .AddColumn("Area", DbColumnType.String)
                    .AddColumn("CityId", DbColumnType.Short)
                    .AddColumn("StateId", DbColumnType.Short)
                    .AddColumn("PIN", DbColumnType.String)
                    .AddColumn("CreatedBy", DbColumnType.Int)
                    .AddColumn("CreatedDateTime", DbColumnType.DateTime)
                    .AddColumn("ModifiedBy", DbColumnType.Int)
                    .AddColumn("ModifiedDatetime", DbColumnType.DateTime)
                    ;

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable CaseChildren
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseChildrenId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)
                    .AddColumn("Name", DbColumnType.String)
                    .AddColumn("Age", DbColumnType.Decimal)
                    .AddColumn("GenderLookupId", DbColumnType.Int)
                    .AddColumn("RelationshipWithAbuserLookupId", DbColumnType.Int)

                    .AddColumn("CreatedBy", DbColumnType.Int)
                    .AddColumn("CreatedDateTime", DbColumnType.DateTime)
                    .AddColumn("ModifiedBy", DbColumnType.Int)
                    .AddColumn("ModifiedDatetime", DbColumnType.DateTime)
                    ;

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable HouseHold
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseFamilyHouseHoldId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)
                    .AddColumn("ChildrenDeceasedLookupId", DbColumnType.String)
                    .AddColumn("HouseHoldIncomeLookupId", DbColumnType.Int)
                    .AddColumn("SoughtHelpYesNoLookupId", DbColumnType.Int)
                    .AddColumn("SoughtHelpDesc", DbColumnType.String)

                    .AddColumn("SoughtHelpOutPut", DbColumnType.String)
                    .AddColumn("PeacemakerAssistanceLookupId", DbColumnType.String)
                    .AddColumn("PeacemakerAssistanceDesc", DbColumnType.String)
                    .AddColumn("PeacemakerFollowupYesNoLookupId", DbColumnType.Int)

                    .AddColumn("ClientSignedRegistrationFormYesNoLookupId", DbColumnType.Int)
                    .AddColumn("ClientEmailId", DbColumnType.String)
                    .AddColumn("ReligionLookupId", DbColumnType.Int)
                    .AddColumn("LevelOfEducationLookupId", DbColumnType.Int)
                    .AddColumn("VocationalSkillsLookupId", DbColumnType.Int)
                    .AddColumn("VocationalSkillsDesc", DbColumnType.String)
                    
                    .AddColumn("OccupationLookupId", DbColumnType.Int)
                    .AddColumn("OccupationDesc", DbColumnType.String)
                    .AddColumn("ClientIncomeLookupId", DbColumnType.Int)

                    .AddColumn("HouseHoldMembersLivingLookupId", DbColumnType.String)
                    .AddColumn("YearsOfMarriage", DbColumnType.Short)
                    .AddColumn("ClientAgeAtFirstChild", DbColumnType.Byte);

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable Spouse
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseSpouseId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)

                    .AddColumn("SpouseName", DbColumnType.String)
                    .AddColumn("SpouseDOB", DbColumnType.DateTime)
                    .AddColumn("SpouseHomePhone", DbColumnType.String)
                    .AddColumn("SpouseMobilePhone", DbColumnType.String)

                    .AddColumn("SpouseOccupation", DbColumnType.String)
                    .AddColumn("SpouseEducationLookupId", DbColumnType.Int)

                    .AddColumn("SpouseAddress", DbColumnType.String)
                    .AddColumn("Area", DbColumnType.String)
                    .AddColumn("CityLookupId", DbColumnType.Int)
                    .AddColumn("StateLookupId", DbColumnType.Int)
                    .AddColumn("PIN", DbColumnType.String)

                    .AddColumn("PrimaryEmergencyContactName", DbColumnType.String)
                    .AddColumn("PrimaryEmergencyRelationshipToClientLookupId", DbColumnType.Int)
                    .AddColumn("PrimaryEmergencyContactPhoneNumber", DbColumnType.String)
                    .AddColumn("PrimaryEmergencyContactAdress", DbColumnType.String)

                    .AddColumn("SecondaryEmergencyContactName", DbColumnType.String)
                    .AddColumn("SecondaryEmergencyRelationshipToClientLookupId", DbColumnType.Int)
                    .AddColumn("SecondaryEmergencyContactPhoneNumber", DbColumnType.String)
                    .AddColumn("SecondaryEmergencyContactAdress", DbColumnType.String);

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable PhysicalHealth
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CasePhysicalHealthId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)
                    .AddColumn("SufferingFromAnyMajorIllnessLookupId", DbColumnType.Int)
                    .AddColumn("SufferingFromAnyMajorIllnessDesc", DbColumnType.String)

                    .AddColumn("DiagnosedPsychiatricIllnessLookupId", DbColumnType.Int)
                    .AddColumn("DiagnosedPsychiatricIllnessDesc", DbColumnType.String)

                    .AddColumn("SleepPerNightLookupId", DbColumnType.Int)
                    .AddColumn("AppetiteLookupId", DbColumnType.Int)
                    .AddColumn("ExerciseLookupId", DbColumnType.Int)


                    .AddColumn("AnyMedicationLookupId", DbColumnType.Int)
                    .AddColumn("AnyMedicationDesc", DbColumnType.String)

                    .AddColumn("AnySubstanceLookupId", DbColumnType.Int)
                    .AddColumn("AnySubstanceDesc", DbColumnType.String)

                    .AddColumn("CurrentlyPregnantLookup", DbColumnType.Int)
                    .AddColumn("CurrentlyPregnantDesc", DbColumnType.String)

                    .AddColumn("ReasonForSeekingHelpLookupId", DbColumnType.String)
                    .AddColumn("WhoIsAbusingYouLookupId", DbColumnType.String)
                    .AddColumn("WhoIsAbusingYouDesc", DbColumnType.String)
                    .AddColumn("ReasonForSeekingHelpDesc", DbColumnType.String);

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable Offender
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseOffenderId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)
                    .AddColumn("Name", DbColumnType.String)
                    .AddColumn("Age", DbColumnType.Decimal)

                    .AddColumn("GenderLookupId", DbColumnType.Int)
                    .AddColumn("RelationshipWithVictimLookupId", DbColumnType.Int)
                    .AddColumn("OtherRelationship", DbColumnType.String);

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable Abuse
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseAbuseId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)

                    .AddColumn("SufferingFromAbuseLookupId", DbColumnType.Int)
                    .AddColumn("SufferingFromAbuseDesc", DbColumnType.String)

                    .AddColumn("FeelAboutAbuseLookupId", DbColumnType.String)
                    .AddColumn("ParentsFeelAboutAbuseLookupId", DbColumnType.String)
                    .AddColumn("LawFeelAboutAbuseLookupId", DbColumnType.String)

                    .AddColumn("SignsOfPhysicalAbuseLookupId", DbColumnType.Int)
                    .AddColumn("SignsOfPhysicalAbuseDesc", DbColumnType.String)

                    .AddColumn("WeaponsUsedLookupId", DbColumnType.String)
                    .AddColumn("WeaponsUsedDesc", DbColumnType.String)

                    .AddColumn("TypesOfPhyscialAbuseLookupId", DbColumnType.String)
                    .AddColumn("FrequencyOfPhyscialAbuseLookupId", DbColumnType.Int)
                    .AddColumn("NumberOfYearsOfPhyscialAbuse", DbColumnType.Byte)

                    .AddColumn("TypesOfEmotionalAbuseLookupId", DbColumnType.String)
                    .AddColumn("FrequencyOfEmotionalAbuseLookupId", DbColumnType.Int)
                    .AddColumn("NumberOfYearsOfEmotionalAbuse", DbColumnType.Byte)

                    .AddColumn("TypesOfSexualAbuseLookupId", DbColumnType.String)
                    .AddColumn("FrequencyOfSexualAbuseLookupId", DbColumnType.Int)
                    .AddColumn("NumberOfYearsOfSexualAbuse", DbColumnType.Byte)

                    .AddColumn("TypesOfEconomicAbuseLookupId", DbColumnType.String)
                    .AddColumn("FrequencyOfEconomicAbuseLookupId", DbColumnType.Int)
                    .AddColumn("NumberOfYearsOfEconomicAbuse", DbColumnType.Byte)

                    .AddColumn("ReasonsForAbuseLookupId", DbColumnType.String)
                    .AddColumn("ReasonForAbuseDesc", DbColumnType.String)

                    .AddColumn("PhysicalAbuseDesc", DbColumnType.String)
                    .AddColumn("EmotionalAbuseDesc", DbColumnType.String)
                    .AddColumn("SexualAbuseDesc", DbColumnType.String)
                    .AddColumn("EconomicAbuseDesc", DbColumnType.String)
                    ;

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable Manage
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseManageId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)
                    .AddColumn("ReferredToWhom", DbColumnType.String)

                    .AddColumn("SourceOfCaseLookupId", DbColumnType.Int)
                    .AddColumn("SourceOfCaseDesc", DbColumnType.String)

                    .AddColumn("TypesOfCounselingLookupId", DbColumnType.String)
                    .AddColumn("TotalNoOfSessionsLookupId", DbColumnType.Int)
                    .AddColumn("TotalHoursSpentLookupId", DbColumnType.Int)

                    .AddColumn("ReasonForClosureStatus", DbColumnType.String)
                    .AddColumn("CaseSubject", DbColumnType.String)
                    .AddColumn("CaseDescription", DbColumnType.String)
                    .AddColumn("RelationshipWithPMLookupId", DbColumnType.Int)

                    .AddColumn("ResolutionLog", DbColumnType.String);

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable Mental
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseMentalId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)

                    .AddColumn("MentalDressLookupId", DbColumnType.String)
                    .AddColumn("MentalHygieneLookupId", DbColumnType.String)
                    .AddColumn("MentalBodyTypeLookupId", DbColumnType.String)
                    .AddColumn("MentalExpressionLookupId", DbColumnType.String)
                    .AddColumn("MentalMotorActivityLookupId", DbColumnType.String)
                    .AddColumn("MentalVocabularyLookupId", DbColumnType.String)
                    .AddColumn("MentalImpulseControlLookupId", DbColumnType.String)
                    .AddColumn("MentalSpeechLookupId", DbColumnType.String)
                    .AddColumn("MentalBehaviourLookupId", DbColumnType.String)
                    .AddColumn("MentalContentLookupId", DbColumnType.String)
                    .AddColumn("MentalFlowOfThoughtLookupId", DbColumnType.String)
                    .AddColumn("MentalOrientationLookupId", DbColumnType.String)
                    .AddColumn("MentalEstimatedIntellectLookupId", DbColumnType.String)
                    .AddColumn("MentalAttentionLookupId", DbColumnType.String)
                    .AddColumn("MentalInsightLookupId", DbColumnType.String)
                    .AddColumn("MentalJudgementLookupId", DbColumnType.String)
                    .AddColumn("MentalMemoryLookupId", DbColumnType.String)
                    .AddColumn("MentalInformationLookupId", DbColumnType.String)
                    .AddColumn("MentalAbstractionLookupId", DbColumnType.String);

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable SessionLog
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseSessionLogId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)

                    .AddColumn("CounselingDate", DbColumnType.DateTime)
                    .AddColumn("TypeOfCounselingLookupId", DbColumnType.Int)
                    .AddColumn("TypeOfCounselingDesc", DbColumnType.String)

                    .AddColumn("DurationOfSessionMIn", DbColumnType.Short)
                    .AddColumn("NextSessionScheduled", DbColumnType.DateTime)
                    .AddColumn("SessionNotes", DbColumnType.String);

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable Feedback
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseFeedbackId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)

                    .AddColumn("RespectedDuringYourVisitLookupId", DbColumnType.Int)
                    .AddColumn("FeelSafeAndSecureLookupId", DbColumnType.Int)

                    .AddColumn("FeelThatCounsellingLookupId", DbColumnType.Int)
                    .AddColumn("AssistanceOfPeacemakerLookupId", DbColumnType.Int)

                    .AddColumn("RecommendFreeCounsellingLookupId", DbColumnType.Int)
                    .AddColumn("AbleToImproveLookupId", DbColumnType.Int)

                    .AddColumn("OPMTeamToFollowupLookupId", DbColumnType.Int)                    

                    .AddColumn("AnySuggestions", DbColumnType.String);

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }

        public static DataTable Legal
        {
            get
            {
                var result = new DataTable();
                var columnCollection = new DataColumnCollection();

                columnCollection
                    .AddColumn("CaseLegalId", DbColumnType.Int)
                    .AddColumn("CaseId", DbColumnType.Int)

                    .AddColumn("CaseNumber", DbColumnType.String)
                    .AddColumn("Court", DbColumnType.String)

                    .AddColumn("Prayer", DbColumnType.String)
                    .AddColumn("LegalRepresentative", DbColumnType.String)

                    .AddColumn("LegalConsentFormLookupId", DbColumnType.Int)
                    .AddColumn("LegalActionLookupId", DbColumnType.Int)

                    .AddColumn("OutcomeLookupId", DbColumnType.String)
                    .AddColumn("DocumentsLookupId", DbColumnType.String);

                foreach (var item in columnCollection) result.Columns.Add(item);

                return result;
            }
        }
    }
}
