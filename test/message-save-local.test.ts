import { LocalMessageSaver } from '../src/message-save-local'; // Adjust the import path as needed

describe('LocalMessageSaver', () => {
  it('should create a new file and save a message', () => {
    const newFileName = 'createdbymessagesavelocal';
    const renamedFileName = 'createdbymessagesavelocaltoday';
    const messageToSave = 'this is saved from messagesavelocal to this renamed file';

    // Create a new instance of LocalMessageSaver with the newFileName
    const localMessageSaver = new LocalMessageSaver(newFileName);

    // Create the new file at the execution folder (e.g., root folder)
    localMessageSaver.createFile(newFileName);

    // Change the file name to the renamedFileName
    localMessageSaver.changeFilePath(renamedFileName);

    // Save the message to the renamed file
    localMessageSaver.saveMessage(messageToSave);
  });
});
