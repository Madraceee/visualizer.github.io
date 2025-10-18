var degree = 0

class Node {
	constructor() {
		this.keys = new Array()
		this.values = new Array()
		this.isLeaf = true
	}
}

function init() {
	degree = 4;
	var input = [5, 3, 21, 9, 13, 22, 7, 10, 11, 14, 8, 16, 99]
	root = new Node()
	input.forEach((val) => {
		root = insertVal(root, val)
	})
	printBTree(root)
}

function printBTree(root) {
	console.log(root)
	if (root.values.length > 0) {
		root.values.forEach(value => {
			printBTree(value)
		})
	}
}


function insertVal(root, val) {
	let insertValPos = -1
	for (let i = 0; i < root.keys.length; i++) {
		if (val < root.keys[i]) {
			if (i < root.values.length) {
				insertValPos = i
				break
			}
		}
	}
	if (val > root.keys[root.keys.length - 1]) {
		if (root.keys.length < root.values.length) {
			insertValPos = root.values.length - 1
		}
	}

	if (insertValPos !== -1) {
		if (root.values[insertValPos].keys.length >= degree - 1) {
			let { mid, leftNode, rightNode } = splitTree(root.values[insertValPos])
			root.isLeaf = false
			root.keys.splice(insertValPos, 0, mid)
			root.values.splice(insertValPos, 1, leftNode, rightNode)
			if (val < mid) {
				insertVal(leftNode, val)
			} else {
				insertVal(rightNode, val)
			}
		} else {
			insertVal(root.values[insertValPos], val)
		}
	} else {
		// val cannot be inserted into values
		let insertPos = root.keys.length
		for (let i = 0; i < root.keys.length; i++) {
			if (val < root.keys[i]) {
				insertPos = i
				break
			}
		}
		root.keys.splice(insertPos, 0, val)
	}



	// Root split
	if (root.keys.length > degree - 1) {
		let { mid, leftNode, rightNode } = splitTree(root)
		root = new Node()
		root.keys.push(mid)
		root.values.push(leftNode, rightNode)
		root.isLeaf = false
		return root
	}

	return root
}

// Output: mid, left, right
function splitTree(root) {
	let middle = Math.floor((degree - 1) / 2)
	let leftNode = new Node()
	let rightNode = new Node()

	root.keys.forEach((key, index) => {
		if (index < middle) {
			insertVal(leftNode, key)
		} else if (index > middle) {
			insertVal(rightNode, key)
		}
	})
	root.values.forEach((value, index) => {
		if (index <= middle) {
			leftNode.values.push(value)
		} else {
			rightNode.values.push(value)
		}
	})

	rootKey = root.keys[middle]

	return {
		mid: rootKey,
		leftNode: leftNode,
		rightNode: rightNode
	}
}



init();
