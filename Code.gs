function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('المركز الدولي للعيون - مكافحة العدوى')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// إعدادات Google Sheets
var APP_SHEET_NAME = "المركز الدولي للعيون - مكافحة العدوى";

function getAppSpreadsheet() {
  var files = DriveApp.getFilesByName(APP_SHEET_NAME);
  while (files.hasNext()) {
    var file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS) {
      return SpreadsheetApp.openById(file.getId());
    }
  }
  return SpreadsheetApp.create(APP_SHEET_NAME);
}

function savePoliciesToSheet(policies) {
  try {
    var ss = getAppSpreadsheet();
    var sheet = ss.getSheetByName("Policies");
    if (!sheet) {
      sheet = ss.insertSheet("Policies");
      sheet.appendRow(["ID", "Name", "Date"]);
    } else {
      sheet.clear();
      sheet.appendRow(["ID", "Name", "Date"]);
    }
    
    if (policies && policies.length > 0) {
      var data = policies.map(function(p) { return [p.id, p.name, p.date]; });
      sheet.getRange(2, 1, data.length, 3).setValues(data);
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function loadPoliciesFromSheet() {
  try {
    var ss = getAppSpreadsheet();
    var sheet = ss.getSheetByName("Policies");
    if (!sheet) return [];
    
    var data = sheet.getDataRange().getValues();
    var policies = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) {
        policies.push({
          id: data[i][0].toString(),
          name: data[i][1].toString(),
          date: data[i][2].toString()
        });
      }
    }
    return policies;
  } catch (e) {
    return [];
  }
}

function saveArchiveToSheet(archive) {
  try {
    var ss = getAppSpreadsheet();
    var sheet = ss.getSheetByName("Archives");
    if (!sheet) {
      sheet = ss.insertSheet("Archives");
      sheet.appendRow(["ID", "Date", "Time", "Inspector", "Compliance", "Data_JSON"]);
    }
    
    sheet.appendRow([
      archive.id,
      archive.date,
      archive.time,
      archive.inspectorName,
      archive.compliancePercentage,
      JSON.stringify(archive)
    ]);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function loadArchivesFromSheet() {
  try {
    var ss = getAppSpreadsheet();
    var sheet = ss.getSheetByName("Archives");
    if (!sheet) return [];
    
    var data = sheet.getDataRange().getValues();
    var archives = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][5]) {
        try {
          var archive = JSON.parse(data[i][5].toString());
          archives.push(archive);
        } catch (err) {
          // Skip invalid JSON
        }
      }
    }
    // Sort by date descending (newest first)
    archives.sort(function(a, b) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return archives;
  } catch (e) {
    return [];
  }
}

function doPost(e) {
  try {
    var params;
    if (e.parameter && e.parameter.data) {
      params = JSON.parse(e.parameter.data);
    } else {
      params = JSON.parse(e.postData.contents);
    }
    
    var action = params.action;
    var result = {};

    if (action === 'savePolicies') {
      result = savePoliciesToSheet(params.policies);
    } else if (action === 'loadPolicies') {
      result = { policies: loadPoliciesFromSheet() };
    } else if (action === 'saveArchive') {
      result = saveArchiveToSheet(params.archive);
    } else if (action === 'loadArchives') {
      result = { archives: loadArchivesFromSheet() };
    } else if (action === 'generateAI') {
      result = { text: generateCorrectiveActionGAS(params.prompt) };
    } else {
      result = { error: 'Unknown action: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// دالة توليد الإجراء التصحيحي باستخدام Gemini API
function generateCorrectiveActionGAS(prompt) {
  // هام جداً: ضع مفتاح Gemini API الخاص بك هنا
  var apiKey = 'AIzaSyDyYHTiE_E_g-uoFZOxbRYyM3MyxQhQQqQ'; 
  
  if (apiKey === 'ضع_مفتاح_GEMINI_هنا') {
    return "خطأ: يرجى إضافة مفتاح Gemini API في ملف Code.gs";
  }

  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;
  
  var payload = {
    "contents": [{
      "parts": [{
        "text": prompt
      }]
    }]
  };
  
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseText = response.getContentText();
    var json = JSON.parse(responseText);
    
    if (json.candidates && json.candidates.length > 0) {
      return json.candidates[0].content.parts[0].text;
    } else if (json.error) {
      return "خطأ من Gemini API: " + json.error.message;
    } else {
      return "خطأ في التوليد: " + responseText;
    }
  } catch (e) {
    return "خطأ في الاتصال: " + e.toString();
  }
}
