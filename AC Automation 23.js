// https://edmeehan.activehosted.com/series/23
// account field ids:
// 13: webdev total, 14: monthly budget, 15: hourly rate, 19: graphic URL, 17: Timeular Mention ID, 18: meeting total

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
    return ['14','15','17'].includes(custom_field_id);
  }).map((item) => {
    switch (item.custom_field_id) {
      case '14': return {'budget': Number(item.custom_field_number_value) };
      case '15': return {'hourly_rate': Number(item.custom_field_number_value) };
      case '17': return {'timeular_mention': Number(item.custom_field_number_value) };
    }
  });
  const { budget, hourly_rate, timeular_mention } = Object.assign(...fields);

  // fetch hours from timerly
  // https://api.timeular.com/api/v3/report/data/2023-03-01T08:00:00.000/2023-04-01T07:59:59.999
  const [start,end] = getCurrentMonthBounds();
  const {webdev, meeting} = montlyHourReport(start,end,timeular_mention);

  // fetch graphic to display in email
  // https://developers.google.com/chart/interactive/docs/quick_start
  const imageEncodedString = createBarChart(webdev, meeting, budget);

  // Update Active Campaign with new values
  const payload = {
    account: {
      fields: [
        {
          customFieldId: 13,
          fieldValue: webdev
        },
        {
          customFieldId: 18,
          fieldValue: meeting
        },
        {
          customFieldId: 19,
          fieldValue: imageEncodedString
        }
      ]
    }
  }
  const account = putAccountFields(accountId, payload);

  // console.log(account)
}