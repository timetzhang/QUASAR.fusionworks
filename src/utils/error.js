var error = {
    format: (error) => {
        if (error[0].message) {
            var result = {
                message: error[0].message
            }
            return result
        }

        if (error[0].extensions.exception.errors[0].message) {
            var result = {
                message: error[0].extensions.exception.errors[0].message,
                field: error[0].extensions.exception.errors[0].path,
                value: error[0].extensions.exception.errors[0].value,
            }
            return result
        }
    }
}

export default error