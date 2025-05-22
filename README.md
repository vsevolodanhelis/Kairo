# 🚀 Kairo – AI-Powered Productivity App

Kairo is a comprehensive productivity app that combines task management, habit tracking, weekly planning, AI assistance, and analytics with a beautiful glass morphism interface.


[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/vsevolodanhelis/Kairo)

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [License](#-license)

## ✨ Features

### 📝 Task Management
- Create, edit, and delete tasks
- Set task priorities, due dates, and tags
- Mark tasks as completed
- View tasks in a list
- Track task progress and completion rates
- Visualize task distribution by priority and status

### 🔄 Habit Tracker
- Create, edit, and delete habits
- Set habit frequency, target, color, and reminders
- Track habit completions and streaks
- View habits for specific dates
- Archive habits you no longer need to track
- Monitor habit consistency with analytics

### 📅 Weekly Planner
- Create, edit, and delete events
- Create, edit, and delete time blocks
- Create, edit, and delete weekly goals
- Create, edit, and delete notes
- View schedule, goals, and notes for specific dates
- Plan your week with a visual calendar

### 🤖 AI Assistant
- Chat with an AI assistant
- Create, rename, and delete conversations
- Get productivity tips and advice
- Context-aware responses to your queries
- Personalized productivity recommendations

### 📊 Analytics
- View task statistics
- View habit statistics
- View time statistics
- View goal statistics
- See charts and graphs of productivity data
- Identify your most productive days and times

### 🌙 Dark Mode
- Seamless switching between light and dark themes
- Reduced eye strain during night usage
- Beautiful glass morphism design in both modes

## 🚀 Installation

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/vsevolodanhelis/Kairo.git
cd Kairo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on a device or emulator:
```bash
# For Android
npx expo start --android

# For iOS
npx expo start --ios

# Using Expo Go
Scan the QR code with the Expo Go app (Android) or the Camera app (iOS)
```

## 📖 Usage

### Getting Started

1. **Tasks**
   - Navigate to the Tasks tab
   - Tap the "+" button to create a new task
   - Fill in details like title, description, priority, and due date
   - Mark tasks as completed by tapping the checkbox

2. **Habits**
   - Navigate to the Habits tab
   - Tap the "+" button to create a new habit
   - Set frequency, target, and optional reminders
   - Mark habits as completed for specific dates
   - View your streaks and completion rates

3. **Planner**
   - Navigate to the Planner tab
   - Use the week view to select dates
   - Add events, time blocks, weekly goals, and notes
   - Switch between schedule, goals, and notes views

4. **AI Assistant**
   - Navigate to the Assistant tab
   - Start a new conversation or continue an existing one
   - Ask questions about productivity, task management, etc.
   - Get personalized advice and tips

5. **Analytics**
   - Navigate to the Analytics tab
   - View statistics about your tasks, habits, time management, and goals
   - Switch between overview, tasks, habits, and time tabs
   - Pull down to refresh data

## 🛠 Tech Stack

- **Framework**: React Native, Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **Data Visualization**: React Native Chart Kit
- **Storage**: AsyncStorage with Redux Persist

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── analytics/  # Analytics components
│   ├── assistant/  # Assistant components
│   ├── common/     # Common UI components
│   ├── habits/     # Habit components
│   ├── planner/    # Planner components
│   └── tasks/      # Task components
├── navigation/     # Navigation configuration
├── screens/        # App screens
│   ├── analytics/  # Analytics screens
│   ├── assistant/  # Assistant screens
│   ├── habits/     # Habit screens
│   ├── planner/    # Planner screens
│   └── tasks/      # Task screens
├── services/       # Business logic and services
├── store/          # Redux store and slices
├── theme/          # Theme configuration
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## 📄 License

This project is licensed under the MIT License.
