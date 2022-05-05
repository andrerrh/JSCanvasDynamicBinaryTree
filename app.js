const canvas = document.querySelector('canvas')
const treeContainer = document.querySelector('.tree-container')
const inputField = document.querySelector('input')

const ctx = canvas.getContext('2d')

let tree = [1,2,3,4,5,'null',7,8,9,10,11,'null','null',14,15,16,17,18,19,20,21,22,23,'null','null','null','null', 23,'null', 24] //Place Holder
const treeHeight = Math.ceil(Math.log(tree.length + 1) / Math.log(2))

const buildRows = () => {
    const rows = []
    for (let i = 0; i < treeHeight; i++) {
        const row = document.createElement('div')
        row.classList.add('row')
        rows.push(row)
        treeContainer.appendChild(row)
    }

    return rows
}

const buildGraphicTree = (rows) => {
    const nodes = []
    for (let i = 0; i < 2 ** treeHeight; i++) {
        const nodeContainer = document.createElement('span')
        const node = document.createElement('span')

        nodeContainer.classList.add('node-container')
        node.classList.add('node')

        nodeContainer.appendChild(node)

        node.innerText = tree[i]
        if (isNaN(tree[i]) || tree[i] === '') {
            nodeContainer.style.opacity = 0;
        }
        const height = Math.ceil(Math.log(i + 2) / Math.log(2)) - 1
        if (rows[height]) rows[height].appendChild(nodeContainer)
        nodes.push(node)
    }
    return nodes
}

const hightlightNodes = (nodes) => {
    const handleHover = (node, i) => {
        node.style.backgroundColor = 'grey'
        node.style.color = 'black'
        const indexToCheck = Math.floor((i - 1) / 2)
        if (nodes[indexToCheck]) {
            const { x: x1, y: y1 } = node.getBoundingClientRect()
            const { x: x2, y: y2 } = nodes[indexToCheck].getBoundingClientRect()
            drawLine(x1 + 40, y1 + 40, x2 + 40, y2 + 40)
            handleHover(nodes[indexToCheck], indexToCheck)
        }
    }

    const handleHoverLeave = (node, i) => {
        node.style.backgroundColor = 'transparent'
        node.style.color = 'grey'
        const indexToCheck = Math.floor((i - 1) / 2)
        if (nodes[indexToCheck]) handleHoverLeave(nodes[indexToCheck], indexToCheck)
        canvas.width = canvas.width
        drawTreeLines(nodes)
    }

    nodes.forEach((node, i) => {
        if (node.parentNode.style.opacity === '0') return
        node.addEventListener('mouseover', () => handleHover(node, i))
        node.addEventListener('mouseleave', () => handleHoverLeave(node, i))
    })
}

const drawTreeLines = (nodes) => {
    let i = 0
    const drawLines = (index) => {
        if (!nodes[index]) return

        ctx.strokeStyle = `hsl(${tree.length * 10}, 100%, 50%)`

        const leftIndex = index * 2 + 1
        const rightIndex = index * 2 + 2

        if (nodes[leftIndex] && !isNaN(nodes[leftIndex].innerText) && nodes[leftIndex].innerText !== '') {
            const { x: x1, y: y1 } = nodes[index].getBoundingClientRect()
            const { x: x2, y: y2 } = nodes[leftIndex].getBoundingClientRect()
            ctx.beginPath()
            ctx.moveTo(x1 + 40, y1 + 40)
            ctx.lineTo(x2 + 40, y2 + 40)
            ctx.stroke()
            ctx.closePath()
            drawLines(leftIndex)
        }
        if (nodes[rightIndex] && !isNaN(nodes[rightIndex].innerText) && nodes[rightIndex].innerText !== '') {
            const { x: x1, y: y1 } = nodes[index].getBoundingClientRect()
            const { x: x2, y: y2 } = nodes[rightIndex].getBoundingClientRect()
            ctx.beginPath()
            ctx.moveTo(x1 + 40, y1 + 40)
            ctx.lineTo(x2 + 40, y2 + 40)
            ctx.stroke()
            ctx.closePath()
            drawLines(rightIndex)
        }
    }

    drawLines(i)
}

const drawLine = (x1, y1, x2, y2) => {
    ctx.strokeStyle = 'white'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
}

const fillInitialTree = () => {
    tree.forEach((e) => {
        inputField.value += `${e},`
    })
}

window.addEventListener('load', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight * 0.6
    fillInitialTree()
    inputField.size = inputField.value.length
    drawTreeLines(nodes)
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight * 0.6
    drawTreeLines(nodes)
})

inputField.addEventListener('input', (event) => {
    const count = (event.target.value.match(/,/g) || []).length;
    if (count <= 30) {
        inputField.size = inputField.value.length
        const values = event.target.value.split(',')
        tree = values
        treeContainer.innerHTML = ''
        let rows = buildRows()

        const nodes = buildGraphicTree(rows)
        hightlightNodes(nodes)
        canvas.width = canvas.width
        drawTreeLines(nodes)
    } else {
        inputField.value = event.target.value = event.target.value.slice(0, -1)
    }
})

let rows = buildRows()
const nodes = buildGraphicTree(rows)
hightlightNodes(nodes)