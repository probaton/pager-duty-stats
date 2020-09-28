# PagerDuty Stats
A [Google Apps scripts](https://www.google.com/script/start/) that scrapes an imported [PagerDuty](https://www.pagerduty.com/) calendar and saves all events in a Google spreadsheet. The goal is to keep long-term stats on who spends the most time on-call. The script requires the user import the full schedule into their own Google Calendar and create an empty Google sheet to store the results. The script should be imported into a new Google scripts file and set to run periodically. The imported PagerDuty calendar only goes back a month, so the period should be shorter than that. 

