	public with sharing class VacationRequestController {

	public String userName{
		get; set;
	}

	public VacationRequestController() {}

	@AuraEnabled(cacheable = false)
	public static List<Vacation_Request__c> getRequestList() {
		return [
				SELECT Name, CreatedById, RequestType__c, StartDate__c, EndDate__c,
						WorkingDays__c, Manager__c, Status__c
				FROM Vacation_Request__c LIMIT 10
		];
	}

	@AuraEnabled(cacheable = false)
	public static List<Vacation_Request__c> getDeletedRequestList(String deletedId){
		List<Vacation_Request__c> requestList = [SELECT Id, Status__c FROM Vacation_Request__c WHERE Id =: deletedId];
		return requestList;
	}

	@AuraEnabled(cacheable = false)
	public static Vacation_Request__c updateStatusField(String updatedId){
		Vacation_Request__c request = [SELECT Id, Name, Status__c FROM Vacation_Request__c WHERE Id =:updatedId LIMIT 1];
//		request.Status__c = 'Submitted';
//		update request;
		return request;
	}

}