# The Future App
This simple web application displays driving practice questions in French and English.
Each question entry in `questions.json` defines text in both languages, a list of options, the correct answer index, and an optional `image` path. If no image is specified, the app falls back to `images/placeholder.png`.

### Usage

Open `index.html` in a browser. Use the **FR / EN** button to toggle languages.
Click **Show Answer** to reveal the answer and **Next** to move to the next question.
Questions are loaded from `questions.json`, which includes an `image` field for
each entry. All images should be placed in the `images` folder. A generic
`placeholder.png` is bundled and will be used whenever an entry does not specify
its own image. The repository contains only a small sample of questions; feel
free to extend the list or replace the placeholder with your own artwork by
editing the JSON file and adding images to the folder.
