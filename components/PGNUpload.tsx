'use client';

import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parsePGN } from '@/lib/pgn-parser';
import { Game } from '@/lib/types';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface PGNUploadProps {
  onGamesLoaded: (games: Game[], fileName?: string, source?: 'bundled' | 'upload') => void;
  isLoading?: boolean;
}

export function PGNUpload({ onGamesLoaded, isLoading = false }: PGNUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    
    try {
      const content = await file.text();
      
      if (!content || content.trim().length === 0) {
        setError('PGN file is empty');
        return;
      }

      const games = parsePGN(content);

      if (games.length === 0) {
        setError('No valid games found. Please check PGN format.');
        return;
      }

      onGamesLoaded(games, file.name, 'upload');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error parsing PGN: ${errorMsg}`);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && (file.name.endsWith('.pgn') || file.name.endsWith('.txt'))) {
      processFile(file);
    } else {
      setError('Please drop a .pgn or .txt file');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Card className="border-gray-800 bg-gray-900/80 p-5 backdrop-blur-sm">
      <div className="space-y-5">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20">
            <FileText className="h-7 w-7 text-purple-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white">Upload PGN File</h2>
          <p className="text-sm text-gray-400">
            Drop your PGN file here or click to browse
          </p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative rounded-xl border-2 border-dashed p-5 transition-all duration-200 ${
            isDragging
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pgn,.txt"
            onChange={handleFileChange}
            disabled={isLoading}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div className="text-center">
            <Upload className={`mx-auto mb-3 h-8 w-8 transition-colors ${
              isDragging ? 'text-purple-400' : 'text-gray-500'
            }`} />
            <Button
              type="button"
              disabled={isLoading}
              className="bg-purple-600 px-4 text-white hover:bg-purple-500"
            >
              {isLoading ? 'Loading...' : 'Choose File'}
            </Button>
            <p className="mt-3 text-[11px] text-gray-500">
              .pgn or .txt files supported
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-800/50 bg-red-900/20 p-2.5 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-lg bg-gray-800/50 p-2.5 text-center">
            <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Multiple games</p>
          </div>
          <div className="rounded-lg bg-gray-800/50 p-2.5 text-center">
            <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Comments</p>
          </div>
          <div className="rounded-lg bg-gray-800/50 p-2.5 text-center">
            <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Variations</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
