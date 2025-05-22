import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  useTheme,
} from 'react-native-paper';
import { Note } from '../../types/planner';
import { generateId } from '../../utils/idUtils';
import { formatDate } from '../../utils/dateUtils';

interface NoteFormProps {
  note?: Note;
  date: Date;
  onSave: (note: Note) => void;
  onCancel: () => void;
  onDelete?: (noteId: string) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ 
  note, 
  date,
  onSave, 
  onCancel,
  onDelete,
}) => {
  const theme = useTheme();
  const isEditing = !!note;
  
  // Form state
  const [content, setContent] = useState(note?.content || '');
  
  // Validation
  const [contentError, setContentError] = useState('');
  
  // Handle form submission
  const handleSave = () => {
    // Validate content
    if (!content.trim()) {
      setContentError('Note content is required');
      return;
    }
    
    const now = new Date().toISOString();
    const noteDate = new Date(date);
    noteDate.setHours(0, 0, 0, 0);
    
    const newNote: Note = {
      id: note?.id || generateId(),
      content: content.trim(),
      date: noteDate.toISOString(),
      createdAt: note?.createdAt || now,
      updatedAt: now,
    };
    
    onSave(newNote);
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        {isEditing ? 'Edit Note' : 'New Note'}
      </Text>
      
      <Text style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}>
        For {formatDate(date.toISOString())}
      </Text>
      
      <TextInput
        label="Note"
        value={content}
        onChangeText={(text) => {
          setContent(text);
          if (text.trim()) setContentError('');
        }}
        style={styles.input}
        multiline
        numberOfLines={10}
        error={!!contentError}
      />
      {contentError ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {contentError}
        </Text>
      ) : null}
      
      <View style={styles.buttonContainer}>
        {isEditing && onDelete && (
          <Button 
            mode="outlined" 
            onPress={() => onDelete(note.id)}
            textColor={theme.colors.error}
            style={[styles.button, styles.deleteButton]}
          >
            Delete
          </Button>
        )}
        <Button 
          mode="outlined" 
          onPress={onCancel}
          style={styles.button}
        >
          Cancel
        </Button>
        <Button 
          mode="contained" 
          onPress={handleSave}
          style={styles.button}
        >
          Save
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    minHeight: 200,
  },
  errorText: {
    marginTop: -12,
    marginBottom: 16,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  deleteButton: {
    borderColor: 'red',
  },
});

export default NoteForm;
