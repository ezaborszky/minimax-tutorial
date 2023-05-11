const cells = document.querySelectorAll('.cell')
let turnOfX= true

const Board = (() => {


    let tableArray = [];

    function createTable() {for(let i = 0; i < 3 ; i++) {
            let tableColumns = []
            for (let j = 0; j < 3; j++) {
                let tablerows = []
                tableColumns.push(tablerows)
            }
            tableArray.push(tableColumns)
        }}

    createTable();

    function checkForWinner(array, player) {

        //ROWS
        for(let i = 0; i < 3; i++){
            let firstELement = player
            let hasSameValue = true

            for(let j = 1; j < 3; j++) {
                if(array[i][j] !== firstELement) {
                    hasSameValue = false;
                    break;
                }
            }
            if(hasSameValue) {
                return firstELement;
            }
        }

        //COLUMNS
        for(let j = 0; j < 3; j++){
            let firstELement = player
            let hasSameValue = true

            for(let i = 1; i < 3; i++) {
                if(array[i][j] !== firstELement) {
                    hasSameValue = false;
                    break;
                }
            }
            if(hasSameValue) {
                return firstELement;
            }
        }

        //DIAGONALS

        //first diagonal
        let firstDiagonalElement = player
        let hasSameValue = true

        for(let i = 1; i < 3; i++) {
            if(array[i][i] !== firstDiagonalElement) {
                hasSameValue = false;
                break;
            }
        }
        if(hasSameValue) {
            return firstDiagonalElement;
        }

        //second digonal
        let secondDiagonalElement = player
        hasSameValue = true

        for(let i = 1; i < 3; i++) {
            if(array[i][2-i] !== secondDiagonalElement) {
                hasSameValue = false;
                break;
            }
        }
        if(hasSameValue) {
            return secondDiagonalElement;
        }

    return null;

    }

    function resetTurn() {
        turn = 0;
    }

    return {
            value : (a,b) => {return tableArray[a][b] },
            setCell : (a,b,c) => {if(tableArray[a][b] !== 'x' && tableArray[a][b] !== 'o') {tableArray[a][b] = c} else {return}},
            reset : () => {tableArray = []; createTable(), resetTurn()},
            wholeTable : () => {return tableArray},
            checkForWinner : (array) => {return checkForWinner(array)},
            currentTurn : () => {return turn},
            nextTurn : () => {return turn++},
    }


})();


const Display = (() => {

    function displayCell() {
                
        cells.forEach(cell => {
            y = cell.dataset.indexY
            x = cell.dataset.indexX
            if(Board.value(y,x) === 'x'){
                cell.classList.add('x')
            } else if(Board.value(y,x) === 'o')
            { cell.classList.add('o') 
                }else{return}
        })
    }

    return {
        refresh : (e) => {displayCell(e)}
    }
})()



const Computer = (() => {
   
    function moveSet() {
    setList = [];    
        
        for(let i = 0; i < 3 ; i++) {
            for (let j = 0; j < 3; j++) {
                let cellValue = {
                    value : `${Board.value(i,j)}`,
                    y : i,
                    x : j}
                
                setList.push(cellValue)
                }
            }     
          
        return setList;
    }

    function emptyCells() {
        return moveSet().filter(s => s.value === '')
           }       
    
    function makeMove() {

        for(let i = 0; i < 3 ; i++) {
            for (let j = 0; j < 3; j++) {
                if(Board.value(i,j) !== 'x' && Board.value(i,j) !== 'o') {
                    Board.setCell(i,j,'o')
                    return
                }
            }
            }
             
        }

        
    function miniMax(board,player) {
        let availSpots = emptyCells();
        // console.log(availSpots[0].y)
         
         
        if(Board.checkForWinner(board,'x') == 'x') {
            return{score: -10};
        } else if (Board.checkForWinner(board, 'x') == 'o') {
            return{score: 10};
        } else if(availSpots.length === 0) {
           
            return{score: 0};
        }

        let moves = [];
        for (var  i = 0; i < availSpots.length; i++) {
            var move = {};
            move.indexY = availSpots[i].y
            move.indexX = availSpots[i].x

            Board.setCell(availSpots[i].y,availSpots[i].x,player)

            if(player === 'o') {
                
                let result = miniMax(board,'x');
                move.score = result.score;
            } else {
               
                let result = miniMax(board,'o') 
                move.score = result.score
            }
            
            Board.setCell(availSpots[i].y,availSpots[i].x, undefined)

            moves.push(move);
             
        }

    let bestMove;

	if(player === 'o') {
		let bestScore = -10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
    console.log(moves[bestMove])
	return moves[bestMove];

    }  



    return {
        makeMove : () => {makeMove()},
        moveSet : () => {return moveSet()},
        emptyCells : () => {return emptyCells()},
        miniMax : (board, player) => {miniMax(board, player)},
         
    }

})();


function checkCell(e) {
    let y = e.target.dataset.indexY
    let x = e.target.dataset.indexX
    if(Board.checkForWinner(Board.wholeTable()) !== null) {
        
        return Board.checkForWinner(Board.wholeTable())
    } else {         
        Board.setCell(y,x,"x")
        Computer.miniMax(Board.wholeTable(),'o')
        turnOfX = !turnOfX;
        Display.refresh(e);       
                        }
    }

cells.forEach(cell => {
    cell.addEventListener('click', checkCell, { once:true })
})



 