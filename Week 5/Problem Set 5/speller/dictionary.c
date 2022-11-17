// Implements a dictionary's functionality

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <cs50.h>

#include "dictionary.h"

// Represents a node in a hash table
typedef struct node
{
    char word[LENGTH + 1];
    struct node *next;
}
node;

// TODO: Choose number of buckets in hash table
const unsigned int N = 677;     //Using the first 2 characters of each word for hushing, so we have (26 * 26) + 1 = 677 buckets

// Hash table
int numberOfWords = 0;
node *table[N];

// Returns true if word is in dictionary, else false
bool check(const char *word)
{
    //Hash word to obtain value
    int index = hash(word);

    //Access linked list at that index in the hash table
    node *cursor = table[index];

    //Traverse linked list, looking for the word using strcasecmp
    while (cursor != NULL)
    {
        if (strcasecmp(cursor->word, word) == 0)        //if I find the word, return true
        {
            return true;
        }
        cursor = cursor->next;
    }
    return false;               //if I don't find the word
}

// Hashes word to a number
unsigned int hash(const char *word)
{
    //Hash function
    //Converting all characters to lower case in order to subtract lower case "a" ASCII value and get a number
    int hash_value = 0;
    if (strlen(word) == 0)                              //if the word array is empty return 0 as hash value
    {
        return hash_value;
    }
    else if (strlen(word) == 1)                         //if I have only 1 character
    {
        if (isalpha(word[0]))                           //if the 1 character is letter
        {
            hash_value = 26 * (tolower(word[0]) - 'a') + 1;
            return hash_value;
        }
        else                     //if the 1 character is apostrophy
        {
            return hash_value;
        }
    }
    else if (strlen(word) >= 2)                         //if I have 2 or more characters
    {
        if (isalpha(word[0]))                           //if the first character is letter
        {
            if (isalpha(word[1]))                       //if the second character is letter
            {
                hash_value = 26 * (tolower(word[0]) - 'a') + (tolower(word[1]) - 'a') + 1;
                return hash_value;
            }
            else                      //if the second character is apostrophy
            {
                hash_value = 26 * (tolower(word[0]) - 'a') + 1;
                return hash_value;
            }
        }
        else if (!isalpha(word[0]))                      //if the first character is apostrophy
        {
            if (isalpha(word[1]))                   //if the second character is letter
            {
                hash_value = tolower(word[1] - 'a') + 1;
                return hash_value;
            }
            else if (!isalpha(word[1]))                  //if the second character is apostrophy
            {
                return hash_value;
            }
        }
    }
    return hash_value;
}

// Loads dictionary into memory, returning true if successful, else false
bool load(const char *dictionary)
{
    // Open dictionary
    FILE *file = fopen(dictionary, "r");
    if (file == NULL)
    {
        return false;
    }

    //Read strings from file one at a time
    char word[LENGTH + 1];          //Length = 45 defined
    while (fscanf(file, "%s", word) != EOF)
    {
        //Create new node for each word
        node *n = malloc(sizeof(node));
        if (n == NULL)
        {
            return false;
        }

        strcpy(n->word, word);
        n->next = NULL;

        //Hash word to obtain a hash value
        int index = hash(word);             //calling hash function, returns an integer which is the index of the table
        if (table[index] == NULL)
        {
            table[index] = n;
        }
        else
        {
            n->next = table[index];     //first we assign the pointer of the new node to the first element of the linked list
            table[index] = n;           //then we set head to be the new node we have created
        }
        numberOfWords++;            //counter for words to be used in size function
    }
    fclose(file);
    return true;
}

// Returns number of words in dictionary if loaded, else 0 if not yet loaded
unsigned int size(void)
{
    return numberOfWords;           //if it is empty, it will return 0, because it is initialized at 0
}

// Unloads dictionary from memory, returning true if successful, else false
bool unload(void)
{
    //loop for every linked list
    for (int i = 0; i < N; i++)
    {
        node *head = table[i];
        node *cursor = head;
        node *tmp = head;
        while (cursor != NULL)
        {
            cursor = cursor->next;
            free(tmp);
            tmp = cursor;
        }
    }
    return true;
}
