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
