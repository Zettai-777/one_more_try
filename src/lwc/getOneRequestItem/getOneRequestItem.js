import {LightningElement, api, track, wire} from 'lwc';
import {deleteRecord} from 'lightning/uiRecordApi';
import getUserDetails from '@salesforce/apex/UserDetails.getUserDetails';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';

export default class GetOneRequestItem extends LightningElement {
    @api request;
    @api user;
    @api manager;
    @track myVacations = true;
    // connectedCallback() {
        // this.getUserInfo();
    // }

    clickHandler(event){
        event.preventDefault();
        const clickedEvent = new CustomEvent('clicked', {detail: this.request.Id});
        this.dispatchEvent(clickedEvent);
    }

    //удаление запроса
    @track requestList;
    @track isDeleteButtonDisabled;
    deleteRequestFromDB(event) {
        let requestId = event.target.value;
        getDeletedRequestList(requestId)
            .then(res => {
                this.requestList = res;
                // for(let i=0; i < this.requestList.length; i++){
                //     if(this.requestList[i].Status__c === 'New'){
                //         this.isDeleteButtonDisabled = true;
                //     return this.isDeleteButtonDisabled;
                //     break;
                //     }
                // }
                // console.log(this.requestList.Status__c);
            });

        // this.checkTypeOfStatus(event);
        // if(this.isDeleteButtonDisabled === true){
        //     return;
        // }


        // if(this.requestList[0].Status__c === 'New'){
        //     this.isDeleteButtonDisabled = true;
        // }
        // this.checkTypeOfStatus(event);

        deleteRecord(requestId)
            .then(() => {
                if(this.isDeleteButtonDisabled == true){
                    event.preventDefault();
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Warning',
                            message: 'You can’t delete this request!',
                            variant: 'warning'
                        })
                    );
                }else {
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
                }

            })
    }


}