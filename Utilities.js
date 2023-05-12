function parseQueryString(query) {
  return query.split("&")
    .reduce((o, e) => {
      const temp = e.split("=");
      const key = temp[0].trim();
      let value = temp[1].trim();
      value = isNaN(value) ? value : Number(value);
      
      if (o[key]) {
        o[key].push(value);
      } else {
        o[key] = [value];
      }
      return o;
    }, {});
};

// returns encoded chart image
function createBarChart(webdev, meeting, budget) {
  // Create the data table
  const dataTable = Charts.newDataTable()
    .addColumn(Charts.ColumnType.STRING, 'Label')
    .addColumn(Charts.ColumnType.NUMBER, 'Hours')
    .addRow(['Billable', webdev])
    .addRow(['Meetings', meeting])
    .build();
  
  // Create the chart and set the chart options
  const chart = Charts.newBarChart()
    .setTitle(null)
    .setXAxisTitle('Hours')
    .setYAxisTitle(null)
    .setDataTable(dataTable)
    .setRange(0, budget)
    .setOption('hAxis.gridlines.count', 5)
    .setLegendPosition(Charts.Position.NONE)
    .setDimensions(610, 200)
    .setColors(['#113f67'])
    .build();
  
  // Get the chart image as a blob
  const chartBlob = chart.getAs('image/png');
  
  // Convert the chart blob to a base64 encoded string
  const base64String = Utilities.base64Encode(chartBlob.getBytes());

  // Encode
  const encodedString = `data:image/png;base64,${encodeURI(base64String)}`;
  
  // Return the base64 encoded string
  return encodedString;
}

// Google Drive, make a folder and return its ID
// if it already exists, then just return the ID
function findCreateFolder(folderName, parentFolderID) {
  // find folder
  const folders = DriveApp.searchFolders(`title = '${folderName}' and '${parentFolderID}' in parents`);
  // condition if folder exists
  if (folders.hasNext()){ // found the folder
    return folders.next();
  } else { // make the folder
    const parentFolder = DriveApp.getFolderById(parentFolderID);
    return parentFolder.createFolder(folderName);
  }
}