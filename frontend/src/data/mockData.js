const mockSuggestions = [
  {
    justification: "This slot avoids scheduled events and provides recovery time before the team reunion later in the day.",
    date: "2024-11-04",
    time: "07:30:00-03:00",
    event_data: {
      summary: "20 mile run",
      start: {
        dateTime: "2024-11-04T06:00:00-03:00",
        timeZone: "America/Sao_Paulo"
      },
      end: {
        dateTime: "2024-11-04T08:30:00-03:00",
        timeZone: "America/Sao_Paulo"
      }
    }
  },
  {
    justification: "Early start to avoid three scheduled classes later in the day, ensuring minimal distractions.",
    date: "2024-11-04",
    time: "06:00:00-03:00",
    event_data: {
      summary: "Long Distance Training Run",
      start: {
        dateTime: "2024-11-03T06:00:00-03:00",
        timeZone: "America/Sao_Paulo"
      },
      end: {
        dateTime: "2024-11-03T08:00:00-03:00",
        timeZone: "America/Sao_Paulo"
      }
    }
  }
];

export default mockSuggestions;
