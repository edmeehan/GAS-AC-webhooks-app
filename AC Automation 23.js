// https://edmeehan.activehosted.com/series/23 - Clients on retainer - weekly hours report email
// updates account with timeular data used for weekly progress emails
function webhook_ac23(testID) {
  console.log('webhook ac23 started -', testID);

  const contactId = testID || requestParameters['contact[id]'];

  const contact = ActiveCampaignAPI.fetchContact(contactId);
  if (!contact) {
    webhookResult.status = 'no contact';
    return;
  }

  const account = contact.fetchAccount();
  if (!account) {
    webhookResult.status = 'no account';
    return;
  }

  const timeular = TimeularAPI.fetchCurrentMonth(account.timeularMentionID);
  const imageEncodedString = createBarChart(
    timeular.totalWebDevHours,
    timeular.totalMeetingHours,
    account.monthlyHoursBudget
  );

  // Update Active Campaign with new values
  const BILLABLE_HOURS_MTD = 13;
  const MEETING_HOURS_MTD = 18;
  const HOURS_CHART = 19;
  account.setAccountFields({
    account: {
      fields: [
        {
          customFieldId: BILLABLE_HOURS_MTD,
          fieldValue: timeular.totalWebDevHours
        },
        {
          customFieldId: MEETING_HOURS_MTD,
          fieldValue: timeular.totalMeetingHours
        },
        {
          customFieldId: HOURS_CHART,
          fieldValue: imageEncodedString
        }
      ]
    }
  })

  console.log('webhook ac23 finished');
}

function webhook_ac23_test() {
  webhook_ac23(77);
}