# Amrita Placement Tracker - Android SDK Setup + APK Builder
# Run this script once to install Android SDK and build the APK
# Prerequisites: Flutter must be installed

$sdkRoot = "C:\Android\Sdk"
$toolsZip = "$env:TEMP\cmdlinetools.zip"
$toolsDest = "$sdkRoot\cmdline-tools\latest"

function Write-Step($msg) { Write-Host "`n>>> $msg" -ForegroundColor Cyan }

# ── Step 1: Download SDK command-line tools if not present ──────────────────
if (-not (Test-Path "$toolsDest\bin\sdkmanager.bat")) {
    Write-Step "Downloading Android SDK command-line tools (~150MB)..."
    New-Item -ItemType Directory -Force -Path $toolsDest | Out-Null
    Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-win-14742923_latest.zip" -OutFile $toolsZip -UseBasicParsing
    
    Write-Step "Extracting..."
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $tmpExtract = "$env:TEMP\cmdline-tools-extract"
    if (Test-Path $tmpExtract) { Remove-Item $tmpExtract -Recurse -Force }
    [System.IO.Compression.ZipFile]::ExtractToDirectory($toolsZip, $tmpExtract)
    # Move contents of cmdline-tools folder to $toolsDest
    Get-ChildItem "$tmpExtract\cmdline-tools" | Copy-Item -Destination $toolsDest -Recurse -Force
    Remove-Item $tmpExtract -Recurse -Force
    Remove-Item $toolsZip -Force
    Write-Host "Done!" -ForegroundColor Green
} else {
    Write-Step "Android SDK tools already installed. Skipping download."
}

# ── Step 2: Set environment variables ────────────────────────────────────────
$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:PATH = "$sdkRoot\cmdline-tools\latest\bin;$sdkRoot\platform-tools;$sdkRoot\build-tools\35.0.0;$env:PATH"
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkRoot, "User")
[System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $sdkRoot, "User")
$currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*$sdkRoot*") {
    [System.Environment]::SetEnvironmentVariable("PATH", "$sdkRoot\cmdline-tools\latest\bin;$sdkRoot\platform-tools;$currentPath", "User")
}

# ── Step 3: Install required SDK packages ────────────────────────────────────
Write-Step "Installing Android SDK packages (may take several minutes)..."
$sdkmanager = "$toolsDest\bin\sdkmanager.bat"
# Accept all licenses
echo "yes" | & $sdkmanager --sdk_root=$sdkRoot --licenses
# Install required components
& $sdkmanager --sdk_root=$sdkRoot "platform-tools" "platforms;android-35" "build-tools;35.0.0"

# ── Step 4: Configure Flutter ────────────────────────────────────────────────
Write-Step "Configuring Flutter to use Android SDK..."
flutter config --android-sdk $sdkRoot
echo "yes" | flutter doctor --android-licenses

# ── Step 5: Build the APK ────────────────────────────────────────────────────
Write-Step "Building release APK..."
Set-Location "$PSScriptRoot\flutter_app"
flutter pub get
flutter build apk --release --split-per-abi

# ── Done ─────────────────────────────────────────────────────────────────────
Write-Step "BUILD COMPLETE!"
$apkDir = "$PSScriptRoot\flutter_app\build\app\outputs\flutter-apk"
if (Test-Path $apkDir) {
    Write-Host "`nAPK files are ready in:" -ForegroundColor Green
    Write-Host "  $apkDir" -ForegroundColor Yellow
    Get-ChildItem "$apkDir\*.apk" | ForEach-Object { Write-Host "  - $($_.Name)  ($([Math]::Round($_.Length/1MB,1)) MB)" }
    Write-Host "`nShare the 'arm64-v8a' APK — it works on 95%+ of modern Android phones." -ForegroundColor Green
    # Open folder in Explorer
    explorer $apkDir
} else {
    Write-Host "Build may have failed. Check the output above for errors." -ForegroundColor Red
}

Read-Host "`nPress Enter to exit"
