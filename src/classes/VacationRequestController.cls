public with sharing class VacationRequestController {

	public VacationRequestController(){}

	@AuraEnabled(cacheable = false)
	public static List<Vacation_Request__c> getRequestList() {
		return [
				SELECT Vacation_Request__c.RequestType__c, Vacation_Request__c.StartDate__c,
				Vacation_Request__c.EndDate__c, Vacation_Request__c.WorkingDays__c,
				Vacation_Request__c.Manager__c, Vacation_Request__c.Status__c
				FROM Vacation_Request__c
		];
	}

}