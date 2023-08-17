function fetchAndPlaceData() {
    // Get the URL of the data source.
    var url = "https://yourdomain.com/oai/request?verb=ListRecords&resumptionToken=oai_dc////100";
  
    // Fetch the data from the URL.
    var response = UrlFetchApp.fetch(url);
    var xml = response.getContentText();
  
    // Parse the XML.
    var document = XmlService.parse(xml);
    var root = document.getRootElement();
    var nsOAI = XmlService.getNamespace("http://www.openarchives.org/OAI/2.0/");
    var nsDC = XmlService.getNamespace("http://www.openarchives.org/OAI/2.0/oai_dc/");
  
    // Get the ListRecords element.
    var listRecords = root.getChild("ListRecords", nsOAI);
  
    // Create a new spreadsheet.
    var spreadsheet = SpreadsheetApp.create("yatay");
  
    // Get the first sheet in the spreadsheet.
    var sheet = spreadsheet.getSheets()[0];
  
    // Initialize an array to hold the headers (tag names).
    var headers = [];
  
    // Iterate over the records in the XML to extract headers and data.
    var records = listRecords.getChildren("record", nsOAI);
    for (var i = 0; i < 20; i++) {
      var metadata = records[i].getChild("metadata", nsOAI).getChild("dc", nsDC);
  
      // Iterate over the elements within the metadata.
      var metadataChildren = metadata.getChildren();
      var rowData = [];
  
      for (var j = 0; j < metadataChildren.length; j++) {
        var name = metadataChildren[j].getName();
        var value = metadataChildren[j].getText();
  
        // If the header is not already added, add it to the headers array.
        if (headers.indexOf(name) === -1) {
          headers.push(name);
        }
  
        // Add the value to the corresponding index in the rowData array.
        rowData[headers.indexOf(name)] = value;
      }
  
      // Add the row data to the sheet.
      sheet.appendRow(rowData);
    }
  
    // Add headers as the first row in the sheet.
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  