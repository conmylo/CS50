import cs50

text = cs50.get_string("Text: ")

letters = 0
words = 0
sentences = 0

# Calculate letters, words and sentences
for char in text:
    if char.isalpha():
        letters += 1
    if char.isspace():
        words += 1
    if char in ['!', '?', '.']:
        sentences += 1
words += 1

# Calculate L and S
L = letters * 100 / words
S = sentences * 100 / words

index = 0.0588 * L - 0.296 * S - 15.8

# Round index into a whole number
index = round(index)

# Print index
if index < 1:
    print("Before Grade 1")
elif index > 0 and index < 16:
    print("Grade ", index)
elif index > 16:
    print("Grade 16+")