function lzwDecoder(minCodeSize, data) {
    // data = [140, 45, 153, 135, 42, 28, 220, 51, 160, 2, 117, 236, 149, 250, 168, 222, 96, 140, 4, 145, 76, 1]
    let clearCode = 1 << minCodeSize, codeSize = minCodeSize + 1
    let endInfoCode = clearCode + 1
    let dict = [], output = [], last, code, pos = 0

    function readCode(size) {
        let code = 0
        for (let i = 0; i < size; i++) {
            if (data.charCodeAt(pos >> 3) & (1 << (pos % 8))) {
                code = code | 1 << i
            }
            pos++
        }
        return code
    }

    function clear() {
        dict = []
        for (let i = 0; i < clearCode; i++) {
            dict[i] = [i]
        }
        dict[clearCode] = []
        dict[endInfoCode] = null
    }

    while(true){
        last = code
        code = readCode(codeSize)
        if (code == clearCode) {
            clear()
            continue
        }
        if(code == endInfoCode) break
        if (code < dict.length) {
            if (last != clearCode) {
                dict.push(dict[last].concat(dict[code][0]))
            }
        } else {
            dict.push(dict[last].concat(dict[last][0]))
        }
        output.push(dict[code])
        if (dict.length == (1 << codeSize) && codeSize < 12) {
            codeSize++
        }
    }
    return output.flat(1)
    // output: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2 ....]
}
