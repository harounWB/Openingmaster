'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { THEME_COLORS } from '@/lib/constants';

interface CommentPanelProps {
  comment?: string;
  moveNumber?: number;
  moveSan?: string;
}

export function CommentPanel({ comment, moveNumber, moveSan }: CommentPanelProps) {
  return (
    <Card
      className="p-4 rounded-lg border-2 transition-all"
      style={{
        backgroundColor: THEME_COLORS.boardDark,
        borderColor: THEME_COLORS.accentSecondary,
        borderOpacity: '0.5',
      }}
    >
      <div className="space-y-2">
        {/* Header */}
        {moveNumber && moveSan && (
          <div className="flex items-center gap-2">
            <div className="text-xs font-medium text-gray-400">Move {moveNumber}:</div>
            <div
              className="text-sm font-mono font-bold px-2 py-1 rounded"
              style={{
                backgroundColor: THEME_COLORS.accentSecondary,
                color: THEME_COLORS.boardDark,
              }}
            >
              {moveSan}
            </div>
          </div>
        )}

        {/* Comment */}
        <div
          className="text-sm leading-relaxed"
          style={{
            color: '#e0e0e0',
          }}
        >
          {comment ? (
            <p>{comment}</p>
          ) : (
            <p className="text-gray-500 italic">No comment for this move</p>
          )}
        </div>
      </div>
    </Card>
  );
}
