// ==UserScript==
// @name            Sea Battle (Ship the Ship)
// @description     Helps you to analyze the field during Sea Battle.
//
// @grant           none
//
// @match        http://ru.battleship-game.org/*
//
// @version         0.0.1
// ==/UserScript==

// Function to calculate color based on probability
(function() {
    'use strict';
    
    function getColor(probability) {
        var color_p = 255 - (2 * probability) % 255;
        return 'rgb(' + color_p + ',' + color_p + ',' + color_p + ')';
    }
    
    function countShips() {
        // Select the ship types container element
        var shipTypesContainer = document.querySelector('.battlefield__rival');
        
        // Initialize counters for each ship length
        var shipsLength1 = 4;
        var shipsLength2 = 3;
        var shipsLength3 = 2;
        var shipsLength4 = 1;

        // Iterate over each ship type element
        var shipTypeElements = shipTypesContainer.querySelectorAll('.ship__killed');
        shipTypeElements.forEach(function(shipTypeElement) {
            // Extract the ship length from the class name
            var shipLength = shipTypeElement.getAttribute('data-coords').split(';').length;

            // Count the number of ships for each length
            if (shipLength === 1) {
                shipsLength1--;
            } else if (shipLength === 2) {
                shipsLength2--;
            } else if (shipLength === 3) {
                shipsLength3--;
            } else if (shipLength === 4) {
                shipsLength4--;
            }
        });

        // Return an object with the counts for each ship length
        return [shipsLength1, shipsLength2, shipsLength3, shipsLength4]
    }

    
    function single_can_placed(x, y, revalField) {
        return revalField[x][y] === 0 ? true : false;
    };
    
    function ship_possible(x, y, length, revalField) {
        let left = true;
        for (let l = 0; l < length; l++) {
            if (y - (1 * l) >= 0 && y - (1 * l) < 10) {
                if (revalField[x][y - (1 * l)] !== 0) {
                    left = false;
                }
            } else {
                left = false;
            }
        }
        
        let right = true;
        for (let l = 0; l < length; l++) {
            if (y + (1 * l) >= 0 && y + (1 * l) < 10) {
                if (revalField[x][y + (1 * l)] !== 0) {
                    right = false;
                }
            } else {
                right = false;
            }
        }
        
        let up = true;
        for (let l = 0; l < length; l++) {
            if (x - (1 * l) >= 0 && x - (1 * l) < 10) {
                if (revalField[x - (1 * l)][y] !== 0) {
                    up = false;
                }
            } else {
                up = false;
            }
        }
        
        let down = true;
        for (let l = 0; l < length; l++) {
            if (x + (1 * l) >= 0 && x + (1 * l) < 10) {
                if (revalField[x + (1 * l)][y] !== 0) {
                    down = false;
                }
            } else {
                down = false;
            }
        }
        
        return [left, right, up, down];
    };
    
    function calculate_probability(single, double, triple, quatro, revalField) {
        var probabilityField = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ];
        
        for (var i = 0; i < single; i++) {
            for (var x = 0; x < 10; x++) {
                for (var y = 0; y < 10; y++) {
                    if (single_can_placed(x, y, revalField)) {
                        probabilityField[x][y] += 1;
                    }
                }
            }
        }
        
        for (var j = 0; j < double; j++) {
            for (var m = 0; m < 10; m++) {
                for (var n = 0; n < 10; n++) {
                    var res = ship_possible(m, n, 2, revalField);

                    if (res[0]) { // left
                        for (var k = 0; k < 2; k++) {
                            probabilityField[m][n - (1 * k)] += 1;
                        }
                    }
                    if (res[1]) { // right
                        for (var l = 0; l < 2; l++) {
                            probabilityField[m][n + (1 * l)] += 1;
                        }
                    }
                    if (res[2]) { // up
                        for (var o = 0; o < 2; o++) {
                            probabilityField[m - (1 * o)][n] += 1;
                        }
                    }
                    if (res[3]) { // down
                        for (var p = 0; p < 2; p++) {
                            probabilityField[m + (1 * p)][n] += 1;
                        }
                    }
                }
            }
        }
        
        for (var q = 0; q < triple; q++) {
            for (var r = 0; r < 10; r++) {
                for (var s = 0; s < 10; s++) {
                    var res = ship_possible(r, s, 3, revalField);

                    if (res[0]) { // left
                        for (var t = 0; t < 3; t++) {
                            probabilityField[r][s - (1 * t)] += 1;
                        }
                    }
                    if (res[1]) { // right
                        for (var u = 0; u < 3; u++) {
                            probabilityField[r][s + (1 * u)] += 1;
                        }
                    }
                    if (res[2]) { // up
                        for (var v = 0; v < 3; v++) {
                            probabilityField[r - (1 * v)][s] += 1;
                        }
                    }
                    if (res[3]) { // down
                        for (var w = 0; w < 3; w++) {
                            probabilityField[r + (1 * w)][s] += 1;
                        }
                    }
                }
            }
        }
        
        for (var x1 = 0; x1 < quatro; x1++) {
            for (var y1 = 0; y1 < 10; y1++) {
                for (var z1 = 0; z1 < 10; z1++) {
                    var res1 = ship_possible(y1, z1, 4, revalField);

                    if (res1[0]) { // left
                        for (var a1 = 0; a1 < 4; a1++) {
                            probabilityField[y1][z1 - (1 * a1)] += 1;
                        }
                    }
                    if (res1[1]) { // right
                        for (var b1 = 0; b1 < 4; b1++) {
                            probabilityField[y1][z1 + (1 * b1)] += 1;
                        }
                    }
                    if (res1[2]) { // up
                        for (var c1 = 0; c1 < 4; c1++) {
                            probabilityField[y1 - (1 * c1)][z1] += 1;
                        }
                    }
                    if (res1[3]) { // down
                        for (var d1 = 0; d1 < 4; d1++) {
                            probabilityField[y1 + (1 * d1)][z1] += 1;
                        }
                    }
                }
            }
        }
        
        return probabilityField;
    };
    
    function fillProbabilityField(single, double, triple, quatro) {
        var revalField = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ];
        
        var field_reval = document.querySelector('.battlefield__rival');
        var cells = field_reval.querySelectorAll('.battlefield-cell');
        cells.forEach(function(cell) {
            var cell_state = cell.classList;
            if (!cell.classList.contains('battlefield-cell__empty')) {
                var cell_content = cell.querySelector('.battlefield-cell-content');
                var x = cell_content.getAttribute('data-x');
                var y = cell_content.getAttribute('data-y');
                revalField[y][x] = 1;
            };
        });
        return calculate_probability(single, double, triple, quatro, revalField)
    };

    // Modify the appearance of the battlefield cells
    function colorizeBattlefield(probabilityField) {
        var field_reval = document.querySelector('.battlefield__rival');
        var cells = field_reval.querySelectorAll('.battlefield-cell-content');
        var maxProbability = Number.MIN_VALUE; // Initialize maxProbability to the smallest possible number
        for (var i = 0; i < probabilityField.length; i++) {
            for (var j = 0; j < probabilityField[i].length; j++) {
                if (probabilityField[i][j] > maxProbability) {
                    maxProbability = probabilityField[i][j];
                }
            }
        };
        cells.forEach(function(cell_content) {
            var x = cell_content.getAttribute('data-x');
            var y = cell_content.getAttribute('data-y');
            var probability = probabilityField[y][x]; // Get probability from a global variable probabilityField
            
            var color = 'rgb(0,100,0)'
            if (probability !== maxProbability) {
                var color = getColor(probability);
            };
            cell_content.style.backgroundColor = color;
            
            // Remove existing probability span element if it exists
            var existingSpan = cell_content.querySelector('.probability-span');
            if (existingSpan) {
                cell_content.removeChild(existingSpan);
            }
            if (probability !== 0) {
                var textNode = document.createElement('span');
                textNode.classList.add('probability-span'); // Add class to span element
                textNode.style.color = 'black'; // Set font color to black
                textNode.style.position = 'absolute'; // Position the text in the center
                textNode.style.top = '50%'; // Center vertically
                textNode.style.left = '50%'; // Center horizontally
                textNode.style.transform = 'translate(-50%, -50%)'; // Center the text
                textNode.innerText = probability; // Set probability as text content
                cell_content.appendChild(textNode); // Append text node to cell
            };
        });
    }

    // Main function
    function main() {
        var ships = countShips();
        var probabilityField = fillProbabilityField(ships[0], ships[1], ships[2], ships[3]);

        // Call colorizeBattlefield function
        colorizeBattlefield(probabilityField);
    }

    document.addEventListener("click", function() {
        // Call the main function after a delay of 1000 milliseconds (0.1 second)
        setTimeout(main, 500); // Adjust the delay time as needed (in milliseconds)
    });
})();