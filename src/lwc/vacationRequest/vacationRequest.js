import {LightningElement, track, api, wire} from 'lwc';
import getRequestList from '@salesforce/apex/VacationRequestController.getRequestList';

import {refreshApex} from '@salesforce/apex';
import {deleteRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {updateRecord} from 'lightning/uiRecordApi';
import getDeletedRequestList from '@salesforce/apex/VacationRequestController.getDeletedRequestList';
import getUserDetails from '@salesforce/apex/UserDetails.getUserDetails';
import getManagerInformation from '@salesforce/apex/ManagerDetails.getManagerInformation';
import updateStatusField from '@salesforce/apex/VacationRequestController.updateStatusField';
import Id from '@salesforce/user/Id';


export default class VacationRequest extends LightningElement {

    //постоянное обновление информации на страничке
    connectedCallback() {
        this.handleLoad();
        this.getCurrentUser();
        // this.getCurrentUserManager();
    }

    renderedCallback() {
        this.handleLoad();
    }

    // disconnectedCallback() {
    //     this.handleLoad();
    // }


    //информация о текущем пользователе
    userId = Id;
    @api user;
    @track error;

    getCurrentUser(){
        getUserDetails({recId: this.userId})
            .then(result => {
                this.user = result;
            });
    }


    //получение списка заявок
    @api requests;
    handleLoad() {
        getRequestList()
            .then(result => {
                this.requests = result;
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Something going wrong with loading of requests',
                        variant: 'error'
                    })
                )
            });
    }


    // обновление статуса у запроса на Submitted
    requestSubmitted(event){
        const updRequestId = event.detail;
        updateStatusField({updatedId: updRequestId, typeOfRequest: 'Submitted'})
            .then(result => {
                this.requests = result;
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Update failed!',
                        variant: 'error'
                    })
                )
        });
    }


    // обновление статуса у запроса на Approved
    requestApproved(event){
        const updRequestId = event.detail;
        updateStatusField({updatedId: updRequestId, typeOfRequest: 'Approved'})
            .then(result => {
                this.requests = result;
            }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Update failed!',
                    variant: 'error'
                })
            )
        });
    }


    //уведомление об отсутствии менеджера у текущего пользователя
    @api manager
    // managerId = this.user.ManagerId;
    // getCurrentUserManager(){
    //     getManagerInformation({recMId: this.managerId})
    //         .then(result => {
    //             this.manager = result;
    //         });
    // }

    @wire(getManagerInformation, {
        recMId: '$user.ManagerId'
    })

    wiredManger({error, data}) {
        if (data) {
            this.manager = data;
        } else if (error) {
            this.error = error;
        }
    }

    managerCheck() {
        if (this.manager == null) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Warning',
                    message: 'The Manager for current user isn’t specified',
                    variant: 'warning'
                }),
            );
        }
    }


    //Фильтрация своих запросов по чекбоксу
    @track flag
    @track myVacations = true;

    handleCheckBox(event) {
        this.flag = event.target.checked;
        if (this.flag) {
            this.checkEqualsOfCurUserIdAndCreatedId()
        } else {
            this.myVacations = true;
        }
    }

    checkEqualsOfCurUserIdAndCreatedId() {
        for (let request of this.requests) {
            if (this.user.Id !== request.CreatedById) {
                this.myVacations = false;
                break;
            } else {
                this.myVacations = true;
            }
        }
    }


    //Модальное окно для добавления нового запроса
    @track isModalOpen = false;

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    submitDetails() {
        this.isModalOpen = false;
    }


    //изменение статуса запроса на New и установка в поле Manager полученного ранее значения
    handleSubmit(event) {
        event.preventDefault(); // stop the form from submitting
        const fields = event.detail.fields;

        fields.Status__c = 'New';
        if(this.manager != null){
            fields.Manager__c = this.manager.Id;
        }

        this.template.querySelector('lightning-record-edit-form').submit(fields);

        // if(event.error.()){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Request successfully added',
                    variant: 'success'
                })
            );
        // }
    }

    // обработка ошибок при сохранение новой заявки
    myHandleError(event){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: event.message,
                variant: 'error'
            })
        );
    }
}