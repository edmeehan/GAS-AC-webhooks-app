const appProps = PropertiesService.getScriptProperties();
const webhookResult = {status:'success'};
const acDomain = appProps.getProperty('acDomain');
const acKey = appProps.getProperty('acKey');
let requestParameters;

function doPost(e = {}) {
  const {parameter = {}, queryString = null} = e; //https://developers.google.com/apps-script/guides/web
  
  // query string required
  if (!queryString) webhookResult.status = 'oops - did you forget something? Review and try again.';
  
  // parse the query string to handle the webhook
  const query = parseQueryString(queryString);
  
  // validate the key and id
  if (
    Object.hasOwn(query,'key') &&
    Object.hasOwn(query,'id') &&
    query.key[0] === appProps.getProperty('key')
  ) {
    requestParameters = parameter;
    switch (query.id[0]) {
      case 'automation-19-webhook': webhook_1(); break;
      case 'automation-23-webhook': webhook_2(); break;
    }
  } else {
    webhookResult.status = 'oops - sorry your request cant be handled like this, review and try again.';
  }

  return ContentService.createTextOutput(JSON.stringify(webhookResult))
    .setMimeType(ContentService.MimeType.JSON);
}