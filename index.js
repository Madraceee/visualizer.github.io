const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
ctx.font = "16px serif"
ctx.textBaseline = "middle"
ctx.fillStyle = "white"
ctx.strokeStyle = "white"
var degree = 0

class Node {
	constructor(isLeaf = true) {
		this.keys = new Array()
		this.values = new Array()
		this.isLeaf = isLeaf
	}

	insertVal(val) {
		this.insertValNonFull(val)
		if (this.keys.length === degree) {
			const { mid, leftNode, rightNode } = this.splitTree()
			const newRoot = new Node(false)
			newRoot.keys.push(mid)
			newRoot.values.push(leftNode, rightNode)
			return newRoot
		}
		return this
	}


	insertValNonFull(val) {
		let i = this.keys.length - 1

		if (this.isLeaf) {
			while (i >= 0 && val < this.keys[i]) {
				i--
			}
			this.keys.splice(i + 1, 0, val)
		} else {
			while (i >= 0 && val < this.keys[i]) {
				i--
			}

			const childIndex = i + 1
			let child = this.values[childIndex]

			if (child.keys.length === degree - 1) {
				let { mid, leftNode, rightNode } = child.splitTree()
				this.keys.splice(childIndex, 0, mid)
				this.values.splice(childIndex, 1, leftNode, rightNode)
				if (val < mid) {
					child = leftNode
				} else {
					child = rightNode
				}
			}
			child.insertValNonFull(val)
		}
	}

	// Output: mid, left, right
	splitTree() {
		let middleIndex = Math.floor((degree - 1) / 2)
		let middleKey = this.keys[middleIndex]
		let leftNode = new Node(this.isLeaf)
		let rightNode = new Node(this.isLeaf)

		leftNode.keys = this.keys.splice(0, middleIndex)
		rightNode.keys = this.keys.splice(1)

		leftNode.values = this.values.splice(0, middleIndex + 1)
		rightNode.values = this.values.splice(0)

		return {
			mid: middleKey,
			leftNode: leftNode,
			rightNode: rightNode
		}
	}

}

class BTree {
	constructor() {
		this.root = new Node()
	}

	addNode() {
		let value = document.getElementById("nodeValue").value
		value = parseInt(value)

		if (value < -999 || value > 999) {
			alert("Enter values between -999 and 999")
			return
		}

		if (Number.isNaN(value)) {
			alert("Enter valid number")
			document.getElementById("nodeValue").value = ""
			return
		}
		this.root = this.root.insertVal(value)
		this.printTree()
		document.getElementById("nodeValue").value = ""
	}

	clearTree() {
		this.root = new Node()
		this.printTree()
	}

	printTree() {
		this.printBtreeOnCanvas(this.root)
	}

	printBtreeOnCanvas(node) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.fillText("Degree: " + degree.toString(), 5, 10);
		if (node.keys.length === 0) {
			return node
		}
		// Print degree on canvas

		let queue = new Array()
		queue.push({ keyPos: null, prevStart: null, node: node })

		let level = 0
		const rectLength = 33 * (degree - 1)
		while (queue.length > 0) {
			let q = structuredClone(queue)
			queue.length = 0

			let totalSpace = q.length * (rectLength + 50)
			let starting = 500 - totalSpace / 2
			for (let i = 0; i < q.length; i++) {
				ctx.strokeRect(starting + ((rectLength + 50) * i), 50 + (level * 100), rectLength, 50)
				//print Keys
				q[i].node.keys.forEach((key, j) => {
					ctx.fillText(key.toString(), starting + ((rectLength + 50) * i) + (33 * j) + 5, 50 + (level * 100) + 25)
					// Draw Box
					if (j === degree - 2) {
						return
					}
					ctx.beginPath()
					ctx.moveTo(starting + ((rectLength + 50) * i) + (33 * (j + 1)), 50 + (level * 100))
					ctx.lineTo(starting + ((rectLength + 50) * i) + (33 * (j + 1)), 100 + (level * 100))
					ctx.stroke()
					ctx.closePath()
				})

				// Draw line to parent
				if (q[i].keyPos !== null) {
					let connectingStart = q[i].prevStart
					ctx.beginPath()
					ctx.moveTo(connectingStart + (33 * q[i].keyPos), 50 + 50 + ((level - 1) * 100))
					ctx.lineTo(starting + 50 + ((rectLength + 50) * i), 50 + level * 100)
					ctx.stroke()
					ctx.closePath()
				}


				q[i].node.values.forEach((val, j) => {
					queue.push({ keyPos: j, prevStart: starting + (150 * i), node: val })
				})
			}

			level += 1
		}
	}

	changeDegree() {
		let value = document.getElementById("degreeValue").value
		value = parseInt(value)

		if (value < 2 || value > 10) {
			alert("Enter values between 2 and 10")
			return
		}

		if (Number.isNaN(value)) {
			alert("Enter valid number")
			return
		}

		degree = value
		this.clearTree()
		alert("Changed degree of tree")
	}

}

function printBTree(root) {
	console.log(root)
}

var bTree = new BTree()
function init() {
	degree = 4;
	bTree.printTree();
}

init()


// // Delete node
// // 1. Find Node and parent
// // 2. If Child node -> Delete node
// //	2a. If min keys violation occurs, borrow from adjacent child node
// //	2b. If Adjacent also has min keys, merge child with parent node
// // 3. If Internal node
// //	3a. Promote child node to parent key
// //	3b. If min keys,  Merge child nodes
// // 4. If Height decreases, rebalance tree
//
// deleteNode() {
// 	let value = document.getElementById("nodeValue").value
// 	value = parseInt(value)
//
//
// 	if (Number.isNaN(value)) {
// 		alert("Enter valid number")
// 		document.getElementById("nodeValue").value = ""
// 		return
// 	}
// 	// Delete
// 	this.printTree()
// 	document.getElementById("nodeValue").value = ""
// }
