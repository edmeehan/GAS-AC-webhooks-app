// https://edmeehan.activehosted.com/series/23
// PROJECTS PIPELINE : ID = 1
// PROJECT STAGE - QUALIFIED LEAD : ID = 3

function webhook_1 () {
  const acDomain = appProps.getProperty('acDomain');
  const acKey = appProps.getProperty('acKey');
  const contactId = requestParameters['contact[id]'];
  const displayVars = { // accountName, dealName, dealValue
    accountName: requestParameters['contact[orgname]']
  };
  const clientFolderId = appProps.getProperty('driveClientFolder');
  let deal;
  let accountFolderId;

  if (!getDeal()) {
    webhookResult.status = 'no deal found';
    return;
  }

  Logger.log(deal);

  // DO THESE STEPS

  // 1. find or create account folder in the client folder
  findCreateFolder(); // done

  // 2. Clone and update the Proposal Template and put it in the account folder

  // 3. Get Proposal Share URL

  // 4. Update Deal with Proposal URL

  // 5. FINISH - maybe add a trigger or something to set the next steps in motion

  function getDeal() {
    const contact = getContact(contactId);
    if (!contact) return false;   
    //Find the deal that sent the webhook
    deal = contact.deals.find(({group,stage}) => group === "1" && stage === "3");
    if (!deal) return false;
    displayVars.dealName = deal.title;
    displayVars.dealValue = deal.value; // string with no dicimal place

    return true;
  }

  function findCreateFolder() {
    const folders = DriveApp.searchFolders(`title = '${displayVars.accountName}' and '${clientFolderId}' in parents`);
    if (folders.hasNext()){ // found the folder
      accountFolderId = folders.next().getId();
    } else { // make the folder
      const clientFolder = DriveApp.getFolderById(clientFolderId);
      const folder = clientFolder.createFolder(displayVars.accountName);
      accountFolderId = folder.getId();
    }
  }
}
