# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a cross-platform mobile application built with Expo, React Native, and Tamagui UI library for family rewards tracking. It uses Expo Router for file-based navigation.

## Technology Stack
- **Framework**: Expo ~54.0.33 (React Native 0.81.5, React 19.1.0)
- **Navigation**: Expo Router ~6.0.23 (file-based routing)
- **UI Library**: Tamagui 2.0.0-rc.25
- **Language**: TypeScript ~5.9.2
- **Linting**: ESLint with Expo config

## Architecture
### Directory Structure
- `app/`: Expo Router file-based routes
  - `(tabs)/`: Bottom tab navigation group
  - `_layout.tsx`: Root layout configuration
  - `modal.tsx`: Modal screen component
- `components/`: Reusable UI components
  - `ui/`: Shared base UI components
  - Themed components (themed-text.tsx, themed-view.tsx) that use Tamagui styling
  - Custom components (parallax-scroll-view, haptic-tab, etc.)
- `hooks/`: Custom React hooks
- `constants/`: App constants
- `assets/`: Static assets (images, fonts, etc.)

### Key Patterns
- File-based routing with Expo Router: Add new files to `app/` to create new routes
- Tamagui is used for all styling and UI components
- Bottom tab navigation is configured in `app/(tabs)/_layout.tsx`

## Common Commands
### Development
- `npm run start`: Start Expo development server
- `npm run ios`: Run app on iOS simulator
- `npm run android`: Run app on Android emulator
- `npm run web`: Run app in web browser
### Linting
- `npm run lint`: Run ESLint on the codebase
### Other
- `npm run reset-project`: Reset starter code to blank app directory