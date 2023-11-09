/**
 * Extracts the year, month, and date from a given timestamp string.
 *
 * @param timePublished - A string representing a timestamp.
 * @returns A string formatted as 'yyyy-mm-dd' representing the extracted year, month, and date.
 * @throws {Error} Will throw an error if the provided timestamp string is invalid.
 *
 * @example
 * ```typescript
 * const timestamp = '2023-11-09T12:30:00Z';
 * const result = extractYearMonthDate(timestamp);
 * console.log(result); // Output: '2023-11-09'
 * ```
 */
export function extractYearMonthDate(timePublished: string): string {
  const date = new Date(timePublished);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp format. Please provide a valid ISO string.');
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
