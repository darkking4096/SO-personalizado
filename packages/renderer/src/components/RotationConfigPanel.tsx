import { useState, useCallback } from 'react'
import { useAppStore } from '../stores/appStore'
import type { RotationMode, RotationConfig } from '@shared/types/index.js'

export default function RotationConfigPanel() {
  const [imagePool, setImagePool] = useState<string[]>([])
  const [weights, setWeights] = useState<Record<string, number>>({})
  const [mode, setMode] = useState<RotationMode>('sequential')
  const [intervalMinutes, setIntervalMinutes] = useState(30)

  const { rotation, setWallpaper } = useAppStore((state) => ({
    rotation: state.wallpaper.rotation,
    setWallpaper: state.setWallpaper,
  }))

  const handleAddImage = useCallback((filePath: string) => {
    setImagePool((prev) => {
      if (prev.includes(filePath)) return prev
      const newPool = [...prev, filePath]
      if (mode === 'weighted' && !weights[filePath]) {
        setWeights((w) => ({ ...w, [filePath]: 1 }))
      }
      return newPool
    })
  }, [mode, weights])

  const handleRemoveImage = useCallback((filePath: string) => {
    setImagePool((prev) => prev.filter((p) => p !== filePath))
    setWeights((prev) => {
      const newWeights = { ...prev }
      delete newWeights[filePath]
      return newWeights
    })
  }, [])

  const handleWeightChange = useCallback((filePath: string, weight: number) => {
    setWeights((prev) => ({
      ...prev,
      [filePath]: Math.max(0.1, weight),
    }))
  }, [])

  const handleModeChange = useCallback((newMode: RotationMode) => {
    setMode(newMode)
    if (newMode === 'weighted' && Object.keys(weights).length === 0) {
      // Initialize weights if switching to weighted mode
      const initialWeights: Record<string, number> = {}
      imagePool.forEach((img) => {
        initialWeights[img] = 1
      })
      setWeights(initialWeights)
    }
  }, [imagePool, weights])

  const handleStartRotation = useCallback(() => {
    if (imagePool.length === 0) {
      alert('Selecione pelo menos uma imagem para a rotação')
      return
    }

    const config: RotationConfig = {
      mode,
      intervalMinutes,
      imagePool,
      ...(mode === 'weighted' && { weights }),
    }

    setWallpaper({
      rotation: {
        enabled: true,
        config,
        currentIndex: 0,
        isRotating: true,
      },
    })
  }, [imagePool, mode, intervalMinutes, weights, setWallpaper])

  const handleStopRotation = useCallback(() => {
    setWallpaper({
      rotation: {
        enabled: false,
        config: rotation?.config || {
          mode: 'sequential',
          intervalMinutes: 30,
          imagePool: [],
        },
        currentIndex: 0,
        isRotating: false,
      },
    })
  }, [rotation?.config, setWallpaper])

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-slate-950 dark:text-white">
          Configurar Rotação de Papéis de Parede
        </h3>
      </div>

      {/* Mode Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Modo de Rotação
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['sequential', 'random', 'weighted'] as RotationMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                mode === m
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
              }`}
            >
              <div className="text-sm font-semibold text-slate-950 dark:text-white">
                {m === 'sequential' && 'Sequencial'}
                {m === 'random' && 'Aleatório'}
                {m === 'weighted' && 'Ponderado'}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {m === 'sequential' && 'Cíclo em ordem'}
                {m === 'random' && 'Seleção aleatória'}
                {m === 'weighted' && 'Probabilidade'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interval Picker */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Intervalo de Rotação: {intervalMinutes} minutos
        </label>
        <input
          type="range"
          min="5"
          max="1440"
          step="5"
          value={intervalMinutes}
          onChange={(e) => setIntervalMinutes(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>5 min</span>
          <span>24 h</span>
        </div>
      </div>

      {/* Image Pool Manager */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Pool de Imagens ({imagePool.length})
          </label>
          <button
            onClick={() => handleAddImage('/path/to/image.jpg')}
            className="text-sm px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            + Adicionar
          </button>
        </div>

        {imagePool.length === 0 ? (
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Adicione imagens para iniciar a rotação
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {imagePool.map((imagePath) => (
              <div
                key={imagePath}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-slate-100 truncate">
                    {imagePath.split('/').pop()}
                  </p>
                  {mode === 'weighted' && (
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-xs text-slate-600 dark:text-slate-400">
                        Peso:
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={weights[imagePath] || 1}
                        onChange={(e) => handleWeightChange(imagePath, parseFloat(e.target.value))}
                        className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveImage(imagePath)}
                  className="ml-3 text-red-500 hover:text-red-700 font-semibold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleStartRotation}
          disabled={imagePool.length === 0}
          className="flex-1 px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold transition-colors"
        >
          ▶ Iniciar Rotação
        </button>
        <button
          onClick={handleStopRotation}
          className="flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
        >
          ⏹ Parar Rotação
        </button>
      </div>

      {/* Status */}
      {rotation?.isRotating && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
          <p className="text-sm text-green-950 dark:text-green-100">
            ✅ Rotação ativa • Modo: <strong>{mode}</strong> • Intervalo: <strong>{intervalMinutes}min</strong>
          </p>
        </div>
      )}
    </div>
  )
}
