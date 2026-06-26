// FUNCIÓN SIMULADORA
function fakeRequest(data) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1000);
    });
}

// FUNCIONES DE ALMACENAMIENTO (LocalStorage)
function obtenerUsuarios() {
    const usuariosGuardados = localStorage.getItem('usuarios');
    return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
}

function guardarUsuario(nuevoUsuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Variables globales del DOM
const loading = document.getElementById('loading');

// LÓGICA DE REGISTRO
document.getElementById('form-registro').addEventListener('submit', async function(e) {
    e.preventDefault(); // Evita que recargue la página

    // Limpiamos los mensajes de error anteriores
    document.querySelectorAll('.error').forEach(span => span.textContent = '');
    document.getElementById('mensaje-registro').textContent = '';

    // Capturamos los valores
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;
    const fecha = document.getElementById('reg-fecha').value;
    const terminos = document.getElementById('reg-terminos').checked;

    let esValido = true;

    // Validaciones
    if (nombre === '') {
        document.getElementById('error-nombre').textContent = 'El nombre es obligatorio';
        esValido = false;
    }

    if (email === '') {
        document.getElementById('error-email').textContent = 'El email es obligatorio';
        esValido = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) { // Expresión regular básica para email
        document.getElementById('error-email').textContent = 'Formato de email inválido';
        esValido = false;
    } else {
        // Validar que no exista el email
        const usuarios = obtenerUsuarios();
        const existe = usuarios.find(u => u.email === email);
        if (existe) {
            document.getElementById('error-email').textContent = 'Este email ya está registrado';
            esValido = false;
        }
    }

    if (pass === '') {
        document.getElementById('error-pass').textContent = 'Obligatorio';
        esValido = false;
    } else if (pass.length < 8 || !/\d/.test(pass)) {
        document.getElementById('error-pass').textContent = 'Debe tener min 8 caracteres y 1 número';
        esValido = false;
    }

    if (pass2 !== pass) {
        document.getElementById('error-pass2').textContent = 'Las contraseñas no coinciden';
        esValido = false;
    }

    if (fecha === '') {
        document.getElementById('error-fecha').textContent = 'Obligatorio';
        esValido = false;
    } else {
        // Validación de mayor de edad extrayendo los años
        const anioNacimiento = new Date(fecha).getFullYear();
        const anioActual = new Date().getFullYear();
        if ((anioActual - anioNacimiento) < 18) {
            document.getElementById('error-fecha').textContent = 'Debes ser mayor de 18 años';
            esValido = false;
        }
    }

    if (!terminos) {
        document.getElementById('error-terminos').textContent = 'Debes aceptar los términos';
        esValido = false;
    }

    // Si todo está correcto, ejecutamos la asincronía
    if (esValido) {
        loading.classList.remove('oculto'); // Mostramos "Cargando..."

        const nuevoUsuario = { nombre, email, password: pass };
        
        // Esperamos la simulación del servidor
        await fakeRequest(nuevoUsuario);

        // Guardamos y actualizamos interfaz
        guardarUsuario(nuevoUsuario);
        
        loading.classList.add('oculto'); // Ocultamos "Cargando..."
        
        const msjReg = document.getElementById('mensaje-registro');
        msjReg.textContent = '¡Registro exitoso!';
        msjReg.style.color = 'green';
        
        this.reset(); // Limpia el formulario
    }
});

// LÓGICA DE LOGIN
document.getElementById('form-login').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    document.getElementById('mensaje-login').textContent = '';
    
    const email = document.getElementById('log-email').value.trim();
    const pass = document.getElementById('log-pass').value;

    loading.classList.remove('oculto'); // Mostramos "Cargando..."

    // Simulamos que va al servidor
    await fakeRequest({ email, pass });

    loading.classList.add('oculto'); // Ocultamos "Cargando..."

    // Verificamos credenciales
    const usuarios = obtenerUsuarios();
    const usuarioValido = usuarios.find(u => u.email === email && u.password === pass);

    const msjLogin = document.getElementById('mensaje-login');
    if (usuarioValido) {
        msjLogin.textContent = 'Acceso correcto';
        msjLogin.style.color = 'green';
    } else {
        msjLogin.textContent = 'Acceso incorrecto';
        msjLogin.style.color = 'red';
    }
});