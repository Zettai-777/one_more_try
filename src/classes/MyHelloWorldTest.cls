@IsTest
private class MyHelloWorldTest {

	@IsTest static void testAddHelloWorld() {
		Account acc1 = new Account();
		Account acc2 = new Account(Description = 'mistake');
		Account[] accounts = new Account[]{acc1, acc2};

		MyHelloWorld.addHelloWorld(accounts);

		System.assertEquals('Hello, World!',accounts[0].Description);
		System.assertEquals('Hello, World!',accounts[1].Description);

//		Test.startTest();
//		Test.stopTest();
	}

	@IsTest static void testHelloWorldAccountTrigger(){
		Account acc1 = new Account(Name='One');
		Account acc2 = new Account(Name='Two');
		Account[] accounts = new Account[]{acc1, acc2};

		insert accounts;

		Account[] accQuery = [SELECT Description FROM Account WHERE Id = :accounts[0].Id OR Id = :accounts[1].Id];
		System.assertEquals('Hello, World!',accQuery[0].Description);
		System.assertEquals('Hello, World!',accQuery[1].Description);
	}
}