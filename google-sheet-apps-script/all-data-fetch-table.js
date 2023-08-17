var baseUrl = "https://yourdomain.com/oai/request?verb=ListRecords&resumptionToken" +
        "=";

function fetchAndPlaceData() {
    var headers = [];
    var resumptionToken = "oai_dc////100"; // Start with the initial resumption token

    // Create a new spreadsheet
    var spreadsheet = SpreadsheetApp.create("DataOAI-new");
    var sheet = spreadsheet.getSheets()[0];

    while (resumptionToken) {
        var url = baseUrl + resumptionToken;
        Logger.log("Fetching data from URL: " + url);

        // Fetch data from the URL
        var response = UrlFetchApp.fetch(url);
        var xml = response.getContentText();

        // Parse the XML
        var document = XmlService.parse(xml);
        var root = document.getRootElement();
        var nsOAI = XmlService.getNamespace("http://www.openarchives.org/OAI/2.0/");
        var nsDC = XmlService.getNamespace("http://www.openarchives.org/OAI/2.0/oai_dc/");

        // Get the ListRecords element
        var listRecords = root.getChild("ListRecords", nsOAI);

        // Iterate over the records in the XML
        var records = listRecords.getChildren("record", nsOAI);
        for (var i = 0; i < records.length; i++) {
            var record = records[i];

            // Extract header data
            var header = record.getChild("header", nsOAI);
            var headerData = extractTagValues(header, headers);

            // Check if metadata exists before processing
            var metadataElement = record.getChild("metadata", nsOAI);
            if (!metadataElement) {
                continue; // Skip records without metadata
            }

            var metadata = metadataElement.getChild("dc", nsDC);
            var metadataData = extractTagValues(metadata, headers);

            // Concatenate header and metadata values
            var rowData = {};
            for (var h = 0; h < headers.length; h++) {
                rowData[headers[h]] = (headerData[headers[h]] || "") + (metadataData[headers[h]] || "");
            }

            // Add data row to the sheet
            sheet.appendRow(headers.map(header => rowData[header] || ""));
        }

        // Get the next resumptionToken for the next request
        var resumptionTokenElement = listRecords.getChild("resumptionToken", nsOAI);
        if (resumptionTokenElement) {
            resumptionToken = resumptionTokenElement.getText();
            Logger.log("Next resumptionToken: " + resumptionToken);
        } else {
            resumptionToken = null; // No more data to fetch
            Logger.log("No more data to fetch.");
        }
    }
}

// Helper function to extract tag values
function extractTagValues(element, headers) {
    var data = {};
    var children = element.getChildren();
    for (var k = 0; k < children.length; k++) {
        var tagName = children[k].getName();
        var tagValue = children[k].getText();
        if (data[tagName]) {
            data[tagName] += " --- " + tagValue;
        } else {
            data[tagName] = tagValue;
        }
        if (headers.indexOf(tagName) === -1) {
            headers.push(tagName);
        }
    }
    return data;
}

