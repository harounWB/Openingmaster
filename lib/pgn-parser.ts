import { Game, Move, Variation } from './types';
import { Chess } from 'chess.js';

/**
 * Parse PGN file content and extract games with moves and variations
 * Supports multiple games, comments, and variations in a single file
 */
export function parsePGN(pgnContent: string): Game[] {
  const games: Game[] = [];
  
  // Split by game headers (lines starting with [)
  const gameBlocks = pgnContent.split(/\n(?=\[Event|\[White|\[Black|\[Site)/);
  
  for (const block of gameBlocks) {
    if (!block.trim()) continue;
    
    const game = parseGameBlock(block);
    if (game && game.moves.length > 0) {
      game.id = `game-${games.length + 1}`;
      games.push(game);
    }
  }
  
  return games;
}

function parseGameBlock(blockContent: string): Game | null {
  const lines = blockContent.split('\n');
  
  const headers: Record<string, string> = {};
  let movesSectionStartIndex = 0;
  
  // Parse headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('[')) {
      const match = line.match(/\[(\w+)\s+"([^"]*)"\]/);
      if (match) {
        headers[match[1]] = match[2];
      }
    } else if (line && !line.startsWith('[')) {
      movesSectionStartIndex = i;
      break;
    }
  }
  
  // Extract moves section
  const movesContent = lines.slice(movesSectionStartIndex).join(' ');
  if (!movesContent.trim()) return null;
  
  // Parse moves with the chess.js library for validation
  const { moves, variations } = parseMovesWithVariations(movesContent);
  
  if (moves.length === 0) return null;
  
  return {
    id: '',
    white: headers['White'] || 'White',
    black: headers['Black'] || 'Black',
    event: headers['Event'],
    date: headers['Date'],
    result: headers['Result'],
    moves,
    variations,
    completed: false,
  };
}

function parseMovesWithVariations(movesContent: string): { moves: Move[]; variations: Variation[] } {
  const moves: Move[] = [];
  const variations: Variation[] = [];
  
  // Remove result indicators and extra whitespace
  let content = movesContent
    .replace(/\d+\./g, ' ') // Remove move numbers
    .replace(/1-0|0-1|1\/2-1\/2|\*/g, '') // Remove result
    .trim();
  
  // Initialize a chess instance to validate moves
  const chess = new Chess();
  
  // Extract moves and comments/variations
  let moveNumber = 1;
  let currentPosition = 0;
  
  while (currentPosition < content.length) {
    content = content.substring(currentPosition).trim();
    if (!content) break;
    
    currentPosition = 0;
    
    // Handle variations (parentheses)
    if (content.startsWith('(')) {
      const variationContent = extractVariationContent(content);
      if (variationContent) {
        const variationMoves = parseMovesFromString(variationContent, chess);
        if (variationMoves.length > 0) {
          variations.push({ moves: variationMoves });
        }
        currentPosition = content.indexOf(')') + 1;
      }
      continue;
    }
    
    // Handle comments (curly braces)
    let comment = '';
    if (content.startsWith('{')) {
      const commentMatch = content.match(/\{([^}]*)\}/);
      if (commentMatch) {
        comment = commentMatch[1];
        currentPosition = commentMatch[0].length;
      }
    }
    
    // Extract the next move
    const moveMatch = content.substring(currentPosition).match(/^([a-h][1-8][a-h][1-8][qrbn]?|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8][+#=]?[qrbn]?|O-O(?:-O)?)/);
    
    if (moveMatch) {
      const moveString = moveMatch[1];
      
      try {
        const move = chess.move(moveString, { sloppy: true });
        if (move) {
          const moveObj: Move = {
            notation: moveString,
            san: move.san || moveString,
            from: move.from,
            to: move.to,
            promotion: move.promotion,
            comment: comment || undefined,
            variations: [],
          };
          
          moves.push(moveObj);
          currentPosition += moveString.length;
        } else {
          currentPosition += 1;
        }
      } catch (e) {
        currentPosition += 1;
      }
    } else {
      currentPosition += 1;
    }
  }
  
  return { moves, variations };
}

function extractVariationContent(content: string): string | null {
  let depth = 0;
  let start = -1;
  
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '(') {
      if (depth === 0) start = i + 1;
      depth++;
    } else if (content[i] === ')') {
      depth--;
      if (depth === 0 && start !== -1) {
        return content.substring(start, i);
      }
    }
  }
  
  return null;
}

function parseMovesFromString(moveString: string, chess: Chess): Move[] {
  const moves: Move[] = [];
  const chess_copy = new Chess(chess.fen());
  
  const moveMatches = moveString.match(/[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8][+#=]?[qrbn]?|O-O(?:-O)?/g) || [];
  
  for (const moveStr of moveMatches) {
    try {
      const move = chess_copy.move(moveStr, { sloppy: true });
      if (move) {
        moves.push({
          notation: moveStr,
          san: move.san || moveStr,
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });
      }
    } catch (e) {
      // Skip invalid moves
    }
  }
  
  return moves;
}

/**
 * Validate that all moves in a game are legal
 */
export function validateGameMoves(game: Game): boolean {
  const chess = new Chess();
  
  for (const move of game.moves) {
    try {
      const result = chess.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      }, { sloppy: false });
      
      if (!result) {
        console.error(`Invalid move: ${move.san} at position ${chess.fen()}`);
        return false;
      }
    } catch (e) {
      console.error(`Move validation error: ${move.san}`, e);
      return false;
    }
  }
  
  return true;
}
