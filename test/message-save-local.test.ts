/**
 * LocalMessageSaver Test
 *
 * This test suite validates the behavior of the LocalMessageSaver class when saving data
 * to local machine.
 */
import { LocalMessageSaver } from '../src/adapters/message-save-local';
import fs from 'fs';
import path from 'path';

describe('LocalMessageSaver', () => {
  const currentDirectory = process.cwd();

  afterAll(() => {
    // Clean up: Delete all generated files
    const filesToDelete = [
      'createdbymessagesavelocal',
      'createdbymessagesavelocalrenamed',
      'createdbymessagesavelocalsave',
    ];
  
    filesToDelete.forEach((fileName) => {
      const filePath = path.join(currentDirectory, fileName);
  
      // Check if the file exists before attempting to delete
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    });
  });

  describe('File Creation', () => {
    it('should create a new file', () => {
      const newFileName = 'createdbymessagesavelocal';
      const newFilePath = path.join(currentDirectory, newFileName);

      // Create a new instance of LocalMessageSaver with the newFileName
      const createLocalMessageSaver = new LocalMessageSaver(newFilePath);

      // Create the new file at the execution folder (e.g., root folder)
      createLocalMessageSaver.createFile(newFilePath);
      console.log('newFilePath:', newFilePath);

      // Assertion: Check that the file was created
      expect(fs.existsSync(newFilePath)).toBe(true);
    });
  });

  describe('File Renaming', () => {
    it('should rename the file', () => {
      const oldFileName = 'createdbymessagesavelocalold';
      const renamedFileName = 'createdbymessagesavelocalrenamed';
      const oldFilePath = path.join(currentDirectory, oldFileName);
      const renamedFilePath = path.join(currentDirectory, renamedFileName);

      // Create a new instance of LocalMessageSaver with the newFileName
      const renameLocalMessageSaver = new LocalMessageSaver(oldFilePath);

      // Change the file name to the renamedFileName
      renameLocalMessageSaver.changeFilePath(renamedFilePath);

      // Assertion: Check that the file was renamed
      expect(renameLocalMessageSaver['filePath']).toBe(renamedFilePath);
    });
  });

  describe('Message Saving', () => {
    it('should save a message to the file', async () => {
      const saveFileName = 'createdbymessagesavelocalsave';
      const messageToSave = 'this is saved from messagesavelocal to this renamed file';
      const saveFilePath = path.join(currentDirectory, saveFileName);

      // Create a new instance of LocalMessageSaver with the renamedFileName
      const saveLocalMessageSaver = new LocalMessageSaver(saveFilePath);

      // Create the new file at the execution folder (e.g., root folder)
      saveLocalMessageSaver.createFile(saveFilePath);

      // Save the message to the renamed file
      await saveLocalMessageSaver.saveMessage(messageToSave);
      console.log('saveFilePath:', saveFilePath);

      // Assertion: Check that the message was saved to the file
      const fileContent = await fs.promises.readFile(saveLocalMessageSaver['filePath'], 'utf-8');
      const expected = messageToSave + '\n';

      for (let i = 0; i < Math.min(messageToSave.length, fileContent.length); i++) {
        if (messageToSave[i] !== fileContent[i]) {
          console.log(`Difference at index ${i}: Expected '${messageToSave[i]}' but got '${fileContent[i]}'`);
          break; // Stop after the first difference
        }
      }

      console.log('Actual file content:', JSON.stringify(fileContent));
      console.log('Expected content:', JSON.stringify(messageToSave));
      console.log('Actual file content:', fileContent);
      expect(fileContent).toEqual(expected);
    });
  });
});