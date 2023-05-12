const webhookResult = {status:'success'};
let requestParameters, requestBody;

function doPost(e = {}) {
  const webhookKey = PropertiesService.getScriptProperties().getProperty('key');
  const {parameter = {}, queryString = null, postData = {}} = e; //https://developers.google.com/apps-script/guides/web
  
  // query string required
  if (!queryString) webhookResult.status = 'oops - did you forget something? Review and try again.';
  
  // parse the query string to handle the webhook
  const query = parseQueryString(queryString);
  
  // validate the key and id
  if (
    Object.hasOwn(query,'key') &&
    Object.hasOwn(query,'id') &&
    query.key[0] === webhookKey
  ) {
    requestParameters = parameter;
    console.log(postData.type);
    if (postData.type.toLowerCase().includes('json')) requestBody = JSON.parse(postData.contents);

    switch (query.id[0]) {
      case 'automation-19-webhook': webhook_ac19(); break;
      case 'automation-21-webhook': webhook_ac21(); break;
      case 'automation-23-webhook': webhook_ac23(); break;
      case 'esig-webhook': webhook_esig(); break;
    }
  } else {
    webhookResult.status = 'oops - sorry your request cant be handled like this, review and try again.';
  }

  return ContentService.createTextOutput(JSON.stringify(webhookResult))
    .setMimeType(ContentService.MimeType.JSON);
}