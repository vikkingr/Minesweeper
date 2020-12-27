/*
First thing's first let's add a DOM event listener to the file.
This is to make sure all of our HTML is loaded before reading any 
Javascript code.
This can also be done by placing the script tag at the bottom of HTML code.
*/

document.addEventListener('DOMContentLoaded', () => {

    // Let's pick out the grid, and store it in a constant variable.
    const grid = document.querySelector('.grid');

    // Use querySelector to manipulate the 'flags-left' element.
    const flagsLeft = document.querySelector('#flags-left');

    // Let's make the width 10 squares.
    let width = 10;

    // Create an array of squares.
    let squaresArr = [];

    // Create the amount of bombs.
    let bombAmount = 20;

    // Boolean variable to determine if game is over or not.
    let isGameOver = false;

    // The number of flags the user can place on potential bombs.
    let flagsAmount = 0;

    /*
    Let's create the game board.
    We will make 100 squares for the grid.
    This will be done iteratively.
    Each iteration will create a new square (div) with the id of the iteration number.
    */
    function createBoard() {

        /*
        Function to randomly place bombs all over the board.
        */
        const bombsArr = Array(bombAmount).fill('bomb');

        // Create empty array for remaning squares we need to account for.
        const emptyArr = Array(width*width - bombAmount).fill('valid');

        // Create a joint array of the empty spaces and the bomb spaces.
        const gameArr = emptyArr.concat(bombsArr);

        // Create a shuffled array using the joint array and the Math.random() function.
        const shuffledArr = gameArr.sort(() => Math.random() - 0.5);

        /*
        Create 100 squares for the gameboard.
        Attach id for every square created.
        Push it to an array of squares.
        */
        for(let i = 0; i < width*width; i++) {

            // We create the squares for each iteration to load our gameboard.
            const square = document.createElement('div');

            // Using setAttribute() we assign our id for styling and data referencing. i is used for the id.
            square.setAttribute('id', i);

            /*
            Add the names of the items from the shuffled array as class names to square.
            Use classList.add() to add a new class name.
            Use the ith index of the shuffledArr to access the bomb or valid field pass it
            into the classList.add() method.
            */
            square.classList.add(shuffledArr[i]);

            // Add the square into the grid.
            grid.appendChild(square);

            // Push each square into the array of squares.
            squaresArr.push(square);

            // Let's create the left click event listener for each square.
            square.addEventListener('click', function(e) {

                // This is executed when a user clicks on a square
                click(square);

            });// end addEventListener()

            /**
             * Let's call the addFlag() here.
             * The user can right click to add a flag to a chosen square.
             */

            // Use the in built function oncontextmenu to fire this function on a right click.
            square.oncontextmenu = function(e) {

                // Prevent the refresh
                e.preventDefault();

                // Add the flag
                addFlag(square);

            }// end event function

        }// end for()

        /*
        Add numbers to the neighboring squares of the bombs.
        If any of the neighbors have a bomb in the North, NorthEast, East, SouthEast, South,
        SouthWest, West or NorthWest square, the sum of those bombs will be displayed as a number
        in that particular neighbor's box.
        Check every square's surrounding 8 squares for bombs.

        I can use a for loop to check the squaresArr.
        If the square we are checking is bounded by the game wall, make sure to check the square on the other side.
        */
        for(let i = 0; i < squaresArr.length; i++) {

            // Start counting the total number of bombs that are adjacent to our neighbor.
            let total = 0;

            /*
            Using the === and % operator I will do some math to see if a square is on the left or right side.
            Numbers on the left wall will be divisible by 10.
            Numbers along the right wall will be divisible by the width by -1;
            */
            
            // Check if the square is disible by the width;
            const isLeftEdge = i % width === 0;

            // Check if the square is divisible by the width - 1;
            const isRightEdge = i % width === width - 1;

            /*
            Using width and arithmetic, we can check whether a certain square contains a bomb.
            Width will be used to add or subtract 10, changing which row we are looking at in 
            relation to i.
            When we add or subtract 1, we can look to the right of i, or to the left of i.
            Combining this logic, we can check all 8 directions or squares that are next to
            the ith square.
            */

            // If the square does not contain a bomb,
            if(squaresArr[i].classList.contains('valid')) {

                // If the square is not next to the left wall and it contains a bomb.
                if(i > 0 && !isLeftEdge && squaresArr[i - 1].classList.contains('bomb')) {

                    total++;    // Increment our total bomb count.

                }// end if

                // If the square is not next to the right wall and it contains a bomb. (Southwest)
                if(i > 9 && !isRightEdge && squaresArr[i + 1 - width].classList.contains('bomb')) {

                    total++;    // Increment total bomb count.

                }// end if

                // Check for a bomb above the current square;
                if(i > 10 && squaresArr[i - width].classList.contains('bomb')) {

                    total++;

                }// end if

                // Check NorthWest box for a bomb;
                if(i > 11 && !isLeftEdge && squaresArr[i - 1 - width].classList.contains('bomb')) {

                    total++;

                }// end if

                // Check if there is a bomb to the right;
                if(i < 98 && !isRightEdge && squaresArr[i + 1].classList.contains('bomb')) {

                    total++;

                }// end if there is a bomb to the South West;

                if(i < 90 && !isLeftEdge && squaresArr[i - 1 + width].classList.contains('bomb')) {

                    total++;

                }// end if

                // Check for a bomb to the South East;
                if(i < 88 && !isRightEdge && squaresArr[i + 1 + width].classList.contains('bomb')) {

                    total++

                }// end if

                // Check if bomb is below.
                if(i < 89 && squaresArr[i + width].classList.contains('bomb')) {

                    total++;

                }// end if

                // Get the square we are checking and use setAttribute to add the totals so far.
                squaresArr[i].setAttribute('data', total);

            }

        }// end for()

    }// end createBoard.

    // Call this function to generate our gameboard!
    createBoard();

    /**
     * 
     * Creating the addFlag() function.
     * This will allow the user to add a flag to a bomb.
     * 
     * @param {square}
     */

    function addFlag(square) {

        // Check if the game is over.
        if(isGameOver) {

            return;

        }// end if()

        // The game is not over, check if there are fewer flags than bombs and if the square is not checked.
        if(!square.classList.contains('checked') && (flagsAmount < bombAmount)) {

            // If the square does NOT already have a flag on it...
            if(!square.classList.contains('flag')) {

                // add the 'flag' to the classlist,
                square.classList.add('flag');

                // use innerHTML to add the flag emoji to display on the square,
                square.innerHTML = '🚩';

                // and keep track of the flag count.
                flagsAmount++;

                // Display how many flags are left to the client.
                flagsLeft.innerHTML = bombAmount - flagsAmount;

                // Now that we have added an arbitrary amount of flags, we may check for a win.
                checkForWin();

            }// end if()
            else {

                // If there is a flag where the user is clicking, we need to remove it.
                square.classList.remove('flag');

                // Since there is no flag, update the innerHTML to a blank string.
                square.innerHTML = '';

                // Keep track of the amount of flags. We subtract here.
                flagsAmount--;

                // Display how many flags are left to the client.
                flagsLeft.innerHTML = bombAmount - flagsAmount;

            }// end else

        }// end if()

    }// end addFlag()

    /*
    Creating the click function.
    Use square, the square the user has just clicked, as a parameter.
    Check the square for a bomb, if there is one, game over.
    If there is no bomb, use getAttribute to get the 'data' and add that to the total number
    of bombs around that square.
    */
    function click(square) {

        let currentId = square.id;

        // If the user already stepped on a bomb, do not execute further code and return.
        if(isGameOver) {

            return;

        }// end if

        // If the user already checked a square, do not proceed further.
        if(square.classList.contains('checked') || square.classList.contains('flag')) {

            return;

        }// end if
    
        // Check if there is a bomb
        if(square.classList.contains('bomb')) {

            // Call gameOver() to terminate the game.
            gameOver(square);

        }// end if
        else {

            // Create a variable to count the total number of bombs adjacent to your square.
            let total = square.getAttribute('data');
            if(total != 0) {

                // Add a new class called "checked" so we know that we have accounted it.
                square.classList.add('checked');

                // If there is one bomb around the square, add a class of 'one' to it.
                if (total == 1) {

                    square.classList.add('one');

                }// end if

                // If there is two bombs around the square, add a class of 'two' to it.
                if (total == 2) {

                    square.classList.add('two');

                }// end if

                // If there are 3 bomb around the square, add a class of 'three' to it.
                if (total == 3) {

                    square.classList.add('three');

                }// end if

                // If there are 4 bombs around the square, add a class of 'four' to it.
                if (total == 4) {

                    square.classList.add('four');

                }// end if

                // Once a square has been checked, display it so and the total as well.
                square.innerHTML = total;

                // We're done with this.
                return;

            }// end if

            // Function to recursively check all neighboring empty squares.
            checkSquare(square, currentId);

        }// end else

        // If the square does not have a bomb or data number higher than 0;
        square.classList.add('checked');

    }// end click()

    /*
    
    Function to check neighboring squares for emptyness. 
    If they are empty, mark them as checked and 'sweep' the area until the bombs remain.

    */

    function checkSquare(square, currentId) {

        // Check if current square is on the left or right edge.
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        // Add a little latency for gameplay experience.
        setTimeout(() => {

            // If the square is not at left edge and the id is greater than 0;
            if(currentId > 0 && !isLeftEdge) {

                // Get id of square to the left (currentId - 1), use parseInt to make sure it's a number;
                const newId = squaresArr[parseInt(currentId) - 1].id;

                // Using the id, retrieve the actual square.
                const newSquare = document.getElementById(newId);

                // Recursive call to check the squares;
                click(newSquare);

            }// end if

            // Check the North East square.
            if(currentId > 9 && !isRightEdge) {

                // Get id of square, use parseInt to make sure it's a number;
                const newId = squaresArr[parseInt(currentId) + 1 - width].id;

                // Using the id, retrieve the actual square.
                const newSquare = document.getElementById(newId);

                // Recursive call;
                click(newSquare);

            }// end if

            // Check square above
            if(currentId > 10) {

                // Get the id of the square above
                const newId = squaresArr[parseInt(currentId) - width].id;

                // Retrieve the square and store it in a variable
                const newSquare = document.getElementById(newId);

                // Make the recursive call to check the rest
                click(newSquare);

            }// end if

            // Check the North West square
            if(currentId > 11 && !isLeftEdge) {

                // Get the id of the square
                const newId = squaresArr[parseInt(currentId) - 1 - width].id;

                // Retrieve the square and store it in a variable
                const newSquare = document.getElementById(newId);

                // Make the recursive call to check the rest
                click(newSquare);

            }// end if

            // Check square to the right.
            if(currentId < 98 && !isRightEdge) {

                // Get the id of the square 
                const newId = squaresArr[parseInt(currentId) + 1].id;

                // Retrieve the square and store it in a variable
                const newSquare = document.getElementById(newId);

                // Make the recursive call to check the rest
                click(newSquare);

            }// end if

            // Check the South West square
            if(currentId < 90 && !isLeftEdge) {

                // Get the id of the square
                const newId = squaresArr[parseInt(currentId) - 1 + width].id;

                // Retrieve the square and store it in a variable
                const newSquare = document.getElementById(newId);

                // Make the recursive call to check the rest
                click(newSquare);

            }// end if

            // Check the South East square
            if(currentId < 88 && !isRightEdge) {

                // Get the id of the square
                const newId = squaresArr[parseInt(currentId) + 1 + width].id;
    
                // Retrieve the square and store it in a variable
                const newSquare = document.getElementById(newId);
    
                // Make the recursive call to check the rest
                click(newSquare);
    
            }// end if

            // Check the square underneath.
            if(currentId < 88) {

                // Get the id of the square
                const newId = squaresArr[parseInt(currentId) + width].id;
    
                // Retrieve the square and store it in a variable
                const newSquare = document.getElementById(newId);
    
                // Make the recursive call to check the rest
                click(newSquare);

            }// end if

        }, 10);

    }// end checkSquare()

    /**
     * gameOver()
     * 
     * Is called whenever the user steps or clicks on a square with a bomb in it.
     * This will alert the user and terminate the game.
     */

    function gameOver(square) {

        // Notify the user of their fate.
        console.log('BOOM! Game Over.');

        // Use the result's innerHTML to display a loss.
        result.innerHTML = 'BOOM! Game Over...';
        
        // Account for the boolean variable used in the logic above.
        isGameOver = true;

        // Display all bombs to user.
        squaresArr.forEach(square => {

            if(square.classList.contains('bomb')) {

                // Use the square's innerHTML to display this little emoji.
                square.innerHTML = '💣';

                // Start removing all of the bombs from the grid to reset.
                square.classList.remove('bomb');
                
                // Start checking all of the remaining squares to reset.
                square.classList.add('checked');

            }// end if

        })// end forEach()

    }// end gameOver()

    /**
     * This function will decide if the user has won the game.
     * Check the entire grid each time we check for a win
     */

    function checkForWin() {

        // Variable to keep track of how many flags and bombs are matched.
        let matchesAmount = 0;

        // Loop through the entire grid.
        for(let i = 0; i < squaresArr.length; i++) {

            // If the square has a flag and the same square has a bomb...
            if(squaresArr[i].classList.contains('flag') && squaresArr[i].classList.contains('bomb')) {

                // We have a match at this index, so increment our match count
                matchesAmount++;

            }// end if()

            // If the number of matches is the same as the number of bombs...
            if(matchesAmount === bombAmount) {

                // Congratulate the player!
                console.log('CONGRATULATIONS!!! You won!!!');

                // Use result's innerHTML to display the winnings!
                result.innerHTML = 'YOU WON! Congratulations!!!'

                // Make sure the game is over.
                isGameOver = true;

            }// end if()

        }// end for()

    }// end checkForWin()

}); // End event listener