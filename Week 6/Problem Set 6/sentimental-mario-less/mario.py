import cs50

# Asks for height until it gets a valid integer
while True:
    height = cs50.get_int("Give height: ")
    if height > 0 and height <= 8:
        break

# Prints pyramid
for i in range(height):
    print(" " * (height - i - 1), end="")
    print("#" * (i + 1))
