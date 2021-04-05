public class MyHelloWorld {

	public static void addHelloWorld(Account[] accounts){
		for(Account acc : accounts){
			if(acc.Description != 'Hello, World!')
				acc.Description = 'Hello, World!';
		}
	}

}