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
    var spreadsheet = SpreadsheetApp.create("DataOAI");
  
    // Get the first sheet in the spreadsheet.
    var sheet = spreadsheet.getSheets()[0];
  
    // Initialize arrays to hold headers (tag names) and data.
    var headers = [];
    var dataRows = [];
  
    // Iterate over the records in the XML to extract headers and data.
    var records = listRecords.getChildren("record", nsOAI);
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      var header = record.getChild("header", nsOAI);
  
      // Extract values from header.
      var headerData = {};
      var headerChildren = header.getChildren();
      for (var k = 0; k < headerChildren.length; k++) {
        var headerTagName = headerChildren[k].getName();
        var headerTagValue = headerChildren[k].getText();
        if (headerData[headerTagName]) {
          headerData[headerTagName] += " --- " + headerTagValue;
        } else {
          headerData[headerTagName] = headerTagValue;
        }
        if (headers.indexOf(headerTagName) === -1) {
          headers.push(headerTagName);
        }
      }
  
      // Initialize rowData object.
      var rowData = {};
  
      // Add header values to the rowData object.
      for (var h = 0; h < headers.length; h++) {
        rowData[headers[h]] = headerData[headers[h]] || "";
      }
  
      // Iterate over the metadata.
      var metadata = record.getChild("metadata", nsOAI).getChild("dc", nsDC);
      var metadataChildren = metadata.getChildren();
  
      // Process metadata elements.
      for (var j = 0; j < metadataChildren.length; j++) {
        var name = metadataChildren[j].getName();
        var value = metadataChildren[j].getText();
      
        if (name === "identifier") {
          if (headers.indexOf("metadataIdentifier") === -1) {
            headers.push("metadataIdentifier");
          }
          if (rowData["metadataIdentifier"]) {
            rowData["metadataIdentifier"] += " --- " + value;
          } else {
            rowData["metadataIdentifier"] = value;
          }
        } else {
          if (headers.indexOf(name) === -1) {
            headers.push(name);
          }
          if (rowData[name]) {
            rowData[name] += " --- " + value;
          } else {
            rowData[name] = value;
          }
        }
      }
  
      // Push the rowData object to dataRows array.
      dataRows.push(rowData);
    }
  
    // Convert dataRows to an array of arrays.
    var dataArrays = dataRows.map(rowData => headers.map(header => rowData[header] || ""));
  
    // Add headers as the first row in the sheet.
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
    // Add data rows to the sheet.
    sheet.getRange(2, 1, dataArrays.length, headers.length).setValues(dataArrays);
  }
  