let input = []; // Array containing input expression
let current = ""; // Current number being built up with digits, to be placed within expression
let isEval = false; // Flag for succesfully calculated expression (being reused)

const number = document.querySelectorAll('.num');
number.forEach((button) => {
  	button.addEventListener('click', (e) => {
  		if (input[input.length-1] == ")") { // Multiplication of a new number
  			input.push("*");
  		}

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

const unary = document.querySelector('#unary');
unary.addEventListener('click', (e) => {
	if (current != "Undefined") {
		if (isEval) {
  			input = [];
  			document.getElementById("result").innerHTML = "";
  			isEval = false;
  		}

		if (current != "") {
			if (current.toString().indexOf("-") == -1) {
				current = "-" + current;
			} else {
				current = current.toString().slice(1);
			}
			document.getElementById("expression").innerHTML = input.join(" ") + " " + current;
		} 
	}
});

const operator = document.querySelectorAll('.op');
operator.forEach((button) => {
  	button.addEventListener('click', (e) => {
  		if (current != "Undefined") {
  			if (isEval) { // Reuse result of last calculation
  				isEval = false;
  			
 				input = [];
  				input.push(current);
  				input.push(button.id);
  				document.getElementById("expression").innerHTML = input.join(" ");
				current = "";
				document.getElementById("result").innerHTML = current;
  			} else if ( (input.length == 0 || isNaN(input[input.length-1])) && current != "" && current.slice(-1) != ".") { 
  				// Starting a new expression or chaining a new operator to the expression
	  			input.push(current);
	  			input.push(button.id);
				document.getElementById("expression").innerHTML = input.join(" ");
				current = "";
				document.getElementById("result").innerHTML = current;
  			} else if (input[input.length-1] == ')') {
				input.push(button.id);
				document.getElementById("expression").innerHTML = input.join(" ");
  			} else if (!isNaN(input[input.length-1])) { // End of expression doesn't contain operator or symbol
				input.push(button.id);
				document.getElementById("expression").innerHTML = input.join(" ");
				current = "";
				document.getElementById("result").innerHTML = current;
	    	}
  		}
  	});
});

const decimal = document.querySelector('#decimal');
decimal.addEventListener('click', (e) => {
	if (current != "Undefined") {
		if (current == "") {
			current = "0.";
			document.getElementById("expression").innerHTML = input.join(" ") + " " + current;
		} else if (isWithoutDec()) {
	    	current += ".";
			document.getElementById("expression").innerHTML = input.join(" ") + " " + current;
	    }
	}
});

const equals = document.querySelector('#equals');
equals.addEventListener('click', (e) => {
	// Allow evaluation if expression ends in ')' OR an operator and number 
	if (!isEval && input[input.length-1] == ')' || isNaN(input[input.length-1]) && current != "" && !isNaN(current.slice(-1))) { 
		if (current != "") {
			input.push(current);
		}

		while (!isBalancedParen()) {
			input.push(')');
		}

		current = evalPostFix(reversePolish(input));

		/*if (current != "Undefined") { // Round long floats
			if (precision(Number(current)) > 15) {
				current = Math.round(current * 1000000000000000) / 1000000000000000;
			}
		} */

		document.getElementById("expression").innerHTML = input.join(" ");
		document.getElementById("result").innerHTML = current;
		isEval = true;
	} /* else if (isBalancedParen() && input[input.length-1] == ')' || isBalancedParen() && !isNaN(input[input.length-1])) {
		current = evalPostFix(reversePolish(input));

		/*if (current != "Undefined") { // Round long floats
			if (precision(Number(current)) > 15) {
				current = Math.round(current * 1000000000000000) / 1000000000000000;
			}
		}

		document.getElementById("expression").innerHTML = input.join(" ");
		document.getElementById("result").innerHTML = current;
		isEval = true;
	} */
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
	if (isEval) { // Backspace once on the recent calculation
		input = [];
  		document.getElementById("result").innerHTML = "";
  		
  		if (current == "Undefined") {
  			current = "";
  		} else if (current.toString().length == 2 && current.toString().indexOf("-") != -1) {
  			current = "";
  		} else {
  			current = current.toString().slice(0,-1);
  		}

		document.getElementById("expression").innerHTML = current;
		isEval = false;
	} else if (current != "") { // Backspace once on the current, most recent number
		if (current.toString().length == 2 && current.toString().indexOf("-") != -1) {
  			current = "";
  		} else {
  			current = current.slice(0,-1);
  		}

		document.getElementById("expression").innerHTML = input.join(" ") + " " + current;
	} else if (input.length > 0) {
		input.pop();
		document.getElementById("expression").innerHTML = input.join(" ");

		if (!isNaN(input[input.length-1])) { // Now editing a prior Number
			current = input.pop();
		}
	}
});

const paren = document.querySelector('#paren');
paren.addEventListener('click', (e) => {
	if (isEval) { // Reusing prior calculation
		if (current == "Undefined") {
  			current = "";
  			input = [];

  			input.push("(");
  		} else {
  			input = [];
  			input.push(current);
  			current = "";

  			input.push("*");
  			input.push("(");
  		}
  		document.getElementById("result").innerHTML = "";
  		document.getElementById("expression").innerHTML = input.join(" ");
		isEval = false;
	} else if (input[input.length-1] == ')') { // Determine whether nested parenthesis exist
		if (!isBalancedParen()) {
			input.push(')');
		} else {
			input.push('*');
			input.push('(');
		}
		document.getElementById("expression").innerHTML = input.join(" ");
	} else if (!isBalancedParen() && isNaN(input[input.length-1]) && current != "" && current.slice(-1) != ".") { 
		// Close parenthesis on non-nested parenthetical expression
		input.push(current);
		current = "";
		input.push(')');
		document.getElementById("expression").innerHTML = input.join(" ");
	} else { // Default: create a new multiplication op with an existing number or place open parenthesis
		if (current != "" && current.slice(-1) != ".") {
			input.push(current);
			current = "";

			input.push('*');
		} 
		input.push('(');
		document.getElementById("expression").innerHTML = input.join(" ");
	} 
});

function isBalancedParen() {
	let stack = [];
	for (let i = 0; i < input.length; i++) {
		if (input[i] == '(') {
			stack.push('(');
		} else if (stack.length > 0 && input[i] == ')') {
			stack.pop();
		}
	}
	return stack.length == 0;
}

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