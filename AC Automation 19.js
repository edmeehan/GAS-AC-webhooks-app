// https://edmeehan.activehosted.com/series/19 - Stage Entered - Qualified Lead
// makes a client folder and adds a copy of the proposal to it
function webhook_ac19(testID) {
  console.log('webhook ac19 started - ', testID);
  const contactId = testID || requestParameters['contact[id]'];

  const contact = ActiveCampaignAPI.fetchContact(contactId);
  const account = contact.fetchAccount();
  const deals = contact.dealsQualifiedLead;

  if (deals.length < 1) {
    webhookResult.status = 'no deal found';
    return;
  }

  // find or create the cleint and project folder
  const clientsFolderID = PropertiesService.getScriptProperties().getProperty('driveClientsFolder');
  const clientFolder = findCreateFolder(account.name, clientsFolderID);
  const dealsInstance = ActiveCampaignAPI.fetchDealFields();

  deals.forEach(({title,id,value}) => {
    const projectFolder = findCreateFolder(title, clientFolder.getId());

    // Clone and update the Proposal Template and put it in the account folder
    const proposalTemplateID = PropertiesService.getScriptProperties().getProperty('proposalTemplateID');
    const proposalFile = DriveApp.getFileById(proposalTemplateID)
      .makeCopy()
      .setName('Proposal')
      .setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW)
      .moveTo(projectFolder);
    const proposalID = proposalFile.getId();

    // Get Proposal Share URL
    const shareURL = `https://docs.google.com/presentation/d/${proposalID}`;

    // Update Proposal with info from deal
    const presentation = SlidesApp.openById(proposalID);
    const findAndReplace = [
      ['{{cost}}', (Number(value) / 100).toString()],
      ['{{account}}', account.name ]
    ]
    findAndReplace.forEach((item) => presentation.replaceAllText(...item, true));

    // Update Deal with Proposal URL
    dealsInstance.setValue(shareURL, 'DEAL_PROPOSAL_URL', id);
  })

  // FINISH - maybe add a trigger or something to set the next steps in motion
  console.log('webhook ac19 finished');
}

function webhook_ac19_test() {
  webhook_ac19(58);
}