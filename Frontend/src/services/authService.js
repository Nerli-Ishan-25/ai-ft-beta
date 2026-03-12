export const signupUser = (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(u => u.email === userData.email);

    if (userExists) {
        return { success: false, message: "User already exists" };
    }

    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true };
};

export const loginUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return { success: false, message: "Invalid credentials" };
    }

    localStorage.setItem("loggedUser", JSON.stringify(user));

    return { success: true };
};