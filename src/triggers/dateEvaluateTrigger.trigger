trigger dateEvaluateTrigger on Vacation_Request__c (before insert) {
	Date refDate = Date.newInstance( 1900, 1, 8);
	Integer startDateMinusRefDate = Trigger.new[0].StartDate__c.daysBetween(refDate);
	Integer endDateMinusRefDate = Trigger.new[0].EndDate__c.daysBetween(refDate);

	Decimal startDateWorkDelta = 5 * Math.floor((Double) (startDateMinusRefDate/7)) + Math.min( 5, Math.mod(startDateMinusRefDate , 7 ) );
	Decimal endDateWorkDelta = 5 * Math.floor((Double) (endDateMinusRefDate/7)) + Math.min( 5, Math.mod(endDateMinusRefDate , 7 ) );

	Trigger.new[0].put('WorkingDays__c', startDateWorkDelta - endDateWorkDelta);
}