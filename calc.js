let input = [];
let current = "";
let isEval = false;

const number = document.querySelectorAll('.num');
number.forEach((button) => {
  	button.addEventListener('click', (e) => {
  		if (isEval) { // Appending a number to the result of the last calculation
  			if (current == "Undefined") {
  				current = "";
  			}

  			input = [];
  			document.getElementById("result").innerHTML = "";
  			isEval = false;
  		}
		current += button.id;
		document.getElementById("expression").innerHTML = input.join(" ") + " " + current;
  	});
});

const operator = document.querySelectorAll('.op');
operator.forEach((button) => {
  	button.addEventListener('click', (e) => {
  		if (input.length == 0 && current != "" && current.slice(-1) != ".") { // Starting on an empty expression
  			input.push(current);
  			input.push(button.id);
			document.getElementById("expression").innerHTML = input.join(" ");
			current = "";
			document.getElementById("result").innerHTML = current;
  		} else if (isEval) { // Reuse result of last calculation
  			isEval = false;

  			if (current == "Undefined") {
  				current = "";
  				input = [];
  				document.getElementById("expression").innerHTML = input.join(" ");
  				document.getElementById("result").innerHTML = current;
  			} else {
 				input = [];
  				input.push(current);
  				input.push(button.id);
  				document.getElementById("expression").innerHTML = input.join(" ");
				current = "";
				document.getElementById("result").innerHTML = current;
  			}
  		} else if (isNaN(input[input.length-1]) && current != "" && current.slice(-1) != ".") { // Chain operations if a number will be added to expression
  			input.push(current);
  			input.push(button.id);
			document.getElementById("expression").innerHTML = input.join(" ");
			current = "";
			document.getElementById("result").innerHTML = current;
  		} else if (!isNaN(input[input.length-1])) { // End of expression doesn't contain operator or symbol
			input.push(button.id);
			document.getElementById("expression").innerHTML = input.join(" ");
			current = "";
			document.getElementById("result").innerHTML = current;
    	}
  	});
});

const decimal = document.querySelector('#decimal');
decimal.addEventListener('click', (e) => {
	if (current == "") {
		current = "0.";
		document.getElementById("expression").innerHTML = input.join(" ") + " " + current;
	} else if (isWithoutDec()) {
    	current += ".";
		document.getElementById("expression").innerHTML = input.join(" ") + " " + current;
    }
});

const equals = document.querySelector('#equals');
equals.addEventListener('click', (e) => {
	if (isNaN(input[input.length-1]) && current != "" && current.slice(-1) != ".") { // Allow evaluation if expression ends in operator and number
		input.push(current);
		current = evalPostFix(reversePolish(input));

		if (current != "Undefined") { // Round long floats
			if (precision(Number(current)) > 15) {
				current = Math.round(current * 1000000000000000) / 1000000000000000;
			}
		}

		document.getElementById("expression").innerHTML = input.join(" ");
		document.getElementById("result").innerHTML = current;
		isEval = true;
	}
});

const clear = document.querySelector('#C');
clear.addEventListener('click', (e) => {
	input = [];
	current = "";
	document.getElementById("expression").innerHTML = input.join(" ");
	document.getElementById("result").innerHTML = current;
});

const backspace = document.querySelector('#CE');
backspace.addEventListener('click', (e) => {
	if (current != "") {
		current = current.slice(0,-1);
		document.getElementById("expression").innerHTML = input.join(" ") + " " + current;
	} else if (input.length > 0) {
		input.pop();
		document.getElementById("expression").innerHTML = input.join(" ");
	}
});

function isWithoutDec() { // Check sequence for prior decimal point
	let num = current.split("");
    for (let i = 0; i < num.length; i++) {
    	if (num[i] == '.') {
    		return false;
    	}
    }
    return true;
}

function precision(num) {
  	let e = 1, p = 0;
  	while (Math.round(num * e) / e !== num) { 
  		e *= 10; 
  		p++; 
  	}
  	return p;
}

function add(x, y) {
	return Number(x) + Number(y);
}

function subtract(x, y) {
	return x - y;
}

function multiply(x, y) {
	return x * y;
}

function divide(x, y) {
	if (y == 0) {
		return "Undefined";
	}
	return x / y;
}

function operation(op, y, x) {
	if (op == '+') {
		return add(x,y);
	} else if (op == '-') {
		return subtract(x, y);
	} else if (op == '*') {
		return multiply(x, y);
	} 
	return divide(x, y); 
}

function evalPostFix(expression) {
	let operators = [];
	/* For each token:
	If it is an operand, push it on the stack.
	Else if it is an operator, then
		y ← pop top value
		x ← pop top value
		result ← x (oper) y
		push result onto stack
	*/
	for (let i = 0; i < expression.length; i++)  {
		if (!isNaN(expression[i])) {
			operators.push(expression[i]); 
		} else if (expression[i] == '~') { // Unary '-'
			operators.push(-operators.pop())
		} else {
			operators.push(operation(expression[i], operators.pop(), operators.pop()))
		}
	}
	return operators.pop();
}

function reversePolish(expression) { // Dijkstra's "Shunting Yard" Algorithm to parse infix expression to postfix
	let expr = expression;
	expr.push(")");

	let opStack = ["("];
	let postFix = [];

	/* For each token:
	- If it is a left paren, push it onto the stack.
	- If it is a right paren, pop operators from the stack and append to the postfix expression, until a left paren 
		is encountered on the stack. Remove and discard the left paren.
	- If it is an operand, append it to the postfix expression.
	- If it is an operator, then pop operators from the stack and append to the postfix expression while the operators
		have equal or higher precedence than the current token. Push current token (operator) onto the stack. 
	*/
	for (let i = 0; i < expr.length; i++) {
		if (expr[i] == '(') { // Case: left paren
			opStack.push(expr[i]);
		} else if (expr[i] == ')') { // Case: right paren 
			while(opStack[opStack.length-1] != '(') {
				postFix.push(opStack.pop());
			}
			opStack.pop();
		} else if (isNaN(expr[i])) { // Case: operator
			while (opStack.length > 0 && isHigherPrec(expr[i], opStack[opStack.length-1])) {
				postFix.push(opStack.pop());
			}
			opStack.push(expr[i]);			
		} else { // Case: operand
			postFix.push(expr[i]);
		}
	}
	expr.pop();
	return postFix;
}

function isHigherPrec(token, stack) {
	return precedence(stack) >= precedence(token);
}

function precedence(op) {
	if (op == '~') {
		return 3;
	} else if (op == '*' || op == '/') {
		return 2;
	} else if (op == '+' || op == '-') {
		return 1;
	} 
	return 0;
}