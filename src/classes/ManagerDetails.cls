public class ManagerDetails {
	@AuraEnabled(cacheable=true)
	public static User getManagerInformation(String recMId){
		return [SELECT Id, Name, Username, ManagerId FROM User WHERE Id =: recMId];
	}
}