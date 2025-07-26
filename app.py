import markdown2
import os
import random
import util
from cs50 import SQL
from datetime import datetime, timedelta
from flask import Flask, flash, jsonify, redirect, render_template, request, session, url_for
from flask_session import Session
from helpers import apology, login_required, lookup, usd
from werkzeug.security import check_password_hash, generate_password_hash


app = Flask(__name__)

app.config["SESSION PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

app.jinja_env.filters["usd"] = usd


dbbirthdays = SQL("sqlite:///birthdays.db")
dbfinance = SQL("sqlite:///finance.db")
dbamazon = SQL("sqlite:///amazon.db")

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'data')


@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route("/")
def index():
    return render_template("portfolio/index.html")


@app.route("/aboutme")
def aboutme():
    return render_template("portfolio/aboutme.html")


@app.route("/resume")
def resume():
    return render_template("portfolio/resume.html")


@app.route("/projects")
def projects():
    return render_template("portfolio/projects.html")


@app.route("/certifications")
def certifications():
    return render_template("portfolio/certifications.html")


@app.route("/tech-stack")
def techstack():
    return render_template("portfolio/tech-stack.html")


@app.route("/contact")
def contact():
    return render_template("portfolio/contact.html")


@app.route("/privacy")
def privacy():
    return render_template("portfolio/privacy.html")


@app.route("/yesoryes")
def yesoryes():
    return render_template("frontend/yes.html")


@app.route("/bluredai")
def home():
    return render_template("frontend/home.html")


@app.route("/red-blue-team-training")
def red_blue_team_training():
    return render_template("frontend/red-blue-team-training.html")


@app.route("/adaptive-learning")
def adaptive_learning():
    return render_template("frontend/adaptive-learning.html")


@app.route("/cyber-attack-simulation")
def cyber_attack_simulation():
    return render_template("frontend/cyber-attack-simulation.html")


@app.route("/instructional-content")
def instructional_content():
    return render_template("frontend/instructional-content.html")


@app.route("/gamified-training")
def gamified_training():
    return render_template("frontend/gamified-training.html")


@app.route("/certification-career")
def certification_career():
    return render_template("frontend/certification-career.html")


@app.route("/real-time-threat-intelligence")
def real_time_threat_intelligence():
    return render_template("frontend/real-time-threat-intelligence.html")


@app.route("/cloud-access")
def cloud_access():
    return render_template("frontend/cloud-access.html")


@app.route("/profile")
def profile():
    return render_template("frontend/profile.html")


@app.route("/bluechallenge")
def bluechallenge():
    return render_template("frontend/bluechallenge.html")


@app.route("/isitchristmas")
def isitchristmas():
    now = datetime.now()
    christmas = now.month == 12 and now.day == 25
    return render_template("frontend/christmas.html", christmas=christmas)


@app.route("/isitnewyears")
def isitnewyears():
    now = datetime.now()
    newyear = now.month == 1 and now.day == 1
    return render_template("frontend/newyear.html", newyear=newyear)


@app.route("/facebook")
def facebook():
    return render_template("frontend/facebook.html")


@app.route("/instagram")
def instagram():
    return render_template("frontend/instagram.html")


@app.route("/spotify")
def spotify():
    return render_template("frontend/spotify.html")


@app.route("/linkedin")
def linkedin():
    return render_template("frontend/linkedin.html")


@app.route("/x")
def x():
    return render_template("frontend/x.html")


@app.route("/youtube")
def youtube():
    return render_template("frontend/youtube.html")


@app.route("/amazon")
def amazon():
    if "cart" not in session:
        session["cart"] = []
    cart = session["cart"]
    number = len(cart)

    products = dbamazon.execute("SELECT * FROM products")
    return render_template("frontend/amazon.html", products=products, number=number)


@app.route("/amazon/add-to-cart", methods=["GET", "POST"])
def add_to_cart():
    id = request.form.get("product-id")
    quantity = request.form.get("quantity")
    name = request.form.get("product-name")
    image = request.form.get("product-image")
    price_cents = request.form.get("price")
    product = dbamazon.execute("SELECT * FROM products WHERE id = ?", id)
    if not product:
        return jsonify({"success": False, "error": "Product not found"}), 404

    product = product[0]
    print(product)
    if "cart" not in session:
        session["cart"] = []

    session["cart"].append({
        "id": product["id"],
        "name": product["name"],
        "price_cents": product["price_cents"],
        "quantity": quantity,
        "image": product["image"]
    })
    return redirect("/amazon/checkout")


@app.route("/amazon/checkout", methods=["GET", "POST"])
def checkout():
    cart = session.get("cart")
    number = len(cart)
    delivery_date = datetime.now() + timedelta(days=7)

    total_price_cents = sum(item["price_cents"] * int(item["quantity"]) for item in cart)
    total_price = f"{total_price_cents / 100:.2f}"

    delivery_options = dbamazon.execute("SELECT * FROM delivery_options")
    return render_template("frontend/checkout.html", cart=cart, delivery_date=delivery_date, delivery_options=delivery_options, number=number, total_price=total_price)


@app.route("/cart/delete", methods=["POST"])
def delete_from_cart():
    product_id = request.form.get("product_id")

    cart = session.get("cart", [])

    cart = [item for item in cart if item["id"] != product_id]

    session["cart"] = cart
    flash("Item removed from cart.")
    return redirect("/amazon/checkout")


@app.route("/amazon/place-order", methods=["GET", "POST"])
def place_order():
    session["cart"] = []

    flash("✅ Order placed successfully!")

    return redirect("/amazon")


@app.route("/minigames/tictactoe")
def tictactoe():
    return render_template("games/tictactoe.html")


@app.route("/minigames/rockpaperscissors")
def rockpaperscissors():
    return render_template("games/rockpaperscissors.html")


@app.route("/minigames/clawmachine")
def clawmachine():
    return render_template("games/clawmachine.html")


@app.route("/minigames/memorygame")
def memorygame():
    return render_template("games/memorygame.html")


@app.route("/minigames/snakegame")
def snakegame():
    return render_template("games/snakegame.html")


@app.route("/minigames/flappygame")
def flappygame():
    return render_template("games/flappygame.html")


@app.route("/minigames/colorgame")
def colorgame():
    return render_template("games/colorgame.html")


@app.route("/minigames/suduko")
def suduko():
    return render_template("games/suduko.html")


@app.route("/minigames/typingtest")
def typingtest():
    return render_template("games/typingtest.html")


@app.route("/cs50x/credit")
def credit():
    return render_template("cs50/credit.html")


@app.route("/cs50x/scrabble")
def scrabble():
    return render_template("cs50/scrabble.html")


@app.route("/cs50x/readability")
def readability():
    return render_template("cs50/readability.html")


@app.route("/cs50x/caesar")
def caesar():
    return render_template("cs50/caesar.html")


@app.route("/cs50x/substitution")
def substitution():
    return render_template("cs50/substitution.html")


@app.route("/cs50x/plurality")
def plurality():
    return render_template("cs50/plurality.html")


@app.route("/cs50x/runoff")
def runoff():
    return render_template("cs50/runoff.html")


@app.route("/cs50x/filter")
def filter():
    return render_template("cs50/filter.html")


@app.route("/cs50x/inheritance")
def inheritance():
    return render_template("cs50/inheritance.html")


@app.route("/cs50x/speller")
def speller():
    return render_template("cs50/speller.html")


@app.route("/cs50x/dna")
def dna():
    return render_template("cs50/dna.html")


@app.route('/cs50x/homepage')
def homepageindex():
    return render_template("cs50/homepage-index.html")


@app.route('/homepage/email')
def homepageemail():
    return render_template("cs50/homepage-email.html")


@app.route('/homepage/feedback')
def homepagefeedback():
    return render_template("cs50/homepage-feedback.html")


@app.route('/homepage/gallery')
def gallery():
    return render_template("cs50/homepage-gallery.html")


@app.route('/homepage/journey')
def homepagejourney():
    return render_template("cs50/homepage-journey.html")


@app.route('/homepage/me')
def homepageme():
    return render_template("cs50/homepage-me.html")


@app.route("/cs50x/trivia")
def trivia():
    return render_template("cs50/trivia.html")


@app.route("/cs50x/birthday", methods=["GET", "POST"])
def birthday():
    if request.method == "POST":

        name = request.form.get("name")
        if not name:
            return redirect("/")
        month = request.form.get("month")
        if not month:
            return redirect("/")
        day = request.form.get("day")
        if not day:
            return redirect("/")

        dbbirthdays.execute(
            "INSERT INTO birthdays (name, month, day) VALUES(?, ?, ?)", name, month, day)
        return redirect("/cs50x/birthday")

    else:

        rows = dbbirthdays.execute("SELECT * FROM birthdays")
        return render_template("cs50/birthday.html", birthdays=rows)


@app.route("/cs50x/finance")
@login_required
def finance():
    user_id = session["user_id"]
    transaction = dbfinance.execute(
        "SELECT symbol, SUM(shares) AS shares, price FROM transactions WHERE user_id = ? GROUP BY symbol", user_id)
    user_cash = dbfinance.execute("SELECT cash FROM users WHERE id = ?", user_id)
    cash = user_cash[0]["cash"]

    for row in transaction:
        row["total"] = row["shares"] * row["price"]
        row["usd_price"] = usd(row["price"])
        row["usd_total"] = usd(row["total"])

    total_cash = cash + sum(row["total"] for row in transaction)
    cash = usd(cash)
    total_cash = usd(total_cash)
    return render_template("cs50/finance.html", database=transaction, cash=cash, total_cash=total_cash)


@app.route("/cs50x/finance/buy", methods=["GET", "POST"])
@login_required
def buy():
    if request.method == "POST":
        shares = request.form.get("shares")
        symbol = request.form.get("symbol")

        if not shares.isdigit():
            return apology("Invalid number of shares", 400)

        shares = int(shares)
        if not symbol:
            return apology("Must provide a symbol", 400)
        stock = lookup(symbol)
        if stock == None:
            return apology("Symbol does not exist", 400)
        if not shares:
            return apology("Invalid number of shares", 400)
        elif shares < 0:
            return apology("Invalid number of shares", 400)
        value = shares * stock["price"]
        user_id = session["user_id"]
        user_cash = dbfinance.execute("SELECT cash FROM users WHERE id = ?", user_id)
        cash = user_cash[0]["cash"]

        if cash < value:
            return apology("User don't have enough money")
        new_cash = cash - value
        dbfinance.execute("UPDATE users SET cash = ? WHERE id = ?", new_cash, user_id)

        date = datetime.now()

        dbfinance.execute("INSERT INTO transactions (user_id, symbol, shares, price, date) VALUES  (?,?,?,?,?)",
                          user_id, stock["symbol"], shares, stock["price"], date)
        action = "Bought"
        dbfinance.execute("UPDATE transactions SET action = ? WHERE user_id = ? AND symbol = ?",
                          action, user_id, symbol)
        flash("Bought!")
        return redirect("/cs50x/finance")
    return render_template("cs50/financebuy.html")


@app.route("/cs50x/finance/history")
@login_required
def history():
    user_id = session["user_id"]
    transactions = dbfinance.execute("SELECT * FROM transactions WHERE user_id = ?", user_id)

    for row in transactions:
        if not row["price"]:
            stock = lookup(row["symbol"])
            row["price"] = stock["price"]

        row["total"] = row["shares"] * row["price"]
        row["usd_price"] = usd(row["price"])
        row["usd_total"] = usd(row["total"])

    return render_template("cs50/financehistory.html", transactions=transactions)


@app.route("/cs50x/finance/login", methods=["GET", "POST"])
def login():
    session.clear()

    if request.method == "POST":
        if not request.form.get("username"):
            return apology("must provide username", 400)

        elif not request.form.get("password"):
            return apology("must provide password", 400)

        rows = dbfinance.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 400)

        session["user_id"] = rows[0]["id"]

        return redirect("/cs50x/finance")

    else:
        return render_template("cs50/financelogin.html")


@app.route("/cs50x/finance/logout")
def logout():
    session.clear()

    return redirect("/cs50x/finance")


@app.route("/cs50x/finance/quote", methods=["GET", "POST"])
@login_required
def quote():
    if request.method == "POST":
        symbol = request.form.get("symbol")
        if not symbol:
            return apology("Must provide a symbol", 400)
        stock = lookup(symbol)

        if stock == None:
            return apology("Symbol does not exist", 400)
        price = float("{:.2f}".format(float(stock["price"])))
        return render_template("cs50/financequoted.html", price=price, symbol=stock["symbol"])
    return render_template("cs50/financequote.html")


@app.route("/cs50x/finance/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            return apology("Must provide a username", 400)
        elif not password:
            return apology("Must provide a password", 400)
        elif not confirmation:
            return apology("Must provide a password again", 400)
        if password != confirmation:
            return apology("Both passwords must match", 400)

        existing_user = dbfinance.execute("SELECT * FROM users WHERE username = ?", username)

        if existing_user:
            return apology("Username already exists", 400)
        else:
            hashed_password = generate_password_hash(password)
            dbfinance.execute("INSERT INTO users (username, hash) VALUES(?, ?)",
                              username, hashed_password)
        return redirect("/cs50x/finance")
    else:
        return render_template("cs50/financeregister.html")


@app.route("/cs50x/finance/sell", methods=["GET", "POST"])
@login_required
def sell():
    if request.method == "POST":
        user_id = session["user_id"]
        symbol = request.form.get("symbol")
        shares = request.form.get("shares")

        user_shares = dbfinance.execute(
            "SELECT SUM(shares) FROM transactions WHERE user_id = ? AND symbol = ?", user_id, symbol)
        total_shares = user_shares[0]["SUM(shares)"]
        if not shares or not shares.isdigit():
            return apology("Invalid number of shares", 400)
        elif total_shares < int(shares):
            return apology("Invalid number of shares", 400)
        elif int(shares) <= 0:
            return apology("Invalid number of shares", 400)

        action = "Sold"
        dbfinance.execute("INSERT INTO transactions (user_id, symbol, shares, action) VALUES (?, ?, ?, ?)",
                          user_id, symbol, -int(shares), action)
        flash("Sold")
        return redirect("/cs50x/finance")
    elif request.method == "GET":
        user_id = session["user_id"]
        user_options = dbfinance.execute(
            "SELECT symbol FROM transactions WHERE user_id = ? GROUP BY symbol HAVING SUM(shares) > 0", user_id)

        return render_template("cs50/financesell.html", user_options=[row["symbol"] for row in user_options])

    return render_template("cs50/financesell.html")


@app.route("/cs50x/finance/addcash", methods=["GET", "POST"])
@login_required
def cash_in():
    if request.method == "POST":
        user_id = session["user_id"]
        username = request.form.get("username")
        cash_in = request.form.get("cash_in")

        id = dbfinance.execute("SELECT id FROM users WHERE username = ?", username)
        id = id[0]["id"]
        if id != user_id:
            return apology("Username mismatch", 400)

        if not cash_in or float(cash_in) <= 0:
            return apology("Invalid cash-in", 400)

        cash_before = dbfinance.execute("SELECT cash FROM users WHERE username = ?", username)
        cash_before = cash_before[0]["cash"]
        cash_after = cash_before + float(cash_in)

        dbfinance.execute("UPDATE users SET cash = ? WHERE username = ?", cash_after, username)
        flash("Successfully cash in")
        return redirect("/cs50x/finance")
    return render_template("cs50/financeaddcash.html")


@app.route("/cs50w/search")
def search():
    return render_template("cs50/search.html")


@app.route("/cs50w/imagesearch")
def imagesearch():
    return render_template("cs50/imagesearch.html")


@app.route("/cs50w/advancedsearch")
def advancedsearch():
    return render_template("cs50/advancedsearch.html")


@app.route("/cs50w/wiki")
def wiki():
    entries = util.list_entries()
    return render_template("cs50/wiki.html", entries=entries)


@app.route("/cs50w/wiki/<string:title>")
def page(title):
    entry = util.get_entry(title)
    if entry is None:
        return render_template('404.html'), 404
    content = markdown2.markdown(entry)
    return render_template("cs50/wikipage.html", content=content, title=title)


@app.route("/cs50w/wiki/search")
def result():
    query = request.args.get("q", "").strip()
    entries = util.list_entries()

    partial_matches = [entry for entry in entries if query.lower() in entry.lower()]

    if query in entries:
        return redirect(url_for("page", title=query))
    elif partial_matches:
        return render_template("cs50/wiki.html", entries=partial_matches)
    else:
        return render_template("cs50/wiki.html", entries=[])


@app.route("/cs50w/wiki/new", methods=["GET", "POST"])
def newpage():
    if request.method == "POST":
        title = request.form.get("title").strip()
        content = request.form.get("content").strip()
        filename = f"entries/{title}.md"

        if os.path.exists(filename):
            return "This page already exists!", 400

        util.save_entry(title, content)
        return redirect(url_for("page", title=title))

    return render_template("cs50/wikinewpage.html")


@app.route("/cs50w/wiki/<string:title>/edit", methods=["GET", "POST"])
def editpage(title):
    if request.method == "POST":
        content = request.form.get("content")
        util.save_entry(title, content)
        return redirect(url_for("page", title=title))

    entry = util.get_entry(title)
    if entry is None:
        return render_template('404.html'), 404

    return render_template("cs50/wikiedit.html", title=title, content=entry)


@app.route("/cs50w/wiki/random")
def randompage():
    entries = util.list_entries()
    if entries:
        title = random.choice(entries)
        return redirect(url_for("page", title=title))
    return render_template('404.html'), 404
