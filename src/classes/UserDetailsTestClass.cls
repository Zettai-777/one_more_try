@IsTest
private class UserDetailsTestClass {

//	@TestSetup
//	private static void createTestUser() {
//		User testUser = new User(
//				Id = '00509000004sGR1234',
//				Username = 'test_guy',
//				Email = 'just_for_test@yandex.ru',
//				ManagerId = '00509000004sGR5678'
//		);
//		insert testUser;
//	}

	@isTest static void testOfGettingCurrentUserInfo() {
		User u = UserDetails.getUserDetails('00509000004sGRSAA2');
		System.assertEquals('zettai-777@makenai.com', u.Username);
		System.assertEquals('Михаил Байанга', u.Name);
		System.assertEquals('zettai777@gmail.com', u.Email);
		System.assertEquals('00509000004sbIQAAY', u.ManagerId);
	}

//	@isTest static void test2() {
//		User u = UserDetails.getUserDetails('00509000004sGR1234');
//		System.assertEquals('test_guy', u.Username);
//		System.assertEquals('Иван Петрович', u.Name);
//		System.assertEquals('just_for_test@yandex.ru', u.Email);
//		System.assertEquals('00509000004sGR5678', u.ManagerId);
//	}

}