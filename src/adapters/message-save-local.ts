import { writeFile, existsSync, appendFile } from 'fs';

/**
 * LocalMessageSaver class for saving MQTT messages to a local file.
 */
export class LocalMessageSaver {
  private filePath: string;

  /**
   * Initializes the LocalMessageSaver.
   * @param filePath - The path to the local file for saving messages.
   */
  constructor(filePath: string) {
    this.filePath = filePath;
  }

  /**
   * Change the file path to a new one.
   * @param newFilePath - The new file path.
   */
  public changeFilePath(newFilePath: string) {
    this.filePath = newFilePath;
  }

  /**
   * Save an MQTT message to the local file. If the file exists, the message is appended.
   * If the file does not exist, a new file is created.
   * @param message - The MQTT message to save.
   */
  public saveMessage(message: string) {
    if (existsSync(this.filePath)) {
      appendFile(this.filePath, message + '\n', (err) => {
        if (err) {
          console.error('Error appending message to file:', err);
        }
      });
    } else {
      writeFile(this.filePath, message + '\n', (err) => {
        if (err) {
          console.error('Error creating and writing to file:', err);
        }
      });
    }
  }

  /**
   * Create a new file at the specified path.
   * @param filePath - The path of the new file to create.
   */
  public createFile(filePath: string) {
    writeFile(filePath, '', (err) => {
      if (err) {
        console.error('Error creating a new file:', err);
      }
    });
  }
}
