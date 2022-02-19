// datepicker deafult value

const calendar = document.getElementById("theDate");

let date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

if (month < 10) month = "0" + month;
if (day < 10) day = "0" + day;

let today = year + "-" + month + "-" + day;     
calendar.value = today;
calendar.max = today;

//=======================

let obj = {
    USD: 0,
    EUR: 0,
    CNY: 0,
    RUB: 0
};

const elementUSD = document.getElementById('USD');
const elementEUR = document.getElementById('EUR');
const elementCNY = document.getElementById('CNY');
const elementRUB = document.getElementById('RUB');

const preload = document.getElementById('preload');

async function getCurrency (date) {
    
    preload.classList.remove('invise');

    let adress = '';
    date === undefined ? adress = 'https://www.nbrb.by/api/exrates/rates?periodicity=0' : adress = `https://www.nbrb.by/api/exrates/rates?ondate=${date}&periodicity=0`;

    const response = await fetch(adress);

    const result = await response.json();

    const data = await result;

    if (obj.USD === 0) {
        let updateDate = data[5].Date.split('T');

        document.getElementById('update-date').innerHTML = `Обновлено ${updateDate[0].split('-').reverse().join('-')}, ${updateDate[1]}`;

        obj.USD = data[5].Cur_OfficialRate;
        obj.EUR = data[6].Cur_OfficialRate;
        obj.CNY = data[12].Cur_OfficialRate / 10;
        obj.RUB = data[17].Cur_OfficialRate / 100;
    }

    elementUSD.innerHTML =data[5].Cur_OfficialRate.toFixed(4);
    elementEUR.innerHTML = data[6].Cur_OfficialRate.toFixed(4);
    elementCNY.innerHTML = data[12].Cur_OfficialRate.toFixed(4);
    elementRUB.innerHTML = data[17].Cur_OfficialRate.toFixed(4);

    preload.classList.add('invise');

    convertHandle('input', input.value, document.getElementById('input-select').value, document.getElementById('output-select').value)

    return;
}

getCurrency();

calendar.addEventListener('change', () => {
    if (calendar.value === '') {
        calendar.value = today;
        getCurrency();
    }
    else {
        let value = calendar.value.toString().split('-');
        let selectedDate = value[0] + '-' + value[1].split('').filter((el)=>el!='0').join('') + '-' +  value[2].split('').filter((el)=>el!='0').join('')
    
        getCurrency(selectedDate);
    }
})

function convertHandle (input, value, select, targetSelect) {
    let target;
    input === 'input' ?  target = document.getElementById('output') : target = document.getElementById('input');

    let course;

    obj[targetSelect] ? course = obj[targetSelect] : course = obj[select]; 

    if (select == targetSelect) {
        target.value = value;
    }

    else if (select === 'BYN') {
        target.value = (value / course).toFixed(4);
    }

    else if (targetSelect === 'BYN') {
        target.value = (value * course).toFixed(4);
    }

    else {
        let BYNcourse = obj[select];
        target.value = (((value * BYNcourse)) / course).toFixed(4);
    }

}

const input = document.getElementById('input');
const output = document.getElementById('output');

const inputSelect = document.getElementById('input-select');
const outputSelect = document.getElementById('output-select');

input.addEventListener('input', () => {
    convertHandle('input', input.value, inputSelect.value, outputSelect.value)
})

output.addEventListener('input', () => {
    convertHandle('output', output.value, outputSelect.value, inputSelect.value)
})

inputSelect.addEventListener('change', () => {
    convertHandle('output', output.value, outputSelect.value, inputSelect.value);
})

outputSelect.addEventListener('change', () => {
    convertHandle('input', input.value, inputSelect.value, outputSelect.value);
})