const signupForm = document.getElementById("signup-form");

if (signupForm) {
    const password = signupForm.querySelector("#sign-up-password");
    const confirm = document.querySelector("#confirm-password");

    console.log(password);
    console.log(confirm);

    function validatePassword() {
        if (password.value != confirm.value) {
            confirm.setCustomValidity("Passwords Don't Match");
            console.log("passwords don't match");
        } else {
            confirm.setCustomValidity("");
        }
    }

    password.addEventListener("change", validatePassword);
    confirm.addEventListener("change", validatePassword);
}

// const showFileEditModals = document.querySelectorAll(".show-file-edit-modal");

// showFileEditModals.forEach((button) => {
//     button.addEventListener("click", () => {
//         // Find the modal within the same .item container
//         const modal = button.closest(".item").querySelector(".edit-file-modal");
//         modal.showModal();
//     });
// });

// exitDialogButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//         const modal = button.closest(".edit-file-modal");
//         modal.close();
//     });
// });

// file and folder in the displayed list of item

const showItemEditModalButtons = document.querySelectorAll(".show-modal");
console.log(showItemEditModalButtons);

showItemEditModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modal = button
            .closest(".item-buttons")
            .querySelector(".edit-item-modal");
        // modal is null, why?
        console.log(modal);
        modal.showModal();
    });
});

const exitDialogButtons = document.querySelectorAll(".exit-dialog");

exitDialogButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modal = button.closest(".edit-item-modal");
        modal.close();
    });
});
