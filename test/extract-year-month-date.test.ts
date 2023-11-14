/**
 * extractYearMonthDate Test
 *
 * This test suite validates the behavior of the extractYearMonthDate function when
 * extracting the year, month, and date from received message.
 */
import { extractYearMonthDate } from '../src/utilities/extract-year-month-date';

describe('extractYearMonthDate', () => {
  it('should extract year, month, and date from a timestamp', () => {
    const timePublished = '2023-11-06 09:22:33';
    const expectedDate = '2023-11-06';

    const result = extractYearMonthDate(timePublished);

    expect(result).toEqual(expectedDate);
  });
});
