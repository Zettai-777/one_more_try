trigger HelloWorldAccountTrigger on Account (before insert) {

	MyHelloWorld.addHelloWorld(Trigger.new);

}