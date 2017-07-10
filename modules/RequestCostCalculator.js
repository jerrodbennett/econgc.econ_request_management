//
//  var RequestCostCalculator = require("dev.econ_request_management/RequestCostCalculator");
// 
//  var rcc = new RequestCostCalculator();
//  rcc.calcCosts($record.id);


var RequestCostCalculator = Class.create({
	calcCosts: function(requestId) {

		//Calculate all relevant costs and update the request accordingly
		var timeCosts = this.calcTimeCosts(requestId);
		var materialCosts = this.calcMaterialCosts(requestId);

		var totalCosts = timeCosts + materialCosts;
		
		var requestRecord = new FRecord('econ_request');
		requestRecord.addSearch('id', requestId);
		requestRecord.search();
		if (requestRecord.next()) {
			requestRecord.actual_cost = totalCosts;
			requestRecord.update();
		}
	},

	calcTimeCosts: function(requestId) {
		var timeCost = 0;

		//Lookup all APPROVED time cards for this request and calc the costs of each one
		var timeCardRecord = new FRecord('time_card');
		timeCardRecord.addSearch('record', requestId);
		//timeCardRecord.addSearch('time_sheet.state.getDisplayValue()', 'Approved');
		timeCardRecord.search();
		while (timeCardRecord.next()) {
			var timeCardRecordTotal = timeCardRecord.total;
			var userHourlyRate = timeCardRecord.user.hourly_rate;

			var timeCardRecordCost = timeCardRecordTotal * userHourlyRate;

			timeCost += timeCardRecordCost;
		}

		return timeCost;
	},

	calcMaterialCosts: function(requestId) {
		var materialCost = 0;

		//Lookup all APPROVED time cards for this request and calc the costs of each one
		var materialRecord = new FRecord('econ_request_material');
		materialRecord.addSearch('request', requestId);
		materialRecord.search();
		while (materialRecord.next()) {
			var materialRecordTotal = materialRecord.total;

			materialCost += materialRecordTotal;
		}

		return materialCost;

	},

	className: "RequestCostCalculator"

});

module.exports = RequestCostCalculator;