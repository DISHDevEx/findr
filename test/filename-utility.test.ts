/**
 * FileNameUtility Test
 *
 * This test suite validates the behavior of the FileNameUtility class when changing
 * file name based on received message.
 */
import { FileNameUtility } from '../src/utilities/filename-utility';

describe('FileNameUtility', () => {
  it('should construct a file name without extension', () => {
    const path = '/home/ssm-user/mqtt_test/test_file';
    const date = '2015-05-11';
    const result = FileNameUtility.constructFileName(path, date);
    expect(result).toBe('/home/ssm-user/mqtt_test/test_file_2015-05-11');
  });

  it('should construct a file name with extension', () => {
    const path = '/home/ssm-user/mqtt_test/test_file.txt';
    const date = '2015-15-11';
    const result = FileNameUtility.constructFileName(path, date);
    expect(result).toBe('/home/ssm-user/mqtt_test/test_file_2015-15-11.txt');
  });

  it('should handle multiple extensions', () => {
    const path = '/home/ssm-user/mqtt_test/test_file.txt.pdf';
    const date = '2015-15-01';
    const result = FileNameUtility.constructFileName(path, date);
    expect(result).toBe('/home/ssm-user/mqtt_test/test_file.txt_2015-15-01.pdf');
  });
});
