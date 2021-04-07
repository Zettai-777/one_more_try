import { LightningElement, track, api, wire } from 'lwc';
import getRequestList from '@salesforce/apex/VacationRequestController.getRequestList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getUserDetails  from '@salesforce/apex/UserDetails.getUserDetails';
import Id from '@salesforce/user/Id';

import getFields from '@salesforce/apex/VacationRequestController.getRequestList';
import USER_ManagerId from '@salesforce/schema/User';
// import Vacation_Request_Manager__c from '@salesforce/schema/Vacation_Request_c'
export default class VacationRequest extends LightningElement {

    // @track _greeting;
    // @track columns;


    userId = Id;
    @track user;
    @track error;
    @wire(getUserDetails, {
        recId: '$userId'
    })
    wiredUser({error,data}) {
        if (data) {
            this.user = data;

        } else if (error) {

            this.error = error;

        }
    }

    //постоянное обновление информации на страничке
    connectedCallback() {
        this.handleLoad();
    }


    //уведомление о пустом пользователе
    // @api recordId;
    // fields = [USER_ManagerId];

    // @wire(getRecord, { recordId: '$recordId', fields: [USER_ManagerId]})
    // record;

    manager= USER_ManagerId;
    // manager= null;
    title='Toast';
    message='Can not define User information';
    variant= 'submit';

    handleError(){
        this.showToast(this.title, this.message, this.variant);
    }

    managerCheck(){
        if(this.manager == null){
            this.showToast(this.title, this.message, this.variant);
        }
    }

    showToast(title, message, variant){
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
            }),
        );
    }


    //checkbox
    flag;
    handleCheckBox(event){
        let checkbox = this.template.querySelector('[data-id="checkbox"]')
        checkbox[0].checked = event.target.checked;
    }

    // columns = [
    //     { label: 'First Name', fieldName: 'FirstName' },
    //     { label: 'Last Name', fieldName: 'LastName' },
    //     { label: 'Title', fieldName: 'Title' },
    //     { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    //     { label: 'Email', fieldName: 'Email', type: 'email' }
    // ];

    // clickedButtonLabel;
    //
    // handleClick(event) {
    //     this.clickedButtonLabel = event.target.label;
    // }

    //Модальное окно
    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded
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

    // handleChange(event){
    //     this._greeting = event.target.value;
    // }
    //
    // get upperCasedGreeting() {
    //     return this._greeting.toUpperCase();
    // }


    @api requests;
    @track error;
    //Обработка результатов по получению списка request
    handleLoad(){
        getRequestList()
            .then(result => {
                this.requests = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

}