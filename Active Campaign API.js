// const appProps = PropertiesService.getScriptProperties();
const acAPI = PropertiesService.getScriptProperties().getProperty('acAPI');
const acKey = PropertiesService.getScriptProperties().getProperty('acKey');

function getContact(contactId) {
  if (!contactId) return false;
  //https://developers.activecampaign.com/reference/get-contact
  const response = UrlFetchApp.fetch(`${acAPI}/contacts/${contactId}`,{headers: {'Api-Token': acKey}});
  //https://developers.google.com/apps-script/reference/url-fetch/http-response#getContentText()
  const contact = JSON.parse(response.getContentText());
  return contact;
}

function getAccount(accountId) {
  if (!accountId) return false;
  //https://developers.activecampaign.com/reference/retrieve-an-account
  const response = UrlFetchApp.fetch(`${acAPI}/accounts/${accountId}`,{headers: {'Api-Token': acKey}});
  //https://developers.google.com/apps-script/reference/url-fetch/http-response#getContentText()
  const account = JSON.parse(response.getContentText());
  return account;
}

function getAccountFields(accountId) {
  if (!accountId) return false;
  //https://developers.activecampaign.com/reference/retrieve-an-account
  const response = UrlFetchApp.fetch(`${acAPI}/accounts/${accountId}/accountCustomFieldData`,{headers: {'Api-Token': acKey}});
  //https://developers.google.com/apps-script/reference/url-fetch/http-response#getContentText()
  const accountFields = JSON.parse(response.getContentText());
  return accountFields;
}

function putAccountFields(accountId, payload) {
  if (!accountId) return false;
  //https://developers.activecampaign.com/reference/retrieve-an-account
  const response = UrlFetchApp.fetch(`${acAPI}/accounts/${accountId}`,{
    method: 'put',
    headers: {'Api-Token': acKey},
    payload: JSON.stringify(payload)
  });
  //https://developers.google.com/apps-script/reference/url-fetch/http-response#getContentText()
  const account = JSON.parse(response.getContentText());
  return account;
}