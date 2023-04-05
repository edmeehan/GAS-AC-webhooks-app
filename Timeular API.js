const timeularProps = PropertiesService.getScriptProperties();
const timeularAPI = timeularProps.getProperty('timeularAPI');
const timeularKey = timeularProps.getProperty('timeularKey');
const timeularSecret = timeularProps.getProperty('timeularSecret');
const timeularToken = timeularProps.getProperty('timeularTokenJSON');
const timeularActivityIds = {
  webdev: '1071551',
  meeting: '1071513'
}

function montlyHourReport(start, end, mentionID) {
  const token = validateTimeularToken();
  if (!token) return false;

  const response = UrlFetchApp.fetch(`${timeularAPI}/report/data/${start}/${end}`,{
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const responseData = JSON.parse(response.getContentText());
  const {timeEntries} = responseData;
  const filteredEntriesByMentionID = timeEntries.filter(
      (item) => item.note.mentions.filter(
          (item) => item.id === mentionID
      ).length > 0 && item.activity.id === timeularActivityIds.webdev || item.activity.id === timeularActivityIds.meeting
  );
  const webdevTime = [];
  const meetingTime = [];

  filteredEntriesByMentionID.foreach((item) => {
      const date1 = new Date(item.duration.startedAt);
      const date2 = new Date(item.duration.stoppedAt);
      const diff = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
      // gather all webdev activities
      if (item.activity.id === timeularActivityIds.webdev) {
        webdevTime.push(diff);
      }
      // gather all meeting activities
      if (item.activity.id === timeularActivityIds.meeting) {
        meetingTime.push(diff);
      }
  })
  // return webdev and meeting hours
  return {
    webdev: webdevTime.reduce((item, value) => item + value, 0).toFixed(2),
    meeting: meetingTime.reduce((item, value) => item + value, 0).toFixed(2),
  }
}

function fetchTimeularToken() {
  const response = UrlFetchApp.fetch(`${timeularAPI}/developer/sign-in`,{
    method: 'post',
    payload: JSON.stringify({
        apiKey : timeularKey,
        apiSecret : timeularSecret,
    })
  });
  const {token} = JSON.parse(response.getContentText());
  try {
    const property = JSON.stringify({timestamp: Date().toISOString(), token});
    timeularProps.setProperty('timeularTokenJSON', property);
    return token;
  } catch (err) {
    console.log('Failed with error %s', err.message);
    return false;
  }
}

function validateTimeularToken() {
  let timeularTokenJSON = timeularProps.getProperty('timeularTokenJSON');
  let activeToken = false;
  
  if (timeularTokenJSON.length > 0) {
    const { token, timestamp } = JSON.parse(timeularTokenJSON);
    const now = Date.now();
    const tokenized = Date.parse(timestamp);
    const daysTokenLive = Math.round((now - tokenized) / (1000 * 60 * 60 * 24));
    if (daysTokenLive < 7) activeToken = token; 
  }

  if (!activeToken) {
    activeToken = fetchTimeularToken();
  }
  
  return activeToken;
}
