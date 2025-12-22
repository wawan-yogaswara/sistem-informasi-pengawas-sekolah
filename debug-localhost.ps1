# Debug Localhost Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DEBUG LOCALHOST - PENGAWAS SEKOLAH" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test URL
function Test-Url {
    param($url, $description)
    Write-Host "Testing $description..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $description - OK (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️ $description - Warning (Status: $($response.StatusCode))" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "❌ $description - Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to check port
function Test-Port {
    param($port)
    Write-Host "Checking port $port..." -ForegroundColor Yellow
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $port -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Host "✅ Port $port is open" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Port $port is closed" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Cannot test port $port: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Check if server is running
Write-Host "1. Checking if server is running..." -ForegroundColor Cyan
$portOpen = Test-Port -port 5000

if (-not $portOpen) {
    Write-Host ""
    Write-Host "🚨 SERVER NOT RUNNING!" -ForegroundColor Red
    Write-Host "Please start the server first:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host ""
Write-Host "2. Testing API endpoints..." -ForegroundColor Cyan

# Test endpoints
$tests = @(
    @{ url = "http://localhost:5000/api/test"; desc = "Test Endpoint" },
    @{ url = "http://localhost:5000/api/health"; desc = "Health Check" },
    @{ url = "http://localhost:5000/"; desc = "Frontend Root" },
    @{ url = "http://localhost:5000/login"; desc = "Login Page" }
)

$passedTests = 0
foreach ($test in $tests) {
    if (Test-Url -url $test.url -description $test.desc) {
        $passedTests++
    }
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "3. Test Results:" -ForegroundColor Cyan
Write-Host "   Passed: $passedTests / $($tests.Count)" -ForegroundColor $(if ($passedTests -eq $tests.Count) { "Green" } else { "Yellow" })

if ($passedTests -eq $tests.Count) {
    Write-Host ""
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "Application is running correctly at:" -ForegroundColor Green
    Write-Host "   http://localhost:5000" -ForegroundColor White
    Write-Host ""
    Write-Host "Default login credentials:" -ForegroundColor Yellow
    Write-Host "   Username: admin" -ForegroundColor White
    Write-Host "   Password: admin123" -ForegroundColor White
    Write-Host ""
    
    $openBrowser = Read-Host "Open browser? (y/n)"
    if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
        Start-Process "http://localhost:5000/login"
    }
} else {
    Write-Host ""
    Write-Host "⚠️ SOME TESTS FAILED" -ForegroundColor Yellow
    Write-Host "Check the errors above and try:" -ForegroundColor Yellow
    Write-Host "1. Restart the server: npm run dev" -ForegroundColor White
    Write-Host "2. Clear browser cache (Ctrl+Shift+R)" -ForegroundColor White
    Write-Host "3. Try incognito mode" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")