@IsTest
private class ManagerDetailsTestClass {
	@isTest static void testOfGettingManagerInfo(){
		User u = ManagerDetails.getManagerInformation('00509000004sbIQAAY');
		System.assertEquals('gonchar_k@gmail.com', u.Username);
		System.assertEquals('Иван Гончаров', u.Name);
		System.assertEquals(null, u.ManagerId);
	}
}