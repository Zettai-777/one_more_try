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
				FROM Vacation_Request__c LIMIT 50
		];
	}

	@AuraEnabled(cacheable = false)
	public static List<Vacation_Request__c> getDeletedRequestList(String deletedId){
		List<Vacation_Request__c> requestList = [SELECT Id, Status__c FROM Vacation_Request__c WHERE Id =: deletedId];
		return requestList;
	}

	@AuraEnabled(cacheable = false)
	public static List<Vacation_Request__c> updateStatusField(String updatedId, String typeOfRequest){
		List<Vacation_Request__c> requests = [
				SELECT Name, CreatedById, RequestType__c, StartDate__c, EndDate__c,
						WorkingDays__c, Manager__c, Status__c
				FROM Vacation_Request__c];
		List<Vacation_Request__c> updatedRequests = new List<Vacation_Request__c>();
		for(Vacation_Request__c request : requests){
			if(request.Id.equals(updatedId)){
				request.Status__c = typeOfRequest;
			}
			updatedRequests.add(request);
		}
 		update updatedRequests;
		return updatedRequests;
	}

}