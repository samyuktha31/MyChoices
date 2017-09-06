import { Component, Input, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
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

import { IMyOptions } from 'mydatepicker';

import * as moment from 'moment';

@Component({
    templateUrl: 'cases.detailed.html',
})

export class CasesDetailedComponent extends BaseCaseController implements OnInit {
    public caseBook: CaseBook;
    private selectedCaseId: number;

    public casePrimaryForm: FormGroup;
    public caseAddressForm: FormGroup;
    public caseChildrenForm: FormGroup;
    public clientAndHouseholdForm: FormGroup;
    public spouseForm: FormGroup;
    public physicalHealthForm: FormGroup;
    public caseOffenderForm: FormGroup;
    public caseAbuseForm: FormGroup;
    public caseManageForm: FormGroup;
    public caseMentalForm: FormGroup;
    public caseSessionForm: FormGroup;
    public caseFeedbackForm: FormGroup;
    public caseLegalForm: FormGroup;

    public router: Router;
    public isPrimaryDataLoaded: boolean = false;
    public isHouseHoldDataLoaded: boolean = false;
    public isSpouseDataLoaded: boolean = false;
    public isPhysicalHealthDataLoaded: boolean = false;
    public isAbuseDataLoaded: boolean = false;
    public isManageDataLoaded: boolean = false;
    public isMentalDataLoaded: boolean = false;
    public isFeedbackDataLoaded: boolean = false;
    public isLegalDataLoaded: boolean = false;
    public isCaseBookDataLoaded: boolean = false;

    public childrenDeceasedLookupOptionsList: Array<IMultiSelectOption> = [];
    public incomeLookupOptionsList: Array<IOption> = [];
    public yesNoOptionsList: Array<IOption> = [];

    public peacemakerAssistanceOptionsList: Array<IMultiSelectOption> = [];
    public religionOptionsList: Array<IOption> = [];
    public levelOfEducationOptionsList: Array<IOption> = [];
    public vocationalSkillsOptionsList: Array<IOption> = [];
    public occupationOptionsList: Array<IOption> = [];
    public householdMembersOptionsList: Array<IMultiSelectOption> = [];

    public spouseEducationLookupIdLookupOptionsList: Array<IOption> = [];
    public spouseStateOptionsList: Array<IOption> = [];
    public spouseCityOptionsList: Array<IOption> = [];
    public emergencyRelationshipOptionsList: Array<IOption> = [];

    public sleepPerNightLookupOptionsList: Array<IOption> = [];
    public appetiteLookupOptionsList: Array<IOption> = [];
    public exerciseLookupOptionsList: Array<IOption> = [];
    public reasonForSeekingHelpLookupOptionsList: Array<IMultiSelectOption> = [];
    public whoIsAbusingYouLookupOptionsList: Array<IMultiSelectOption> = [];

    constructor(public fb: FormBuilder,
        public casesService: CasesService,
        public commonService: CommonService,
        public chartsService: ChartsService,
        public routerObj: Router,
        public toastr: ToastsManager,
        public vRef: ViewContainerRef,
        public activatedRoute: ActivatedRoute,
        public validationService: ValidationService) {
        super(casesService, commonService, chartsService);

        this.isPrimaryDataLoaded = false;

        this.router = routerObj;
        this.toastr.setRootViewContainerRef(vRef);

        this.observerDataSubject.subscribe(data => {
            switch (data) {
                case "CaseStatuses":
                    var localStatusesOptionList = new Array<IOption>();
                    for (var i = 0; i < this.caseStatusesList.length; i++) {
                        localStatusesOptionList.push({
                            value: this.caseStatusesList[i].CaseStatusId.toString(),
                            label: this.caseStatusesList[i].Title
                        });
                    }
                    this.caseStatusOptionList = localStatusesOptionList;
                    break;
                case "Centers":
                    var localCenterOptionList = new Array<IOption>();
                    for (var i = 0; i < this.centersList.length; i++) {
                        localCenterOptionList.push({
                            value: this.centersList[i].CenterId.toString(),
                            label: this.centersList[i].Title
                        });
                    }
                    this.centerOptionList = localCenterOptionList;

                    if (this.centersList.length > 0 && this.centerOptionList.length > 0 && this.counselorOptionsList.length > 0) {
                        this.isPrimaryDataLoaded = true;
                    }
                    break;
                case "States":
                    var localStatesOptionList = new Array<IOption>();
                    for (var i = 0; i < this.statesList.length; i++) {
                        localStatesOptionList.push({
                            value: this.statesList[i].StateId.toString(),
                            label: this.statesList[i].Title
                        });
                    }
                    this.stateOptionsList = localStatesOptionList;

                    this.spouseStateOptionsList = localStatesOptionList;
                    break;
                case "Lookups":

                    this.genderLookupOptionsList = this.ParseLookups("Gender");
                    this.maritalStatusLookupOptionsList = this.ParseLookups("MaritalStatus");
                    this.requireAssistanceLookupOptionsList = this.ParseLookups("RequiredAssistance");
                    this.relationshipWithAbuserLookupOptionsList = this.ParseLookups("RelationshipWithAbuser");

                    this.childrenDeceasedLookupOptionsList = this.ParseMultiLookups("ChildrenDeceased");
                    this.incomeLookupOptionsList = this.ParseLookups("Income");
                    this.yesNoOptionsList = this.ParseLookups("YesNo");
                    this.peacemakerAssistanceOptionsList = this.ParseMultiLookups("PeacemakerAssistance");
                    this.religionOptionsList = this.ParseLookups("Religion");
                    this.levelOfEducationOptionsList = this.ParseLookups("LevelOfEducation");
                    this.vocationalSkillsOptionsList = this.ParseLookups("VocationalSkills");
                    this.occupationOptionsList = this.ParseLookups("Occupation");
                    this.householdMembersOptionsList = this.ParseMultiLookups("HouseholdMembers");
                    this.isHouseHoldDataLoaded = true;

                    this.spouseEducationLookupIdLookupOptionsList = this.ParseLookups("LevelOfEducation");
                    this.emergencyRelationshipOptionsList = this.ParseLookups("RelationshipWithClient");
                    this.isSpouseDataLoaded = true;

                    this.sleepPerNightLookupOptionsList = this.ParseLookups("SleepPerNight");
                    this.appetiteLookupOptionsList = this.ParseLookups("Appetite");
                    this.exerciseLookupOptionsList = this.ParseLookups("Exercise");
                    this.reasonForSeekingHelpLookupOptionsList = this.ParseMultiLookups("ReasonForSeekingHelp");
                    this.whoIsAbusingYouLookupOptionsList = this.ParseMultiLookups("AbusingPerson");
                    this.isPhysicalHealthDataLoaded = true;

                    this.sufferingFromAbuseLookupIdLookupOptionsList = this.ParseLookups("YesNo");

                    this.feelAboutAbuseLookupOptionsList = this.ParseMultiLookups("AbusingFeel");
                    this.farentsFeelAboutAbuseLookupOptionsList = this.ParseMultiLookups("AbusingParentsFeel");
                    this.lawFeelAboutAbuseLookupOptionsList = this.ParseMultiLookups("AbusingParentsFeel");

                    this.signsOfPhysicalAbuseLookupOptionsList = this.ParseLookups("YesNo");
                    this.weaponsUsedLookupOptionsList = this.ParseMultiLookups("AbusingWeapons");

                    this.typesOfPhyscialAbuseLookupOptionsList = this.ParseMultiLookups("TypesOfPhysicalAbuse");
                    this.frequencyOfPhyscialAbuseLookupOptionsList = this.ParseLookups("FrequencyOfAbuse");

                    this.typesOfEmotionalAbuseLookupOptionsList = this.ParseMultiLookups("TypesOfEmotionalAbuse");
                    this.frequencyOfEmotionalAbuseLookupOptionsList = this.ParseLookups("FrequencyOfAbuse");

                    this.typesOfSexualAbuseLookupOptionsList = this.ParseMultiLookups("TypesOfSexualAbuse");
                    this.frequencyOfSexualAbuseLookupOptionsList = this.ParseLookups("FrequencyOfAbuse");

                    this.typesOfEconomicAbuseLookupOptionsList = this.ParseMultiLookups("TypesOfEconomicalAbuse");
                    this.frequencyOfEconomicAbuseLookupOptionsList = this.ParseLookups("FrequencyOfAbuse");

                    this.reasonsForAbuseLookupOptionsList = this.ParseMultiLookups("ReasonForAbuse");

                    this.isAbuseDataLoaded = true;

                    this.sourceOfCaseLookupOptionList = this.ParseLookups("SourceOfCase");
                    this.typesOfCounselingLookupOptionList = this.ParseMultiLookups("TypesOfCounselling");
                    this.typesOfCounselingLookupOptionList_S = this.ParseLookups("TypesOfCounselling");
                    this.relationshipWithPMLookupOptionList = this.ParseLookups("RelationshipWithPM");
                    this.relationshipWithVictimLookupOptionsList = this.ParseLookups("AbusingPerson");
                    this.isManageDataLoaded = true;

                    this.MentalDressLookupOptionList = this.ParseMultiLookups("MentalDress");
                    this.MentalHygieneLookupOptionList = this.ParseMultiLookups("MentalHygiene");
                    this.MentalBodyTypeLookupOptionList = this.ParseMultiLookups("MentalBodyType");
                    this.MentalExpressionLookupOptionList = this.ParseMultiLookups("MentalExpression");
                    this.MentalMotorActivityLookupOptionList = this.ParseMultiLookups("MentalMotorActivity");
                    this.MentalVocabularyLookupOptionList = this.ParseMultiLookups("MentalVocabulary");
                    this.MentalImpulseControlLookupOptionList = this.ParseMultiLookups("MentalImpulseControl");
                    this.MentalSpeechLookupOptionList = this.ParseMultiLookups("MentalSpeech");
                    this.MentalBehaviourLookupOptionList = this.ParseMultiLookups("MentalBehaviour");
                    this.MentalContentLookupOptionList = this.ParseMultiLookups("MentalContent");
                    this.MentalFlowOfThoughtLookupOptionList = this.ParseMultiLookups("MentalFlowOfThought");
                    this.MentalOrientationLookupOptionList = this.ParseMultiLookups("MentalOrientation");
                    this.MentalEstimatedIntellectLookupOptionList = this.ParseMultiLookups("MentalEstimatedIntellect");
                    this.MentalAttentionLookupOptionList = this.ParseMultiLookups("MentalAttention");
                    this.MentalInsightLookupOptionList = this.ParseMultiLookups("MentalInsight");
                    this.MentalJudgementLookupOptionList = this.ParseMultiLookups("MentalJudgement");
                    this.MentalMemoryLookupOptionList = this.ParseMultiLookups("MentalMemory");
                    this.MentalInformationLookupOptionList = this.ParseMultiLookups("MentalInformation");
                    this.MentalAbstractionLookupOptionList = this.ParseMultiLookups("MentalAbstraction");
                    this.isMentalDataLoaded = true;

                    this.RespectedDuringYourVisitLookupOptionList = this.ParseLookups("RespectedDuringYourVisit");
                    this.FeelSafeAndSecureLookupOptionList = this.ParseLookups("YesNo");
                    this.FeelThatCounsellingLookupOptionList = this.ParseLookups("FeelThatCounselling");
                    this.AssistanceOfPeacemakerLookupOptionList = this.ParseLookups("AssistanceOfPeacemaker");
                    this.RecommendFreeCounsellingLookupOptionList = this.ParseLookups("RecommendFreeCounselling");
                    this.AbleToImproveLookupOptionList = this.ParseLookups("AbleToImprove");
                    this.OPMTeamToFollowupLookupOptionList = this.ParseLookups("YesNo");
                    this.isFeedbackDataLoaded = true;
                    
                    this.outcomeLookupOptionList = this.ParseMultiLookups("Outcome");
                    this.documentsLookupOptionList = this.ParseMultiLookups("Documents");

                    this.isLegalDataLoaded = true;

                    break;
                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.selectedCaseId = params['id'];


            this.casesService
                .GetCaseById(this.selectedCaseId)
                .subscribe(data => {
                    this.caseBook = data;

                    this.isCaseBookDataLoaded = true;

                    console.log(this.caseBook);

                    this.onCenterSelected(null);

                    if (this.centersList.length > 0 && this.centerOptionList.length > 0 && this.counselorOptionsList.length > 0) {
                        this.isPrimaryDataLoaded = true;
                    }
                    this.loadPrimayCaseTab();
                    this.loadHouseHoldFormGroup();
                    this.loadSpouseFormGroup();
                    this.loadPhysicalHealthFromGroup();
                    this.loadAbuseFromGroup();
                    this.loadManageFromGroup();
                    this.loadLegalFromGroup();
                });
        });
    }

    private onCenterSelected(center: any) {
        if (this.caseBook.Case.CenterId == null || this.caseBook.Case.CenterId <= 0) {
            this.peaceMakerOptionsList = new Array<IOption>();
            this.counselorOptionsList = new Array<IOption>();
            return;
        }

        //Peace Maker
        var localPeaceMakerOptionsList = new Array<IOption>();
        for (var i = 0; i < this.peaceMakersList.length; i++) {
            if (this.peaceMakersList[i].CenterId == this.caseBook.Case.CenterId) {
                localPeaceMakerOptionsList.push({
                    value: this.peaceMakersList[i].PeaceMakerId.toString(),
                    label: this.peaceMakersList[i].FirstName + ' ' + this.peaceMakersList[i].LastName
                });
            }
        }
        this.peaceMakerOptionsList = localPeaceMakerOptionsList;

        //Counselor
        var localCounselorOptionsList = new Array<IOption>();
        for (var i = 0; i < this.counselorsList.length; i++) {
            if (this.counselorsList[i].CenterId == this.caseBook.Case.CenterId || this.counselorsList[i].IsGlobal) {
                localCounselorOptionsList.push({
                    value: this.counselorsList[i].CounselorId.toString(),
                    label: this.counselorsList[i].FirstName + ' ' + this.counselorsList[i].LastName
                });
            }
        }
        this.counselorOptionsList = localCounselorOptionsList;
    }

    private getCaseById(updateMessage = "") {        
        var url = '/cases/redirect/' + this.selectedCaseId;        
        this.router.navigate([url]).then(() => {
            if (updateMessage.length > 0)
                this.toastr.success(updateMessage);
            else
                this.toastr.success('Updated successfully');
        });
    }

    /* Primary Info */
    public caseStatusOptionList: Array<IOption> = [];
    public centerOptionList: Array<IOption> = [];
    public peaceMakerOptionsList: Array<IOption> = [];
    public counselorOptionsList: Array<IOption> = [];
    public stateOptionsList: Array<IOption> = [];
    public cityOptionsList: Array<IOption> = [];

    public genderLookupOptionsList: Array<IOption> = [];
    public maritalStatusLookupOptionsList: Array<IOption> = [];
    public requireAssistanceLookupOptionsList: Array<IOption> = [];

    private loadPrimayCaseTab() {        
        this.casePrimaryForm = this.fb.group({
            CenterId: [this.caseBook.Case.CenterId.toString(), Validators.required],
            PeaceMakerId: [this.caseBook.Case.PeaceMakerId.toString(), Validators.required],
            CounselorId: [this.caseBook.Case.CounselorId.toString(), Validators.required],

            ClientFirstName: [this.caseBook.Case.ClientFirstName, Validators.required],
            ClientLastName: [this.caseBook.Case.ClientLastName, Validators.required],
            FatherName: [this.caseBook.Case.FatherName, Validators.required],
            Mi: [this.caseBook.Case.Mi],
            GenderLookupId: [this.caseBook.Case.GenderLookupId.toString(), Validators.required],

            MaritalStatusLookupId: [this.caseBook.Case.MaritalStatusLookupId.toString(), Validators.required],
            RequireAssistanceLookupId: [this.caseBook.Case.RequireAssistanceLookupId.toString(), Validators.required],
            Remarks: [this.caseBook.Case.Remarks],
            MobileNumber: [this.caseBook.Case.MobileNumber, [Validators.required, Validators.minLength(10), this.validationService.mobileValidator]],            
        });
    }

    private setDate(): void {
        // Set today date using the setValue function
        //let date = new Date();
        //this.casePrimaryForm.setValue({
        //    myDate: {
        //        date: {
        //            year: date.getFullYear(),
        //            month: date.getMonth() + 1,
        //            day: date.getDate()
        //        }
        //    }
        //});
    }

    private clearDate(): void {
        // Clear the date using the setValue function
        // this.casePrimaryForm.setValue({ myDate: '' });
    }

    public onPrimayUpdate()  {
        var caseBookNew = new CaseBook();
        caseBookNew.Case = new Case();
        caseBookNew.Case.CaseId = this.caseBook.Case.CaseId;
        caseBookNew.Case.CenterId = this.casePrimaryForm.controls['CenterId'].value;
        caseBookNew.Case.PeaceMakerId = this.casePrimaryForm.controls['PeaceMakerId'].value;
        caseBookNew.Case.CounselorId = this.casePrimaryForm.controls['CounselorId'].value;
        caseBookNew.Case.ClientFirstName = this.casePrimaryForm.controls['ClientFirstName'].value;
        caseBookNew.Case.ClientLastName = this.casePrimaryForm.controls['ClientLastName'].value;
        caseBookNew.Case.FatherName = this.casePrimaryForm.controls['FatherName'].value;
        caseBookNew.Case.Mi = this.casePrimaryForm.controls['Mi'].value;
        caseBookNew.Case.GenderLookupId = this.casePrimaryForm.controls['GenderLookupId'].value;
        caseBookNew.Case.MaritalStatusLookupId = this.casePrimaryForm.controls['MaritalStatusLookupId'].value;
        caseBookNew.Case.Remarks = this.casePrimaryForm.controls['Remarks'].value;
        caseBookNew.Case.MobileNumber = this.casePrimaryForm.controls['MobileNumber'].value;

        this.casesService
            .updatePrimaryInfo(caseBookNew).subscribe(data => {
                this.toastr.success('Primary Info Updated Successfully');
            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }

    /* End of --- Primary Info */

    /* Start - Addresses */

    private onStateSelected(state: any) {
        if (state == undefined || state.value == undefined) {
            this.cityOptionsList = new Array<IOption>();
            return;
        }

        //Cities
        var localCityOptionsList = new Array<IOption>();
        for (var i = 0; i < this.statesList.length; i++) {
            if (this.statesList[i].StateId == state.value) {
                for (var j = 0; j < this.statesList[i].Cities.length; j++) {
                    localCityOptionsList.push({
                        value: this.statesList[i].Cities[j].CityId.toString(),
                        label: this.statesList[i].Cities[j].Title
                    });
                }
            }
        }
        this.cityOptionsList = localCityOptionsList;
    }

    @ViewChild('addressModal') public addressModal: ModalDirective;

    public addNewAddress() {
        this.caseBook.SelectedAddress = new CaseAddress();
        this.caseBook.SelectedAddress.CaseId = this.caseBook.Case.CaseId;

        this.caseAddressForm = this.fb.group({
            Address: [this.caseBook.SelectedAddress.Address, Validators.required],
            Area: [this.caseBook.SelectedAddress.Area, Validators.required],
            PIN: [this.caseBook.SelectedAddress.PIN, [Validators.required, Validators.minLength(6), this.validationService.numericValidator]],
            StateId: [this.caseBook.SelectedAddress.StateId == undefined ? null : this.caseBook.SelectedAddress.StateId.toString(), Validators.required],
            CityId: [this.caseBook.SelectedAddress.CityId == undefined ? null : this.caseBook.SelectedAddress.CityId.toString(), Validators.required]
        });
        this.addressModal.show();
    }

    public editAddress(address: vCaseAddress) {
        this.caseBook.SelectedAddress = new CaseAddress();
        this.caseBook.SelectedAddress.CaseAddressId = address.CaseAddressId;
        this.caseBook.SelectedAddress.CaseId = address.CaseId;
        this.caseBook.SelectedAddress.Address = address.Address;
        this.caseBook.SelectedAddress.Area = address.Area;
        this.caseBook.SelectedAddress.CityId = address.CityId;
        this.caseBook.SelectedAddress.StateId = address.StateId;
        this.caseBook.SelectedAddress.PIN = address.PIN;
        this.caseBook.SelectedAddress.CreatedBy = address.CreatedBy;
        this.caseBook.SelectedAddress.CreatedDateTime = address.CreatedDateTime;
        this.caseBook.SelectedAddress.ModifiedBy = address.ModifiedBy;
        this.caseBook.SelectedAddress.ModifiedDatetime = address.ModifiedDatetime;

        this.onStateSelected({ value: address.StateId });

        console.log({ value: address.StateId });
        this.caseAddressForm = this.fb.group({
            Address: [this.caseBook.SelectedAddress.Address, Validators.required],
            Area: [this.caseBook.SelectedAddress.Area, Validators.required],
            PIN: [this.caseBook.SelectedAddress.PIN, [Validators.required, Validators.minLength(6), this.validationService.numericValidator]],
            StateId: [this.caseBook.SelectedAddress.StateId.toString(), Validators.required],
            CityId: [this.caseBook.SelectedAddress.CityId.toString(), Validators.required]
        });
        this.addressModal.show();
    }

    public hideAddressModal(): void {
        this.addressModal.hide();
    }

    public saveAddress(address: vCaseAddress) {
        this.caseBook.SelectedAddress.Address = this.caseAddressForm.controls['Address'].value;
        this.caseBook.SelectedAddress.Area = this.caseAddressForm.controls['Area'].value;
        this.caseBook.SelectedAddress.CityId = this.caseAddressForm.controls['CityId'].value;
        this.caseBook.SelectedAddress.StateId = this.caseAddressForm.controls['StateId'].value;
        this.caseBook.SelectedAddress.PIN = this.caseAddressForm.controls['PIN'].value;

        this.casesService
            .updateAddress(this.caseBook).subscribe(data => {
                this.addressModal.hide();
                this.getCaseById();
            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }
    /* End of - Addresses */

    /* Start - Children */
    public relationshipWithAbuserLookupOptionsList: Array<IOption> = [];
    @ViewChild('childrenModal') public childrenModal: ModalDirective;

    public addNewChild() {        
        this.caseBook.SelectedChildren = new CaseChildren();        
        this.caseBook.SelectedChildren.CaseId = this.caseBook.Case.CaseId;
        console.log(this.caseBook.SelectedChildren);
        
        this.caseChildrenForm = this.fb.group({
            Name: [this.caseBook.SelectedChildren.Name, Validators.required],
            Age: [this.caseBook.SelectedChildren.Age, [Validators.required, this.validationService.validateNumber]],
            GenderLookupId: [this.caseBook.SelectedChildren.GenderLookupId == undefined ? null : this.caseBook.SelectedChildren.GenderLookupId.toString(), Validators.required],
            RelationshipWithAbuserLookupId: [this.caseBook.SelectedChildren.RelationshipWithAbuserLookupId == undefined ? null : this.caseBook.SelectedChildren.RelationshipWithAbuserLookupId.toString(), Validators.required]
        });
        this.childrenModal.show();
    }

    public editChild(children: vCaseChildren) {        
        this.caseBook.SelectedChildren = new CaseChildren();
        this.caseBook.SelectedChildren.CaseChildrenId = children.CaseChildrenId;
        this.caseBook.SelectedChildren.CaseId = children.CaseId;
        this.caseBook.SelectedChildren.Name = children.Name;
        this.caseBook.SelectedChildren.Age = children.Age;
        this.caseBook.SelectedChildren.GenderLookupId = children.GenderLookupId;
        this.caseBook.SelectedChildren.RelationshipWithAbuserLookupId = children.RelationshipWithAbuserLookupId;

        this.caseBook.SelectedChildren.CreatedBy = children.CreatedBy;
        this.caseBook.SelectedChildren.CreatedDateTime = children.CreatedDateTime;
        this.caseBook.SelectedChildren.ModifiedBy = children.ModifiedBy;
        this.caseBook.SelectedChildren.ModifiedDatetime = children.ModifiedDatetime;

        this.caseChildrenForm = this.fb.group({
            Name: [this.caseBook.SelectedChildren.Name, Validators.required],
            Age: [this.caseBook.SelectedChildren.Age, [Validators.required, this.validationService.validateNumber]],
            GenderLookupId: [this.caseBook.SelectedChildren.GenderLookupId.toString(), Validators.required],
            RelationshipWithAbuserLookupId: [this.caseBook.SelectedChildren.RelationshipWithAbuserLookupId.toString(), Validators.required]
        });
        this.childrenModal.show();
    }

    public hideChildrenModal(): void {
        this.childrenModal.hide();
    }

    public saveChildren(address: vCaseChildren) {
        this.caseBook.SelectedChildren.Name = this.caseChildrenForm.controls['Name'].value;
        this.caseBook.SelectedChildren.Age = this.caseChildrenForm.controls['Age'].value;
        this.caseBook.SelectedChildren.GenderLookupId = this.caseChildrenForm.controls['GenderLookupId'].value;
        this.caseBook.SelectedChildren.RelationshipWithAbuserLookupId = this.caseChildrenForm.controls['RelationshipWithAbuserLookupId'].value;

        this.casesService
            .updateChildren(this.caseBook).subscribe(data => {                
                this.childrenModal.hide();
                this.caseBook.vChildren.push(data);
                this.toastr.success('Children updated successfully');                
            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }
    /* End of - Children */

    /* Start - client And Household */

    public onUpdateHouseHoldInfo() {        
        //this.caseBook.FamilyHouseHold.ChildrenDeceasedLookupId = this.clientAndHouseholdForm.controls['ChildrenDeceasedLookupId'].value;
        this.caseBook.FamilyHouseHold.HouseHoldIncomeLookupId = this.clientAndHouseholdForm.controls['HouseHoldIncomeLookupId'].value;
        this.caseBook.FamilyHouseHold.SoughtHelpYesNoLookupId = this.clientAndHouseholdForm.controls['SoughtHelpYesNoLookupId'].value;
        this.caseBook.FamilyHouseHold.SoughtHelpDesc = this.clientAndHouseholdForm.controls['SoughtHelpDesc'].value;
        this.caseBook.FamilyHouseHold.SoughtHelpOutPut = this.clientAndHouseholdForm.controls['SoughtHelpOutPut'].value;

        //this.caseBook.FamilyHouseHold.PeacemakerAssistanceLookupId = this.clientAndHouseholdForm.controls['PeacemakerAssistanceLookupId'].value;
        this.caseBook.FamilyHouseHold.PeacemakerAssistanceDesc = this.clientAndHouseholdForm.controls['PeacemakerAssistanceDesc'].value;
        this.caseBook.FamilyHouseHold.PeacemakerFollowupYesNoLookupId = this.clientAndHouseholdForm.controls['PeacemakerFollowupYesNoLookupId'].value;
        this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId = this.clientAndHouseholdForm.controls['ClientSignedRegistrationFormYesNoLookupId'].value;

        this.caseBook.FamilyHouseHold.ClientEmailId = this.clientAndHouseholdForm.controls['ClientEmailId'].value;
        this.caseBook.FamilyHouseHold.ReligionLookupId = this.clientAndHouseholdForm.controls['ReligionLookupId'].value;
        this.caseBook.FamilyHouseHold.LevelOfEducationLookupId = this.clientAndHouseholdForm.controls['LevelOfEducationLookupId'].value;
        this.caseBook.FamilyHouseHold.VocationalSkillsLookupId = this.clientAndHouseholdForm.controls['VocationalSkillsLookupId'].value;
        this.caseBook.FamilyHouseHold.VocationalSkillsDesc = this.clientAndHouseholdForm.controls['VocationalSkillsDesc'].value;

        this.caseBook.FamilyHouseHold.OccupationLookupId = this.clientAndHouseholdForm.controls['OccupationLookupId'].value;
        this.caseBook.FamilyHouseHold.OccupationDesc = this.clientAndHouseholdForm.controls['OccupationDesc'].value;
        this.caseBook.FamilyHouseHold.ClientIncomeLookupId = this.clientAndHouseholdForm.controls['ClientIncomeLookupId'].value;

        //this.caseBook.FamilyHouseHold.HouseHoldMembersLivingLookupId = this.clientAndHouseholdForm.controls['HouseHoldMembersLivingLookupId'].value;
        this.caseBook.FamilyHouseHold.YearOfMarriage = this.clientAndHouseholdForm.controls['YearOfMarriage'].value;
        this.caseBook.FamilyHouseHold.ClientAgeAtFirstChild = this.clientAndHouseholdForm.controls['ClientAgeAtFirstChild'].value;

        this.casesService
            .updateHouseHold(this.caseBook).subscribe(data => {
                this.childrenModal.hide();
                //this.getCaseById('Household information updated successfully');
                this.toastr.success('Household information updated successfully');
            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }

    private loadHouseHoldFormGroup() {
        this.clientAndHouseholdForm = this.fb.group({
            ChildrenDeceasedLookupId: [this.caseBook.FamilyHouseHold.ChildrenDeceasedLookupId == undefined ? null : this.caseBook.FamilyHouseHold.ChildrenDeceasedLookupId.toString()],
            HouseHoldIncomeLookupId: [this.caseBook.FamilyHouseHold.HouseHoldIncomeLookupId == undefined ? null : this.caseBook.FamilyHouseHold.HouseHoldIncomeLookupId.toString()],
            SoughtHelpYesNoLookupId: [this.caseBook.FamilyHouseHold.SoughtHelpYesNoLookupId == undefined ? null : this.caseBook.FamilyHouseHold.SoughtHelpYesNoLookupId.toString()],
            SoughtHelpDesc: [this.caseBook.FamilyHouseHold.SoughtHelpDesc],
            SoughtHelpOutPut: [this.caseBook.FamilyHouseHold.SoughtHelpOutPut],
            PeacemakerAssistanceLookupId: [this.caseBook.FamilyHouseHold.PeacemakerAssistanceLookupId == undefined ? null : this.caseBook.FamilyHouseHold.PeacemakerAssistanceLookupId.toString()],
            PeacemakerAssistanceDesc: [this.caseBook.FamilyHouseHold.PeacemakerAssistanceDesc],
            PeacemakerFollowupYesNoLookupId: [this.caseBook.FamilyHouseHold.PeacemakerFollowupYesNoLookupId == undefined ? null : this.caseBook.FamilyHouseHold.PeacemakerFollowupYesNoLookupId.toString()],
            ClientSignedRegistrationFormYesNoLookupId: [this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId == undefined ? null : this.caseBook.FamilyHouseHold.ClientSignedRegistrationFormYesNoLookupId.toString()],
            ClientEmailId: [this.caseBook.FamilyHouseHold.ClientEmailId, this.validationService.emailValidator],
            ReligionLookupId: [this.caseBook.FamilyHouseHold.ReligionLookupId == undefined ? null : this.caseBook.FamilyHouseHold.ReligionLookupId.toString()],
            LevelOfEducationLookupId: [this.caseBook.FamilyHouseHold.LevelOfEducationLookupId == undefined ? null : this.caseBook.FamilyHouseHold.LevelOfEducationLookupId.toString()],
            VocationalSkillsLookupId: [this.caseBook.FamilyHouseHold.VocationalSkillsLookupId == undefined ? null : this.caseBook.FamilyHouseHold.VocationalSkillsLookupId.toString()],
            VocationalSkillsDesc: [this.caseBook.FamilyHouseHold.VocationalSkillsDesc],
            OccupationLookupId: [this.caseBook.FamilyHouseHold.OccupationLookupId == undefined ? null : this.caseBook.FamilyHouseHold.OccupationLookupId.toString()],
            OccupationDesc: [this.caseBook.FamilyHouseHold.OccupationDesc],
            ClientIncomeLookupId: [this.caseBook.FamilyHouseHold.ClientIncomeLookupId == undefined ? null : this.caseBook.FamilyHouseHold.ClientIncomeLookupId.toString()],
            HouseHoldMembersLivingLookupId: [this.caseBook.FamilyHouseHold.HouseHoldMembersLivingLookupId == undefined ? null : this.caseBook.FamilyHouseHold.HouseHoldMembersLivingLookupId.toString()],
            YearOfMarriage: [this.caseBook.FamilyHouseHold.YearOfMarriage, this.validationService.validateNumber],
            ClientAgeAtFirstChild: [this.caseBook.FamilyHouseHold.ClientAgeAtFirstChild, [Validators.minLength(2), this.validationService.validateNumber]]
        });
    }
    /* End of - client And Household */

    /* Start - Spouse */
    private onSpouseStateSelected(state: any) {
        if (state == undefined || state.value == undefined) {
            this.spouseCityOptionsList = new Array<IOption>();
            return;
        }

        //Cities
        var localCityOptionsList = new Array<IOption>();
        for (var i = 0; i < this.statesList.length; i++) {
            if (this.statesList[i].StateId == state.value) {
                for (var j = 0; j < this.statesList[i].Cities.length; j++) {
                    localCityOptionsList.push({
                        value: this.statesList[i].Cities[j].CityId.toString(),
                        label: this.statesList[i].Cities[j].Title
                    });
                }
            }
        }
        this.spouseCityOptionsList = localCityOptionsList;
    }

    private loadSpouseFormGroup() {
        this.onSpouseStateSelected({ value: this.caseBook.Spouse.StateLookupId });
        this.spouseForm = this.fb.group({
            SpouseName: [this.caseBook.Spouse.SpouseName],
            SpouseHomePhone: [this.caseBook.Spouse.SpouseHomePhone, [Validators.minLength(10), this.validationService.mobileValidator]],
            SpouseMobilePhone: [this.caseBook.Spouse.SpouseMobilePhone, [Validators.minLength(10), this.validationService.mobileValidator]],
            SpouseOccupation: [this.caseBook.Spouse.SpouseOccupation],
            SpouseEducationLookupId: [this.caseBook.Spouse.SpouseEducationLookupId == undefined ? null : this.caseBook.Spouse.SpouseEducationLookupId.toString()],
            SpouseAddress: [this.caseBook.Spouse.SpouseAddress],
            Area: [this.caseBook.Spouse.Area],
            CityLookupId: [this.caseBook.Spouse.CityLookupId == undefined ? null : this.caseBook.Spouse.CityLookupId.toString()],
            StateLookupId: [this.caseBook.Spouse.StateLookupId == undefined ? null : this.caseBook.Spouse.StateLookupId.toString()],
            PIN: [this.caseBook.Spouse.PIN, [Validators.minLength(6), this.validationService.numericValidator]],

            PrimaryEmergencyContactName: [this.caseBook.Spouse.PrimaryEmergencyContactName],
            PrimaryEmergencyRelationshipToClientLookupId: [this.caseBook.Spouse.PrimaryEmergencyRelationshipToClientLookupId == undefined ? null : this.caseBook.Spouse.PrimaryEmergencyRelationshipToClientLookupId.toString()],
            PrimaryEmergencyContactPhoneNumber: [this.caseBook.Spouse.PrimaryEmergencyContactPhoneNumber, [Validators.minLength(10), this.validationService.mobileValidator]],
            PrimaryEmergencyContactAdress: [this.caseBook.Spouse.PrimaryEmergencyContactAdress],

            SecondaryEmergencyContactName: [this.caseBook.Spouse.SecondaryEmergencyContactName],
            SecondaryEmergencyRelationshipToClientLookupId: [this.caseBook.Spouse.SecondaryEmergencyRelationshipToClientLookupId == undefined ? null : this.caseBook.Spouse.SecondaryEmergencyRelationshipToClientLookupId.toString()],
            SecondaryEmergencyContactPhoneNumber: [this.caseBook.Spouse.SecondaryEmergencyContactPhoneNumber, [Validators.minLength(10), this.validationService.mobileValidator]],
            SecondaryEmergencyContactAdress: [this.caseBook.Spouse.SecondaryEmergencyContactAdress]

        });
    }

    public onUpdateSpouse() {
        this.caseBook.Spouse.SpouseName = this.spouseForm.controls['SpouseName'].value;
        this.caseBook.Spouse.SpouseHomePhone = this.spouseForm.controls['SpouseHomePhone'].value;
        this.caseBook.Spouse.SpouseMobilePhone = this.spouseForm.controls['SpouseMobilePhone'].value;
        this.caseBook.Spouse.SpouseOccupation = this.spouseForm.controls['SpouseOccupation'].value;
        this.caseBook.Spouse.SpouseEducationLookupId = this.spouseForm.controls['SpouseEducationLookupId'].value;

        this.caseBook.Spouse.SpouseAddress = this.spouseForm.controls['SpouseAddress'].value;
        this.caseBook.Spouse.Area = this.spouseForm.controls['Area'].value;
        this.caseBook.Spouse.CityLookupId = this.spouseForm.controls['CityLookupId'].value;
        this.caseBook.Spouse.StateLookupId = this.spouseForm.controls['StateLookupId'].value;
        this.caseBook.Spouse.PIN = this.spouseForm.controls['PIN'].value;

        this.caseBook.Spouse.PrimaryEmergencyContactName = this.spouseForm.controls['PrimaryEmergencyContactName'].value;
        this.caseBook.Spouse.PrimaryEmergencyRelationshipToClientLookupId = this.spouseForm.controls['PrimaryEmergencyRelationshipToClientLookupId'].value;
        this.caseBook.Spouse.PrimaryEmergencyContactPhoneNumber = this.spouseForm.controls['PrimaryEmergencyContactPhoneNumber'].value;
        this.caseBook.Spouse.PrimaryEmergencyContactAdress = this.spouseForm.controls['PrimaryEmergencyContactAdress'].value;

        this.caseBook.Spouse.SecondaryEmergencyContactName = this.spouseForm.controls['SecondaryEmergencyContactName'].value;
        this.caseBook.Spouse.SecondaryEmergencyRelationshipToClientLookupId = this.spouseForm.controls['SecondaryEmergencyRelationshipToClientLookupId'].value;
        this.caseBook.Spouse.SecondaryEmergencyContactPhoneNumber = this.spouseForm.controls['SecondaryEmergencyContactPhoneNumber'].value;
        this.caseBook.Spouse.SecondaryEmergencyContactAdress = this.spouseForm.controls['SecondaryEmergencyContactAdress'].value;        

        this.casesService
            .updateSpouse(this.caseBook).subscribe(data => {                
                this.getCaseById();
                this.toastr.success('Spouse information updated successfully');
            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }

    /* End of - Spouse */

    /* Physical Health */


    private loadPhysicalHealthFromGroup() {
        this.physicalHealthForm = this.fb.group({
            SufferingFromAnyMajorIllnessLookupId: [this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessLookupId == undefined ? null : this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessLookupId.toString()],
            SufferingFromAnyMajorIllnessDesc: [this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessDesc],

            DiagnosedPsychiatricIllnessLookupId: [this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessLookupId == undefined ? null : this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessLookupId.toString()],
            DiagnosedPsychiatricIllnessDesc: [this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessDesc],

            SleepPerNightLookupId: [this.caseBook.PhysicalHealth.SleepPerNightLookupId == undefined ? null : this.caseBook.PhysicalHealth.SleepPerNightLookupId.toString()],
            AppetiteLookupId: [this.caseBook.PhysicalHealth.AppetiteLookupId == undefined ? null : this.caseBook.PhysicalHealth.AppetiteLookupId.toString()],
            ExerciseLookupId: [this.caseBook.PhysicalHealth.ExerciseLookupId == undefined ? null : this.caseBook.PhysicalHealth.ExerciseLookupId.toString()],

            AnyMedicationLookupId: [this.caseBook.PhysicalHealth.AnyMedicationLookupId == undefined ? null : this.caseBook.PhysicalHealth.AnyMedicationLookupId.toString()],
            AnyMedicationDesc: [this.caseBook.PhysicalHealth.AnyMedicationDesc],

            AnySubstanceLookupId: [this.caseBook.PhysicalHealth.AnySubstanceLookupId == undefined ? null : this.caseBook.PhysicalHealth.AnySubstanceLookupId.toString()],
            AnySubstanceDesc: [this.caseBook.PhysicalHealth.AnySubstanceDesc],

            CurrentlyPregnantLookup: [this.caseBook.PhysicalHealth.CurrentlyPregnantLookup == undefined ? null : this.caseBook.PhysicalHealth.CurrentlyPregnantLookup.toString()],
            CurrentlyPregnantDesc: [this.caseBook.PhysicalHealth.CurrentlyPregnantDesc],

            ReasonForSeekingHelpLookupId: [this.caseBook.PhysicalHealth.ReasonForSeekingHelpLookupId == undefined ? null : this.caseBook.PhysicalHealth.ReasonForSeekingHelpLookupId.toString()],
            WhoIsAbusingYouLookupId: [this.caseBook.PhysicalHealth.WhoIsAbusingYouLookupId == undefined ? null : this.caseBook.PhysicalHealth.WhoIsAbusingYouLookupId.toString()],
            WhoIsAbusingYouDesc: [this.caseBook.PhysicalHealth.WhoIsAbusingYouDesc == undefined ? null : this.caseBook.PhysicalHealth.WhoIsAbusingYouDesc.toString()],
            ReasonForSeekingHelpDesc: [this.caseBook.PhysicalHealth.ReasonForSeekingHelpDesc == undefined ? null : this.caseBook.PhysicalHealth.ReasonForSeekingHelpDesc.toString()]
        });
    }

    public onUpdatePhysicalHealth() {        
        this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessLookupId = this.physicalHealthForm.controls['SufferingFromAnyMajorIllnessLookupId'].value;
        this.caseBook.PhysicalHealth.SufferingFromAnyMajorIllnessDesc = this.physicalHealthForm.controls['SufferingFromAnyMajorIllnessDesc'].value;
        this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessLookupId = this.physicalHealthForm.controls['DiagnosedPsychiatricIllnessLookupId'].value;
        this.caseBook.PhysicalHealth.DiagnosedPsychiatricIllnessDesc = this.physicalHealthForm.controls['DiagnosedPsychiatricIllnessDesc'].value;

        this.caseBook.PhysicalHealth.SleepPerNightLookupId = this.physicalHealthForm.controls['SleepPerNightLookupId'].value;
        this.caseBook.PhysicalHealth.AppetiteLookupId = this.physicalHealthForm.controls['AppetiteLookupId'].value;
        this.caseBook.PhysicalHealth.ExerciseLookupId = this.physicalHealthForm.controls['ExerciseLookupId'].value;

        this.caseBook.PhysicalHealth.AnyMedicationLookupId = this.physicalHealthForm.controls['AnyMedicationLookupId'].value;
        this.caseBook.PhysicalHealth.AnyMedicationDesc = this.physicalHealthForm.controls['AnyMedicationDesc'].value;

        this.caseBook.PhysicalHealth.AnySubstanceLookupId = this.physicalHealthForm.controls['AnySubstanceLookupId'].value;
        this.caseBook.PhysicalHealth.AnySubstanceDesc = this.physicalHealthForm.controls['AnySubstanceDesc'].value;

        this.caseBook.PhysicalHealth.CurrentlyPregnantLookup = this.physicalHealthForm.controls['CurrentlyPregnantLookup'].value;
        this.caseBook.PhysicalHealth.CurrentlyPregnantDesc = this.physicalHealthForm.controls['CurrentlyPregnantDesc'].value;

        //this.caseBook.PhysicalHealth.ReasonForSeekingHelpLookupId = this.physicalHealthForm.controls['ReasonForSeekingHelpLookupId'].value;
        //this.caseBook.PhysicalHealth.WhoIsAbusingYouLookupId = this.physicalHealthForm.controls['WhoIsAbusingYouLookupId'].value;
        this.caseBook.PhysicalHealth.WhoIsAbusingYouDesc = this.physicalHealthForm.controls['WhoIsAbusingYouDesc'].value;
        this.caseBook.PhysicalHealth.ReasonForSeekingHelpDesc = this.physicalHealthForm.controls['ReasonForSeekingHelpDesc'].value;

        this.casesService
            .updatePhysicalHealth(this.caseBook).subscribe(data => {                
                this.getCaseById();
                this.toastr.success('Physical updated successfully');
            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }
    /* End of - Physical Health */

    /* Start - Offender */

    @ViewChild('offenderModal') public offenderModal: ModalDirective;

    public addNewOffender() {
        this.caseBook.SelectedOffender = new CaseOffender();
        this.caseBook.SelectedOffender.CaseId = this.caseBook.Case.CaseId;

        this.caseOffenderForm = this.fb.group({
            Name: [this.caseBook.SelectedOffender.Name, Validators.required],
            Age: [this.caseBook.SelectedOffender.Age, [Validators.maxLength(2), this.validationService.validateNumber, Validators.required]],
            GenderLookupId: [this.caseBook.SelectedOffender.GenderLookupId == undefined ? null : this.caseBook.SelectedOffender.GenderLookupId.toString(), Validators.required],
            RelationshipWithVictimLookupId: [this.caseBook.SelectedOffender.RelationshipWithVictimLookupId == undefined ? null : this.caseBook.SelectedOffender.RelationshipWithVictimLookupId.toString(), Validators.required],
            OtherRelationship: [this.caseBook.SelectedOffender.OtherRelationship]
        });
        this.offenderModal.show();
    }

    public editOffender(offender: vCaseOffender) {
        this.caseBook.SelectedOffender = new CaseOffender();
        this.caseBook.SelectedOffender.CaseOffenderId = offender.CaseOffenderId;
        this.caseBook.SelectedOffender.CaseId = offender.CaseId;
        this.caseBook.SelectedOffender.Name = offender.Name;
        this.caseBook.SelectedOffender.Age = offender.Age;
        this.caseBook.SelectedOffender.GenderLookupId = offender.GenderLookupId;
        this.caseBook.SelectedOffender.RelationshipWithVictimLookupId = offender.RelationshipWithVictimLookupId;
        this.caseBook.SelectedOffender.OtherRelationship = offender.OtherRelationship;

        this.caseOffenderForm = this.fb.group({
            Name: [this.caseBook.SelectedOffender.Name, Validators.required],
            Age: [this.caseBook.SelectedOffender.Age, [Validators.maxLength(2), this.validationService.validateNumber, Validators.required]],
            GenderLookupId: [this.caseBook.SelectedOffender.GenderLookupId == undefined ? null : this.caseBook.SelectedOffender.GenderLookupId.toString(), Validators.required],
            RelationshipWithVictimLookupId: [this.caseBook.SelectedOffender.RelationshipWithVictimLookupId == undefined ? null : this.caseBook.SelectedOffender.RelationshipWithVictimLookupId.toString(), Validators.required],
            OtherRelationship: [this.caseBook.SelectedOffender.OtherRelationship, Validators.required]
        });
        this.offenderModal.show();
    }

    public hideOffenderModal(): void {
        this.offenderModal.hide();
    }

    public saveOffender(offender: vCaseOffender) {
        this.caseBook.SelectedOffender.Name = this.caseOffenderForm.controls['Name'].value;
        this.caseBook.SelectedOffender.Age = this.caseOffenderForm.controls['Age'].value;
        this.caseBook.SelectedOffender.GenderLookupId = this.caseOffenderForm.controls['GenderLookupId'].value;
        this.caseBook.SelectedOffender.RelationshipWithVictimLookupId = this.caseOffenderForm.controls['RelationshipWithVictimLookupId'].value;
        this.caseBook.SelectedOffender.OtherRelationship = this.caseOffenderForm.controls['OtherRelationship'].value;

        this.casesService
            .updateOffender(this.caseBook).subscribe(data => {
                this.offenderModal.hide();
                this.caseBook.vOffender.push(data);
                this.toastr.success('Offender updated successfully');

            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }
    /* End of - Offender */

    /* Start - Abuse */
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
    public relationshipWithVictimLookupOptionsList: Array<IOption> = [];
    
    private loadAbuseFromGroup() {
        this.caseAbuseForm = this.fb.group({
            SufferingFromAbuseLookupId: [this.caseBook.Abuse.SufferingFromAbuseLookupId == undefined ? null : this.caseBook.Abuse.SufferingFromAbuseLookupId.toString()],
            SufferingFromAbuseDesc: [this.caseBook.Abuse.SufferingFromAbuseDesc],

            FeelAboutAbuseLookupId: [this.caseBook.Abuse.FeelAboutAbuseLookupId == undefined ? null : this.caseBook.Abuse.FeelAboutAbuseLookupId.toString()],
            ParentsFeelAboutAbuseLookupId: [this.caseBook.Abuse.ParentsFeelAboutAbuseLookupId == undefined ? null : this.caseBook.Abuse.ParentsFeelAboutAbuseLookupId.toString()],
            LawFeelAboutAbuseLookupId: [this.caseBook.Abuse.LawFeelAboutAbuseLookupId == undefined ? null : this.caseBook.Abuse.LawFeelAboutAbuseLookupId.toString()],
            SignsOfPhysicalAbuseLookupId: [this.caseBook.Abuse.SignsOfPhysicalAbuseLookupId == undefined ? null : this.caseBook.Abuse.SignsOfPhysicalAbuseLookupId.toString()],
            SignsOfPhysicalAbuseDesc: [this.caseBook.Abuse.SignsOfPhysicalAbuseDesc],

            WeaponsUsedLookupId: [this.caseBook.Abuse.WeaponsUsedLookupId == undefined ? null : this.caseBook.Abuse.WeaponsUsedLookupId.toString()],
            WeaponsUsedDesc: [this.caseBook.Abuse.WeaponsUsedDesc],

            TypesOfPhyscialAbuseLookupId: [this.caseBook.Abuse.TypesOfPhyscialAbuseLookupId == undefined ? null : this.caseBook.Abuse.TypesOfPhyscialAbuseLookupId.toString()],
            FrequencyOfPhyscialAbuseLookupId: [this.caseBook.Abuse.FrequencyOfPhyscialAbuseLookupId == undefined ? null : this.caseBook.Abuse.FrequencyOfPhyscialAbuseLookupId.toString()],
            NumberOfYearsOfPhyscialAbuse: [this.caseBook.Abuse.NumberOfYearsOfPhyscialAbuse == undefined ? null : this.caseBook.Abuse.NumberOfYearsOfPhyscialAbuse.toString(), [Validators.maxLength(2), this.validationService.validateNumber]],

            TypesOfEmotionalAbuseLookupId: [this.caseBook.Abuse.TypesOfEmotionalAbuseLookupId == undefined ? null : this.caseBook.Abuse.TypesOfEmotionalAbuseLookupId.toString()],
            FrequencyOfEmotionalAbuseLookupId: [this.caseBook.Abuse.FrequencyOfEmotionalAbuseLookupId == undefined ? null : this.caseBook.Abuse.FrequencyOfEmotionalAbuseLookupId.toString()],
            NumberOfYearsOfEmotionalAbuse: [this.caseBook.Abuse.NumberOfYearsOfEmotionalAbuse == undefined ? null : this.caseBook.Abuse.NumberOfYearsOfEmotionalAbuse.toString(), [Validators.maxLength(2), this.validationService.validateNumber]],

            TypesOfSexualAbuseLookupId: [this.caseBook.Abuse.TypesOfSexualAbuseLookupId == undefined ? null : this.caseBook.Abuse.TypesOfSexualAbuseLookupId.toString()],
            FrequencyOfSexualAbuseLookupId: [this.caseBook.Abuse.FrequencyOfSexualAbuseLookupId == undefined ? null : this.caseBook.Abuse.FrequencyOfSexualAbuseLookupId.toString()],
            NumberOfYearsOfSexualAbuse: [this.caseBook.Abuse.NumberOfYearsOfSexualAbuse == undefined ? null : this.caseBook.Abuse.NumberOfYearsOfSexualAbuse.toString(), [Validators.maxLength(2), this.validationService.validateNumber]],

            TypesOfEconomicAbuseLookupId: [this.caseBook.Abuse.TypesOfEconomicAbuseLookupId == undefined ? null : this.caseBook.Abuse.TypesOfEconomicAbuseLookupId.toString()],
            FrequencyOfEconomicAbuseLookupId: [this.caseBook.Abuse.FrequencyOfEconomicAbuseLookupId == undefined ? null : this.caseBook.Abuse.FrequencyOfEconomicAbuseLookupId.toString()],
            NumberOfYearsOfEconomicAbuse: [this.caseBook.Abuse.NumberOfYearsOfEconomicAbuse == undefined ? null : this.caseBook.Abuse.NumberOfYearsOfEconomicAbuse.toString(), [Validators.maxLength(2), this.validationService.validateNumber]],

            ReasonsForAbuseLookupId: [this.caseBook.Abuse.ReasonsForAbuseLookupId == undefined ? null : this.caseBook.Abuse.ReasonsForAbuseLookupId.toString()],
            ReasonForAbuseDesc: [this.caseBook.Abuse.ReasonForAbuseDesc]
        });
    }

    public onUpdateAbuse() {
        this.caseBook.Abuse.SufferingFromAbuseLookupId = this.caseAbuseForm.controls['SufferingFromAbuseLookupId'].value;
        this.caseBook.Abuse.SufferingFromAbuseDesc = this.caseAbuseForm.controls['SufferingFromAbuseDesc'].value;

        //this.caseBook.Abuse.FeelAboutAbuseLookupId = this.caseAbuseForm.controls['FeelAboutAbuseLookupId'].value;
        //this.caseBook.Abuse.ParentsFeelAboutAbuseLookupId = this.caseAbuseForm.controls['ParentsFeelAboutAbuseLookupId'].value;
        //this.caseBook.Abuse.LawFeelAboutAbuseLookupId = this.caseAbuseForm.controls['LawFeelAboutAbuseLookupId'].value;

        this.caseBook.Abuse.SignsOfPhysicalAbuseLookupId = this.caseAbuseForm.controls['SignsOfPhysicalAbuseLookupId'].value;
        this.caseBook.Abuse.SignsOfPhysicalAbuseDesc = this.caseAbuseForm.controls['SignsOfPhysicalAbuseDesc'].value;

        //this.caseBook.Abuse.WeaponsUsedLookupId = this.caseAbuseForm.controls['WeaponsUsedLookupId'].value;
        this.caseBook.Abuse.WeaponsUsedDesc = this.caseAbuseForm.controls['WeaponsUsedDesc'].value;

        //this.caseBook.Abuse.TypesOfPhyscialAbuseLookupId = this.caseAbuseForm.controls['TypesOfPhyscialAbuseLookupId'].value;
        this.caseBook.Abuse.FrequencyOfPhyscialAbuseLookupId = this.caseAbuseForm.controls['FrequencyOfPhyscialAbuseLookupId'].value;
        this.caseBook.Abuse.NumberOfYearsOfPhyscialAbuse = this.caseAbuseForm.controls['NumberOfYearsOfPhyscialAbuse'].value;

        //this.caseBook.Abuse.TypesOfEmotionalAbuseLookupId = this.caseAbuseForm.controls['TypesOfEmotionalAbuseLookupId'].value;
        this.caseBook.Abuse.FrequencyOfEmotionalAbuseLookupId = this.caseAbuseForm.controls['FrequencyOfEmotionalAbuseLookupId'].value;
        this.caseBook.Abuse.NumberOfYearsOfEmotionalAbuse = this.caseAbuseForm.controls['NumberOfYearsOfEmotionalAbuse'].value;

        //this.caseBook.Abuse.TypesOfSexualAbuseLookupId = this.caseAbuseForm.controls['TypesOfSexualAbuseLookupId'].value;
        this.caseBook.Abuse.FrequencyOfSexualAbuseLookupId = this.caseAbuseForm.controls['FrequencyOfSexualAbuseLookupId'].value;
        this.caseBook.Abuse.NumberOfYearsOfSexualAbuse = this.caseAbuseForm.controls['NumberOfYearsOfSexualAbuse'].value;

        //this.caseBook.Abuse.TypesOfEconomicAbuseLookupId = this.caseAbuseForm.controls['TypesOfEconomicAbuseLookupId'].value;
        this.caseBook.Abuse.FrequencyOfEconomicAbuseLookupId = this.caseAbuseForm.controls['FrequencyOfEconomicAbuseLookupId'].value;
        this.caseBook.Abuse.NumberOfYearsOfEconomicAbuse = this.caseAbuseForm.controls['NumberOfYearsOfEconomicAbuse'].value;

        //this.caseBook.Abuse.ReasonsForAbuseLookupId = this.caseAbuseForm.controls['ReasonsForAbuseLookupId'].value;
        this.caseBook.Abuse.ReasonForAbuseDesc = this.caseAbuseForm.controls['ReasonForAbuseDesc'].value;

        this.casesService
            .updateAbuse(this.caseBook).subscribe(data => {
                //this.getCaseById();
                this.toastr.success('Abuse information updated successfully');
            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }

    /* End of - Abuse */

    /* Start - Manage Case */
    public sourceOfCaseLookupOptionList: Array<IOption> = [];
    public typesOfCounselingLookupOptionList: Array<IMultiSelectOption> = [];
    
    public typesOfCounselingLookupOptionList_S: Array<IOption> = [];
    public totalNoOfSessionsLookupOptionList: Array<IOption> = [];
    public totalHoursSpentLookupOptionList: Array<IOption> = [];
    public relationshipWithPMLookupOptionList: Array<IOption> = [];

    private loadManageFromGroup() {
        this.caseManageForm = this.fb.group({

            CaseStatusId: [this.caseBook.Manage.CaseStatusId == undefined ? null : this.caseBook.Manage.CaseStatusId.toString()],
            ReferredToWhom: [this.caseBook.Manage.ReferredToWhom],
            SourceOfCaseLookupId: [this.caseBook.Manage.SourceOfCaseLookupId == undefined ? null : this.caseBook.Manage.SourceOfCaseLookupId.toString()],
            SourceOfCaseDesc: [this.caseBook.Manage.SourceOfCaseDesc],

            TypesOfCounselingLookupId: [this.caseBook.Manage.TypesOfCounselingLookupId == undefined ? null : this.caseBook.Manage.TypesOfCounselingLookupId.toString()],
            TotalNoOfSessionsLookupId: [this.caseBook.Manage.TotalNoOfSessionsLookupId == undefined ? null : this.caseBook.Manage.TotalNoOfSessionsLookupId.toString(), [Validators.maxLength(3), this.validationService.validateNumber, Validators.pattern("^[0-9]*$")]],
            TotalHoursSpentLookupId: [this.caseBook.Manage.TotalHoursSpentLookupId == undefined ? null : this.caseBook.Manage.TotalHoursSpentLookupId.toString(), [Validators.maxLength(5), this.validationService.validateNumber, this.validationService.validateTime]],

            ReasonForClosureStatus: [this.caseBook.Manage.ReasonForClosureStatus],
            CaseSubject: [this.caseBook.Manage.CaseSubject],
            CaseDescription: [this.caseBook.Manage.CaseDescription],

            RelationshipWithPMLookupId: [this.caseBook.Manage.RelationshipWithPMLookupId == undefined ? null : this.caseBook.Manage.RelationshipWithPMLookupId.toString()],
            ResolutionLog: [this.caseBook.Manage.ResolutionLog]
        });
    }

    public onUpdateManage() {
        this.caseBook.Manage.CaseId = this.caseBook.Case.CaseId;
        this.caseBook.Manage.CaseStatusId = this.caseManageForm.controls['CaseStatusId'].value;
        this.caseBook.Manage.ReferredToWhom = this.caseManageForm.controls['ReferredToWhom'].value;
        this.caseBook.Manage.SourceOfCaseLookupId = this.caseManageForm.controls['SourceOfCaseLookupId'].value;
        this.caseBook.Manage.SourceOfCaseDesc = this.caseManageForm.controls['SourceOfCaseDesc'].value;

        //this.caseBook.Manage.TypesOfCounselingLookupId = this.caseManageForm.controls['TypesOfCounselingLookupId'].value;
        this.caseBook.Manage.TotalNoOfSessionsLookupId = this.caseManageForm.controls['TotalNoOfSessionsLookupId'].value;
        this.caseBook.Manage.TotalHoursSpentLookupId = this.caseManageForm.controls['TotalHoursSpentLookupId'].value;

        this.caseBook.Manage.ReasonForClosureStatus = this.caseManageForm.controls['ReasonForClosureStatus'].value;
        this.caseBook.Manage.CaseSubject = this.caseManageForm.controls['CaseSubject'].value;
        this.caseBook.Manage.CaseDescription = this.caseManageForm.controls['CaseDescription'].value;

        this.caseBook.Manage.RelationshipWithPMLookupId = this.caseManageForm.controls['RelationshipWithPMLookupId'].value;
        this.caseBook.Manage.ResolutionLog = this.caseManageForm.controls['ResolutionLog'].value;


        this.casesService
            .updateCase(this.caseBook).subscribe(data => {                
                //this.getCaseById();
                this.caseBook.Manage.CaseManageId = data;
                this.toastr.success('Case info updated successfully');

            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }

    /* End of - Manage Case */

    /* Start - Mental */
    public MentalDressLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalHygieneLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalBodyTypeLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalExpressionLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalMotorActivityLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalVocabularyLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalImpulseControlLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalSpeechLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalBehaviourLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalContentLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalFlowOfThoughtLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalOrientationLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalEstimatedIntellectLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalAttentionLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalInsightLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalJudgementLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalMemoryLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalInformationLookupOptionList: Array<IMultiSelectOption> = [];
    public MentalAbstractionLookupOptionList: Array<IMultiSelectOption> = [];

    @ViewChild('mentalModal') public mentalModal: ModalDirective;

    public addNewMental() {
        this.caseBook.SelectedMental = new CaseMental();
        this.caseBook.SelectedMental.CaseId = this.caseBook.Case.CaseId;

        this.caseMentalForm = this.fb.group({
            MentalAbstractionLookupId: [this.caseBook.SelectedMental.MentalAbstractionLookupId == undefined ? null : this.caseBook.SelectedMental.MentalAbstractionLookupId.toString()],
            MentalAttentionLookupId: [this.caseBook.SelectedMental.MentalAttentionLookupId == undefined ? null : this.caseBook.SelectedMental.MentalAttentionLookupId.toString()],
            MentalBehaviourLookupId: [this.caseBook.SelectedMental.MentalBehaviourLookupId == undefined ? null : this.caseBook.SelectedMental.MentalBehaviourLookupId.toString()],
            MentalBodyTypeLookupId: [this.caseBook.SelectedMental.MentalBodyTypeLookupId == undefined ? null : this.caseBook.SelectedMental.MentalBodyTypeLookupId.toString()],

            MentalContentLookupId: [this.caseBook.SelectedMental.MentalContentLookupId == undefined ? null : this.caseBook.SelectedMental.MentalContentLookupId.toString()],
            MentalDressLookupId: [this.caseBook.SelectedMental.MentalDressLookupId == undefined ? null : this.caseBook.SelectedMental.MentalDressLookupId.toString()],
            MentalEstimatedIntellectLookupId: [this.caseBook.SelectedMental.MentalEstimatedIntellectLookupId == undefined ? null : this.caseBook.SelectedMental.MentalEstimatedIntellectLookupId.toString()],
            MentalExpressionLookupId: [this.caseBook.SelectedMental.MentalExpressionLookupId == undefined ? null : this.caseBook.SelectedMental.MentalExpressionLookupId.toString()],

            MentalFlowOfThoughtLookupId: [this.caseBook.SelectedMental.MentalFlowOfThoughtLookupId == undefined ? null : this.caseBook.SelectedMental.MentalFlowOfThoughtLookupId.toString()],
            MentalHygieneLookupId: [this.caseBook.SelectedMental.MentalHygieneLookupId == undefined ? null : this.caseBook.SelectedMental.MentalHygieneLookupId.toString()],
            MentalImpulseControlLookupId: [this.caseBook.SelectedMental.MentalImpulseControlLookupId == undefined ? null : this.caseBook.SelectedMental.MentalImpulseControlLookupId.toString()],
            MentalInformationLookupId: [this.caseBook.SelectedMental.MentalInformationLookupId == undefined ? null : this.caseBook.SelectedMental.MentalInformationLookupId.toString()],

            MentalInsightLookupId: [this.caseBook.SelectedMental.MentalInsightLookupId == undefined ? null : this.caseBook.SelectedMental.MentalInsightLookupId.toString()],
            MentalJudgementLookupId: [this.caseBook.SelectedMental.MentalJudgementLookupId == undefined ? null : this.caseBook.SelectedMental.MentalJudgementLookupId.toString()],
            MentalMemoryLookupId: [this.caseBook.SelectedMental.MentalMemoryLookupId == undefined ? null : this.caseBook.SelectedMental.MentalMemoryLookupId.toString()],
            MentalMotorActivityLookupId: [this.caseBook.SelectedMental.MentalMotorActivityLookupId == undefined ? null : this.caseBook.SelectedMental.MentalMotorActivityLookupId.toString()],

            MentalOrientationLookupId: [this.caseBook.SelectedMental.MentalOrientationLookupId == undefined ? null : this.caseBook.SelectedMental.MentalOrientationLookupId.toString()],
            MentalSpeechLookupId: [this.caseBook.SelectedMental.MentalSpeechLookupId == undefined ? null : this.caseBook.SelectedMental.MentalSpeechLookupId.toString],
            MentalVocabularyLookupId: [this.caseBook.SelectedMental.MentalVocabularyLookupId == undefined ? null : this.caseBook.SelectedMental.MentalVocabularyLookupId.toString()]
        });
        this.mentalModal.show();
    }

    public editMental(caseMental: vCaseMental) {
        this.caseBook.SelectedMental.CaseMentalId = caseMental.CaseMentalId;
        this.caseBook.SelectedMental.CaseId = caseMental.CaseId;

        this.caseBook.SelectedMental.MentalAbstractionLookupId = caseMental.MentalAbstractionLookupId;
        this.caseBook.SelectedMental.MentalAttentionLookupId = caseMental.MentalAttentionLookupId;
        this.caseBook.SelectedMental.MentalBehaviourLookupId = caseMental.MentalBehaviourLookupId;
        this.caseBook.SelectedMental.MentalBodyTypeLookupId = caseMental.MentalBodyTypeLookupId;

        this.caseBook.SelectedMental.MentalContentLookupId = caseMental.MentalContentLookupId;
        this.caseBook.SelectedMental.MentalDressLookupId = caseMental.MentalDressLookupId;
        this.caseBook.SelectedMental.MentalEstimatedIntellectLookupId = caseMental.MentalEstimatedIntellectLookupId;
        this.caseBook.SelectedMental.MentalExpressionLookupId = caseMental.MentalExpressionLookupId;

        this.caseBook.SelectedMental.MentalFlowOfThoughtLookupId = caseMental.MentalFlowOfThoughtLookupId;
        this.caseBook.SelectedMental.MentalHygieneLookupId = caseMental.MentalHygieneLookupId;
        this.caseBook.SelectedMental.MentalImpulseControlLookupId = caseMental.MentalImpulseControlLookupId;
        this.caseBook.SelectedMental.MentalInformationLookupId = caseMental.MentalInformationLookupId;

        this.caseBook.SelectedMental.MentalInsightLookupId = caseMental.MentalInsightLookupId;
        this.caseBook.SelectedMental.MentalJudgementLookupId = caseMental.MentalJudgementLookupId;
        this.caseBook.SelectedMental.MentalMemoryLookupId = caseMental.MentalMemoryLookupId;
        this.caseBook.SelectedMental.MentalMotorActivityLookupId = caseMental.MentalMotorActivityLookupId;

        this.caseBook.SelectedMental.MentalOrientationLookupId = caseMental.MentalOrientationLookupId;
        this.caseBook.SelectedMental.MentalSpeechLookupId = caseMental.MentalSpeechLookupId;
        this.caseBook.SelectedMental.MentalVocabularyLookupId = caseMental.MentalVocabularyLookupId;

        this.caseMentalForm = this.fb.group({
            MentalAbstractionLookupId: [this.caseBook.SelectedMental.MentalAbstractionLookupId == undefined ? null : this.caseBook.SelectedMental.MentalAbstractionLookupId.toString()],
            MentalAttentionLookupId: [this.caseBook.SelectedMental.MentalAttentionLookupId == undefined ? null : this.caseBook.SelectedMental.MentalAttentionLookupId.toString()],
            MentalBehaviourLookupId: [this.caseBook.SelectedMental.MentalBehaviourLookupId == undefined ? null : this.caseBook.SelectedMental.MentalBehaviourLookupId.toString()],
            MentalBodyTypeLookupId: [this.caseBook.SelectedMental.MentalBodyTypeLookupId == undefined ? null : this.caseBook.SelectedMental.MentalBodyTypeLookupId.toString()],
            MentalContentLookupId: [this.caseBook.SelectedMental.MentalContentLookupId == undefined ? null : this.caseBook.SelectedMental.MentalContentLookupId.toString()],
            MentalDressLookupId: [this.caseBook.SelectedMental.MentalDressLookupId == undefined ? null : this.caseBook.SelectedMental.MentalDressLookupId.toString()],
            MentalEstimatedIntellectLookupId: [this.caseBook.SelectedMental.MentalEstimatedIntellectLookupId == undefined ? null : this.caseBook.SelectedMental.MentalEstimatedIntellectLookupId.toString()],
            MentalExpressionLookupId: [this.caseBook.SelectedMental.MentalExpressionLookupId == undefined ? null : this.caseBook.SelectedMental.MentalExpressionLookupId.toString()],
            MentalFlowOfThoughtLookupId: [this.caseBook.SelectedMental.MentalFlowOfThoughtLookupId == undefined ? null : this.caseBook.SelectedMental.MentalFlowOfThoughtLookupId.toString()],
            MentalHygieneLookupId: [this.caseBook.SelectedMental.MentalHygieneLookupId == undefined ? null : this.caseBook.SelectedMental.MentalHygieneLookupId.toString()],
            MentalImpulseControlLookupId: [this.caseBook.SelectedMental.MentalImpulseControlLookupId == undefined ? null : this.caseBook.SelectedMental.MentalImpulseControlLookupId.toString()],
            MentalInformationLookupId: [this.caseBook.SelectedMental.MentalInformationLookupId == undefined ? null : this.caseBook.SelectedMental.MentalInformationLookupId.toString()],
            MentalInsightLookupId: [this.caseBook.SelectedMental.MentalInsightLookupId == undefined ? null : this.caseBook.SelectedMental.MentalInsightLookupId.toString()],
            MentalJudgementLookupId: [this.caseBook.SelectedMental.MentalJudgementLookupId == undefined ? null : this.caseBook.SelectedMental.MentalJudgementLookupId.toString()],
            MentalMemoryLookupId: [this.caseBook.SelectedMental.MentalMemoryLookupId == undefined ? null : this.caseBook.SelectedMental.MentalMemoryLookupId.toString()],
            MentalMotorActivityLookupId: [this.caseBook.SelectedMental.MentalMotorActivityLookupId == undefined ? null : this.caseBook.SelectedMental.MentalMotorActivityLookupId.toString()],
            MentalOrientationLookupId: [this.caseBook.SelectedMental.MentalOrientationLookupId == undefined ? null : this.caseBook.SelectedMental.MentalOrientationLookupId.toString()],
            MentalSpeechLookupId: [this.caseBook.SelectedMental.MentalSpeechLookupId == undefined ? null : this.caseBook.SelectedMental.MentalSpeechLookupId.toString()],
            MentalVocabularyLookupId: [this.caseBook.SelectedMental.MentalVocabularyLookupId == undefined ? null : this.caseBook.SelectedMental.MentalVocabularyLookupId.toString()]
        });
        this.mentalModal.show();
    }

    public hideMentalModal(): void {
        this.mentalModal.hide();
    }

    public saveMental(caseMental: CaseMental) {        
        //this.caseBook.SelectedMental.MentalAbstractionLookupId = this.caseMentalForm.controls['MentalAbstractionLookupId'].value;
        //this.caseBook.SelectedMental.MentalAttentionLookupId = this.caseMentalForm.controls['MentalAttentionLookupId'].value;
        //this.caseBook.SelectedMental.MentalBehaviourLookupId = this.caseMentalForm.controls['MentalBehaviourLookupId'].value;
        //this.caseBook.SelectedMental.MentalBodyTypeLookupId = this.caseMentalForm.controls['MentalBodyTypeLookupId'].value;

        //this.caseBook.SelectedMental.MentalContentLookupId = this.caseMentalForm.controls['MentalContentLookupId'].value;
        //this.caseBook.SelectedMental.MentalDressLookupId = this.caseMentalForm.controls['MentalDressLookupId'].value;
        //this.caseBook.SelectedMental.MentalEstimatedIntellectLookupId = this.caseMentalForm.controls['MentalEstimatedIntellectLookupId'].value;
        //this.caseBook.SelectedMental.MentalExpressionLookupId = this.caseMentalForm.controls['MentalExpressionLookupId'].value;

        //this.caseBook.SelectedMental.MentalFlowOfThoughtLookupId = this.caseMentalForm.controls['MentalFlowOfThoughtLookupId'].value;
        //this.caseBook.SelectedMental.MentalHygieneLookupId = this.caseMentalForm.controls['MentalHygieneLookupId'].value;
        //this.caseBook.SelectedMental.MentalImpulseControlLookupId = this.caseMentalForm.controls['MentalImpulseControlLookupId'].value;
        //this.caseBook.SelectedMental.MentalInformationLookupId = this.caseMentalForm.controls['MentalInformationLookupId'].value;

        //this.caseBook.SelectedMental.MentalInsightLookupId = this.caseMentalForm.controls['MentalInsightLookupId'].value;
        //this.caseBook.SelectedMental.MentalJudgementLookupId = this.caseMentalForm.controls['MentalJudgementLookupId'].value;
        //this.caseBook.SelectedMental.MentalMemoryLookupId = this.caseMentalForm.controls['MentalMemoryLookupId'].value;
        //this.caseBook.SelectedMental.MentalMotorActivityLookupId = this.caseMentalForm.controls['MentalMotorActivityLookupId'].value;

        //this.caseBook.SelectedMental.MentalOrientationLookupId = this.caseMentalForm.controls['MentalOrientationLookupId'].value;
        //this.caseBook.SelectedMental.MentalSpeechLookupId = this.caseMentalForm.controls['MentalSpeechLookupId'].value;
        //this.caseBook.SelectedMental.MentalVocabularyLookupId = this.caseMentalForm.controls['MentalVocabularyLookupId'].value;

        this.casesService
            .updateMental(this.caseBook).subscribe(data => {
                this.mentalModal.hide();
                this.caseBook.vMental.push(data);
                this.toastr.success('Mental Status updated successfully');

            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }
    /* End of - Mental */

    /* Start - Sessions */

    @ViewChild('sessionsModal') public sessionsModal: ModalDirective;

    public RespectedDuringYourVisitLookupOptionList: Array<IOption> = [];
    public FeelSafeAndSecureLookupOptionList: Array<IOption> = [];
    public FeelThatCounsellingLookupOptionList: Array<IOption> = [];
    public AssistanceOfPeacemakerLookupOptionList: Array<IOption> = [];
    public RecommendFreeCounsellingLookupOptionList: Array<IOption> = [];
    public AbleToImproveLookupOptionList: Array<IOption> = [];
    public OPMTeamToFollowupLookupOptionList: Array<IOption> = [];

    public addNewSession() {
        this.caseBook.SelectedSessionLog = new CaseSessionLog();
        this.caseBook.SelectedSessionLog.CaseId = this.caseBook.Case.CaseId;

        this.caseSessionForm = this.fb.group({
            CounselingDate: ['', Validators.required],
            TypeOfCounselingLookupId: ['', Validators.required],
            DurationOfSessionMIn: ['', Validators.required],
            NextSessionScheduled: [''],
            SessionNotes: ['', Validators.required]
        });

        this.sessionsModal.show();
    }

    public editSession(sessionLog: CaseSessionLog) {
        this.caseBook.SelectedSessionLog = new CaseSessionLog();
        this.caseBook.SelectedSessionLog.CaseSessionLogId = sessionLog.CaseSessionLogId;
        this.caseBook.SelectedSessionLog.CaseId = sessionLog.CaseId;

        this.caseBook.SelectedSessionLog.CounselingDate = sessionLog.CounselingDate;
        this.caseBook.SelectedSessionLog.TypeOfCounselingLookupId = sessionLog.TypeOfCounselingLookupId;
        this.caseBook.SelectedSessionLog.DurationOfSessionMIn = sessionLog.DurationOfSessionMIn;
        this.caseBook.SelectedSessionLog.NextSessionScheduled = sessionLog.NextSessionScheduled;
        this.caseBook.SelectedSessionLog.SessionNotes = sessionLog.SessionNotes;

        this.caseSessionForm = this.fb.group({
            CounselingDate: [this.caseBook.SelectedSessionLog.CounselingDate, Validators.required],
            TypeOfCounselingLookupId: [this.caseBook.SelectedSessionLog.TypeOfCounselingLookupId == undefined ? null : this.caseBook.SelectedSessionLog.TypeOfCounselingLookupId.toString(), Validators.required],
            DurationOfSessionMIn: [this.caseBook.SelectedSessionLog.DurationOfSessionMIn, Validators.required],
            NextSessionScheduled: [this.caseBook.SelectedSessionLog.NextSessionScheduled],
            SessionNotes: [this.caseBook.SelectedSessionLog.SessionNotes, Validators.required]
        });

        this.caseSessionForm.patchValue({ CounselingDate: { date: sessionLog.CounselingDate } });

        this.caseSessionForm.patchValue({ NextSessionScheduled: { date: sessionLog.NextSessionScheduled } });

        this.sessionsModal.show();
    }

    public hideSessionModal(): void {
        this.sessionsModal.hide();
    }

    public saveInProgress = false;

    private returnDate(object: any): any {
        var formatted = object['formatted'];
        if (formatted != undefined) { 
            return moment.utc(formatted).format();
        }

        return moment.utc(object['date']).format();
    }

    public saveSession(sessionLog: CaseSessionLog) {

        let counsDateObj = this.caseSessionForm.controls['CounselingDate'].value;

        this.caseBook.SelectedSessionLog.CounselingDate = this.returnDate(counsDateObj);
        this.caseBook.SelectedSessionLog.TypeOfCounselingLookupId = this.caseSessionForm.controls['TypeOfCounselingLookupId'].value;
        this.caseBook.SelectedSessionLog.DurationOfSessionMIn = this.caseSessionForm.controls['DurationOfSessionMIn'].value;

        let nextSchObject = this.caseSessionForm.controls['NextSessionScheduled'].value;

        if (nextSchObject == null || nextSchObject == ""){
            this.caseBook.SelectedSessionLog.NextSessionScheduled = null;
        }
        else {
            this.caseBook.SelectedSessionLog.NextSessionScheduled = this.returnDate(nextSchObject);
        }

        this.caseBook.SelectedSessionLog.SessionNotes = this.caseSessionForm.controls['SessionNotes'].value;        

        this.saveInProgress = true;
        this.sessionsModal.config.keyboard = false;

        this.casesService
            .updateSessionLog(this.caseBook).subscribe(data => {
                this.sessionsModal.hide();
                this.saveInProgress = false;
                let selectedId = this.caseBook.SelectedSessionLog.CaseSessionLogId;
                if (selectedId == undefined) {
                    this.caseBook.vSessionLog.push(data);
                    // this.caseBook.SelectedSessionLog.CaseSessionLogId = data.CaseSessionLogId
                }
                else {
                    let k = this.caseBook.vSessionLog.findIndex(sLog => sLog.CaseSessionLogId == this.caseBook.SelectedSessionLog.CaseSessionLogId);
                    this.caseBook.vSessionLog[k] = data;
                  //  this.caseBook.vSessionLog[0].
                }

                this.toastr.success('Session updated successfully');
            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }
    /* End of - Sessions */

    /* Start - Feedback */

    @ViewChild('feedbackModal') public feedbackModal: ModalDirective;

    public addNewFeedback() {
        this.caseBook.SelectedFeedback = new CaseFeedback();
        this.caseBook.SelectedFeedback.CaseId = this.caseBook.Case.CaseId;

        this.caseFeedbackForm = this.fb.group({
            RespectedDuringYourVisitLookupId: [this.caseBook.SelectedFeedback.RespectedDuringYourVisitLookupId == undefined ? null : this.caseBook.SelectedFeedback.RespectedDuringYourVisitLookupId.toString(), Validators.required],
            FeelSafeAndSecureLookupId: [this.caseBook.SelectedFeedback.FeelSafeAndSecureLookupId == undefined ? null : this.caseBook.SelectedFeedback.FeelSafeAndSecureLookupId.toString(), Validators.required],
            FeelThatCounsellingLookupId: [this.caseBook.SelectedFeedback.FeelThatCounsellingLookupId == undefined ? null : this.caseBook.SelectedFeedback.FeelThatCounsellingLookupId.toString(), Validators.required],
            AssistanceOfPeacemakerLookupId: [this.caseBook.SelectedFeedback.AssistanceOfPeacemakerLookupId == undefined ? null : this.caseBook.SelectedFeedback.AssistanceOfPeacemakerLookupId.toString(), Validators.required],

            RecommendFreeCounsellingLookupId: [this.caseBook.SelectedFeedback.RecommendFreeCounsellingLookupId == undefined ? null : this.caseBook.SelectedFeedback.RecommendFreeCounsellingLookupId.toString(), Validators.required],
            AbleToImproveLookupId: [this.caseBook.SelectedFeedback.AbleToImproveLookupId == undefined ? null : this.caseBook.SelectedFeedback.AbleToImproveLookupId.toString(), Validators.required],
            OPMTeamToFollowupLookupId: [this.caseBook.SelectedFeedback.OPMTeamToFollowupLookupId == undefined ? null : this.caseBook.SelectedFeedback.OPMTeamToFollowupLookupId.toString(), Validators.required],

            AnySuggestions: [this.caseBook.SelectedFeedback.AnySuggestions]
        });
        this.feedbackModal.show();
    }

    public editFeedback(feedback: CaseFeedback) {
        this.caseBook.SelectedFeedback = new CaseFeedback();
        this.caseBook.SelectedFeedback.CaseId = this.caseBook.Case.CaseId;
        this.caseBook.SelectedFeedback.CaseFeedbackId = feedback.CaseFeedbackId;

        this.caseBook.SelectedFeedback.RespectedDuringYourVisitLookupId = feedback.RespectedDuringYourVisitLookupId;
        this.caseBook.SelectedFeedback.FeelSafeAndSecureLookupId = feedback.FeelSafeAndSecureLookupId;
        this.caseBook.SelectedFeedback.FeelThatCounsellingLookupId = feedback.FeelThatCounsellingLookupId;
        this.caseBook.SelectedFeedback.AssistanceOfPeacemakerLookupId = feedback.AssistanceOfPeacemakerLookupId;

        this.caseBook.SelectedFeedback.RecommendFreeCounsellingLookupId = feedback.RecommendFreeCounsellingLookupId;
        this.caseBook.SelectedFeedback.AbleToImproveLookupId = feedback.AbleToImproveLookupId;
        this.caseBook.SelectedFeedback.OPMTeamToFollowupLookupId = feedback.OPMTeamToFollowupLookupId;

        this.caseBook.SelectedFeedback.AnySuggestions = feedback.AnySuggestions;

        this.caseFeedbackForm = this.fb.group({
            RespectedDuringYourVisitLookupId: [this.caseBook.SelectedFeedback.RespectedDuringYourVisitLookupId == undefined ? null : this.caseBook.SelectedFeedback.RespectedDuringYourVisitLookupId.toString(), Validators.required],
            FeelSafeAndSecureLookupId: [this.caseBook.SelectedFeedback.FeelSafeAndSecureLookupId == undefined ? null : this.caseBook.SelectedFeedback.FeelSafeAndSecureLookupId.toString(), Validators.required],
            FeelThatCounsellingLookupId: [this.caseBook.SelectedFeedback.FeelThatCounsellingLookupId == undefined ? null : this.caseBook.SelectedFeedback.FeelThatCounsellingLookupId.toString(), Validators.required],
            AssistanceOfPeacemakerLookupId: [this.caseBook.SelectedFeedback.AssistanceOfPeacemakerLookupId == undefined ? null : this.caseBook.SelectedFeedback.AssistanceOfPeacemakerLookupId.toString(), Validators.required],

            RecommendFreeCounsellingLookupId: [this.caseBook.SelectedFeedback.RecommendFreeCounsellingLookupId == undefined ? null : this.caseBook.SelectedFeedback.RecommendFreeCounsellingLookupId.toString(), Validators.required],
            AbleToImproveLookupId: [this.caseBook.SelectedFeedback.AbleToImproveLookupId == undefined ? null : this.caseBook.SelectedFeedback.AbleToImproveLookupId.toString(), Validators.required],
            OPMTeamToFollowupLookupId: [this.caseBook.SelectedFeedback.OPMTeamToFollowupLookupId == undefined ? null : this.caseBook.SelectedFeedback.OPMTeamToFollowupLookupId.toString(), Validators.required],

            AnySuggestions: [this.caseBook.SelectedFeedback.AnySuggestions]
        });
        this.feedbackModal.show();
    }

    public hideFeedbackModal(): void {
        this.feedbackModal.hide();
    }

    public saveFeedback(feedback: CaseFeedback) {        
        this.caseBook.SelectedFeedback.CaseId = this.caseBook.Case.CaseId;

        this.caseBook.SelectedFeedback.RespectedDuringYourVisitLookupId = this.caseFeedbackForm.controls['RespectedDuringYourVisitLookupId'].value;
        this.caseBook.SelectedFeedback.FeelSafeAndSecureLookupId = this.caseFeedbackForm.controls['FeelSafeAndSecureLookupId'].value;
        this.caseBook.SelectedFeedback.FeelThatCounsellingLookupId = this.caseFeedbackForm.controls['FeelThatCounsellingLookupId'].value;
        this.caseBook.SelectedFeedback.AssistanceOfPeacemakerLookupId = this.caseFeedbackForm.controls['AssistanceOfPeacemakerLookupId'].value;

        this.caseBook.SelectedFeedback.RecommendFreeCounsellingLookupId = this.caseFeedbackForm.controls['RecommendFreeCounsellingLookupId'].value;
        this.caseBook.SelectedFeedback.AbleToImproveLookupId = this.caseFeedbackForm.controls['AbleToImproveLookupId'].value;
        this.caseBook.SelectedFeedback.OPMTeamToFollowupLookupId = this.caseFeedbackForm.controls['OPMTeamToFollowupLookupId'].value;

        this.caseBook.SelectedFeedback.AnySuggestions = this.caseFeedbackForm.controls['AnySuggestions'].value;

        this.casesService
            .updateFeedback(this.caseBook).subscribe(data => {
                this.feedbackModal.hide();
                this.caseBook.FeedBack.push(data);
                this.toastr.success('Feedback updated successfully');

            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }
    /* End of - Feedback */

    /* Start - Legal Case */
    public outcomeLookupOptionList: Array<IMultiSelectOption> = [];
    public documentsLookupOptionList: Array<IMultiSelectOption> = [];

    private loadLegalFromGroup() {
        this.caseLegalForm = this.fb.group({
            CaseNumber: [this.caseBook.Legal.CaseNumber],
            Court: [this.caseBook.Legal.Court],
            Prayer: [this.caseBook.Legal.Prayer],
            LegalRepresentative: [this.caseBook.Legal.LegalRepresentative],

            LegalConsentFormLookupId: [this.caseBook.Legal.LegalConsentFormLookupId == undefined ? null : this.caseBook.Legal.LegalConsentFormLookupId.toString()],
            LegalActionLookupId: [this.caseBook.Legal.LegalActionLookupId == undefined ? null : this.caseBook.Legal.LegalActionLookupId.toString()],
            OutcomeLookupId: [this.caseBook.Legal.OutcomeLookupId == undefined ? null : this.caseBook.Legal.OutcomeLookupId.toString()],
            DocumentsLookupId: [this.caseBook.Legal.DocumentsLookupId == undefined ? null : this.caseBook.Legal.DocumentsLookupId.toString()]
        });
    }

    public onUpdateLegal() {
        this.caseBook.Legal.CaseId = this.caseBook.Case.CaseId;

        this.caseBook.Legal.CaseNumber = this.caseLegalForm.controls['CaseNumber'].value;
        this.caseBook.Legal.Court = this.caseLegalForm.controls['Court'].value;
        this.caseBook.Legal.Prayer = this.caseLegalForm.controls['Prayer'].value;
        this.caseBook.Legal.LegalRepresentative = this.caseLegalForm.controls['LegalRepresentative'].value;

        this.caseBook.Legal.LegalConsentFormLookupId = this.caseLegalForm.controls['LegalConsentFormLookupId'].value;
        this.caseBook.Legal.LegalActionLookupId = this.caseLegalForm.controls['LegalActionLookupId'].value;

        //this.caseBook.Legal.OutcomeLookupId = this.caseLegalForm.controls['OutcomeLookupId'].value;
        //this.caseBook.Legal.DocumentsLookupId = this.caseLegalForm.controls['DocumentsLookupId'].value;

        this.casesService
            .updateLegal(this.caseBook).subscribe(data => {                
                //this.getCaseById();
                this.toastr.success('Legal updated successfully');

            }, (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            });
    }

    /* End of - Legal Case */
}
