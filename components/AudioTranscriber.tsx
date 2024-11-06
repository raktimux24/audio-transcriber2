"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, AlertCircle, FileAudio, Check, Wand2 } from 'lucide-react'

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB
const ALLOWED_TYPES = ['audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/mpeg']

const AudioTranscriber = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [transcription, setTranscription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 3000) // Hide after 3 seconds
  }

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setError("")
    setTranscription("")
    setSuccessMessage("")

    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size must be less than 4MB")
        return
      }

      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Please upload a valid audio file (MP3, WAV, M4A)")
        return
      }

      setAudioFile(file)
    }
  }, [])

  const clearFile = useCallback(() => {
    setAudioFile(null)
    setTranscription("")
    setError("")
    setSuccessMessage("")
    setProgress(0)
  }, [])

  const handleTranscribe = async () => {
    if (!audioFile) return;

    setIsProcessing(true);
    setProgress(0);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      console.log('Sending request with file:', {
        name: audioFile.name,
        type: audioFile.type,
        size: audioFile.size
      });

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Received response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to transcribe audio');
      }

      if (!data.transcription) {
        throw new Error('No transcription received from server');
      }

      // Clean up the transcription if needed
      const cleanTranscription = data.transcription
        .replace(/^```.*\n/, '')
        .replace(/\n```$/, '')
        .trim();

      setProgress(100);
      setTranscription(cleanTranscription);
      showSuccess('Audio transcribed successfully!');
    } catch (error: any) {
      console.error('Transcription error:', error);
      setError(error.message || "An error occurred during transcription. Please try again.");
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size must be less than 4MB")
        return
      }

      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Please upload a valid audio file (MP3, WAV, M4A)")
        return
      }

      setAudioFile(file)
      setError("")
      setTranscription("")
      setSuccessMessage("")
    }
  }

  return (
    <div className="absolute top-0 left-0 right-0 min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 overflow-x-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10" style={{ animationDuration: '4s' }} />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col">
        <header className="py-6 px-4">
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 w-fit mx-auto">
            <div className="p-2 bg-white/20 rounded-full">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">AudioMagic</h1>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-2xl shadow-2xl bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileAudio className="h-6 w-6" />
                Audio Transcription
              </CardTitle>
              <CardDescription className="text-white/80 text-base font-medium">
                Upload an audio file (MP3, WAV, M4A) to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="bg-emerald-500/20 text-emerald-100 border-emerald-500/30">
                  <Check className="h-4 w-4" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div 
                className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                  audioFile ? 'bg-white/5 border-white/20' : 'border-white/30 hover:border-white/40'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".mp3,.wav,.m4a"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                {!audioFile ? (
                  <label
                    htmlFor="audio-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <div className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-sm text-gray-100 font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-200">
                      MP3, WAV, or M4A (max. 4MB)
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <FileAudio className="h-8 w-8" />
                      <div>
                        <p className="text-sm font-medium">{audioFile.name}</p>
                        <p className="text-xs text-gray-200">
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearFile}
                      className="shrink-0 hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {audioFile && (
                <div className="space-y-4">
                  <Button
                    onClick={handleTranscribe}
                    disabled={isProcessing}
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-0 transition-colors"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {progress === 100 ? <Check className="h-4 w-4" /> : null}
                        <span>{progress === 100 ? 'Transcribed' : 'Transcribe Audio'}</span>
                      </div>
                    )}
                  </Button>

                  {isProcessing && (
                    <div className="space-y-1">
                      <Progress value={progress} className="w-full" />
                      <p className="text-xs text-gray-200 text-center">
                        Processing... {progress}%
                      </p>
                    </div>
                  )}
                </div>
              )}

              {transcription && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Transcription Result</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        navigator.clipboard.writeText(transcription)
                        showSuccess('Transcription copied to clipboard!')
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20 transition-colors"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                    <p className="whitespace-pre-wrap text-sm text-gray-200">{transcription}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <footer className="py-4 px-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-white/60 text-sm">
              Powered by Gemini AI - Transform your audio to text with ease
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <span className="text-white/40">•</span>
              <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default AudioTranscriber