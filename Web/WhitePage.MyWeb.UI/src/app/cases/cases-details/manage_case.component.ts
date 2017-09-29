import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from 'ng-select';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { ModalDirective } from 'ng2-bootstrap/modal';

import { ValidationService } from '../../services/validation.service';
import { CasesService } from '../../services/cases.services';

import { BaseCaseController } from './../basecase.controller';

import { CaseBook } from '../../models/case.entities';
import { CaseStatus } from '../../models/entities';

@Component({
    selector: 'manageCase',
    templateUrl: 'manage_case.component.html',
    inputs: ['caseBook'],
})

export class ManageCaseComponent implements OnInit {
    public caseBook: CaseBook;
    public caseManageForm: FormGroup;
    public isManageDataLoaded: boolean = false;
    public caseStatusesList: Array<CaseStatus> = [];
    public caseStatusOptionList: Array<IOption> = [];
    public sourceOfCaseLookupOptionList: Array<IOption> = [];
    public typesOfCounselingLookupOptionList: Array<IMultiSelectOption> = [];
    public relationshipWithPMLookupOptionList: Array<IOption> = [];

    constructor(
        public fb: FormBuilder,
        private validationService: ValidationService,
        private casesService: CasesService,
        public toastr: ToastsManager) {

        this.sourceOfCaseLookupOptionList = BaseCaseController.staticParseLookups("SourceOfCase");
        this.typesOfCounselingLookupOptionList = BaseCaseController.staticParseMultiLookups("TypesOfCounselling");
        this.relationshipWithPMLookupOptionList = BaseCaseController.staticParseLookups("RelationshipWithPM");
    }

    ngOnInit() {
        var localStatusesOptionList = new Array<IOption>();
        this.caseStatusesList = JSON.parse(localStorage.getItem("getAllCaseStatuses"));
        for (var i = 0; i < this.caseStatusesList.length; i++) {
            localStatusesOptionList.push({
                value: this.caseStatusesList[i].CaseStatusId.toString(),
                label: this.caseStatusesList[i].Title
            });
        }
        this.caseStatusOptionList = localStatusesOptionList;

        this.loadManageFromGroup();
        this.isManageDataLoaded = true;
    }    

    private returnValue(input: any) {
        return input == undefined ? null : input.toString()
    }

    private loadManageFromGroup() {
        this.caseManageForm = this.fb.group({

            ReferredToWhom: [this.caseBook.Manage.ReferredToWhom],
            SourceOfCaseLookupId: [this.returnValue(this.caseBook.Manage.SourceOfCaseLookupId)],
            SourceOfCaseDesc: [this.caseBook.Manage.SourceOfCaseDesc],
            TypesOfCounselingLookupId: [this.returnValue(this.caseBook.Manage.TypesOfCounselingLookupId)],
            TotalNoOfSessionsLookupId: [this.returnValue(this.caseBook.Manage.TotalNoOfSessionsLookupId), [Validators.maxLength(3), this.validationService.validateNumber, Validators.pattern("^[0-9]*$")]],
            TotalHoursSpentLookupId: [this.returnValue(this.caseBook.Manage.TotalHoursSpentLookupId), [Validators.maxLength(5), this.validationService.validateNumber, this.validationService.validateTime]],

            ReasonForClosureStatus: [this.caseBook.Manage.ReasonForClosureStatus],
            CaseSubject: [this.caseBook.Manage.CaseSubject],
            CaseDescription: [this.caseBook.Manage.CaseDescription],
            RelationshipWithPMLookupId: [this.returnValue(this.caseBook.Manage.RelationshipWithPMLookupId)],
            ResolutionLog: [this.caseBook.Manage.ResolutionLog]
        });
    }

    public onUpdateManage() {
        this.caseBook.Manage.CaseId = this.caseBook.Case.CaseId;
        this.caseBook.Manage.ReferredToWhom = this.caseManageForm.controls['ReferredToWhom'].value;
        this.caseBook.Manage.SourceOfCaseLookupId = this.caseManageForm.controls['SourceOfCaseLookupId'].value;
        this.caseBook.Manage.SourceOfCaseDesc = this.caseManageForm.controls['SourceOfCaseDesc'].value;
        this.caseBook.Manage.TotalNoOfSessionsLookupId = this.caseManageForm.controls['TotalNoOfSessionsLookupId'].value;
        this.caseBook.Manage.TotalHoursSpentLookupId = this.caseManageForm.controls['TotalHoursSpentLookupId'].value;
        this.caseBook.Manage.ReasonForClosureStatus = this.caseManageForm.controls['ReasonForClosureStatus'].value;
        this.caseBook.Manage.CaseSubject = this.caseManageForm.controls['CaseSubject'].value;
        this.caseBook.Manage.CaseDescription = this.caseManageForm.controls['CaseDescription'].value;
        this.caseBook.Manage.RelationshipWithPMLookupId = this.caseManageForm.controls['RelationshipWithPMLookupId'].value;
        this.caseBook.Manage.ResolutionLog = this.caseManageForm.controls['ResolutionLog'].value;


        this.casesService.updateCase(this.caseBook).subscribe(
            data => {
                this.caseBook.Manage.CaseManageId = data;
                this.toastr.success('Case info updated successfully');
            },
            (error: any) => {
                this.toastr.error("Error while updating case, " + error);
            }
        );
    }
}