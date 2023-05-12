function webhook_esig(tStatus, tMetaData) {
  const { status, data } = requestBody || {};
  const webhookStatus = tStatus || status;
  const meta = JSON.parse(tMetaData || data?.contract?.metadata || "{}");

  if (webhookStatus === 'contract-signed') {
    const {dealID} = meta;
    
    if (!dealID) {
      webhookResult.status = 'no deal found';
      return;
    }

    const dealsInstance = ActiveCampaignAPI.fetchDealFields();
    
    // Update Deal with Proposal URL
    dealsInstance.setValue('Signed', 'DEAL_AGREEMENT_STATUS', dealID);

    console.log('webhook contract-signed finished');
  }
}

function webhook_esig_test() {
  webhook_esig('contract-signed','{"dealID":"55"}');
}