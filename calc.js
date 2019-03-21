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
	let expr = (expression + ")").split("");

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