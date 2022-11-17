#include <cs50.h>
#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include <string.h>

bool only_digits(string s);
char rotate(char c, int n);

int main(int argc, string argv[])
{
    int ciphertext[10];
    if (argc != 2)          //if I don't get a key
    {
        printf("Usage: ./ceasar key\n");
        return 1;
    }
    else if (argc == 2)
    {
        int key = atoi(argv[1]);
        if (only_digits(argv[1]))           //if the key is digit
        {
            string plaintext = get_string("plaintext: ");
            printf("ciphertext:");
            for (int i = 0, len = strlen(plaintext); i < len; i++)
            {
                ciphertext[i] = rotate(plaintext[i], key);
                printf("%c", ciphertext[i]);                //print ciphertext
            }
            printf("\n");
            return 0;
        }
        else                //if the key is not digit
        {
            printf("Usage: ./ceasar key\n");
            return 1;
        }
    }
}

bool only_digits(string s)          //checks if I have only digits
{
    int ctr = 0;
    for (int i = 0; i < strlen(s); i++)
    {
        if (isdigit(s[i]))
        {
            ctr++;
        }
    }
    if (ctr == strlen(s))
    {
        return true;
    }
    else
    {
        return false;
    }
}

char rotate(char c, int n)          //rotates plaintext
{
    if (isalpha(c))
    {
        if (isupper(c))             //if it uppercase letter
        {
            c = (c - 'A' + n) % 26 + 'A';
            return c;
        }
        else if (islower(c))            //if it is lowercase letter
        {
            c = (c - 'a' + n) % 26 + 'a';
            return c;
        }
    }
    else
    {
        return c;
    }
    return c;
}