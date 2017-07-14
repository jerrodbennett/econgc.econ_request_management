var PageComponent = require("ds.base/PageComponent");

var CardListServer = PageComponent.create({
	data: function(attributes, vars, containerList) {
		var recordArray = [];
        var bucketName = attributes.bucket;
        var condition = attributes.condition;
        var titleSlot1 = attributes.title_slot_1;
        var titleSlot2 = attributes.title_slot_2;
        var titleSlot3 = attributes.title_slot_3;
        var descriptionSlot = attributes.description_slot;
        var iconSlot = attributes.icon_slot;

        //Search
        var fr = new FRecord(bucketName);
        if (condition) {
            fr.addEncodedSearch(condition);
        }
        fr.search();
        while (fr.next()) {
            //Create the recordObject for this record
            var recordObject = {};
            var title = fr[titleSlot1].getDisplayValue();
            if (!Object.isNil(titleSlot2)) {
            	title += " - " + fr[titleSlot2].getDisplayValue();
            }
            if (!Object.isNil(titleSlot3)) {
                title += " - " + fr[titleSlot3].getDisplayValue();
            }
            var description = fr[descriptionSlot].getDisplayValue();
            //var icon = fr[iconSlot].getDisplayValue();
			var icon = "briefcase";
            var iconFullName = fr.service.icon;
            if (!Object.isNil(iconFullName)) {
                icon = iconFullName.split(":")[1];
            }
            var id = fr.id;

			recordObject.title = title
            recordObject.description = description;
            recordObject.icon = icon;
			recordObject.id = id;

			//if (!Object.isNil(resourceSlot)) {
			//	recordObject.resourceId = fr[resourceSlot];
			//	if (!Object.isNil(recordObject.resourceId)) {
			//		resourceBucketName = fr[resourceSlot].getFRecord().getBucketName();
			//	}
			//}

			//Now add this recordObject to the recordArray
			recordArray.push(recordObject);
        }
		
		return new StatusResponse('good', {
            records: recordArray,
		});
	},
	
	type: "CardListServer"
});

module.exports = CardListServer;