function lzwEncoder(minCodeSize, data) {
    // data = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1]
    let codeSize = minCodeSize + 1
    let clearCode = 1 << minCodeSize, endInfoCode = clearCode + 1, dict = []

    function clear() {
        for (let i = 0; i < endInfoCode; i++) {
            dict[i] = String(i)
        }
        dict[clearCode] = ''
        dict[endInfoCode] = null
    }

    let arr = data, pos = 1, k = '', buff = String(arr[0]), output = [clearCode]
    let hexPos = 0, hexBuff = 0, hexOut = []

    function convertToByte(n, size) {
        for (let i = 0; i < size; i++) {
            hexBuff = hexBuff | (n & 1 << i) << (hexPos % 8)
        }
        if (hexPos % 8 + size >= 8) {
            hexOut.push(hexBuff & 0b11111111)
            hexBuff = hexBuff >> 8
        }
        hexPos += size
    }

    clear()
    convertToByte(clearCode, codeSize)
    while(true){
        if (pos >= arr.length) break
        k = arr[pos]
        let tmp = `${buff},${k}`
        if (dict.includes(tmp)) {
            buff = tmp
        } else {
            dict.push(tmp)
            let n = dict.indexOf(buff)
            output.push(n)
            buff = String(k)
            convertToByte(n, codeSize)
            if (dict.length - 1 >= (1 << codeSize) && codeSize < 12) {
                codeSize++
            }
        }
        pos++
    }
    let n = dict.indexOf(buff)
    output.push(n)
    convertToByte(n, codeSize)
    output.push(endInfoCode)
    convertToByte(endInfoCode, codeSize)
    if (hexBuff > 0) hexOut.push(hexBuff)
    return hexOut
    // output: [140, 45, 153, 135, 42, 28, 220, 51, 160, 2, 117, 236, 149, 250, 168, 222, 96, 140, 4, 145, 76, 1]
}
