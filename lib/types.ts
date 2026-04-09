export interface Move {
  notation: string; // e.g., "e4"
  san: string; // Standard algebraic notation, e.g., "e4" or "Nf3"
  from: string; // e.g., "e2"
  to: string; // e.g., "e4"
  promotion?: string;
  comment?: string;
  variations?: Variation[];
}

export interface Variation {
  moves: Move[];
  comment?: string;
}

export interface GameNode {
  move: Move;
  variations: GameNode[];
  next?: GameNode;
}

export interface Game {
  id: string;
  white: string;
  black: string;
  event?: string;
  date?: string;
  result?: string;
  moves: Move[];
  variations: Variation[];
  completed?: boolean;
}

export interface PGNFile {
  games: Game[];
}

export type PlayerColor = 'w' | 'b';
export type TrainingMode = 'train' | 'explore';

export interface TrainerState {
  currentGame: Game | null;
  moveIndex: number;
  trainingMode: TrainingMode;
  playerColor: PlayerColor;
  selectedVariationIndex: number;
  gameState: any; // Will be chess.Game instance
  message: string;
  isCorrect: boolean | null;
}
