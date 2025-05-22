import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Portal, Modal, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../../store/slices/tasksSlice';
import { Task, TaskStatus } from '../../types/task';
import TaskList from '../../components/tasks/TaskList';
import TaskForm from '../../components/tasks/TaskForm';
import GlassContainer from '../../components/common/GlassContainer';

const TasksScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.tasks);

  // State for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // Handle task press
  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  // Handle toggle task status
  const handleToggleStatus = (task: Task) => {
    const newStatus = task.status === TaskStatus.COMPLETED
      ? TaskStatus.TODO
      : TaskStatus.COMPLETED;

    dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
  };

  // Handle save task
  const handleSaveTask = (task: Task) => {
    if (selectedTask) {
      dispatch(updateTask(task));
    } else {
      dispatch(addTask(task));
    }
    setModalVisible(false);
    setSelectedTask(undefined);
  };

  // Handle cancel
  const handleCancel = () => {
    setModalVisible(false);
    setSelectedTask(undefined);
  };

  // Handle add new task
  const handleAddTask = () => {
    setSelectedTask(undefined);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TaskList
        tasks={tasks}
        onTaskPress={handleTaskPress}
        onToggleStatus={handleToggleStatus}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddTask}
        color={theme.colors.onPrimary}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={handleCancel}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background }
          ]}
        >
          <TaskForm
            task={selectedTask}
            onSave={handleSaveTask}
            onCancel={handleCancel}
          />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
});

export default TasksScreen;
