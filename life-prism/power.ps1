# Define the path to the application's root directory
$rootPath = Get-Location

# Define the output file path
$outputFilePath = Join-Path $rootPath "nextjs-codebase.txt"

# Initialize the output file
Out-File -FilePath $outputFilePath -Encoding UTF8 -Force

# Define a function to recursively list files and directories
function List-FilesAndContents {
    param (
        [string]$path
    )
    
    # Define the exclusions
    $exclusions = @(
        "node_modules", 
        "nextjs-codebase.txt", 
        "public", 
        ".next", 
        "package-lock.json", 
        "next"
    )

    # Get all items in the current path, excluding specified items
    Get-ChildItem -Path $path -Recurse | 
    Where-Object { 
        ($_.FullName -notlike "*\node_modules\*") -and
        ($_.FullName -notlike "*\.next\*") -and
        ($_.FullName -notlike "*\public\*") -and
        ($_.FullName -notlike "*\next\*") -and
        ($_.FullName -notlike "*\package-lock.json") -and
        ($_.FullName -notlike "*\nextjs-codebase.txt") -and
        ($_.PSIsContainer -or ($_.Name -notin $exclusions))
    } |
    ForEach-Object {
        $relativePath = $_.FullName.Substring($rootPath.Length).TrimStart('\')

        if ($_.PSIsContainer) {
            # Write the directory path to the output file
            "Directory: $relativePath" | Out-File -FilePath $outputFilePath -Encoding UTF8 -Append
        } else {
            # Write the file path to the output file
            "File: $relativePath" | Out-File -FilePath $outputFilePath -Encoding UTF8 -Append
            # Write the file contents to the output file
            Get-Content $_.FullName | ForEach-Object {
                "    $_" | Out-File -FilePath $outputFilePath -Encoding UTF8 -Append
            }
        }
    }
}

# Execute the function
List-FilesAndContents -path $rootPath

Write-Host "Listing completed. Output is saved in $outputFilePath"
