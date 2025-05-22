import React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, Paragraph, Button, useTheme } from 'react-native-paper';

interface DeleteDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onDelete: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  visible,
  onDismiss,
  onDelete,
}) => {
  const theme = useTheme();
  
  const handleDelete = () => {
    onDelete();
    onDismiss();
  };
  
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Delete Conversation</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button 
            onPress={handleDelete}
            textColor={theme.colors.error}
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
  },
});

export default DeleteDialog;
