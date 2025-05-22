import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, TextInput, Button, useTheme } from 'react-native-paper';

interface RenameDialogProps {
  visible: boolean;
  initialTitle: string;
  onDismiss: () => void;
  onRename: (newTitle: string) => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
  visible,
  initialTitle,
  onDismiss,
  onRename,
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState('');
  
  const handleRename = () => {
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }
    
    onRename(title.trim());
    onDismiss();
  };
  
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Rename Conversation</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Title"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (text.trim()) setError('');
            }}
            style={styles.input}
            error={!!error}
          />
          {error ? (
            <TextInput.HelperText type="error" visible={!!error}>
              {error}
            </TextInput.HelperText>
          ) : null}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleRename}>Rename</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
  },
  input: {
    marginTop: 8,
  },
});

export default RenameDialog;
