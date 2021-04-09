import {LightningElement, track, api, wire} from 'lwc';
import getRequestList from '@salesforce/apex/VacationRequestController.getRequestList';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import getUserDetails from '@salesforce/apex/UserDetails.getUserDetails';
import getManagerInformation from '@salesforce/apex/ManagerDetails.getManagerInformation';
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

    //информация о текущем пользователе
    wiredUser({error, data}) {
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


    @api requests;
    // @track error;
    // Обработка результатов по получению списка request
    handleLoad() {
        getRequestList()
            .then(result => {
                this.requests = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

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


    //уведомление о пустом пользователе
    // @api recordId;
    // fields = [USER_ManagerId];

    // @wire(getRecord, { recordId: '$recordId', fields: [USER_ManagerId]})
    // record;

    // manager= USER_ManagerId;
    // manager= null;
    title = 'Toast';
    message = 'Can not define User information';
    variant = 'submit';

    handleError() {
        this.showToast(this.title, this.message, this.variant);
    }

    managerCheck() {
        if (this.manager == null) {
            this.showToast(this.title, this.message, this.variant);
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
            }),
        );
    }


    //checkbox
    @track flag
    @track myVacations = true;

    handleCheckBox(event) {
        this.flag = event.target.checked;
        if(this.flag){
            // this.myVacations=true;
            this.checkEqualsOfCurUserIdAndCreatedId()
        }else {
            this.myVacations=1;
        }
        // this.myVacations = event.target.checked;

        // let checkbox = this.template.querySelector('[data-id="checkbox"]')
        // checkbox[0].checked = event.target.checked;
    }

    checkEqualsOfCurUserIdAndCreatedId(){
        for (let request of this.requests){
            // alert(request.CreatedById + this.userId);
            if(this.user.Id !== request.CreatedById){
                this.myVacations = null;
                break;
            }else {
                this.myVacations = true;
            }
        }
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

    handleSubmit(event) {
        event.preventDefault(); // stop the form from submitting
        const fields = event.detail.fields;
        // console.log(JSON.stringify(fields));

        fields.Status__c = 'NEW';
        // fields.MobilePhone = '2123123123213';
        // fields.LeadSource = 'Web';
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        const payload = event.detail;
        console.log(JSON.stringify(payload));

        const updatedRecord = event.detail.id;
        console.log('onsuccess: ', updatedRecord);
    }

    // handleChange(event){
    //     this._greeting = event.target.value;
    // }
    //
    // get upperCasedGreeting() {
    //     return this._greeting.toUpperCase();
    // }


}