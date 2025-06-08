import os
import re

ENTRIES_DIR = "entries"

def list_entries():
    """
    Returns a list of all names of encyclopedia entries.
    """
    if not os.path.exists(ENTRIES_DIR):
        os.makedirs(ENTRIES_DIR)
    filenames = os.listdir(ENTRIES_DIR)
    return sorted(re.sub(r"\.md$", "", filename)
                  for filename in filenames if filename.endswith(".md"))


def save_entry(title, content):
    """
    Saves an encyclopedia entry, given its title and Markdown
    content. If an existing entry with the same title already exists,
    it is replaced.
    """
    if not os.path.exists(ENTRIES_DIR):
        os.makedirs(ENTRIES_DIR)
    filename = os.path.join(ENTRIES_DIR, f"{title}.md")

    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"# {title}\n{content}")


def get_entry(title):
    """
    Retrieves an encyclopedia entry by its title. If no such
    entry exists, the function returns None.
    """
    filename = os.path.join(ENTRIES_DIR, f"{title}.md")
    try:
        with open(filename, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return None


