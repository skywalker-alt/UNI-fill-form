/**
 * Creator Recruitment Form → Google Sheets
 * Paste this entire script into Google Apps Script (script.google.com)
 * then deploy as a Web App.
 */

const SHEET_NAME = "Responses"; // Change if your sheet tab has a different name

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Age",
        "University",
        "Phone",
        "TikTok",
        "Instagram",
        "Motivation",
        "Comfortable on Camera?",
        "Has Experience?",
        "Hours/Week",
        "Can Deliver in 48–72h?",
        "Serious Commitment?"
      ]);
    }

    // Append the submission row
    sheet.appendRow([
      new Date().toLocaleString(),
      data.fullname    || "",
      data.age         || "",
      data.university  || "",
      data.phone       || "",
      data.tiktok      || "",
      data.instagram   || "",
      data.motivation  || "",
      data.camera      || "",
      data.exp         || "",
      data.hours       || "",
      data.avail       || "",
      data.serious     || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allow CORS preflight requests
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
