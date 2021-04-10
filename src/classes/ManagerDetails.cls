public class ManagerDetails {
	@AuraEnabled(cacheable=true)
	public static User getManagerInformation(String recMId){
		return [SELECT Id, Name, Username FROM User WHERE Id =: recMId];
	}
}