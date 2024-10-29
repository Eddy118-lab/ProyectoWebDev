// ageVerificationMiddleware.js
const verifyAge = (req, res, next) => {
    const { fechaNacimiento } = req.body;

    // Comprobar si se proporcionó la fecha de nacimiento
    if (!fechaNacimiento) {
        return res.status(400).json({ message: 'La fecha de nacimiento es requerida.' });
    }

    const currentDate = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    // Ajustar la edad si no ha cumplido años este año
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    // Verificar si el usuario tiene más de 18 años
    if (age < 18) {
        return res.status(400).json({ message: 'Debes tener al menos 18 años para registrarte.' });
    }

    // Si pasa la verificación, continuar a la siguiente función (controlador)
    next();
};

module.exports = verifyAge;
