import { Component, Input, OnInit, ViewContainerRef, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { SelectModule, IOption } from 'ng-select';
import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

import { CasesService } from '../services/cases.services';
import { CommonService } from '../services/common.services';
import { ChartsService } from '../services/charts.services';
import { ValidationService } from '../services/validation.service';

import {
    CaseBook, Case, CaseAddress, vCaseAddress, CaseChildren, vCaseChildren, vCaseOffender, CaseOffender, vCaseMental, CaseMental, CaseSessionLog, vCaseFeedback, CaseFeedback, CaseLegal
    } from '../models/case.entities';
import { BaseCaseController } from './basecase.controller';
import { ModalDirective } from 'ng2-bootstrap/modal';
import 'rxjs/add/observable/forkJoin';

import { IMyOptions } from 'mydatepicker';

import * as moment from 'moment';

@Component({
    templateUrl: 'cases.move.html',
    styleUrls: ['cases.move.scss'],
})
export class CasesMoveComponent extends BaseCaseController implements OnInit, OnDestroy {

    public caseBook: CaseBook;
    private selectedCaseId: number;
    public mainForm: FormGroup;
    public category2Form: FormGroup;
    public category3Form: FormGroup;
    public category4Form: FormGroup;
    public unresolvedForm: FormGroup;
    public referredForm: FormGroup;
    public closedForm: FormGroup;
    public category5Form: FormGroup;
    public router: Router;
    public isMainDataLoaded: boolean = false;
    public isPrimaryDataLoaded: boolean = false;
    
    public isCategory2: boolean = false;
    public isCategory3: boolean = false;
    public isCategory4: boolean = false;
    public isUnresolved: boolean = false;
    public isReferred: boolean = false;
    public isCloseStatus: boolean = false;
    public isCategory5: boolean = false;

    public caseStatusLookupOptionsList: Array<IOption> = [];

    constructor(public fb: FormBuilder,
        public casesService: CasesService,
        public commonService: CommonService,
        public chartsService: ChartsService,
        public routerObj: Router,
        public toastr: ToastsManager,
        public activatedRoute: ActivatedRoute,
        public validationService: ValidationService,
        public vRef: ViewContainerRef,) {
        super(casesService, commonService, chartsService);

        this.isPrimaryDataLoaded = false;
        this.toastr.setRootViewContainerRef(vRef);

        this.router = routerObj;
    }

    ngOnDestroy() {
        this.toastr.clearAllToasts();
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.selectedCaseId = params['id'];            

            this.observerDataSubject.subscribe(data => {
                switch (data) {
                    case "Lookups": {
                        this.loadLookups();
                        break;
                    }
                    case "CaseStatuses": {
                        this.casesService.GetCaseById(this.selectedCaseId).subscribe(data => {
                                this.caseBook = data;
                                this.getCaseStatuses();
                                this.loadMainForm();
                                this.loadUnresolvedForm();
                                this.loadClosedForm();
                                this.loadReferredForm();
                                this.loadCategory2Form();
                                this.loadCategory3Form();
                                this.loadCategory4Form();
                                this.loadCategory5Form();
                        });
                        break;
                    }
                    default: break;
                }
            });

        });
    }

    private getCaseById() {
        var url = '/cases/view/' + this.selectedCaseId;
        this.router.navigate([url]).then(() => {
            this.toastr.success('Case moved successfully');
        });
    }

    private changeStatus() {

        this.caseBook.Case.CaseStausId = this.mainForm.controls['CaseStatusId'].value;

        var previousCaseStatusLevel = this.caseStatusesList.find(caseStatusNode => caseStatusNode.CaseStatusId == this.caseBook.Case.CaseStausId).Level;
        var currentCaseStatus = this.caseBook.Case.CaseStausId;

        this.setCategory();

        switch (currentCaseStatus) {
            case "3": {
                this.isUnresolved = true;
                this.isCloseStatus = true;
                break;
            }
            case "4": {
                this.isReferred = true;
                this.isCloseStatus = true;
                break;
            }
            case "5":
            case "7":
            {
                this.isCloseStatus = true;
                break;
            }
            default: break;
        }

        switch (previousCaseStatusLevel) {
            case 2: {
                this.isCategory2 = true;
                break;
            }
            case 3: {
                this.isCategory3 = true;
                break;
            }
            case 4: {
                this.isCategory4 = true;
                break;
            }
            case 5: {
                this.isCategory5 = true;
                break;
            }
            default: break;
        }
    }

    private setCategory() {

        this.isCategory2 = false;
        this.isCategory3 = false;
        this.isCategory4 = false;
        this.isCategory5 = false;

        this.isUnresolved = false;
        this.isCloseStatus = false;
        this.isReferred = false;
    }

    private getCaseStatuses(): any {
        var localStatusesOptionList = new Array<IOption>();

        var previousCaseStatusLevel = this.caseStatusesList.find(caseStatusNode => caseStatusNode.CaseStatusId == this.caseBook.Case.CaseStausId).Level;
        ++previousCaseStatusLevel;

        for (var i = 0; i < this.caseStatusesList.length; i++) {

            if (this.caseStatusesList[i].Level >= previousCaseStatusLevel) {
                localStatusesOptionList.push({ value: this.caseStatusesList[i].CaseStatusId.toString(), label: this.caseStatusesList[i].Title });
            }
        }
        this.caseStatusOptionList = localStatusesOptionList;
        
    }

    private loadLookups(): any {
        this.yesNoOptionsList = this.ParseLookups("YesNo");
        this.peacemakerAssistanceOptionsList = this.ParseMultiLookups("PeacemakerAssistance");
        this.emergencyRelationshipOptionsList = this.ParseLookups("RelationshipWithClient");
        this.occupationOptionsList = this.ParseLookups("Occupation");
        this.incomeLookupOptionsList = this.ParseLookups("Income");
        this.reasonForSeekingHelpLookupOptionsList = this.ParseMultiLookups("ReasonForSeekingHelp");
        this.whoIsAbusingYouLookupOptionsList = this.ParseMultiLookups("AbusingPerson");
        this.sufferingFromAbuseLookupIdLookupOptionsList = this.ParseLookups("YesNo");

        this.feelAboutAbuseLookupOptionsList = this.ParseMultiLookups("AbusingFeel");
        this.farentsFeelAboutAbuseLookupOptionsList = this.ParseMultiLookups("AbusingParentsFeel");
        this.lawFeelAboutAbuseLookupOptionsList = this.ParseMultiLookups("AbusingParentsFeel");

        this.signsOfPhysicalAbuseLookupOptionsList = this.ParseLookups("YesNo");

        this.typesOfPhyscialAbuseLookupOptionsList = this.ParseMultiLookups("TypesOfPhysicalAbuse");
        this.frequencyOfPhyscialAbuseLookupOptionsList = this.ParseLookups("FrequencyOfAbuse");

        this.typesOfEmotionalAbuseLookupOptionsList = this.ParseMultiLookups("TypesOfEmotionalAbuse");
        this.frequencyOfEmotionalAbuseLookupOptionsList = this.ParseLookups("FrequencyOfAbuse");

        this.typesOfSexualAbuseLookupOptionsList = this.ParseMultiLookups("TypesOfSexualAbuse");
        this.frequencyOfSexualAbuseLookupOptionsList = this.ParseLookups("FrequencyOfAbuse");

        this.typesOfEconomicAbuseLookupOptionsList = this.ParseMultiLookups("TypesOfEconomicalAbuse");
        this.frequencyOfEconomicAbuseLookupOptionsList = this.ParseLookups("FrequencyOfAbuse");

        this.reasonsForAbuseLookupOptionsList = this.ParseMultiLookups("ReasonForAbuse");
        this.sourceOfCaseLookupOptionList = this.ParseLookups("SourceOfCase");
        this.typesOfCounselingLookupOptionList = this.ParseMultiLookups("TypesOfCounselling");

        this.outcomeLookupOptionList = this.ParseMultiLookups("Outcome");
        this.documentsLookupOptionList = this.ParseMultiLookups("Documents");
    }

    private loadReferredForm() {
        this.referredForm = this.fb.group({
            ReferredToWhom: [this.caseBook.Manage.ReferredToWhom, Validators.required]
        });
    }

    private loadClosedForm() {
        this.closedForm = this.fb.group({
            ReasonForClosureStatus: [this.caseBook.Manage.ReasonForClosureStatus, Validators.required]
        });
    }

    private loadUnresolvedForm() {
        this.unresolvedForm = this.fb.group({
            ResolutionLog: [this.caseBook.Manage.ResolutionLog, Validators.required],
        });
    }

    private loadMainForm() {
        this.mainForm = this.fb.group({

            CaseStatusId: [this.caseBook.Case.CaseStausId.toString(), Validators.required],
        });
    }

    private loadCategory2Form() {
        this.category2Form = this.fb.group({

            // Manage category 2

            CaseStatusId: [this.caseBook.Case.CaseStausId.toString(), Validators.required],
            CaseSubject: [this.caseBook.Manage.CaseSubject, Validators.required],
            CaseDescription: [this.caseBook.Manage.CaseDescription, Validators.required],
            //End of Manage category 2 

            //Household category 2 
            SoughtHelpYesNoLookupId: [this.caseBook.FamilyHouseHold.SoughtHelpYesNoLookupId == undefined ? null : this.caseBook.FamilyHouseHold.SoughtHelpYesNoLookupId.toString(), Validators.required],
            SoughtHelpDesc: [this.caseBook.FamilyHouseHold.SoughtHelpDesc],
            SoughtHelpOutPut: [this.caseBook.FamilyHouseHold.SoughtHelpOutPut],
            PeacemakerAssistanceLookupId: [this.caseBook.FamilyHouseHold.PeacemakerAssistanceLookupId == undefined ? null : this.caseBook.FamilyHouseHold.PeacemakerAssistanceLookupId.toString(), Validators.required],
            PeacemakerAssistanceDesc: [this.caseBook.FamilyHouseHold.PeacemakerAssistanceDesc],
            PeacemakerFollowupYesNoLookupId: [this.caseBook.FamilyHouseHold.PeacemakerFollowupYesNoLookupId == undefined ? null : this.caseBook.FamilyHouseHold.PeacemakerFollowupYesNoLookupId.toString(), Validators.required],
            ClientSignedRegistrationFormYesNoLookupId: [this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId == undefined ? null : this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId.toString(), Validators.required],

            //End of Household category 2

            //Spouse category 2
            PrimaryEmergencyContactName: [this.caseBook.Spouse.PrimaryEmergencyContactName, Validators.required],
            PrimaryEmergencyRelationshipToClientLookupId: [this.caseBook.Spouse.PrimaryEmergencyRelationshipToClientLookupId == undefined ? null : this.caseBook.Spouse.PrimaryEmergencyRelationshipToClientLookupId.toString(), Validators.required],
            PrimaryEmergencyContactPhoneNumber: [this.caseBook.Spouse.PrimaryEmergencyContactPhoneNumber, [Validators.required, Validators.minLength(10), this.validationService.mobileValidator]],

            //End of Spouse category 2

            //Physical Health category 2
            SufferingFromAnyMajorIllnessLookupId: new FormControl(this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessLookupId == undefined ? null : this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessLookupId.toString(), Validators.required),
            SufferingFromAnyMajorIllnessDesc: new FormControl(this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessDesc),
            DiagnosedPsychiatricIllnessLookupId: new FormControl(this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessLookupId == undefined ? null : this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessLookupId.toString(), Validators.required),
            DiagnosedPsychiatricIllnessDesc: new FormControl(this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessDesc),

            //End of physical health category 2

        });
        this.isMainDataLoaded = true;
    }

    private loadCategory3Form() {
        this.category3Form = this.fb.group({

            CaseSubject: [this.caseBook.Manage.CaseSubject, Validators.required],
            CaseDescription: [this.caseBook.Manage.CaseDescription, Validators.required],
            ClientSignedRegistrationFormYesNoLookupId: [this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId == undefined ? null : this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId.toString(), Validators.required]
        });
    }

    private loadCategory4Form() {
        this.category4Form = this.fb.group({

            CaseStatusId: [this.caseBook.Case.CaseStausId.toString(), Validators.required],
            CaseSubject: [this.caseBook.Manage.CaseSubject, Validators.required],
            CaseDescription: [this.caseBook.Manage.CaseDescription, Validators.required],

            //Household category 2 
            SoughtHelpYesNoLookupId: [this.caseBook.FamilyHouseHold.SoughtHelpYesNoLookupId == undefined ? null : this.caseBook.FamilyHouseHold.SoughtHelpYesNoLookupId.toString(), Validators.required],
            SoughtHelpDesc: [this.caseBook.FamilyHouseHold.SoughtHelpDesc],
            SoughtHelpOutPut: [this.caseBook.FamilyHouseHold.SoughtHelpOutPut],
            PeacemakerAssistanceLookupId: [this.caseBook.FamilyHouseHold.PeacemakerAssistanceLookupId == undefined ? null : this.caseBook.FamilyHouseHold.PeacemakerAssistanceLookupId.toString(), Validators.required],
            PeacemakerAssistanceDesc: [this.caseBook.FamilyHouseHold.PeacemakerAssistanceDesc],
            PeacemakerFollowupYesNoLookupId: [this.caseBook.FamilyHouseHold.PeacemakerFollowupYesNoLookupId == undefined ? null : this.caseBook.FamilyHouseHold.PeacemakerFollowupYesNoLookupId.toString(), Validators.required],
            ClientSignedRegistrationFormYesNoLookupId: [this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId == undefined ? null : this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId.toString(), Validators.required],
            OccupationLookupId: [this.caseBook.FamilyHouseHold.OccupationLookupId == undefined ? null : this.caseBook.FamilyHouseHold.OccupationLookupId.toString(), Validators.required],
            OccupationDesc: new FormControl(this.caseBook.FamilyHouseHold.OccupationDesc),
            YearsOfMarriage: [this.caseBook.FamilyHouseHold.YearsOfMarriage, [Validators.required, this.validationService.validateYears, this.validationService.validateYears]],
            HouseHoldIncomeLookupId: [this.caseBook.FamilyHouseHold.HouseHoldIncomeLookupId == undefined ? null : this.caseBook.FamilyHouseHold.HouseHoldIncomeLookupId.toString(), Validators.required],

            //End of household category 4

            //Spouse category 4
            PrimaryEmergencyContactName: [this.caseBook.Spouse.PrimaryEmergencyContactName, Validators.required],
            PrimaryEmergencyRelationshipToClientLookupId: [this.caseBook.Spouse.PrimaryEmergencyRelationshipToClientLookupId == undefined ? null : this.caseBook.Spouse.PrimaryEmergencyRelationshipToClientLookupId.toString(), Validators.required],
            PrimaryEmergencyContactPhoneNumber: [this.caseBook.Spouse.PrimaryEmergencyContactPhoneNumber, [Validators.required, Validators.minLength(10), this.validationService.mobileValidator]],

            //End of Spouse category 4

            //Physical Health Category 4
            AnyMedicationLookupId: [this.caseBook.PhysicalHealth.AnyMedicationLookupId == undefined ? null : this.caseBook.PhysicalHealth.AnyMedicationLookupId.toString(), Validators.required],
            AnyMedicationDesc: [this.caseBook.PhysicalHealth.AnyMedicationDesc],
            AnySubstanceLookupId: [this.caseBook.PhysicalHealth.AnySubstanceLookupId == undefined ? null : this.caseBook.PhysicalHealth.AnySubstanceLookupId.toString(), Validators.required],
            AnySubstanceDesc: new FormControl(this.caseBook.PhysicalHealth.AnySubstanceDesc),
            CurrentlyPregnantLookup: [this.caseBook.PhysicalHealth.CurrentlyPregnantLookup == undefined ? null : this.caseBook.PhysicalHealth.CurrentlyPregnantLookup.toString(), Validators.required],
            CurrentlyPregnantDesc: new FormControl(this.caseBook.PhysicalHealth.CurrentlyPregnantDesc),
            ReasonForSeekingHelpLookupId: [this.caseBook.PhysicalHealth.ReasonForSeekingHelpLookupId == undefined ? null : this.caseBook.PhysicalHealth.ReasonForSeekingHelpLookupId.toString(), Validators.required],
            WhoIsAbusingYouLookupId: [this.caseBook.PhysicalHealth.WhoIsAbusingYouLookupId == undefined ? null : this.caseBook.PhysicalHealth.WhoIsAbusingYouLookupId.toString(), Validators.required],
            WhoIsAbusingYouDesc: [this.caseBook.PhysicalHealth.WhoIsAbusingYouDesc == undefined ? null : this.caseBook.PhysicalHealth.WhoIsAbusingYouDesc.toString()],
            ReasonForSeekingHelpDesc: new FormControl(this.caseBook.PhysicalHealth.ReasonForSeekingHelpDesc == undefined ? null : this.caseBook.PhysicalHealth.ReasonForSeekingHelpDesc.toString()),

            //End of physical health category 4 

            //Abuse Category 4
            SufferingFromAnyMajorIllnessLookupId: new FormControl(this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessLookupId == undefined ? null : this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessLookupId.toString(), Validators.required),
            SufferingFromAnyMajorIllnessDesc: new FormControl(this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessDesc),
            DiagnosedPsychiatricIllnessLookupId: new FormControl(this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessLookupId == undefined ? null : this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessLookupId.toString(), Validators.required),
            DiagnosedPsychiatricIllnessDesc: new FormControl(this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessDesc),
            SufferingFromAbuseLookupId: new FormControl(this.caseBook.Abuse.SufferingFromAbuseLookupId == undefined ? null : this.caseBook.Abuse.SufferingFromAbuseLookupId.toString(), Validators.required),
            SufferingFromAbuseDesc: new FormControl(this.caseBook.Abuse.SufferingFromAbuseDesc),

            FeelAboutAbuseLookupId: new FormControl(this.caseBook.Abuse.FeelAboutAbuseLookupId == undefined ? null : this.caseBook.Abuse.FeelAboutAbuseLookupId.toString(), Validators.required),
            ParentsFeelAboutAbuseLookupId: new FormControl(this.caseBook.Abuse.ParentsFeelAboutAbuseLookupId == undefined ? null : this.caseBook.Abuse.ParentsFeelAboutAbuseLookupId.toString(), Validators.required),
            LawFeelAboutAbuseLookupId: new FormControl(this.caseBook.Abuse.LawFeelAboutAbuseLookupId == undefined ? null : this.caseBook.Abuse.LawFeelAboutAbuseLookupId.toString(), Validators.required),
            SignsOfPhysicalAbuseLookupId: new FormControl(this.caseBook.Abuse.SignsOfPhysicalAbuseLookupId == undefined ? null : this.caseBook.Abuse.SignsOfPhysicalAbuseLookupId.toString(), Validators.required),
            SignsOfPhysicalAbuseDesc: new FormControl(this.caseBook.Abuse.SignsOfPhysicalAbuseDesc),

            TypesOfPhyscialAbuseLookupId: new FormControl(this.caseBook.Abuse.TypesOfPhyscialAbuseLookupId == undefined ? null : this.caseBook.Abuse.TypesOfPhyscialAbuseLookupId.toString(), Validators.required),
            FrequencyOfPhyscialAbuseLookupId: new FormControl(this.caseBook.Abuse.FrequencyOfPhyscialAbuseLookupId == undefined ? null : this.caseBook.Abuse.FrequencyOfPhyscialAbuseLookupId.toString(), Validators.required),
            NumberOfYearsOfPhyscialAbuse: new FormControl(this.caseBook.Abuse.NumberOfYearsOfPhyscialAbuse == undefined ? null : this.caseBook.Abuse.NumberOfYearsOfPhyscialAbuse.toString(), [Validators.maxLength(2), this.validationService.validateNumber, Validators.required]),

            TypesOfEmotionalAbuseLookupId: new FormControl(this.caseBook.Abuse.TypesOfEmotionalAbuseLookupId == undefined ? null : this.caseBook.Abuse.TypesOfEmotionalAbuseLookupId.toString(), Validators.required),
            FrequencyOfEmotionalAbuseLookupId: new FormControl(this.caseBook.Abuse.FrequencyOfEmotionalAbuseLookupId == undefined ? null : this.caseBook.Abuse.FrequencyOfEmotionalAbuseLookupId.toString(), Validators.required),
            NumberOfYearsOfEmotionalAbuse: new FormControl(this.caseBook.Abuse.NumberOfYearsOfEmotionalAbuse == undefined ? null : this.caseBook.Abuse.NumberOfYearsOfEmotionalAbuse.toString(), [Validators.maxLength(2), this.validationService.validateNumber, Validators.required]),

            TypesOfSexualAbuseLookupId: new FormControl(this.caseBook.Abuse.TypesOfSexualAbuseLookupId == undefined ? null : this.caseBook.Abuse.TypesOfSexualAbuseLookupId.toString(), Validators.required),
            FrequencyOfSexualAbuseLookupId: new FormControl(this.caseBook.Abuse.FrequencyOfSexualAbuseLookupId == undefined ? null : this.caseBook.Abuse.FrequencyOfSexualAbuseLookupId.toString(), Validators.required),
            NumberOfYearsOfSexualAbuse: new FormControl(this.caseBook.Abuse.NumberOfYearsOfSexualAbuse == undefined ? null : this.caseBook.Abuse.NumberOfYearsOfSexualAbuse.toString(), [Validators.maxLength(2), this.validationService.validateNumber, Validators.required]),

            TypesOfEconomicAbuseLookupId: new FormControl(this.caseBook.Abuse.TypesOfEconomicAbuseLookupId == undefined ? null : this.caseBook.Abuse.TypesOfEconomicAbuseLookupId.toString(), Validators.required),
            FrequencyOfEconomicAbuseLookupId: new FormControl(this.caseBook.Abuse.FrequencyOfEconomicAbuseLookupId == undefined ? null : this.caseBook.Abuse.FrequencyOfEconomicAbuseLookupId.toString(), Validators.required),
            NumberOfYearsOfEconomicAbuse: new FormControl(this.caseBook.Abuse.NumberOfYearsOfEconomicAbuse == undefined ? null : this.caseBook.Abuse.NumberOfYearsOfEconomicAbuse.toString(), [Validators.maxLength(2), this.validationService.validateNumber, Validators.required]),

            ReasonsForAbuseLookupId: new FormControl(this.caseBook.Abuse.ReasonsForAbuseLookupId == undefined ? null : this.caseBook.Abuse.ReasonsForAbuseLookupId.toString(), Validators.required),
            ReasonForAbuseDesc: new FormControl(this.caseBook.Abuse.ReasonForAbuseDesc),

            PhysicalAbuseDesc: [this.caseBook.Abuse.PhysicalAbuseDesc],
            EmotionalAbuseDesc: [this.caseBook.Abuse.EmotionalAbuseDesc],
            SexualAbuseDesc: [this.caseBook.Abuse.SexualAbuseDesc],
            EconomicAbuseDesc: [this.caseBook.Abuse.EconomicAbuseDesc],

            //End of Abuse category 4

            //Case Category 4
            SourceOfCaseLookupId: new FormControl(this.caseBook.Manage.SourceOfCaseLookupId == undefined ? null : this.caseBook.Manage.SourceOfCaseLookupId.toString(), Validators.required),
            SourceOfCaseDesc: new FormControl(this.caseBook.Manage.SourceOfCaseDesc),

            TypesOfCounselingLookupId: new FormControl(this.caseBook.Manage.TypesOfCounselingLookupId == undefined ? null : this.caseBook.Manage.TypesOfCounselingLookupId.toString(), Validators.required),
            TotalNoOfSessionsLookupId: new FormControl(this.caseBook.Manage.TotalNoOfSessionsLookupId == undefined ? null : this.caseBook.Manage.TotalNoOfSessionsLookupId.toString(), [Validators.maxLength(2), this.validationService.validateNumber, Validators.required]),
            TotalHoursSpentLookupId: new FormControl(this.caseBook.Manage.TotalHoursSpentLookupId == undefined ? null : this.caseBook.Manage.TotalHoursSpentLookupId.toString(), [Validators.maxLength(2), this.validationService.validateNumber, Validators.required])
        });
    }

    private loadCategory5Form() {

        this.category5Form = this.fb.group({
            CaseNumber: [this.caseBook.Legal.CaseNumber, Validators.required],
            Court: [this.caseBook.Legal.Court, Validators.required],
            Prayer: [this.caseBook.Legal.Prayer, Validators.required],
            LegalRepresentative: [this.caseBook.Legal.LegalRepresentative, Validators.required],

            LegalConsentFormLookupId: [this.caseBook.Legal.LegalConsentFormLookupId == undefined ? null : this.caseBook.Legal.LegalConsentFormLookupId.toString(), Validators.required],
            LegalActionLookupId: [this.caseBook.Legal.LegalActionLookupId == undefined ? null : this.caseBook.Legal.LegalActionLookupId.toString(), Validators.required],
            OutcomeLookupId: [this.caseBook.Legal.OutcomeLookupId == undefined ? null : this.caseBook.Legal.OutcomeLookupId.toString(), Validators.required],
            DocumentsLookupId: [this.caseBook.Legal.DocumentsLookupId == undefined ? null : this.caseBook.Legal.DocumentsLookupId.toString(), Validators.required]
        });
    }

    public updateCategory2() {

        //Case category 2
        this.caseBook.Case.CaseStausId = this.mainForm.controls['CaseStatusId'].value;
        this.caseBook.Manage.CaseSubject = this.category2Form.controls['CaseSubject'].value;
        this.caseBook.Manage.CaseDescription = this.category2Form.controls['CaseDescription'].value;

        if (this.isUnresolved) {
            this.caseBook.Manage.ResolutionLog = this.unresolvedForm.controls['ResolutionLog'].value;
        }

        if (this.isCloseStatus) {
            this.caseBook.Manage.ReasonForClosureStatus = this.closedForm.controls['ReasonForClosureStatus'].value;
        }
        //End of Case Category 2

        //Household category 2
        this.caseBook.FamilyHouseHold.SoughtHelpYesNoLookupId = this.category2Form.controls['SoughtHelpYesNoLookupId'].value;
        this.caseBook.FamilyHouseHold.SoughtHelpDesc = this.category2Form.controls['SoughtHelpDesc'].value;
        this.caseBook.FamilyHouseHold.SoughtHelpOutPut = this.category2Form.controls['SoughtHelpOutPut'].value;
        //this.caseBook.FamilyHouseHold.PeacemakerAssistanceLookupId = this.mainForm.controls['PeacemakerAssistanceLookupId'].value;
        this.caseBook.FamilyHouseHold.PeacemakerAssistanceDesc = this.category2Form.controls['PeacemakerAssistanceDesc'].value;
        this.caseBook.FamilyHouseHold.PeacemakerFollowupYesNoLookupId = this.category2Form.controls['PeacemakerFollowupYesNoLookupId'].value;
        this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId = this.category2Form.controls['ClientSignedRegistrationFormYesNoLookupId'].value;

        //End of Household category 2

        //Spouse category 2
        this.caseBook.Spouse.PrimaryEmergencyContactName = this.category2Form.controls['PrimaryEmergencyContactName'].value;
        this.caseBook.Spouse.PrimaryEmergencyRelationshipToClientLookupId = this.category2Form.controls['PrimaryEmergencyRelationshipToClientLookupId'].value;
        this.caseBook.Spouse.PrimaryEmergencyContactPhoneNumber = this.category2Form.controls['PrimaryEmergencyContactPhoneNumber'].value;

        //End of Spouse category 2

        //PhysicalHealth category 2
        this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessLookupId = this.category2Form.controls['SufferingFromAnyMajorIllnessLookupId'].value;
        this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessDesc = this.category2Form.controls['SufferingFromAnyMajorIllnessDesc'].value;
        this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessLookupId = this.category2Form.controls['DiagnosedPsychiatricIllnessLookupId'].value;
        this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessDesc = this.category2Form.controls['DiagnosedPsychiatricIllnessDesc'].value;
        //End of PhysicalHealth category 2

        this.casesService
            .updateCaseStatus(this.caseBook).subscribe(data => {
                this.getCaseById();
            }, (error: any) => {
                this.toastr.error("Error while moving case, " + error);
            });

    }

    public updateCategory3() {
        this.caseBook.Case.CaseStausId = this.mainForm.controls['CaseStatusId'].value;

        this.caseBook.Manage.CaseSubject = this.category3Form.controls['CaseSubject'].value;
        this.caseBook.Manage.CaseDescription = this.category3Form.controls['CaseDescription'].value;

        this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId = this.category3Form.controls['ClientSignedRegistrationFormYesNoLookupId'].value;

        if (this.isCloseStatus) {
            this.caseBook.Manage.ReasonForClosureStatus = this.closedForm.controls['ReasonForClosureStatus'].value;
        }

        if (this.isReferred) {
            this.caseBook.Manage.ReferredToWhom = this.referredForm.controls['ReferredToWhom'].value;
        }

        this.casesService
            .updateCaseStatus(this.caseBook).subscribe(data => {
                this.getCaseById();
            }, (error: any) => {
                this.toastr.error("Error while moving case, " + error);
            });
    }

    public updateCategory4() {

        this.caseBook.Case.CaseStausId = this.mainForm.controls['CaseStatusId'].value;
        this.caseBook.Manage.CaseSubject = this.category4Form.controls['CaseSubject'].value;
        this.caseBook.Manage.CaseDescription = this.category4Form.controls['CaseDescription'].value;
        //Household category 4
        this.caseBook.FamilyHouseHold.SoughtHelpYesNoLookupId = this.category4Form.controls['SoughtHelpYesNoLookupId'].value;
        this.caseBook.FamilyHouseHold.SoughtHelpDesc = this.category4Form.controls['SoughtHelpDesc'].value;
        this.caseBook.FamilyHouseHold.SoughtHelpOutPut = this.category4Form.controls['SoughtHelpOutPut'].value;
        this.caseBook.FamilyHouseHold.PeacemakerAssistanceDesc = this.category4Form.controls['PeacemakerAssistanceDesc'].value;
        this.caseBook.FamilyHouseHold.PeacemakerFollowupYesNoLookupId = this.category4Form.controls['PeacemakerFollowupYesNoLookupId'].value;
        this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId = this.category4Form.controls['ClientSignedRegistrationFormYesNoLookupId'].value;
        this.caseBook.FamilyHouseHold.OccupationLookupId = this.category4Form.controls['OccupationLookupId'].value;
        this.caseBook.FamilyHouseHold.OccupationDesc = this.category4Form.controls['OccupationDesc'].value;
        this.caseBook.FamilyHouseHold.YearsOfMarriage = this.category4Form.controls['YearsOfMarriage'].value;
        this.caseBook.FamilyHouseHold.HouseHoldIncomeLookupId = this.category4Form.controls['HouseHoldIncomeLookupId'].value;

        //End of Household category 4

        this.caseBook.Spouse.PrimaryEmergencyContactName = this.category4Form.controls['PrimaryEmergencyContactName'].value;
        this.caseBook.Spouse.PrimaryEmergencyRelationshipToClientLookupId = this.category4Form.controls['PrimaryEmergencyRelationshipToClientLookupId'].value;
        this.caseBook.Spouse.PrimaryEmergencyContactPhoneNumber = this.category4Form.controls['PrimaryEmergencyContactPhoneNumber'].value;

        //PhysicalHealth category 4
        this.caseBook.PhysicalHealth.AnyMedicationLookupId = this.category4Form.controls['AnyMedicationLookupId'].value;
        this.caseBook.PhysicalHealth.AnyMedicationDesc = this.category4Form.controls['AnyMedicationDesc'].value;
        this.caseBook.PhysicalHealth.AnySubstanceLookupId = this.category4Form.controls['AnySubstanceLookupId'].value;
        this.caseBook.PhysicalHealth.AnySubstanceDesc = this.category4Form.controls['AnySubstanceDesc'].value;
        this.caseBook.PhysicalHealth.CurrentlyPregnantLookup = this.category4Form.controls['CurrentlyPregnantLookup'].value;
        this.caseBook.PhysicalHealth.CurrentlyPregnantDesc = this.category4Form.controls['CurrentlyPregnantDesc'].value;
        this.caseBook.PhysicalHealth.ReasonForSeekingHelpDesc = this.category4Form.controls['ReasonForSeekingHelpDesc'].value;
        this.caseBook.PhysicalHealth.WhoIsAbusingYouDesc = this.category4Form.controls['WhoIsAbusingYouDesc'].value;
        //End of PhysicalHealth category 4

        this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessLookupId = this.category4Form.controls['SufferingFromAnyMajorIllnessLookupId'].value;
        this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessDesc = this.category4Form.controls['SufferingFromAnyMajorIllnessDesc'].value;
        this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessLookupId = this.category4Form.controls['DiagnosedPsychiatricIllnessLookupId'].value;
        this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessDesc = this.category4Form.controls['DiagnosedPsychiatricIllnessDesc'].value;

        //Abuse category 4

        this.caseBook.Abuse.SufferingFromAbuseLookupId = this.category4Form.controls['SufferingFromAbuseLookupId'].value;
        this.caseBook.Abuse.SufferingFromAbuseDesc = this.category4Form.controls['SufferingFromAbuseDesc'].value;
        this.caseBook.Abuse.SignsOfPhysicalAbuseLookupId = this.category4Form.controls['SignsOfPhysicalAbuseLookupId'].value;
        this.caseBook.Abuse.SignsOfPhysicalAbuseDesc = this.category4Form.controls['SignsOfPhysicalAbuseDesc'].value;
        this.caseBook.Abuse.FrequencyOfPhyscialAbuseLookupId = this.category4Form.controls['FrequencyOfPhyscialAbuseLookupId'].value;
        this.caseBook.Abuse.NumberOfYearsOfPhyscialAbuse = this.category4Form.controls['NumberOfYearsOfPhyscialAbuse'].value;
        this.caseBook.Abuse.FrequencyOfEconomicAbuseLookupId = this.category4Form.controls['FrequencyOfEconomicAbuseLookupId'].value;
        this.caseBook.Abuse.NumberOfYearsOfEconomicAbuse = this.category4Form.controls['NumberOfYearsOfEconomicAbuse'].value;
        this.caseBook.Abuse.FrequencyOfSexualAbuseLookupId = this.category4Form.controls['FrequencyOfSexualAbuseLookupId'].value;
        this.caseBook.Abuse.NumberOfYearsOfSexualAbuse = this.category4Form.controls['NumberOfYearsOfSexualAbuse'].value;
        this.caseBook.Abuse.FrequencyOfEmotionalAbuseLookupId = this.category4Form.controls['FrequencyOfEmotionalAbuseLookupId'].value;
        this.caseBook.Abuse.NumberOfYearsOfEmotionalAbuse = this.category4Form.controls['NumberOfYearsOfEmotionalAbuse'].value;
        this.caseBook.Abuse.ReasonForAbuseDesc = this.category4Form.controls['ReasonForAbuseDesc'].value;
        this.caseBook.Abuse.PhysicalAbuseDesc = this.category4Form.controls['PhysicalAbuseDesc'].value;
        this.caseBook.Abuse.EmotionalAbuseDesc = this.category4Form.controls['EmotionalAbuseDesc'].value;
        this.caseBook.Abuse.SexualAbuseDesc = this.category4Form.controls['SexualAbuseDesc'].value;
        this.caseBook.Abuse.EconomicAbuseDesc = this.category4Form.controls['EconomicAbuseDesc'].value;

        //End of Abuse category 4

        //Case category 4
        this.caseBook.Manage.SourceOfCaseLookupId = this.category4Form.controls['SourceOfCaseLookupId'].value;
        this.caseBook.Manage.SourceOfCaseDesc = this.category4Form.controls['SourceOfCaseDesc'].value;
        this.caseBook.Manage.TotalNoOfSessionsLookupId = this.category4Form.controls['TotalNoOfSessionsLookupId'].value;
        this.caseBook.Manage.TotalHoursSpentLookupId = this.category4Form.controls['TotalHoursSpentLookupId'].value;

        //End of Case category 4
        this.casesService
            .updateCaseStatus(this.caseBook).subscribe(data => {
                this.getCaseById();
            }, (error: any) => {
                this.toastr.error("Error while moving case, " + error);
            });
    }

    public updateCategory5() {

        this.caseBook.Case.CaseStausId = this.mainForm.controls['CaseStatusId'].value;

        this.caseBook.Legal.CaseId = this.caseBook.Case.CaseId;

        this.caseBook.Legal.CaseNumber = this.category5Form.controls['CaseNumber'].value;
        this.caseBook.Legal.Court = this.category5Form.controls['Court'].value;
        this.caseBook.Legal.Prayer = this.category5Form.controls['Prayer'].value;
        this.caseBook.Legal.LegalRepresentative = this.category5Form.controls['LegalRepresentative'].value;

        this.caseBook.Legal.LegalConsentFormLookupId = this.category5Form.controls['LegalConsentFormLookupId'].value;
        this.caseBook.Legal.LegalActionLookupId = this.category5Form.controls['LegalActionLookupId'].value;

        this.casesService
            .updateCaseStatus(this.caseBook).subscribe(data => {
                this.getCaseById();
            }, (error: any) => {
                this.toastr.error("Error while moving case, " + error);
            });
    }

    public caseStatusOptionList: Array<IOption> = [];
    public yesNoOptionsList: Array<IOption>;
    public peacemakerAssistanceOptionsList: Array<IMultiSelectOption> = [];
    public emergencyRelationshipOptionsList: Array<IOption> = [];
    public occupationOptionsList: Array<IOption> = [];
    public incomeLookupOptionsList: Array<IOption> = [];
    public reasonForSeekingHelpLookupOptionsList: Array<IMultiSelectOption> = [];
    public whoIsAbusingYouLookupOptionsList: Array<IMultiSelectOption> = [];
    public sufferingFromAbuseLookupIdLookupOptionsList: Array<IOption> = [];
    public feelAboutAbuseLookupOptionsList: Array<IMultiSelectOption> = [];
    public farentsFeelAboutAbuseLookupOptionsList: Array<IMultiSelectOption> = [];
    public lawFeelAboutAbuseLookupOptionsList: Array<IMultiSelectOption> = [];
    public signsOfPhysicalAbuseLookupOptionsList: Array<IOption> = [];
    public weaponsUsedLookupOptionsList: Array<IMultiSelectOption> = [];
    public typesOfPhyscialAbuseLookupOptionsList: Array<IMultiSelectOption> = [];
    public frequencyOfPhyscialAbuseLookupOptionsList: Array<IOption> = [];
    public typesOfEmotionalAbuseLookupOptionsList: Array<IMultiSelectOption> = [];
    public frequencyOfEmotionalAbuseLookupOptionsList: Array<IOption> = [];
    public typesOfSexualAbuseLookupOptionsList: Array<IMultiSelectOption> = [];
    public frequencyOfSexualAbuseLookupOptionsList: Array<IOption> = [];
    public typesOfEconomicAbuseLookupOptionsList: Array<IMultiSelectOption> = [];
    public frequencyOfEconomicAbuseLookupOptionsList: Array<IOption> = [];
    public reasonsForAbuseLookupOptionsList: Array<IMultiSelectOption> = [];
    public sourceOfCaseLookupOptionList: Array<IOption> = [];
    public typesOfCounselingLookupOptionList: Array<IMultiSelectOption> = [];
    public outcomeLookupOptionList: Array<IMultiSelectOption> = [];
    public documentsLookupOptionList: Array<IMultiSelectOption> = [];
}