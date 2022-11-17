import sys
import csv


def main():

    # Check for command-line usage
    if len(sys.argv) != 3:
        print("Incorrect usage")

    # Read database file into a variable
    givenSequences = {}                         # Define a dicrtionary we are going to use later
    with open(sys.argv[1], 'r') as database_file:
        database = csv.reader(database_file)
        for row in database:
            header = row
            header.pop(0)                           # Delete "name" from the list
            for item in header:
                givenSequences[item] = 0
            break                                   # Do this one time just for the first row, to get the given sequences

    # Read DNA sequence file into a variable
    with open(sys.argv[2], 'r') as sequence_file:       # Create a variable., in which we store the sequence of nucleotides
        sequence = sequence_file.read()

    # Find longest match of each STR in DNA sequence
    for key in givenSequences:                                      # For every key, store in the dictionary its longest count
        longest = longest_match(sequence, key)
        givenSequences[key] = longest

    # Check database for matching profiles
    with open(sys.argv[1], 'r') as profiles_file:           # Create dictionary with profiles: names and STR counts
        profiles = csv.DictReader(profiles_file)
        for person in profiles:                             # Iterate through every person in the dictionary
            match = 0
            for key in givenSequences:                              # Iterate through every sequence given
                if int(person[key]) == givenSequences[key]:
                    match += 1                                      # Counter for matching STRs
            if match == len(givenSequences):                        # If number of matching STRs == to number of given sequences
                print(person["name"])                                       # we found a match, so print the name AND EXIT
                exit(0)
        print("No match")                                       # If in the end we have not found a match, print "No match"


def longest_match(sequence, subsequence):
    """Returns length of longest run of subsequence in sequence."""

    # Initialize variables
    longest_run = 0
    subsequence_length = len(subsequence)
    sequence_length = len(sequence)

    # Check each character in sequence for most consecutive runs of subsequence
    for i in range(sequence_length):

        # Initialize count of consecutive runs
        count = 0

        # Check for a subsequence match in a "substring" (a subset of characters) within sequence
        # If a match, move substring to next potential match in sequence
        # Continue moving substring and checking for matches until out of consecutive matches
        while True:

            # Adjust substring start and end
            start = i + count * subsequence_length
            end = start + subsequence_length

            # If there is a match in the substring
            if sequence[start:end] == subsequence:
                count += 1

            # If there is no match in the substring
            else:
                break

        # Update most consecutive matches found
        longest_run = max(longest_run, count)

    # After checking for runs at each character in seqeuence, return longest run found
    return longest_run


main()
