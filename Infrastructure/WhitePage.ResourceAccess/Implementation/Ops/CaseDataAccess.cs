using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using WhitePage.Entities.CaseManagement;
using WhitePage.ResourceAccess.Contracts.Ops;
using WhitePage.Utilities.Extensions;

namespace WhitePage.ResourceAccess.Implementation.Ops
{
    public class CaseDataAccess : DataAccess, ICaseDataAccess
    {
        public CaseDataAccess(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {

        }
        
        public IQueryable<CaseHeader> GetAllActiveCases()
        {
            return this.unitOfWork.DbContext.CaseHeaders.Where(ch => ch.CaseStatusId!=(int)ECaseStatus.DeleteStatus).OrderByDescending(ch => ch.RegisterDate);
        }        
        
        public CaseHeader SavePrimaryCase(CaseBook caseBook)
        {
            var parmsCollection = new ParmsCollection();
            var caseTable = UserDefinedTableTypes.Case;
            caseTable.Rows.Add(new object[]{
                caseBook.Case.CaseId,
                caseBook.Case.CaseNumber,
                caseBook.Case.CenterId,
                caseBook.Case.CaseStausId,
                caseBook.Case.CounselorId,
                caseBook.Case.PeaceMakerId,
                caseBook.Case.ClientFirstName,
                caseBook.Case.ClientLastName,
                caseBook.Case.Mi,
                caseBook.Case.FatherName,
                caseBook.Case.GenderLookupId,

                caseBook.Case.RequireAssistanceLookupId,
                caseBook.Case.MaritalStatusLookupId,
                caseBook.Case.Remarks,
                caseBook.Case.RegisterDate,
                caseBook.Case.MobileNumber,

                caseBook.Case.CreatedBy,
                caseBook.Case.CreatedDateTime,
                caseBook.Case.ModifiedBy,
                caseBook.Case.ModifiedDatetime,
                });
            caseTable.AcceptChanges();

            var caseAddressTable = UserDefinedTableTypes.CaseAddress;
            caseAddressTable.Rows.Add(new object[]{
                caseBook.SelectedAddress.CaseAddressId,
                caseBook.SelectedAddress.CaseId,
                caseBook.SelectedAddress.Address,
                caseBook.SelectedAddress.Area,
                caseBook.SelectedAddress.CityId,
                caseBook.SelectedAddress.StateId,
                caseBook.SelectedAddress.PIN,
                caseBook.SelectedAddress.CreatedBy,
                caseBook.SelectedAddress.CreatedDateTime,
                caseBook.SelectedAddress.ModifiedBy,
                caseBook.SelectedAddress.ModifiedDatetime,
                });
            caseAddressTable.AcceptChanges();

            var updatedCase = this.unitOfWork.DbContext.ExecuteStoredProcedure<CaseHeader>("[Ops].[savePrimaryCase]",
                parmsCollection
                    .AddParm("@caseType", SqlDbType.Structured, caseTable, "[Ops].[CaseType]")
                    .AddParm("@caseAddressType", SqlDbType.Structured, caseAddressTable, "[Ops].[CaseAddressType]")
                ).First();

            return updatedCase;
        }

        public CaseBook GetCaseById(int caseId)
        {
            var result = new CaseBook();

            result.Case = this.unitOfWork.DbContext.Cases.Single(c => c.CaseId == caseId);
            result.CaseHeader = this.unitOfWork.DbContext.CaseHeaders.First(c => c.CaseId == caseId);

            result.vAddresses = this.unitOfWork.DbContext.vAddresses.Where(c => c.CaseId == caseId).ToList();
            result.vChildren = this.unitOfWork.DbContext.vChildren.Where(c => c.CaseId == caseId).ToList();
            result.vOffender = this.unitOfWork.DbContext.vOffenders.Where(c => c.CaseId == caseId).ToList();
            result.vMental = this.unitOfWork.DbContext.vMental.Where(c => c.CaseId == caseId).ToList();
            result.SessionLog = this.unitOfWork.DbContext.SessionLogs.Where(c => c.CaseId == caseId).ToList();
            result.vSessionLog = this.unitOfWork.DbContext.vSessionLog.Where(c => c.CaseId == caseId).ToList();
            result.FeedBack = this.unitOfWork.DbContext.vFeedback.Where(c => c.CaseId == caseId).ToList();

            result.FamilyHouseHold = this.unitOfWork.DbContext.FamilyHouseHold.Where(c => c.CaseId == caseId).FirstOrDefault();
            if (result.FamilyHouseHold != null)
            {
                result.FamilyHouseHold.ChildrenDeceasedLookupArray = result.FamilyHouseHold.ChildrenDeceasedLookupId.ToIntArray();
                result.FamilyHouseHold.PeacemakerAssistanceLookupArray = result.FamilyHouseHold.PeacemakerAssistanceLookupId.ToIntArray();
                result.FamilyHouseHold.HouseHoldMembersLivingLookupArray = result.FamilyHouseHold.HouseHoldMembersLivingLookupId.ToIntArray();
            }

            result.Spouse = this.unitOfWork.DbContext.Spouse.Where(c => c.CaseId == caseId).FirstOrDefault();
            result.PhysicalHealth = this.unitOfWork.DbContext.PhysicalHealth.Where(c => c.CaseId == caseId).FirstOrDefault();
            if (result.PhysicalHealth != null)
            {
                result.PhysicalHealth.ReasonForSeekingHelpLookupArray = result.PhysicalHealth.ReasonForSeekingHelpLookupId.ToIntArray();
                result.PhysicalHealth.WhoIsAbusingYouLookupArray = result.PhysicalHealth.WhoIsAbusingYouLookupId.ToIntArray();
            }

            result.Abuse = this.unitOfWork.DbContext.Abuse.Where(c => c.CaseId == caseId).FirstOrDefault();
            if (result.Abuse != null)
            {
                result.Abuse.FeelAboutAbuseLookupArray = result.Abuse.FeelAboutAbuseLookupId.ToIntArray();
                result.Abuse.ParentsFeelAboutAbuseLookupArray = result.Abuse.ParentsFeelAboutAbuseLookupId.ToIntArray();
                result.Abuse.LawFeelAboutAbuseLookupArray = result.Abuse.LawFeelAboutAbuseLookupId.ToIntArray();

                result.Abuse.WeaponsUsedLookupArray = result.Abuse.WeaponsUsedLookupId.ToIntArray();
                result.Abuse.TypesOfPhyscialAbuseLookupArray = result.Abuse.TypesOfPhyscialAbuseLookupId.ToIntArray();
                result.Abuse.TypesOfEmotionalAbuseLookupArray = result.Abuse.TypesOfEmotionalAbuseLookupId.ToIntArray();
                result.Abuse.TypesOfSexualAbuseLookupArray = result.Abuse.TypesOfSexualAbuseLookupId.ToIntArray();
                result.Abuse.TypesOfEconomicAbuseLookupArray = result.Abuse.TypesOfEconomicAbuseLookupId.ToIntArray();
                result.Abuse.ReasonsForAbuseLookupArray = result.Abuse.ReasonsForAbuseLookupId.ToIntArray();
            }

            result.Manage = this.unitOfWork.DbContext.Manage.Where(c => c.CaseId == caseId).FirstOrDefault();
            if (result.Manage != null)
            {
                result.Manage.TypesOfCounselingLookupArray = result.Manage.TypesOfCounselingLookupId.ToIntArray();
            }

            result.Legal = this.unitOfWork.DbContext.Legal.Where(c => c.CaseId == caseId).FirstOrDefault();
            if (result.Legal != null)
            {
                result.Legal.OutcomeLookupArray = result.Legal.OutcomeLookupId.ToIntArray();
                result.Legal.DocumentsLookupArray = result.Legal.DocumentsLookupId.ToIntArray();
            }

            if (result.FamilyHouseHold == null) result.FamilyHouseHold = new CaseFamilyHouseHold();
            if (result.Spouse == null) result.Spouse = new CaseSpouse();
            if (result.PhysicalHealth == null) result.PhysicalHealth = new CasePhysicalHealth();
            if (result.Abuse == null) result.Abuse = new CaseAbuse();
            //if (result.Manage == null) result.Manage = new CaseManage() { CaseStatusId = result.Case.CaseStausId };
            if (result.Legal == null) result.Legal = new CaseLegal();

            result.SelectedMental = this.unitOfWork.DbContext.Mental.Where(c => c.CaseId == caseId).FirstOrDefault();

            if (result.SelectedMental != null)
            {
                result.SelectedMental.MentalAbstractionLookupArray = result.SelectedMental.MentalAbstractionLookupId.ToIntArray();
                result.SelectedMental.MentalAttentionLookupArray = result.SelectedMental.MentalAttentionLookupId.ToIntArray();
                result.SelectedMental.MentalBehaviourLookupArray = result.SelectedMental.MentalBehaviourLookupId.ToIntArray();
                result.SelectedMental.MentalBodyTypeLookupArray = result.SelectedMental.MentalBodyTypeLookupId.ToIntArray();
                result.SelectedMental.MentalContentLookupArray = result.SelectedMental.MentalContentLookupId.ToIntArray();
                result.SelectedMental.MentalDressLookupArray = result.SelectedMental.MentalDressLookupId.ToIntArray();
                result.SelectedMental.MentalEstimatedIntellectLookupArray = result.SelectedMental.MentalEstimatedIntellectLookupId.ToIntArray();
                result.SelectedMental.MentalExpressionLookupArray = result.SelectedMental.MentalExpressionLookupId.ToIntArray();
                result.SelectedMental.MentalFlowOfThoughtLookupArray = result.SelectedMental.MentalFlowOfThoughtLookupId.ToIntArray();
                result.SelectedMental.MentalHygieneLookupArray = result.SelectedMental.MentalHygieneLookupId.ToIntArray();
                result.SelectedMental.MentalImpulseControlLookupArray = result.SelectedMental.MentalImpulseControlLookupId.ToIntArray();
                result.SelectedMental.MentalInformationLookupArray = result.SelectedMental.MentalInformationLookupId.ToIntArray();
                result.SelectedMental.MentalInsightLookupArray = result.SelectedMental.MentalInsightLookupId.ToIntArray();
                result.SelectedMental.MentalJudgementLookupArray = result.SelectedMental.MentalJudgementLookupId.ToIntArray();
                result.SelectedMental.MentalMemoryLookupArray = result.SelectedMental.MentalMemoryLookupId.ToIntArray();
                result.SelectedMental.MentalMotorActivityLookupArray = result.SelectedMental.MentalMotorActivityLookupId.ToIntArray();
                result.SelectedMental.MentalSpeechLookupArray = result.SelectedMental.MentalSpeechLookupId.ToIntArray();
                result.SelectedMental.MentalVocabularyLookupArray = result.SelectedMental.MentalVocabularyLookupId.ToIntArray();
                result.SelectedMental.MentalOrientationLookupArray = result.SelectedMental.MentalOrientationLookupId.ToIntArray();
            }

            return result;
        }

        public CaseHeader UpdatePrimaryInfo(CaseBook caseBook)
        {
            var parmsCollection = new ParmsCollection();
            var caseTable = UserDefinedTableTypes.Case;
            caseTable.Rows.Add(new object[]{
                caseBook.Case.CaseId,
                caseBook.Case.CaseNumber,
                caseBook.Case.CenterId,
                caseBook.Case.CaseStausId,
                caseBook.Case.CounselorId,
                caseBook.Case.PeaceMakerId,
                caseBook.Case.ClientFirstName,
                caseBook.Case.ClientLastName,
                caseBook.Case.Mi,
                caseBook.Case.FatherName,
                caseBook.Case.GenderLookupId,

                caseBook.Case.RequireAssistanceLookupId,
                caseBook.Case.MaritalStatusLookupId,
                caseBook.Case.Remarks,
                caseBook.Case.RegisterDate,
                caseBook.Case.MobileNumber,

                caseBook.Case.CreatedBy,
                caseBook.Case.CreatedDateTime,
                caseBook.Case.ModifiedBy,
                caseBook.Case.ModifiedDatetime,
                });
            caseTable.AcceptChanges();

            var updatedCase = this.unitOfWork.DbContext.ExecuteStoredProcedure<CaseHeader>("[Ops].[updatePrimaryInfo]",
                parmsCollection
                    .AddParm("@caseType", SqlDbType.Structured, caseTable, "[Ops].[CaseType]")
                ).First();

            return updatedCase;
        }

        public vCaseAddress UpdateAddress(CaseBook caseBook)
        {
            var parmsCollection = new ParmsCollection();

            var caseAddressTable = UserDefinedTableTypes.CaseAddress;
            caseAddressTable.Rows.Add(new object[]{
                caseBook.SelectedAddress.CaseAddressId,
                caseBook.SelectedAddress.CaseId,
                caseBook.SelectedAddress.Address,
                caseBook.SelectedAddress.Area,
                caseBook.SelectedAddress.CityId,
                caseBook.SelectedAddress.StateId,
                caseBook.SelectedAddress.PIN,
                caseBook.SelectedAddress.CreatedBy,
                caseBook.SelectedAddress.CreatedDateTime,
                caseBook.SelectedAddress.ModifiedBy,
                caseBook.SelectedAddress.ModifiedDatetime,
                });
            caseAddressTable.AcceptChanges();

            var updatedAddress = this.unitOfWork.DbContext.ExecuteStoredProcedure<vCaseAddress>("[Ops].[saveAddress]",
                parmsCollection
                    .AddParm("@caseAddressType", SqlDbType.Structured, caseAddressTable, "[Ops].[CaseAddressType]")
                ).Last();

            return updatedAddress;
        }

        public vCaseChildren UpdateChildren(CaseBook caseBook)
        {
            var parmsCollection = new ParmsCollection();

            var caseChildrenTable = UserDefinedTableTypes.CaseChildren;
            caseChildrenTable.Rows.Add(new object[]{
                caseBook.SelectedChildren.CaseChildrenId,
                caseBook.SelectedChildren.CaseId,
                caseBook.SelectedChildren.Name,
                caseBook.SelectedChildren.Age,
                caseBook.SelectedChildren.GenderLookupId,
                caseBook.SelectedChildren.RelationshipWithAbuserLookupId,
                caseBook.SelectedChildren.CreatedBy,
                caseBook.SelectedChildren.CreatedDateTime,
                caseBook.SelectedChildren.ModifiedBy,
                caseBook.SelectedChildren.ModifiedDatetime,
                });
            caseChildrenTable.AcceptChanges();

            var updatedChildren = this.unitOfWork.DbContext.ExecuteStoredProcedure<vCaseChildren>("[Ops].[saveChildren]",
                parmsCollection
                    .AddParm("@caseChildrenType", SqlDbType.Structured, caseChildrenTable, "[Ops].[CaseChildrenType]")
                ).Last();

            return updatedChildren;
        }

        public CaseHeader UpdateHouseHold(CaseBook caseBook)
        {
            var parmsCollection = new ParmsCollection();

            var caseChildrenTable = UserDefinedTableTypes.HouseHold;
            caseChildrenTable.Rows.Add(new object[]{
                caseBook.FamilyHouseHold.CaseFamilyHouseHoldId,
                caseBook.FamilyHouseHold.CaseId,
                caseBook.FamilyHouseHold.ChildrenDeceasedLookupId,
                caseBook.FamilyHouseHold.HouseHoldIncomeLookupId,
                caseBook.FamilyHouseHold.SoughtHelpYesNoLookupId,
                caseBook.FamilyHouseHold.SoughtHelpDesc,
                caseBook.FamilyHouseHold.SoughtHelpOutPut,
                caseBook.FamilyHouseHold.PeacemakerAssistanceLookupId,
                caseBook.FamilyHouseHold.PeacemakerAssistanceDesc,
                caseBook.FamilyHouseHold.PeacemakerFollowupYesNoLookupId,
                caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId,
                caseBook.FamilyHouseHold.ClientEmailId,
                caseBook.FamilyHouseHold.ReligionLookupId,
                caseBook.FamilyHouseHold.LevelOfEducationLookupId,
                caseBook.FamilyHouseHold.VocationalSkillsLookupId,
                caseBook.FamilyHouseHold.VocationalSkillsDesc,
                caseBook.FamilyHouseHold.OccupationLookupId,
                caseBook.FamilyHouseHold.OccupationDesc,
                caseBook.FamilyHouseHold.ClientIncomeLookupId,
                caseBook.FamilyHouseHold.HouseHoldMembersLivingLookupId,
                caseBook.FamilyHouseHold.YearsOfMarriage,
                caseBook.FamilyHouseHold.ClientAgeAtFirstChild
                });
            caseChildrenTable.AcceptChanges();

            var updatedCase = this.unitOfWork.DbContext.ExecuteStoredProcedure<CaseHeader>("[Ops].[saveHouseHold]",
                parmsCollection
                    .AddParm("@caseHouseHoldType", SqlDbType.Structured, caseChildrenTable, "[Ops].[CaseHouseHoldType]")
                ).First();

            return updatedCase;
        }

        public CaseHeader UpdateSpouse(CaseBook caseBook)
        {
            var parmsCollection = new ParmsCollection();

            var caseChildrenTable = UserDefinedTableTypes.Spouse;
            caseChildrenTable.Rows.Add(new object[]{
                caseBook.Spouse.CaseSpouseId,
                caseBook.Spouse.CaseId,
                caseBook.Spouse.SpouseName,
                caseBook.Spouse.SpouseDOB,
                caseBook.Spouse.SpouseHomePhone,
                caseBook.Spouse.SpouseMobilePhone,

                caseBook.Spouse.SpouseOccupation,
                caseBook.Spouse.SpouseEducationLookupId,
                caseBook.Spouse.SpouseAddress,
                caseBook.Spouse.Area,
                caseBook.Spouse.CityLookupId,
                caseBook.Spouse.StateLookupId,
                caseBook.Spouse.PIN,

                caseBook.Spouse.PrimaryEmergencyContactName,
                caseBook.Spouse.PrimaryEmergencyRelationshipToClientLookupId,
                caseBook.Spouse.PrimaryEmergencyContactPhoneNumber,
                caseBook.Spouse.PrimaryEmergencyContactAdress,

                caseBook.Spouse.SecondaryEmergencyContactName,
                caseBook.Spouse.SecondaryEmergencyRelationshipToClientLookupId,
                caseBook.Spouse.SecondaryEmergencyContactPhoneNumber,
                caseBook.Spouse.SecondaryEmergencyContactAdress,
                });
            caseChildrenTable.AcceptChanges();

            var updatedCase = this.unitOfWork.DbContext.ExecuteStoredProcedure<CaseHeader>("[Ops].[saveSpouse]",
                parmsCollection
                    .AddParm("@caseSpouseType", SqlDbType.Structured, caseChildrenTable, "[Ops].[CaseSpouseType]")
                ).First();

            return updatedCase;
        }

        public CaseHeader UpdatePhysicalHealth(CaseBook caseBook)
        {
            var parmsCollection = new ParmsCollection();

            var caseChildrenTable = UserDefinedTableTypes.PhysicalHealth;
            caseChildrenTable.Rows.Add(new object[]{
                caseBook.PhysicalHealth.CasePhysicalHealthId,
                caseBook.PhysicalHealth.CaseId,

                caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessLookupId,
                caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessDesc,

                caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessLookupId,
                caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessDesc,

                caseBook.PhysicalHealth.SleepPerNightLookupId,
                caseBook.PhysicalHealth.AppetiteLookupId,
                caseBook.PhysicalHealth.ExerciseLookupId,

                caseBook.PhysicalHealth.AnyMedicationLookupId,
                caseBook.PhysicalHealth.AnyMedicationDesc,

                caseBook.PhysicalHealth.AnySubstanceLookupId,
                caseBook.PhysicalHealth.AnySubstanceDesc,

                caseBook.PhysicalHealth.CurrentlyPregnantLookup,
                caseBook.PhysicalHealth.CurrentlyPregnantDesc,

                caseBook.PhysicalHealth.ReasonForSeekingHelpLookupId,
                caseBook.PhysicalHealth.WhoIsAbusingYouLookupId,
                caseBook.PhysicalHealth.WhoIsAbusingYouDesc,
                caseBook.PhysicalHealth.ReasonForSeekingHelpDesc
                });
            caseChildrenTable.AcceptChanges();

            var updatedCase = this.unitOfWork.DbContext.ExecuteStoredProcedure<CaseHeader>("[Ops].[savePhysicalHealth]",
                parmsCollection
                    .AddParm("@casePhysicalHealthType", SqlDbType.Structured, caseChildrenTable, "[Ops].[CasePhysicalHealthType]")
                ).First();

            return updatedCase;
        }

        public vCaseOffender UpdateOffender(CaseBook caseBook)
        {
            CaseOffender caseObj;
            vCaseOffender vCaseObj;
            try
            {
                caseObj = this.unitOfWork.DbContext.Offenders.Find(caseBook.SelectedOffender.CaseOffenderId);
                if(caseObj!=null)
                {
                    this.unitOfWork.DbContext.Entry(caseObj).CurrentValues.SetValues(caseBook.SelectedOffender);
                }
                else
                {
                    caseObj = this.unitOfWork.DbContext.Offenders.Add(caseBook.SelectedOffender);
                }
                int flag = this.unitOfWork.DbContext.SaveChanges();
                vCaseObj = this.unitOfWork.DbContext.vOffenders.Find(caseObj.CaseOffenderId);
            }
            catch (Exception ex)
            {
                return null;
            }
            return vCaseObj;
        }

        public CaseHeader UpdateAbuse(CaseBook caseBook)
        {
            var parmsCollection = new ParmsCollection();

            var caseChildrenTable = UserDefinedTableTypes.Abuse;
            caseChildrenTable.Rows.Add(new object[]{
                caseBook.Abuse.CaseAbuseId,
                caseBook.Abuse.CaseId,

                caseBook.Abuse.SufferingFromAbuseLookupId,
                caseBook.Abuse.SufferingFromAbuseDesc,

                caseBook.Abuse.FeelAboutAbuseLookupId,
                caseBook.Abuse.ParentsFeelAboutAbuseLookupId,
                caseBook.Abuse.LawFeelAboutAbuseLookupId,
                caseBook.Abuse.SignsOfPhysicalAbuseLookupId,
                caseBook.Abuse.SignsOfPhysicalAbuseDesc,

                caseBook.Abuse.WeaponsUsedLookupId,
                caseBook.Abuse.WeaponsUsedDesc,

                caseBook.Abuse.TypesOfPhyscialAbuseLookupId,
                caseBook.Abuse.FrequencyOfPhyscialAbuseLookupId,
                caseBook.Abuse.NumberOfYearsOfPhyscialAbuse,

                caseBook.Abuse.TypesOfEmotionalAbuseLookupId,
                caseBook.Abuse.FrequencyOfEmotionalAbuseLookupId,
                caseBook.Abuse.NumberOfYearsOfEmotionalAbuse,

                caseBook.Abuse.TypesOfSexualAbuseLookupId,
                caseBook.Abuse.FrequencyOfSexualAbuseLookupId,
                caseBook.Abuse.NumberOfYearsOfSexualAbuse,

                caseBook.Abuse.TypesOfEconomicAbuseLookupId,
                caseBook.Abuse.FrequencyOfEconomicAbuseLookupId,
                caseBook.Abuse.NumberOfYearsOfEconomicAbuse,

                caseBook.Abuse.ReasonsForAbuseLookupId,
                caseBook.Abuse.ReasonForAbuseDesc,

                caseBook.Abuse.PhysicalAbuseDesc,
                caseBook.Abuse.EmotionalAbuseDesc,
                caseBook.Abuse.SexualAbuseDesc,
                caseBook.Abuse.EconomicAbuseDesc,

                });
            caseChildrenTable.AcceptChanges();

            var updatedCase = this.unitOfWork.DbContext.ExecuteStoredProcedure<CaseHeader>("[Ops].[saveAbuse]",
                parmsCollection
                    .AddParm("@caseAbuseType", SqlDbType.Structured, caseChildrenTable, "[Ops].[CaseAbuseType]")
                ).First();

            return updatedCase;
        }

        public int UpdateCaseManagement(CaseBook caseBook)
        {
            CaseManage caseManageObj;
            Case caseObj;
            try
            {
                caseManageObj = this.unitOfWork.DbContext.Manage.Find(caseBook.Manage.CaseManageId);
                if (caseManageObj != null)
                {
                    this.unitOfWork.DbContext.Entry(caseManageObj).CurrentValues.SetValues(caseBook.Manage);
                }
                else
                    caseManageObj = this.unitOfWork.DbContext.Manage.Add(caseBook.Manage);
                caseObj = this.unitOfWork.DbContext.Cases.Find(caseBook.Case.CaseId);
                //caseObj.CaseStausId = caseManageObj.CaseStatusId;
                int flag = this.unitOfWork.DbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                throw;
            }

            return caseManageObj.CaseManageId;
        }

        public vCaseMental UpdateMental(CaseBook caseBook)
        {
            CaseMental caseObj;
            vCaseMental vCaseObj;
            try
            {
                caseObj = this.unitOfWork.DbContext.Mental.Find(caseBook.SelectedMental.CaseMentalId);
                if (caseObj != null)
                {
                    this.unitOfWork.DbContext.Entry(caseObj).CurrentValues.SetValues(caseBook.SelectedMental);
                }
                else
                {
                    caseObj = this.unitOfWork.DbContext.Mental.Add(caseBook.SelectedMental);
                }
                int flag = this.unitOfWork.DbContext.SaveChanges();
                vCaseObj = this.unitOfWork.DbContext.vMental.Find(caseObj.CaseMentalId);
            }
            catch (Exception ex)
            {
                return null;
            }
            return vCaseObj;
        }

        public vCaseSessionLog UpdateSessionLog(CaseBook caseBook)
        {
            CaseSessionLog caseObj;
            vCaseSessionLog vCaseObj;
          try
            {
                caseObj = this.unitOfWork.DbContext.SessionLogs.Find(caseBook.SelectedSessionLog.CaseSessionLogId);
                if(caseObj!=null)
                {
                    this.unitOfWork.DbContext.Entry(caseObj).CurrentValues.SetValues(caseBook.SelectedSessionLog);
                }
                else
                {
                    caseObj = this.unitOfWork.DbContext.SessionLogs.Add(caseBook.SelectedSessionLog);
                }
                int flag = this.unitOfWork.DbContext.SaveChanges();
                vCaseObj = this.unitOfWork.DbContext.vSessionLog.Find(caseObj.CaseSessionLogId);
            }
            catch(Exception ex)
            {
                return null;
            }

            return vCaseObj;
        }

        public vCaseFeedback UpdateFeedback(CaseBook caseBook)
        {
            CaseFeedback caseObj;
            vCaseFeedback vCaseObj;
            try
            {
                caseObj = this.unitOfWork.DbContext.Feedback.Find(caseBook.SelectedFeedback.CaseFeedbackId);
                if (caseObj != null)
                {
                    this.unitOfWork.DbContext.Entry(caseObj).CurrentValues.SetValues(caseBook.SelectedFeedback);
                }
                else
                {
                    caseObj = this.unitOfWork.DbContext.Feedback.Add(caseBook.SelectedFeedback);
                }
                int flag = this.unitOfWork.DbContext.SaveChanges();
                vCaseObj = this.unitOfWork.DbContext.vFeedback.Find(caseObj.CaseFeedbackId);
            }
            catch (Exception ex)
            {
                return null;
            }

            return vCaseObj;
        }

        public CaseHeader UpdateLegal(CaseBook caseBook)
        {
            var parmsCollection = new ParmsCollection();

            var caseChildrenTable = UserDefinedTableTypes.Legal;
            caseChildrenTable.Rows.Add(new object[]{
                caseBook.Legal.CaseLegalId,
                caseBook.Legal.CaseId,

                caseBook.Legal.CaseNumber,
                caseBook.Legal.Court,

                caseBook.Legal.Prayer,
                caseBook.Legal.LegalRepresentative,

                caseBook.Legal.LegalConsentFormLookupId,
                caseBook.Legal.LegalActionLookupId,

                caseBook.Legal.OutcomeLookupId,
                caseBook.Legal.DocumentsLookupId
                });
            caseChildrenTable.AcceptChanges();

            var updatedCase = this.unitOfWork.DbContext.ExecuteStoredProcedure<CaseHeader>("[Ops].[saveLegal]",
                parmsCollection
                    .AddParm("@caseLegalType", SqlDbType.Structured, caseChildrenTable, "[Ops].[CaseLegalType]")
                ).First();

            return updatedCase;
        }

        public CaseHeader UpdateCaseStatus(CaseBook caseBook)
        {
            UpdateCaseManagement(caseBook);
            var updatedCaseHeader = UpdateHouseHold(caseBook);
            updatedCaseHeader = UpdateSpouse(caseBook);
            updatedCaseHeader = UpdatePhysicalHealth(caseBook);
            updatedCaseHeader = UpdateAbuse(caseBook);

            return updatedCaseHeader;
        }
        public bool DeleteCase(int caseId)
        {
            try
            {
                var caseObj = this.unitOfWork.DbContext.Cases.SingleOrDefault(c => c.CaseId == caseId);
                caseObj.CaseStausId = (int)ECaseStatus.DeleteStatus;
                int flag = this.unitOfWork.DbContext.SaveChanges();
            }
          
            catch(Exception ex)
            {
                return false;
            }
            return true;
        }

    }
}
