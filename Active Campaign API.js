function getContact(contactId) {
  if (!contactId) return false;
  //https://developers.activecampaign.com/reference/get-contact
  const response = UrlFetchApp.fetch(`${acDomain}/api/3/contacts/${contactId}`,{headers: {'Api-Token': acKey}});
  //https://developers.google.com/apps-script/reference/url-fetch/http-response#getContentText()
  const contact = JSON.parse(response.getContentText());
  return contact;
}

function getAccount(accountId) {
  if (!accountId) return false;
  //https://developers.activecampaign.com/reference/retrieve-an-account
  const response = UrlFetchApp.fetch(`${acDomain}/api/3/accounts/${accountId}`,{headers: {'Api-Token': acKey}});
  //https://developers.google.com/apps-script/reference/url-fetch/http-response#getContentText()
  const account = JSON.parse(response.getContentText());
  return account;
}

function getAccountFields(accountId) {
  if (!accountId) return false;
  //https://developers.activecampaign.com/reference/retrieve-an-account
  const response = UrlFetchApp.fetch(`${acDomain}/api/3/accounts/${accountId}/accountCustomFieldData`,{headers: {'Api-Token': acKey}});
  //https://developers.google.com/apps-script/reference/url-fetch/http-response#getContentText()
  const accountFields = JSON.parse(response.getContentText());
  return accountFields;
}