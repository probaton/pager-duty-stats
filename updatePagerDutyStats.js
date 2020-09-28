function updatePagerDutyStats() {
  const statKeeper = new PagerDutyStatKeeper(config.sheetId, config.startDateOffsetInDays, config.endDateOffsetInDays);
  statKeeper.addCalendarEventsToSheet(config.tier1CalendarId, "Tier 1");
  statKeeper.addCalendarEventsToSheet(config.tier2CalendarId, "Tier 2");
}

class PagerDutyStatKeeper {
  constructor(sheetId, startDateOffsetInDays, endDateOffsetInDays) {
    const aDayInMs = 24 * 60 * 60 * 1000;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    this.periodStart = new Date(now.getTime() + (startDateOffsetInDays * aDayInMs));
    this.periodEnd = new Date(now.getTime() + (endDateOffsetInDays * aDayInMs));
    this.sheet = SpreadsheetApp.open(DriveApp.getFileById(sheetId));
  }
  
  getEventsForPeriod(calendarId) {
    return CalendarApp
      .getCalendarById(calendarId)
      .getEvents(this.periodStart, this.periodEnd)
      .filter(event => event.getEndTime() < this.periodEnd);
  }
  
  getPastIds(sheetName) {
    return this.sheet
      .getRange(`${sheetName}!A2:A`)
      .getValues()
      .filter(row => row[0] != '')
      .map(row => row[0]);
  }
  
  addEventToSheet(event, sheetName) {
    const title = event.getTitle();
    const startTime = event.getStartTime();
    const endTime = event.getEndTime();
    this.sheet.getSheetByName(sheetName).appendRow([
      event.getId(),
      title.substring(10, title.length - 21),
      startTime,
      endTime,
      endTime.getTime() - startTime.getTime(),
    ]);
  }
  
  addCalendarEventsToSheet(calendarId, sheetName) {
    const pastIds = this.getPastIds(sheetName);
    this.getEventsForPeriod(calendarId)
      .filter(event => pastIds.indexOf(event.getId()) == -1)
      .forEach(event => this.addEventToSheet(event, sheetName));
  }
}
