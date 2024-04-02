const elements = [ 
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'village',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false        
    },
    {
        time: 1,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'plains',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'village',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'plains',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'village',
        shape: [[1,1,0],
                [1,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'village',
        shape: [[1,1,1],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'plains',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'plains',
        shape: [[0,1,0],
                [1,1,1],
                [0,1,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [1,0,0],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,0,0],
                [1,1,1],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,1]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,0],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
];

// ... (previous code)

document.addEventListener("DOMContentLoaded", function () {
    const matrix = document.getElementById("matrix");
    const roundsCard = document.getElementById("rounds-card");
    const previewCard = document.getElementById("preview-card");
    const pointsCard = document.getElementById("points-card");
    const previewGrid = document.getElementById("preview-grid");

    let remainingTime = 28;
    let patternPreview = null;
    let prevType = null;
    let roundsCompleted = 0;
    let points = 0;
    let awardedRows = [];
    let awardedColumns = [];

    function generateRandomPattern() {
        const randomIndex = Math.floor(Math.random() * elements.length);
        const { shape, type, time } = elements[randomIndex];
        displayPatternPreview(shape, type, time, remainingTime);
        return [shape, type, time];
    }

    function displayPatternPreview(pattern, type, time, remainingTime) {
        const previewGrid = document.getElementById("preview-grid");
        previewGrid.innerHTML = "";

        const timeUnit = document.getElementById("time-unit");
        timeUnit.innerText = `Time: ${time} | Remaining Time: ${remainingTime - roundsCompleted}`;

        pattern.forEach(row => {
            row.forEach(cellValue => {
                const cell = document.createElement("div");
                cell.classList.add("preview-cell");
                if (cellValue) {
                    cell.style.backgroundImage = `url('assets/tiles/${type}_tile.png')`;
                }
                previewGrid.appendChild(cell);
            });
        });
    }

    function placePatternOnGrid(pattern, type, targetCell) {
        const matrix = document.getElementById("matrix");
        let hasOverlap = false;

        for (let i = 0; i < pattern.length; i++) {
            for (let j = 0; j < pattern[0].length; j++) {
                const cell = matrix.querySelector(`.row-${targetCell.row + i}.col-${targetCell.col + j}`);
                if (!cell.classList.contains('mountain')) {
                    const cellType = pattern[i][j];
                    if (cellType) {
                        if (cell.classList.contains('placed') || cell.classList.contains('mountain')) {
                            hasOverlap = true;
                            cell.style.border = "2px solid red"; // Red border for cells with overlap
                        } else {
                            cell.style.backgroundImage = `url('assets/tiles/${type}_tile.png')`;
                            cell.classList.add('placed');
                        }
                    } else {
                        cell.style.border = "2px solid red"; // Red border for intended cells without overlap
                    }
                }
            }
        }

        return hasOverlap;
    }

    function checkAndAwardPoints() {
        for (let i = 0; i < 11; i++) {
            if (!awardedRows.includes(i) && isRowFilled(i)) {
                points += 6;
                awardedRows.push(i);
            }
        }

        for (let j = 0; j < 11; j++) {
            if (!awardedColumns.includes(j) && isColumnFilled(j)) {
                points += 6;
                awardedColumns.push(j);
            }
        }
    }

    function isRowFilled(row) {
        for (let j = 0; j < 11; j++) {
            const cell = document.querySelector(`.row-${row}.col-${j}`);
            if (!cell.classList.contains('placed')) {
                return false;
            }
        }
        return true;
    }

    function isColumnFilled(column) {
        for (let i = 0; i < 11; i++) {
            const cell = document.querySelector(`.row-${i}.col-${column}`);
            if (!cell.classList.contains('placed')) {
                return false;
            }
        }
        return true;
    }

    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell", `row-${i}`, `col-${j}`);
            cell.row = i;
            cell.col = j;

            if ((i === 2 && j === 2) ||
                (i === 4 && j === 9) ||
                (i === 6 && j === 4) ||
                (i === 9 && j === 10) ||
                (i === 10 && j === 6)) {
                cell.style.backgroundImage = "url('assets/tiles/mountain_tile.png')";
                cell.classList.add('mountain');
            }

            cell.addEventListener("click", function () {
                if (!cell.classList.contains('placed') && !cell.classList.contains('mountain') && roundsCompleted < 28) {
                    const arr = generateRandomPattern();
                    patternPreview = arr[0];
                    prevType = arr[1];
                    placePatternOnGrid(patternPreview, prevType, cell);
                    if (!cell.querySelector('.placed')) {
                        roundsCompleted += arr[2];
                        checkAndAwardPoints();
                    }

                    roundsCard.textContent = `Rounds : ${roundsCompleted} / 28`;
                    pointsCard.textContent = `Points: ${points}`;
                }
            });

            matrix.appendChild(cell);
        }
    }


    generateRandomPattern(); // Display the initial pattern preview

    document.getElementById('rotateButton').addEventListener('click', function() {
        if (patternPreview) {
            patternPreview = rotatePatternClockwise(patternPreview);
            displayPatternPreview(patternPreview, prevType, patternPreview.length, remainingTime);
        }
    });

    document.getElementById('mirrorButton').addEventListener('click', function() {
        if (patternPreview) {
            patternPreview = mirrorPattern(patternPreview);
            displayPatternPreview(patternPreview, prevType, patternPreview.length, remainingTime);
        }
    });

    document.getElementById('reloadButton').addEventListener('click', function() {
        location.reload();
    });
});

