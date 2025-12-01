"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowDown, ArrowUp, Check, X } from "lucide-react";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "classic" | "poster";
  colorBlind?: boolean;
}

export function RulesModal({ isOpen, onClose, mode, colorBlind = false }: RulesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-zinc-950 rounded-md p-6 border-3 border-zinc-700 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {mode === "classic" ? "📖 Classic Mode - Rules" : "📖 Poster Mode - Rules"}
          </DialogTitle>
        </DialogHeader>

        <div className="text-white space-y-6 mt-4">
          {mode === "classic" ? (
            <ClassicRules colorBlind={colorBlind} />
          ) : (
            <PosterRules />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClassicRules({ colorBlind }: { colorBlind: boolean }) {
  const correctColor = colorBlind ? "bg-sky-700" : "bg-green-500";
  const incorrectColor = colorBlind ? "bg-orange-600" : "bg-red-500";
  const partialColor = "bg-yellow-300";

  return (
    <>
      {/* Objetivo */}
      <section>
        <h3 className="text-xl font-semibold mb-2">🎯 Objective</h3>
        <p className="text-zinc-300">
          Guess the movie of the day using the color-coded hints. Each guess reveals information about how close you are to the correct answer.
        </p>
      </section>

      {/* Sistema de Cores */}
      <section>
        <h3 className="text-xl font-semibold mb-3">🎨 Color System</h3>
        <div className="space-y-3">
          {/* Correto */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${correctColor} rounded-md flex items-center justify-center`}>
              <Check className="text-white" size={24} />
            </div>
            <div>
              <p className="font-semibold">Correct</p>
              <p className="text-sm text-zinc-400">The information matches exactly</p>
            </div>
          </div>

          {/* Incorreto */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${incorrectColor} rounded-md flex items-center justify-center`}>
              <X className="text-white" size={24} />
            </div>
            <div>
              <p className="font-semibold">Incorrect</p>
              <p className="text-sm text-zinc-400">The information doesn't match</p>
            </div>
          </div>

          {/* Parcial */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${partialColor} rounded-md flex items-center justify-center`}>
              <span className="text-zinc-800 font-bold">≈</span>
            </div>
            <div>
              <p className="font-semibold">Partial / Close</p>
              <p className="text-sm text-zinc-400">Some information matches, or you're close</p>
            </div>
          </div>

          {/* Setas */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${partialColor} rounded-md flex items-center justify-center relative`}>
              <ArrowUp className="text-zinc-800 absolute" size={32} strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold">Higher ↑</p>
              <p className="text-sm text-zinc-400">The correct value is higher (Budget, Year)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${partialColor} rounded-md flex items-center justify-center relative`}>
              <ArrowDown className="text-zinc-800 absolute" size={32} strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold">Lower ↓</p>
              <p className="text-sm text-zinc-400">The correct value is lower (Budget, Year)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section>
        <h3 className="text-xl font-semibold mb-3">📊 Categories</h3>
        <div className="space-y-2 text-sm text-zinc-300">
          <div>
            <span className="font-semibold text-white">• Title:</span> The movie's name
          </div>
          <div>
            <span className="font-semibold text-white">• Genre(s):</span> Movie genres (partial match if some genres match)
          </div>
          <div>
            <span className="font-semibold text-white">• Lead Actor:</span> The 5 most popular actors from the movie
          </div>
          <div>
            <span className="font-semibold text-white">• Director(s):</span> Who directed the movie
          </div>
          <div>
            <span className="font-semibold text-white">• Companies:</span> Production companies
          </div>
          <div>
            <span className="font-semibold text-white">• Budget:</span> Production budget (arrows indicate if higher/lower)
          </div>
          <div>
            <span className="font-semibold text-white">• Release:</span> Release year (arrows indicate if earlier/later)
          </div>
        </div>
      </section>

      {/* Exemplo */}
      <section>
        <h3 className="text-xl font-semibold mb-3">💡 Example</h3>
        <div className="bg-zinc-900 rounded-lg p-4 space-y-2 text-sm">
          <p className="text-zinc-400">You guessed: <span className="text-white font-semibold">"The Dark Knight" (2008)</span></p>
          <div className="space-y-1">
            <p>• <span className={`px-2 py-1 ${incorrectColor} rounded text-white text-xs`}>Genre</span> = Genres don't match</p>
            <p>• <span className={`px-2 py-1 ${partialColor} rounded text-zinc-800 text-xs`}>Actor</span> = Some actors match!</p>
            <p>• <span className={`px-2 py-1 ${partialColor} rounded text-zinc-800 text-xs`}>Year ↑</span> = The correct movie is newer</p>
          </div>
        </div>
      </section>

      {/* Colorblind Mode */}
      {colorBlind && (
        <section className="bg-sky-950 border border-sky-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">♿ Colorblind Mode Active</h3>
          <p className="text-sm text-zinc-300">
            Using colorblind-friendly palette: <span className="text-sky-400">Blue</span> (correct),
            <span className="text-yellow-300"> Yellow</span> (partial),
            <span className="text-orange-400"> Orange</span> (incorrect)
          </p>
        </section>
      )}

      {/* Dica */}
      <section className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
        <p className="text-sm text-zinc-300">
          💡 <span className="font-semibold text-white">Tip:</span> Start with popular movies you know well. Use the hints to narrow down the genres, actors, and release period!
        </p>
      </section>
    </>
  );
}

function PosterRules() {
  return (
    <>
      {/* Objetivo */}
      <section>
        <h3 className="text-xl font-semibold mb-2">🎯 Objective</h3>
        <p className="text-zinc-300">
          Guess the movie of the day by looking at its poster. You have <span className="font-bold text-yellow-400">6 attempts</span> to get it right!
        </p>
      </section>

      {/* Sistema de Revelação */}
      <section>
        <h3 className="text-xl font-semibold mb-3">🖼️ Progressive Reveal System</h3>
        <p className="text-zinc-300 mb-3">
          With each incorrect guess, more of the poster is revealed. The image starts heavily obscured and becomes clearer with each attempt.
        </p>

        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="font-bold text-red-400 mb-1">Attempt 1-2</div>
            <div className="text-zinc-400">Very blurry</div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="font-bold text-yellow-400 mb-1">Attempt 3-4</div>
            <div className="text-zinc-400">Getting clearer</div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-3">
            <div className="font-bold text-green-400 mb-1">Attempt 5-6</div>
            <div className="text-zinc-400">Almost clear</div>
          </div>
        </div>
      </section>

      {/* Regras */}
      <section>
        <h3 className="text-xl font-semibold mb-3">📜 Rules</h3>
        <div className="space-y-2 text-zinc-300">
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">1.</span>
            <p>You have <span className="font-semibold text-white">6 attempts</span> to guess the correct movie</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">2.</span>
            <p>After each wrong guess, <span className="font-semibold text-white">the poster becomes clearer</span></p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">3.</span>
            <p>You <span className="font-semibold text-white">cannot guess the same movie twice</span></p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">4.</span>
            <p>If you run out of attempts, the correct answer will be revealed</p>
          </div>
        </div>
      </section>

      {/* Dicas para Observar */}
      <section>
        <h3 className="text-xl font-semibold mb-3">🔍 What to Look For</h3>
        <div className="bg-zinc-900 rounded-lg p-4 space-y-2 text-sm text-zinc-300">
          <div><span className="text-white">🎨 Colors:</span> Dominant colors can hint at the genre or mood</div>
          <div><span className="text-white">👤 Characters:</span> Look for silhouettes and character positioning</div>
          <div><span className="text-white">🏛️ Objects:</span> Props and iconic items from the movie</div>
          <div><span className="text-white">✍️ Typography:</span> Font style can indicate the movie's era or genre</div>
          <div><span className="text-white">🎭 Style:</span> Minimalist? Dramatic? Horror? Each genre has visual patterns</div>
        </div>
      </section>

      {/* Estratégia */}
      <section>
        <h3 className="text-xl font-semibold mb-3">💡 Strategy Tips</h3>
        <div className="space-y-2 text-sm text-zinc-300">
          <p>• <span className="font-semibold text-white">First attempts:</span> Use broad guesses based on colors and shapes</p>
          <p>• <span className="font-semibold text-white">Middle attempts:</span> Look for specific details as the image clears</p>
          <p>• <span className="font-semibold text-white">Final attempts:</span> Focus on text, faces, and iconic elements</p>
        </div>
      </section>      {/* Gray Filter */}
      <section className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">🎨 Grayscale Filter (Hard Mode)</h3>
        <p className="text-sm text-zinc-300">
          Want an extra challenge? Toggle the <span className="font-semibold text-white">grayscale filter</span> to remove all colors from the poster, making it much harder to identify the movie. Only the bravest players use this mode!
        </p>
      </section>

      {/* Aviso */}
      <section className="bg-red-950 border border-red-700 rounded-lg p-4">
        <p className="text-sm text-zinc-300">
          ⚠️ <span className="font-semibold text-white">Remember:</span> Once you use all 6 attempts, the game ends and the answer is revealed. Choose your guesses wisely!
        </p>
      </section>
    </>
  );
}
