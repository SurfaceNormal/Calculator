let input = [];
let current = "";
let isEval = false;

const number = document.querySelectorAll('.num');
number.forEach((button) => {
  	button.addEventListener('click', (e) => {
  		if (isEval) {
  			current = "";
  			isEval = false;
  		}
  		current += button.id;
		document.getElementById("number").innerHTML = current;
  	});
});

const operator = document.querySelectorAll('.op');
operator.forEach((button) => {
  	button.addEventListener('click', (e) => {
  		if (current.length > 0) {
  			if (!isNaN(input[input.length-1])) {
  				input = [];
  			}
  			input.push(current);
  		}
    	if (!isNaN(input[input.length-1])) {
			input.push(button.id);
			document.getElementById("expression").innerHTML = input.join(" ");
			current = "";
    	}
  	});
});

const decimal = document.querySelector('#decimal');
decimal.addEventListener('click', (e) => {
    if (isWithoutDec()) {
    	current += ".";
		document.getElementById("number").innerHTML = current;
    }
});

const equals = document.querySelector('#equals');
equals.addEventListener('click', (e) => {
	input.push(current);
	current = evalPostFix(reversePolish(input));
	document.getElementById("expression").innerHTML = input.join(" ");
	document.getElementById("number").innerHTML = current;
	isEval = true;
});

const clear = document.querySelector('#C');
clear.addEventListener('click', (e) => {
	input = [];
	current = "";
	document.getElementById("expression").innerHTML = input;
	document.getElementById("number").innerHTML = current;
});

function isWithoutDec() {
	let num = current.split();
    let i = num.length - 1;

    while (num.length > 0 && !num[i].match(/[~*/+-]/)) {
    	if (num[i] == '.') {
    		return false;
    	}
		i--;
    }
    return true;
}

function add(x, y) {
	return Number(x) + Number(y);
}

function subtract(x, y) {
	return x - y;
}

function multiply(x, y) {
	return  x * y;
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
		} else if (expr[i].match(/[~*/+-]/)) { // Case: operator
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