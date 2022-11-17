#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <math.h>

int count_letters(string text);
int count_words(string text);
int count_sentences(string text);
float letters = 0;
float words = 0;
float sentences = 0;
float L = 0;
float S = 0;
float index = 0;

int main(void)
{
    string text = get_string("Text: ");
    count_letters(text);
    count_words(text);
    count_sentences(text);
    L = letters * 100 / words;
    S = sentences * 100 / words;
    index = 0.0588 * L - 0.296 * S - 15.8;          //calculate index
    int i = round(index);
    if (i < 1)              //prints grade if index < 1
    {
        printf("Before Grade 1\n");
    }
    else if (i > 16)            //prints grade if index > 16
    {
        printf("Grade 16+\n");
    }
    else                    //prints grade if 1 < index < 16cd
    {
        printf("Grade %i\n", i);
    }
}

int count_letters(string text)          //counts letters
{
    for (int i = 0, len = strlen(text); i < len; i++)
    {
        if (isalpha(text[i]))                //checks if text is alphabetical
        {
            letters++;
        }
    }
    return letters;
}

int count_words(string text)            //counts words
{
    for (int i = 0, len = strlen(text); i < len; i++)
    {
        if (isspace(text[i]))
        {
            words++;
        }
    }
    words++;
    return words;
}

int count_sentences(string text)            //counts sentences
{
    for (int i = 0, len = strlen(text); i < len; i++)
    {
        if (text[i] == '.' || text[i] == '?' || text[i] == '!')
        {
            sentences++;
        }
    }
    return sentences;
}