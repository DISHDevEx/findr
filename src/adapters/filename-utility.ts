export class FileNameUtility {
    /**
     * Construct a file name by appending the published date to the existing file path.
     * @param pathFile - The path to the local file for saving messages.
     * @param publishedDate - The date to append to the file name.
     * @returns The updated file path with the published date.
     */
    public static constructFileName(pathFile: string, publishedDate: string): string {
      const pathSegments = pathFile.split('/');
      const fileName = pathSegments.pop();
      const parts = fileName.split('.');
      
      if (parts.length === 1) {
        // If there's no dot, simply append the publishedDate
        return pathFile + '_' + publishedDate;
      } else {
        // If there are dot or dots, insert publishedDate in front of the last dot
        const extension = parts.pop();
        const name = parts.join('.');
        return pathSegments.join('/') + '/' + name + '_' + publishedDate + '.' + extension;
      }
    }
  }
  