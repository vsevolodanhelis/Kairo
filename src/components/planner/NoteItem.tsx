import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Note } from '../../types/planner';
import GlassContainer from '../common/GlassContainer';

interface NoteItemProps {
  note: Note;
  onPress: (note: Note) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onPress }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity onPress={() => onPress(note)}>
      <GlassContainer style={styles.container}>
        <Text 
          style={[styles.content, { color: theme.colors.onSurface }]}
          numberOfLines={5}
        >
          {note.content}
        </Text>
      </GlassContainer>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default NoteItem;
