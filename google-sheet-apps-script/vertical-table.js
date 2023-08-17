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
    var spreadsheet = SpreadsheetApp.create("Data from URL");
  
    // Get the first sheet in the spreadsheet.
    var sheet = spreadsheet.getSheets()[0];
  
    // Iterate over the records in the XML.
    var records = listRecords.getChildren("record", nsOAI);
    for (var i = 0; i < 20; i++) {
      var metadata = records[i].getChild("metadata", nsOAI).getChild("dc", nsDC);
  
      // Iterate over the elements within the metadata.
      var metadataChildren = metadata.getChildren();
      for (var j = 0; j < metadataChildren.length; j++) {
        var name = metadataChildren[j].getName();
        var value = metadataChildren[j].getText();
  
        // Add the name and value to the sheet.
        sheet.appendRow([name, value]);
      }
    }
  }
  