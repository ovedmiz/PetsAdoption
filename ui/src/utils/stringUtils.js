const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const buildFilterString = (options) => {
    let str = '';
    for (let opt in options) {
        if (options[opt]) {
            if (options[opt].includes('All ')) {
                str += ''
            } else if (Array.isArray(options[opt])) {
                str += `${opt}>${options[opt][0]},`
                str += `${opt}<${options[opt][1]},`
            }
            else {
                if (options[opt].includes(' ')) {
                    let newOpt = options[opt].replaceAll(' ', '_')
                    str += `${opt}:${newOpt},`
                } else {
                    str += `${opt}:${options[opt]},`
                }
            }
        }
    }
    if (str.length > 0) {
        str = str.slice(0, -1)
    }
    return str
}

export { capitalize, buildFilterString }