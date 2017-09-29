CREATE PROCEDURE [Ops].[saveManage]
	@caseManageType as [Ops].[CaseManageType] readonly
AS
BEGIN

	MERGE Ops.trCaseManage T
	USING @caseManageType S ON T.CaseManageId = S.CaseManageId AND T.CaseId = S.CaseId
	WHEN NOT MATCHED THEN
		INSERT (CaseId, ReferredToWhom, SourceOfCaseLookupId, SourceOfCaseDesc, TypesOfCounselingLookupId, TotalNoOfSessionsLookupId, TotalHoursSpentLookupId, ReasonForClosureStatus,
				CaseSubject, CaseDescription, RelationshipWithPMLookupId, ResolutionLog)
		VALUES (S.CaseId, S.ReferredToWhom, S.SourceOfCaseLookupId, S.SourceOfCaseDesc, S.TypesOfCounselingLookupId, S.TotalNoOfSessionsLookupId, S.TotalHoursSpentLookupId, S.ReasonForClosureStatus,
				S.CaseSubject, S.CaseDescription, S.RelationshipWithPMLookupId, S.ResolutionLog)
	WHEN MATCHED THEN 
		UPDATE 
		SET 			
			T.SourceOfCaseLookupId = S.SourceOfCaseLookupId 
			,T.ReferredToWhom = S.ReferredToWhom
			,T.SourceOfCaseDesc = S.SourceOfCaseDesc 
			,T.TypesOfCounselingLookupId = S.TypesOfCounselingLookupId 
			,T.TotalNoOfSessionsLookupId = S.TotalNoOfSessionsLookupId 
			,T.TotalHoursSpentLookupId = S.TotalHoursSpentLookupId 
			,T.ReasonForClosureStatus = S.ReasonForClosureStatus 
			,T.CaseSubject = S.CaseSubject 
			,T.CaseDescription = S.CaseDescription 
			,T.RelationshipWithPMLookupId = S.RelationshipWithPMLookupId 
			,T.ResolutionLog = S.ResolutionLog ;

	declare @CaseId INT;
	select @CaseId = CaseId from @caseManageType;

	select * from [Ops].[vCaseHeader] where CaseId = @CaseId;
END
	