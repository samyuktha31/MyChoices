﻿CREATE TYPE [Ops].[CaseAbuseType] AS TABLE
(
	[CaseAbuseId] INT ,
	[CaseId] INT,

	SufferingFromAbuseLookupId INT,
	SufferingFromAbuseDesc varchar(2000),
	
	FeelAboutAbuseLookupId varchar(200),
	ParentsFeelAboutAbuseLookupId varchar(200),
	LawFeelAboutAbuseLookupId varchar(200),
	
	SignsOfPhysicalAbuseLookupId INT,
	SignsOfPhysicalAbuseDesc varchar(2000),

	WeaponsUsedLookupId varchar(200),
	WeaponsUsedDesc varchar(2000),

	TypesOfPhyscialAbuseLookupId varchar(200),
	FrequencyOfPhyscialAbuseLookupId INT,
	NumberOfYearsOfPhyscialAbuse tinyint,

	TypesOfEmotionalAbuseLookupId varchar(200),
	FrequencyOfEmotionalAbuseLookupId INT,
	NumberOfYearsOfEmotionalAbuse tinyint,

	TypesOfSexualAbuseLookupId varchar(200),
	FrequencyOfSexualAbuseLookupId INT,
	NumberOfYearsOfSexualAbuse tinyint,

	TypesOfEconomicAbuseLookupId varchar(200),
	FrequencyOfEconomicAbuseLookupId INT,
	NumberOfYearsOfEconomicAbuse tinyint,

	ReasonsForAbuseLookupId varchar(200),
	ReasonForAbuseDesc VARCHAR(200),
	
	PhysicalAbuseDesc VARCHAR(2000),
	EmotionalAbuseDesc VARCHAR(2000),
	SexualAbuseDesc VARCHAR(2000),
	EconomicAbuseDesc VARCHAR(2000)
)
