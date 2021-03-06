﻿CREATE TYPE [Ops].[CaseChildrenType] AS TABLE
(
	[CaseChildrenId] INT NULL,
	[CaseId] INT NULL,
	[Name] VARCHAR(200) null,
	[Age] DECIMAL(5, 2) null,
	[GenderLookupId] INT null,
	[RelationshipWithAbuserLookupId] INT null,

	[CreatedBy] int null,
	[CreatedDateTime] datetime null,
	[ModifiedBy] int null,
	[ModifiedDatetime] datetime null
)
