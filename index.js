const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
ctx.font = "16px serif"
ctx.textBaseline = "middle"
ctx.fillStyle = "white"
ctx.strokeStyle = "white"
var degree = 0

class Node {
	constructor() {
		this.keys = new Array()
		this.values = new Array()
		this.isLeaf = true
	}

	insertVal(val) {
		let insertValPos = -1
		for (let i = 0; i < this.keys.length; i++) {
			if (val < this.keys[i]) {
				if (i < this.values.length) {
					insertValPos = i
					break
				}
			}
		}
		if (val > this.keys[this.keys.length - 1]) {
			if (this.keys.length < this.values.length) {
				insertValPos = this.values.length - 1
			}
		}

		if (insertValPos !== -1) {
			if (this.values[insertValPos].keys.length >= degree - 1) {
				let { mid, leftNode, rightNode } = this.values[insertValPos].splitTree()
				this.isLeaf = false
				this.keys.splice(insertValPos, 0, mid)
				this.values.splice(insertValPos, 1, leftNode, rightNode)
				if (val < mid) {
					leftNode = leftNode.insertVal(val)
				} else {
					rightNode = rightNode.insertVal(val)
				}
			} else {
				this.values[insertValPos].insertVal(val)
			}
		} else {
			// val cannot be inserted into values
			let insertPos = this.keys.length
			for (let i = 0; i < this.keys.length; i++) {
				if (val < this.keys[i]) {
					insertPos = i
					break
				}
			}
			this.keys.splice(insertPos, 0, val)
		}

		// this split
		if (this.keys.length > degree - 1) {
			let { mid, leftNode, rightNode } = this.splitTree()
			let node = new Node()
			node.keys.push(mid)
			node.values.push(leftNode, rightNode)
			node.isLeaf = false
			return node
		}

		return this
	}

	// Output: mid, left, right
	splitTree() {
		let middle = Math.floor((degree - 1) / 2)
		let leftNode = new Node()
		let rightNode = new Node()

		this.keys.forEach((key, index) => {
			if (index < middle) {
				leftNode.insertVal(key)
			} else if (index > middle) {
				rightNode.insertVal(key)
			}
		})
		this.values.forEach((value, index) => {
			if (index <= middle) {
				leftNode.values.push(value)
			} else {
				rightNode.values.push(value)
			}
		})

		let middleKey = this.keys[middle]

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

		if (value < 0 || value > 999) {
			alert("Enter values between 0 and 999")
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
	if (root.values.length > 0) {
		root.values.forEach(value => {
			printBTree(value)
		})
	}
}

var bTree = new BTree()
function init() {
	degree = 4;
	bTree.printTree();
}

init()
