// Cosmic Night Theme Colors
export const THEME_COLORS = {
  background: '#0f1419',
  backgroundSecondary: '#1a1f2e',
  backgroundTertiary: '#25293a',
  
  textPrimary: '#f3f4f6',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',
  
  accentPrimary: '#7c3aed', // Purple
  accentSecondary: '#3b82f6', // Blue
  accentTertiary: '#06b6d4', // Cyan
  
  successColor: '#10b981',
  errorColor: '#ef4444',
  warningColor: '#f59e0b',
  
  boardLight: '#1a1f2e',
  boardDark: '#25293a',
  
  highlight: 'rgba(124, 58, 237, 0.3)', // Purple with transparency
  selectedSquare: 'rgba(59, 130, 246, 0.4)', // Blue with transparency
};

// Chess piece colors for the board
export const PIECE_COLORS = {
  light: '#f3f4f6',
  dark: '#1a1f2e',
};

// Training mode constants
export const TRAINING_MODES = {
  TRAIN: 'train' as const,
  EXPLORE: 'explore' as const,
};

// Player colors
export const PLAYER_COLORS = {
  WHITE: 'w' as const,
  BLACK: 'b' as const,
};
