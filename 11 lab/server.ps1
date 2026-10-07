# Simple static web server in PowerShell using .NET HttpListener
$port = 3000
$root = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host " ElevenLabs Voice Studio is LIVE!" -ForegroundColor Green
    Write-Host " Local URL: http://localhost:$port" -ForegroundColor Yellow
    Write-Host " Root Directory: $root" -ForegroundColor Gray
    Write-Host "=================================================" -ForegroundColor Cyan
} catch {
    Write-Error "Could not start server on port $port. Error: $_"
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".mp3"  = "audio/mpeg"
    ".wav"  = "audio/wav"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "/index.html"
        }

        # Normalize relative file path
        $relPath = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = Join-Path $root $relPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            
            $response.ContentType = $mime
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $notFoundMsg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $notFoundMsg.Length
            $response.OutputStream.Write($notFoundMsg, 0, $notFoundMsg.Length)
        }
    } catch {
        # Catch connection drops gracefully
    } finally {
        if ($response) {
            $response.Close()
        }
    }
}
