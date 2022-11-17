import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

from datetime import datetime, timezone

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")

# Make sure API key is set
if not os.environ.get("API_KEY"):
    raise RuntimeError("API_KEY not set")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    portfolio_symbols = db.execute("SELECT shares, symbol FROM portfolio WHERE id = :id", id=session["user_id"])

    # create a temporary variable to store TOTAL worth ( cash + share)
    total_cash = 0

    # update each symbol prices and total
    for portfolio_symbol in portfolio_symbols:
        symbol = portfolio_symbol["symbol"]
        shares = portfolio_symbol["shares"]
        stock = lookup(symbol)
        total = shares * stock["price"]
        total_cash += total
        db.execute("UPDATE portfolio SET price=:price, total=:total WHERE id=:id AND symbol=:symbol",
                   price=usd(stock["price"]), total=usd(total), id=session["user_id"], symbol=symbol)

    # update user's cash in portfolio
    updated_cash = db.execute("SELECT cash FROM users WHERE id=:id", id=session["user_id"])

    # update total cash -> cash + shares worth
    total_cash += updated_cash[0]["cash"]

    # print portfolio in index homepage
    updated_portfolio = db.execute("SELECT * from portfolio WHERE id=:id", id=session["user_id"])

    return render_template("index.html", stocks=updated_portfolio, cash=usd(updated_cash[0]["cash"]), total=usd(total_cash))


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock."""

    if request.method == "GET":
        return render_template("buy.html")

    else:
        # make sure the symbol exists
        stock = lookup(request.form.get("symbol"))
        if not stock:
            return apology("Invalid Symbol")

        # make sure the number of shares is positive integer
        try:
            shares = int(request.form.get("shares"))
            if shares < 0:
                return apology("Shares must be positive integer")
        except:
            return apology("Shares must be positive integer")

        # select user's cash
        money = db.execute("SELECT cash FROM users WHERE id = :id", id=session["user_id"])

        # check if the user has enough money to buy shares
        if not money or float(money[0]["cash"]) < stock["price"] * shares:
            return apology("Not enough money")

        # update transactions table
        db.execute("INSERT INTO transactions (symbol, shares, price, user_id, time) VALUES(:symbol, :shares, :price, :user_id, :time)",
                   symbol=stock["symbol"], shares=shares, price=usd(stock["price"]), user_id=session["user_id"], time=datetime.now())

        # update user cash
        db.execute("UPDATE users SET cash = cash - :purchase WHERE id = :id",
                   id=session["user_id"], purchase=stock["price"] * float(shares))

        # select user shares of that symbol
        user_shares = db.execute("SELECT shares FROM portfolio WHERE id = :id AND symbol=:symbol",
                                 id=session["user_id"], symbol=stock["symbol"])

        # if user does not have shares of that symbol, create new stock
        if not user_shares:
            db.execute("INSERT INTO portfolio (name, shares, price, total, symbol, id) VALUES(:name, :shares, :price, :total, :symbol, :id)",
                       name=stock["name"], shares=shares, price=usd(stock["price"]), total=usd(shares * stock["price"]), symbol=stock["symbol"], id=session["user_id"])

        # else increment the shares count
        else:
            shares_total = user_shares[0]["shares"] + shares
            db.execute("UPDATE portfolio SET shares=:shares WHERE id=:id AND symbol=:symbol",
                       shares=shares_total, id=session["user_id"], symbol=stock["symbol"])

    return redirect("/")


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""

    # choose from transactions table the transactions of the current user
    transactions = db.execute("SELECT * FROM transactions WHERE user_id= :user_id", user_id=session["user_id"])

    return render_template("history.html", transactions=transactions)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""

    # User reached route via GET (as by clicking a link or via redirect)
    if request.method == "GET":
        return render_template("/quote.html")

    result = lookup(request.form.get("symbol"))

    # If the stock symbol does not exist, return apology, else return the results
    if not result:
        return apology("Invalid stock symbol", 400)
    return render_template("/quoted.html", name=result["name"], price=usd(result["price"]), symbol=result["symbol"])


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    # User reached route via GET (as by clicking a link or via redirect)
    if request.method == "GET":
        return render_template("/register.html")

    # Check registration form
    if not request.form.get("username"):
        return apology("Must provide username", 400)
    if len(db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))) != 0:
        return apology("Invalid username: already exists", 400)
    if not request.form.get("password"):
        return apology("Must provide password", 400)
    if not request.form.get("confirmation"):
        return apology("Must provide confirmation", 400)
    if request.form.get("password") != request.form.get("confirmation"):
        return apology("Passwords do not match!", 400)

    # Store hashed password into a variable
    user_hash = generate_password_hash(request.form.get("password"))

    # Add new user in users database
    db.execute("INSERT INTO users(username, hash) VALUES(?, ?)", request.form.get("username"), user_hash)

    # Query database for user
    rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

    # Log user in
    session["user_id"] = rows[0]["id"]

    # Redirect to homepage
    return redirect("/")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""

    if request.method == "GET":
        return render_template("sell.html")

    else:
        stock = lookup(request.form.get("symbol"))
        if not stock:
            return apology("Invalid symbol!")

    shares = int(request.form.get("shares"))
    if shares < 0:
        return apology("Shares must be positive integer")

    # select user's shares
    user_shares = db.execute("SELECT shares FROM portfolio WHERE id = :id AND symbol=:symbol",
                             id=session["user_id"], symbol=stock["symbol"])

    if not user_shares or int(user_shares[0]["shares"]) < shares:
        return apology("Not enough shares")

    # update transactions
    db.execute("INSERT INTO transactions (symbol, shares, price, user_id, time) VALUES(:symbol, :shares, :price, :user_id, :time)",
               symbol=stock["symbol"], shares=-shares, price=usd(stock["price"]), user_id=session["user_id"], time=datetime.now())

    # update user's cash
    db.execute("UPDATE users SET cash = cash + :purchase WHERE id = :id",
               id=session["user_id"], purchase=stock["price"] * float(shares))

    # update total number of shares
    shares_total = user_shares[0]["shares"] - shares

    # delete from portfolio in database if final shares are zero
    if shares_total == 0:
        db.execute("DELETE FROM portfolio WHERE id=:id AND symbol=:symbol", id=session["user_id"], symbol=stock["symbol"])

    # else, update portfolio shares
    else:
        db.execute("UPDATE portfolio SET shares=:shares WHERE id=:id AND symbol=:symbol",
                   shares=shares_total, id=session["user_id"], symbol=stock["symbol"])

    # Redirect to homepage
    return redirect("/")


@app.route("/addmoney", methods=["GET", "POST"])
@login_required
def addmoney():
    """Add money to an account"""
    if request.method == "GET":
        return render_template("addmoney.html")

    else:
        money_added = int(request.form.get("money"))
        # check if money is a positive number
        if money_added < 0:
            return apology("Please insert a positive number")
        # update cash balance of user in the database
        db.execute("UPDATE users SET cash= cash + :money_added WHERE id= :id", money_added=money_added, id=session["user_id"])

    return redirect("/")