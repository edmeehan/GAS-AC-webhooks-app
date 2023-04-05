// https://edmeehan.activehosted.com/series/23
// account field ids:
// 13: monthly total, 14: monthly budget, 15: hourly rate, 16: graphic URL, 17: Timeular Mention ID

function webhook_2() {
  const contactId = requestParameters['contact[id]'];

  // fetch user account > get org id
  // https://edmeehan.api-us1.com/api/3/accounts/${accountID}
  const contact = getContact(contactId);

  if (!contact) {
    webhookResult.status = 'no contact';
    return;
  }

  const { id: accountId } = contact?.accounts[0] || {};

  // fetch org information -> https://edmeehan.api-us1.com/api/3/accounts/${accountID}/accountCustomFieldData
  // get hourly rate & monthly budget
  const accountFields = getAccountFields(accountId);

  if (!accountFields) {
    webhookResult.status = 'no account';
    return;
  }

  const fields = accountFields?.customerAccountCustomFieldData?.filter(({custom_field_id}) => {
    return custom_field_id === '14' || custom_field_id === '15';
  }).map((item) => {
    if (item.custom_field_id === '14') return {name:'budget', value: Number(item.custom_field_number_value) };
    if (item.custom_field_id === '15') return {name:'hourly_rate', value: Number(item.custom_field_currency_value) };
    if (item.custom_field_id === '17') return {name:'timeular_mention', value: Number(item.custom_field_text_value) };
  });
  const fieldsData = Object.assign(...fields);

  // fetch hours from timerly
  // https://api.timeular.com/api/v3/report/data/2023-03-01T08:00:00.000/2023-04-01T07:59:59.999
  const [start,end] = getCurrentMonthBounds();
  const timeData = montlyHourReport(start,end,fieldsData.timeular_mention);

  // fetch graphic to display in email
  // https://developers.google.com/chart/interactive/docs/quick_start

}

