#include <stdio.h>
#include <cs50.h>

int main(void)
{
    int height = 0;
    //checks if height is between 1 and 8 inclusive. If not, prompts the user to give a correct height between these values.
    do
    {
        height = get_int("Height: ");
    }
    while (height <= 0 || height > 8);
    //If the height is correct, it creates the pyramid
    for (int i = 0; i < height; i++)        //counts the rows
    {
        for (int k = 1; k < height - i; k++)        //counts the columns
        {
            printf(" ");
        }
        for (int j = 0; j <= i; j++)
        {
            printf("#");
        }
        printf("\n");
    }
}