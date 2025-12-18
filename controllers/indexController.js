function renderHome(req, res) {
    res.render("index", { title: "welcome to file uploader" });
}

export { renderHome };
