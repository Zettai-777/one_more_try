@IsTest
private class VacationRequestTestClass {

	@TestSetup
	private static void createTestListOfRequest() {
		Vacation_Request__c request1 = new Vacation_Request__c(
				RequestType__c = 'Vacation',
				StartDate__c = Date.parse('01.01.2020'),
				EndDate__c = Date.parse('12.01.2020'),
				Status__c = 'Approved'
		);
		Vacation_Request__c request2 = new Vacation_Request__c(
				RequestType__c = 'Sick',
				StartDate__c = Date.parse('12.04.2020'),
				EndDate__c = Date.parse('24.04.2020'),
				Status__c = 'Submitted'
		);

		Vacation_Request__c request3 = new Vacation_Request__c(
				RequestType__c = 'Unpaid',
				StartDate__c = Date.parse('12.04.2021'),
				EndDate__c = Date.parse('16.04.2021'),
				Status__c = 'New'
		);

		List<Vacation_Request__c> testList = new List<Vacation_Request__c>();
		testList.add(request1);
		testList.add(request2);
		testList.add(request3);
		insert testList;
	}


	@isTest static void testOfGettingListOfRequests() {
		List<Vacation_Request__c> requests = VacationRequestController.getRequestList();
		System.assertEquals(false, requests.isEmpty());
		System.assertEquals(3, requests.size());
		System.assertEquals('Vacation',requests[0].RequestType__c);
		System.assertEquals(Date.parse('01.01.2020'),requests[0].StartDate__c);
		System.assertEquals(Date.parse('12.01.2020'),requests[0].EndDate__c);
		System.assertEquals('Approved',requests[0].Status__c);
	}

	@isTest static void testOfDateEvaluateTrigger() {
		Vacation_Request__c testRequest1 = [SELECT WorkingDays__c FROM Vacation_Request__c WHERE Status__c =: 'New'];
		Vacation_Request__c testRequest2 = [SELECT WorkingDays__c FROM Vacation_Request__c WHERE Status__c =: 'Submitted'];
		System.assertEquals(4,testRequest1.WorkingDays__c);
		System.assertEquals(8,testRequest2.WorkingDays__c);
//		System.assertEquals(4,testRequest.WorkingDays__c);
	}
}