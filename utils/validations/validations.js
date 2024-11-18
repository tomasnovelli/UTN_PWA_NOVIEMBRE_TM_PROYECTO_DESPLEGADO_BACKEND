const validateName = (name) => name && isNaN(name) && name.length > 3
const validateEmail = (email) =>  email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)
const validatePassword = (password) => password && password.length > 5 && password.length <= 12


export {validateEmail, validatePassword, validateName}