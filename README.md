# the-future-app
# The Future App

This simple web application displays driving practice questions in French and English.

### Usage

Start a simple HTTP server from the project directory, for example:

```bash
python -m http.server
```

Then open `http://localhost:8000/index.html` in your browser. Use the **FR / EN** button to toggle languages.
Click **Show Answer** to reveal the answer and **Next** to move to the next question.

Questions are loaded from `questions.json`, which now also includes an `image`
field for each entry. Images are stored in the `images` folder. A placeholder is
provided for all questions by default. The repository contains a small sample of
questions; you can expand the list by editing the JSON file and adding your own
images. If you try opening `index.html` directly from the filesystem, the
browser may block the fetch request for `questions.json`, causing the quiz to
fail to load. Running a local HTTP server avoids this issue.
