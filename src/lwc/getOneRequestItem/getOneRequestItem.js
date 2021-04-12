import {LightningElement, api, track, wire} from 'lwc';
import {deleteRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getDeletedRequestList from '@salesforce/apex/VacationRequestController.getDeletedRequestList';

export default class GetOneRequestItem extends LightningElement {
    @api request;
    @api user;
    @api manager;
    @track myVacations = true;

    @api isChangeable;

    clickHandler(event) {
        event.preventDefault();
        const clickedEvent = new CustomEvent('clicked', {detail: this.request.Id});
        this.dispatchEvent(clickedEvent);
    }

    // проверка статуса запроса и принадлежности запроса пользователю
    get isRemovable() {
        // console.log("ManagerId ",this.manager.Id);
        return this.request.Status__c === 'New' && this.request.CreatedById === this.user.Id;
    }

    //удаление запроса
    @track requestList;
    deleteRequestFromDB(event) {
        let requestId = event.target.value;
        getDeletedRequestList(requestId)
            .then(res => {
                this.requestList = res;
            });

        deleteRecord(requestId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Request deleted successfully',
                        variant: 'success'
                    })
                );
                for (let req in this.requestList) {
                    if (this.requestList[req].Id === requestId && this.requestList[req].Status__c === 'New') {
                        this.requestList.splice(req, 1);
                        break;
                    }
                }

            })
    }

    //изменение статуса c New на Submitted
    changeStatus(event){
        // alert(this.request.Status__c === 'New' && this.request.CreatedById === this.user.Id);
        if(this.request.Status__c === 'New' && this.request.CreatedById === this.user.Id){
            event.preventDefault();
            this.request.Status__c = 'Submitted';
            const clickedEvent = new CustomEvent('clicked', {detail: this.request.Status__c});
            this.dispatchEvent(clickedEvent);
            // this.dispatchEvent(
            //     new ShowToastEvent({
            //         title: 'Success',
            //         message: 'You successfully submit your request',
            //         variant: 'success'
            //     })
            // )
            //
            // console.log(this.request.Status__c);
        }else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Warning',
                    message: 'Illegal actions!',
                    variant: 'warning'
                })
            )
        }
    }

}