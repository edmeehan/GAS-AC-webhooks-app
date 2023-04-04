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
