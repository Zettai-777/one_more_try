trigger dateEvaluateTrigger on Vacation_Request__c (before insert) {
	Date refDate = Date.newInstance( 1900, 1, 8);

	for(Vacation_Request__c field : Trigger.new){
		Integer startDateMinusRefDate = field.StartDate__c.daysBetween(refDate);
		Integer endDateMinusRefDate = field.EndDate__c.daysBetween(refDate);

		Decimal startDateWorkDelta = 5 * Math.floor((Double) (startDateMinusRefDate/7)) + Math.min( 5, Math.mod(startDateMinusRefDate , 7 ) );
		Decimal endDateWorkDelta = 5 * Math.floor((Double) (endDateMinusRefDate/7)) + Math.min( 5, Math.mod(endDateMinusRefDate , 7 ) );

		field.put('WorkingDays__c', startDateWorkDelta - endDateWorkDelta);
	}

}