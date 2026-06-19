<?php

$gridRaw = [
    "########",
    "#......#",
    "#.###..#",
    "#...#.##",
    "#X#....#",
    "########",
];

$rows = count($gridRaw);
$cols = strlen($gridRaw[0]);

$startX = -1;
$startY = -1;

for ($y = 0; $y < $rows; $y++) {
    for ($x = 0; $x < $cols; $x++) {
        if ($gridRaw[$y][$x] === 'X') {
            $startX = $x;
            $startY = $y;
            break 2;
        }
    }
}

$probableLocations = [];

for ($a = 1; ; $a++) {
    $yA = $startY - $a;
    $xA = $startX;
    
    if ($yA < 0 || $gridRaw[$yA][$xA] === '#') {
        break;
    }

    for ($b = 1; ; $b++) {
        $xB = $xA + $b;
        $yB = $yA;
        
        if ($xB >= $cols || $gridRaw[$yB][$xB] === '#') {
            break;
        }

        for ($c = 1; ; $c++) {
            $yC = $yB + $c;
            $xC = $xB;
            
            if ($yC >= $rows || $gridRaw[$yC][$xC] === '#') {
                break;
            }

            $probableLocations[] = ['x' => $xC, 'y' => $yC];
        }
    }
}

echo "Starting position found at (X: {$startX}, Y: {$startY})\n\n";

echo "List of probable coordinate points (X, Y):\n";
if (empty($probableLocations)) {
    echo "No valid locations found.\n";
} else {
    foreach ($probableLocations as $loc) {
        echo "- ({$loc['x']}, {$loc['y']})\n";
    }
}

echo "\n";

$displayGrid = $gridRaw;
foreach ($probableLocations as $loc) {
    $displayGrid[$loc['y']][$loc['x']] = '$';
}

echo "Grid Layout with probables marked as '$':\n";
foreach ($displayGrid as $row) {
    echo $row . "\n";
}

echo "\n";