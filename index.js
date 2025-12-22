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

	deleteVal(val) {
		// Search Node
		let { pos, isInKeys } = this.searchNode(val)
		const minKeys = Math.ceil(degree / 2) - 1

		if (isInKeys === false && this.isLeaf === false) {
			this.values[pos].deleteVal(val)

			// balancing tree
			let leftSubTree = this.values[Math.max(0, pos - 1)]
			let rightSubTree = this.values[Math.min(pos + 1, this.values.length - 1)]
			let middleSubTree = this.values[pos]
			let leftDegree = leftSubTree.keys.length
			let rightDegree = rightSubTree.keys.length
			let middleDegree = middleSubTree.keys.length

			if (middleDegree < minKeys) {
				if (leftDegree <= minKeys && rightDegree <= minKeys) {
					// Pull a parent and combine with its value
					if (pos !=  0 ) {
						let key = this.keys.splice(pos-1,1)
						middleSubTree.keys.splice(0,0,...leftSubTree.keys, key[0])
						middleSubTree.values.splice(0,0,...leftSubTree.values)
						this.values.splice(pos-1,1)
					} else {
						console.log("Left subtree addition", leftSubTree, rightSubTree)
						let key = this.keys.splice(0,1)
						leftSubTree.keys.splice(leftSubTree.keys.length,0,key[0], ...rightSubTree.keys)
						leftSubTree.values.splice(leftSubTree.values.length,0,...rightSubTree.values)
						this.values.splice(1,1)
					}
					return
				} else if (leftDegree <= minKeys || rightDegree <= minKeys) {
					if (leftDegree > rightDegree) {
						let leftMostKey = leftSubTree.keys.splice(leftSubTree.keys.length - 1, 1)
						let leftMostValue = leftSubTree.values.splice(leftSubTree.values.length - 1, 1)
						let key = this.keys.splice(pos - 1, 1, leftMostKey[0])
						middleSubTree.keys.splice(0, 0, key[0])
						middleSubTree.values.splice(0, 0, ...leftMostValue)
					} else {
						let rightKey = rightSubTree.keys.splice(0, 1)
						let rightValue = rightSubTree.values.splice(0, 1)
						let key = this.keys.splice(pos, 1, rightKey[0])
						middleSubTree.keys.splice(middleSubTree.keys.length, 0, key[0])
						middleSubTree.values.splice(middleSubTree.values.length, 0, ...rightValue)
					}
				}
			}
			return
		}

		// Leaf Node & Internal node(self deletion and correction)
		this.keys.splice(pos, 1)
		if (this.isLeaf === false) {
			let leftDegree = this.values[pos].keys.length
			let rightDegree = this.values[pos + 1].keys.length

			if (leftDegree - 1 >= minKeys || rightDegree - 1 >= minKeys) {
				// Move child value to parent
				if (leftDegree > rightDegree) {
					let value = this.values[pos]
					let removedVal = this.inorderPredecessor(value)
					value.deleteVal(removedVal)
					this.keys.splice(pos, 0, removedVal)
				} else {
					let value = this.values[pos + 1]
					let removedVal = this.inorderSuccessor(value)
					value.deleteVal(removedVal)
					this.keys.splice(pos, this.keys.length, removedVal)
				}
			} else {
				// Merge children
				this.values[pos + 1].keys.forEach(key => {
					this.values[pos].keys.push(key)
				})
				this.values[pos + 1].values.forEach(value => {
					this.values[pos].values.push(value)
				})
				this.values.splice(pos + 1, 1)
			}
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


	// Output: pos, isInKeys
	searchNode(val) {
		let i = 0
		let j = this.keys.length - 1

		while (i <= j) {
			let mid = i + Math.floor((j - i) / 2)
			let midKey = this.keys[mid]
			if (midKey === val) {
				return { pos: mid, isInKeys: true }
			}

			if (val < midKey) {
				j = mid - 1
			} else {
				i = mid + 1
			}
		}

		return { pos: i, isInKeys: false }
	}

	inorderPredecessor(node) {
		if (node.isLeaf === true) {
			return node.keys[node.keys.length - 1]
		}

		return this.inorderPredecessor(node.values[node.values.length - 1])
	}


	inorderSuccessor(node) {
		if (node.isLeaf === true) {
			return node.keys[0]
		}

		return this.inorderSuccessor(node.values[0])
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
		printBTree(this.root)
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
			let starting = 750 - totalSpace / 2
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

	deleteNode() {
		let value = document.getElementById("nodeValue").value
		value = parseInt(value)

		if (Number.isNaN(value)) {
			alert("Enter valid number")
			document.getElementById("nodeValue").value = ""
			return
		}
		// Delete
		this.root.deleteVal(value)
		if (this.root.keys.length === 0 ) {
			this.root = this.root.values[0]
		}
		this.printTree()
		document.getElementById("nodeValue").value = ""
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

