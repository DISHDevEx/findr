import { extractYearMonthDate } from '../src/extract-year-month-date';

describe('extractYearMonthDate', () => {
  it('should extract year, month, and date from a timestamp', () => {
    const timePublished = '2023-11-06 09:22:33';
    const expectedDate = '2023-11-06';

    const result = extractYearMonthDate(timePublished);

    expect(result).toEqual(expectedDate);
  });
});
