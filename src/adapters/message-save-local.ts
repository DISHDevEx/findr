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
}
