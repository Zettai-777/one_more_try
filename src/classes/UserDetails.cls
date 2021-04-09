public class UserDetails {
	@AuraEnabled(cacheable=true)
	public static User getUserDetails(String recId){
		return [SELECT Id, Name, Email, Username, ManagerId FROM User WHERE Id =: recId];
	}
}