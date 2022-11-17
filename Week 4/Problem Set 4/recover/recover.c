#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

typedef uint8_t BYTE;

void checkArgNumber(int argc);
void checkFileExists(FILE *file);
int isJPEG(BYTE buffer[]);

int main(int argc, char *argv[])
{
    checkArgNumber(argc);                   //calls function to check argument number
    FILE *raw = fopen(argv[1], "r");        //creates file to read given file (raw)
    checkFileExists(raw);                   //calls function to check if file exists

    BYTE buffer[512];
    char filename[10];
    FILE *img;
    int file_counter = 0;

    while (fread(buffer, 1, 512, raw) == 512)       //repeat until the end of file
    {
        if (isJPEG(buffer) == 1)
        {
            if (file_counter != 0)
            {
                fclose(img);
            }
            sprintf(filename, "%03i.jpg", file_counter++);
            img = fopen(filename, "w");
            fwrite(buffer, 512, 1, img);
        }
        else if (file_counter > 0)
        {
            fwrite(buffer, 1, 512, img);
        }
    }
}

void checkArgNumber(int argc)           //function thats checks the argument number given, in order to remind of correct usage
{
    if (argc != 2)
    {
        printf("Usage: ./recover IMAGE\n");
        exit(1);
    }
}

void checkFileExists(FILE *file)        //function that checks if the file exists == file not NULL
{
    if (file == NULL)
    {
        printf("File does not exist\n");
        exit(1);
    }
}

int isJPEG(BYTE buffer[])       //function that checks if the block is the beginning of a JPEG file
{
    if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}