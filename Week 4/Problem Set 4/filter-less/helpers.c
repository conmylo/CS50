#include "helpers.h"
#include <math.h>

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])           //greyscale filter
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int average = round((image[i][j].rgbtRed + image[i][j].rgbtGreen + image[i][j].rgbtBlue) / 3.0);
            image[i][j].rgbtRed = average;
            image[i][j].rgbtGreen = average;
            image[i][j].rgbtBlue = average;
        }
    }
    return;
}

// Convert image to sepia
void sepia(int height, int width, RGBTRIPLE image[height][width])           //sepia filter
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)     //loop with colors function given
        {
            int sepiaRed = round(.393 * image[i][j].rgbtRed + .769 * image[i][j].rgbtGreen + .189 * image[i][j].rgbtBlue);
            int sepiaGreen = round(.349 * image[i][j].rgbtRed + .686 * image[i][j].rgbtGreen + .168 * image[i][j].rgbtBlue);
            int sepiaBlue = round(.272 * image[i][j].rgbtRed + .534 * image[i][j].rgbtGreen + .131 * image[i][j].rgbtBlue);
            if (sepiaRed < 0)               //if exceeding bounds
            {
                sepiaRed = 0;
            }
            if (sepiaRed > 255)
            {
                sepiaRed = 255;
            }
            if (sepiaGreen < 0)
            {
                sepiaGreen = 0;
            }
            if (sepiaGreen > 255)
            {
                sepiaGreen = 255;
            }
            if (sepiaBlue < 0)
            {
                sepiaBlue = 0;
            }
            if (sepiaBlue > 255)
            {
                sepiaBlue = 255;
            }
            image[i][j].rgbtRed = sepiaRed;
            image[i][j].rgbtGreen = sepiaGreen;
            image[i][j].rgbtBlue = sepiaBlue;
        }
    }
    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])         //reflect filter
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width / 2; j++)
        {
            RGBTRIPLE temp = image[i][j];               //uses swap function to swap pixels
            image[i][j] = image[i][width - 1 - j];
            image[i][width - 1 - j] = temp;
        }
    }
    return;
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])            //blur filter
{
    RGBTRIPLE copy[height][width];
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            copy[i][j] = image[i][j];
        }
    }
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {

//Center pixel
            if (i > 0 && i < height && j > 0 && j < width)
            {
                int averageRed = round((copy[i - 1][j - 1].rgbtRed + copy[i - 1][j].rgbtRed + copy[i - 1][j + 1].rgbtRed + copy[i][j - 1].rgbtRed +
                                        copy[i][j].rgbtRed + copy[i][j + 1].rgbtRed + copy[i + 1][j - 1].rgbtRed + copy[i + 1][j].rgbtRed + copy[i
                                                + 1][j + 1].rgbtRed) / 9.0);
                int averageGreen = round((copy[i - 1][j - 1].rgbtGreen + copy[i - 1][j].rgbtGreen + copy[i - 1][j + 1].rgbtGreen + copy[i][j -
                                          1].rgbtGreen + copy[i][j].rgbtGreen + copy[i][j + 1].rgbtGreen + copy[i + 1][j - 1].rgbtGreen + copy[i + 1][j].rgbtGreen + copy[i +
                                                  1][j + 1].rgbtGreen) / 9.0);
                int averageBlue = round((copy[i - 1][j - 1].rgbtBlue + copy[i - 1][j].rgbtBlue + copy[i - 1][j + 1].rgbtBlue + copy[i][j -
                                         1].rgbtBlue + copy[i][j].rgbtBlue + copy[i][j + 1].rgbtBlue + copy[i + 1][j - 1].rgbtBlue + copy[i + 1][j
                                                                                                                                                ].rgbtBlue + copy[i + 1][j + 1].rgbtBlue) / 9.0);
                image[i][j].rgbtRed = averageRed;
                image[i][j].rgbtGreen = averageGreen;
                image[i][j].rgbtBlue = averageBlue;
            }

//Edge pixel
            if (i == 0 && j > 0 && j < width)       //upper edge
            {
                int averageRed = round((copy[i][j - 1].rgbtRed + copy[i][j].rgbtRed + copy[i][j + 1].rgbtRed + copy[i + 1][j - 1].rgbtRed + copy[i +
                                        1][j].rgbtRed + copy[i + 1][j + 1].rgbtRed) / 6.0);
                int averageGreen = round((copy[i][j - 1].rgbtGreen + copy[i][j].rgbtGreen + copy[i][j + 1].rgbtGreen +
                                          copy[i + 1][j - 1].rgbtGreen + copy[i + 1][j].rgbtGreen + copy[i + 1][j + 1].rgbtGreen) / 6.0);
                int averageBlue = round((copy[i][j - 1].rgbtBlue + copy[i][j].rgbtBlue + copy[i][j + 1].rgbtBlue +
                                         copy[i + 1][j - 1].rgbtBlue + copy[i + 1][j].rgbtBlue + copy[i + 1][j + 1].rgbtBlue) / 6.0);
                image[i][j].rgbtRed = averageRed;
                image[i][j].rgbtGreen = averageGreen;
                image[i][j].rgbtBlue = averageBlue;
            }
            if (i == height - 1 && j > 0 && j < width)          //lower edge
            {
                int averageRed = round((copy[i - 1][j - 1].rgbtRed + copy[i - 1][j].rgbtRed + copy[i - 1][j + 1].rgbtRed + copy[i][j - 1].rgbtRed +
                                        copy[i][j].rgbtRed + copy[i][j + 1].rgbtRed) / 6.0);
                int averageGreen = round((copy[i - 1][j - 1].rgbtGreen + copy[i - 1][j].rgbtGreen + copy[i - 1][j + 1].rgbtGreen + copy[i][j -
                                          1].rgbtGreen + copy[i][j].rgbtGreen + copy[i][j + 1].rgbtGreen) / 6.0);
                int averageBlue = round((copy[i - 1][j - 1].rgbtBlue + copy[i - 1][j].rgbtBlue + copy[i - 1][j + 1].rgbtBlue + copy[i][j -
                                         1].rgbtBlue + copy[i][j].rgbtBlue + copy[i][j + 1].rgbtBlue) / 6.0);
                image[i][j].rgbtRed = averageRed;
                image[i][j].rgbtGreen = averageGreen;
                image[i][j].rgbtBlue = averageBlue;
            }
            if (i > 0 && i < height && j == 0)          //left edge
            {
                int averageRed = round((copy[i - 1][j].rgbtRed + copy[i - 1][j + 1].rgbtRed + copy[i][j].rgbtRed + copy[i][j + 1].rgbtRed + copy[i +
                                        1][j].rgbtRed + copy[i + 1][j + 1].rgbtRed) / 6.0);
                int averageGreen = round((copy[i - 1][j].rgbtGreen + copy[i - 1][j + 1].rgbtGreen + copy[i][j].rgbtGreen +
                                          copy[i][j + 1].rgbtGreen + copy[i + 1][j].rgbtGreen + copy[i + 1][j + 1].rgbtGreen) / 6.0);
                int averageBlue = round((copy[i - 1][j].rgbtBlue + copy[i - 1][j + 1].rgbtBlue + copy[i][j].rgbtBlue + copy[i][j + 1].rgbtBlue +
                                         copy[i + 1][j].rgbtBlue + copy[i + 1][j + 1].rgbtBlue) / 6.0);
                image[i][j].rgbtRed = averageRed;
                image[i][j].rgbtGreen = averageGreen;
                image[i][j].rgbtBlue = averageBlue;
            }
            if (i > 0 && i < height && j == width - 1)          //right edge
            {
                int averageRed = round((copy[i - 1][j - 1].rgbtRed + copy[i - 1][j].rgbtRed + copy[i][j - 1].rgbtRed + copy[i][j].rgbtRed + copy[i +
                                        1][j - 1].rgbtRed + copy[i + 1][j].rgbtRed) / 6.0);
                int averageGreen = round((copy[i - 1][j - 1].rgbtGreen + copy[i - 1][j].rgbtGreen + copy[i][j - 1].rgbtGreen +
                                          copy[i][j].rgbtGreen + copy[i + 1][j - 1].rgbtGreen + copy[i + 1][j].rgbtGreen) / 6.0);
                int averageBlue = round((copy[i - 1][j - 1].rgbtBlue + copy[i - 1][j].rgbtBlue + copy[i][j - 1].rgbtBlue + copy[i][j].rgbtBlue +
                                         copy[i + 1][j - 1].rgbtBlue + copy[i + 1][j].rgbtBlue) / 6.0);
                image[i][j].rgbtRed = averageRed;
                image[i][j].rgbtGreen = averageGreen;
                image[i][j].rgbtBlue = averageBlue;
            }

//Corner pixel
            if (i == 0 && j == 0)           //top left
            {
                int averageRed = round((copy[i][j].rgbtRed + copy[i][j + 1].rgbtRed + copy[i + 1][j].rgbtRed + copy[i + 1][j + 1].rgbtRed) / 4.0);
                int averageGreen = round((copy[i][j].rgbtGreen + copy[i][j + 1].rgbtGreen + copy[i + 1][j].rgbtGreen + copy[i + 1][j +
                                          1].rgbtGreen) / 4.0);
                int averageBlue = round((copy[i][j].rgbtBlue + copy[i][j + 1].rgbtBlue + copy[i + 1][j].rgbtBlue + copy[i + 1][j + 1].rgbtBlue) /
                                        4.0);
                image[i][j].rgbtRed = averageRed;
                image[i][j].rgbtGreen = averageGreen;
                image[i][j].rgbtBlue = averageBlue;
            }
            if (i == 0 && j == width - 1)           //top right
            {
                int averageRed = round((copy[i][j - 1].rgbtRed + copy[i][j].rgbtRed + copy[i + 1][j - 1].rgbtRed + copy[i + 1][j].rgbtRed) / 4.0);
                int averageGreen = round((copy[i][j - 1].rgbtGreen + copy[i][j].rgbtGreen + copy[i + 1][j - 1].rgbtGreen + copy[i +
                                          1][j].rgbtGreen) / 4.0);
                int averageBlue = round((copy[i][j - 1].rgbtBlue + copy[i][j].rgbtBlue + copy[i + 1][j - 1].rgbtBlue + copy[i + 1][j].rgbtBlue) /
                                        4.0);
                image[i][j].rgbtRed = averageRed;
                image[i][j].rgbtGreen = averageGreen;
                image[i][j].rgbtBlue = averageBlue;
            }
            if (i == height - 1 && j == 0)          //bottom left
            {
                int averageRed = round((copy[i - 1][j].rgbtRed + copy[i - 1][j + 1].rgbtRed + copy[i][j].rgbtRed + copy[i][j + 1].rgbtRed) / 4.0);
                int averageGreen = round((copy[i - 1][j].rgbtGreen + copy[i - 1][j + 1].rgbtGreen + copy[i][j].rgbtGreen + copy[i][j +
                                          1].rgbtGreen) / 4.0);
                int averageBlue = round((copy[i - 1][j].rgbtBlue + copy[i - 1][j + 1].rgbtBlue + copy[i][j].rgbtBlue + copy[i][j + 1].rgbtBlue) /
                                        4.0);
                image[i][j].rgbtRed = averageRed;
                image[i][j].rgbtGreen = averageGreen;
                image[i][j].rgbtBlue = averageBlue;
            }
            if (i == height - 1 && j == width - 1)          //bottom right
            {
                int averageRed = round((copy[i - 1][j - 1].rgbtRed + copy[i - 1][j].rgbtRed + copy[i][j - 1].rgbtRed + copy[i][j].rgbtRed) / 4.0);
                int averageGreen = round((copy[i - 1][j - 1].rgbtGreen + copy[i - 1][j].rgbtGreen + copy[i][j - 1].rgbtGreen +
                                          copy[i][j].rgbtGreen) / 4.0);
                int averageBlue = round((copy[i - 1][j - 1].rgbtBlue + copy[i - 1][j].rgbtBlue + copy[i][j - 1].rgbtBlue + copy[i][j].rgbtBlue) /
                                        4.0);
                image[i][j].rgbtRed = averageRed;
                image[i][j].rgbtGreen = averageGreen;
                image[i][j].rgbtBlue = averageBlue;
            }
        }
    }
    return;
}
