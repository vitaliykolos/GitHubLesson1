/**
 * Glamorize Spreadsheet - Google Apps Script
 *
 * HOW TO USE:
 * 1. Open your Google Spreadsheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire script
 * 4. Click the "Run" button (or select glamorizeSheet from the dropdown and run)
 * 5. Grant permissions when prompted
 * 6. Your spreadsheet will be glamorized!
 */

function glamorizeSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var dataRange = sheet.getDataRange();
  var numRows = dataRange.getNumRows();
  var numCols = dataRange.getNumColumns();

  if (numRows === 0 || numCols === 0) {
    SpreadsheetApp.getUi().alert("The sheet appears to be empty.");
    return;
  }

  // --- Color Palette (Modern Professional) ---
  var headerBg = "#1B2A4A";        // Deep navy
  var headerFont = "#FFFFFF";       // White text
  var accentColor = "#4A90D9";      // Soft blue accent
  var rowEven = "#F8FAFC";          // Very light blue-gray
  var rowOdd = "#FFFFFF";           // White
  var borderColor = "#D1D9E6";      // Light gray-blue border
  var totalRowBg = "#E8EDF4";       // Light blue for totals/last row emphasis

  // --- 1. Clear existing formatting ---
  dataRange.setBackground(null);
  dataRange.setFontColor("#333333");
  dataRange.setFontFamily("Inter");
  dataRange.setFontSize(10);
  dataRange.setFontWeight("normal");
  dataRange.setFontStyle("normal");
  dataRange.setVerticalAlignment("middle");
  dataRange.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

  // --- 2. Style the Header Row ---
  var headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange.setBackground(headerBg);
  headerRange.setFontColor(headerFont);
  headerRange.setFontSize(11);
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");

  // Add bottom border accent to header
  headerRange.setBorder(null, null, true, null, null, null, accentColor, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Set row height for header
  sheet.setRowHeight(1, 40);

  // --- 3. Alternating Row Colors ---
  for (var i = 2; i <= numRows; i++) {
    var rowRange = sheet.getRange(i, 1, 1, numCols);
    if (i % 2 === 0) {
      rowRange.setBackground(rowEven);
    } else {
      rowRange.setBackground(rowOdd);
    }
    sheet.setRowHeight(i, 30);
  }

  // --- 4. Add Borders ---
  // Outer border on entire data range
  dataRange.setBorder(true, true, true, true, null, null, borderColor, SpreadsheetApp.BorderStyle.SOLID);
  // Inner vertical borders (light)
  dataRange.setBorder(null, null, null, null, true, null, borderColor, SpreadsheetApp.BorderStyle.SOLID);
  // Inner horizontal borders (light)
  dataRange.setBorder(null, null, null, null, null, true, "#E8EDF4", SpreadsheetApp.BorderStyle.DOTTED);

  // --- 5. Auto-detect and format columns ---
  var values = dataRange.getValues();
  var headerValues = values[0];

  for (var col = 0; col < numCols; col++) {
    var colRange = sheet.getRange(2, col + 1, numRows - 1, 1);
    var sampleValues = [];

    // Collect non-empty sample values from the column
    for (var row = 1; row < Math.min(numRows, 20); row++) {
      if (values[row][col] !== "" && values[row][col] !== null) {
        sampleValues.push(values[row][col]);
      }
    }

    if (sampleValues.length > 0) {
      var sample = sampleValues[0];

      // Detect currency columns
      if (typeof sample === "string" && (sample.toString().match(/^\$/) || sample.toString().match(/^€/) || sample.toString().match(/^£/))) {
        colRange.setNumberFormat("$#,##0.00");
        colRange.setHorizontalAlignment("right");
      }
      // Detect percentage columns
      else if (typeof sample === "number" && sample >= 0 && sample <= 1 && headerValues[col].toString().toLowerCase().match(/percent|%|rate|ratio/)) {
        colRange.setNumberFormat("0.0%");
        colRange.setHorizontalAlignment("right");
      }
      // Detect number columns
      else if (typeof sample === "number") {
        if (Number.isInteger(sample) && Math.abs(sample) < 100000) {
          colRange.setNumberFormat("#,##0");
        } else if (typeof sample === "number") {
          colRange.setNumberFormat("#,##0.00");
        }
        colRange.setHorizontalAlignment("right");
      }
      // Detect date columns
      else if (sample instanceof Date) {
        colRange.setNumberFormat("MMM d, yyyy");
        colRange.setHorizontalAlignment("center");
      }
      // Text columns
      else {
        colRange.setHorizontalAlignment("left");
      }
    }
  }

  // --- 6. Auto-resize columns with min/max widths ---
  for (var c = 1; c <= numCols; c++) {
    sheet.autoResizeColumn(c);
    var currentWidth = sheet.getColumnWidth(c);
    if (currentWidth < 80) {
      sheet.setColumnWidth(c, 80);
    } else if (currentWidth > 300) {
      sheet.setColumnWidth(c, 300);
    } else {
      // Add a little padding
      sheet.setColumnWidth(c, currentWidth + 20);
    }
  }

  // --- 7. Freeze the header row ---
  sheet.setFrozenRows(1);

  // --- 8. Add a subtle accent stripe on the first column ---
  if (numRows > 1) {
    var firstColData = sheet.getRange(2, 1, numRows - 1, 1);
    firstColData.setFontWeight("bold");
    firstColData.setFontColor("#1B2A4A");
  }

  // --- 9. Remove gridlines for a cleaner look ---
  sheet.setHiddenGridlines(true);

  // --- 10. Add a filter ---
  if (sheet.getFilter()) {
    sheet.getFilter().remove();
  }
  dataRange.createFilter();

  // --- 11. Set the tab color to match the theme ---
  sheet.setTabColor(accentColor);

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert("✨ Spreadsheet glamorized! ✨");
}

/**
 * Creates a custom menu when the spreadsheet opens
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("✨ Glamorize")
    .addItem("Glamorize This Sheet", "glamorizeSheet")
    .addItem("Reset Formatting", "resetFormatting")
    .addToUi();
}

/**
 * Resets all formatting back to default
 */
function resetFormatting() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var dataRange = sheet.getDataRange();

  dataRange.setBackground(null);
  dataRange.setFontColor(null);
  dataRange.setFontFamily(null);
  dataRange.setFontSize(10);
  dataRange.setFontWeight("normal");
  dataRange.setFontStyle("normal");
  dataRange.setBorder(false, false, false, false, false, false);
  dataRange.setHorizontalAlignment(null);
  dataRange.setVerticalAlignment(null);
  dataRange.setNumberFormat("0.###############");

  sheet.setHiddenGridlines(false);
  sheet.setFrozenRows(0);

  if (sheet.getFilter()) {
    sheet.getFilter().remove();
  }

  for (var c = 1; c <= dataRange.getNumColumns(); c++) {
    sheet.autoResizeColumn(c);
  }

  SpreadsheetApp.getUi().alert("Formatting has been reset.");
}
