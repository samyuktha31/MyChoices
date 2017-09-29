
CREATE TYPE [Ops].[CaseManageType] AS TABLE
(
	CaseManageId INT ,
	CaseId INT,
	ReferredtoWhom varchar(2000),

	SourceOfCaseLookupId INT,
	SourceOfCaseDesc varchar(2000),

	TypesOfCounselingLookupId varchar(100),
	TotalNoOfSessionsLookupId INT,
	TotalHoursSpentLookupId FLOAT,

	ReasonForClosureStatus varchar(2000),
	CaseSubject varchar(2000),
	CaseDescription varchar(2000),
	RelationshipWithPMLookupId INT,

	ResolutionLog varchar(2000)
)
