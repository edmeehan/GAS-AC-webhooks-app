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

// timeularAPI reporting time bounds
function getCurrentMonthBounds() {
  // Get the current year and month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  // Set the date to the first day of the month
  const firstDay = new Date(year, month - 1, 1);
  // Set the date to the last day of the month
  const lastDay = new Date(year, month, 0);
  // Set the time for the first minute of the month
  firstDay.setHours(0, 0, 0, 0);
  // Set the time for the last minute of the month
  lastDay.setHours(23, 59, 59, 999);
  // Return the ISO strings for the first and last minute of the month
  // UTC offset suffix Z breaks the api request - remove it
  return [firstDay.toISOString().replace('Z',''), lastDay.toISOString().replace('Z','')];
}

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