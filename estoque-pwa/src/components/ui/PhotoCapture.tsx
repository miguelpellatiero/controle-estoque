'use client'

import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface PhotoCaptureProps {
  productId: string
  onPhotoTaken: (url: string) => void
  onClose: () => void
}

export function PhotoCapture({ productId, onPhotoTaken, onClose }: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [loading, setLoading] = useState(false)

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      
      setStream(mediaStream)
    } catch (error) {
      console.error('Erro ao acessar câmera:', error)
      alert('Erro ao acessar câmera. Verifique as permissões.')
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  async function takePhoto() {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0)
    
    canvas.toBlob(async (blob) => {
      if (!blob) return
      
      setLoading(true)
      
      try {
        const fileName = `${productId}/${Date.now()}.jpg`
        const { data, error } = await supabase.storage
          .from('product-photos')
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
          })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('product-photos')
          .getPublicUrl(fileName)

        await fetch('/api/products/photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            url: publicUrl,
          }),
        })

        onPhotoTaken(publicUrl)
        stopCamera()
      } catch (error) {
        console.error('Erro ao salvar foto:', error)
        alert('Erro ao salvar foto')
      } finally {
        setLoading(false)
      }
    }, 'image/jpeg', 0.8)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-white font-semibold">Tirar Foto da Etiqueta</h3>
        <button
          onClick={() => {
            stopCamera()
            onClose()
          }}
          className="text-white"
        >
          ✕ Fechar
        </button>
      </div>

      <div className="flex-1 relative">
        {!stream && (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={startCamera}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold"
            >
              📸 Ativar Câmera
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {stream && (
        <div className="p-6 flex justify-center">
          <button
            onClick={takePhoto}
            disabled={loading}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center disabled:opacity-50"
          >
            <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
          </button>
        </div>
      )}
    </div>
  )
}
