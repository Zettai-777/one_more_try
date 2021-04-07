public with sharing class VacationRequestController {

	public String userName{get; set;}

	public VacationRequestController() {
		userName = 'Zettai';
	}

	@AuraEnabled(cacheable = false)
	public static List<Vacation_Request__c> getRequestList() {
		return [
				SELECT Name, RequestType__c, StartDate__c, EndDate__c,
				WorkingDays__c, Manager__c, Status__c
				FROM Vacation_Request__c
		];
	}

//	@AuraEnabled(cacheable = false)
	public static List<SObjectField> getUserFields(){
		List<SObjectField> userFields = new List<SObjectField>();
		userFields.add(User.Name);
		userFields.add(User.ManagerId);
		return userFields;
	}

	public static void getFields() {
		Schema.DescribeSObjectResult described = Schema.getGlobalDescribe().get('Vacation_Request__c').getDescribe();
		//get the fields list
		Map<String, Schema.SObjectField> fieldsMap = described.fields.getMap();
		for (String fieldName : fieldsMap.keySet()) {
			Schema.SObjectField field = fieldsMap.get(fieldName);
			Schema.DescribeFieldResult fieldDescribed = field.getDescribe();

			if (!fieldDescribed.isNillable()) {
				System.debug(fieldName + ' is Mandatory');
			}
		}
	}
}