// Google Apps Script — lim inn i Apps Script editor, deploy som web app
// Tilgang: Anyone (even anonymous)
// Sheet-navn: "Log"

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'get')  return getLastEntries();
  if (action === 'log')  return logEntry(e.parameter.exercise, e.parameter.note || '', e.parameter.date || new Date().toISOString());
  return json({ error: 'unknown action' });
}

function getLastEntries() {
  const data = getOrCreateSheet().getDataRange().getValues();
  const last = {};
  for (let i = 1; i < data.length; i++) {
    const [ts, ex, note] = data[i];
    if (!ex) continue;
    if (!last[ex] || ts > last[ex].date) last[ex] = { date: ts, note };
  }
  return json(last);
}

function logEntry(exercise, note, date) {
  getOrCreateSheet().appendRow([date, exercise, note]);
  return json({ success: true });
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Log');
  if (!sheet) {
    sheet = ss.insertSheet('Log');
    sheet.appendRow(['Timestamp', 'Exercise', 'Note']);
  }
  return sheet;
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
