import cs50

while True:
    change = cs50.get_float("Change owed: ")
    if change >= 0:
        break

# Since the computer does math with bits, some results are not precise, like 1.0 / 0.25 is 3.999987 and not 4, so we need this step
change = change * 100

# Calculate quarters and update change
quarters = change // 25
change = change % 25

# Calculate dimes and update change
dimes = change // 10
change = change % 10

# Calculate nickels and update change
nickels = change // 5
change = change % 5

# Calculate pennies and update change
pennies = change // 1
change = change % 1

coins = quarters + dimes + nickels + pennies

print(int(coins))