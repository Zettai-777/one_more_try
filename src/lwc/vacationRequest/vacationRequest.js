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
import updateStatusFieldToApproved from '@salesforce/apex/VacationRequestController.updateStatusFieldToApproved';
import Id from '@salesforce/user/Id';


export default class VacationRequest extends LightningElement {
    userId = Id;
    @track user;
    @track error;

    @wire(getUserDetails, {
        recId: '$userId'
    })

    //информация о текущем пользователе
    wiredUser({error, data}) {
        if (data) {
            this.user = data;
        } else if (error) {
            this.error = error;
        }
    }






    // @wire(getRequestList, {})


    // wiredRequests({error, data}){
    //     if(data) {
    //         this.requests = data;
    //     }else if (error){
    //         this.error = error;
    //     }
    // }
    // @track error;
    // Обработка результатов по получению списка request

    //постоянное обновление информации на страничке
    connectedCallback() {
        this.handleLoad();
    }

    renderedCallback() {
        this.handleLoad();
    }

    // disconnectedCallback() {
    //     this.handleLoad();
    // }

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
    requestClicked(event){
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
    @track manager
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



    // clickedButtonLabel;
    //
    // handleClick(event) {
    //     this.clickedButtonLabel = event.target.label;
    // }

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
        // console.log(this.manager);
        this.template.querySelector('lightning-record-edit-form').submit(fields);

        // if(event.error.isEmpty()){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Request successfully added',
                    variant: 'success'
                })
            );
        // }

    }

    myHandleError(event){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: event.message,
                variant: 'error'
            })
        );
    }

    // handleSuccess(event) {
    //     const payload = event.detail;
    //     console.log(JSON.stringify(payload));
    //
    //     const updatedRecord = event.detail.id;
    //     console.log('onsuccess: ', updatedRecord);
    // }

    // handleChange(event){
    //     this._greeting = event.target.value;
    // }
    //
    // get upperCasedGreeting() {
    //     return this._greeting.toUpperCase();
    // }


    // checkTypeOfStatus(event){
        // event.preventDefault();
        // let requestId = event.target.value;
        // const fields = event.detail.fields;
        // if(fields.Status__c === 'New'){
        //     this.isDeleteButtonDisabled = true;
        // }
        // getDeletedRequestList(requestId)
        //     .then(res => {
        //         this.requestList = res;
        //     });

        // for(let i=0; i < this.requestList.length; i++){
        //     if(this.requestList[i].Status__c == 'New'){
        //         this.isDeleteButtonDisabled = true;
                // break;
            // }
        // }
        // this.isDeleteButtonDisabled = true;
        // this.template.querySelector('lightning-button').submit(fields)

        // let requestId = event.target.value;
        // getDeletedRequestList(requestId)
        //     .then(res => {
        //         this.requestList = res;
        //     });

    // }

    // //удаление запроса
    // @track requestList;
    // @track isDeleteButtonDisabled;
    // deleteRequestFromDB(event) {
    //     let requestId = event.target.value;
    //     getDeletedRequestList(requestId)
    //         .then(res => {
    //             this.requestList = res;
    //             // for(let i=0; i < this.requestList.length; i++){
    //             //     if(this.requestList[i].Status__c === 'New'){
    //             //         this.isDeleteButtonDisabled = true;
    //             //     return this.isDeleteButtonDisabled;
    //             //     break;
    //             //     }
    //             // }
    //             // console.log(this.requestList.Status__c);
    //         });
    //
    //     // this.checkTypeOfStatus(event);
    //     // if(this.isDeleteButtonDisabled === true){
    //     //     return;
    //     // }
    //
    //
    //     // if(this.requestList[0].Status__c === 'New'){
    //     //     this.isDeleteButtonDisabled = true;
    //     // }
    //     // this.checkTypeOfStatus(event);
    //
    //     deleteRecord(requestId)
    //         .then(() => {
    //             if(this.isDeleteButtonDisabled == true){
    //                 event.preventDefault();
    //                 this.dispatchEvent(
    //                     new ShowToastEvent({
    //                         title: 'Warning',
    //                         message: 'You can’t delete this request!',
    //                         variant: 'warning'
    //                     })
    //                 );
    //             }else {
    //                 this.dispatchEvent(
    //                     new ShowToastEvent({
    //                         title: 'Success',
    //                         message: 'Request deleted successfully',
    //                         variant: 'success'
    //                     })
    //                 );
    //                 for (let req in this.requestList) {
    //                     if (this.requestList[req].Id === requestId && this.requestList[req].Status__c === 'New') {
    //                         this.requestList.splice(req, 1);
    //                         break;
    //                     }
    //                 }
    //             }
    //
    //         })
    // }



    // // @wire(updateStatusField,{updatedId, })
    // @track updatedRequest
    // // @track submittedRequest
    // changeStatus(event){
    //     let updatedId = event.target.value;
    //     updateStatusField(updatedId)
    //         .then(data => {
    //             this.updatedRequest = data;
    //         });
    //     let recordInput = {
    //         apiName: 'VacationRequest__c',
    //         fields: {
    //             Status__c: 'Submitted'
    //         }
    //     }
    //     updateRecord(recordInput)
    //         .then(() => {
    //         return refreshApex(this.updatedRequest);
    //     })
    //     // alert(updatedId);
    //     // this.updatedRequest = updateStatusField(updatedId);
    //     // alert(this.updatedRequest.Id);
    //     // getDeletedRequestList(requestId)
    //     //     .then((res) =>{
    //     //         this.submittedRequest = res;
    //     //
    //     //         // this.submittedRequest[0].fields.Status__c = 'Submitted';
    //     //     })
    //     // event.preventDefault();
    //     // let fields = event.details.fields;
    //     // fields.Status__c = 'Submitted';
    //     // this.template.querySelector('lightning-button-group').submit(fields);
    //
    //     // for (let req in this.submittedRequest){
    //     //     alert(this.submittedRequest[req].fields.Id)
    //     // }
    // }



}