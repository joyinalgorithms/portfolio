from django import forms
from django.core.files.storage import default_storage
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from . import util
import markdown2
import random


class NewPageForm(forms.Form):
    title = forms.CharField(label="Title")
    content = forms.CharField(label="Content", widget=forms.Textarea(
        attrs={'class': 'md_content', 'placeholder': 'Enter content here...'}))


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def page(request, title):
    entry = util.get_entry(title)
    if entry is None:
        return HttpResponse("The requested page was not found!")
    else:
        content = markdown2.markdown(entry)
        return render(request, "encyclopedia/page.html", {
            "content": content,
            "title": title
        })


def result(request):
    query = request.GET.get('q')
    entries = util.list_entries()

    partial_matches = []
    for entry in entries:
        if query == entry:
            entry = util.get_entry(entry)
            content = markdown2.markdown(entry)
            return render(request, "encyclopedia/page.html", {
                "content": content,
                "title": query
            })
        elif query.lower() in entry.lower():
            partial_matches.append(entry)
    if not partial_matches:
        return render(request, "encyclopedia/index.html", {
            "entries": util.list_entries()
        })
    else:
        return render(request, "encyclopedia/index.html", {
            "entries": partial_matches
        })


def newpage(request):
    if request.method == "POST":
        form = NewPageForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            content = form.cleaned_data["content"]
            filename = f"entries/{title}.md"
            if default_storage.exists(filename):
                return HttpResponse("This page already exists!")
            util.save_entry(title, content)
            return HttpResponseRedirect(reverse("page", args=[title]))
        else:
            return render(request, "encyclopedia/newpage.html", {
                "form": form
            })
    return render(request, "encyclopedia/newpage.html", {
        "form": NewPageForm()
    })


def editpage(request, title):
    if request.method == "POST":
        form = NewPageForm(request.POST)
        if form.is_valid():
            content = form.cleaned_data["content"]
            util.save_entry(title, content)
            return HttpResponseRedirect(reverse("page", args=[title]))
        else:
            return render(request, "encyclopedia/edit.html", {
                "form": form,
                "title": title
            })
    else:
        entry = util.get_entry(title)
        if entry is None:
            return HttpResponse("The requested page was not found!")
        form = NewPageForm(initial={"title": title, "content": entry})
        return render(request, "encyclopedia/edit.html", {
            "form": form,
            "title": title
        })


def randompage(request):
    entries = util.list_entries()
    if entries:
        random_choice = random.choice(entries)
        return redirect('page', title=random_choice)
    else:
        return HttpResponse("No available page.")
