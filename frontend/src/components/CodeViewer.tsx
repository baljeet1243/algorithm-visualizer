/**
 * CodeViewer Component
 * Displays algorithm code with synchronized line highlighting
 */

import { useEffect, useRef } from 'react';
import { CodeLine } from '../utils/algorithmCode';

interface CodeViewerProps {
  code: CodeLine[];
  highlightedLines: number[];
  language: string;
  title: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  highlightedLines,
  language,
  title,
}) => {
  const highlightedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to highlighted line
  useEffect(() => {
    if (highlightedRef.current && highlightedLines.length > 0) {
      highlightedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [highlightedLines]);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] border-l border-[#1e293b]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e293b] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Code</h3>
          <p className="text-xs text-slate-500 mt-0.5">{title}</p>
        </div>
        <div className="px-2 py-1 bg-[#1e293b] rounded text-xs text-slate-400 font-mono">
          {language}
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {code.map((line, index) => {
          const isHighlighted = highlightedLines.includes(line.line);
          const isEmpty = line.code.trim() === '';

          return (
            <div
              key={index}
              ref={isHighlighted && index === 0 ? highlightedRef : null}
              className={`flex items-start transition-all duration-200 ${
                isHighlighted
                  ? 'bg-[#3b82f6]/20 border-l-2 border-[#3b82f6]'
                  : ''
              } ${isEmpty ? 'h-5' : 'py-1'}`}
            >
              {/* Line Number */}
              <div
                className={`w-10 flex-shrink-0 text-right pr-3 select-none ${
                  isHighlighted ? 'text-[#3b82f6] font-bold' : 'text-slate-600'
                }`}
              >
                {line.line}
              </div>

              {/* Code Content */}
              <div
                className={`flex-1 ${
                  isHighlighted ? 'text-white font-medium' : 'text-slate-300'
                }`}
                style={{ paddingLeft: `${line.indent * 16}px` }}
              >
                {line.code.split(/(\s+|[(){}[\]:,])/).map((token, i) => {
                  // Syntax highlighting
                  let className = '';
                  
                  if (['def', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'in', 'not', 'and', 'or', 'break', 'continue'].includes(token)) {
                    className = 'text-purple-400';
                  } else if (token.match(/^['"].*['"]$/)) {
                    className = 'text-green-400';
                  } else if (token.match(/^\d+$/)) {
                    className = 'text-orange-400';
                  } else if (['True', 'False', 'None'].includes(token)) {
                    className = 'text-cyan-400';
                  } else if (token.match(/^[(){}[\]:,]$/)) {
                    className = 'text-slate-500';
                  }

                  return (
                    <span key={i} className={className}>
                      {token}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-[#1e293b] text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3b82f6]/20 border-l-2 border-[#3b82f6] rounded-sm"></div>
          <span>Currently executing</span>
        </div>
      </div>
    </div>
  );
};
