// https://edmeehan.activehosted.com/series/21 - Stage Entered - Proposal Sent
// sends the contract and retainer invoice
function webhook_ac21(testID) {
  console.log('webhook ac21 started -', testID);
  const contactId = testID || requestParameters['contact[id]'];

  const contact = ActiveCampaignAPI.fetchContact(contactId);
  const account = contact.fetchAccount();
  let deal = contact.dealsProposalSent;

  if (Array.isArray(deal.length) && deal.length < 1) {
    webhookResult.status = 'no deal found';
    return;
  } else {
    deal = deal[0];
  }

  // fetch deal fields
  const dealInstance = ActiveCampaignAPI.fetchDealFields(deal);
  const startDate = dealInstance.getValueByFieldTag('DEAL_START_DATE');
  const servicesList = dealInstance.getValueByFieldTag('DEAL_DELIVERABLES_LIST');
  const paymentDetailsList = dealInstance.getValueByFieldTag('DEAL_PAYMENT_DETAILS');

  // build and send contract
  const contract = ESignaturesAPI.buildServiceAgreement(contact.contractSigner,deal.id);
  contract.serviceAgreementFields = {
    name: account.name,
    address: account.fullAddress,
    startDate,
    servicesList,
    paymentDetailsList
  };
  const contractResponse = contract.sendServiceAgreement(testID ? true : false);

  if (!contractResponse?.data?.contract?.signers) {
    webhookResult.status = 'something went wrong with the contract send';
    return;
  }

  const {sign_page_url} = contractResponse.data.contract.signers.find(({email}) => email === contact.email);

  // Update Deal with Proposal URL
  dealInstance.setValue(sign_page_url, 'DEAL_AGREEMENT_URL');

  console.log('webhook ac21 finished');
}

function webhook_ac21_test() {
  webhook_ac21(58);
}