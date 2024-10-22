function loadUser() {
    fetch("/modules/user_module.js")
        .then(({ user }) => {
            console.log(user);
        });
}

loadUser();