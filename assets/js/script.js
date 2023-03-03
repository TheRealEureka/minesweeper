//SETTINGS

let grid_size = 20;
let mine_count = 30;

// END SETTINGS
let gridArray = [];
let canDefuse = true;
let flagMode = false;
let stopTimer = false;
let flagCount = 0;
let time = {
    second: 0,
    minute: 0,
};

function newGame(){
    let grid = document.getElementById('grid');
    grid.style.gridTemplateColumns = 'repeat(' + grid_size + ', 1fr)';
    grid.style.gridTemplateRows = 'repeat(' + grid_size + ', 1fr)';
    document.getElementById('flag-count').innerText = flagCount + '/' + mine_count;
    grid.innerHTML = '';
    for (let i = 0; i < grid_size; i++) {
        gridArray[i] = [];
        for (let y = 0; y < grid_size; y++) {
            let div = document.createElement('div');
            div.addEventListener('click', () => {
                if(!flagMode){
                unfuse(i, y);
                }else{
                    flag(i, y);
                }
            });
            gridArray[i][y] = div;
            div.classList.add('grid-item');
            grid.appendChild(div);
        }
    }
    generateMines();
}
function flag(x,y){
    if(canDefuse){
        if(gridArray[x][y].classList.contains('flag')){
            gridArray[x][y].classList.remove('flag');
            flagCount--;
        }else{
            if(!gridArray[x][y].classList.contains('active'))
            {
                gridArray[x][y].classList.add('flag');
                flagCount++;
            }
        }
        document.getElementById('flag-count').innerText = flagCount + '/' + mine_count;
    }
}
function unfuse(x,y){
    if(canDefuse && !gridArray[x][y].classList.contains('flag')){
    if(gridArray[x][y].classList.contains('mine')){
        gridArray[x][y].classList.add('loose-case');
        loose();
    }else{
        let mines = 0;
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                if(gridArray[x+i] && gridArray[x+i][y+j]){
                    if(gridArray[x+i][y+j].classList.contains('mine')){
                        mines++;
                    }
                }
            }
        }
        gridArray[x][y].classList.add('active');
        if(mines !== 0){
            gridArray[x][y].innerHTML = '<p>'+mines+'</p>';
            switch (mines) {
                case 1:
                    gridArray[x][y].style = 'color: blue';
                    break;
                case 2:
                    gridArray[x][y].style = 'color: green';
                    break;
                case 3:
                    gridArray[x][y].style = 'color: red';
                    break;
                case 4:
                    gridArray[x][y].style = 'color: purple';
                    break;
               default:
                    gridArray[x][y].style = 'color: maroon';
            }
        }else{
            defuseNear(x,y);
        }
    }
}
}
function defuseNear(x,y){
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            if(gridArray[x+i] && gridArray[x+i][y+j]){
                if(!gridArray[x+i][y+j].classList.contains('active')){
                    unfuse(x+i,y+j);
                }
            }
        }
    }
}
function loose(){
    stopTimer = true;
    canDefuse = false;
    for(let i = 0; i < grid_size; i++){
        for(let y = 0; y < grid_size; y++){
            if(gridArray[i][y].classList.contains('mine')){
                gridArray[i][y].classList.add('mine-active');
            }
        }
    }
}
function generateMines(){
    let mines = 0;
    while(mines < mine_count){
        let x = Math.floor(Math.random() * grid_size);
        let y = Math.floor(Math.random() * grid_size);
        if(!gridArray[x][y].classList.contains('mine')){
            gridArray[x][y].classList.add('mine');
            mines++;
        }
    }
}
function startTimer(){
    time.second++;
    if(time.second === 60){
        time.second = 0;
        time.minute++;
    }
    let second = time.second;
    let minute = time.minute;
    if(second < 10){
        second = '0' + second;
    }
    if(minute < 10){
        minute = '0' + minute;
    }
    document.getElementById('timer').innerHTML = minute + ':' + second;
    if(!stopTimer){
        setTimeout(startTimer, 1000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    newGame();
    startTimer();

    let status = document.getElementById('status_flag');
    document.getElementById('flag-btn').addEventListener('click', () => {
        flagMode = !flagMode;
        if(flagMode){
            status.innerHTML = 'Oui';
        }else{
            status.innerHTML = 'Non';
        }
    });
    document.getElementById('reset-btn').addEventListener('click', () => {
        let w = document.getElementById('width').value;
        let m = document.getElementById('mines').value;
        gridArray = [];
        if(w > 0 && m > 0 && w <= 20 && m <= 50){
            grid_size = w;
            mine_count = m;
        }
        else{
            document.getElementById('width').value = 15;
            document.getElementById('mines').value = 30;
            grid_size = 15;
            mine_count = 30;
        }
        if(stopTimer === true){
        stopTimer = false;
            startTimer();

        }
        time = {
            second: 0,
            minute: 0,
        };
        flagCount = 0;
        flagMode = false;
        canDefuse = true;
        newGame();

    });
});