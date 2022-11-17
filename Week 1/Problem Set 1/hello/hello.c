#include <stdio.h>
#include <cs50.h>

int main(void)
{
    string name = get_string("What's your name? ");     //prompts user to give name
    printf("hello, %s\n", name);                        //gives back hello with name
}