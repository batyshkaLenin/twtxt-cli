const moment = require('moment/moment');
const { parseTimeline } = require('../src/utils');

describe('Utils test', () => {
  test('Parse timeline', () => {
    const timelineText = `${moment().format()}\tTest message 1
${moment().format()}\tTest message 2`;

    const timeline = parseTimeline(timelineText);

    expect(timeline.length).toBe(2);

    timeline.forEach(({ date, text }) => {
      expect(moment.isMoment(date)).toBe(true);
      expect(typeof text).toBe('string');
    });
  });
});
