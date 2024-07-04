function addToCalculator(value) {
    const calculatorInput = document.getElementById('calculatorInput');
    calculatorInput.value += value;
}

function clearCalculator() {
    const calculatorInput = document.getElementById('calculatorInput');
    calculatorInput.value = '';
}

function calculate() {
    const calculatorInput = document.getElementById('calculatorInput');
    try {
        const result = eval(calculatorInput.value);
        calculatorInput.value = result;
    } catch (error) {
        calculatorInput.value = 'Error';
    }
}
