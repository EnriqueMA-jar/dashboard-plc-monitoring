document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("password-form");
    if (!form) {
        console.error("No se encontró el formulario con ID 'password-form'");
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const currentPassword = document.getElementById("current-password").value.trim();
        const newPassword = document.getElementById("new-password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        // Validaciones
        if (!currentPassword) {
            return Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Contraseña actual requerida',
                text: 'Por favor ingresa tu contraseña actual',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }

        if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
            return Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Las contraseñas no coinciden',
                text: 'Verifica que ambas contraseñas sean iguales y no estén vacías',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }

        // Llamada a la API para cambiar la contraseña
        try {
            const response = await fetch("http://127.0.0.1:8001/api/manage-credentials/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: "success",
                    title: data.message,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
                form.reset();
                } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: "error",
                    title: "Error",
                    text: data.error || "No se pudo cambiar la contraseña",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            Swal.fire({
                icon: "error",
                title: "Error de red",
                text: "No se pudo contactar al servidor",
                timer: 3000,
                showConfirmButton: false
            });
        }
    });
});
